import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import { toast as sonnerToast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Color palette matching ResponseTATCard
const CHART_COLORS = {
  twoWheeler: '#8B7355',      // Darker brown for 2W (matching openAchieved)
  fourWheeler: '#C4B99D',     // Original primary for 4W (matching openBreached)
};

// Colors used for last-year bars (lighter shades)
const LAST_YEAR_COLORS = {
  twoWheeler: '#DAD6CA',
  fourWheeler: '#E8E5DD',
};

interface FloorOccupancyData {
  floor: string;
  twoWheeler: number;
  fourWheeler: number;
  lastYearTwoWheeler?: number;
  lastYearFourWheeler?: number;
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
  const [occupancyView, setOccupancyView] = useState<'current' | 'yoy'>('current');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const { toast } = useToast();

  // Fetch data from API
  useEffect(() => {
    const fetchFloorwiseData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Calculate dates if not provided
        const endDateStr = endDate || new Date().toISOString().split('T')[0];
        const startDateStr = startDate || endDateStr; // single-day default

        // Previous period: previous day
        const previousStartDate = (() => {
          const date = new Date(startDateStr);
          date.setDate(date.getDate() - 1);
          return date.toISOString().split('T')[0];
        })();

        const previousEndDate = (() => {
          const date = new Date(endDateStr);
          date.setDate(date.getDate() - 1);
          return date.toISOString().split('T')[0];
        })();

        const url = getFullUrl('/parking_dashboard/floorwise_occupancy');
        const options = getAuthenticatedFetchOptions();
        
        const params = new URLSearchParams({
          start_date: startDateStr,
          end_date: endDateStr,
          previous_start_date: previousStartDate,
          previous_end_date: previousEndDate,
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
      const startDateStr = startDate || endDateStr;

      const previousStartDate = (() => {
        const date = new Date(startDateStr);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
      })();

      const previousEndDate = (() => {
        const date = new Date(endDateStr);
        date.setDate(date.getDate() - 1);
        return date.toISOString().split('T')[0];
      })();

      const url = getFullUrl('/parking_dashboard/floorwise_occupancy');
      const options = getAuthenticatedFetchOptions();
      
      const params = new URLSearchParams({
        start_date: startDateStr,
        end_date: endDateStr,
        previous_start_date: previousStartDate,
        previous_end_date: previousEndDate,
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
    if (!apiData?.data) return propData || [];

    // Get buildings from current year data
    const currentBuildings = apiData.data.current_year?.buildings || [];
    const previousBuildings = apiData.data.last_year?.buildings || [];

    // Filter buildings based on selection
    const filterBuildings = (buildings: any[]) => {
      if (selectedBuilding === 'all') return buildings;
      return buildings.filter((b: any) => b.building_id.toString() === selectedBuilding);
    };

    const filteredCurrentBuildings = filterBuildings(currentBuildings);
    const filteredPreviousBuildings = filterBuildings(previousBuildings);

    if (occupancyView === 'yoy') {
      // YoY comparison: merge current and previous year data
      const allFloors: FloorOccupancyData[] = [];

      // Process filtered current year buildings
      filteredCurrentBuildings.forEach((building: any) => {
        building.floors?.forEach((floor: any) => {
          if (floor.total_capacity === 0) return; // Skip empty floors
          
          allFloors.push({
            floor: `${floor.floor_name}`,
            twoWheeler: floor.two_wheeler?.total_occupied || 0,
            fourWheeler: floor.four_wheeler?.total_occupied || 0,
            percentage: floor.occupancy_pct || 0
          });
        });
      });

      // Add previous year data to matching floors
      filteredPreviousBuildings.forEach((building: any) => {
        building.floors?.forEach((floor: any) => {
          const existingFloor = allFloors.find(f => 
            f.floor === `${floor.floor_name}`
          );
          
          if (existingFloor) {
            existingFloor.lastYearTwoWheeler = floor.two_wheeler?.total_occupied || 0;
            existingFloor.lastYearFourWheeler = floor.four_wheeler?.total_occupied || 0;
          } else if (floor.total_capacity > 0) {
            // Add floor that only exists in previous year
            allFloors.push({
              floor: `${floor.floor_name}`,
              twoWheeler: 0,
              fourWheeler: 0,
              lastYearTwoWheeler: floor.two_wheeler?.total_occupied || 0,
              lastYearFourWheeler: floor.four_wheeler?.total_occupied || 0,
              percentage: 0
            });
          }
        });
      });

      return allFloors;
    } else {
      // Current year only
      const allFloors: FloorOccupancyData[] = [];

      filteredCurrentBuildings.forEach((building: any) => {
        building.floors?.forEach((floor: any) => {
          if (floor.total_capacity === 0) return; // Skip empty floors
          
          allFloors.push({
            floor: `${floor.floor_name}`,
            twoWheeler: floor.two_wheeler?.total_occupied || 0,
            fourWheeler: floor.four_wheeler?.total_occupied || 0,
            percentage: floor.occupancy_pct || 0
          });
        });
      });

      return allFloors;
    }
  };

  const chartData = getChartData();

  // Get available buildings from API data
  const getAvailableBuildings = () => {
    if (!apiData?.data?.current_year?.buildings) return [];
    return apiData.data.current_year.buildings.map((building: any) => ({
      id: building.building_id.toString(),
      name: building.building_name
    }));
  };

  const availableBuildings = getAvailableBuildings();

  // Derive friendly compare label from selected date range
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

  // Ensure horizontal scroll when there are many floors: each floor gets a minimum width
  const minChartWidth = Math.max(chartData.length * 100, 500); // 100px per floor, at least 500px

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
      const floorName = payload[0].payload?.floor || '';
      const datum = payload[0].payload as FloorOccupancyData;
      const hasPrev = typeof datum.lastYearTwoWheeler === 'number' || typeof datum.lastYearFourWheeler === 'number';
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-bold text-gray-800 mb-2 text-lg">{floorName}</p>
          <div className="space-y-1">
            {occupancyView === 'yoy' && (
              <>
                <div className="flex justify-between items-center gap-4">
                  <span className="font-medium" style={{ color: LAST_YEAR_COLORS.twoWheeler }}>{seriesLabels.compare} 2W:</span>
                  <span className="text-gray-700 font-semibold">{(datum.lastYearTwoWheeler ?? 0)}</span>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <span className="font-medium" style={{ color: LAST_YEAR_COLORS.fourWheeler }}>{seriesLabels.compare} 4W:</span>
                  <span className="text-gray-700 font-semibold">{(datum.lastYearFourWheeler ?? 0)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center gap-4">
              <span className="font-medium" style={{ color: CHART_COLORS.twoWheeler }}>This Year 2W:</span>
              <span className="text-gray-700 font-semibold">{datum.twoWheeler}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="font-medium" style={{ color: CHART_COLORS.fourWheeler }}>This Year 4W:</span>
              <span className="text-gray-700 font-semibold">{datum.fourWheeler}</span>
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
            {/* Building Filter Dropdown */}
            {availableBuildings.length > 0 && (
              <Select value={selectedBuilding} onValueChange={setSelectedBuilding}>
                <SelectTrigger className="w-[200px] h-9 bg-white border-gray-300">
                  <SelectValue placeholder="Select Building" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buildings</SelectItem>
                  {availableBuildings.map((building) => (
                    <SelectItem key={building.id} value={building.id}>
                      {building.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
              <div style={{ minWidth: minChartWidth }}>
                <ResponsiveContainer width="100%" height={400}>
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
                      // Map bar names to friendly labels where appropriate
                      const labels: { [key: string]: string } = {
                        'lastYearTwoWheeler': `${seriesLabels.compare} 2W`,
                        'lastYearFourWheeler': `${seriesLabels.compare} 4W`,
                        'twoWheeler': `${seriesLabels.current} 2W`,
                        'fourWheeler': `${seriesLabels.current} 4W`,
                      };
                      return <span style={{ color: '#6b7280', fontSize: '14px' }}>{labels[value] || value}</span>;
                    }}
                  />
                  {occupancyView === 'current' ? (
                    <>
                      <Bar 
                        dataKey="twoWheeler" 
                        stackId="stack"
                        fill={CHART_COLORS.twoWheeler}
                        name="twoWheeler"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar 
                        dataKey="fourWheeler" 
                        stackId="stack"
                        fill={CHART_COLORS.fourWheeler}
                        name="fourWheeler"
                        radius={[4, 4, 0, 0]}
                      />
                    </>
                  ) : (
                    <>
                      <Bar 
                        dataKey="lastYearTwoWheeler" 
                        stackId="lastYear"
                        fill="#DAD6CA"
                        name="lastYearTwoWheeler"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar 
                        dataKey="lastYearFourWheeler" 
                        stackId="lastYear"
                        fill="#E8E5DD"
                        name="lastYearFourWheeler"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="twoWheeler" 
                        stackId="thisYear"
                        fill={CHART_COLORS.twoWheeler}
                        name="twoWheeler"
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar 
                        dataKey="fourWheeler" 
                        stackId="thisYear"
                        fill={CHART_COLORS.fourWheeler}
                        name="fourWheeler"
                        radius={[4, 4, 0, 0]}
                      />
                    </>
                  )}
                </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Percentage Row */}
            {/* <div className="mt-4 flex justify-center gap-8 px-4">
              {chartData.map((floor, index) => (
                <div key={index} className="text-center min-w-[60px]">
                  <div className="text-sm font-semibold text-gray-700 mb-1">{floor.floor}</div>
                  <div className="text-lg font-bold text-green-600">
                    {floor.percentage ? `${floor.percentage}%` : '0%'}
                  </div>
                </div>
              ))}
            </div> */}
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
