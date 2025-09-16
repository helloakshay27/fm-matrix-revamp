import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type ChecklistProgressDetailRow = {
  site_name: string;
  current: {
    open: number;
    in_progress: number;
    overdue: number;
    partially_closed: number;
    closed: number;
  };
  difference: {
    open: number;
    in_progress: number;
    overdue: number;
    partially_closed: number;
    closed: number;
  };
};

export interface ChecklistProgressQuarterlyCardProps {
  title?: string;
  rows: ChecklistProgressDetailRow[];
  loading?: boolean;
}

const fmtPct = (v: number) => {
  if (!Number.isFinite(v)) return '0%';
  return Number.isInteger(v) ? `${v}%` : `${v.toFixed(2)}%`;
};

const toNum = (v: any) => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const s = v.trim().replace('%', '');
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

export const ChecklistProgressQuarterlyCard: React.FC<ChecklistProgressQuarterlyCardProps> = ({
  title = 'Checklist Progress Status – Center-Wise Quarterly Comparison',
  rows,
  loading = false,
}) => {
  return (
    <Card className="border border-gray-300">
      <CardHeader className="py-4">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-[#DAD6C9] text-[#C72030] text-left">
                <th className="py-3 px-4">Site Name</th>
                <th className="py-3 px-4">Open</th>
                <th className="py-3 px-4">In Progress</th>
                <th className="py-3 px-4">Overdue</th>
                <th className="py-3 px-4">Partially Closed</th>
                <th className="py-3 px-4">Closed</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    Loading checklist progress...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    No checklist progress data available
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => {
                  const cur = row.current || ({} as any);
                  const diff = row.difference || ({} as any);

                  const curOverNum = toNum(cur.overdue);
                  const diffOverNum = toNum(diff.overdue ?? 0);
                  const lastOverNum = curOverNum - diffOverNum;
                  const overdueArrowUp = diffOverNum > 0;
                  const overdueArrowDown = diffOverNum < 0;

                  const curClosedNum = toNum(cur.closed);
                  const diffClosedNum = toNum(diff.closed ?? 0);
                  const lastClosedNum = curClosedNum - diffClosedNum;
                  const closedArrowUp = diffClosedNum > 0;
                  const closedArrowDown = diffClosedNum < 0;

                  return (
                    <tr key={row.site_name + i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-4 px-4 bg-[#F6F4EE]">{row.site_name}</td>
                      <td className="py-4 px-4">{fmtPct(cur.open as any)}</td>
                      <td className="py-4 px-4">{fmtPct(cur.in_progress as any)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <span>{fmtPct(curOverNum)}</span>
                          <span>|</span>
                          <span>{fmtPct(lastOverNum)}</span>
                          {overdueArrowUp && <span className="text-red-600">▲</span>}
                          {overdueArrowDown && <span className="text-green-600">▼</span>}
                          {!overdueArrowUp && !overdueArrowDown && <span className="text-gray-400">—</span>}
                        </div>
                      </td>
                      <td className="py-4 px-4">{fmtPct(cur.partially_closed as any)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <span>{fmtPct(curClosedNum)}</span>
                          <span>|</span>
                          <span>{fmtPct(lastClosedNum)}</span>
                          {closedArrowUp && <span className="text-green-600">▲</span>}
                          {closedArrowDown && <span className="text-red-600">▼</span>}
                          {!closedArrowUp && !closedArrowDown && <span className="text-gray-400">—</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistProgressQuarterlyCard;
