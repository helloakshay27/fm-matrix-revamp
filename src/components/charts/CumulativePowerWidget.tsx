import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Download } from 'lucide-react';

interface SubMeterSource {
  name: string;
  value: number;
  color: string;
}

interface CumulativePowerWidgetProps {
  sources?: SubMeterSource[];
  title?: string;
  className?: string;
  onDownload?: () => void;
  showPercentage?: boolean; // true = show %, false = show raw number (default: true)
}

const DEFAULT_SOURCES: SubMeterSource[] = [
  { name: 'Solar', value: 72.9, color: '#A89078' },
  { name: 'Wind',  value: 27.1, color: '#D8DCDD' },
  { name: 'Hydro', value: 0,    color: '#6B4C3A' },
];

export const CumulativePowerWidget: React.FC<CumulativePowerWidgetProps> = ({
  sources = DEFAULT_SOURCES,
  title = 'Sub Meter Sources',
  className = '',
  onDownload,
  showPercentage = true,
}) => {
  const pieData = sources.filter(s => s.value > 0);
  const total = sources.reduce((sum, s) => sum + s.value, 0);

  // ── Default CSV download ──────────────────────────────────────────────
  const handleDefaultDownload = () => {
    const headers = ['Name', showPercentage ? 'Value (%)' : 'Count'];
    const rows = sources.map(s => [s.name, s.value]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadClick = () => {
    if (onDownload) {
      onDownload();
    } else {
      handleDefaultDownload();
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const d = payload[0];
      return (
        <div style={{ zIndex: 9999, position: 'relative' }} className="bg-white border border-gray-200 rounded-lg p-2 text-sm shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.payload.color }} />
            <span className="font-semibold text-gray-700">{d.name}:</span>
            <span className="font-bold text-gray-900">
              {showPercentage ? `${d.value}%` : d.value}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm w-full ${className}`}>
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3
          className="text-base font-semibold text-gray-900"
          style={{ fontFamily: 'Work Sans, sans-serif' }}
        >
          {title}
        </h3>
        <button
          type="button"
          onClick={handleDownloadClick}
          className="p-1.5 rounded-md text-gray-400 hover:text-[#C72030] hover:bg-gray-100 transition-colors duration-200"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      <div className="p-5">
        <div className="w-full h-[260px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={50}
                stroke="#FFFFFF"
                strokeWidth={2}
                paddingAngle={3}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text
                      x={x} y={y}
                      fill="#fff"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={12}
                      fontWeight={700}
                    >
                      {showPercentage ? `${value}%` : value}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} wrapperStyle={{ zIndex: 9999 }} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-gray-800 leading-none">
              {total.toFixed(0)}
            </span>
            <span className="text-xs font-semibold text-gray-500 mt-1">
              {showPercentage ? 'KWH' : 'Total'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {sources.map(s => (
            <div key={s.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-sm font-medium text-gray-600">{s.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};