import React, { useMemo } from 'react';
import { Download } from 'lucide-react';

// ── Closure Progress Card ────────────────────────────────
export const ClosureProgressCard: React.FC<{ data: any }> = ({ data }) => {
  const root = data?.data ?? data ?? {};
  const snapshot = root?.snapshot ?? {};
  const total = Number(snapshot?.total_tickets?.count ?? snapshot?.total_tickets ?? root?.total_tickets ?? 0) || 1;
  const closed = Number(snapshot?.closed_tickets?.count ?? snapshot?.closed_tickets ?? root?.closed_tickets ?? 0);
  const open = Number(snapshot?.open_tickets?.count ?? snapshot?.open_tickets ?? root?.open_tickets ?? 0);
  const closedPct = Math.round((closed / total) * 100);
  const openPct = Math.round((open / total) * 100);

  return (
    <div className="bg-white rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Closure Progress
        </h3>
        <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: '#B7DCD4', color: '#2E7D6B' }}>
          ↑ +12 pts this week
        </span>
      </div>
      <div className="space-y-4">
        {/* Closed */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 font-medium">Closed</span>
            <span className="font-semibold text-gray-800">{closedPct}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${closedPct}%`, backgroundColor: '#76CDC1' }} />
          </div>
        </div>
        {/* Open */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600 font-medium">Open</span>
            <span className="font-semibold text-gray-800">{openPct}%</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${openPct}%`, backgroundColor: '#E39090' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Site-wise Ticket Breakdown Card ─────────────────────
export const SiteWiseTicketBreakdownCard: React.FC<{ data: any }> = ({ data }) => {
  const sites = useMemo(() => {
    const root = data?.data ?? data ?? {};
    const arr = root?.sites ?? root?.site_wise ?? root?.centers ?? root?.center_wise ?? [];
    return Array.isArray(arr) ? arr : [];
  }, [data]);

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Site-wise Ticket Breakdown
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ backgroundColor: '#D97655' }}>
              {['Site Name', 'Filled', 'Missed', 'Total', 'Closed', 'Open', 'Closure Rate'].map((h) => (
                <th key={h} className={`px-4 py-3 text-white font-semibold whitespace-nowrap ${h === 'Site Name' ? 'text-left' : 'text-center'}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sites.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-400 text-sm">No data available</td>
              </tr>
            ) : (
              sites.map((site: any, i: number) => {
                const name = site.site_name ?? site.center_name ?? site.name ?? '-';
                const filled = site.filled ?? site.total_tickets ?? 0;
                const missed = site.missed ?? 0;
                const total = site.total ?? (filled + missed);
                const closedN = site.closed ?? site.closed_tickets ?? 0;
                const openN = site.open ?? site.open_tickets ?? 0;
                const closureRate = total > 0 ? Math.round((closedN / total) * 100) : (site.closure_rate ?? 0);
                return (
                  <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{name}</td>
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: '#2E7D6B' }}>{filled}</td>
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: '#D97655' }}>{missed}</td>
                    <td className="px-4 py-3 text-center font-bold text-gray-900">{total}</td>
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: '#2E7D6B' }}>{closedN}</td>
                    <td className="px-4 py-3 text-center font-semibold" style={{ color: '#D97655' }}>{openN}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden min-w-[60px]">
                          <div className="h-full rounded-full" style={{ width: `${closureRate}%`, backgroundColor: '#76CDC1' }} />
                        </div>
                        <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{closureRate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface Props { 
  agingClosureData: any; 
  feedbackData: any;
  onDownload?: () => void;
}

// Normalize various possible ageing bucket keys to canonical labels used in PDF: "0-10", "11-20", "21-30", "31-40", "40+"
const getAgingBuckets = (aging: any) => ({
  '0-10': aging?.['0-10_days'] ?? aging?.['0_10'] ?? aging?.['0-10'] ?? aging?.['0_to_10'] ?? aging?.['0_to_10_days'] ?? '-',
  '11-20': aging?.['11-20_days'] ?? aging?.['11_20'] ?? aging?.['11-20'] ?? aging?.['11_to_20'] ?? aging?.['11_to_20_days'] ?? '-',
  '21-30': aging?.['21-30_days'] ?? aging?.['21_30'] ?? aging?.['21-30'] ?? aging?.['21_to_30'] ?? aging?.['21_to_30_days'] ?? '-',
  '31-40': aging?.['31-40_days'] ?? aging?.['31_40'] ?? aging?.['31-40'] ?? aging?.['31_to_40'] ?? aging?.['31_to_40_days'] ?? '-',
  '40+': aging?.['40+_days'] ?? aging?.['40_plus'] ?? aging?.['40+'] ?? aging?.['40_and_above'] ?? '-',
});

export const TicketAgingClosureFeedbackCard: React.FC<Props> = ({ agingClosureData, feedbackData, onDownload }) => {
  // Prefer new API shape: { data: { centers: [...] } }
  const centers = useMemo(() => {
    const root = agingClosureData?.data ?? agingClosureData ?? {};
    const arr = root?.centers ?? root?.center_wise ?? root?.rows ?? [];
    return Array.isArray(arr) ? arr : [];
  }, [agingClosureData]);

  // Feedback data isn't required (closure/response is included in agingClosureData), but keep for optional enrichment
  const feedbackBySite = useMemo(() => {
    const fb = feedbackData?.data ?? feedbackData ?? {};
    const arr = Array.isArray(fb?.site_performance?.data) ? fb.site_performance.data : [];
    const map = new Map<string, any>();
    arr.forEach((s: any) => map.set(s.site_name || s.site, s));
    return map;
  }, [feedbackData]);

  const centerNames = useMemo(() => {
    return centers.map((c: any) => c.center_name || c.site_name || c.site || '-');
  }, [centers]);

  // Build row definitions to transpose like the PDF: rows = metrics, columns = centers
  const rows = useMemo(() => {
    const getRow = (label: string, extractor: (c: any) => any, opts?: { percent?: boolean; toFixed?: number; bold?: boolean; shaded?: boolean }) => ({
      label,
      values: centers.map((c: any) => {
        const v = extractor(c);
        if (v === null || v === undefined || v === '') return '-';
        if (opts?.percent) {
          if (typeof v === 'number') return `${v.toFixed(opts.toFixed ?? 2)}%`;
          const n = parseFloat(String(v).replace(/[^0-9.\-]/g, ''));
          return Number.isFinite(n) ? `${n.toFixed(opts.toFixed ?? 2)}%` : String(v);
        }
        return v;
      }),
      bold: Boolean(opts?.bold),
      shaded: Boolean(opts?.shaded),
    });

    const bucketRow = (label: string, key: '0-10'|'11-20'|'21-30'|'31-40'|'40+') =>
      getRow(label, (c: any) => {
        const aging = c.aging_buckets || c.ticket_ageing || c.aging || {};
        return getAgingBuckets(aging)[key] ?? '-';
      });

    const totalClosure = getRow('Total Closure %', (c: any) => c.total_closure_efficiency ?? c.closure_efficiency ?? '-', { shaded: true });
    const responseCount = getRow('No. of response', (c: any) => c.feedback_metrics?.response_count ?? '-');
    const responsePct = getRow('% of Response', (c: any) => c.feedback_metrics?.response_percentage ?? '-', { percent: true, toFixed: 2 });

    return [
      bucketRow('40+ days', '40+'),
      bucketRow('31-40 days', '31-40'),
      bucketRow('21-30 days', '21-30'),
      bucketRow('11-20 days', '11-20'),
      bucketRow('0-10 days', '0-10'),
      totalClosure,
      responseCount,
      responsePct,
    ];
  }, [centers]);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-gray-200 -mx-4 px-4 pt-3">
        <h3
          className="flex-1"
          style={{
            fontFamily: 'Work Sans, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '100%',
            letterSpacing: '0%'
          }}
        >
          Ticket Ageing, Closure Efficiency & Feedback Overview by Center
        </h3>
        {onDownload && (
          <Download
            data-no-drag="true"
            className="w-5 h-5 flex-shrink-0 cursor-pointer text-[#C72030] hover:text-[#A01829] transition-colors z-50"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDownload();
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            style={{ pointerEvents: 'auto' }}
          />
        )}
      </div>
      <table className="min-w-full border-collapse text-sm text-center">
        <thead className="bg-[#D97655] text-white font-semibold">
          <tr className="border-t border-gray-200 border-b border-gray-200">
            <th className="border-x border-gray-200 px-2 py-3 text-left">Site Name</th>
            {centerNames.map((name, i) => (
              <th key={i} className="border-x border-gray-200 px-2 py-3">{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => {
            const isLast = rIdx === rows.length - 1;
            return (
              <tr key={rIdx} className={`${row.shaded ? 'bg-[#f5e8e4]' : ''} ${isLast ? 'border-b border-gray-200' : ''}`}>
                <td className="border-x border-gray-200 px-2 py-3 text-left font-medium">{row.label}</td>
                {row.values.map((v: any, idx: number) => (
                  <td key={idx} className="border-x border-gray-200 px-2 py-3">{v ?? '-'}</td>
                ))}
              </tr>
            );
          })}
          {centers.length === 0 && (
            <tr>
              <td colSpan={Math.max(1, centerNames.length) + 1} className="px-4 py-6 text-gray-500">No data</td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="text-xs mt-2 text-gray-600">
        <strong>Note</strong> : This chart illustrates the number of tickets closed below or above the average aging time, along with the number of customer responses received. It also reflects the percentage of responded tickets relative to the total tickets raised.
      </p>
    </div>
  );
};

export default TicketAgingClosureFeedbackCard;
