import React, { useMemo } from 'react';

interface Props {
  data: any;
}

const parsePct = (val: unknown): number => {
  const n = Number(String(val ?? '0').replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? Math.min(100, Math.max(0, n)) : 0;
};

const getPctColor = (pct: number): string => {
  if (pct >= 80) return '#2E7D6B';
  if (pct >= 60) return '#D97655';
  return '#C72030';
};

export const SiteWiseAdoptionRateCard: React.FC<Props> = ({ data }) => {
  const rows: any[] = useMemo(() => {
    const arr = data?.data?.adoption_rates ?? data?.adoption_rates ?? [];
    return Array.isArray(arr) ? arr : [];
  }, [data]);

  const headers = ['Site Name', 'Helpdesk', 'Assets', 'Checklist Tech', 'Checklist Non-Tech', 'Inventory', 'Meeting Room'];

  return (
    <div className="bg-white rounded-xl p-5">
      <h3
        className="font-semibold text-base mb-4"
        style={{ fontFamily: 'Work Sans, sans-serif' }}
      >
        Site Wise Adoption Rate
      </h3>
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-[700px] px-3 sm:px-0">
          <div className="rounded-xl overflow-hidden border border-gray-200">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header text-center`}
                    style={{ backgroundColor: '#D97655' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: Record<string, unknown>, i: number) => {
                const cells = [
                  row.site_name || row.site || '-',
                  row.helpdesk ?? '0%',
                  row.assets ?? '0%',
                  row.checklist_tech ?? '0%',
                  row.checklist_nontech ?? row.checklist_non_tech ?? '0%',
                  row.inventory ?? '0%',
                  row.meeting_room ?? '0%',
                ];
                return (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#F6F4EE' }}>
                    <td className="px-4 py-3 text-left font-medium text-gray-800 text-xs border-b border-gray-100 whitespace-nowrap">
                      {String(cells[0])}
                    </td>
                    {cells.slice(1).map((val: unknown, idx: number) => {
                      const pct = parsePct(val);
                      const color = getPctColor(pct);
                      return (
                        <td key={idx} className="px-4 py-3 text-left border-b border-gray-100">
                          <div className="flex items-center gap-2 justify-start">
                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden min-w-[50px]">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${pct}%`, backgroundColor: '#76CDC1' }}
                              />
                            </div>
                            <span className="text-xs font-semibold whitespace-nowrap" style={{ color }}>
                              {String(val)}
                            </span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-400 text-sm">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteWiseAdoptionRateCard;
