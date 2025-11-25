import React from 'react';
import { Download } from 'lucide-react';

interface Props { 
  data: any;
  onDownload?: () => void;
}

// Center Wise – Assets And Downtime Metrics
const CenterAssetsDowntimeMetricsCard: React.FC<Props> = ({ data, onDownload }) => {
  const root = data?.data ?? data ?? {};
  const rows: any[] = Array.isArray(root.center_metrics) ? root.center_metrics : [];

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base flex-1">Site Wise – Assets And Downtime Metrics</h3>
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
      <table className="min-w-[800px] w-full text-sm border">
  <thead className="bg-[#DAD6C9] text-[#C72030] text-xs">
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