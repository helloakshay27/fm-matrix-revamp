import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SurveyAnalyticsCardProps {
  title: string;
  data: Array<{ name: string; value: number; color: string }>;
  type: 'statusDistribution' | 'surveyDistributions';
  className?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  onDownload?: () => void;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

export const SurveyAnalyticsCard: React.FC<SurveyAnalyticsCardProps> = ({
  title,
  data,
  type,
  className = '',
  dateRange,
  onDownload,
  xAxisLabel,
  yAxisLabel
}) => {
  console.log("🎯 SurveyAnalyticsCard - Props received:");
  console.log("🎯 Title:", title);
  console.log("🎯 Data:", data);
  console.log("🎯 Type:", type);
  console.log("🎯 Data items count:", data?.length || 0);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  console.log("🎯 Calculated total:", total);

  const renderPieChart = () => {
    console.log("🎯 SurveyAnalyticsCard - Rendering pie chart with data:", data);
    console.log("🎯 SurveyAnalyticsCard - Data length:", data.length);
    console.log("🎯 SurveyAnalyticsCard - Total value:", total);
    
    return (
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120}
            dataKey="value"
            label={({ name, value, percent }) => {
              console.log(`🎯 Pie label: ${name} = ${value} (${(percent * 100).toFixed(1)}%)`);
              return `${name}: ${(percent * 100).toFixed(1)}%`;
            }}
            labelLine={false}
            stroke="none"
            strokeWidth={0}
            isAnimationActive={false}
          >
            {data.map((entry, index) => {
              console.log(`🎯 Creating cell ${index}:`, entry);
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color} 
                  stroke="none" 
                  strokeWidth={0}
                  style={{ outline: 'none', border: 'none' }}
                />
              );
            })}
          </Pie>
          <Tooltip 
            formatter={(value: number, name: string) => [value, name]}
            labelFormatter={(label) => `${label}: `}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={80}
          fontSize={12}
          label={{ 
            value: xAxisLabel || '', 
            position: 'insideBottom', 
            offset: -10,
            style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
          }}
        />
        <YAxis 
          allowDecimals={false}
          label={{ 
            value: yAxisLabel || '', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
          }}
        />
        <Tooltip 
          formatter={(value: number, name: string) => [value, 'Count']}
          labelFormatter={(label) => `Survey Type: ${label}`}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold text-[#C72030]">
          {title}
        </CardTitle>
        {/* {onDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDownload}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <Download className="h-4 w-4" />
          </Button>
        )} */}
      </CardHeader>
      <CardContent className="pt-0">
        {/* Chart Section */}
        <div className="mb-6">
          {type === 'statusDistribution' ? renderPieChart() : renderBarChart()}
        </div>

        {/* Data Summary Grid - Only show for pie charts (statusDistribution) */}
        {type === 'statusDistribution' && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {data.map((item, index) => {
              console.log(`🎯 Rendering summary item ${index}:`, item);
              return (
                <div
                  key={index}
                  className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-start gap-3 flex-1 pr-4" style={{ 
                    minWidth: 0, 
                    overflow: 'visible',
                    textOverflow: 'clip'
                  }}>
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0 mt-1"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700 leading-relaxed break-words whitespace-normal overflow-visible" style={{ 
                      textOverflow: 'clip', 
                      overflow: 'visible', 
                      whiteSpace: 'normal', 
                      wordWrap: 'break-word',
                      hyphens: 'auto',
                      maxWidth: 'none',
                      width: 'auto'
                    }}>{item.name}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500">
                      {((item.value / total) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Total Summary */}
        {/* <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-800">Total Responses</span>
            <span className="text-lg font-bold text-blue-900">{total}</span>
          </div>
          {dateRange && (
            <div className="text-xs text-blue-600 mt-1">
              Period: {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
            </div>
          )}
        </div> */}
      </CardContent>
    </Card>
  );
};

export default SurveyAnalyticsCard;
