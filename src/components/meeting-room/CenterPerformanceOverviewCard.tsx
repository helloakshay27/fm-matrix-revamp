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
  const thCls = 'px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header';
  const tdCls = 'px-4 py-3 text-center text-sm border-b border-gray-100';

  return (
    <div className="bg-white rounded-xl p-5">
      <h3
        className="font-semibold text-base mb-4"
        style={{ fontFamily: 'Work Sans, sans-serif' }}
      >
        {title}
      </h3>
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-[600px] px-3 sm:px-0">
          <div className="rounded-xl overflow-hidden border border-gray-200">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  <th rowSpan={2} className={`${thCls} text-left`} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>
                    Site Name
                  </th>
                  <th colSpan={3} className={`${thCls}`} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>
                    Meeting Room
                  </th>
                </tr>
                <tr style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}>
                  <th className={`${thCls}`} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Utilization<br />Rate (in %)</th>
                  <th className={`${thCls}`} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Cancellation<br />Rate (in %)</th>
                  <th className={`${thCls}`} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Revenue<br />(in ₹)</th>
                </tr>
              </thead>
              <tbody>
                {rows && rows.length > 0 ? rows.map((row, idx) => {
                  const meeting = (row.meeting_room || row.meeting || {}) as {
                    utilization_rate?: string | number;
                    cancellation_rate?: string | number;
                    revenue?: string | number;
                    utilization_trend?: string | null;
                    cancellation_trend?: string | null;
                    revenue_trend?: string | null;
                  };
                  const utilTrend = meeting.utilization_trend ?? null;
                  const cancelTrend = meeting.cancellation_trend ?? null;
                  const revenueTrend = meeting.revenue_trend ?? null;
                  const siteLabel = row.site_name || row.site || '-';
                  return (
                    <tr key={idx} style={{ backgroundColor: ['#F6F4EE', '#E3909026', '#EFEFFB'][idx % 3] }}>
                      <td className={`${tdCls} text-left font-medium text-gray-800`}>{siteLabel}</td>
                      <td className={tdCls}>
                        {meeting.utilization_rate ?? '-'} <Arrow up={utilTrend === '↑' ? true : utilTrend === '↓' ? false : null} />
                      </td>
                      <td className={tdCls}>
                        {meeting.cancellation_rate ?? '-'} <Arrow up={cancelTrend === '↑' ? true : cancelTrend === '↓' ? false : null} />
                      </td>
                      <td className={tdCls}>
                        {meeting.revenue ?? '-'} <Arrow up={revenueTrend === '↑' ? true : revenueTrend === '↓' ? false : null} />
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td className="px-4 py-6 text-center text-gray-400 text-sm" colSpan={4}>No data</td>
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

export default CenterPerformanceOverviewCard;
