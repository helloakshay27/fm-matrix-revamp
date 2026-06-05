import React from 'react';
import { Download } from 'lucide-react';

interface Props {
  data: any;
  onDownload?: () => void;
}

const CenterAssetsDowntimeMetricsCard: React.FC<Props> = ({ data, onDownload }) => {
  const root = data?.data ?? data ?? {};
  const rows: any[] = Array.isArray(root.center_metrics) ? root.center_metrics : [];

  const thCls = 'px-3 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header';
  const tdCls = 'px-3 py-2.5 text-center text-sm border-b border-gray-100';
  const tdLeft = `${tdCls} text-left font-medium text-gray-800`;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Site Wise – Assets And Downtime Metrics
        </h3>
        {onDownload && (
          <Download
            data-no-drag="true"
            className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-50 flex-shrink-0"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload(); }}
            onPointerDown={(e) => { e.stopPropagation(); }}
            onMouseDown={(e) => { e.stopPropagation(); }}
            style={{ pointerEvents: 'auto' }}
          />
        )}
      </div>
      <div className="overflow-x-auto px-4 pb-4">
        <div className="rounded-xl overflow-hidden border border-gray-200" style={{ minWidth: 700 }}>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th rowSpan={2} className={`${thCls} text-left`} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Site Name</th>
              <th rowSpan={2} className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Total Assets</th>
              <th colSpan={2} className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Critical</th>
              <th colSpan={2} className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Non-Critical</th>
            </tr>
            <tr>
              <th className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Breakdowns</th>
              <th className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Avg Days</th>
              <th className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Breakdowns</th>
              <th className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>Avg Days</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? rows.map((r, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#F6F4EE' }}>
                <td className={tdLeft}>{r.site_name ?? '-'}</td>
                <td className={`${tdCls} font-semibold text-gray-900`}>{r.total_assets ?? 0}</td>
                <td className={`${tdCls} text-[#D97655] font-semibold`}>{r.critical?.breakdown ?? 0}</td>
                <td className={tdCls}>{r.critical?.average_day ?? 0}</td>
                <td className={`${tdCls} text-[#2E7D6B] font-semibold`}>{r.non_critical?.breakdown ?? 0}</td>
                <td className={tdCls}>{r.non_critical?.average_day ?? 0}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default CenterAssetsDowntimeMetricsCard;
