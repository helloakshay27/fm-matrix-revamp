import React, { useState } from 'react';
import { ANALYTICS_PALETTE } from '@/styles/chartPalette';
import { Download } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface AMCTypeDistributionCardProps {
  data: Array<{
    type: string;
    count: number;
    percentage: number;
  }> | null;
  className?: string;
  onDownload?: () => Promise<void>;
  colorPalette?: {
    primary: string;
    secondary: string;
    tertiary: string;
    primaryLight: string;
    secondaryLight: string;
    tertiaryLight: string;
  };
  headerClassName?: string;
}

export const AMCTypeDistributionCard: React.FC<AMCTypeDistributionCardProps> = ({ data, className, onDownload, colorPalette, headerClassName }) => {
  const { toast } = useToast();

  const palette = colorPalette || {
    primary: '#C4B99D',
    secondary: '#DAD6CA',
    tertiary: '#D5DBDB',
    primaryLight: '#DDD4C4',
    secondaryLight: '#E8E5DD',
    tertiaryLight: '#E5E9E9',
  };
  const COLORS = [palette.tertiary, palette.primary];

  const handleDownload = async () => {
    if (onDownload) {
      try {
        await onDownload();
        toast({
          title: "Success",
          description: "Breakdown vs preventive visit data downloaded successfully"
        });
      } catch (error) {
        console.error('Error downloading breakdown vs preventive visit data:', error);
        toast({
          title: "Error",
          description: "Failed to download breakdown vs preventive visit data",
          variant: "destructive"
        });
      }
    }
  };

  const chartData = data?.map((item, index) => ({
    name: item.type,
    value: item.count,
    percentage: item.percentage,
    color: COLORS[index % COLORS.length]
  }));

  const [chartSize, setChartSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Custom label placed just outside the slice; clamps to chart bounds
  const renderOuterLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, payload } = props;
    const RADIAN = Math.PI / 180;
    const offset = 14;
    const r = (outerRadius || 0) + offset;
    let rawX = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    const labelText = `${payload.name}: ${payload.percentage.toFixed(1)}%`;
    const padding = 6;
    const charW = 7; // increased char width estimate to prevent left clipping
    const textW = labelText.length * charW;
    // Decide anchor BEFORE clamping using raw position
    const isRight = rawX > cx;
    let x = rawX;
    if (chartSize.w) {
      if (isRight) {
        // ensure rightmost edge (x + textW) within bounds
        const maxX = chartSize.w - padding - textW;
        x = Math.min(x, maxX);
      } else {
        // anchor end: text extends leftwards; ensure left edge (x - textW) >= padding
        const minX = padding + textW + 2; // small extra buffer
        x = Math.max(x, minX);
      }
    }
    return (
      <text
        x={x}
        y={y}
        fill={payload.color || '#111827'}
        fontSize={12}
        fontWeight={500}
        textAnchor={isRight ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ pointerEvents: 'none' }}
      >
        {labelText}
      </text>
    );
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col ${className}`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-6 pb-0">
        <h3 className={`text-base sm:text-lg font-bold ${headerClassName || 'text-[#1A1A1A]'}`}>Breakdown vs Preventive Visits</h3>
        {onDownload && (
          <Download
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer ${headerClassName || 'text-[#1A1A1A]'} hover:opacity-80"
            onClick={handleDownload}
          />
        )}
      </div>

      <div className="flex-1 overflow-auto p-3 sm:p-6 pt-0">
        {data && data.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%" onResize={(w, h) => setChartSize({ w, h })}>
                <PieChart margin={{ top: 20, right: 70, bottom: 20, left: 70 }}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderOuterLabel}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value} (${props.payload.percentage.toFixed(1)}%)`,
                      name
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend and Stats */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Visit Type Breakdown</h4>
              {chartData?.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{item.value}</div>
                    <div className="text-xs text-gray-500">{item.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No breakdown vs preventive visit data available for the selected date range
          </div>
        )}
      </div>
    </div>
  );
};
