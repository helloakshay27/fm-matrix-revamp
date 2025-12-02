import React from 'react';
import { Download } from 'lucide-react';

interface Props { 
  data: any;
  onDownload?: () => void;
}

// Assets With Highest Maintenance Spend
const HighestMaintenanceAssetsCard: React.FC<Props> = ({ data, onDownload }) => {
  const root = data?.data ?? data ?? {};
  const rows: any[] = Array.isArray(root.assets_with_highest_maintenance_spend)
    ? root.assets_with_highest_maintenance_spend
    : [];
  const total_cost = Number(root?.total_maintenance_cost ?? 0);
  const total_percent = Number(root?.total_maintenance_percent ?? 0);

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base flex-1">Assets With Highest Maintenance Spend</h3>
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
        <thead className="bg-[#DAD6C9] text-[#C72030]">
          <tr>
            {['Rank','Asset Name/ID','Asset Category','Site name','Maintenance Cost₹','Total Maintenance%','Remark'].map((h) => (
              <th key={h} className="border px-2 py-2 text-center">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {!rows.length ? (
            <tr><td colSpan={7} className="border px-2 py-4 text-center">No data available</td></tr>
          ) : (
            <>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="border px-2 py-2">{r.rank ?? ''}</td>
                  <td className="border px-2 py-2 text-left">{r.asset_name_id ?? ''}</td>
                  <td className="border px-2 py-2">{r.asset_category ?? '-'}</td>
                  <td className="border px-2 py-2 text-left">{r.site_name ?? '-'}</td>
                  <td className="border px-2 py-2">₹{Number(r.total_maintenance_cost ?? 0).toLocaleString()}</td>
                  <td className="border px-2 py-2">{Number(r.maintenance_percent ?? 0).toFixed(2)}%</td>
                  <td className="border px-2 py-2 text-left">{r.remark ?? '-'}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="border px-2 py-2 text-right" colSpan={4}>Total</td>
                <td className="border px-2 py-2">₹{total_cost.toLocaleString()}</td>
                <td className="border px-2 py-2">{total_percent.toFixed(2)}%</td>
                <td className="border px-2 py-2"></td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      <p className="text-xs text-gray-600 mt-2">Note: Top high-maintenance assets for cost review.</p>
    </div>
  );
};

export default HighestMaintenanceAssetsCard;
