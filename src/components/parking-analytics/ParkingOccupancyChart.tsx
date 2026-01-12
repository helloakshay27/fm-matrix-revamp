import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast as sonnerToast } from 'sonner';

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
  startDate?: string;
  endDate?: string;
}

export const ParkingOccupancyChart: React.FC<ParkingOccupancyChartProps> = ({ 
  data: propData, 
  className = "",
  onDownload,
  startDate,
  endDate
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [occupancyView, setOccupancyView] = useState<'current' | 'yoy'>('current');
  const { toast } = useToast();

  // Fetch data from API
  useEffect(() => {
    const fetchOccupancyData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate dates if not provided
        const endDateStr = endDate || new Date().toISOString().split('T')[0];
        const startDateStr = startDate || endDateStr;

        const previousStartDate = (() => {
          const date = new Date(startDateStr);
          date.setDate(date.getDate() - 1);
          return date.toISOString().split('T')[0];
        })();

        const url = getFullUrl('/parking_dashboard/two_wheeler_four_wheeler_stacked_counts');
        const options = getAuthenticatedFetchOptions();
        
        const params = new URLSearchParams({
          start_date: startDateStr,
          end_date: endDateStr,
          previous_start_date: previousStartDate,
          compare_yoy: 'true',
        });

        const fullUrl = `${url}?${params.toString()}`;
        console.log('🔍 Fetching 2W/4W occupancy from:', fullUrl);

        const response = await fetch(fullUrl, options);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch occupancy data: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ 2W/4W occupancy data:', result);
        setApiData(result);
      } catch (err) {
        console.error('Error fetching occupancy data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
        sonnerToast.error('Failed to load occupancy data');
      } finally {
        setLoading(false);
      }
    };

    fetchOccupancyData();
  }, [startDate, endDate]);

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

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // Calculate dates if not provided
      const endDateStr = endDate || new Date().toISOString().split('T')[0];
      const startDateStr = startDate || endDateStr;

      const previousStartDate = (() => {
        const date = new Date(startDateStr);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
      })();

      const url = getFullUrl('/parking_dashboard/two_wheeler_four_wheeler_stacked_counts');
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
        throw new Error(`Failed to fetch occupancy data: ${response.statusText}`);
      }

      const result = await response.json();
      setApiData(result);
      sonnerToast.success('Occupancy data refreshed');
    } catch (err) {
      console.error('Error refreshing occupancy data:', err);
      sonnerToast.error('Failed to refresh occupancy data');
    } finally {
      setLoading(false);
    }
  };

  // Transform API data to chart format
  const getChartData = (): OccupancyData[] => {
    if (apiData?.data?.current) {
      const current = apiData.data.current;
      // If yoy missing, fall back to zeros so compare view still renders both series
      const yoy = apiData.data.yoy || {
        two_wheeler: { total_occupied: 0, total_vacant: 0 },
        four_wheeler: { total_occupied: 0, total_vacant: 0 },
      };

      return [
        {
          category: '2W',
          lastYearOccupied: yoy.two_wheeler?.total_occupied || 0,
          lastYearVacant: yoy.two_wheeler?.total_vacant || 0,
          thisYearOccupied: current.two_wheeler?.total_occupied || 0,
          thisYearVacant: current.two_wheeler?.total_vacant || 0,
        },
        {
          category: '4W',
          lastYearOccupied: yoy.four_wheeler?.total_occupied || 0,
          lastYearVacant: yoy.four_wheeler?.total_vacant || 0,
          thisYearOccupied: current.four_wheeler?.total_occupied || 0,
          thisYearVacant: current.four_wheeler?.total_vacant || 0,
        },
      ];
    }

    // Use prop data if available, otherwise use default
    if (propData) return propData;

    // Default fallback data
    return [
      {
        category: '2W',
        lastYearOccupied: 38,
        lastYearVacant: 12,
        thisYearOccupied: 42,
        thisYearVacant: 10,
      },
      {
        category: '4W',
        lastYearOccupied: 44,
        lastYearVacant: 22,
        thisYearOccupied: 46,
        thisYearVacant: 24,
      },
    ];
  };

  const chartData = getChartData();
  const hasYoy = Boolean(apiData?.data?.yoy);

  // Compute Y axis ticks dynamically based on data so labels are meaningful and visible
  const computeYAxisTicks = (data: OccupancyData[]) => {
    if (!data || data.length === 0) return [0, 15, 30, 45, 60];
    const values: number[] = [];
    data.forEach(d => {
      values.push(d.thisYearOccupied, d.thisYearVacant, d.lastYearOccupied, d.lastYearVacant);
    });
    const maxVal = Math.max(...values, 60);
    // Create 4 steps (5 ticks including 0)
    const steps = 4;
    const rawStep = Math.ceil(maxVal / steps);
    // Round step to nearest 5 for cleaner labels
    const step = Math.max(5, Math.ceil(rawStep / 5) * 5);
    const ticks = Array.from({ length: steps + 1 }, (_, i) => i * step);
    return ticks;
  };

  const yTicks = computeYAxisTicks(chartData);

  // Derive friendly compare label from selected date range (same logic used elsewhere)
  const getCompareLabel = (start?: string, end?: string) => {
    if (!start || !end) return 'Comparison';
    try {
      const startDateObj = new Date(start);
      const endDateObj = new Date(end);
      if (Number.isNaN(startDateObj.getTime()) || Number.isNaN(endDateObj.getTime())) return 'Comparison';
      const diffMs = endDateObj.getTime() - startDateObj.getTime();
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
      if (days >= 1 && days <= 3) return 'Day Comparison';
      if (days >= 6 && days <= 8) return 'Week Comparison';
      if (days >= 28 && days <= 31) return 'Month Comparison';
      if (days >= 360 && days <= 400) return 'Year Comparison';
      if (days > 400) return 'Multi-year Comparison';
      return 'Date Range Comparison';
    } catch (err) {
      return 'Comparison';
    }
  };

  const mapLabel = (label: string) => {
    switch (label) {
      case 'Day Comparison': return { current: 'This Day', compare: 'Last Day' };
      case 'Week Comparison': return { current: 'This Week', compare: 'Last Week' };
      case 'Month Comparison': return { current: 'This Month', compare: 'Last Month' };
      case 'Year Comparison': return { current: 'This Year', compare: 'Last Year' };
      case 'Multi-year Comparison': return { current: 'This Period', compare: 'Previous Period' };
      default: return { current: 'This Period', compare: 'Previous Period' };
    }
  };

  const compareLabel = getCompareLabel(startDate, endDate);
  const seriesLabels = mapLabel(compareLabel);

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
    if (active) {
      // Prefer reading values from chartData so zero values from backend are displayed
      const category = typeof label === 'string' ? label : '';
      const datum = chartData.find(d => d.category === category);

    if (datum) {
        return (
          <div className="bg-white p-4 border border-gray-300 rounded-lg shadow-lg">
            <p className="font-bold text-gray-800 mb-2">{category}</p>
            <div className="space-y-1">
              {occupancyView === 'yoy' && (
                <>
                  <div className="text-sm flex justify-between">
          <span style={{ color: CHART_COLORS.lastYearOccupied }}>{seriesLabels.compare} Occupied</span>
          <span className="font-semibold">{hasYoy ? datum.lastYearOccupied : 'N/A'}</span>
                  </div>
                  <div className="text-sm flex justify-between">
          <span style={{ color: CHART_COLORS.lastYearVacant }}>{seriesLabels.compare} Vacant</span>
          <span className="font-semibold">{hasYoy ? datum.lastYearVacant : 'N/A'}</span>
                  </div>
                </>
              )}
              <div className="text-sm flex justify-between">
        <span style={{ color: CHART_COLORS.thisYearOccupied }}>{seriesLabels.current} Occupied</span>
        <span className="font-semibold">{datum.thisYearOccupied}</span>
              </div>
              <div className="text-sm flex justify-between">
        <span style={{ color: CHART_COLORS.thisYearVacant }}>{seriesLabels.current} Vacant</span>
        <span className="font-semibold">{datum.thisYearVacant}</span>
              </div>
            </div>
          </div>
        );
      }

      // Fallback to payload if chartData doesn't have the category
      if (payload && payload.length) {
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
    }
    return null;
  };

  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-bold text-[#1A1A1A]">2W / 4W Occupancy</CardTitle>
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
            {/* Toggle Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                  onClick={() => setOccupancyView('current')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    occupancyView === 'current'
                      ? 'bg-[#f2eee9] text-[#bf213e]'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {seriesLabels.current}
                </button>
                <button
                  onClick={() => setOccupancyView('yoy')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    occupancyView === 'yoy'
                      ? 'bg-[#f2eee9] text-[#bf213e]'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {seriesLabels.compare}
                </button>
            </div>

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
                  domain={[0, yTicks[yTicks.length - 1]]}
                  ticks={yTicks}
                  interval={0}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', paddingBottom: '10px' }}
                  iconType="square"
                  formatter={(value) => {
                    const labels: { [key: string]: string } = {
                      'lastYearOccupied': `${seriesLabels.compare} Occupied`,
                      'lastYearVacant': `${seriesLabels.compare} Vacant`,
                      'thisYearOccupied': `${seriesLabels.current} Occupied`,
                      'thisYearVacant': `${seriesLabels.current} Vacant`
                    };
                    return <span style={{ color: '#6b7280', fontSize: '14px' }}>{labels[value] || value}</span>;
                  }}
                />
                {occupancyView === 'current' ? (
                  <>
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
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-48">
            <p className="text-gray-500">No occupancy data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
