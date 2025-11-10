import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Calendar as CalendarIcon, Download, Info, Package, Utensils, Loader2, ChevronRight, ChevronDown } from 'lucide-react';
import { FBAnalyticsSelector } from '@/components/FBAnalyticsSelector';
import { FBAnalyticsFilterDialog } from '@/components/FBAnalyticsFilterDialog';
import { RecentOrdersSidebar } from '@/components/RecentOrdersSidebar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  rectSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';
import { fbAnalyticsAPI, PopularRestaurant } from '@/services/fbAnalyticsAPI';

interface FBAnalyticsProps {
  defaultDateRange?: {
    fromDate: Date;
    toDate: Date;
  };
  selectedAnalyticsTypes?: string[];
  onAnalyticsChange?: (data: any) => void;
  showFilter?: boolean;
  showSelector?: boolean;
  showRecentOrders?: boolean;
  layout?: 'grid' | 'vertical' | 'horizontal';
  className?: string;
  totalOrdersCount?: number;
  onTotalOrdersExport?: () => void;
}

export const FBAnalyticsComponents: React.FC<FBAnalyticsProps> = ({
  defaultDateRange,
  selectedAnalyticsTypes = ['totalOrders', 'popularRestaurants', 'ordersOverTime', 'peakOrdering'],
  onAnalyticsChange,
  showFilter = true,
  showSelector = true,
  showRecentOrders = true,
  layout = 'grid',
  className = '',
  totalOrdersCount = 0,
  onTotalOrdersExport,
}) => {
  // Default date range (last 7 days to today)
  const getDefaultDateRange = () => {
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);
    return { fromDate: sevenDaysAgo, toDate: today };
  };

  // Format date for display (DD/MM/YYYY)
  const formatDateForDisplay = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Get formatted date range for display
  const getFormattedDateRange = () => {
    return `${formatDateForDisplay(analyticsDateRange.fromDate)} - ${formatDateForDisplay(analyticsDateRange.toDate)}`;
  };

  // State management
  const [analyticsDateRange, setAnalyticsDateRange] = useState(
    defaultDateRange || getDefaultDateRange()
  );
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [currentSelectedTypes, setCurrentSelectedTypes] = useState<string[]>(selectedAnalyticsTypes);
  
  // Order stats data state
  const [popularRestaurants, setPopularRestaurants] = useState<PopularRestaurant[]>([]);
  const [orderStatsLoading, setOrderStatsLoading] = useState(false);
  const [orderStatsError, setOrderStatsError] = useState<string | null>(null);
  const [ordersOverTime, setOrdersOverTime] = useState<any>(null);
  const [ordersOverTimeView, setOrdersOverTimeView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [peakOrdering, setPeakOrdering] = useState<any>(null);
  const [showPeakSlots, setShowPeakSlots] = useState(false);
  // Drag & Drop: card order (persist across sessions)
  const [cardOrder, setCardOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('fb_analytics_card_order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
    }
    // default order
    return ['totalOrders', 'popularRestaurants', 'ordersOverTime', 'peakOrdering'];
  });

  // Sync cardOrder with selected types (keep order, drop deselected, append newly selected at end)
  useEffect(() => {
    const selected = new Set(currentSelectedTypes);
    // Only consider known ids
    const knownIds = ['totalOrders', 'popularRestaurants', 'ordersOverTime', 'peakOrdering'];
    const filtered = cardOrder.filter((id) => selected.has(id) && knownIds.includes(id));
    const missing = currentSelectedTypes.filter((id) => knownIds.includes(id) && !filtered.includes(id));
    const next = [...filtered, ...missing];
    if (JSON.stringify(next) !== JSON.stringify(cardOrder)) {
      setCardOrder(next);
      localStorage.setItem('fb_analytics_card_order', JSON.stringify(next));
    }
  }, [currentSelectedTypes]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist cardOrder when it changes
  useEffect(() => {
    localStorage.setItem('fb_analytics_card_order', JSON.stringify(cardOrder));
  }, [cardOrder]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  // Sortable item wrapper
  const SortableItem: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style: React.CSSProperties = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.9 : 1,
      cursor: 'grab',
    };
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  };

  // Handle analytics filter apply
  const handleAnalyticsFilterApply = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    setAnalyticsDateRange({ fromDate: startDate, toDate: endDate });
  };

  // Handle analytics selection change
  const handleAnalyticsSelectionChange = (selectedTypes: string[]) => {
    setCurrentSelectedTypes(selectedTypes);
  };

  // Fetch order stats data
  const fetchOrderStats = async () => {
    if (!currentSelectedTypes.includes('popularRestaurants') && !currentSelectedTypes.includes('ordersOverTime') && !currentSelectedTypes.includes('peakOrdering')) {
      return;
    }

    setOrderStatsLoading(true);
    setOrderStatsError(null);
    
    try {
      const data = await fbAnalyticsAPI.getOrderStats(
        analyticsDateRange.fromDate,
        analyticsDateRange.toDate
      );
      
      const restaurants = data?.food_and_booking_statistics?.order_stats?.popular_restaurants || [];
      setPopularRestaurants(restaurants);
      
      // Store orders over time data
      const overTimeData = data?.food_and_booking_statistics?.orders_over_time || null;
      setOrdersOverTime(overTimeData);
      
      // Store peak ordering data
      const peakData = data?.food_and_booking_statistics?.peak_ordering || null;
      setPeakOrdering(peakData);
    } catch (error) {
      console.error('Error fetching order stats:', error);
      setOrderStatsError(error instanceof Error ? error.message : 'Failed to fetch order stats');
      toast.error('Failed to fetch popular restaurants data');
    } finally {
      setOrderStatsLoading(false);
    }
  };

  // Handle Peak Ordering export
  const handlePeakOrderingExport = async () => {
    try {
      const siteId = localStorage.getItem('selectedSiteId') || '0';
      const accessToken = localStorage.getItem('token') || '';
      const baseUrl = localStorage.getItem('baseUrl') || '';

      // Format dates for API
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const fromDate = formatDate(analyticsDateRange.fromDate);
      const toDate = formatDate(analyticsDateRange.toDate);

      const exportUrl = `https://${baseUrl}/pms/admin/food_orders/food_and_booking.json?site_id=${siteId}&access_token=${encodeURIComponent(accessToken)}&true=order_stats&from_date=${fromDate}&to_date=${toDate}&export=peak_hour_orders`;

      const response = await fetch(exportUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export peak ordering');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "peak_hour_orders.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Peak ordering exported successfully!');
    } catch (error) {
      console.error('Error exporting peak ordering:', error);
      toast.error('Failed to export peak ordering');
    }
  };

  // Handle Orders Over Time export
  const handleOrdersOverTimeExport = async () => {
    try {
      const siteId = localStorage.getItem('selectedSiteId') || '0';
      const accessToken = localStorage.getItem('token') || '';
      const baseUrl = localStorage.getItem('baseUrl') || '';

      // Format dates for API
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const fromDate = formatDate(analyticsDateRange.fromDate);
      const toDate = formatDate(analyticsDateRange.toDate);

      const exportUrl = `https://${baseUrl}/pms/admin/food_orders/food_and_booking.json?site_id=${siteId}&access_token=${encodeURIComponent(accessToken)}&true=order_stats&from_date=${fromDate}&to_date=${toDate}&export=order_overtime`;

      const response = await fetch(exportUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export orders over time');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "orders_over_time.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Orders over time exported successfully!');
    } catch (error) {
      console.error('Error exporting orders over time:', error);
      toast.error('Failed to export orders over time');
    }
  };

  // Handle Popular Restaurants export
  const handlePopularRestaurantsExport = async () => {
    try {
      const siteId = localStorage.getItem('selectedSiteId') || '0';
      const accessToken = localStorage.getItem('token') || '';
      const baseUrl = localStorage.getItem('baseUrl') || '';

      // Format dates for API
      const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const fromDate = formatDate(analyticsDateRange.fromDate);
      const toDate = formatDate(analyticsDateRange.toDate);

      const exportUrl = `https://${baseUrl}/pms/admin/food_orders/food_and_booking.json?site_id=${siteId}&access_token=${encodeURIComponent(accessToken)}&true=order_stats&from_date=${fromDate}&to_date=${toDate}&export=popular_restaurnats`;

      const response = await fetch(exportUrl, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export popular restaurants');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "popular_restaurants.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Popular restaurants exported successfully!');
    } catch (error) {
      console.error('Error exporting popular restaurants:', error);
      toast.error('Failed to export popular restaurants');
    }
  };

  // Watch for prop changes to defaultDateRange
  useEffect(() => {
    if (defaultDateRange &&
      (defaultDateRange.fromDate !== analyticsDateRange.fromDate ||
        defaultDateRange.toDate !== analyticsDateRange.toDate)) {
      setAnalyticsDateRange(defaultDateRange);
    }
  }, [defaultDateRange]);

  useEffect(() => {
    if (onAnalyticsChange) {
      onAnalyticsChange({
        dateRange: analyticsDateRange,
        selectedTypes: currentSelectedTypes,
      });
    }
  }, [analyticsDateRange, currentSelectedTypes, onAnalyticsChange]);

  // Fetch order stats when date range changes or popularRestaurants/ordersOverTime/peakOrdering is selected
  useEffect(() => {
    if (currentSelectedTypes.includes('popularRestaurants') || currentSelectedTypes.includes('ordersOverTime') || currentSelectedTypes.includes('peakOrdering')) {
      fetchOrderStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [analyticsDateRange.fromDate, analyticsDateRange.toDate, currentSelectedTypes]);

  // Render Popular Restaurants Card
  const renderPopularRestaurantsCard = () => {
    // Transform data for chart
    const chartData = popularRestaurants.map((restaurant) => ({
      name: restaurant.name.length > 20 ? restaurant.name.substring(0, 20) + '...' : restaurant.name,
      fullName: restaurant.name,
      value: restaurant.orders,
    }));

    return (
      <Card className="w-full border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C4B89D54] flex items-center justify-center">
                <Utensils className="w-5 h-5 text-[#C72030]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#C72030]">Popular Restaurants</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      <Info className="w-4 h-4 text-[#C72030]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                    <p className="text-sm font-medium">
                      Those Restaurants who had delivered out most orders associated to this {localStorage.getItem('selectedSiteName') || 'site'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePopularRestaurantsExport();
                }}
                className="w-8 h-8 p-0"
                title="Download Popular Restaurants data"
                disabled={popularRestaurants.length === 0}
              >
                <Download className="w-4 h-4 text-[#C72030]" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {orderStatsLoading ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                <span className="text-sm text-gray-600">Loading popular restaurants...</span>
              </div>
            </div>
          ) : orderStatsError ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-red-600 mb-2">{orderStatsError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchOrderStats}
                  className="text-xs"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    axisLine={{ stroke: '#D1D5DB' }}
                    tickLine={{ stroke: '#D1D5DB' }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={{ stroke: '#D1D5DB' }}
                    tickLine={{ stroke: '#D1D5DB' }}
                    label={{ value: 'Orders', angle: -90, position: 'insideLeft', offset: 10, fill: '#374151', fontSize: 12 }}
                  />
                  <RechartsTooltip
                    formatter={(value: number, name: string, props: any) => {
                      return [value, 'Orders'];
                    }}
                    labelFormatter={(label) => {
                      const item = chartData.find(d => d.name === label);
                      return item?.fullName || label;
                    }}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                    {chartData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill="#C4B99D" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No popular restaurants data available for the selected period</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render Orders Over Time Card
  const renderOrdersOverTimeCard = () => {
    // Get data based on selected view
    let chartData: any[] = [];
    let xAxisKey = 'period';
    let xAxisLabel = 'Period';

    if (ordersOverTime) {
      switch (ordersOverTimeView) {
        case 'daily':
          chartData = (ordersOverTime.daily || []).map((item: any) => ({
            period: item.period,
            label: `${item.period} (${item.day_name})`,
            count: item.count,
          }));
          xAxisKey = 'period';
          xAxisLabel = 'Date';
          break;
        case 'weekly':
          chartData = (ordersOverTime.weekly || []).map((item: any) => ({
            period: item.period,
            label: item.period,
            count: item.count,
          }));
          xAxisKey = 'period';
          xAxisLabel = 'Week';
          break;
        case 'monthly':
          chartData = (ordersOverTime.monthly || []).map((item: any) => ({
            period: item.period,
            label: item.month_name,
            count: item.count,
          }));
          xAxisKey = 'period';
          xAxisLabel = 'Month';
          break;
      }
    }

    return (
      <Card className="w-full border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C4B89D54] flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-[#C72030]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#C72030]">Orders Over Time</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      <Info className="w-4 h-4 text-[#C72030]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                    <p className="text-sm font-medium">
                      Order delivered overtime by all the restaurants and cafe associated to {localStorage.getItem('selectedSiteName') || 'site'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOrdersOverTimeExport();
                }}
                className="w-8 h-8 p-0"
                title="Download Orders Over Time data"
                disabled={!ordersOverTime || (ordersOverTime.daily?.length === 0 && ordersOverTime.weekly?.length === 0 && ordersOverTime.monthly?.length === 0)}
              >
                <Download className="w-4 h-4 text-[#C72030]" />
              </Button>
            </div>
          </div>
          
          {/* View Toggle Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              variant={ordersOverTimeView === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOrdersOverTimeView('daily')}
              className={ordersOverTimeView === 'daily' ? 'bg-[#C72030] text-white hover:bg-[#C72030]/90' : ''}
            >
              Daily
            </Button>
            <Button
              variant={ordersOverTimeView === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOrdersOverTimeView('weekly')}
              className={ordersOverTimeView === 'weekly' ? 'bg-[#C72030] text-white hover:bg-[#C72030]/90' : ''}
            >
              Weekly
            </Button>
            <Button
              variant={ordersOverTimeView === 'monthly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setOrdersOverTimeView('monthly')}
              className={ordersOverTimeView === 'monthly' ? 'bg-[#C72030] text-white hover:bg-[#C72030]/90' : ''}
            >
              Monthly
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {orderStatsLoading ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                <span className="text-sm text-gray-600">Loading orders over time...</span>
              </div>
            </div>
          ) : orderStatsError ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-red-600 mb-2">{orderStatsError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchOrderStats}
                  className="text-xs"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : chartData.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis
                    dataKey={xAxisKey}
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    axisLine={{ stroke: '#D1D5DB' }}
                    tickLine={{ stroke: '#D1D5DB' }}
                    label={{ value: xAxisLabel, position: 'bottom', offset: 10, fill: '#374151', fontSize: 12 }}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#6B7280' }}
                    axisLine={{ stroke: '#D1D5DB' }}
                    tickLine={{ stroke: '#D1D5DB' }}
                    label={{ value: 'Orders', angle: -90, position: 'insideLeft', offset: 10, fill: '#374151', fontSize: 12 }}
                  />
                  <RechartsTooltip
                    formatter={(value: number) => [value, 'Orders']}
                    labelFormatter={(label) => {
                      const item = chartData.find(d => d.period === label);
                      return item?.label || label;
                    }}
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                     stroke="#DBC2A9" 
                    strokeWidth={2}
                     dot={{ fill: '#DBC2A9', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No orders over time data available for the selected period</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render Peak Ordering Heat Map Card
  const renderPeakOrderingCard = () => {
    // Transform data for heat map
    const hourlyData = peakOrdering?.hourly_distribution || [];
    
    // Get unique hours (sorted)
    const allHours = Array.from(new Set(hourlyData.map((item: any) => item.hour as string)))
      .sort((a: string, b: string) => {
        const timeA = a.replace(' AM', '').replace(' PM', '').split(' ')[0];
        const timeB = b.replace(' AM', '').replace(' PM', '').split(' ')[0];
        const periodA = a.includes('AM') ? 0 : 1;
        const periodB = b.includes('AM') ? 0 : 1;
        const numA = parseInt(timeA);
        const numB = parseInt(timeB);
        
        if (periodA !== periodB) return periodA - periodB;
        if (numA === 12) return periodA === 0 ? -1 : 1;
        if (numB === 12) return periodB === 0 ? -1 : 1;
        return numA - numB;
      });
    
    // Get unique dates (sorted)
    const allDates = Array.from(new Set(hourlyData.map((item: any) => item.date as string)))
      .sort((a: string, b: string) => new Date(a).getTime() - new Date(b).getTime());
    
    // Create a map for quick lookup: date_hour -> count
    const dataMap = new Map<string, number>();
    hourlyData.forEach((item: any) => {
      const key = `${item.date}_${item.hour}`;
      dataMap.set(key, item.count);
    });
    
    // Find max count for color scaling
    const maxCount = Math.max(...Array.from(dataMap.values()), 1);
    
    // Color function based on count
    const getColor = (count: number) => {
      if (count === 0) return '#F3F4F6'; // Light gray for no data
      const intensity = count / maxCount;
      if (intensity < 0.2) return '#FEE2E2'; // Light red
      if (intensity < 0.4) return '#FECACA'; // Medium light red
      if (intensity < 0.6) return '#FCA5A5'; // Medium red
      if (intensity < 0.8) return '#F87171'; // Medium dark red
      return '#C72030'; // Dark red (brand color)
    };

    return (
      <Card className="w-full border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C4B89D54] flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-[#C72030]" />
              </div>
              <CardTitle className="text-xl font-bold text-[#C72030]">Peak Ordering</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0"
                    >
                      <Info className="w-4 h-4 text-[#C72030]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                    <p className="text-sm font-medium">
                      Orders at peak hours of restaurants and cafe associated to {localStorage.getItem('selectedSiteName') || 'site'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePeakOrderingExport();
                }}
                className="w-8 h-8 p-0"
                title="Download Peak Ordering data"
                disabled={!peakOrdering || !peakOrdering.hourly_distribution || peakOrdering.hourly_distribution.length === 0}
              >
                <Download className="w-4 h-4 text-[#C72030]" />
              </Button>
              {peakOrdering?.peak_slots && peakOrdering.peak_slots.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPeakSlots(!showPeakSlots)}
                  className="w-8 h-8 p-0"
                  title="Show Peak Slots"
                >
                  {showPeakSlots ? (
                    <ChevronDown className="w-4 h-4 text-[#C72030]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[#C72030]" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          {orderStatsLoading ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                <span className="text-sm text-gray-600">Loading peak ordering data...</span>
              </div>
            </div>
          ) : orderStatsError ? (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-red-600 mb-2">{orderStatsError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchOrderStats}
                  className="text-xs"
                >
                  Retry
                </Button>
              </div>
            </div>
          ) : hourlyData.length > 0 ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {/* Header with hours */}
                  <div className="flex mb-2">
                    <div className="w-24 flex-shrink-0"></div>
                    <div className="flex gap-1 flex-1">
                      {allHours.map((hour: string) => (
                        <div
                          key={hour}
                          className="flex-1 text-xs text-gray-600 font-medium text-center min-w-[60px]"
                        >
                          {hour}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Heat map grid */}
                  <div className="space-y-1">
                    {allDates.map((date: string) => {
                      const dateObj = new Date(date);
                      const dayName = hourlyData.find((item: any) => item.date === date)?.day_name || '';
                      const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      
                      return (
                        <div key={date} className="flex items-center gap-2">
                          <div className="w-24 flex-shrink-0 text-xs text-gray-700">
                            <div className="font-medium">{dayName}</div>
                            <div className="text-gray-500">{formattedDate}</div>
                          </div>
                          <div className="flex gap-1 flex-1">
                            {allHours.map((hour: string) => {
                              const key = `${date}_${hour}`;
                              const count = dataMap.get(key) || 0;
                              const color = getColor(count);
                              
                              return (
                                <TooltipProvider key={hour}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div
                                        className="flex-1 h-8 rounded border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity min-w-[60px] flex items-center justify-center"
                                        style={{ backgroundColor: color }}
                                      >
                                        {count > 0 && (
                                          <span className="text-xs font-semibold text-gray-800">
                                            {count}
                                          </span>
                                        )}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-900 text-white border-gray-700">
                                      <p className="text-sm">
                                        {dayName}, {formattedDate} at {hour}: {count} {count === 1 ? 'order' : 'orders'}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <span className="text-xs text-gray-600">Less</span>
                    <div className="flex gap-1">
                      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((intensity) => {
                        const count = Math.round(intensity * maxCount);
                        return (
                          <div
                            key={intensity}
                            className="w-6 h-4 rounded border border-gray-200"
                            style={{ backgroundColor: getColor(count) }}
                            title={`${count} orders`}
                          />
                        );
                      })}
                    </div>
                    <span className="text-xs text-gray-600">More</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No peak ordering data available for the selected period</p>
            </div>
          )}
          
          {/* Peak Slots Bar Chart */}
          {showPeakSlots && peakOrdering?.peak_slots && peakOrdering.peak_slots.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Peak Slots</h4>
              <div className="bg-gray-50 rounded-lg p-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={peakOrdering.peak_slots.map((slot: any) => ({
                      name: `${slot.day_name}, ${new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${slot.hour}`,
                      label: `${slot.day_name}, ${new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${slot.hour}`,
                      value: slot.count,
                    }))} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      axisLine={{ stroke: '#D1D5DB' }}
                      tickLine={{ stroke: '#D1D5DB' }}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#6B7280' }}
                      axisLine={{ stroke: '#D1D5DB' }}
                      tickLine={{ stroke: '#D1D5DB' }}
                      label={{ value: 'Orders', angle: -90, position: 'insideLeft', offset: 10, fill: '#374151', fontSize: 12 }}
                    />
                    <RechartsTooltip
                      formatter={(value: number) => [value, 'Orders']}
                      labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                      {peakOrdering.peak_slots.map((slot: any, index: number) => (
                        <Cell key={`cell-${index}`} fill="#C4B89D" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Render Peak Count Card
  const renderPeakCountCard = () => {
    const siteName = localStorage.getItem('selectedSiteName') || 'site';
    const peakCount = peakOrdering?.peak_count || 0;
    
    return (
      <div className="group relative bg-[#F6F4EE] rounded-lg border border-[#E5E5E5] hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="p-6">
          {/* Icon and Actions Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#C4B89D54] flex items-center justify-center">
              <CalendarIcon className="w-6 h-6 text-[#C72030]" />
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                    >
                      <Info className="w-4 h-4 text-[#6B7280]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                    <p className="text-sm font-medium">
                      Peak order count at the highest ordering hour for restaurants and cafes associated to this {siteName}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Title and Value */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-[#6B7280] leading-tight">
              Peak Count
            </h3>
            <div className="text-3xl font-semibold text-[#1F2937]">
              {orderStatsLoading ? (
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              ) : (
                peakCount.toLocaleString()
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render Total Orders Card
  const renderTotalOrdersCard = () => {
    const siteName = localStorage.getItem('selectedSiteName') || 'site';
    
    return (
      <div className="group relative bg-[#F6F4EE] rounded-lg border border-[#E5E5E5] hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="p-6">
          {/* Icon and Actions Row */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-[#C4B89D54] flex items-center justify-center">
              <Package className="w-6 h-6 text-[#C72030]" />
            </div>
            <div className="flex items-center gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                    >
                      <Info className="w-4 h-4 text-[#6B7280]" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-gray-700 max-w-xs">
                    <p className="text-sm font-medium">
                      Total Number of orders delivered across all the restaurants and cafes associated to this {siteName}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {onTotalOrdersExport && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTotalOrdersExport();
                  }}
                  className="w-8 h-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-white/50"
                  title="Download Total Orders data"
                  disabled={totalOrdersCount === 0}
                >
                  <Download className="w-4 h-4 text-[#C72030]" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Title and Value */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-[#6B7280] leading-tight">
              Total Orders
            </h3>
            <div className="text-3xl font-semibold text-[#1F2937]">
              {totalOrdersCount.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render layout based on layout prop with Drag & Drop support
  const renderLayout = () => {
    // Build card map for currently selected types
    const idToCard: Record<string, React.ReactNode> = {};

    if (currentSelectedTypes.includes('totalOrders')) {
      // Total Orders and Peak Count (small stat cards) grouped together when peakOrdering is present
      if (currentSelectedTypes.includes('peakOrdering') && peakOrdering?.peak_count !== undefined) {
        idToCard['totalOrders'] = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {renderTotalOrdersCard()}
            {renderPeakCountCard()}
          </div>
        );
      } else {
        idToCard['totalOrders'] = renderTotalOrdersCard();
      }
    }
    if (currentSelectedTypes.includes('popularRestaurants')) {
      idToCard['popularRestaurants'] = renderPopularRestaurantsCard();
    }
    if (currentSelectedTypes.includes('ordersOverTime')) {
      idToCard['ordersOverTime'] = renderOrdersOverTimeCard();
    }
    if (currentSelectedTypes.includes('peakOrdering')) {
      idToCard['peakOrdering'] = renderPeakOrderingCard();
    }

    // Final ordered ids to render
    const orderedIds = cardOrder.filter((id) => idToCard[id] != null);

    const onDragEnd = (event: any) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = orderedIds.indexOf(active.id);
      const newIndex = orderedIds.indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return;
      const next = arrayMove(orderedIds, oldIndex, newIndex);
      // Merge back into full order keeping any non-rendered ids in place
      const remaining = cardOrder.filter((id) => !orderedIds.includes(id));
      setCardOrder([...next, ...remaining]);
    };

    const gridWrapper = (children: React.ReactNode) => {
      if (layout === 'horizontal') return <div className="flex flex-wrap gap-4">{children}</div>;
      if (layout === 'vertical') return <div className="space-y-4">{children}</div>;
      return <div className="space-y-4">{children}</div>;
    };

    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={orderedIds} strategy={rectSortingStrategy}>
          {gridWrapper(
            orderedIds.map((id) => (
              <SortableItem key={id} id={id}>
                <div className="col-span-full">{idToCard[id]}</div>
              </SortableItem>
            ))
          )}
        </SortableContext>
      </DndContext>
    );
  };

  return (
    <div>
      <div className='mb-4'>
        {(showFilter || showSelector) && (
          <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
            {showFilter && (
              <Button
                onClick={() => setIsAnalyticsFilterOpen(true)}
                variant="outline"
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
              >
                <CalendarIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {getFormattedDateRange()}
                </span>
                <Filter className="w-4 h-4 text-gray-600" />
              </Button>
            )}

            {showSelector && (
              <FBAnalyticsSelector
                onSelectionChange={handleAnalyticsSelectionChange}
                dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                selectedOptions={currentSelectedTypes}
              />
            )}
          </div>
        )}
      </div>

      {showRecentOrders ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-2 min-h-[calc(100vh-200px)]">
          <div className="lg:col-span-8">
            <div className={`space-y-6 ${className}`}>
              {/* Analytics Cards */}
              {renderLayout()}

              {/* Analytics Filter Dialog */}
              <FBAnalyticsFilterDialog
                isOpen={isAnalyticsFilterOpen}
                onClose={() => setIsAnalyticsFilterOpen(false)}
                onApplyFilters={handleAnalyticsFilterApply}
                currentStartDate={analyticsDateRange.fromDate}
                currentEndDate={analyticsDateRange.toDate}
              />
            </div>
          </div>

          {/* Right Sidebar - Recent Orders */}
          <div className="lg:col-span-4">
            <RecentOrdersSidebar />
          </div>
        </div>
      ) : (
        <div className={`space-y-6 ${className}`}>
          {/* Analytics Cards */}
          {renderLayout()}

          {/* Analytics Filter Dialog */}
          <FBAnalyticsFilterDialog
            isOpen={isAnalyticsFilterOpen}
            onClose={() => setIsAnalyticsFilterOpen(false)}
            onApplyFilters={handleAnalyticsFilterApply}
            currentStartDate={analyticsDateRange.fromDate}
            currentEndDate={analyticsDateRange.toDate}
          />
        </div>
      )}
    </div>
  );
};

export default FBAnalyticsComponents;

