import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Color palette matching ResolutionTATCard
const CHART_COLORS = {
  lastYearOccupied: '#DAD6CA',    // Secondary color from ResolutionTATCard
  lastYearVacant: '#E8E5DD',      // Secondary Light shade
  thisYearOccupied: '#C4B99D',    // Primary color from ResolutionTATCard
  thisYearVacant: '#DDD4C4',      // Primary Light shade
};

interface OccupancyData {
  category: string;
  lastYearOccupied: number;
  lastYearVacant: number;
  thisYearOccupied: number;
  thisYearVacant: number;
}

interface ParkingOccupancyChartProps {
  data?: OccupancyData[];
  className?: string;
  onDownload?: () => Promise<void>;
}

export const ParkingOccupancyChart: React.FC<ParkingOccupancyChartProps> = ({ 
  data, 
  className = "",
  onDownload 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!onDownload) return;
    
    setIsDownloading(true);
    try {
      await onDownload();
      toast({
        title: "Success",
        description: "Parking occupancy data downloaded successfully"
      });
    } catch (error) {
      console.error('Error downloading parking occupancy data:', error);
      toast({
        title: "Error",
        description: "Failed to download parking occupancy data",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Default data if none provided
  const defaultData: OccupancyData[] = [
    {
      category: '2W',
      lastYearOccupied: 38,
      lastYearVacant: 12,
      thisYearOccupied: 42,
      thisYearVacant: 10
    },
    {
      category: '4W',
      lastYearOccupied: 44,
      lastYearVacant: 22,
      thisYearOccupied: 46,
      thisYearVacant: 24
    }
  ];

  const chartData = data || defaultData;

  // Custom tooltip to show detailed information
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{
      color: string;
      name: string;
      value: number;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#1A1A1A]">2W / 4W Occupancy (Stacked)</CardTitle>
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
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={400} className="min-w-[600px]">
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 50, left: 20, bottom: 80 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 500 }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  domain={[0, 60]}
                  ticks={[0, 15, 30, 45, 60]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px' }}
                  iconType="square"
                  formatter={(value) => {
                    const labels: { [key: string]: string } = {
                      'lastYearOccupied': 'Last Year Occupied',
                      'lastYearVacant': 'Last Year Vacant',
                      'thisYearOccupied': 'This Year Occupied',
                      'thisYearVacant': 'This Year Vacant'
                    };
                    return <span style={{ color: '#6b7280', fontSize: '14px' }}>{labels[value] || value}</span>;
                  }}
                />
                <Bar 
                  dataKey="lastYearOccupied" 
                  fill={CHART_COLORS.lastYearOccupied}
                  name="lastYearOccupied"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="lastYearVacant" 
                  fill={CHART_COLORS.lastYearVacant}
                  name="lastYearVacant"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="thisYearOccupied" 
                  fill={CHART_COLORS.thisYearOccupied}
                  name="thisYearOccupied"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="thisYearVacant" 
                  fill={CHART_COLORS.thisYearVacant}
                  name="thisYearVacant"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">No occupancy data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
