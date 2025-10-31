import React, { useMemo } from 'react';

interface Props { agingClosureData: any; feedbackData: any }

// Normalize various possible ageing bucket keys to canonical labels used in PDF: "0-10", "11-20", "21-30", "31-40", "40+"
const getAgingBuckets = (aging: any) => ({
  '0-10': aging?.['0-10_days'] ?? aging?.['0_10'] ?? aging?.['0-10'] ?? aging?.['0_to_10'] ?? aging?.['0_to_10_days'] ?? '-',
  '11-20': aging?.['11-20_days'] ?? aging?.['11_20'] ?? aging?.['11-20'] ?? aging?.['11_to_20'] ?? aging?.['11_to_20_days'] ?? '-',
  '21-30': aging?.['21-30_days'] ?? aging?.['21_30'] ?? aging?.['21-30'] ?? aging?.['21_to_30'] ?? aging?.['21_to_30_days'] ?? '-',
  '31-40': aging?.['31-40_days'] ?? aging?.['31_40'] ?? aging?.['31-40'] ?? aging?.['31_to_40'] ?? aging?.['31_to_40_days'] ?? '-',
  '40+': aging?.['40+_days'] ?? aging?.['40_plus'] ?? aging?.['40+'] ?? aging?.['40_and_above'] ?? '-',
});

export const TicketAgingClosureFeedbackCard: React.FC<Props> = ({ agingClosureData, feedbackData }) => {
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
        Ticket Ageing, Closure Efficiency & Feedback Overview by Center
      </h3>
      <table className="min-w-full border-collapse text-sm text-center">
        <thead className="bg-[#ded9cd] text-[#b62527] font-semibold">
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
              <tr key={rIdx} className={`${row.shaded ? 'bg-[#ded9cd]' : ''} ${isLast ? 'border-b border-gray-200' : ''}`}>
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
