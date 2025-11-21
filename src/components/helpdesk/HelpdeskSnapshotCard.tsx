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
      <h3
        className="mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3"
        style={{
          fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '100%',
          letterSpacing: '0%'
        }}
      >
        {title}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((it) => {
          const labelText = String(it.label || "");
          const isOpen = /open/i.test(labelText);
          const isClosed = /closed/i.test(labelText);

          // color classes are handled by Tailwind; exact typography is applied inline to match design
          const valueColorClass = isOpen ? "text-red-600" : isClosed ? "text-green-600" : "text-black";

          const labelClass = `mt-1 text-black`;

          // compute percentage only for Total Tickets, Open Tickets, Closed Tickets
          const showPercent = /^(total tickets|open tickets|closed tickets)$/i.test(labelText);
          const totalCountNum = Number(totalTickets);
          const itemValueNum = Number(it.value);
          let percentText: string | null = null;
          if (showPercent && Number.isFinite(totalCountNum) && totalCountNum > 0 && Number.isFinite(itemValueNum)) {
            // For Total Tickets, show 100% explicitly
            if (/^total tickets$/i.test(labelText)) {
              percentText = '100%';
            } else {
              const pct = (itemValueNum / totalCountNum) * 100;
              // format with up to 2 decimals, trim trailing zeros
              const s = pct.toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
              percentText = `${s}%`;
            }
          }

          return (
            <div key={it.label} className="bg-[#F6F4EE] rounded px-4 py-6 text-center flex flex-col items-center justify-center">
              <div
                className={valueColorClass}
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 700,
                  fontSize: '24px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                }}
              >
                {it.value}
              </div>

              {/* Reserve the percentage row for layout consistency. Show percent when available, otherwise an empty line */}
              <div className="text-xs text-gray-600 mt-1" style={{ fontFamily: 'Work Sans, sans-serif', minHeight: '1.25rem' }}>
                {percentText ?? '\u00A0'}
              </div>

              <div
                className={labelClass}
                style={{
                  fontFamily: 'Work Sans, sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '100%',
                  letterSpacing: '0%',
                  textAlign: 'center',
                }}
              >
                {it.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HelpdeskSnapshotCard;
