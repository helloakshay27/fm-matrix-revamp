import React from 'react';

export interface CenterPerformanceRow {
  site_name?: string;
  site?: string;
  meeting_room?: {
    utilization_rate?: string | number;
    cancellation_rate?: string | number;
    revenue?: string | number;
    utilization_trend?: '↑' | '↓' | '-' | null;
    cancellation_trend?: '↑' | '↓' | '-' | null;
    revenue_trend?: '↑' | '↓' | '-' | null;
  } | Record<string, any>;
  meeting?: Record<string, any>;
  [key: string]: any;
}

export interface CenterPerformanceOverviewCardProps {
  title?: string;
  rows: CenterPerformanceRow[];
}

const Arrow: React.FC<{ up?: boolean | null }>
  = ({ up }) => {
  if (up === undefined || up === null) return null;
  if (up === true) return <span className="text-green-600 ml-1">↑</span>;
  if (up === false) return <span className="text-red-600 ml-1">↓</span>;
  return <span className="text-gray-500 ml-1">-</span>;
};

export const CenterPerformanceOverviewCard: React.FC<CenterPerformanceOverviewCardProps> = ({
  title = 'Center Wise - Meeting Room Performance Overview',
  rows,
}) => {
  return (
    <div className="bg-white rounded-lg border border-analytics-border">
      <div className="px-4 py-3 border-b border-analytics-border">
        <h3 className="font-semibold text-analytics-text">{title}</h3>
      </div>
      <div className="p-4 overflow-x-auto">
        <table className="min-w-full border text-sm text-center">
          <thead className="bg-[#ded9cd] text-[#b62527] font-semibold text-sm">
            <tr>
              <th className="border border-black p-3 text-left align-middle" rowSpan={2}>
                Site Name
              </th>
              <th className="border border-black p-3 text-center" colSpan={3}>
                Meeting Room
              </th>
            </tr>
            <tr>
              <th className="border border-black p-2 text-center">Utilization<br />Rate (in %)</th>
              <th className="border border-black p-2 text-center">Cancellation<br />Rate (in %)</th>
              <th className="border border-black p-2 text-center">Revenue<br />(in ₹)</th>
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 ? rows.map((row, idx) => {
              const meeting: any = row.meeting_room || row.meeting || {};
              const utilTrend = meeting.utilization_trend ?? null;
              const cancelTrend = meeting.cancellation_trend ?? null;
              const revenueTrend = meeting.revenue_trend ?? null;
              const siteLabel = row.site_name || row.site || '-';
              return (
                <tr key={idx} className="border-t">
                  <td className="p-2 border font-medium text-left">{siteLabel}</td>
                  <td className="p-2 border">
                    {meeting.utilization_rate ?? '-'} <Arrow up={utilTrend === '↑' ? true : utilTrend === '↓' ? false : null} />
                  </td>
                  <td className="p-2 border">
                    {meeting.cancellation_rate ?? '-'} <Arrow up={cancelTrend === '↑' ? true : cancelTrend === '↓' ? false : null} />
                  </td>
                  <td className="p-2 border">
                    {meeting.revenue ?? '-'} <Arrow up={revenueTrend === '↑' ? true : revenueTrend === '↓' ? false : null} />
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td className="p-3 text-center" colSpan={4}>No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CenterPerformanceOverviewCard;
