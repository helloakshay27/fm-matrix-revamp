import React, { useMemo } from 'react';

import { SiteWiseIssueSummary } from '@/services/ticketAnalyticsAPI';

interface SiteWiseIssueSummaryCardProps {
  data: SiteWiseIssueSummary | null;
  className?: string;
}

const HEADER_BG = '#D97655';
const HEADER_TEXT = '#FFFFFF';
const ROW_ALT = '#F6F4EE';

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

  const thStyle: React.CSSProperties = {
    backgroundColor: HEADER_BG,
    color: HEADER_TEXT,
    padding: '10px 12px',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  };

  const tdStyle = (alt: boolean): React.CSSProperties => ({
    borderBottom: '1px solid #f3f4f6',
    padding: '8px 12px',
    textAlign: 'center',
    fontSize: '12px',
    backgroundColor: alt ? ROW_ALT : '#ffffff',
    whiteSpace: 'nowrap',
  });

  const tdBuildingStyle = (alt: boolean): React.CSSProperties => ({
    ...tdStyle(alt),
    textAlign: 'left',
    fontWeight: 600,
    minWidth: '140px',
  });

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
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="px-3 sm:px-0" style={{ minWidth: `${600 + allCategories.length * 140}px` }}>
              <div className="rounded-xl overflow-hidden border border-gray-200">
              <table className="w-full border-collapse" style={{ borderSpacing: 0 }}>
                <thead>
                  {/* Top header row */}
                  <tr>
                    <th rowSpan={2} className="analytics-header" style={{ ...thStyle, textAlign: 'left', minWidth: 140 }}>
                      Building
                    </th>
                    {allCategories.map(cat => (
                      <th key={cat} colSpan={2} className="analytics-header" style={thStyle}>
                        {cat}
                      </th>
                    ))}
                    <th rowSpan={2} className="analytics-header" style={thStyle}>Total Open</th>
                    <th rowSpan={2} className="analytics-header" style={thStyle}>Total Closed</th>
                    <th rowSpan={2} className="analytics-header" style={thStyle}>Critical</th>
                    <th rowSpan={2} className="analytics-header" style={thStyle}>Escalated</th>
                    <th rowSpan={2} className="analytics-header" style={thStyle}>Avg TAT (days)</th>
                  </tr>
                  {/* Sub-header row for Open/Closed */}
                  <tr>
                    {allCategories.map(cat => (
                      <React.Fragment key={cat}>
                        <th className="analytics-header" style={{ ...thStyle, backgroundColor: '#D97655', color: '#FFFFFF', fontWeight: 500 }}>Open</th>
                        <th className="analytics-header" style={{ ...thStyle, backgroundColor: '#D97655', color: '#FFFFFF', fontWeight: 500 }}>Closed</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {buildings.map((building, idx) => {
                    const alt = idx % 2 === 1;
                    const displayName = building.location === '-1' ? 'Unassigned' : building.location;
                    return (
                      <tr key={building.building_id}>
                        <td style={tdBuildingStyle(alt)}>{displayName}</td>
                        {allCategories.map(cat => {
                          const catData = building.categories[cat];
                          return (
                            <React.Fragment key={cat}>
                              <td style={tdStyle(alt)}>{catData?.open ?? 0}</td>
                              <td style={tdStyle(alt)}>{catData?.closed ?? 0}</td>
                            </React.Fragment>
                          );
                        })}
                        <td style={{ ...tdStyle(alt), fontWeight: 600 }}>{building.total_open}</td>
                        <td style={{ ...tdStyle(alt), fontWeight: 600 }}>{building.total_closed}</td>
                        <td style={{ ...tdStyle(alt), color: building.critical > 0 ? '#c72030' : 'inherit', fontWeight: building.critical > 0 ? 600 : 400 }}>
                          {building.critical}
                        </td>
                        <td style={{ ...tdStyle(alt), color: building.escalated > 0 ? '#d97706' : 'inherit', fontWeight: building.escalated > 0 ? 600 : 400 }}>
                          {building.escalated}
                        </td>
                        <td style={tdStyle(alt)}>{building.avg_tat_days.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
