import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';

interface SiteWisePowerChartProps {
  data?: any[];
  title?: string;
  className?: string;
}

export const SiteWisePowerConsumptionChart: React.FC<SiteWisePowerChartProps> = ({ 
  data, 
  title = "Site Wise Power Consumption",
  className = "" 
}) => {

  const chartData = useMemo(() => {
    if (data && Array.isArray(data) && data.length > 0) return data;
    return [
      { site: 'Lockated Site 1', mains: 1287545.66, dg: 0,      renewable: 0,      consumptionPerSqFt: 2.1, costPerSqFt: 1.8 },
      { site: 'Lockated Site 2', mains: 980000,    dg: 120000,  renewable: 45000,  consumptionPerSqFt: 1.8, costPerSqFt: 1.5 },
      { site: 'Lockated Site 3', mains: 650000,    dg: 80000,   renewable: 30000,  consumptionPerSqFt: 1.4, costPerSqFt: 1.2 },
    ];
  }, [data]);

  const handleDownload = () => {
    const headers = ['Site', 'Mains', 'DG', 'Renewable', 'Consumption/SqFt', 'Cost/SqFt'];
    const rows = chartData.map(row => [
      row.site,
      row.mains ?? '',
      row.dg ?? '',
      row.renewable ?? '',
      row.consumptionPerSqFt ?? '',
      row.costPerSqFt ?? '',
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="site" 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
              dy={10}
            />
            <YAxis 
              yAxisId="left" 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
              tickFormatter={(v) => v.toLocaleString('en-IN')}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
            />
            <Tooltip 
              labelStyle={{ color: '#374151', fontWeight: 600 }} 
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar yAxisId="left" dataKey="mains" name="Mains" stackId="a" fill="#C6B692" />
            <Bar yAxisId="left" dataKey="dg" name="DG" stackId="a" fill="#D8DCDD" />
            <Bar yAxisId="left" dataKey="renewable" name="Renewable" stackId="a" fill="#8B634B" />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="consumptionPerSqFt" 
              name="Consumption / sq.ft" 
              stroke="#5C3A21"
              strokeWidth={2}
              dot={{ r: 4, fill: '#5C3A21' }} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="costPerSqFt" 
              name="Cost / sq.ft" 
              stroke="#71717A"
              strokeWidth={2}
              dot={{ r: 4, fill: '#71717A' }} 
              activeDot={{ r: 6 }} 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};