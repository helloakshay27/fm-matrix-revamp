import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast as sonnerToast } from 'sonner';

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
  startDate?: string;
  endDate?: string;
}

export const FloorWiseOccupancyChart: React.FC<FloorWiseOccupancyChartProps> = ({ 
  data: propData, 
  className = "",
  onDownload,
  startDate,
  endDate
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeBar, setActiveBar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch data from API
  useEffect(() => {
    const fetchFloorwiseData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate dates if not provided
        const endDateStr = endDate || new Date().toISOString().split('T')[0];
        const startDateStr = startDate || (() => {
          const date = new Date();
          date.setDate(date.getDate() - 7);
          return date.toISOString().split('T')[0];
        })();

        // Calculate previous period start date (last month)
        const previousStartDate = (() => {
          const date = new Date(startDateStr);
          date.setMonth(date.getMonth() - 1);
          return date.toISOString().split('T')[0];
        })();

        const url = getFullUrl('/parking_dashboard/floorwise_occupancy');
        const options = getAuthenticatedFetchOptions();
        
        const params = new URLSearchParams({
          start_date: startDateStr,
          end_date: endDateStr,
          previous_start_date: previousStartDate,
          compare_yoy: 'true',
        });

        const fullUrl = `${url}?${params.toString()}`;
        console.log('🔍 Fetching floorwise occupancy from:', fullUrl);

        const response = await fetch(fullUrl, options);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch floorwise occupancy: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Floorwise occupancy data:', result);
        setApiData(result);
      } catch (err) {
        console.error('Error fetching floorwise occupancy:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        sonnerToast.error('Failed to load floorwise occupancy data');
      } finally {
        setLoading(false);
      }
    };

    fetchFloorwiseData();
  }, [startDate, endDate]);

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

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const endDateStr = endDate || new Date().toISOString().split('T')[0];
      const startDateStr = startDate || (() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date.toISOString().split('T')[0];
      })();

      const previousStartDate = (() => {
        const date = new Date(startDateStr);
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
      })();

      const url = getFullUrl('/parking_dashboard/floorwise_occupancy');
      const options = getAuthenticatedFetchOptions();
      
      const params = new URLSearchParams({
        start_date: startDateStr,
        end_date: endDateStr,
        previous_start_date: previousStartDate,
        compare_yoy: 'true',
      });

      const fullUrl = `${url}?${params.toString()}`;
      const response = await fetch(fullUrl, options);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch floorwise occupancy: ${response.statusText}`);
      }

      const result = await response.json();
      setApiData(result);
      sonnerToast.success('Floorwise occupancy data refreshed');
    } catch (err) {
      console.error('Error refreshing floorwise occupancy:', err);
      sonnerToast.error('Failed to refresh floorwise occupancy data');
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to chart format
  const getChartData = (): FloorOccupancyData[] => {
    if (apiData?.data?.current_year?.floors) {
      const floors = apiData.data.current_year.floors;
      return floors
        .filter((floor: any) => floor.total_capacity > 0) // Filter out empty floors
        .map((floor: any) => ({
          floor: floor.floor_name,
          twoWheeler: floor.two_wheeler.total_occupied || 0,
          fourWheeler: floor.four_wheeler.total_occupied || 0,
          percentage: floor.occupancy_pct || 0
        }));
    }
    
    // Use prop data if available, otherwise use default
    if (propData) return propData;

    // Default fallback data
    return [
      { floor: 'B2', twoWheeler: 12, fourWheeler: 8, percentage: 11.1 },
      { floor: 'B1', twoWheeler: 10, fourWheeler: 13, percentage: 10.0 },
      { floor: 'G', twoWheeler: 8, fourWheeler: 17, percentage: 14.3 },
      { floor: '1', twoWheeler: 6, fourWheeler: 10, percentage: 14.3 },
      { floor: '2', twoWheeler: 4, fourWheeler: 9, percentage: 7.7 },
    ];
  };

  const chartData = getChartData();

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
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-[#1A1A1A]">Floor-wise Occupancy (2W vs 4W)</CardTitle>
            {loading && <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />}
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw
              className={`w-5 h-5 text-[#000000] hover:text-[#333333] cursor-pointer transition-colors ${loading ? 'animate-spin opacity-50' : ''}`}
              onClick={handleRefresh}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
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
