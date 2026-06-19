import React, { useMemo } from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';

interface WaterTimeSeriesChartProps {
  data?: any[];
  title?: string;
  className?: string;
  onDownload?: () => void;
}

export const WaterTimeSeriesChart: React.FC<WaterTimeSeriesChartProps> = ({ 
  data, 
  title = "Water Consumption - Time Series",
  className = "",
  onDownload,
}) => {

  const chartData = useMemo(() => {
    if (Array.isArray(data)) return data;
    return [
      { date: '01', consumption: 366, peak: 366 },
      { date: '02', consumption: 302, peak: 302 },
      { date: '03', consumption: 0, peak: 0 },
      { date: '04', consumption: 0, peak: 0 },
      { date: '05', consumption: 0, peak: 0 },
      { date: '06', consumption: 0, peak: 0 },
      { date: '07', consumption: 0, peak: 0 },
      { date: '08', consumption: 0, peak: 0 },
      { date: '09', consumption: 0, peak: 0 },
      { date: '10', consumption: 0, peak: 0 },
      { date: '11', consumption: 0, peak: 0 },
      { date: '12', consumption: 0, peak: 0 },
      { date: '13', consumption: 0, peak: 0 },
      { date: '14', consumption: 0, peak: 0 },
      { date: '15', consumption: 0, peak: 0 },
    ];
  }, [data]);

  const handleDefaultDownload = () => {
    const headers = ['Date', 'Consumption (KL)', 'Peak Level'];
    const rows = chartData.map(row => [row.date, row.consumption ?? '', row.peak ?? '']);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownload = () => {
    if (onDownload) onDownload();
    else handleDefaultDownload();
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
          onClick={handleDownload}
          className="p-1.5 rounded-md text-gray-400 hover:text-[#C72030] hover:bg-gray-100 transition-colors duration-200"
          title="Download CSV"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
      <div className="p-5">
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
              dy={10}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
              label={{
                value: 'Consumption (KL)',
                angle: -90,
                position: 'insideLeft',
                style: { fill: '#6B7280', fontSize: 13, fontWeight: 500 }
              }}
            />
            <Tooltip
              labelStyle={{ color: '#374151', fontWeight: 600 }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar
              yAxisId="left"
              dataKey="consumption"
              name="Consumption (KL)"
              fill="#C6B692"
              barSize={20}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="peak"
              name="Peak Level"
              stroke="none"
              dot={{ r: 4, fill: '#6B4C3A' }}
              activeDot={{ r: 6, fill: '#6B4C3A' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};