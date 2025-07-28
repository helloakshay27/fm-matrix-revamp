// new comment //
import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { Calendar, BarChart3, TrendingUp, Activity, Package, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatsCard } from '@/components/StatsCard';
import { UnifiedAnalyticsSelector } from '@/components/dashboard/UnifiedAnalyticsSelector';
import { UnifiedDateRangeFilter } from '@/components/dashboard/UnifiedDateRangeFilter';
import { AnalyticsGrid } from '@/components/dashboard/AnalyticsGrid';
import { TicketAnalyticsCard } from '@/components/dashboard/TicketAnalyticsCard';
import { TaskAnalyticsCard } from '@/components/TaskAnalyticsCard';
import { AMCAnalyticsCard } from '@/components/AMCAnalyticsCard';
import { InventoryAnalyticsCard } from '@/components/InventoryAnalyticsCard';
import { ScheduleAnalyticsCard } from '@/components/dashboard/ScheduleAnalyticsCard';
import { AssetAnalyticsCard } from '@/components/dashboard/AssetAnalyticsCard';
import { ticketAnalyticsAPI } from '@/services/ticketAnalyticsAPI';
import { taskAnalyticsAPI } from '@/services/taskAnalyticsAPI';
import { amcAnalyticsAPI } from '@/services/amcAnalyticsAPI';
import { inventoryAnalyticsAPI } from '@/services/inventoryAnalyticsAPI';
import { scheduleAnalyticsAPI } from '@/services/scheduleAnalyticsAPI';
import { assetAnalyticsAPI } from '@/services/assetAnalyticsAPI';
import { toast } from 'sonner';

interface SelectedAnalytic {
  id: string;
  module: 'tickets' | 'tasks' | 'schedule' | 'inventory' | 'amc' | 'assets';
  endpoint: string;
  title: string;
}

interface DashboardData {
  tickets: any;
  tasks: any;
  schedule: any;
  inventory: any;
  amc: any;
  assets: any;
}

export const Dashboard = () => {
  const [selectedAnalytics, setSelectedAnalytics] = useState<SelectedAnalytic[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    to: new Date(),
  });
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    tickets: null,
    tasks: null,
    schedule: null,
    inventory: null,
    amc: null,
    assets: null,
  });
  const [loading, setLoading] = useState(false);
  const [chartOrder, setChartOrder] = useState<string[]>([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Update chart order when selected analytics change
  useEffect(() => {
    setChartOrder(selectedAnalytics.map(analytic => analytic.id));
  }, [selectedAnalytics]);

  // Fetch analytics data based on selections and date range
  const fetchAnalyticsData = async () => {
    if (!dateRange?.from || !dateRange?.to || selectedAnalytics.length === 0) return;

    setLoading(true);
    try {
      const promises: Promise<any>[] = [];
      const updatedData: Partial<DashboardData> = {};

      // Group analytics by module to minimize API calls
      const moduleGroups = selectedAnalytics.reduce((groups, analytic) => {
        if (!groups[analytic.module]) groups[analytic.module] = [];
        groups[analytic.module].push(analytic);
        return groups;
      }, {} as Record<string, SelectedAnalytic[]>);

      // Fetch data for each module
      for (const [module, analytics] of Object.entries(moduleGroups)) {
        switch (module) {
          case 'tickets':
            for (const analytic of analytics) {
              switch (analytic.endpoint) {
                case 'tickets_categorywise':
                  promises.push(ticketAnalyticsAPI.getTicketsCategorywiseData(dateRange.from, dateRange.to));
                  break;
                case 'ticket_status':
                  promises.push(ticketAnalyticsAPI.getTicketStatusData(dateRange.from, dateRange.to));
                  break;
                case 'ticket_aging_matrix':
                  promises.push(ticketAnalyticsAPI.getTicketAgingMatrix(dateRange.from, dateRange.to));
                  break;
                case 'unit_categorywise':
                  promises.push(ticketAnalyticsAPI.getUnitCategorywiseData(dateRange.from, dateRange.to));
                  break;
                case 'response_tat':
                  promises.push(ticketAnalyticsAPI.getResponseTATData(dateRange.from, dateRange.to));
                  break;
                case 'resolution_tat':
                  promises.push(ticketAnalyticsAPI.getResolutionTATReportData(dateRange.from, dateRange.to));
                  break;
              }
            }
            break;

          case 'tasks':
            for (const analytic of analytics) {
              switch (analytic.endpoint) {
                case 'technical_checklist':
                  promises.push(taskAnalyticsAPI.getTechnicalChecklistData(dateRange.from, dateRange.to));
                  break;
                case 'non_technical_checklist':
                  promises.push(taskAnalyticsAPI.getNonTechnicalChecklistData(dateRange.from, dateRange.to));
                  break;
                case 'top_ten_checklist':
                  promises.push(taskAnalyticsAPI.getTopTenChecklistData(dateRange.from, dateRange.to));
                  break;
                case 'site_wise_checklist':
                  promises.push(taskAnalyticsAPI.getSiteWiseChecklistData(dateRange.from, dateRange.to));
                  break;
              }
            }
            break;

          case 'amc':
            promises.push(amcAnalyticsAPI.getAMCStatusData(dateRange.from, dateRange.to));
            break;

          case 'inventory':
            for (const analytic of analytics) {
              switch (analytic.endpoint) {
                case 'items_status':
                  promises.push(inventoryAnalyticsAPI.getItemsStatus(dateRange.from, dateRange.to));
                  break;
                case 'category_wise':
                  promises.push(inventoryAnalyticsAPI.getCategoryWise(dateRange.from, dateRange.to));
                  break;
                case 'green_consumption':
                  promises.push(inventoryAnalyticsAPI.getGreenConsumption(dateRange.from, dateRange.to));
                  break;
                case 'aging_matrix':
                  promises.push(inventoryAnalyticsAPI.getAgingMatrix(dateRange.from, dateRange.to));
                  break;
                case 'low_stock':
                  promises.push(inventoryAnalyticsAPI.getLowStockItems(dateRange.from, dateRange.to));
                  break;
                case 'high_value':
                  promises.push(inventoryAnalyticsAPI.getHighValueItems(dateRange.from, dateRange.to));
                  break;
              }
            }
            break;

          case 'schedule':
            for (const analytic of analytics) {
              switch (analytic.endpoint) {
                case 'schedule_overview':
                  promises.push(scheduleAnalyticsAPI.getScheduleOverview(dateRange.from, dateRange.to));
                  break;
                case 'schedule_completion':
                  promises.push(scheduleAnalyticsAPI.getScheduleCompletion(dateRange.from, dateRange.to));
                  break;
                case 'resource_utilization':
                  promises.push(scheduleAnalyticsAPI.getResourceUtilization(dateRange.from, dateRange.to));
                  break;
              }
            }
            break;

          case 'assets':
            for (const analytic of analytics) {
              switch (analytic.endpoint) {
                case 'group_wise':
                  promises.push(assetAnalyticsAPI.getGroupWiseAssets(dateRange.from, dateRange.to));
                  break;
                case 'asset_status':
                  promises.push(assetAnalyticsAPI.getAssetStatus(dateRange.from, dateRange.to));
                  break;
                case 'asset_statistics':
                  promises.push(assetAnalyticsAPI.getAssetStatistics(dateRange.from, dateRange.to));
                  break;
                case 'asset_breakdown':
                  promises.push(assetAnalyticsAPI.getAssetBreakdown(dateRange.from, dateRange.to));
                  break;
                case 'category_wise':
                  promises.push(assetAnalyticsAPI.getCategoryWiseAssets(dateRange.from, dateRange.to));
                  break;
                case 'overall_analytics':
                  promises.push(assetAnalyticsAPI.getOverallAssetAnalytics(dateRange.from, dateRange.to));
                  break;
              }
            }
            break;
        }
      }

      const results = await Promise.allSettled(promises);
      
      // Process results and map to dashboard data
      let resultIndex = 0;
      for (const [module, analytics] of Object.entries(moduleGroups)) {
        const moduleData: any = {};
        for (const analytic of analytics) {
          const result = results[resultIndex++];
          if (result.status === 'fulfilled') {
            moduleData[analytic.endpoint] = result.value;
          } else {
            console.error(`Failed to fetch ${analytic.endpoint}:`, result.reason);
            toast.error(`Failed to fetch ${analytic.title}`);
          }
        }
        updatedData[module as keyof DashboardData] = moduleData;
      }

      setDashboardData(prev => ({ ...prev, ...updatedData }));
      toast.success('Dashboard data updated successfully');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when selections or date range changes
  useEffect(() => {
    if (selectedAnalytics.length > 0 && dateRange?.from && dateRange?.to) {
      fetchAnalyticsData();
    }
  }, [selectedAnalytics, dateRange]);

  const handleAnalyticsSelectionChange = (analytics: SelectedAnalytic[]) => {
    setSelectedAnalytics(analytics);
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Calculate summary stats
  const getSummaryStats = () => {
    let totalTickets = 0;
    let completedTasks = 0;
    let activeAMCs = 0;
    let lowStockItems = 0;

    // Calculate total tickets from ticket status data
    if (dashboardData.tickets?.ticket_status?.overall) {
      const overall = dashboardData.tickets.ticket_status.overall;
      totalTickets = (overall.total_open || 0) + (overall.total_closed || 0) + (overall.total_wip || 0);
    }

    // Calculate completed tasks from technical checklist
    if (dashboardData.tasks?.technical_checklist?.response) {
      const response = dashboardData.tasks.technical_checklist.response;
      const responseData = response as Record<string, any>;
      completedTasks = Object.values(responseData).reduce((sum: number, item: any) => sum + Number(item?.closed || 0), 0);
    }

    // Get active AMCs
    if (dashboardData.amc?.active_amc) {
      activeAMCs = dashboardData.amc.active_amc;
    }

    // Get low stock items count
    if (dashboardData.inventory?.low_stock?.items) {
      lowStockItems = dashboardData.inventory.low_stock.items.length;
    } else if (dashboardData.inventory?.items_status) {
      // Fallback to items status data
      lowStockItems = dashboardData.inventory.items_status.count_of_critical_items || 0;
    }

    // Add asset stats if available
    let totalAssets = 0;
    if (dashboardData.assets?.asset_statistics) {
      totalAssets = dashboardData.assets.asset_statistics.total_assets || 0;
    } else if (dashboardData.assets?.overall_analytics) {
      totalAssets = dashboardData.assets.overall_analytics.summary?.total_assets || 0;
    }

    return { totalTickets, completedTasks, activeAMCs, lowStockItems, totalAssets };
  };

  const summaryStats = getSummaryStats();

  const renderAnalyticsCard = (analytic: SelectedAnalytic) => {
    const data = dashboardData[analytic.module]?.[analytic.endpoint];
    
    switch (analytic.module) {
      case 'tickets':
        return (
          <TicketAnalyticsCard
            key={analytic.id}
            title={analytic.title}
            data={data}
            type={analytic.endpoint as any}
          />
        );
      case 'tasks':
        // Map endpoint names to TaskAnalyticsCard type values
        const getTaskAnalyticsType = (endpoint: string) => {
          switch (endpoint) {
            case 'technical_checklist': return 'technical';
            case 'non_technical_checklist': return 'nonTechnical';
            case 'top_ten_checklist': return 'topTen';
            case 'site_wise_checklist': return 'siteWise';
            default: return 'technical';
          }
        };
        
        return (
          <TaskAnalyticsCard
            key={analytic.id}
            title={analytic.title}
            data={data}
            type={getTaskAnalyticsType(analytic.endpoint)}
            dateRange={dateRange ? {
              startDate: dateRange.from!,
              endDate: dateRange.to!
            } : undefined}
          />
        );
      case 'amc':
        return (
          <AMCAnalyticsCard
            key={analytic.id}
            title={analytic.title}
            data={data}
            type="statusOverview"
          />
        );
      case 'inventory':
        // Map endpoint names to InventoryAnalyticsCard type values
        const getInventoryAnalyticsType = (endpoint: string) => {
          switch (endpoint) {
            case 'items_status': return 'itemsStatus';
            case 'category_wise': return 'categoryWise';
            case 'green_consumption': return 'greenConsumption';
            case 'aging_matrix': return 'consumptionReportGreen';
            case 'low_stock': return 'currentMinimumStockNonGreen';
            case 'high_value': return 'currentMinimumStockGreen';
            default: return 'itemsStatus';
          }
        };
        
        return (
          <InventoryAnalyticsCard
            key={analytic.id}
            title={analytic.title}
            data={data}
            type={getInventoryAnalyticsType(analytic.endpoint)}
            dateRange={dateRange ? {
              startDate: dateRange.from!,
              endDate: dateRange.to!
            } : undefined}
          />
        );
      case 'schedule':
        return (
          <ScheduleAnalyticsCard
            key={analytic.id}
            title={analytic.title}
            data={data}
            type={analytic.endpoint as any}
          />
        );
      case 'assets':
        return (
          <AssetAnalyticsCard
            key={analytic.id}
            title={analytic.title}
            data={data}
            type={analytic.endpoint as any}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-analytics-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-analytics-border">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold text-analytics-text">Analytics Dashboard</h1>
              <p className="text-sm text-analytics-muted">
                Individual view of all analytics across modules
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <UnifiedDateRangeFilter 
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
            />
            <UnifiedAnalyticsSelector
              selectedAnalytics={selectedAnalytics}
              onSelectionChange={handleAnalyticsSelectionChange}
            />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Tickets"
            value={summaryStats.totalTickets}
            icon={<Activity className="w-6 h-6" />}
          />
          <StatsCard
            title="Completed Tasks"
            value={summaryStats.completedTasks}
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <StatsCard
            title="Active AMCs"
            value={summaryStats.activeAMCs}
            icon={<Settings className="w-6 h-6" />}
          />
          <StatsCard
            title="Low Stock Items"
            value={summaryStats.lowStockItems}
            icon={<Package className="w-6 h-6" />}
          />
        </div>

        {/* Asset Summary Stats Row */}
        {summaryStats.totalAssets > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Assets"
              value={summaryStats.totalAssets}
              icon={<Package className="w-6 h-6" />}
            />
          </div>
        )}

        {/* Analytics Grid */}
        {selectedAnalytics.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
              <AnalyticsGrid loading={loading}>
                {chartOrder.map(chartId => {
                  const analytic = selectedAnalytics.find(a => a.id === chartId);
                  return analytic ? renderAnalyticsCard(analytic) : null;
                })}
              </AnalyticsGrid>
            </SortableContext>
          </DndContext>
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <BarChart3 className="w-16 h-16 text-analytics-muted" />
              <div>
                <h3 className="text-lg font-medium text-analytics-text mb-2">
                  No Analytics Selected
                </h3>
                <p className="text-analytics-muted mb-4">
                  Select analytics from different modules to start viewing your dashboard
                </p>
                <Button 
                  onClick={() => {
                    const selector = document.querySelector('[data-analytics-selector]') as HTMLButtonElement;
                    selector?.click();
                  }}
                  variant="outline"
                >
                  Select Analytics
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};