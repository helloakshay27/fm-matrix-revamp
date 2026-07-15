import React from 'react';
import { Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

// Guideline pie colors
const PIE_COLORS = ['#76CDC1', '#E39090', '#CDCAF5', '#EDC488'];

interface AssetStatusCardProps {
  data: any;
  onDownload?: () => Promise<void>;
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return percent > 0.05 ? (
    <text x={x} y={y} fill="#333" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export const AssetStatusCard: React.FC<AssetStatusCardProps> = ({ data, onDownload }) => {
  const statusData = data?.assets_statistics?.status ?? data ?? {};

  const chartData = [
    { name: 'In Use',      value: statusData.assets_in_use_total ?? statusData.total_assets_in_use ?? 0 },
    { name: 'Breakdown',   value: statusData.assets_in_breakdown_total ?? statusData.total_assets_in_breakdown ?? 0 },
    { name: 'In Store',    value: statusData.in_store ?? 0 },
    { name: 'Disposed',    value: statusData.in_disposed ?? 0 },
  ].filter(d => d.value > 0);

  const hasData = chartData.length > 0;
  const total = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <h3 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          Asset Status Distribution
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
            {/* Donut chart */}
            <div className="relative" style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%" cy="50%"
                    innerRadius="38%" outerRadius="60%"
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={CustomLabel}
                  >
                    {chartData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: any, n: any) => [v, n]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Center total */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{total.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>
            </div>

            {/* Legend + stat cards */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {chartData.map((d, i) => (
                <div key={d.name} className="rounded-xl px-3 py-3 text-center" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] + '25' }}>
                  <div className="text-xl font-bold text-gray-900">{d.value.toLocaleString()}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{d.name}</div>
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
