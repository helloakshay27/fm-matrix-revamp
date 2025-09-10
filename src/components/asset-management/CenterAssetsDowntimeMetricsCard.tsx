import React from 'react';

interface Props { data: any }

// Center Wise – Assets And Downtime Metrics
const CenterAssetsDowntimeMetricsCard: React.FC<Props> = ({ data }) => {
  const root = data?.data ?? data ?? {};
  const rows: any[] = Array.isArray(root.center_metrics) ? root.center_metrics : [];

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <h3 className="font-semibold text-base mb-4">Center Wise – Assets And Downtime Metrics</h3>
      <table className="min-w-[800px] w-full text-sm border">
        <thead className="bg-[#DAD6C9] text-[#C72030]">
          <tr>
            <th rowSpan={2} className="border px-2 py-2 text-left">Site Name</th>
            <th rowSpan={2} className="border px-2 py-2">Total No. of Assets</th>
            <th colSpan={2} className="border px-2 py-2">Critical</th>
            <th colSpan={2} className="border px-2 py-2">Non-Critical</th>
          </tr>
          <tr>
            <th className="border px-2 py-2">Total No. of Breakdown</th>
            <th className="border px-2 py-2">Average day</th>
            <th className="border px-2 py-2">Total No. of Breakdown</th>
            <th className="border px-2 py-2">Average day</th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((r, i) => (
            <tr key={i}>
              <td className="border px-2 py-2 bg-[#F3F1EB80] text-left">{r.site_name ?? '-'}</td>
              <td className="border px-2 py-2">{r.total_assets ?? 0}</td>
              <td className="border px-2 py-2">{r.critical?.breakdown ?? 0}</td>
              <td className="border px-2 py-2">{r.critical?.average_day ?? 0}</td>
              <td className="border px-2 py-2">{r.non_critical?.breakdown ?? 0}</td>
              <td className="border px-2 py-2">{r.non_critical?.average_day ?? 0}</td>
            </tr>
          )) : (
            <tr>
              <td className="border px-2 py-4 text-center" colSpan={6}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="text-xs text-gray-600 mt-2">
        Note: Center-wise asset count with breakdowns and average downtime for critical/non-critical.
      </p>
    </div>
  );
};

export default CenterAssetsDowntimeMetricsCard;
