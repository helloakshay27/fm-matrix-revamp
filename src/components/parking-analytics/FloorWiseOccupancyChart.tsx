import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Color palette matching ResponseTATCard
const CHART_COLORS = {
  twoWheeler: '#8B7355',      // Darker brown for 2W (matching openAchieved)
  fourWheeler: '#C4B99D',     // Original primary for 4W (matching openBreached)
};

interface FloorOccupancyData {
  floor: string;
  twoWheeler: number;
  fourWheeler: number;
  percentage?: number;
}

interface FloorWiseOccupancyChartProps {
  data?: FloorOccupancyData[];
  className?: string;
  onDownload?: () => Promise<void>;
}

export const FloorWiseOccupancyChart: React.FC<FloorWiseOccupancyChartProps> = ({ 
  data, 
  className = "",
  onDownload 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeBar, setActiveBar] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!onDownload) return;
    
    setIsDownloading(true);
    try {
      await onDownload();
      toast({
        title: "Success",
        description: "Floor-wise occupancy data downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading floor-wise occupancy data:', error);
      toast({
        title: "Error",
        description: "Failed to download floor-wise occupancy data",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Default data if none provided
  const defaultData: FloorOccupancyData[] = [
    { floor: 'B2', twoWheeler: 12, fourWheeler: 8, percentage: 11.1 },
    { floor: 'B1', twoWheeler: 10, fourWheeler: 13, percentage: 10.0 },
    { floor: 'G', twoWheeler: 8, fourWheeler: 17, percentage: 14.3 },
    { floor: '1', twoWheeler: 6, fourWheeler: 10, percentage: 14.3 },
    { floor: '2', twoWheeler: 4, fourWheeler: 9, percentage: 7.7 },
  ];

  const chartData = data || defaultData;

  // Custom tooltip to show floor details with hover effect
  const CustomTooltip = ({ active, payload }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      value: number;
      payload: FloorOccupancyData;
    }>;
  }) => {
    if (active && payload && payload.length) {
      const floorData = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800 mb-2 text-lg">{floorData.floor}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <span className="font-medium text-[#8B7355]">2W:</span>
              <span className="text-gray-700 font-semibold">{floorData.twoWheeler}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="font-medium text-[#C4B99D]">4W:</span>
              <span className="text-gray-700 font-semibold">{floorData.fourWheeler}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate max value for Y-axis
  const maxValue = Math.max(...chartData.map(d => d.twoWheeler + d.fourWheeler));
  const yAxisMax = Math.ceil(maxValue / 5) * 5; // Round up to nearest 5

  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#1A1A1A]">Floor-wise Occupancy (2W vs 4W)</CardTitle>
          {onDownload && (
            <Download
              data-no-drag="true"
              className={`w-5 h-5 text-[#000000] hover:text-[#333333] cursor-pointer transition-colors z-50 ${isDownloading ? 'opacity-50' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDownload();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
              }}
              style={{ pointerEvents: 'auto' }}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <>
            <div className="w-full overflow-x-auto">
              <ResponsiveContainer width="100%" height={400} className="min-w-[500px]">
                <BarChart 
                  data={chartData} 
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  onMouseMove={(state) => {
                    if (state.isTooltipActive) {
                      setActiveBar(state.activeLabel as string);
                    } else {
                      setActiveBar(null);
                    }
                  }}
                  onMouseLeave={() => {
                    setActiveBar(null);
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="floor" 
                    tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 500 }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    domain={[0, yAxisMax]}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px' }}
                    iconType="square"
                    formatter={(value) => {
                      return <span style={{ color: '#6b7280', fontSize: '14px' }}>{value}</span>;
                    }}
                  />
                  <Bar 
                    dataKey="twoWheeler" 
                    stackId="stack"
                    fill={CHART_COLORS.twoWheeler}
                    name="2W"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar 
                    dataKey="fourWheeler" 
                    stackId="stack"
                    fill={CHART_COLORS.fourWheeler}
                    name="4W"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Percentage Row */}
            <div className="mt-4 flex justify-center gap-8 px-4">
              {chartData.map((floor, index) => (
                <div key={index} className="text-center min-w-[60px]">
                  <div className="text-sm font-semibold text-gray-700 mb-1">{floor.floor}</div>
                  <div className="text-lg font-bold text-green-600">
                    {floor.percentage ? `${floor.percentage}%` : '0%'}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">No floor-wise occupancy data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
