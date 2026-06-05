import React from 'react';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Guideline bar colors
const BAR_COLORS = ['#9EC8BA', '#8E7BE0', '#DA7756', '#798C5E', '#EDC488'];

interface AssetGroupWiseCardProps {
  data: any;
  onDownload?: () => Promise<void>;
}

export const AssetGroupWiseCard: React.FC<AssetGroupWiseCardProps> = ({ data, onDownload }) => {
  const processData = () => {
    if (!data) return [];
    let groupAssets: Array<{ group_name: string; asset_count?: number; count?: number }> = [];
    if (data.assets_statistics?.assets_group_count_by_name) {
      groupAssets = data.assets_statistics.assets_group_count_by_name;
    } else if (data.group_wise_assets) {
      groupAssets = data.group_wise_assets;
    }
    return groupAssets.slice(0, 10).map((item: any) => ({
      name: item.group_name,
      value: item.asset_count ?? item.count ?? 0,
    }));
  };

  const chartData = processData();
  const hasData = chartData.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Assets Group-Wise
        </h3>
        {onDownload && (
          <Download
            data-no-drag="true"
            className="w-4 h-4 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors z-50"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDownload(); }}
            onPointerDown={(e) => { e.stopPropagation(); }}
            onMouseDown={(e) => { e.stopPropagation(); }}
            style={{ pointerEvents: 'auto' }}
          />
        )}
      </div>

      <div className="flex-1 p-5 min-h-0">
        {hasData ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="name"
                angle={-35}
                textAnchor="end"
                height={65}
                tick={{ fill: '#9CA3AF', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fill: '#9CA3AF', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(v: any) => [v, 'Assets']}
              />
              <Bar dataKey="value" name="Assets" radius={[4, 4, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center py-12 text-gray-400 text-sm">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};
