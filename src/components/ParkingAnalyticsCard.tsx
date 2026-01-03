import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Button } from '@/components/ui/button';
import { Download, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';

// Format large numbers for display (e.g., 1000 -> 1K, 1000000 -> 1M)
const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

// Custom tooltip formatter
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: <span className="font-semibold">{entry.value.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface ParkingAnalyticsCardProps {
  title: string;
  data: any;
  type?: 'peakHourTrends' | 'bookingPatterns' | 'occupancyRate' | 'averageDuration';
  className?: string;
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
}

export const ParkingAnalyticsCard: React.FC<ParkingAnalyticsCardProps> = ({
  title,
  data,
  type = 'peakHourTrends',
  className = '',
  startDate,
  endDate
}) => {
  const [localData, setLocalData] = useState(data);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [occupancyView, setOccupancyView] = useState<'current' | 'yoy'>('current');

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Fetch peak hour trends data from API
  useEffect(() => {
    if (type !== 'peakHourTrends') return;

    const fetchPeakHourTrends = async () => {
      setLoading(true);
      setError(null);
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

        const url = getFullUrl('/parking_dashboard/peak_hour_trends');
        const options = getAuthenticatedFetchOptions();
        
        const params = new URLSearchParams({
          start_date: startDateStr,
          end_date: endDateStr,
          previous_start_date: previousStartDate,
          compare_yoy: 'true',
        });

        const fullUrl = `${url}?${params.toString()}`;
        console.log('🔍 Fetching peak hour trends:', fullUrl);
        const response = await fetch(fullUrl, options);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch peak hour trends: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Peak hour trends data:', result);
        setApiData(result);
      } catch (err) {
        console.error('Error fetching peak hour trends:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch peak hour trends');
        toast.error('Failed to fetch peak hour trends data');
      } finally {
        setLoading(false);
      }
    };

    fetchPeakHourTrends();
  }, [type, startDate, endDate]);

  // Fetch booking patterns data from API
  useEffect(() => {
    if (type !== 'bookingPatterns') return;

    const fetchBookingPatterns = async () => {
      setLoading(true);
      setError(null);
      try {
        const endDateStr = endDate || new Date().toISOString().split('T')[0];
        const startDateStr = startDate || (() => {
          const date = new Date();
          date.setFullYear(date.getFullYear(), 0, 1); // Start of current year
          return date.toISOString().split('T')[0];
        })();

        // Calculate previous year start date (one year before start date)
        const previousStartDate = (() => {
          const date = new Date(startDateStr);
          date.setFullYear(date.getFullYear() - 1);
          return date.toISOString().split('T')[0];
        })();

        const url = getFullUrl('/parking_dashboard/yearly_comparison');
        const options = getAuthenticatedFetchOptions();
        
        const params = new URLSearchParams({
          start_date: startDateStr,
          end_date: endDateStr,
          previous_start_date: previousStartDate,
          compare_yoy: 'true',
        });

        const fullUrl = `${url}?${params.toString()}`;
        console.log('🔍 Fetching yearly comparison:', fullUrl);
        const response = await fetch(fullUrl, options);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch yearly comparison: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Yearly comparison data:', result);
        setApiData(result);
      } catch (err) {
        console.error('Error fetching yearly comparison:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch yearly comparison');
        toast.error('Failed to fetch yearly comparison data');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingPatterns();
  }, [type, startDate, endDate]);

  // Fetch cancelled bookings data from API
  useEffect(() => {
    if (type !== 'occupancyRate') return;

    const fetchCancelledBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const endDateStr = endDate || new Date().toISOString().split('T')[0];
        const startDateStr = startDate || (() => {
          const date = new Date();
          date.setMonth(date.getMonth() - 1);
          return date.toISOString().split('T')[0];
        })();

        // Calculate compare dates (previous year same period)
        const compareEndDate = (() => {
          const date = new Date(endDateStr);
          date.setFullYear(date.getFullYear() - 1);
          return date.toISOString().split('T')[0];
        })();

        const compareStartDate = (() => {
          const date = new Date(startDateStr);
          date.setFullYear(date.getFullYear() - 1);
          return date.toISOString().split('T')[0];
        })();

        const url = getFullUrl('/parking_dashboard/cancelled_bookings');
        const options = getAuthenticatedFetchOptions();
        
        const params = new URLSearchParams({
          from_date: startDateStr,
          to_date: endDateStr,
          compare_from_date: compareStartDate,
          compare_to_date: compareEndDate,
        });

        const fullUrl = `${url}?${params.toString()}`;
        console.log('🔍 Fetching cancelled bookings:', fullUrl);
        const response = await fetch(fullUrl, options);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch cancelled bookings: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('✅ Cancelled bookings data:', result);
        setApiData(result);
      } catch (err) {
        console.error('Error fetching cancelled bookings:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cancelled bookings');
        toast.error('Failed to fetch cancelled bookings data');
      } finally {
        setLoading(false);
      }
    };

    fetchCancelledBookings();
  }, [type, startDate, endDate]);

  const handleDownload = async () => {
    try {
      toast.info('Download functionality coming soon');
    } catch (error) {
      console.error('Error downloading:', error);
      toast.error('Failed to download');
    }
  };

  const renderChart = () => {
    if (!localData) {
      return <div className="text-center text-[#6B7280] py-8">No data available</div>;
    }

    switch (type) {
      case 'peakHourTrends': {
        // Transform API data or use sample data
        const peakHourData = apiData?.data?.hourly_trends ? 
          apiData.data.hourly_trends.map((current: any, index: number) => {
            const yoy = apiData.data.yoy_hourly_trends?.[index];
            return {
              time: current.time,
              lastYear: yoy?.occupancy || 0,
              thisYear: current.occupancy || 0
            };
          }) : [
          { time: '06:00', lastYear: 20, thisYear: 25 },
          { time: '08:00', lastYear: 60, thisYear: 62 },
          { time: '10:00', lastYear: 85, thisYear: 88 },
          { time: '12:00', lastYear: 70, thisYear: 68 },
          { time: '14:00', lastYear: 65, thisYear: 65 },
          { time: '16:00', lastYear: 92, thisYear: 95 },
          { time: '18:00', lastYear: 75, thisYear: 78 },
        ];

        return (
          <div className="w-full">
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
                Current Year
              </button>
              <button
                onClick={() => setOccupancyView('yoy')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  occupancyView === 'yoy'
                    ? 'bg-[#f2eee9] text-[#bf213e]'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Compare YoY
              </button>
            </div>

            {/* Chart */}
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={peakHourData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={formatNumber}
                    label={{ value: 'Bookings', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  
                  {occupancyView === 'current' ? (
                    <Line 
                      type="monotone" 
                      dataKey="thisYear" 
                      name="This Year" 
                      stroke="#C4B99D" 
                      strokeWidth={2}
                      dot={{ r: 5, fill: '#C4B99D', stroke: '#ffffff', strokeWidth: 2 }}
                      activeDot={{ r: 7 }}
                    />
                  ) : (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="lastYear" 
                        name="Last Year" 
                        stroke="#DAD6CA" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4, fill: '#DAD6CA' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="thisYear" 
                        name="This Year" 
                        stroke="#C4B99D" 
                        strokeWidth={2}
                        dot={{ r: 5, fill: '#C4B99D', stroke: '#ffffff', strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }

      case 'bookingPatterns': {
        // Transform API data or use sample data
        const bookingPatternDataAll = apiData?.data ? [
          { 
            year: `${apiData.data.previous_year.year}`, 
            occupied: apiData.data.previous_year.occupied || 0, 
            vacant: apiData.data.previous_year.vacant || 0,
            utilization: apiData.data.previous_year.utilization_percent || 0
          },
          { 
            year: `${apiData.data.current_year.year}`, 
            occupied: apiData.data.current_year.occupied || 0, 
            vacant: apiData.data.current_year.vacant || 0,
            utilization: apiData.data.current_year.utilization_percent || 0
          },
        ] : [
          { 
            year: 'Last Year', 
            occupied: 78, 
            vacant: 32,
            utilization: 70.9
          },
          { 
            year: 'This Year', 
            occupied: 88, 
            vacant: 34,
            utilization: 72.1
          },
        ];

        // Filter data based on view
        const bookingPatternData = occupancyView === 'current' 
          ? [bookingPatternDataAll[1]] // Only current year
          : bookingPatternDataAll; // Both years

        return (
          <div className="w-full">
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
                Current Year
              </button>
              <button
                onClick={() => setOccupancyView('yoy')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  occupancyView === 'yoy'
                    ? 'bg-[#f2eee9] text-[#bf213e]'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Compare YoY
              </button>
            </div>

            {/* Chart */}
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingPatternData} margin={{ top: 20, right: 30, left: 10, bottom: 60 }}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    tick={{ fontSize: 14, fill: '#6b7280', fontWeight: 500 }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="square"
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Bar dataKey="occupied" name="Occupied" fill="#8b7355" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vacant" name="Vacant" fill="#c4b99d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }

      case 'occupancyRate': {
        // Transform API data or use sample data
        const releasedCancelledData = apiData ? (() => {
          const currentData = apiData.current || {};
          const compareData = apiData.compare || {};
          
          // Detect the format of the keys and transform accordingly
          const dataMap = new Map();
          
          // Helper function to detect key format
          const detectFormat = (key: string): 'daily' | 'weekly' | 'monthly' => {
            // Daily format: YYYY-MM-DD (e.g., "2025-12-26")
            if (/^\d{4}-\d{2}-\d{2}$/.test(key)) return 'daily';
            // Weekly format: YYYYWW (e.g., "202549" - 6 digits)
            if (/^\d{6}$/.test(key)) return 'weekly';
            // Monthly format: YYYY-MM (e.g., "2025-09")
            if (/^\d{4}-\d{2}$/.test(key)) return 'monthly';
            return 'daily'; // default
          };
          
          // Process current year data
          const currentKeys = Object.keys(currentData);
          const format = currentKeys.length > 0 ? detectFormat(currentKeys[0]) : 'daily';
          
          Object.entries(currentData).forEach(([key, count]) => {
            let dateLabel: string;
            let sortKey: string;
            
            if (format === 'daily') {
              // Daily format: YYYY-MM-DD
              const date = new Date(key);
              const day = date.getDate();
              const month = date.toLocaleString('default', { month: 'short' });
              const year = date.getFullYear();
              dateLabel = `${day} ${month}, ${year}`;
              sortKey = key; // Use ISO date for sorting
            } else if (format === 'weekly') {
              // Weekly format: YYYYWW
              const year = parseInt(key.substring(0, 4));
              const week = parseInt(key.substring(4));
              dateLabel = `Week ${week}, ${year}`;
              sortKey = key; // Use week key for sorting
            } else {
              // Monthly format: YYYY-MM
              const [year, month] = key.split('-');
              const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' });
              dateLabel = `${monthName} ${year}`;
              sortKey = key; // Use month key for sorting
            }
            
            if (!dataMap.has(dateLabel)) {
              dataMap.set(dateLabel, { 
                date: dateLabel, 
                thisYearCancelled: 0, 
                lastYearCancelled: 0,
                sortKey 
              });
            }
            
            const entry = dataMap.get(dateLabel);
            entry.thisYearCancelled = count as number;
          });
          
          // Process compare year data
          Object.entries(compareData).forEach(([key, count]) => {
            let dateLabel: string;
            let sortKey: string;
            
            if (format === 'daily') {
              // Daily format: YYYY-MM-DD
              const date = new Date(key);
              const day = date.getDate();
              const month = date.toLocaleString('default', { month: 'short' });
              const year = date.getFullYear();
              dateLabel = `${day} ${month}, ${year}`;
              sortKey = key;
            } else if (format === 'weekly') {
              // Weekly format: YYYYWW
              const year = parseInt(key.substring(0, 4));
              const week = parseInt(key.substring(4));
              dateLabel = `Week ${week}, ${year}`;
              sortKey = key;
            } else {
              // Monthly format: YYYY-MM
              const [year, month] = key.split('-');
              const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'short' });
              dateLabel = `${monthName} ${year}`;
              sortKey = key;
            }
            
            if (!dataMap.has(dateLabel)) {
              dataMap.set(dateLabel, { 
                date: dateLabel, 
                thisYearCancelled: 0, 
                lastYearCancelled: count as number,
                sortKey 
              });
            } else {
              const entry = dataMap.get(dateLabel);
              entry.lastYearCancelled = count as number;
            }
          });
          
          // Convert map to array and sort by sortKey
          return Array.from(dataMap.values()).sort((a, b) => {
            return a.sortKey.localeCompare(b.sortKey);
          });
        })() : [
          { date: '2025-12-01', thisYearCancelled: 2, lastYearCancelled: 3 },
          { date: '2025-12-02', thisYearCancelled: 1, lastYearCancelled: 2 },
          { date: '2025-12-03', thisYearCancelled: 3, lastYearCancelled: 4 },
        ];

        return (
          <div className="w-full">
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
                Current Year
              </button>
              <button
                onClick={() => setOccupancyView('yoy')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  occupancyView === 'yoy'
                    ? 'bg-[#f2eee9] text-[#bf213e]'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Compare YoY
              </button>
            </div>

            {/* Chart */}
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={releasedCancelledData} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  
                  {occupancyView === 'current' ? (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="thisYearCancelled" 
                        name="Cancelled Bookings" 
                        stroke="#c4b99d" 
                        strokeWidth={2}
                        dot={{ r: 5, fill: '#c4b99d', stroke: '#ffffff', strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                      />
                    </>
                  ) : (
                    <>
                      <Line 
                        type="monotone" 
                        dataKey="lastYearCancelled" 
                        name="Last Year Cancelled" 
                        stroke="#DAD6CA" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4, fill: '#DAD6CA' }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="thisYearCancelled" 
                        name="This Year Cancelled" 
                        stroke="#c4b99d" 
                        strokeWidth={2}
                        dot={{ r: 5, fill: '#c4b99d', stroke: '#ffffff', strokeWidth: 2 }}
                        activeDot={{ r: 7 }}
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }

      case 'averageDuration': {
        // Sample data for Auto-Releases by Department (Horizontal Bar Chart)
        const durationDataAll = [
          { category: 'HR', thisYear: 25, lastYear: 22 },
          { category: 'Sales', thisYear: 45, lastYear: 40 },
          { category: 'Support', thisYear: 62, lastYear: 58 },
          { category: 'Admin', thisYear: 38, lastYear: 35 },
        ];

        return (
          <div className="w-full">
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
                Current Year
              </button>
              <button
                onClick={() => setOccupancyView('yoy')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  occupancyView === 'yoy'
                    ? 'bg-[#f2eee9] text-[#bf213e]'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Compare YoY
              </button>
            </div>

            {/* Chart */}
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={durationDataAll} 
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
                >
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                  <XAxis 
                    type="number"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={formatNumber}
                  />
                  <YAxis 
                    type="category"
                    dataKey="category" 
                    tick={{ fontSize: 14, fill: '#6b7280' }}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="square"
                  />
                  
                  {occupancyView === 'current' ? (
                    <Bar 
                      dataKey="thisYear" 
                      name="This Year" 
                      fill="#c4b99d" 
                      radius={[0, 4, 4, 0]} 
                    />
                  ) : (
                    <>
                      <Bar 
                        dataKey="lastYear" 
                        name="Last Year" 
                        fill="#DAD6CA" 
                        radius={[0, 4, 4, 0]} 
                      />
                      <Bar 
                        dataKey="thisYear" 
                        name="This Year" 
                        fill="#c4b99d" 
                        radius={[0, 4, 4, 0]} 
                      />
                    </>
                  )}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      }

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className={`p-4 border rounded-lg mb-4 bg-white ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-[#1A1A1A]">{title}</h3>
          {loading && <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />}
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw
            className={`w-5 h-5 text-[#000000] hover:text-[#333333] cursor-pointer transition-colors ${refreshLoading || loading ? 'animate-spin opacity-50' : ''}`}
            onClick={async () => {
              if (refreshLoading || loading) return;
              setRefreshLoading(true);
              try {
                if (type === 'peakHourTrends') {
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

                  const url = getFullUrl('/parking_dashboard/peak_hour_trends');
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
                    throw new Error(`Failed to fetch peak hour trends: ${response.statusText}`);
                  }

                  const result = await response.json();
                  setApiData(result);
                  toast.success('Peak hour trends refreshed');
                } else if (type === 'bookingPatterns') {
                  const endDateStr = endDate || new Date().toISOString().split('T')[0];
                  const startDateStr = startDate || (() => {
                    const date = new Date();
                    date.setFullYear(date.getFullYear(), 0, 1); // Start of current year
                    return date.toISOString().split('T')[0];
                  })();

                  // Calculate previous year start date (one year before start date)
                  const previousStartDate = (() => {
                    const date = new Date(startDateStr);
                    date.setFullYear(date.getFullYear() - 1);
                    return date.toISOString().split('T')[0];
                  })();

                  const url = getFullUrl('/parking_dashboard/yearly_comparison');
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
                    throw new Error(`Failed to fetch yearly comparison: ${response.statusText}`);
                  }

                  const result = await response.json();
                  setApiData(result);
                  toast.success('Yearly comparison refreshed');
                } else if (type === 'occupancyRate') {
                  const endDateStr = endDate || new Date().toISOString().split('T')[0];
                  const startDateStr = startDate || (() => {
                    const date = new Date();
                    date.setMonth(date.getMonth() - 1);
                    return date.toISOString().split('T')[0];
                  })();

                  const compareEndDate = (() => {
                    const date = new Date(endDateStr);
                    date.setFullYear(date.getFullYear() - 1);
                    return date.toISOString().split('T')[0];
                  })();

                  const compareStartDate = (() => {
                    const date = new Date(startDateStr);
                    date.setFullYear(date.getFullYear() - 1);
                    return date.toISOString().split('T')[0];
                  })();

                  const url = getFullUrl('/parking_dashboard/cancelled_bookings');
                  const options = getAuthenticatedFetchOptions();
                  
                  const params = new URLSearchParams({
                    from_date: startDateStr,
                    to_date: endDateStr,
                    compare_from_date: compareStartDate,
                    compare_to_date: compareEndDate,
                  });

                  const fullUrl = `${url}?${params.toString()}`;
                  const response = await fetch(fullUrl, options);
                  
                  if (!response.ok) {
                    throw new Error(`Failed to fetch cancelled bookings: ${response.statusText}`);
                  }

                  const result = await response.json();
                  setApiData(result);
                  toast.success('Cancelled bookings refreshed');
                } else {
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  toast.success('Data refreshed');
                }
              } catch (error) {
                console.error('Error refreshing:', error);
                toast.error('Failed to refresh');
              } finally {
                setRefreshLoading(false);
              }
            }}
          />
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Chart */}
      {renderChart()}
    </div>
  );
};
