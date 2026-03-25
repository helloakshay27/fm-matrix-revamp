import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}) => {
  const pieData = sources.filter(s => s.value > 0);
  const total = sources.reduce((sum, s) => sum + s.value, 0);

  // ── Download handler ──────────────────────────────────────────────
  const handleDownload = () => {
    const headers = ['Name', 'Value (%)'];
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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const d = payload[0];
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-2 text-sm shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.payload.color }} />
            <span className="font-semibold text-gray-600">{d.name}:</span>
            <span className="font-bold text-gray-800">{d.value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>

      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold text-analytics-text">{title}</CardTitle>
        <button
          onClick={handleDownload}
          className="p-1.5 rounded-md text-gray-500 hover:text-[#C72030] hover:bg-[#EDEAE3] transition-colors duration-200"
          title="Download CSV"
        >
          <Download className="w-4 h-4" />
        </button>
      </CardHeader>

      <CardContent>
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
                    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
                      {`${value}%`}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-gray-800 leading-none">
              {total.toFixed(0)}
            </span>
            <span className="text-xs font-semibold text-gray-500 mt-1">KWH</span>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-4">
          {sources.map(s => (
            <div key={s.name} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
              <span className="text-sm font-medium text-gray-600">{s.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};