import React from 'react';
import { getPeriodLabels } from '@/lib/periodLabel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

export type ChecklistProgressDetailRow = {
  site_name: string;
  current_period?: {
    Open?: number;
    "Work In Progress"?: number;
    Overdue?: number;
    "Partially Closed"?: number;
    Closed?: number;
  };
  previous_period?: {
    Open?: number;
    "Work In Progress"?: number;
    Overdue?: number;
    "Partially Closed"?: number;
    Closed?: number;
  };
  difference?: {
    Open?: number;
    "Work In Progress"?: number;
    Overdue?: number;
    "Partially Closed"?: number;
    Closed?: number;
  };
  // Legacy format support
  current?: {
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
  dateRange?: { startDate: Date; endDate: Date };
  onDownload?: () => void;
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
  title,
  rows,
  loading = false,
  dateRange,
  onDownload,
}) => {
  const { periodUnit } = getPeriodLabels(dateRange?.startDate ?? new Date(), dateRange?.endDate ?? new Date());
  const computedTitle = title ?? `Checklist Progress Status`;
  return (
    <Card className="border border-gray-300">
      <CardHeader className="py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex-1">{computedTitle}</CardTitle>
          {onDownload && (
            <Download
              data-no-drag="true"
              className="w-5 h-5 cursor-pointer text-[#000000] hover:text-[#333333] transition-colors z-50 flex-shrink-0"
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
                  // Support both new API format (current_period/previous_period) and legacy format (current)
                  const curPeriod = row.current_period || row.current || {};
                  const prevPeriod = row.previous_period || {};
                  const diff = row.difference || {};

                  // Extract values supporting both formats - API returns capitalized keys
                  const curOpen = toNum((curPeriod as any).Open ?? (curPeriod as any).open ?? 0);
                  const curInProgress = toNum((curPeriod as any)["Work In Progress"] ?? (curPeriod as any).in_progress ?? 0);
                  const curOverdue = toNum((curPeriod as any).Overdue ?? (curPeriod as any).overdue ?? 0);
                  const curPartiallyClosed = toNum((curPeriod as any)["Partially Closed"] ?? (curPeriod as any).partially_closed ?? 0);
                  const curClosed = toNum((curPeriod as any).Closed ?? (curPeriod as any).closed ?? 0);

                  const diffOpen = toNum((diff as any).Open ?? (diff as any).open ?? 0);
                  const diffInProgress = toNum((diff as any)["Work In Progress"] ?? (diff as any).in_progress ?? 0);
                  const diffOverdue = toNum((diff as any).Overdue ?? (diff as any).overdue ?? 0);
                  const diffPartiallyClosed = toNum((diff as any)["Partially Closed"] ?? (diff as any).partially_closed ?? 0);
                  const diffClosed = toNum((diff as any).Closed ?? (diff as any).closed ?? 0);

                  // Arrow logic: positive difference = increase (red for overdue, green for closed)
                  const overdueArrowUp = diffOverdue > 0;
                  const overdueArrowDown = diffOverdue < 0;
                  const closedArrowUp = diffClosed > 0;
                  const closedArrowDown = diffClosed < 0;

                  return (
                    <tr key={row.site_name + i} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="py-4 px-4 bg-[#F6F4EE]">{row.site_name}</td>
                      <td className="py-4 px-4">{fmtPct(curOpen)}</td>
                      <td className="py-4 px-4">{fmtPct(curInProgress)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <span>{fmtPct(curOverdue)}</span>
                          {(overdueArrowUp || overdueArrowDown) && (
                            <>
                              <span className="text-gray-500 text-xs">({diffOverdue > 0 ? '+' : ''}{fmtPct(diffOverdue)})</span>
                              {overdueArrowUp && <span className="text-red-600">▲</span>}
                              {overdueArrowDown && <span className="text-green-600">▼</span>}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">{fmtPct(curPartiallyClosed)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1">
                          <span>{fmtPct(curClosed)}</span>
                          {(closedArrowUp || closedArrowDown) && (
                            <>
                              <span className="text-gray-500 text-xs">({diffClosed > 0 ? '+' : ''}{fmtPct(diffClosed)})</span>
                              {closedArrowUp && <span className="text-green-600">▲</span>}
                              {closedArrowDown && <span className="text-red-600">▼</span>}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-3 rounded-md">
          <p className="text-xs text-gray-700">
            <span className="font-semibold">Note:</span> This table shows checklist progress by status across centers, comparing the current and last quarter. The "Change in Closed" column highlights the shift in closed checklists since the previous quarter.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChecklistProgressQuarterlyCard;
