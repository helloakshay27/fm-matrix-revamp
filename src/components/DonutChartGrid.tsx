
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Download } from 'lucide-react';

interface DonutChartGridProps {
  assetStatusData?: Array<{ name: string; value: number; color: string; }>;
  assetTypeData?: Array<{ name: string; value: number; color: string; }>;
  loading?: boolean;
}

const DonutChartGrid: React.FC<DonutChartGridProps> = ({
  assetStatusData: propAssetStatusData,
  assetTypeData: propAssetTypeData, 
  loading = false
}) => {
  const assetStatusData = propAssetStatusData || [
    { name: 'In Use', value: 3, color: '#c6b692' },
    { name: 'Breakdown', value: 2, color: '#d8dcdd' }
  ];

  const assetTypeData = propAssetTypeData || [
    { name: 'IT Equipment', value: 1, color: '#d8dcdd' },
    { name: 'Non-IT Equipment', value: 4, color: '#c6b692' }
  ];

  // Use provided data or fallback to defaults
  const statusData = assetStatusData || defaultAssetStatusData;
  const typeData = assetTypeData || defaultAssetTypeData;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-sm font-medium"
      >
        {value}
      </text>
    );
  };

  const renderCenterLabel = (data: any[]) => {
    const total = data.reduce((sum, entry) => sum + entry.value, 0);
    return (
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-gray-700">
        <tspan x="50%" dy="-0.5em" className="text-sm font-medium">Total:</tspan>
        <tspan x="50%" dy="1.2em" className="text-lg font-bold">{total}</tspan>
      </text>
    );
  };

  const ChartCard = ({ title, data, chartId }: { title: string; data: any[]; chartId: string }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 relative">
      {/* Download Icon */}
      <div className="absolute top-4 right-4">
        <Download className="w-4 h-4 text-red-500 cursor-pointer hover:text-red-600" />
      </div>

      {/* Title */}
      <h3 className="text-lg font-bold mb-4" style={{ color: 'black' }}>
        {title}
      </h3>

      {/* Loading or Chart */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-gray-500">Loading...</div>
        </div>
      ) : (
        <>
          {/* Chart */}
          <div className="flex items-center justify-center mb-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                {renderCenterLabel(data)}
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-sm" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700 font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ChartCard 
        title="Asset Status" 
        data={statusData} 
        chartId="asset-status"
      />
      <ChartCard 
        title="Asset Type Distribution" 
        data={typeData} 
        chartId="asset-type"
      />
    </div>
  );
};

export { DonutChartGrid };
