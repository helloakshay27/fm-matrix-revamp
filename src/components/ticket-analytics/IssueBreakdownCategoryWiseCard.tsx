import React from 'react';

import { IssueBreakdownCategoryWise } from '@/services/ticketAnalyticsAPI';

interface IssueBreakdownCategoryWiseCardProps {
  data: IssueBreakdownCategoryWise | null;
  className?: string;
}

const STATUS_ORDER = ['Pending', 'Closed', 'Open', 'On Hold', 'Reopen 1', 'Reopen', 'Received', 'Completed'];

export const IssueBreakdownCategoryWiseCard: React.FC<IssueBreakdownCategoryWiseCardProps> = ({
  data,
  className = ""
}) => {
  const categories = data?.categories || [];
  const totals = data?.totals;

  const statusKeys = React.useMemo(() => {
    const keySet = new Set<string>();
    categories.forEach(cat => {
      if (cat.statuses) {
        Object.keys(cat.statuses).forEach(k => keySet.add(k));
      }
    });
    if (totals?.statuses) {
      Object.keys(totals.statuses).forEach(k => keySet.add(k));
    }
    return Array.from(keySet).sort((a, b) => {
      const ia = STATUS_ORDER.indexOf(a);
      const ib = STATUS_ORDER.indexOf(b);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [categories, totals]);

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Issue Breakdown Category Wise
        </h3>
      </div>
      <div className="p-5">
        <div className="ticket-analytics-table-clip">
            <div className="overflow-x-auto">
            <table className="ticket-analytics-table ticket-issue-breakdown-table">
              <thead>
                <tr>
                  {['Category', 'Total Issues', ...statusKeys, 'Critical P1', 'Avg TAT Days'].map((h, i) => (
                    <th key={i} className={`ticket-analytics-table-header ${i === 0 ? 'text-left' : 'text-center'}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={index} className="ticket-analytics-table-row">
                    <td className="ticket-analytics-table-cell font-medium">{cat.category}</td>
                    <td className="ticket-analytics-table-cell text-center">{cat.total_issues}</td>
                    {statusKeys.map(key => (
                      <td key={key} className="ticket-analytics-table-cell text-center">{cat.statuses?.[key] ?? 0}</td>
                    ))}
                    <td className="ticket-analytics-table-cell text-center">{cat.critical_p1}</td>
                    <td className="ticket-analytics-table-cell text-center">{cat.avg_tat_days?.toFixed(2) ?? '0.00'}</td>
                  </tr>
                ))}
                {totals && (
                  <tr className="ticket-analytics-total-row">
                    <td className="ticket-analytics-total-cell">Total</td>
                    <td className="ticket-analytics-total-cell text-center">{totals.total_issues}</td>
                    {statusKeys.map(key => (
                      <td key={key} className="ticket-analytics-total-cell text-center">{totals.statuses?.[key] ?? 0}</td>
                    ))}
                    <td className="ticket-analytics-total-cell text-center">{totals.critical_p1}</td>
                    <td className="ticket-analytics-total-cell text-center">{totals.avg_tat_days?.toFixed(2) ?? '0.00'}</td>
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
