import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TooltipProps } from 'recharts';

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
  customStyle?: {
    pieChart?: {
      outerRadius?: number;
      innerRadius?: number;
      height?: number;
    };
  };
}

export const SurveyAnalyticsCard: React.FC<SurveyAnalyticsCardProps> = ({
  title,
  data,
  type,
  className = '',
  dateRange,
  onDownload,
  xAxisLabel,
  yAxisLabel,
  customStyle
}) => {
  console.log("🎯 SurveyAnalyticsCard - Props received:");
  console.log("🎯 Title:", title);
  console.log("🎯 Data:", data);
  console.log("🎯 Type:", type);
  console.log("🎯 Data items count:", data?.length || 0);
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  console.log("🎯 Calculated total:", total);

  // Helper function to get emoji based on data name
  const getEmojiForDataName = (name: string): string => {
    const emojiMap: { [key: string]: string } = {
      'very_satisfied': '😀', 'satisfied': '😊', 'neutral': '😐',
      'dissatisfied': '😞', 'very_dissatisfied': '😢',
      'very_happy': '😀', 'happy': '😊', 'okay': '😐',
      'sad': '😞', 'very_sad': '😢',
      'excellent': '😀', 'good': '😊', 'average': '😐',
      'poor': '😞', 'terrible': '😢',
      'amazing': '😀', 'awesome': '😀', 'fantastic': '😀',
      'bad': '😞', 'awful': '😢', 'horrible': '😢'
    };
    
    const nameKey = name.toLowerCase().replace(/\s+/g, '_');
    let emoji = emojiMap[nameKey];
    
    // Try partial matching if exact match not found
    if (!emoji) {
      for (const [key, value] of Object.entries(emojiMap)) {
        if (nameKey.includes(key) || key.includes(nameKey)) {
          emoji = value;
          break;
        }
      }
    }
    
    // Default emoji mapping for star ratings
    if (!emoji && name.includes('star')) {
      const starCount = parseInt(name.charAt(0));
      if (starCount >= 4) emoji = '😀';
      else if (starCount === 3) emoji = '😐';
      else emoji = '😞';
    }
    
    return emoji || '😐'; // Default neutral emoji
  };

  const renderPieChart = () => {
    console.log("🎯 SurveyAnalyticsCard - Rendering pie chart with data:", data);
    console.log("🎯 SurveyAnalyticsCard - Data length:", data.length);
    console.log("🎯 SurveyAnalyticsCard - Total value:", total);

    const chartHeight = customStyle?.pieChart?.height || 250;
    const outerRadius = customStyle?.pieChart?.outerRadius || 90;
    const innerRadius = customStyle?.pieChart?.innerRadius || 45;
    // Only show in-slice ordinal labels for small donuts
    const isSmallDonut = outerRadius <= 90;

    return (
      <div className="relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height={chartHeight}>
          <PieChart className="focus:outline-none">
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              label={isSmallDonut ? ({ percent, cx, cy, midAngle, innerRadius, outerRadius, index }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.6; // Position labels on the pie segments
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                
                // Calculate percentage (percent is 0..1 in Recharts)
                const percentage = Math.round((percent || 0) * 100);
                // Avoid clutter: skip label for tiny slices
                if (percentage < 5) return null;
                
                // Determine ordinal quarter label strictly from position
                const toOrdinal = (n: number) => {
                  const s = ["th", "st", "nd", "rd"]; const v = n % 100;
                  return n + (s[(v - 20) % 10] || s[v] || s[0]);
                };
                const formattedName = `${toOrdinal((index ?? 0) + 1)} Qtr`;
                
                return (
                  <text
                    x={x}
                    y={y}
                    fill="black"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize="8"
                    fontWeight="600"
                  >
                    <tspan x={x} dy="-8">{formattedName}</tspan>
                    <tspan x={x} dy="14">{percentage}%</tspan>
                  </text>
                );
              } : undefined}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  style={{
                    outline: 'none',
                    stroke: 'none'
                  }}
                />
              ))}
            </Pie>
            <Tooltip
              content={(props: TooltipProps<number, string>) => {
                const { active, payload } = props;
                if (active && payload && payload.length) {
                  type Datum = { name: string; value: number; color?: string };
                  const item = (payload[0]?.payload as Datum) || { name: '', value: 0 };
                  const idx = data.findIndex(d => d.name === item.name && d.value === item.value);
                  const toOrdinal = (n: number) => {
                    const s = ["th", "st", "nd", "rd"]; const v = n % 100;
                    return n + (s[(v - 20) % 10] || s[v] || s[0]);
                  };
                  const label = idx >= 0 ? `${toOrdinal(idx + 1)} Qtr` : item.name;
                  const pct = total ? Math.round((item.value / total) * 100) : 0;
                  const color = item.color || String(payload[0]?.color || '#374151');
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-semibold text-gray-800 mb-2">{label}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                        <span className="text-gray-700">{pct}% • Count: <span className="font-semibold">{item.value}</span></span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Only show total in center for smaller pie charts (outerRadius <= 80) */}
        {/* {outerRadius <= 80 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold text-gray-700">Total: {total}</div>
            </div>
          </div>
        )} */}
      </div>
    );
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
        <XAxis 
          dataKey="name" 
          angle={-45}
          textAnchor="end"
          height={100}
          fontSize={10}
          tick={{ fill: '#374151' }}
          label={xAxisLabel ? { 
            value: xAxisLabel, 
            position: 'insideBottom', 
            offset: -10,
            style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
          } : undefined}
        />
        <YAxis 
          allowDecimals={false}
          fontSize={12}
          tick={{ fill: '#374151' }}
          label={yAxisLabel ? { 
            value: yAxisLabel, 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: '12px', fontWeight: 'bold' }
          } : undefined}
        />
        <Tooltip 
          content={(props: TooltipProps<number, string>) => {
            const { active, payload, label } = props;
            if (active && payload && payload.length) {
              const v = (payload[0].value as number) ?? 0;
              const color = ((payload[0].payload as { color?: string })?.color) || '#374151';
              return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                  <p className="font-semibold text-gray-800 mb-2">{label}</p>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                    <span className="text-gray-700">Count: <span className="font-semibold">{v}</span></span>
                  </div>
                </div>
              );
            }
            return null;
          }}
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
          <div className="flex justify-center gap-6 mt-4 flex-wrap">
            {data.map((item, index) => {
              return (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Emoji Display Section - Only show for bar charts (surveyDistributions) */}
        {/* {type === 'surveyDistributions' && (
          <div className="flex justify-center gap-6 mt-4 flex-wrap">
            {data.map((item, index) => (
              <div key={index} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border">
                <span className="text-xl">{getEmojiForDataName(item.name)}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-xs text-gray-500">{item.value} responses</span>
                </div>
              </div>
            ))}
          </div>
        )} */}

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
