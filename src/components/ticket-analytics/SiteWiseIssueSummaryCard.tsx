import React, { useMemo } from 'react';

import { SiteWiseIssueSummary } from '@/services/ticketAnalyticsAPI';

interface SiteWiseIssueSummaryCardProps {
  data: SiteWiseIssueSummary | null;
  className?: string;
}

export const SiteWiseIssueSummaryCard: React.FC<SiteWiseIssueSummaryCardProps> = ({
  data,
  className = '',
}) => {
  const buildings = data?.buildings ?? [];

  // Collect all unique category names across all buildings
  const allCategories = useMemo(() => {
    const set = new Set<string>();
    buildings.forEach(b => {
      Object.keys(b.categories).forEach(cat => set.add(cat));
    });
    return Array.from(set).sort();
  }, [buildings]);

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Site / Project-wise Issue Summary
        </h3>
      </div>
      <div className="p-5">
        {buildings.length === 0 ? (
          <div className="text-center text-gray-500 py-8 text-sm">No data available</div>
        ) : (
            <div className="ticket-analytics-table-clip">
              <div className="overflow-x-auto">
              <table className="ticket-analytics-table ticket-site-summary-table">
                <thead>
                  {/* Top header row */}
                  <tr>
                    <th rowSpan={2} className="ticket-analytics-table-header">
                      Building
                    </th>
                    {allCategories.map(cat => (
                      <th key={cat} colSpan={2} className="ticket-analytics-table-header">
                        {cat}
                      </th>
                    ))}
                    <th rowSpan={2} className="ticket-analytics-table-header">Total Open</th>
                    <th rowSpan={2} className="ticket-analytics-table-header">Total Closed</th>
                    <th rowSpan={2} className="ticket-analytics-table-header">Critical</th>
                    <th rowSpan={2} className="ticket-analytics-table-header">Escalated</th>
                    <th rowSpan={2} className="ticket-analytics-table-header">Avg TAT (days)</th>
                  </tr>
                  {/* Sub-header row for Open/Closed */}
                  <tr>
                    {allCategories.map(cat => (
                      <React.Fragment key={cat}>
                        <th className="ticket-analytics-table-header">Open</th>
                        <th className="ticket-analytics-table-header">Closed</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {buildings.map((building, idx) => {
                    const displayName = building.location === '-1' ? 'Unassigned' : building.location;
                    return (
                      <tr key={building.building_id} className="ticket-analytics-table-row">
                        <td className="ticket-analytics-table-cell ticket-site-building">{displayName}</td>
                        {allCategories.map(cat => {
                          const catData = building.categories[cat];
                          return (
                            <React.Fragment key={cat}>
                              <td className="ticket-analytics-table-cell">{catData?.open ?? 0}</td>
                              <td className="ticket-analytics-table-cell">{catData?.closed ?? 0}</td>
                            </React.Fragment>
                          );
                        })}
                        <td className="ticket-analytics-table-cell font-semibold">{building.total_open}</td>
                        <td className="ticket-analytics-table-cell font-semibold">{building.total_closed}</td>
                        <td className="ticket-analytics-table-cell" style={{ color: building.critical > 0 ? '#c72030' : 'inherit', fontWeight: building.critical > 0 ? 600 : 400 }}>
                          {building.critical}
                        </td>
                        <td className="ticket-analytics-table-cell" style={{ color: building.escalated > 0 ? '#d97706' : 'inherit', fontWeight: building.escalated > 0 ? 600 : 400 }}>
                          {building.escalated}
                        </td>
                        <td className="ticket-analytics-table-cell">{building.avg_tat_days.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};
