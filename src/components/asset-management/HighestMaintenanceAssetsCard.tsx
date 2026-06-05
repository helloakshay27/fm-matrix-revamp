import React from 'react';
import { Download } from 'lucide-react';

interface Props {
  data: any;
  onDownload?: () => void;
}

const HighestMaintenanceAssetsCard: React.FC<Props> = ({ data, onDownload }) => {
  const root = data?.data ?? data ?? {};
  const rows: any[] = Array.isArray(root.assets_with_highest_maintenance_spend)
    ? root.assets_with_highest_maintenance_spend : [];
  const total_cost = Number(root?.total_maintenance_cost ?? 0);
  const total_percent = Number(root?.total_maintenance_percent ?? 0);

  const headers = ['Rank', 'Asset Name / ID', 'Category', 'Site Name', 'Maintenance Cost ₹', 'Total %', 'Remark'];
  const thCls = 'px-3 py-3 font-semibold text-xs whitespace-nowrap analytics-header';
  const tdCls = 'px-3 py-2.5 text-sm text-center border-b border-gray-100';

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Assets With Highest Maintenance Spend
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
        <div className="rounded-xl overflow-hidden border border-gray-200" style={{ minWidth: 760 }}>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              {headers.map(h => (
                <th key={h} className={thCls} style={{ backgroundColor: '#D97655', color: '#ffffff' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!rows.length ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400 text-sm">No data available</td></tr>
            ) : (
              <>
                {rows.map((r, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#ffffff' : '#F6F4EE' }}>
                    <td className={`${tdCls} font-semibold text-gray-700`}>{r.rank ?? i + 1}</td>
                    <td className={`${tdCls} text-left font-medium text-gray-800`}>{r.asset_name_id ?? '-'}</td>
                    <td className={tdCls}>{r.asset_category ?? '-'}</td>
                    <td className={`${tdCls} text-left`}>{r.site_name ?? '-'}</td>
                    <td className={`${tdCls} font-semibold`} style={{ color: '#D97655' }}>
                      ₹{Number(r.total_maintenance_cost ?? 0).toLocaleString()}
                    </td>
                    <td className={tdCls}>{Number(r.maintenance_percent ?? 0).toFixed(2)}%</td>
                    <td className={`${tdCls} text-left text-gray-500`}>{r.remark ?? '-'}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: '#EFEFFB' }}>
                  <td colSpan={4} className="px-3 py-2.5 text-right text-sm font-semibold text-gray-700">Total</td>
                  <td className="px-3 py-2.5 text-center text-sm font-semibold" style={{ color: '#D97655' }}>
                    ₹{total_cost.toLocaleString()}
                  </td>
                  <td className="px-3 py-2.5 text-center text-sm font-semibold">{total_percent.toFixed(2)}%</td>
                  <td />
                </tr>
              </>
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};

export default HighestMaintenanceAssetsCard;
