import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">
          Issue Breakdown Category Wise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="min-w-[600px] px-3 sm:px-0">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr style={{ backgroundColor: '#EDE4D8' }}>
                  <th className="border border-gray-300 p-2 sm:p-3 text-left text-xs sm:text-sm font-medium text-black">
                    Category
                  </th>
                  <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">
                    Total Issues
                  </th>
                  {statusKeys.map(key => (
                    <th key={key} className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">
                      {key}
                    </th>
                  ))}
                  <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">
                    Critical P1
                  </th>
                  <th className="border border-gray-300 p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-black">
                    Avg TAT Days
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, index) => (
                  <tr key={index} className="bg-white">
                    <td className="border border-gray-300 p-2 sm:p-3 font-medium text-black text-xs sm:text-sm">
                      {cat.category}
                    </td>
                    <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">
                      {cat.total_issues}
                    </td>
                    {statusKeys.map(key => (
                      <td key={key} className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">
                        {cat.statuses?.[key] ?? 0}
                      </td>
                    ))}
                    <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">
                      {cat.critical_p1}
                    </td>
                    <td className="border border-gray-300 p-2 sm:p-3 text-center text-black text-xs sm:text-sm">
                      {cat.avg_tat_days?.toFixed(2) ?? '0.00'}
                    </td>
                  </tr>
                ))}
                {totals && (
                  <tr style={{ backgroundColor: '#EDE4D8' }}>
                    <td className="border border-gray-300 p-2 sm:p-3 font-bold text-black text-xs sm:text-sm">
                      Total
                    </td>
                    <td className="border border-gray-300 p-2 sm:p-3 text-center font-bold text-black text-xs sm:text-sm">
                      {totals.total_issues}
                    </td>
                    {statusKeys.map(key => (
                      <td key={key} className="border border-gray-300 p-2 sm:p-3 text-center font-bold text-black text-xs sm:text-sm">
                        {totals.statuses?.[key] ?? 0}
                      </td>
                    ))}
                    <td className="border border-gray-300 p-2 sm:p-3 text-center font-bold text-black text-xs sm:text-sm">
                      {totals.critical_p1}
                    </td>
                    <td className="border border-gray-300 p-2 sm:p-3 text-center font-bold text-black text-xs sm:text-sm">
                      {totals.avg_tat_days?.toFixed(2) ?? '0.00'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
