import React from 'react';

interface Props { data: any }

// Helper to safely extract a numeric count from various shapes
const getCount = (obj: any) => {
  if (obj == null) return undefined;
  if (typeof obj === 'number') return obj;
  if (typeof obj === 'string') {
    const n = Number(obj);
    return Number.isNaN(n) ? undefined : n;
  }
  if (typeof obj === 'object') {
    if (obj.count != null) return obj.count;
    if (obj.value != null) return obj.value;
  }
  return undefined;
};

export const HelpdeskSnapshotCard: React.FC<Props> = ({ data }) => {
  // API returns { success: true, data: { title, subtitle, snapshot: {...}, average_customer_rating: {...} } }
  const root = data?.data ?? data ?? {};
  const snapshot = root.snapshot ?? undefined;

  // Backward-compatible summary (older/alternate shapes)
  const summary = root.summary ?? root;

  // Prefer the new snapshot shape; fallback to older flat summary keys
  const totalTickets = getCount(snapshot?.total_tickets) ?? getCount(summary.total_tickets) ?? '-';
  const openTickets = getCount(snapshot?.open_tickets) ?? summary.total_open ?? summary.open_tickets ?? '-';
  const closedTickets = getCount(snapshot?.closed_tickets) ?? summary.total_closed ?? summary.closed_tickets ?? '-';
  const wipTickets = getCount(snapshot?.wip_tickets) ?? summary.total_wip ?? summary.wip_tickets; // optional
  const fmTickets = getCount(snapshot?.fm_tickets);
  const customerTickets = getCount(snapshot?.customer_tickets);
  const avgCustomerRating = root.average_customer_rating?.rating ?? snapshot?.average_customer_rating?.rating ?? undefined;
  const avgResponseTat = summary.avg_response_tat ?? root.avg_response_tat;
  const avgResolutionTat = summary.avg_resolution_tat ?? root.avg_resolution_tat;

  // Build items dynamically so we show what's available and useful
  const items: Array<{ label: string; value: React.ReactNode }> = [];
  items.push({ label: 'Total Tickets', value: totalTickets });
  items.push({ label: 'Open Tickets', value: openTickets });
  items.push({ label: 'Closed Tickets', value: closedTickets });
  if (typeof wipTickets !== 'undefined') items.push({ label: 'WIP Tickets', value: wipTickets });
  if (typeof fmTickets !== 'undefined') items.push({ label: 'FM Tickets', value: fmTickets });
  if (typeof customerTickets !== 'undefined') items.push({ label: 'Customer Tickets', value: customerTickets });
  if (typeof avgCustomerRating !== 'undefined') items.push({ label: 'Avg Customer Rating', value: Number(avgCustomerRating).toFixed(1) });
  if (typeof avgResponseTat !== 'undefined') items.push({ label: 'Avg Response TAT', value: avgResponseTat });
  if (typeof avgResolutionTat !== 'undefined') items.push({ label: 'Avg Resolution TAT', value: avgResolutionTat });

  const title = root.title && root.subtitle ? `${root.title} - ${root.subtitle}` : 'Helpdesk Snapshot';

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4">
      <h3 className="font-semibold text-base mb-4">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.label} className="bg-[#F6F4EE] rounded p-3 text-center">
            <div className="text-2xl font-bold text-black">{it.value}</div>
            <div className="text-xs text-gray-600 mt-1">{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpdeskSnapshotCard;
