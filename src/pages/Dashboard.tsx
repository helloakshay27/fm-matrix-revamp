// new comment //
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Calendar,
  BarChart3,
  TrendingUp,
  Activity,
  Package,
  Settings,
  Home,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/StatsCard";
import { Sidebar } from "@/components/Sidebar";
import { UnifiedAnalyticsSelector } from "@/components/dashboard/UnifiedAnalyticsSelector";
import { UnifiedDateRangeFilter } from "@/components/dashboard/UnifiedDateRangeFilter";
import { TicketAnalyticsCard } from "@/components/dashboard/TicketAnalyticsCard";
import { TaskAnalyticsCard } from "@/components/TaskAnalyticsCard";
import { AMCAnalyticsCard } from "@/components/AMCAnalyticsCard";
import { AMCStatusCard } from "@/components/AMCStatusCard";
import { AMCTypeDistributionCard } from "@/components/AMCTypeDistributionCard";
import { AMCExpiryAnalysisCard } from "@/components/AMCExpiryAnalysisCard";
import { AMCServiceTrackingCard } from "@/components/AMCServiceTrackingCard";
import { AMCVendorPerformanceCard } from "@/components/AMCVendorPerformanceCard";
import { AMCUnitResourceCard } from "@/components/AMCUnitResourceCard";
import { AMCServiceStatsCard } from "@/components/AMCServiceStatsCard";
import { AMCCoverageByLocationCard } from "@/components/AMCCoverageByLocationCard";
import { InventoryAnalyticsCard } from "@/components/InventoryAnalyticsCard";
import { ScheduleAnalyticsCard } from "@/components/dashboard/ScheduleAnalyticsCard";
// Import individual asset analytics components
import {
  AssetStatusCard,
  AssetStatisticsCard,
  AssetGroupWiseCard,
  AssetCategoryWiseCard,
  AssetDistributionCard,
} from "@/components/asset-analytics";
import { AssetAnalyticsComponents } from "@/components/AssetAnalyticsComponents";
// Import individual ticket analytics components from TicketDashboard
import communityAnalyticsAPI from "@/services/communityAnalyticsAPI";
import { CommunityEngagementMetricsCard } from "@/components/community/CommunityEngagementMetricsCard";
import { SiteWiseAdoptionRateCard } from "@/components/community/SiteWiseAdoptionRateCard";
import {
  TicketStatusOverviewCard,
  ProactiveReactiveCard,
  CategoryWiseProactiveReactiveCard,
  UnitCategoryWiseCard,
  TicketAgingMatrixCard,
} from "@/components/ticket-analytics";
import { ResponseTATCard } from "@/components/ResponseTATCard";
import { ResolutionTATCard } from "@/components/ResolutionTATCard";
// Import survey analytics components
import { SurveyStatusOverviewCard } from "@/components/SurveyStatusOverviewCard";
import { SurveyAnalyticsCard } from "@/components/SurveyAnalyticsCard";
import { surveyAnalyticsAPI } from "@/services/surveyAnalyticsAPI";
import { ticketAnalyticsAPI } from "@/services/ticketAnalyticsAPI";
import { taskAnalyticsAPI } from "@/services/taskAnalyticsAPI";
import { amcAnalyticsAPI } from "@/services/amcAnalyticsAPI";
import { amcAnalyticsDownloadAPI } from "@/services/amcAnalyticsDownloadAPI";
import { assetAnalyticsDownloadAPI } from "@/services/assetAnalyticsDownloadAPI";
import { inventoryAnalyticsAPI } from "@/services/inventoryAnalyticsAPI";
import { scheduleAnalyticsAPI } from "@/services/scheduleAnalyticsAPI";
import { assetAnalyticsAPI } from "@/services/assetAnalyticsAPI";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/DashboardHeader";
import { meetingRoomAnalyticsAPI } from "@/services/meetingRoomAnalyticsAPI";
import assetManagementAnalyticsAPI from "@/services/assetManagementAnalyticsAPI";
import CompanyAssetOverviewCard from "@/components/asset-management/CompanyAssetOverviewCard";
import CenterAssetsDowntimeMetricsCard from "@/components/asset-management/CenterAssetsDowntimeMetricsCard";
import HighestMaintenanceAssetsCard from "@/components/asset-management/HighestMaintenanceAssetsCard";
import AmcContractSummaryCard from "@/components/asset-management/AmcContractSummaryCard";
import AmcExpiringContractsCard from "@/components/asset-management/AmcExpiringContractsCard";
import AmcExpiredContractsCard from "@/components/asset-management/AmcExpiredContractsCard";
import helpdeskAnalyticsAPI from "@/services/helpdeskAnalyticsAPI";
import inventoryManagementAnalyticsAPI from "@/services/inventoryManagementAnalyticsAPI";
import TopConsumablesCenterOverviewCard from "@/components/consumables/TopConsumablesCenterOverviewCard";
import ConsumableInventoryQuarterlyComparisonCard from "@/components/consumables/ConsumableInventoryQuarterlyComparisonCard";
import InventoryOverviewSummaryCard from "@/components/inventory-management/InventoryOverviewSummaryCard";
import OverstockTop10ItemsCard from "@/components/inventory-management/OverstockTop10ItemsCard";
import { HelpdeskSnapshotCard } from "@/components/helpdesk/HelpdeskSnapshotCard";
import { TicketAgingClosureFeedbackCard } from "@/components/helpdesk/TicketAgingClosureFeedbackCard";
import { TicketPerformanceMetricsCard } from "@/components/helpdesk/TicketPerformanceMetricsCard";
import { CustomerExperienceFeedbackCard } from "@/components/helpdesk/CustomerExperienceFeedbackCard";
import { CustomerRatingOverviewCard } from "@/components/helpdesk/CustomerRatingOverviewCard";
import MeetingRoomUtilizationCard from "@/components/meeting-room/MeetingRoomUtilizationCard";
import { RevenueGenerationOverviewCard } from "@/components/meeting-room/RevenueGenerationOverviewCard";
import { CenterPerformanceOverviewCard } from "@/components/meeting-room/CenterPerformanceOverviewCard";
import ResponseTATQuarterlyCard from "@/components/meeting-room/ResponseTATQuarterlyCard";
import ResolutionTATQuarterlyCard from "@/components/meeting-room/ResolutionTATQuarterlyCard";
import parkingManagementAnalyticsAPI from "@/services/parkingManagementAnalyticsAPI";
import ParkingAllocationOverviewCard from "@/components/parking/ParkingAllocationOverviewCard";
import visitorManagementAnalyticsAPI from "@/services/visitorManagementAnalyticsAPI";
import VisitorTrendAnalysisCard from "@/components/visitor/VisitorTrendAnalysisCard";
import checklistManagementAnalyticsAPI from "@/services/checklistManagementAnalyticsAPI";
import { ChecklistProgressQuarterlyCard } from "@/components/checklist-management/ChecklistProgressQuarterlyCard";
import { TopOverdueChecklistsCenterwiseCard } from "@/components/checklist-management/TopOverdueChecklistsCenterwiseCard";

interface SelectedAnalytic {
  id: string;
  module:
    | "tickets"
    | "tasks"
    | "schedule"
    | "inventory"
    | "amc"
    | "assets"
    | "meeting_room"
    | "community"
    | "helpdesk"
    | "asset_management"
    | "inventory_management"
    | "consumables_overview"
    | "parking_management"
    | "visitor_management"
    | "checklist_management"
    | "surveys";
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
  meeting_room?: any;
  community?: any;
  helpdesk?: any;
  asset_management?: any;
  inventory_management?: any;
  consumables_overview?: any;
  parking_management?: any;
  visitor_management?: any;
  checklist_management?: any;
  surveys?: any;
}

// Track errors per module/endpoint so we can show error state inside each analytic
type DashboardErrors = Partial<
  Record<keyof DashboardData, Record<string, string | null>>
> &
  Record<string, Record<string, string | null>>;

// Track last successful fetch key (by date range) per module/endpoint to prevent redundant network calls
type LastFetchedMap = Partial<
  Record<keyof DashboardData, Record<string, string>>
> &
  Record<string, Record<string, string>>;
// Track last failed fetch key (by date range) per module/endpoint to suppress auto-retries for the same range
type LastFailedMap = Partial<
  Record<keyof DashboardData, Record<string, string>>
> &
  Record<string, Record<string, string>>;

// Sortable Chart Item Component for Drag and Drop
const SortableChartItem = ({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Handle pointer down to prevent drag on button/icon clicks
  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    // Check if the click is on a button, icon, or download element
    if (
      target.closest("button") ||
      target.closest("[data-download]") ||
      target.closest("svg") ||
      target.tagName === "BUTTON" ||
      target.tagName === "SVG" ||
      target.closest(".download-btn") ||
      target.closest("[data-download-button]")
    ) {
      e.stopPropagation();
      return;
    }
    // For other elements, proceed with drag
    if (listeners?.onPointerDown) {
      listeners.onPointerDown(e);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onPointerDown={handlePointerDown}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md group ${
        className ?? ""
      }`}
    >
      {children}
    </div>
  );
};

// Simple loader overlay to show on each section while data is loading
const SectionLoader: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ loading, children, className }) => {
  return (
    <div className={`relative ${className ?? ""}`}>
      {children}
      {loading && (
        <div className="absolute inset-0 z-10 rounded-lg bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedAnalytics, setSelectedAnalytics] = useState<
    SelectedAnalytic[]
  >([]);
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
    meeting_room: null,
  });
  const [dashboardErrors, setDashboardErrors] = useState<DashboardErrors>({});
  const [lastFetchedKey, setLastFetchedKey] = useState<LastFetchedMap>({});
  const [lastFailedKey, setLastFailedKey] = useState<LastFailedMap>({});
  // Per-analytic loading map: { [module]: { [endpoint]: boolean } }
  const [loadingMap, setLoadingMap] = useState<
    Record<string, Record<string, boolean>>
  >({});
  const [loading, setLoading] = useState(false);
  const [chartOrder, setChartOrder] = useState<string[]>([]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Convert date to DD/MM/YYYY format for date range display
  const convertDateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Update chart order when selected analytics change
  useEffect(() => {
    setChartOrder(selectedAnalytics.map((analytic) => analytic.id));
  }, [selectedAnalytics]);

  // Fetch analytics data based on selections and date range
  const fetchAnalyticsData = async () => {
    if (!dateRange?.from || !dateRange?.to || selectedAnalytics.length === 0)
      return;

    try {
      const SKIP_RETRY = "__SKIP_RETRY__";
      const promises: Promise<any>[] = [];
      const updatedData: Partial<DashboardData> = {};
      const updatedErrors: Partial<DashboardErrors> = {};
      const updatedFetchedKeys: Partial<LastFetchedMap> = {};
      const updatedFailedKeys: Partial<LastFailedMap> = {};
      const toLoad: Record<string, Record<string, boolean>> = {};

      // Build a stable key for this date range (YYYY-MM-DD) to use in caching
      const toKey = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
      const dateKey = `${toKey(dateRange.from)}_${toKey(dateRange.to)}`;

      // Group analytics by module to minimize API calls
      const moduleGroups = selectedAnalytics.reduce((groups, analytic) => {
        if (!groups[analytic.module]) groups[analytic.module] = [];
        groups[analytic.module].push(analytic);
        return groups;
      }, {} as Record<string, SelectedAnalytic[]>);

      // Fetch data for each module
      for (const [module, analytics] of Object.entries(moduleGroups)) {
        switch (module) {
          case "tickets":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                // Use cached data to keep Promise order alignment and avoid network hit
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                // Suppress retry for the same date range; maintain order with a rejected sentinel
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              // Mark real fetches in toLoad
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "tickets_categorywise":
                  promises.push(
                    ticketAnalyticsAPI.getTicketsCategorywiseData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "tickets_proactive_reactive":
                  promises.push(
                    ticketAnalyticsAPI.getTicketsCategorywiseData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "ticket_status":
                  promises.push(
                    ticketAnalyticsAPI.getTicketStatusData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "ticket_aging_matrix":
                  promises.push(
                    ticketAnalyticsAPI.getTicketAgingMatrix(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "unit_categorywise":
                case "tickets_unit_categorywise":
                  promises.push(
                    ticketAnalyticsAPI.getUnitCategorywiseData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "response_tat":
                case "tickets_response_tat":
                  promises.push(
                    ticketAnalyticsAPI.getResponseTATData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "resolution_tat":
                case "tickets_resolution_tat":
                  promises.push(
                    ticketAnalyticsAPI.getResolutionTATReportData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
              }
            }
            break;

          case "tasks":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "technical_checklist":
                  promises.push(
                    taskAnalyticsAPI.getTechnicalChecklistData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "non_technical_checklist":
                  promises.push(
                    taskAnalyticsAPI.getNonTechnicalChecklistData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "top_ten_checklist":
                  promises.push(
                    taskAnalyticsAPI.getTopTenChecklistData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "site_wise_checklist":
                  promises.push(
                    taskAnalyticsAPI.getSiteWiseChecklistData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
              }
            }
            break;

          case "amc":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "status_overview":
                  promises.push(
                    amcAnalyticsAPI.getAMCStatusSummary(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "type_distribution":
                  promises.push(
                    amcAnalyticsAPI.getAMCTypeDistribution(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "unit_resource_wise":
                  promises.push(
                    amcAnalyticsAPI.getAMCUnitResourceWise(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "service_stats":
                  promises.push(
                    amcAnalyticsAPI.getAMCServiceStats(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "expiry_analysis":
                  promises.push(
                    amcAnalyticsAPI.getAMCExpiryAnalysis(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "service_tracking":
                  promises.push(
                    amcAnalyticsAPI.getAMCServiceTracking(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "coverage_by_location":
                  promises.push(
                    amcAnalyticsAPI.getAMCCoverageByLocation(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "vendor_performance":
                  promises.push(
                    amcAnalyticsAPI.getAMCVendorPerformance(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                default:
                  // Fallback to basic status data
                  promises.push(
                    amcAnalyticsAPI.getAMCStatusData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
              }
            }
            break;

          case "inventory":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "items_status":
                  promises.push(
                    inventoryAnalyticsAPI.getItemsStatus(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "category_wise":
                  promises.push(
                    inventoryAnalyticsAPI.getCategoryWise(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "green_consumption":
                  promises.push(
                    inventoryAnalyticsAPI.getGreenConsumption(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "aging_matrix":
                  promises.push(
                    inventoryAnalyticsAPI.getAgingMatrix(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "low_stock":
                  promises.push(
                    inventoryAnalyticsAPI.getLowStockItems(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "high_value":
                  promises.push(
                    inventoryAnalyticsAPI.getHighValueItems(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
              }
            }
            break;

          case "schedule":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "schedule_overview":
                  promises.push(
                    scheduleAnalyticsAPI.getScheduleOverview(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "schedule_completion":
                  promises.push(
                    scheduleAnalyticsAPI.getScheduleCompletion(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "resource_utilization":
                  promises.push(
                    scheduleAnalyticsAPI.getResourceUtilization(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
              }
            }
            break;

          case "assets":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "asset_status":
                  promises.push(
                    assetAnalyticsAPI.getAssetStatus(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "asset_statistics":
                  promises.push(
                    assetAnalyticsAPI.getAssetStatistics(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "group_wise":
                  promises.push(
                    assetAnalyticsAPI.getGroupWiseAssets(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "category_wise":
                  promises.push(
                    assetAnalyticsAPI.getCategoryWiseAssets(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "asset_distribution":
                  promises.push(
                    assetAnalyticsAPI.getAssetDistribution(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
              }
            }
            break;
          case "meeting_room":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "revenue_generation_overview":
                  promises.push(
                    meetingRoomAnalyticsAPI.getMeetingRoomRevenueOverview(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "center_performance_overview":
                  promises.push(
                    meetingRoomAnalyticsAPI.getMeetingRoomCenterPerformance(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "center_wise_meeting_room_utilization":
                  promises.push(
                    meetingRoomAnalyticsAPI.getCenterWiseMeetingRoomUtilization(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "response_tat_performance_quarterly":
                  promises.push(
                    meetingRoomAnalyticsAPI.getResponseTATPerformanceQuarterly()
                  );
                  break;
                case "resolution_tat_performance_quarterly":
                  promises.push(
                    meetingRoomAnalyticsAPI.getResolutionTATPerformanceQuarterly()
                  );
                  break;
              }
            }
            break;
          case "community":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "engagement_metrics":
                  promises.push(
                    communityAnalyticsAPI.getCommunityEngagementMetrics()
                  );
                  break;
                case "site_wise_adoption_rate":
                  promises.push(
                    communityAnalyticsAPI.getSiteWiseAdoptionRate(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
              }
            }
            break;
          case "asset_management":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "company_asset_overview":
                case "center_assets_downtime":
                  // both use asset_overview
                  promises.push(
                    assetManagementAnalyticsAPI.getAssetOverview(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "highest_maintenance_assets":
                  promises.push(
                    assetManagementAnalyticsAPI.getHighestMaintenanceAssets(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "amc_contract_summary":
                case "amc_contract_expiry_90":
                case "amc_contract_expired":
                  promises.push(
                    assetManagementAnalyticsAPI.getAmcContractSummary(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
              }
            }
            break;
          case "helpdesk":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "snapshot":
                  promises.push(
                    helpdeskAnalyticsAPI.getHelpdeskSnapshot(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "aging_closure_feedback":
                  promises.push(
                    helpdeskAnalyticsAPI.getAgingClosureFeedbackOverview(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "ticket_performance_metrics":
                  promises.push(
                    helpdeskAnalyticsAPI.getTicketPerformanceMetrics(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "customer_experience_feedback":
                  promises.push(
                    helpdeskAnalyticsAPI.getCustomerExperienceFeedback(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "customer_rating_overview":
                  // Uses the same customer_experience_feedback dataset
                  promises.push(
                    helpdeskAnalyticsAPI.getCustomerExperienceFeedback(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
              }
            }
            break;
          case "inventory_management":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "inventory_overview_summary":
                case "inventory_overstock_top10":
                  promises.push(
                    inventoryManagementAnalyticsAPI.getInventoryOverstockReport(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
              }
            }
            break;
          case "consumables_overview":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "top_consumables_center":
                  promises.push(
                    inventoryManagementAnalyticsAPI.getCenterWiseConsumables(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "consumable_inventory_value_quarterly":
                  promises.push(
                    inventoryManagementAnalyticsAPI.getConsumableInventoryComparison(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
              }
            }
            break;
          case "parking_management":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "parking_allocation_overview":
                  promises.push(
                    parkingManagementAnalyticsAPI.getParkingAllocationOverview(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
              }
            }
            break;
          case "visitor_management":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "visitor_trend_analysis":
                  promises.push(
                    visitorManagementAnalyticsAPI.getVisitorTrendAnalysis(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
              }
            }
            break;
          case "checklist_management":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              switch (analytic.endpoint) {
                case "cm_progress_quarterly":
                  promises.push(
                    checklistManagementAnalyticsAPI.getChecklistProgressRows(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "cm_overdue_centerwise":
                  promises.push(
                    checklistManagementAnalyticsAPI.getTopOverdueChecklistMatrix(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                default:
                  promises.push(Promise.resolve(null));
              }
            }
            break;
          case "surveys":
            for (const analytic of analytics) {
              const cachedOk =
                (lastFetchedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                (dashboardData as any)?.[module]?.[analytic.endpoint] != null;
              if (cachedOk) {
                promises.push(
                  Promise.resolve(
                    (dashboardData as any)[module][analytic.endpoint]
                  )
                );
                continue;
              }
              const failedSameRange =
                (lastFailedKey as any)?.[module]?.[analytic.endpoint] ===
                  dateKey &&
                ((dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                  null) != null;
              if (failedSameRange) {
                promises.push(Promise.reject(SKIP_RETRY));
                continue;
              }
              switch (analytic.endpoint) {
                case "survey_summary":
                case "survey_status_distribution":
                case "top_surveys":
                  toLoad[module] = toLoad[module] || {};
                  toLoad[module][analytic.endpoint] = true;
                  promises.push(surveyAnalyticsAPI.getRealSurveyAnalytics());
                  break;
                default:
                  promises.push(Promise.resolve(null));
              }
            }
            break;
        }
      }

      // Determine if there are any real API calls for this run
      const hasRealCalls = Object.values(toLoad).some((mod) =>
        Object.values(mod).some(Boolean)
      );
      setLoading(hasRealCalls);
      if (hasRealCalls) {
        // Flip on per-analytic loading for those endpoints
        setLoadingMap((prev) => {
          const merged: Record<string, Record<string, boolean>> = { ...prev };
          for (const [mod, map] of Object.entries(toLoad)) {
            merged[mod] = { ...(merged[mod] || {}) };
            for (const [ep, flag] of Object.entries(map)) {
              if (flag) merged[mod][ep] = true;
            }
          }
          return merged;
        });
      }

      const results = await Promise.allSettled(promises);

      // Process results and map to dashboard data
      let resultIndex = 0;
      for (const [module, analytics] of Object.entries(moduleGroups)) {
        const moduleData: any = {};
        const moduleErrs: Record<string, string | null> = {};
        const moduleFetched: Record<string, string> = (lastFetchedKey as any)?.[
          module
        ]
          ? { ...(lastFetchedKey as any)[module] }
          : {};
        for (const analytic of analytics) {
          const result = results[resultIndex++];
          if (result.status === "fulfilled") {
            console.log(
              `Successfully fetched ${module}.${analytic.endpoint}:`,
              result.value
            );
            moduleData[analytic.endpoint] = result.value;
            moduleErrs[analytic.endpoint] = null;
            moduleFetched[analytic.endpoint] = dateKey;
            // on success, clear any previous failed state
            if ((lastFailedKey as any)?.[module]?.[analytic.endpoint]) {
              // defer clearing by not setting failed key for this endpoint
            }
          } else {
            const reason = (result as PromiseRejectedResult).reason;
            if (reason === SKIP_RETRY) {
              // Preserve previous data and error without re-toasting
              moduleData[analytic.endpoint] =
                (dashboardData as any)?.[module]?.[analytic.endpoint] ?? null;
              moduleErrs[analytic.endpoint] =
                (dashboardErrors as any)?.[module]?.[analytic.endpoint] ??
                "Request failed";
              updatedFailedKeys[module as keyof DashboardData] = {
                ...((updatedFailedKeys as any)[module] || {}),
                [analytic.endpoint]: dateKey,
              } as any;
            } else {
              const msg =
                typeof reason === "string"
                  ? reason
                  : reason?.message || reason?.statusText || "Request failed";
              console.error(
                `Failed to fetch ${module}.${analytic.endpoint}:`,
                reason
              );
              toast.error(`Failed to fetch ${analytic.title}`);
              moduleData[analytic.endpoint] = null;
              moduleErrs[analytic.endpoint] = msg;
              updatedFailedKeys[module as keyof DashboardData] = {
                ...((updatedFailedKeys as any)[module] || {}),
                [analytic.endpoint]: dateKey,
              } as any;
            }
          }
        }
        updatedData[module as keyof DashboardData] = moduleData;
        updatedErrors[module as keyof DashboardData] = moduleErrs;
        updatedFetchedKeys[module as keyof DashboardData] = moduleFetched;
      }

      console.log("Updated dashboard data:", updatedData);
      setDashboardData((prev) => ({ ...prev, ...updatedData }));
      setDashboardErrors((prev) => ({ ...prev, ...updatedErrors }));
      setLastFetchedKey((prev) => {
        const merged: any = { ...prev };
        for (const [module, map] of Object.entries(updatedFetchedKeys)) {
          merged[module] = { ...(prev as any)[module], ...map };
        }
        return merged;
      });
      setLastFailedKey((prev) => {
        const merged: any = { ...prev };
        for (const [module, map] of Object.entries(updatedFailedKeys)) {
          merged[module] = { ...(prev as any)[module], ...map };
        }
        return merged;
      });
      if (hasRealCalls) {
        // Clear per-analytic loading states for called endpoints
        setLoadingMap((prev) => {
          const merged: Record<string, Record<string, boolean>> = { ...prev };
          for (const [mod, map] of Object.entries(toLoad)) {
            merged[mod] = { ...(merged[mod] || {}) };
            for (const ep of Object.keys(map)) {
              merged[mod][ep] = false;
            }
          }
          return merged;
        });
      }
      toast.success("Dashboard data updated successfully");
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to fetch dashboard data");
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
      totalTickets =
        (overall.total_open || 0) +
        (overall.total_closed || 0) +
        (overall.total_wip || 0);
    }

    // Calculate completed tasks from technical checklist
    if (dashboardData.tasks?.technical_checklist?.response) {
      const response = dashboardData.tasks.technical_checklist.response;
      const responseData = response as Record<string, any>;
      completedTasks = Object.values(responseData).reduce(
        (sum: number, item: any) => sum + Number(item?.closed || 0),
        0
      );
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
      lowStockItems =
        dashboardData.inventory.items_status.count_of_critical_items || 0;
    }

    // Add asset stats if available
    let totalAssets = 0;
    if (dashboardData.assets?.asset_statistics) {
      totalAssets = dashboardData.assets.asset_statistics.total_assets || 0;
    } else if (dashboardData.assets?.overall_analytics) {
      totalAssets =
        dashboardData.assets.overall_analytics.summary?.total_assets || 0;
    }

    return {
      totalTickets,
      completedTasks,
      activeAMCs,
      lowStockItems,
      totalAssets,
    };
  };

  const summaryStats = getSummaryStats();

  const renderAnalyticsCard = (analytic: SelectedAnalytic) => {
    const errorFor = (a: SelectedAnalytic): string | null => {
      const modErrs = (dashboardErrors as any)?.[a.module] as
        | Record<string, string | null>
        | undefined;
      return modErrs ? modErrs[a.endpoint] ?? null : null;
    };

    const errorMessage = errorFor(analytic);
    if (errorMessage) {
      return (
        <SortableChartItem key={analytic.id} id={analytic.id}>
          <Card className="border border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                {analytic.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-red-700">
                Failed to load this analytic. {errorMessage}
              </div>
            </CardContent>
          </Card>
        </SortableChartItem>
      );
    }

    const rawData = dashboardData[analytic.module]?.[analytic.endpoint];

    // Transform ticket data to match TicketAnalyticsCard expectations
    const transformTicketData = (data: any, endpoint: string) => {
      if (!data) return null;

      console.log("Raw ticket data for", endpoint, ":", data);

      switch (endpoint) {
        case "tickets_categorywise":
          // Transform API response to expected format
          if (Array.isArray(data)) {
            return data.map((item) => ({
              category: item.category,
              proactive: item.proactive || { Open: 0, Closed: 0 },
              reactive: item.reactive || { Open: 0, Closed: 0 },
              proactive_count:
                (item.proactive?.Open || 0) + (item.proactive?.Closed || 0),
              reactive_count:
                (item.reactive?.Open || 0) + (item.reactive?.Closed || 0),
            }));
          }
          return data;

        case "tickets_proactive_reactive":
          // Return data as-is for proactive/reactive breakdown
          return data;

        case "unit_categorywise":
        case "tickets_unit_categorywise":
          // Return unit category-wise data as-is
          return data;

        case "response_tat":
        case "tickets_response_tat":
          // Return Response TAT data as-is
          return data;

        case "resolution_tat":
        case "tickets_resolution_tat":
          // Return Resolution TAT data as-is
          return data;

        case "ticket_status":
          // Transform status data to expected format
          if (data?.overall) {
            return {
              open: data.overall.total_open || 0,
              closed: data.overall.total_closed || 0,
              wip: data.overall.total_wip || 0,
              info: data.overall.info,
            };
          }
          return data;

        case "ticket_aging_matrix":
          // Transform aging matrix data
          if (data?.response?.matrix) {
            const flatMatrix: { [key: string]: number } = {};
            Object.entries(data.response.matrix).forEach(
              ([priority, ranges]: [string, any]) => {
                Object.entries(ranges).forEach(
                  ([range, count]: [string, any]) => {
                    const key = `${priority}_${range}`;
                    flatMatrix[key] = count || 0;
                  }
                );
              }
            );
            return flatMatrix;
          }
          return data;

        default:
          return data;
      }
    };

    const data =
      analytic.module === "tickets"
        ? transformTicketData(rawData, analytic.endpoint)
        : rawData;

    switch (analytic.module) {
      case "tickets":
        // Handle individual ticket analytics components based on endpoint
        switch (analytic.endpoint) {
          case "ticket_status":
            // Ticket Status Overview
            const statusData =
              data &&
              typeof data === "object" &&
              "open" in data &&
              "closed" in data
                ? data
                : { open: 0, closed: 0, wip: 0 };

            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <TicketStatusOverviewCard
                  openTickets={statusData.open || 0}
                  closedTickets={statusData.closed || 0}
                />
              </SortableChartItem>
            );

          case "tickets_proactive_reactive":
            // Proactive/Reactive tickets breakdown
            const proactiveReactiveData =
              Array.isArray(data) && data.length > 0 ? data[0] : null;

            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <ProactiveReactiveCard
                  proactiveOpenTickets={
                    proactiveReactiveData?.proactive?.Open || 0
                  }
                  proactiveClosedTickets={
                    proactiveReactiveData?.proactive?.Closed || 0
                  }
                  reactiveOpenTickets={
                    proactiveReactiveData?.reactive?.Open || 0
                  }
                  reactiveClosedTickets={
                    proactiveReactiveData?.reactive?.Closed || 0
                  }
                />
              </SortableChartItem>
            );

          case "tickets_categorywise":
            // Category-wise Proactive/Reactive
            const categoryData = Array.isArray(data) ? data : [];

            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <CategoryWiseProactiveReactiveCard
                  data={categoryData}
                  dateRange={{
                    startDate: dateRange?.from || new Date(),
                    endDate: dateRange?.to || new Date(),
                  }}
                />
              </SortableChartItem>
            );

          case "tickets_unit_categorywise":
          case "unit_categorywise":
            // Unit Category-wise tickets
            const unitCategoryData =
              data && typeof data === "object" ? data : null;

            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <UnitCategoryWiseCard
                  data={unitCategoryData}
                  dateRange={{
                    startDate: dateRange?.from || new Date(),
                    endDate: dateRange?.to || new Date(),
                  }}
                />
              </SortableChartItem>
            );

          case "ticket_aging_matrix":
            // Ticket Aging Matrix - use rawData, not transformed data
            const agingRawData =
              rawData && typeof rawData === "object" ? rawData : null;

            // Transform API response to expected format - same as TicketDashboard
            const agingMatrixData = agingRawData?.response?.matrix
              ? Object.entries(agingRawData.response.matrix).map(
                  ([priority, data]: [string, any]) => ({
                    priority,
                    T1: data.T1 || 0,
                    T2: data.T2 || 0,
                    T3: data.T3 || 0,
                    T4: data.T4 || 0,
                    T5: data.T5 || 0,
                  })
                )
              : [
                  {
                    priority: "High",
                    T1: 0,
                    T2: 0,
                    T3: 0,
                    T4: 0,
                    T5: 0,
                  },
                  {
                    priority: "Medium",
                    T1: 0,
                    T2: 0,
                    T3: 0,
                    T4: 0,
                    T5: 0,
                  },
                  {
                    priority: "Low",
                    T1: 0,
                    T2: 0,
                    T3: 0,
                    T4: 0,
                    T5: 0,
                  },
                ];

            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <TicketAgingMatrixCard
                  data={
                    agingRawData || {
                      success: 1,
                      message: "Success",
                      response: { matrix: {} },
                      average_days: 0,
                      info: "Aging matrix data",
                    }
                  }
                  agingMatrixData={agingMatrixData}
                  dateRange={{
                    startDate: dateRange?.from || new Date(),
                    endDate: dateRange?.to || new Date(),
                  }}
                />
              </SortableChartItem>
            );

          case "tickets_response_tat":
          case "response_tat":
            // Response TAT
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <ResponseTATCard
                  data={data}
                  dateRange={{
                    startDate: dateRange?.from || new Date(),
                    endDate: dateRange?.to || new Date(),
                  }}
                />
              </SortableChartItem>
            );

          case "tickets_resolution_tat":
          case "resolution_tat":
            // Resolution TAT
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <ResolutionTATCard
                  data={data}
                  dateRange={{
                    startDate: dateRange?.from || new Date(),
                    endDate: dateRange?.to || new Date(),
                  }}
                />
              </SortableChartItem>
            );

          default:
            // Fallback to simplified TicketAnalyticsCard for other endpoints
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <TicketAnalyticsCard
                  title={analytic.title}
                  data={data}
                  type={analytic.endpoint as any}
                />
              </SortableChartItem>
            );
        }
      case "tasks":
        // Map endpoint names to TaskAnalyticsCard type values
        const getTaskAnalyticsType = (endpoint: string) => {
          switch (endpoint) {
            case "technical_checklist":
              return "technical";
            case "non_technical_checklist":
              return "nonTechnical";
            case "top_ten_checklist":
              return "topTen";
            case "site_wise_checklist":
              return "siteWise";
            default:
              return "technical";
          }
        };

        return (
          <SortableChartItem key={analytic.id} id={analytic.id}>
            <TaskAnalyticsCard
              title={analytic.title}
              data={data}
              type={getTaskAnalyticsType(analytic.endpoint)}
              dateRange={
                dateRange
                  ? {
                      startDate: dateRange.from!,
                      endDate: dateRange.to!,
                    }
                  : undefined
              }
            />
          </SortableChartItem>
        );
      case "amc":
        // Handle individual AMC analytics components
        switch (analytic.endpoint) {
          case "status_overview":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AMCStatusCard
                  data={data}
                  onDownload={async () => {
                    if (dateRange?.from && dateRange?.to) {
                      await amcAnalyticsDownloadAPI.downloadAMCStatusData(
                        dateRange.from,
                        dateRange.to
                      );
                    }
                  }}
                />
              </SortableChartItem>
            );
          case "type_distribution":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AMCTypeDistributionCard
                  data={data}
                  onDownload={async () => {
                    if (dateRange?.from && dateRange?.to) {
                      await amcAnalyticsDownloadAPI.downloadAMCTypeDistribution(
                        dateRange.from,
                        dateRange.to
                      );
                    }
                  }}
                />
              </SortableChartItem>
            );
          case "unit_resource_wise":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AMCUnitResourceCard
                  data={data}
                  onDownload={async () => {
                    if (dateRange?.from && dateRange?.to) {
                      await amcAnalyticsDownloadAPI.downloadAMCUnitResourceWise(
                        dateRange.from,
                        dateRange.to
                      );
                    }
                  }}
                />
              </SortableChartItem>
            );
          case "service_stats":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AMCServiceStatsCard
                  data={data}
                  onDownload={async () => {
                    if (dateRange?.from && dateRange?.to) {
                      await amcAnalyticsDownloadAPI.downloadAMCServiceStats(
                        dateRange.from,
                        dateRange.to
                      );
                    }
                  }}
                />
              </SortableChartItem>
            );
          case "expiry_analysis":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AMCExpiryAnalysisCard
                  data={data}
                  onDownload={async () => {
                    if (dateRange?.from && dateRange?.to) {
                      await amcAnalyticsDownloadAPI.downloadAMCExpiryAnalysis(
                        dateRange.from,
                        dateRange.to
                      );
                    }
                  }}
                />
              </SortableChartItem>
            );
          case "service_tracking":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AMCServiceTrackingCard
                  data={data}
                  onDownload={async () => {
                    if (dateRange?.from && dateRange?.to) {
                      await amcAnalyticsDownloadAPI.downloadAMCServiceTracking(
                        dateRange.from,
                        dateRange.to
                      );
                    }
                  }}
                />
              </SortableChartItem>
            );
          case "coverage_by_location":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AMCCoverageByLocationCard
                  data={data}
                  onDownload={async () => {
                    if (dateRange?.from && dateRange?.to) {
                      await amcAnalyticsDownloadAPI.downloadAMCCoverageByLocation(
                        dateRange.from,
                        dateRange.to
                      );
                    }
                  }}
                />
              </SortableChartItem>
            );
          case "vendor_performance":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AMCVendorPerformanceCard
                  data={data}
                  onDownload={async () => {
                    if (dateRange?.from && dateRange?.to) {
                      await amcAnalyticsDownloadAPI.downloadAMCVendorPerformance(
                        dateRange.from,
                        dateRange.to
                      );
                    }
                  }}
                />
              </SortableChartItem>
            );
          default:
            // Fallback to old AMCAnalyticsCard for backward compatibility
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AMCAnalyticsCard
                  title={analytic.title}
                  data={data}
                  type="statusOverview"
                />
              </SortableChartItem>
            );
        }
      case "inventory":
        // Map endpoint names to InventoryAnalyticsCard type values
        const getInventoryAnalyticsType = (endpoint: string) => {
          switch (endpoint) {
            case "items_status":
              return "itemsStatus";
            case "category_wise":
              return "categoryWise";
            case "green_consumption":
              return "greenConsumption";
            case "aging_matrix":
              return "consumptionReportGreen";
            case "low_stock":
              return "currentMinimumStockNonGreen";
            case "high_value":
              return "currentMinimumStockGreen";
            default:
              return "itemsStatus";
          }
        };

        return (
          <SortableChartItem key={analytic.id} id={analytic.id}>
            <InventoryAnalyticsCard
              title={analytic.title}
              data={data}
              type={getInventoryAnalyticsType(analytic.endpoint)}
              dateRange={
                dateRange
                  ? {
                      startDate: dateRange.from!,
                      endDate: dateRange.to!,
                    }
                  : undefined
              }
            />
          </SortableChartItem>
        );
      case "schedule":
        return (
          <SortableChartItem key={analytic.id} id={analytic.id}>
            <ScheduleAnalyticsCard
              title={analytic.title}
              data={data}
              type={analytic.endpoint as any}
            />
          </SortableChartItem>
        );
      case "assets":
        // Map endpoint to AssetAnalyticsComponents type
        const getAssetAnalyticsType = (endpoint: string): string[] => {
          switch (endpoint) {
            case "asset_status":
              return ["statusDistribution"];
            case "asset_statistics":
              return ["assetStatistics"];
            case "group_wise":
              return ["groupWise"];
            case "category_wise":
              return ["categoryWise"];
            case "asset_distribution":
              return ["assetDistributions"];
            default:
              return ["assetStatistics"];
          }
        };

        // Use the comprehensive AssetAnalyticsComponents for individual asset analytics
        // This provides better integration and handles asset-related charts consistently
        return (
          <SortableChartItem key={analytic.id} id={analytic.id}>
            <AssetAnalyticsComponents
              defaultDateRange={
                dateRange?.from && dateRange?.to
                  ? {
                      fromDate: dateRange.from,
                      toDate: dateRange.to,
                    }
                  : undefined
              }
              selectedAnalyticsTypes={getAssetAnalyticsType(analytic.endpoint)}
              showFilter={false}
              showSelector={false}
              showRecentAssets={false}
              layout="grid"
            />
          </SortableChartItem>
        );
      case "meeting_room":
        switch (analytic.endpoint) {
          case "revenue_generation_overview": {
            const totalRevenue =
              rawData?.total_revenue ??
              rawData?.TotalRevenue ??
              rawData ??
              null;
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <RevenueGenerationOverviewCard totalRevenue={totalRevenue} />
              </SortableChartItem>
            );
          }
          case "center_performance_overview": {
            const rows = Array.isArray(rawData) ? rawData : [];
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <CenterPerformanceOverviewCard rows={rows} />
              </SortableChartItem>
            );
          }
          case "center_wise_meeting_room_utilization": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <MeetingRoomUtilizationCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "response_tat_performance_quarterly": {
            const rows = Array.isArray(rawData) ? rawData : [];
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <ResponseTATQuarterlyCard
                  data={rows}
                  dateRange={
                    dateRange
                      ? { startDate: dateRange.from!, endDate: dateRange.to! }
                      : undefined
                  }
                />
              </SortableChartItem>
            );
          }
          case "resolution_tat_performance_quarterly": {
            const rows = Array.isArray(rawData) ? rawData : [];
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <ResolutionTATQuarterlyCard
                  data={rows}
                  dateRange={
                    dateRange
                      ? { startDate: dateRange.from!, endDate: dateRange.to! }
                      : undefined
                  }
                />
              </SortableChartItem>
            );
          }
          default:
            return null;
        }
      case "community":
        switch (analytic.endpoint) {
          case "engagement_metrics":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <CommunityEngagementMetricsCard data={rawData} />
              </SortableChartItem>
            );
          case "site_wise_adoption_rate":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <SiteWiseAdoptionRateCard data={rawData} />
              </SortableChartItem>
            );
          default:
            return null;
        }
      case "asset_management":
        switch (analytic.endpoint) {
          case "company_asset_overview": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <CompanyAssetOverviewCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "center_assets_downtime": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <CenterAssetsDowntimeMetricsCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "highest_maintenance_assets": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <HighestMaintenanceAssetsCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "amc_contract_summary": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AmcContractSummaryCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "amc_contract_expiry_90": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AmcExpiringContractsCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "amc_contract_expired": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AmcExpiredContractsCard data={rawData} />
              </SortableChartItem>
            );
          }
          default:
            return null;
        }
      case "inventory_management":
        switch (analytic.endpoint) {
          case "inventory_overview_summary": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <InventoryOverviewSummaryCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "inventory_overstock_top10": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <OverstockTop10ItemsCard data={rawData} />
              </SortableChartItem>
            );
          }
          default:
            return null;
        }
      case "consumables_overview":
        switch (analytic.endpoint) {
          case "top_consumables_center":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <TopConsumablesCenterOverviewCard data={rawData} />
              </SortableChartItem>
            );
          case "consumable_inventory_value_quarterly":
            return (
              <SortableChartItem
                key={analytic.id}
                id={analytic.id}
                className="lg:col-span-2"
              >
                <ConsumableInventoryQuarterlyComparisonCard
                  data={rawData}
                  dateRange={
                    dateRange
                      ? { startDate: dateRange.from!, endDate: dateRange.to! }
                      : undefined
                  }
                />
              </SortableChartItem>
            );
          default:
            return null;
        }
      case "parking_management":
        switch (analytic.endpoint) {
          case "parking_allocation_overview":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <ParkingAllocationOverviewCard data={rawData} />
              </SortableChartItem>
            );
          default:
            return null;
        }
      case "visitor_management":
        switch (analytic.endpoint) {
          case "visitor_trend_analysis":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <VisitorTrendAnalysisCard
                  data={rawData}
                  dateRange={
                    dateRange
                      ? { startDate: dateRange.from!, endDate: dateRange.to! }
                      : undefined
                  }
                />
              </SortableChartItem>
            );
          default:
            return null;
        }
      case "checklist_management":
        switch (analytic.endpoint) {
          case "cm_progress_quarterly": {
            const rows = Array.isArray(rawData) ? rawData : [];
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <ChecklistProgressQuarterlyCard
                  rows={rows}
                  dateRange={
                    dateRange
                      ? { startDate: dateRange.from!, endDate: dateRange.to! }
                      : undefined
                  }
                />
              </SortableChartItem>
            );
          }
          case "cm_overdue_centerwise": {
            const matrix = rawData || { categories: [], siteRows: [] };
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <TopOverdueChecklistsCenterwiseCard
                  title={analytic.title}
                  matrix={matrix}
                />
              </SortableChartItem>
            );
          }
          default:
            return null;
        }
      case "helpdesk":
        switch (analytic.endpoint) {
          case "snapshot":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <HelpdeskSnapshotCard data={rawData} />
              </SortableChartItem>
            );
          case "aging_closure_feedback": {
            const agingClosureData =
              rawData?.agingClosure ??
              rawData?.aging_closure ??
              rawData ??
              null;
            const feedbackData = rawData?.feedback ?? null;
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <TicketAgingClosureFeedbackCard
                  agingClosureData={agingClosureData}
                  feedbackData={feedbackData}
                />
              </SortableChartItem>
            );
          }
          case "ticket_performance_metrics": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <TicketPerformanceMetricsCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "customer_experience_feedback": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <CustomerExperienceFeedbackCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "customer_rating_overview": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <CustomerRatingOverviewCard data={rawData} />
              </SortableChartItem>
            );
          }
          default:
            return null;
        }
      case "surveys":
        switch (analytic.endpoint) {
          case "survey_summary":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <SurveyStatusOverviewCard
                  dateRange={
                    dateRange && dateRange.from && dateRange.to
                      ? {
                          startDate: dateRange.from,
                          endDate: dateRange.to,
                        }
                      : undefined
                  }
                />
              </SortableChartItem>
            );
          case "survey_status_distribution": {
            // Transform raw API data to expected chart format
            const transformStatusData = (apiData: unknown) => {
              if (!apiData) return [];

              // Check if it's already in the expected format
              if (
                Array.isArray(apiData) &&
                apiData.length > 0 &&
                apiData[0].name &&
                apiData[0].value !== undefined
              ) {
                return apiData;
              }

              // Handle getRealSurveyAnalytics response structure: { analytics: { positive_responses, negative_responses, neutral_responses } }
              if (
                typeof apiData === "object" &&
                apiData !== null &&
                "analytics" in apiData
              ) {
                const analytics = (
                  apiData as { analytics: Record<string, unknown> }
                ).analytics;
                const {
                  positive_responses,
                  negative_responses,
                  neutral_responses,
                } = analytics;

                return [
                  {
                    name: "Positive",
                    value: Number(positive_responses) || 0,
                    color: "#22C55E",
                  },
                  {
                    name: "Negative",
                    value: Number(negative_responses) || 0,
                    color: "#EF4444",
                  },
                  {
                    name: "Neutral",
                    value: Number(neutral_responses) || 0,
                    color: "#F59E0B",
                  },
                ];
              }

              return [];
            };

            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <SurveyAnalyticsCard
                  title="Survey Status Distribution"
                  data={transformStatusData(rawData)}
                  type="statusDistribution"
                  dateRange={
                    dateRange && dateRange.from && dateRange.to
                      ? {
                          startDate: dateRange.from,
                          endDate: dateRange.to,
                        }
                      : undefined
                  }
                />
              </SortableChartItem>
            );
          }
          case "top_surveys": {
            // Transform raw API data to expected chart format
            const transformTopSurveys = (apiData: unknown) => {
              if (!apiData) return [];

              // Check if it's already in the expected format
              if (
                Array.isArray(apiData) &&
                apiData.length > 0 &&
                apiData[0].name &&
                apiData[0].value !== undefined
              ) {
                return apiData.slice(0, 3); // Limit to top 3
              }

              // Transform API response to chart format
              const surveyColors = ["#C72030", "#c6b692", "#d8dcdd"];

              // Handle getRealSurveyAnalytics response structure: { analytics: { top_surveys: [] } }
              if (
                typeof apiData === "object" &&
                apiData !== null &&
                "analytics" in apiData
              ) {
                const analytics = (
                  apiData as {
                    analytics: {
                      top_surveys?: Array<{
                        survey_name: string;
                        response_count: number;
                      }>;
                    };
                  }
                ).analytics;
                const surveysArray = analytics.top_surveys;

                if (Array.isArray(surveysArray)) {
                  return surveysArray.slice(0, 3).map((survey, index) => ({
                    name: survey.survey_name || `Survey ${index + 1}`,
                    value: Number(survey.response_count) || 0,
                    color: surveyColors[index % surveyColors.length],
                  }));
                }
              }

              // Handle direct array format
              if (Array.isArray(apiData)) {
                return apiData
                  .slice(0, 3)
                  .map((item: Record<string, unknown>, index) => ({
                    name:
                      (item.survey_name as string) ||
                      (item.name as string) ||
                      (item.survey_type as string) ||
                      `Survey ${index + 1}`,
                    value:
                      Number(
                        item.response_count ||
                          item.responses ||
                          item.count ||
                          item.value ||
                          item.survey_count
                      ) || 0,
                    color: surveyColors[index % surveyColors.length],
                  }));
              }

              // Handle direct object format
              if (typeof apiData === "object" && !Array.isArray(apiData)) {
                return Object.entries(apiData as Record<string, unknown>)
                  .slice(0, 3)
                  .map(([key, value], index) => ({
                    name: key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase()),
                    value: Number(value) || 0,
                    color: surveyColors[index % surveyColors.length],
                  }));
              }

              return [];
            };

            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <SurveyAnalyticsCard
                  title="Top Surveys"
                  data={transformTopSurveys(rawData)}
                  type="surveyDistributions"
                  dateRange={
                    dateRange && dateRange.from && dateRange.to
                      ? {
                          startDate: dateRange.from,
                          endDate: dateRange.to,
                        }
                      : undefined
                  }
                />
              </SortableChartItem>
            );
          }
          default:
            return null;
        }
      default:
        return null;
    }
  };

  return (
    <>
      <style>
        {`
          [data-lov-name="Card"].bg-card,
          .bg-card {
            height: 400px !important;
          }

          [data-lov-name="CardContent"].p-6.pt-0,
          .bg-card .p-6.pt-0 {
            height: 300px !important;
            overflow-y: auto !important;
          }
            .tracking-tight{
            color: #000000;
              font-weight: 600;
              leading-trim: NONE;
          
            
            }
             .bg-card   svg , .cursor-grab svg {

                        color: #000000 !important;

            }

              .bg-card button{
            border: none !important;
            }


           .bg-card button svg{

                        color: #000000 !important;

            }

          
        `}
      </style>
      <div className="flex min-h-screen bg-analytics-background">
        {/* Sidebar */}

        {/* Main Content */}
        <div className="flex-1">
          {/* Header Section */}
          <div className="bg-white border-b border-analytics-border">
            <DashboardHeader />
          </div>

          {/* Filter Controls Section */}
          <div className="bg-white ">
            <div className="px-6 py-4">
              <div className="flex items-center justify-end">
                {/* <Button
                onClick={() => navigate('/dashboard/configuration')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configure Dashboard
              </Button> */}

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
          </div>

          {/* Summary Stats */}
          <div className="p-6">
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          </div> */}

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
                <SortableContext
                  items={chartOrder}
                  strategy={rectSortingStrategy}
                >
                  {/* Unified 2-Column Grid for All Analytics */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {chartOrder.map((chartId) => {
                      const analytic = selectedAnalytics.find(
                        (a) => a.id === chartId
                      );
                      if (!analytic) return null;
                      const card = renderAnalyticsCard(analytic);
                      const perCardLoading =
                        !!loadingMap?.[analytic.module]?.[analytic.endpoint];
                      const spanClass =
                        analytic.module === "consumables_overview" &&
                        analytic.endpoint ===
                          "consumable_inventory_value_quarterly"
                          ? "lg:col-span-2"
                          : "";
                      return card ? (
                        <SectionLoader
                          key={chartId}
                          loading={perCardLoading}
                          className={spanClass}
                        >
                          {card}
                        </SectionLoader>
                      ) : null;
                    })}
                  </div>
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
                      Select analytics from different modules to start viewing
                      your dashboard
                    </p>
                    <Button
                      onClick={() => {
                        const selector = document.querySelector(
                          "[data-analytics-selector]"
                        ) as HTMLButtonElement;
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
      </div>
    </>
  );
};
