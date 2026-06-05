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
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-[600px] px-3 sm:px-0">
            <div className="rounded-xl overflow-hidden border border-gray-200">
            <table className="w-full">
              <thead>
                <tr>
                  {['Category', 'Total Issues', ...statusKeys, 'Critical P1', 'Avg TAT Days'].map((h, i) => (
                    <th key={i} className={`px-3 py-2.5 text-xs sm:text-sm font-semibold text-white analytics-header ${i === 0 ? 'text-left' : 'text-center'}`} style={{ backgroundColor: '#D97655' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#F6F4EE' }}>
                    <td className="px-3 py-2.5 font-medium text-gray-800 text-xs sm:text-sm border-b border-gray-100">{cat.category}</td>
                    <td className="px-3 py-2.5 text-center text-gray-700 text-xs sm:text-sm border-b border-gray-100">{cat.total_issues}</td>
                    {statusKeys.map(key => (
                      <td key={key} className="px-3 py-2.5 text-center text-gray-700 text-xs sm:text-sm border-b border-gray-100">{cat.statuses?.[key] ?? 0}</td>
                    ))}
                    <td className="px-3 py-2.5 text-center text-gray-700 text-xs sm:text-sm border-b border-gray-100">{cat.critical_p1}</td>
                    <td className="px-3 py-2.5 text-center text-gray-700 text-xs sm:text-sm border-b border-gray-100">{cat.avg_tat_days?.toFixed(2) ?? '0.00'}</td>
                  </tr>
                ))}
                {totals && (
                  <tr style={{ backgroundColor: '#EFEFFB' }}>
                    <td className="px-3 py-2.5 font-bold text-gray-900 text-xs sm:text-sm border-b border-gray-100">Total</td>
                    <td className="px-3 py-2.5 text-center font-bold text-gray-900 text-xs sm:text-sm border-b border-gray-100">{totals.total_issues}</td>
                    {statusKeys.map(key => (
                      <td key={key} className="px-3 py-2.5 text-center font-bold text-gray-900 text-xs sm:text-sm border-b border-gray-100">{totals.statuses?.[key] ?? 0}</td>
                    ))}
                    <td className="px-3 py-2.5 text-center font-bold text-gray-900 text-xs sm:text-sm border-b border-gray-100">{totals.critical_p1}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-gray-900 text-xs sm:text-sm border-b border-gray-100">{totals.avg_tat_days?.toFixed(2) ?? '0.00'}</td>
                  </tr>
                )}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
