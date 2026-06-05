import React from 'react';
import { Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Guideline pie colors
const PIE_COLORS = ['#CDCAF5', '#76CDC1', '#E39090', '#EDC488', '#9EC8BA', '#DA7756', '#8E7BE0', '#798C5E'];

interface AssetCategoryWiseCardProps {
  data: any;
  onDownload?: () => Promise<void>;
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.06 ? (
    <text x={x} y={y} fill="#333" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export const AssetCategoryWiseCard: React.FC<AssetCategoryWiseCardProps> = ({ data, onDownload }) => {
  const processData = () => {
    if (!data) return [];
    if (data.assets_statistics?.asset_categorywise) {
      return data.assets_statistics.asset_categorywise.map((item: any, i: number) => ({
        name: item.category, value: item.count, color: PIE_COLORS[i % PIE_COLORS.length],
      }));
    }
    if (data.categories && Array.isArray(data.categories)) {
      return data.categories.map((item: any, i: number) => ({
        name: item.category_name ?? item.name, value: item.asset_count ?? item.count ?? 0, color: PIE_COLORS[i % PIE_COLORS.length],
      }));
    }
    if (data.asset_type_category_counts) {
      return Object.entries(data.asset_type_category_counts).map(([name, value], i) => ({
        name, value: value as number, color: PIE_COLORS[i % PIE_COLORS.length],
      }));
    }
    if (Array.isArray(data)) {
      return data.map((item: any, i: number) => ({
        name: item.category ?? item.name, value: item.count ?? item.value, color: PIE_COLORS[i % PIE_COLORS.length],
      }));
    }
    return [];
  };

  const chartData = processData().filter((d: any) => d.value > 0);
  const hasData = chartData.length > 0;
  const total = chartData.reduce((s: number, d: any) => s + d.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Category Wise Assets
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

      <div className="flex-1 p-5 flex flex-col min-h-0">
        {hasData ? (
          <>
            <div className="relative" style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%" cy="50%"
                    innerRadius="35%" outerRadius="58%"
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={CustomLabel}
                  >
                    {chartData.map((_: any, i: number) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any, n: any) => [v, n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center">
              {chartData.map((d: any, i: number) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {d.name}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center py-12 text-gray-400 text-sm">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};
