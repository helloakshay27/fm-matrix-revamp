// new comment //
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  GripVertical,
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
import { AssetStatisticsCard } from "@/components/asset-analytics";
import { AssetAnalyticsCard } from "@/components/AssetAnalyticsCard";
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
import { AIAssistantWidget } from "@/components/AIAssistantWidget";
import { DashboardAIAssistant } from "@/components/DashboardAIAssistant";
import { HelpdeskAnalyticsCard } from "@/components/dashboard/HelpdeskAnalyticsCard";
import MeetingRoomUtilizationCard from "@/components/meeting-room/MeetingRoomUtilizationCard";
import { RevenueGenerationOverviewCard } from "@/components/meeting-room/RevenueGenerationOverviewCard";
import { CenterPerformanceOverviewCard } from "@/components/meeting-room/CenterPerformanceOverviewCard";
import ResponseTATQuarterlyCard from "@/components/meeting-room/ResponseTATQuarterlyCard";
import ResolutionTATQuarterlyCard from "@/components/meeting-room/ResolutionTATQuarterlyCard";
import parkingManagementAnalyticsAPI from "@/services/parkingManagementAnalyticsAPI";
import ParkingAllocationOverviewCard from "@/components/parking/ParkingAllocationOverviewCard";
import ExecutiveParkingStatsCard from "@/components/parking-analytics/ExecutiveParkingStatsCard";
import AmountOverviewCard from "@/components/accounting/AmountOverviewCard";
import AmountClientWiseCard from "@/components/accounting/AmountClientWiseCard";
import QuickGateOverviewCard from "@/components/quickgate/QuickGateOverviewCard";
import SiteWiseVisitorsCard from "@/components/quickgate/SiteWiseVisitorsCard";
import visitorManagementAnalyticsAPI from "@/services/visitorManagementAnalyticsAPI";
import VisitorTrendAnalysisCard from "@/components/visitor/VisitorTrendAnalysisCard";
import checklistManagementAnalyticsAPI from "@/services/checklistManagementAnalyticsAPI";
import permitToWorkAnalyticsAPI from "@/services/permitToWorkAnalyticsAPI";
import incidentAnalyticsAPI from "@/services/incidentAnalyticsAPI";
import BodyInjuryChartCard from "@/components/incident-analytics/BodyInjuryChartCard";
import utilityAnalyticsAPI from "@/services/utilityAnalyticsAPI";
import UtilityConsumptionCard from "@/components/utility/UtilityConsumptionCard";
import WaterConsumptionCard from "@/components/utility/WaterConsumptionCard";
import CarbonEmissionCard from "@/components/utility/CarbonEmissionCard";
import EnergyIntensityCard from "@/components/utility/EnergyIntensityCard";
import { SiteWiseEvConsumptionCard } from "@/components/utility/SiteWiseEvConsumptionCard";
import { SiteWiseDryWasteSegregationCard } from "@/components/utility/SiteWiseDryWasteSegregationCard";
import { CumulativePowerWidget } from "@/components/charts/CumulativePowerWidget";
import { SiteWisePowerConsumptionChart } from "@/components/charts/SiteWisePowerConsumptionChart";
import { WaterTimeSeriesChart } from "@/components/charts/WaterTimeSeriesChart";
import { ChecklistProgressQuarterlyCard } from "@/components/checklist-management/ChecklistProgressQuarterlyCard";
import { TopOverdueChecklistsCenterwiseCard } from "@/components/checklist-management/TopOverdueChecklistsCenterwiseCard";
import { RecentUpdatedSidebar } from "@/components/RecentUpdatedSidebar";
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

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
  | "parking_management"
  | "visitor_management"
  | "checklist_management"
  | "surveys"
  | "permit_to_work"
  | "incident_management"
  | "utility"
  | "amount_management"
  | "quickgate_management";
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
  parking_management?: any;
  visitor_management?: any;
  checklist_management?: any;
  surveys?: any;
  permit_to_work?: any;
  incident_management?: any;
  utility?: any;
  amount_management?: any;
  quickgate_management?: any;
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

const buildAssetStatusChartData = (data: any) => {
  const statusData = data?.assets_statistics?.status || data || {};
  const siteNames =
    data?.assets_statistics?.filters?.site_names ||
    data?.filters?.site_names ||
    [];
  const hasSiteNames = Array.isArray(siteNames) && siteNames.length > 0;

  const chartData = [
    {
      name: "In Use",
      value:
        statusData.assets_in_use_total ??
        statusData.total_assets_in_use ??
        0,
      color: "#C4B99D",
    },
    {
      name: "Breakdown",
      value:
        statusData.assets_in_breakdown_total ??
        statusData.total_assets_in_breakdown ??
        0,
      color: "#DAD6CA",
    },
    {
      name: "In Store",
      value: statusData.in_store ?? 0,
      color: "#D5DBDB",
    },
    {
      name: "Disposed",
      value: statusData.in_disposed ?? 0,
      color: "#A5A5A5",
    },
  ].filter((item) => item.value > 0);

  const info =
    statusData.info ??
    (hasSiteNames
      ? `Status distribution for ${siteNames.join(", ")}`
      : "Overall distribution between in-use, breakdown, in-store, disposed assets");

  return {
    data: chartData.length
      ? chartData
      : [{ name: "No Data", value: 0, color: "#D5DBDB" }],
    info,
  };
};

const buildAssetDistributionChartData = (data: any) => {
  const distribution =
    data?.assets_statistics?.assets_distribution ||
    data?.assets_distribution ||
    {};
  const siteNames =
    data?.assets_statistics?.filters?.site_names ||
    data?.filters?.site_names ||
    [];
  const hasSiteNames = Array.isArray(siteNames) && siteNames.length > 0;

  const itAssets =
    distribution.it_assets_count ?? data?.info?.total_it_assets ?? 0;
  const nonItAssets =
    distribution.non_it_assets_count ??
    data?.info?.total_non_it_assets ??
    0;

  const chartData =
    itAssets + nonItAssets > 0
      ? [
        { name: "IT Equipment", value: itAssets, color: "#C4B99D" },
        { name: "Non-IT Equipment", value: nonItAssets, color: "#DAD6CA" },
      ]
      : [{ name: "No Data", value: 0, color: "#D5DBDB" }];

  const info = hasSiteNames
    ? `IT vs Non-IT assets for ${siteNames.join(", ")}`
    : data?.info?.info || "Distribution between IT and Non-IT assets";

  return { data: chartData, info };
};

const buildAssetCategoryChartData = (data: any) => {
  let categories: Array<{ name: string; value: number }> = [];
  const siteNames =
    data?.assets_statistics?.filters?.site_names ||
    data?.filters?.site_names ||
    [];
  const hasSiteNames = Array.isArray(siteNames) && siteNames.length > 0;

  if (data?.assets_statistics?.asset_categorywise) {
    categories = data.assets_statistics.asset_categorywise.map((item: any) => ({
      name: item.category,
      value: Number(item.count) || 0,
    }));
  } else if (Array.isArray(data?.categories)) {
    categories = data.categories.map((item: any) => ({
      name: item.category_name,
      value: Number(item.asset_count) || 0,
    }));
  } else if (data?.asset_type_category_counts) {
    categories = Object.entries(data.asset_type_category_counts).map(
      ([name, value]: [string, any]) => ({
        name,
        value: Number(value) || 0,
      })
    );
  }

  const info = hasSiteNames
    ? `Category distribution for ${siteNames.join(", ")}`
    : "Assets category-wise based on site/date range";

  if (!categories.length) {
    categories = [{ name: "No Data", value: 0 }];
  }

  return { data: categories, info };
};

const buildAssetGroupChartData = (data: any) => {
  let groups: Array<{ name: string; value: number }> = [];
  const siteNames =
    data?.assets_statistics?.filters?.site_names ||
    data?.filters?.site_names ||
    [];
  const hasSiteNames = Array.isArray(siteNames) && siteNames.length > 0;

  if (data?.assets_statistics?.assets_group_count_by_name) {
    groups = data.assets_statistics.assets_group_count_by_name.map(
      (item: any) => ({
        name: item.group_name,
        value: Number(item.count) || 0,
      })
    );
  } else if (Array.isArray(data?.group_wise_assets)) {
    groups = data.group_wise_assets.map((item: any) => ({
      name: item.group_name,
      value: Number(item.asset_count) || 0,
    }));
  }

  const info = hasSiteNames
    ? `Group-wise assets for ${siteNames.join(", ")}`
    : data?.info || "Assets group-wise based on site/date range";

  if (!groups.length) {
    groups = [{ name: "No Data", value: 0 }];
  }

  return { data: groups, info };
};

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

    // Check if the click is on an element marked as non-draggable
    if (target.closest("[data-no-drag]")) {
      // Don't start dragging - just return without calling listeners
      return;
    }

    // Check if the click is on a button, icon, or download element
    // Check for lucide-react Download icon or any clickable SVG/button
    if (
      target.closest("button") ||
      target.closest("[data-download]") ||
      target.closest(".download-btn") ||
      target.closest("[data-download-button]") ||
      target.tagName === "BUTTON"
    ) {
      // Don't start dragging - just return without calling listeners
      return;
    }

    // Special handling for SVG icons - check if it's inside a clickable area
    if (target.tagName === "SVG" || target.closest("svg")) {
      const svg = target.tagName === "SVG" ? target : target.closest("svg");
      // Check if the SVG has a cursor-pointer class (indicating it's clickable)
      if (svg?.classList.contains("cursor-pointer") ||
        svg?.parentElement?.classList.contains("cursor-pointer")) {
        // Don't start dragging - just return without calling listeners
        return;
      }
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
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md group ${className ?? ""
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
    <div className={`relative h-full flex flex-col ${className ?? ""}`}>
      <div className="flex-1 overflow-auto relative z-0">
        {children}
      </div>
      {loading && (
        <div className="absolute inset-0 z-20 rounded-lg bg-white flex items-center justify-center pointer-events-none">
          <div className="h-8 w-8 rounded-full border-2 border-gray-200 border-t-[#C72030] animate-spin" />
        </div>
      )}
    </div>
  );
};

export const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this is an executive dashboard to use separate storage
  const isExecutiveDashboard = location.pathname.includes('/dashboard-executive');
  const storagePrefix = isExecutiveDashboard ? 'executive' : 'regular';

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
  const [layouts, setLayouts] = useState<GridLayout.Layout[]>([]);
  const isInitialMount = React.useRef(true);

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

  // Load saved layout and selected analytics from localStorage on mount
  useEffect(() => {
    const savedLayout = localStorage.getItem(`${storagePrefix}DashboardGridLayout`);
    const savedAnalytics = localStorage.getItem(`${storagePrefix}DashboardSelectedAnalytics`);

    console.log(`🔍 Loading ${storagePrefix} dashboard from localStorage:`, { savedLayout, savedAnalytics });

    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        console.log("✅ Parsed saved layout:", parsedLayout);

        // Build id→endpoint map from saved analytics for accurate endpoint lookup
        const idToEndpoint: Record<string, string> = {};
        if (savedAnalytics) {
          try {
            (JSON.parse(savedAnalytics) as { id: string; endpoint: string }[]).forEach((a) => {
              if (a.id && a.endpoint) idToEndpoint[a.id] = a.endpoint;
            });
          } catch (e) { console.warn('Could not parse saved analytics for migration', e); }
        }

        // Per-endpoint config: h=default, minH=minimum, maxH=maximum allowed (for compact cards)
        const cardConfig: Record<string, { h: number; minH: number; maxH?: number }> = {
          // compact stat-box cards — cap at maxH=6 so oversized saved layouts shrink
          engagement_metrics:            { h: 4, minH: 3, maxH: 4 },
          snapshot:                      { h: 4, minH: 3, maxH: 4 },
          customer_experience_feedback:  { h: 4, minH: 3, maxH: 4 },
          revenue_generation_overview:   { h: 4, minH: 3, maxH: 4 },
          amc_contract_summary:          { h: 4, minH: 3, maxH: 4 },
          company_asset_overview:        { h: 4, minH: 3, maxH: 4 },
          // default chart/mixed cards
          customer_rating_overview:      { h: 8, minH: 6 },
          type_distribution:             { h: 8, minH: 6 },
          ticket_status:                 { h: 8, minH: 6 },
          tickets_proactive_reactive:    { h: 8, minH: 6 },
          asset_status:                  { h: 8, minH: 6 },
          group_wise:                    { h: 8, minH: 6 },
          category_wise:                 { h: 8, minH: 6 },
          expiry_analysis:               { h: 8, minH: 6 },
          service_stats:                 { h: 8, minH: 6 },
          // tall table cards
          site_wise_adoption_rate:               { h: 10, minH: 8 },
          center_performance_overview:           { h: 10, minH: 8 },
          ticket_aging_matrix:                   { h: 10, minH: 8 },
          tickets_categorywise:                  { h: 10, minH: 8 },
          unit_categorywise:                     { h: 10, minH: 8 },
          tickets_unit_categorywise:             { h: 10, minH: 8 },
          response_tat:                          { h: 10, minH: 8 },
          tickets_response_tat:                  { h: 10, minH: 8 },
          resolution_tat:                        { h: 10, minH: 8 },
          tickets_resolution_tat:                { h: 10, minH: 8 },
          cm_progress_quarterly:                 { h: 10, minH: 8 },
          cm_overdue_centerwise:                 { h: 10, minH: 8 },
          center_assets_downtime:                { h: 10, minH: 8 },
          highest_maintenance_assets:            { h: 10, minH: 8 },
          amc_contract_expiry_90:                { h: 10, minH: 8 },
          amc_contract_expired:                  { h: 10, minH: 8 },
          top_consumables_center:                { h: 10, minH: 8 },
          inventory_overstock_top10:             { h: 10, minH: 8 },
          parking_statistics:                    { h: 10, minH: 8 },
          top_management_total_amount:                   { h: 4, minH: 3, maxH: 4 },
          total_outstanding_amount_client_wise:          { h: 10, minH: 8 },
          visitor_summary:                               { h: 4, minH: 3, maxH: 4 },
          site_wise_visitors:                            { h: 10, minH: 8 },
          parking_allocation_overview:           { h: 10, minH: 8 },
          technical_checklist:                   { h: 10, minH: 8 },
          non_technical_checklist:               { h: 10, minH: 8 },
          top_ten_checklist:                     { h: 10, minH: 8 },
          site_wise_checklist:                   { h: 10, minH: 8 },
          ticket_performance_metrics:            { h: 10, minH: 8 },
          aging_closure_feedback:                { h: 9, minH: 8, maxH: 9 },
          center_wise_meeting_room_utilization:  { h: 10, minH: 8 },
          asset_statistics:                      { h: 10, minH: 8 },
          visitor_trend_analysis:                { h: 10, minH: 8 },
          response_tat_performance_quarterly:    { h: 10, minH: 8 },
          resolution_tat_performance_quarterly:  { h: 10, minH: 8 },
          inventory_overview_summary:            { h: 4, minH: 3, maxH: 4 },
          consumable_inventory_value_quarterly:  { h: 10, minH: 8 },
          status_overview:                       { h: 10, minH: 8 },
          unit_resource_wise:                    { h: 10, minH: 8 },
          service_tracking:                      { h: 10, minH: 8 },
          coverage_by_location:                  { h: 10, minH: 8 },
          vendor_performance:                    { h: 10, minH: 8 },
          energy_kpis:                           { h: 4, minH: 3, maxH: 4 },
          sub_meter_sources:                     { h: 10, minH: 8 },
          site_wise_power:                       { h: 10, minH: 8 },
          water_kpis:                            { h: 4, minH: 3, maxH: 4 },
          source_breakdown:                      { h: 10, minH: 8 },
          site_wise_water:                       { h: 10, minH: 8 },
          water_time_series:                     { h: 10, minH: 8 },
          carbon_emission:                       { h: 4, minH: 3, maxH: 4 },
          energy_intensity:                      { h: 4, minH: 3, maxH: 4 },
          site_wise_ev_consumption:              { h: 10, minH: 8 },
          site_wise_dry_waste_segregation:       { h: 10, minH: 8 },
        };

        const migratedLayout = parsedLayout.map((item: GridLayout.Layout) => {
          // Prefer endpoint from saved analytics; fall back to stripping first module prefix
          const endpoint = idToEndpoint[item.i] ?? item.i?.replace(/^[^_]+_/, '') ?? '';
          const cfg = cardConfig[endpoint];
          if (!cfg) return item;

          const tooShort = item.h < cfg.minH;
          const tooTall = cfg.maxH != null && item.h > cfg.maxH;
          if (tooShort || tooTall) {
            return { ...item, h: cfg.h, minH: cfg.minH };
          }
          return item;
        });
        setLayouts(migratedLayout);
      } catch (e) {
        console.error("❌ Failed to parse saved layout", e);
      }
    }

    if (savedAnalytics) {
      try {
        const parsedAnalytics = JSON.parse(savedAnalytics);
        console.log("✅ Parsed saved analytics:", parsedAnalytics);
        setSelectedAnalytics(parsedAnalytics);
        // Pre-mark every saved analytic as loading so the spinner shows
        // from the very first render instead of flashing empty card content.
        const initLoadingMap: Record<string, Record<string, boolean>> = {};
        parsedAnalytics.forEach((a: { module: string; endpoint: string }) => {
          initLoadingMap[a.module] = initLoadingMap[a.module] || {};
          initLoadingMap[a.module][a.endpoint] = true;
        });
        setLoadingMap(initLoadingMap);
      } catch (e) {
        console.error("❌ Failed to parse saved analytics", e);
      }
    }
    // If site_id or access_token are present in the URL, persist them to localStorage
    // so the asset analytics service will use the same payload when fetching dashboard cards.
    try {
      const params = new URLSearchParams(window.location.search);
      const siteIdParam = params.get('site_id');
      const accessTokenParam = params.get('access_token');
      if (siteIdParam) {
        console.log(`Setting selectedSiteId from URL param: ${siteIdParam}`);
        localStorage.setItem('selectedSiteId', siteIdParam);
      }
      if (accessTokenParam) {
        console.log(`Setting access_token from URL param: [REDACTED]`);
        localStorage.setItem('access_token', accessTokenParam);
      }
    } catch (e) {
      console.warn('Unable to persist URL site_id/access_token to localStorage', e);
    }

    // Mark initial mount as complete
    isInitialMount.current = false;
  }, [storagePrefix]);

  // Update chart order and generate layout only for new cards when selected analytics change
  useEffect(() => {
    console.log("🔄 selectedAnalytics changed:", selectedAnalytics.length, "isInitialMount:", isInitialMount.current);

    // Skip layout generation on initial mount - layouts are loaded from localStorage
    if (isInitialMount.current) {
      console.log("⏭️ Skipping layout generation on initial mount");
      setChartOrder(selectedAnalytics.map((analytic) => analytic.id));
      return;
    }

    // Skip layout generation when no analytics selected (fires on initial mount before
    // localStorage loads because the first effect sets isInitialMount=false synchronously)
    if (selectedAnalytics.length === 0) {
      setChartOrder([]);
      return;
    }

    setChartOrder(selectedAnalytics.map((analytic) => analytic.id));

    console.log("📐 Current layouts:", layouts);

    // Only generate layouts for new cards that don't have existing layouts
    const newLayouts = selectedAnalytics.map((analytic, index) => {
      const existingLayout = layouts.find((l) => l.i === analytic.id);
      if (existingLayout) {
        console.log("✅ Using existing layout for:", analytic.id, existingLayout);
        return existingLayout;
      }

      console.log("🆕 Generating new layout for:", analytic.id);

      // Cards that should use compact height (simple stat/metric cards only)
      const compactCards = [
        'customer_experience_feedback',
        'engagement_metrics',
        'revenue_generation_overview',
        'amc_contract_summary',
        'snapshot',                  // helpdesk snapshot — 5 stat boxes, no table
        'company_asset_overview',    // 3 stat boxes only
        'inventory_overview_summary', // 6 stat boxes only
        'energy_kpis',               // 4 KPI stat boxes
        'water_kpis',                // 4 KPI stat boxes
        'carbon_emission',           // 2 KPI stat boxes
        'energy_intensity',          // 4 KPI stat boxes
      ];

      // Table-heavy and complex cards that need extra height to show all rows
      const tallCards = [
        'site_wise_adoption_rate',
        'center_performance_overview',
        'ticket_aging_matrix',
        'tickets_categorywise',
        'unit_categorywise',
        'tickets_unit_categorywise',
        'response_tat',
        'tickets_response_tat',
        'resolution_tat',
        'tickets_resolution_tat',
        'cm_progress_quarterly',
        'cm_overdue_centerwise',
        'center_assets_downtime',
        'highest_maintenance_assets',
        'amc_contract_expiry_90',
        'amc_contract_expired',
        'top_consumables_center',
        'inventory_overstock_top10',
        'parking_allocation_overview',
        'technical_checklist',
        'non_technical_checklist',
        'top_ten_checklist',
        'site_wise_checklist',
        'ticket_performance_metrics',
        'aging_closure_feedback',
        'center_wise_meeting_room_utilization',
        'asset_statistics',
        'visitor_trend_analysis',
        'response_tat_performance_quarterly',
        'resolution_tat_performance_quarterly',
        'consumable_inventory_value_quarterly',
        'status_overview',
        'unit_resource_wise',
        'service_tracking',
        'coverage_by_location',
        'vendor_performance',
        'service_stats',
        'sub_meter_sources',
        'site_wise_power',
        'source_breakdown',
        'site_wise_water',
        'water_time_series',
        'site_wise_ev_consumption',
        'site_wise_dry_waste_segregation',
      ];

      const isCompactCard = compactCards.includes(analytic.endpoint);
      const isTallCard = tallCards.includes(analytic.endpoint);

      const h4Cards = ['engagement_metrics', 'customer_experience_feedback', 'snapshot', 'company_asset_overview', 'inventory_overview_summary', 'revenue_generation_overview', 'amc_contract_summary', 'energy_kpis', 'water_kpis', 'carbon_emission', 'energy_intensity'];
      const h9Cards = ['aging_closure_feedback'];
      const cardH = h4Cards.includes(analytic.endpoint) ? 4 : h9Cards.includes(analytic.endpoint) ? 9 : isCompactCard ? 5 : isTallCard ? 10 : 8;
      const cardMinH = h4Cards.includes(analytic.endpoint) ? 3 : h9Cards.includes(analytic.endpoint) ? 8 : isCompactCard ? 4 : isTallCard ? 8 : 6;

      // Find the maximum y position to place new cards below existing ones
      const maxY = layouts.length > 0
        ? Math.max(...layouts.map(l => l.y + l.h))
        : 0;

      // Full width layout for analytics cards: each card takes full width (12 columns)
      // Recent Updates sidebar is outside the grid system
      const row = index;

      return {
        i: analytic.id,
        x: 0, // Start at column 0 for full width
        y: maxY + row * cardH,
        w: 12, // Full width (12 columns)
        h: cardH,
        minW: 4,
        minH: cardMinH,
      };
    });

    // Remove layouts for cards that are no longer selected
    const selectedIds = selectedAnalytics.map(a => a.id);
    const filteredLayouts = newLayouts.filter(layout => selectedIds.includes(layout.i));

    setLayouts(filteredLayouts);
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
                    ticketAnalyticsAPI.getTicketStatusData(
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
                case "response_tat_performance_quarterly":
                  promises.push(
                    helpdeskAnalyticsAPI.getResponseTATQuarterly(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "resolution_tat_performance_quarterly":
                  promises.push(
                    helpdeskAnalyticsAPI.getResolutionTATQuarterly(
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
                case "consumption_report_green":
                  promises.push(
                    inventoryAnalyticsAPI.getConsumptionReportGreen(
                      dateRange.from!,
                      dateRange.to!
                    )
                  );
                  break;
                case "consumption_report_non_green":
                  promises.push(
                    inventoryAnalyticsAPI.getConsumptionReportNonGreen(
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
                case "parking_statistics":
                  promises.push(Promise.resolve(null));
                  break;
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
          case "amount_management":
            for (const analytic of analytics) {
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              promises.push(Promise.resolve(null));
            }
            break;
          case "quickgate_management":
            for (const analytic of analytics) {
              toLoad[module] = toLoad[module] || {};
              toLoad[module][analytic.endpoint] = true;
              promises.push(Promise.resolve(null));
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
          case "permit_to_work":
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
                case "site_wise_permits_report":
                  promises.push(
                    permitToWorkAnalyticsAPI.getSiteWisePermitsReport(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "permits_status_data":
                  promises.push(
                    permitToWorkAnalyticsAPI.getPermitsStatusData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                default:
                  promises.push(Promise.resolve(null));
              }
            }
            break;

          case "utility":
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
                case "energy_kpis":
                  promises.push(
                    utilityAnalyticsAPI.getEnergyKPIs(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "sub_meter_sources":
                  promises.push(
                    utilityAnalyticsAPI.getSubMeterSources(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "site_wise_power":
                  promises.push(
                    utilityAnalyticsAPI.getSiteWisePower(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "water_kpis":
                  promises.push(
                    utilityAnalyticsAPI.getWaterKPIs(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "source_breakdown":
                  promises.push(
                    utilityAnalyticsAPI.getWaterSourceBreakdown(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "site_wise_water":
                  promises.push(
                    utilityAnalyticsAPI.getSiteWiseWater(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "water_time_series":
                  promises.push(
                    utilityAnalyticsAPI.getWaterTimeSeries(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "carbon_emission":
                  promises.push(
                    utilityAnalyticsAPI.getCarbonEmissionScopes(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "energy_intensity":
                  promises.push(
                    utilityAnalyticsAPI.getEnergyIntensity(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "site_wise_ev_consumption":
                  promises.push(
                    utilityAnalyticsAPI.getSiteWiseEvConsumption(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "site_wise_dry_waste_segregation":
                  promises.push(
                    utilityAnalyticsAPI.getSiteWiseDryWasteSegregation(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                default:
                  promises.push(Promise.resolve(null));
              }
            }
            break;

          case "incident_management":
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
                case "top_categories":
                  promises.push(
                    incidentAnalyticsAPI.getTopCategories(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "status_summary":
                  promises.push(
                    incidentAnalyticsAPI.getStatusSummary(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "level_wise":
                  promises.push(
                    incidentAnalyticsAPI.getLevelWise(
                      dateRange.from,
                      dateRange.to
                    )
                  );
                  break;
                case "rca_data":
                  promises.push(
                    incidentAnalyticsAPI.getRcaData(
                      dateRange.from,
                      dateRange.to
                    )
                  );
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

      // Clear each card's loading spinner as soon as ITS OWN promise settles,
      // instead of waiting for all 36+ promises to finish together.
      {
        let _pi = 0;
        for (const [_mod, _anals] of Object.entries(moduleGroups)) {
          for (const _anal of _anals) {
            const _idx = _pi++;
            const _module = _mod;
            const _endpoint = _anal.endpoint;
            (promises[_idx] as Promise<unknown>).finally(() => {
              setLoadingMap((prev) => {
                const merged: Record<string, Record<string, boolean>> = { ...prev };
                merged[_module] = { ...(merged[_module] || {}) };
                merged[_module][_endpoint] = false;
                return merged;
              });
            });
          }
        }
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
          if (!result) {
            console.error(`Missing result for ${module}.${analytic.endpoint}`);
            moduleData[analytic.endpoint] = null;
            moduleErrs[analytic.endpoint] = "No result returned from API";
            continue;
          }
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
    // Pre-mark every selected analytic as loading so newly added cards show
    // a spinner immediately rather than flashing empty content.
    setLoadingMap((prev) => {
      const merged: Record<string, Record<string, boolean>> = { ...prev };
      analytics.forEach((a) => {
        merged[a.module] = { ...(merged[a.module] || {}), [a.endpoint]: true };
      });
      return merged;
    });
    // Persist selected analytics to localStorage with dashboard-specific key
    localStorage.setItem(`${storagePrefix}DashboardSelectedAnalytics`, JSON.stringify(analytics));
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

  // Handle grid layout changes — only updates React state, never touches localStorage.
  // localStorage is saved in onDragStop / onResizeStop so we never overwrite on initial render.
  const handleLayoutChange = (newLayout: GridLayout.Layout[]) => {
    setLayouts(newLayout);
  };

  // Persist layout to localStorage — called only by onDragStop and onResizeStop
  const persistLayout = (layout: GridLayout.Layout[]) => {
    console.log(`💾 Persisting ${storagePrefix} dashboard layout after user action:`, layout);
    localStorage.setItem(`${storagePrefix}DashboardGridLayout`, JSON.stringify(layout));
    localStorage.setItem(`${storagePrefix}DashboardSelectedAnalytics`, JSON.stringify(selectedAnalytics));
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
  const assetDateRange =
    dateRange?.from && dateRange?.to
      ? { startDate: dateRange.from, endDate: dateRange.to }
      : null;

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
          if (data?.proactive_reactive) {
            return {
              proactiveOpen: data.proactive_reactive.proactive.open || 0,
              proactiveClosed: data.proactive_reactive.proactive.closed || 0,
              reactiveOpen: data.proactive_reactive.reactive.open || 0,
              reactiveClosed: data.proactive_reactive.reactive.closed || 0,
              proactiveWIP: data.proactive_reactive.proactive.wip || 0,
              proactiveInfo: data.proactive_reactive.proactive.info,
            };
          }
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
              detailedSummary: data.detailed_summary || null,
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
          case "ticket_status": {
            // Ticket Status Overview
            const statusData =
              data &&
                typeof data === "object" &&
                "open" in data &&
                "closed" in data
                ? data
                : { open: 0, closed: 0, wip: 0 };

            return (
              <TicketStatusOverviewCard
                openTickets={statusData.open || 0}
                closedTickets={statusData.closed || 0}
                detailedSummary={statusData.detailedSummary || null}
              />
            );
          }

          case "tickets_proactive_reactive": {
            // Proactive/Reactive tickets breakdown
            // The data has already been transformed by transformTicketData
            // It now has the flat structure: proactiveOpen, proactiveClosed, reactiveOpen, reactiveClosed
            console.log(
              "🔍 tickets_proactive_reactive - Transformed data:",
              data
            );

            const proactiveReactiveData =
              data && typeof data === "object" && "proactiveOpen" in data
                ? data
                : {
                  proactiveOpen: 0,
                  proactiveClosed: 0,
                  reactiveOpen: 0,
                  reactiveClosed: 0,
                };

            console.log("🔍 tickets_proactive_reactive - Final values:", {
              proactiveOpen: proactiveReactiveData.proactiveOpen,
              proactiveClosed: proactiveReactiveData.proactiveClosed,
              reactiveOpen: proactiveReactiveData.reactiveOpen,
              reactiveClosed: proactiveReactiveData.reactiveClosed,
            });

            return (
              <ProactiveReactiveCard
                proactiveOpenTickets={
                  proactiveReactiveData.proactiveOpen || 0
                }
                proactiveClosedTickets={
                  proactiveReactiveData.proactiveClosed || 0
                }
                reactiveOpenTickets={proactiveReactiveData.reactiveOpen || 0}
                reactiveClosedTickets={
                  proactiveReactiveData.reactiveClosed || 0
                }
              />
            );
          }

          case "tickets_categorywise": {
            // Category-wise Proactive/Reactive
            const categoryData = Array.isArray(data) ? data : [];

            return (
              <CategoryWiseProactiveReactiveCard
                data={categoryData}
                dateRange={{
                  startDate: dateRange?.from || new Date(),
                  endDate: dateRange?.to || new Date(),
                }}
              />
            );
          }

          case "tickets_unit_categorywise":
          case "unit_categorywise": {
            // Unit Category-wise tickets
            const unitCategoryData =
              data && typeof data === "object" ? data : null;

            return (
              <UnitCategoryWiseCard
                data={unitCategoryData}
                dateRange={{
                  startDate: dateRange?.from || new Date(),
                  endDate: dateRange?.to || new Date(),
                }}
              />
            );
          }

          case "ticket_aging_matrix": {
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
            );
          }

          case "tickets_response_tat":
          case "response_tat":
            // Response TAT
            return (
              <ResponseTATCard
                data={data}
                dateRange={{
                  startDate: dateRange?.from || new Date(),
                  endDate: dateRange?.to || new Date(),
                }}
              />
            );

          case "tickets_resolution_tat":
          case "resolution_tat":
            // Resolution TAT
            return (
              <ResolutionTATCard
                data={data}
                dateRange={{
                  startDate: dateRange?.from || new Date(),
                  endDate: dateRange?.to || new Date(),
                }}
              />
            );

          default:
            // Fallback to simplified TicketAnalyticsCard for other endpoints
            return (
              <TicketAnalyticsCard
                title={analytic.title}
                data={data}
                type={analytic.endpoint as any}
              />
            );
        }
      case "tasks": {
        // Map endpoint names to TaskAnalyticsCard type values
        const getTaskAnalyticsType = (endpoint: string) => {
          switch (endpoint) {
            case "technical_checklist": {
              return "technical";
            }
            case "non_technical_checklist": {
              return "nonTechnical";
            }
            case "top_ten_checklist": {
              return "topTen";
            }
            case "site_wise_checklist": {
              return "siteWise";
            }
            default: {
              return "technical";
            }
          }
        };

        return (
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
        );
      }
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
      case "inventory": {
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
        );
      }
      case "schedule":
        return (
          <ScheduleAnalyticsCard
            title={analytic.title}
            data={data}
            type={analytic.endpoint as any}
          />
        );
      case "assets": {
        const downloadGuard = (
          fn: (from: Date, to: Date) => Promise<void>
        ): (() => Promise<void>) | undefined => {
          if (!assetDateRange) return undefined;
          return () => fn(assetDateRange.startDate, assetDateRange.endDate);
        };

        switch (analytic.endpoint) {
          case "asset_status": {
            if (!assetDateRange) return null;
            const { data: chartData, info } = buildAssetStatusChartData(rawData);
            return (
              <AssetAnalyticsCard
                title={analytic.title}
                data={chartData}
                type="statusDistribution"
                dateRange={assetDateRange}
                info={info}
                onDownload={downloadGuard(
                  assetAnalyticsDownloadAPI.downloadAssetsInUseData
                )}
              />
            );
          }
          case "asset_statistics": {
            const metricDownloads = assetDateRange
              ? {
                total_assets: downloadGuard(
                  assetAnalyticsDownloadAPI.downloadCardTotalAssets
                ),
                assets_in_use: downloadGuard(
                  assetAnalyticsDownloadAPI.downloadCardAssetsInUse
                ),
                assets_in_breakdown: downloadGuard(
                  assetAnalyticsDownloadAPI.downloadCardAssetsInBreakdown
                ),
                critical_assets_breakdown: downloadGuard(
                  assetAnalyticsDownloadAPI.downloadCardCriticalAssetsInBreakdown
                ),
                ppm_assets: downloadGuard(
                  assetAnalyticsDownloadAPI.downloadCardPPMConductAssets
                ),
                amc_assets: downloadGuard(
                  assetAnalyticsDownloadAPI.downloadCardAMCAssets
                ),
              }
              : undefined;

            const onDownloadAll =
              metricDownloads && Object.values(metricDownloads).some(Boolean)
                ? async () => {
                  for (const handler of Object.values(metricDownloads)) {
                    if (handler) {
                      await handler();
                    }
                  }
                }
                : undefined;

            return (
              <AssetStatisticsCard
                data={data}
                onDownload={onDownloadAll}
                metricDownloads={metricDownloads}
              />
            );
          }
          case "group_wise": {
            if (!assetDateRange) return null;
            const { data: chartData, info } = buildAssetGroupChartData(rawData);
            return (
              <AssetAnalyticsCard
                title={analytic.title}
                data={chartData}
                type="groupWise"
                dateRange={assetDateRange}
                info={info}
                onDownload={downloadGuard(
                  assetAnalyticsDownloadAPI.downloadGroupWiseAssetsData
                )}
              />
            );
          }
          case "category_wise": {
            if (!assetDateRange) return null;
            const { data: chartData, info } = buildAssetCategoryChartData(rawData);
            return (
              <AssetAnalyticsCard
                title={analytic.title}
                data={chartData}
                type="categoryWise"
                dateRange={assetDateRange}
                info={info}
                onDownload={downloadGuard(
                  assetAnalyticsDownloadAPI.downloadCategoryWiseAssetsData
                )}
              />
            );
          }
          case "asset_distribution": {
            if (!assetDateRange) return null;
            const { data: chartData, info } =
              buildAssetDistributionChartData(rawData);
            return (
              <AssetAnalyticsCard
                title={analytic.title}
                data={chartData}
                type="assetDistributions"
                dateRange={assetDateRange}
                info={info}
                onDownload={downloadGuard(
                  assetAnalyticsDownloadAPI.downloadAssetDistributionsData
                )}
              />
            );
          }
          default:
            return null;
        }
      }
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
                <CenterAssetsDowntimeMetricsCard
                  data={rawData}
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await assetManagementAnalyticsAPI.downloadAssetOverview(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
              </SortableChartItem>
            );
          }
          case "highest_maintenance_assets": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <HighestMaintenanceAssetsCard
                  data={rawData}
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await assetManagementAnalyticsAPI.downloadAssetOverview(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
              </SortableChartItem>
            );
          }
          case "amc_contract_summary": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AmcContractSummaryCard
                  data={rawData}
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await assetManagementAnalyticsAPI.downloadAmcOverview(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
              </SortableChartItem>
            );
          }
          case "amc_contract_expiry_90": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AmcExpiringContractsCard
                  data={rawData}
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await assetManagementAnalyticsAPI.downloadAmcOverview(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
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
                <OverstockTop10ItemsCard
                  data={rawData}
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await inventoryManagementAnalyticsAPI.downloadInventoryOverstockReport(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
              </SortableChartItem>
            );
          }
          case "top_consumables_center":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <TopConsumablesCenterOverviewCard
                  data={rawData}
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await inventoryManagementAnalyticsAPI.downloadCenterWiseConsumables(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
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
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error("Please select a date range first");
                      return;
                    }
                    toast.loading("Preparing download...");
                    try {
                      await inventoryManagementAnalyticsAPI.downloadConsumableInventoryComparison(
                        dateRange.from,
                        dateRange.to
                      );
                      toast.dismiss();
                      toast.success("Download completed successfully");
                    } catch (error) {
                      toast.dismiss();
                      toast.error("Failed to download report");
                      console.error("Download error:", error);
                    }
                  }}
                />
              </SortableChartItem>
            );
          case "consumption_report_green":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <InventoryAnalyticsCard
                  title={analytic.title}
                  data={rawData}
                  type="consumptionReportGreen"
                  titleColor="#92400E"
                  dateRange={
                    dateRange
                      ? { startDate: dateRange.from!, endDate: dateRange.to! }
                      : undefined
                  }
                />
              </SortableChartItem>
            );
          case "consumption_report_non_green":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <InventoryAnalyticsCard
                  title={analytic.title}
                  data={rawData}
                  type="consumptionReportNonGreen"
                  titleColor="#92400E"
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
      case "amount_management":
        switch (analytic.endpoint) {
          case "top_management_total_amount":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AmountOverviewCard
                  startDate={dateRange?.from ? dateRange.from.toISOString().split("T")[0] : undefined}
                  endDate={dateRange?.to ? dateRange.to.toISOString().split("T")[0] : undefined}
                />
              </SortableChartItem>
            );
          case "total_outstanding_amount_client_wise":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <AmountClientWiseCard
                  startDate={dateRange?.from ? dateRange.from.toISOString().split("T")[0] : undefined}
                  endDate={dateRange?.to ? dateRange.to.toISOString().split("T")[0] : undefined}
                />
              </SortableChartItem>
            );
          default:
            return null;
        }
      case "quickgate_management":
        switch (analytic.endpoint) {
          case "visitor_summary":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <QuickGateOverviewCard
                  startDate={dateRange?.from ? dateRange.from.toISOString().split("T")[0] : undefined}
                  endDate={dateRange?.to ? dateRange.to.toISOString().split("T")[0] : undefined}
                />
              </SortableChartItem>
            );
          case "site_wise_visitors":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <SiteWiseVisitorsCard
                  startDate={dateRange?.from ? dateRange.from.toISOString().split("T")[0] : undefined}
                  endDate={dateRange?.to ? dateRange.to.toISOString().split("T")[0] : undefined}
                />
              </SortableChartItem>
            );
          default:
            return null;
        }
      case "parking_management":
        switch (analytic.endpoint) {
          case "parking_statistics":
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <ExecutiveParkingStatsCard
                    startDate={dateRange?.from ? dateRange.from.toISOString().split("T")[0] : undefined}
                    endDate={dateRange?.to ? dateRange.to.toISOString().split("T")[0] : undefined}
                  />
              </SortableChartItem>
            );
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
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await checklistManagementAnalyticsAPI.downloadSiteWiseChecklist(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
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
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await checklistManagementAnalyticsAPI.downloadSiteWiseChecklist(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
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
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await helpdeskAnalyticsAPI.downloadTicketAgingClosureEfficiency(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
              </SortableChartItem>
            );
          }
          case "ticket_performance_metrics": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <TicketPerformanceMetricsCard
                  data={rawData}
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await helpdeskAnalyticsAPI.downloadTicketPerformanceMetrics(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
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
                <CustomerRatingOverviewCard
                  data={rawData}
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await helpdeskAnalyticsAPI.downloadCustomerExperienceFeedback(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
              </SortableChartItem>
            );
          }
          case "response_tat_performance_quarterly": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <HelpdeskAnalyticsCard
                  title={analytic.title}
                  data={rawData}
                  type="response_tat_quarterly"
                  dateRange={
                    dateRange
                      ? {
                        startDate: dateRange.from!,
                        endDate: dateRange.to!,
                      }
                      : undefined
                  }
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await helpdeskAnalyticsAPI.downloadTATPerformanceQuarterly(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
              </SortableChartItem>
            );
          }
          case "resolution_tat_performance_quarterly": {
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <HelpdeskAnalyticsCard
                  title={analytic.title}
                  data={rawData}
                  type="resolution_tat_quarterly"
                  dateRange={
                    dateRange
                      ? {
                        startDate: dateRange.from!,
                        endDate: dateRange.to!,
                      }
                      : undefined
                  }
                  onDownload={async () => {
                    if (!dateRange?.from || !dateRange?.to) {
                      toast.error('Please select a date range');
                      return;
                    }
                    try {
                      toast.info('Preparing download...');
                      await helpdeskAnalyticsAPI.downloadTATPerformanceQuarterly(dateRange.from, dateRange.to);
                      toast.success('Download completed successfully');
                    } catch (error) {
                      console.error('Download failed:', error);
                      toast.error('Failed to download data');
                    }
                  }}
                />
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
      case "permit_to_work": {
        const buildPermitSiteWiseData = (raw: any): { name: string; value: number }[] => {
          if (!raw?.response) return [];
          const chartData: { name: string; value: number }[] = [];
          for (const items of Object.values(raw.response)) {
            if (Array.isArray(items)) {
              for (const item of items) {
                if (Array.isArray(item) && item.length >= 2) {
                  chartData.push({ name: String(item[1]), value: Number(item[0]) });
                }
              }
            }
          }
          return chartData;
        };

        const buildPermitStatusData = (raw: any): { name: string; value: number }[] => {
          if (!raw?.response) return [];
          return Object.entries(raw.response)
            .filter(([key, val]) => key !== "Total" && typeof val === "number")
            .map(([key, val]) => ({ name: key, value: val as number }));
        };

        switch (analytic.endpoint) {
          case "site_wise_permits_report":
            return (
              <AssetAnalyticsCard
                title="Permit Site Wise Report"
                type="groupWise"
                data={buildPermitSiteWiseData(rawData)}
                dateRange={assetDateRange || { startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), endDate: new Date() }}
                info={rawData?.info?.info || "Site wise permits distribution"}
                onDownload={async () => {
                  if (!dateRange?.from || !dateRange?.to) return;
                  try {
                    await permitToWorkAnalyticsAPI.downloadSiteWisePermits(dateRange.from, dateRange.to);
                    toast.success("Downloaded successfully");
                  } catch {
                    toast.error("Failed to download");
                  }
                }}
              />
            );
          case "permits_status_data":
            return (
              <AssetAnalyticsCard
                title="Permit Status"
                type="categoryWise"
                data={buildPermitStatusData(rawData)}
                dateRange={assetDateRange || { startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), endDate: new Date() }}
                info={rawData?.info?.info || "Distribution of permits by status"}
                onDownload={async () => {
                  if (!dateRange?.from || !dateRange?.to) return;
                  try {
                    await permitToWorkAnalyticsAPI.downloadPermitsStatus(dateRange.from, dateRange.to);
                    toast.success("Downloaded successfully");
                  } catch {
                    toast.error("Failed to download");
                  }
                }}
              />
            );
          default:
            return null;
        }
      }

      case "utility":
        switch (analytic.endpoint) {
          case "energy_kpis": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <UtilityConsumptionCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "sub_meter_sources": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            const root = rawData?.data ?? rawData ?? {};
            const resp = root?.response ?? root ?? {};
            const PIE_COLORS = ["#A89078", "#D8DCDD", "#6B4C3A", "#8B7355", "#C4A882"];
            let pieSources: { name: string; value: number; color: string }[] | undefined;
            if (resp?.sub_meter_sources && resp.sub_meter_sources.length > 0) {
              pieSources = resp.sub_meter_sources.map((s: any, idx: number) => ({
                name: s.name,
                value: s.value,
                color: s.color || PIE_COLORS[idx % PIE_COLORS.length],
              }));
            } else if (resp?.pie) {
              const pieColors: Record<string, string> = { Solar: "#A89078", Wind: "#D8DCDD", Hydro: "#6B4C3A" };
              pieSources = Object.entries(resp.pie).map(([name, value]) => ({
                name,
                value: Number(value),
                color: pieColors[name] || "#8B7355",
              }));
            }
            const handleSubMeterDownload = async () => {
              if (!dateRange?.from || !dateRange?.to) return;
              const siteId = localStorage.getItem('selectedSiteId') || '';
              const fmt = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
              };
              const fromDate = fmt(dateRange.from);
              const toDate = fmt(dateRange.to);
              try {
                toast.info('Preparing download...');
                const baseUrl = (await import('@/config/apiConfig')).API_CONFIG.BASE_URL;
                const token = (await import('@/config/apiConfig')).API_CONFIG.TOKEN;
                const url = `${baseUrl}/utility_dashboard/energy_download.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}&type=renewable`;
                const res = await fetch(url, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                  const blob = await res.blob();
                  const downloadUrl = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `sub_meter_sources_${fromDate}_to_${toDate}.xlsx`;
                  a.click();
                  URL.revokeObjectURL(downloadUrl);
                  toast.success('Download completed');
                }
              } catch {
                toast.error('Failed to download');
              }
            };
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <CumulativePowerWidget sources={pieSources} onDownload={handleSubMeterDownload} />
              </SortableChartItem>
            );
          }
          case "site_wise_power": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            const root = rawData?.data ?? rawData ?? {};
            const resp = root?.response ?? root ?? {};
            const chartData = Object.entries(resp).map(([siteName, values]: [string, any]) => ({
              site: siteName,
              mains: values.main || 0,
              dg: values.dg || 0,
              solar: values.solar || 0,
              consumptionPerSqFt: values.consumption_per_sq_feet || 0,
            }));
            const bars = [
              { dataKey: "mains", name: "Mains", fill: "#C4A882" },
              { dataKey: "dg", name: "DG", fill: "#A89078" },
              { dataKey: "solar", name: "Solar", fill: "#D8DCDD" },
            ];
            const lines = [
              { dataKey: "consumptionPerSqFt", name: "Consumption / Sq. Ft.", stroke: "#C72030", yAxisId: "right" as const },
            ];
            const handleSiteWiseDownload = async () => {
              if (!dateRange?.from || !dateRange?.to) return;
              const siteId = localStorage.getItem('selectedSiteId') || '';
              const fmt = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
              };
              const fromDate = fmt(dateRange.from);
              const toDate = fmt(dateRange.to);
              try {
                toast.info('Preparing download...');
                const baseUrl = (await import('@/config/apiConfig')).API_CONFIG.BASE_URL;
                const token = (await import('@/config/apiConfig')).API_CONFIG.TOKEN;
                const url = `${baseUrl}/utility_dashboard/energy_download.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}&type=sitewise_consumption`;
                const res = await fetch(url, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                  const blob = await res.blob();
                  const downloadUrl = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `site_wise_power_consumption_${fromDate}_to_${toDate}.xlsx`;
                  a.click();
                  URL.revokeObjectURL(downloadUrl);
                  toast.success('Download completed');
                }
              } catch {
                toast.error('Failed to download');
              }
            };
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <SiteWisePowerConsumptionChart
                  data={chartData}
                  bars={bars}
                  lines={lines}
                  xAxisKey="site"
                  onDownload={handleSiteWiseDownload}
                />
              </SortableChartItem>
            );
          }
          case "water_kpis": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <WaterConsumptionCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "source_breakdown": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            const root = rawData?.data ?? rawData ?? {};
            const resp = root?.response ?? root ?? {};
            const wbChartData = Object.entries(resp).map(([sourceName, values]: [string, any]) => ({
              site: sourceName,
              mains: values.domestic || values.total || 0,
              dg: values.flushing || 0,
              renewable: values.irrigation || 0,
              consumptionPerSqFt: values.consumption_per_sq_feet ?? null,
              costPerSqFt: values.cost_per_sq_feet ?? null,
            }));
            const wbBars = [
              { dataKey: "mains", name: "Domestic", fill: "#C72030" },
              { dataKey: "dg", name: "Flushing", fill: "#C6B692" },
              { dataKey: "renewable", name: "Irrigation", fill: "#8B6914" },
            ];
            const handleSourceDownload = async () => {
              if (!dateRange?.from || !dateRange?.to) return;
              const siteId = localStorage.getItem('selectedSiteId') || '';
              const fmt = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
              };
              const fromDate = fmt(dateRange.from);
              const toDate = fmt(dateRange.to);
              try {
                toast.info('Preparing download...');
                const baseUrl = (await import('@/config/apiConfig')).API_CONFIG.BASE_URL;
                const token = (await import('@/config/apiConfig')).API_CONFIG.TOKEN;
                const url = `${baseUrl}/utility_dashboard/water_download.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}&type=source`;
                const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) {
                  const blob = await res.blob();
                  const downloadUrl = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `water_source_consumption_${fromDate}_to_${toDate}.xlsx`;
                  a.click();
                  URL.revokeObjectURL(downloadUrl);
                  toast.success('Download completed');
                }
              } catch { toast.error('Failed to download'); }
            };
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <SiteWisePowerConsumptionChart
                  title="Water Source Consumption"
                  data={wbChartData}
                  bars={wbBars}
                  onDownload={handleSourceDownload}
                />
              </SortableChartItem>
            );
          }
          case "site_wise_water": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            const root = rawData?.data ?? rawData ?? {};
            const resp = root?.response ?? root ?? {};
            const siteWChartData = Object.entries(resp).map(([siteName, values]: [string, any]) => ({
              site: siteName,
              mains: values.domestic || 0,
              dg: values.flushing || 0,
              renewable: values.irrigation || 0,
              consumptionPerSqFt: values.consumption_per_sq_feet ?? null,
              costPerSqFt: values.cost_per_sq_feet ?? null,
            }));
            const siteWBars = [
              { dataKey: "mains", name: "Domestic", fill: "#C72030" },
              { dataKey: "dg", name: "Flushing", fill: "#C6B692" },
              { dataKey: "renewable", name: "Irrigation", fill: "#8B6914" },
            ];
            const handleSiteWiseWaterDownload = async () => {
              if (!dateRange?.from || !dateRange?.to) return;
              const siteId = localStorage.getItem('selectedSiteId') || '';
              const fmt = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
              };
              const fromDate = fmt(dateRange.from);
              const toDate = fmt(dateRange.to);
              try {
                toast.info('Preparing download...');
                const baseUrl = (await import('@/config/apiConfig')).API_CONFIG.BASE_URL;
                const token = (await import('@/config/apiConfig')).API_CONFIG.TOKEN;
                const url = `${baseUrl}/utility_dashboard/water_download.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}&type=sitewise`;
                const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) {
                  const blob = await res.blob();
                  const downloadUrl = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `site_wise_water_consumption_${fromDate}_to_${toDate}.xlsx`;
                  a.click();
                  URL.revokeObjectURL(downloadUrl);
                  toast.success('Download completed');
                }
              } catch { toast.error('Failed to download'); }
            };
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <SiteWisePowerConsumptionChart
                  title="Site Wise Domestic Water Consumption"
                  data={siteWChartData}
                  bars={siteWBars}
                  onDownload={handleSiteWiseWaterDownload}
                />
              </SortableChartItem>
            );
          }
          case "water_time_series": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            const root = rawData?.data ?? rawData ?? {};
            const resp = root?.response ?? root ?? {};
            const tsChartData = Object.entries(resp).map(([monthKey, values]: [string, any]) => ({
              date: monthKey,
              consumption: values.total || 0,
              domestic: values.domestic_KL || 0,
              flushing: values.flushing_KL || 0,
              irrigation: values.irrigation_KL || 0,
              average: values.average || 0,
              peak: values.total || 0,
            }));
            const handleTimeSeriesDownload = async () => {
              if (!dateRange?.from || !dateRange?.to) return;
              const siteId = localStorage.getItem('selectedSiteId') || '';
              const fmt = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
              };
              const fromDate = fmt(dateRange.from);
              const toDate = fmt(dateRange.to);
              try {
                toast.info('Preparing download...');
                const baseUrl = (await import('@/config/apiConfig')).API_CONFIG.BASE_URL;
                const token = (await import('@/config/apiConfig')).API_CONFIG.TOKEN;
                const url = `${baseUrl}/utility_dashboard/water_download.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}&type=timeseries`;
                const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) {
                  const blob = await res.blob();
                  const downloadUrl = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `water_time_series_${fromDate}_to_${toDate}.xlsx`;
                  a.click();
                  URL.revokeObjectURL(downloadUrl);
                  toast.success('Download completed');
                }
              } catch { toast.error('Failed to download'); }
            };
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <WaterTimeSeriesChart
                  data={tsChartData}
                  onDownload={handleTimeSeriesDownload}
                />
              </SortableChartItem>
            );
          }
          case "carbon_emission": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <CarbonEmissionCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "energy_intensity": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <EnergyIntensityCard data={rawData} />
              </SortableChartItem>
            );
          }
          case "site_wise_ev_consumption": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            const handleEvDownload = async () => {
              if (!dateRange?.from || !dateRange?.to) return;
              const siteId = localStorage.getItem('selectedSiteId') || '';
              const fmt = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
              };
              const fromDate = fmt(dateRange.from);
              const toDate = fmt(dateRange.to);
              try {
                toast.info('Preparing download...');
                const baseUrl = (await import('@/config/apiConfig')).API_CONFIG.BASE_URL;
                const token = (await import('@/config/apiConfig')).API_CONFIG.TOKEN;
                const url = `${baseUrl}/utility_dashboard/energy_download.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}&type=ev_consumption`;
                const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) {
                  const blob = await res.blob();
                  const downloadUrl = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `site_wise_ev_consumption_${fromDate}_to_${toDate}.xlsx`;
                  a.click();
                  URL.revokeObjectURL(downloadUrl);
                  toast.success('Download completed');
                }
              } catch { toast.error('Failed to download'); }
            };
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <SiteWiseEvConsumptionCard data={rawData} onDownload={handleEvDownload} />
              </SortableChartItem>
            );
          }
          case "site_wise_dry_waste_segregation": {
            const rawData = (dashboardData as any)?.utility?.[analytic.endpoint];
            const handleWasteDownload = async () => {
              if (!dateRange?.from || !dateRange?.to) return;
              const siteId = localStorage.getItem('selectedSiteId') || '';
              const fmt = (d: Date) => {
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${y}-${m}-${day}`;
              };
              const fromDate = fmt(dateRange.from);
              const toDate = fmt(dateRange.to);
              try {
                toast.info('Preparing download...');
                const baseUrl = (await import('@/config/apiConfig')).API_CONFIG.BASE_URL;
                const token = (await import('@/config/apiConfig')).API_CONFIG.TOKEN;
                const url = `${baseUrl}/utility_dashboard/waste_segregation_download.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}`;
                const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
                if (res.ok) {
                  const blob = await res.blob();
                  const downloadUrl = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = downloadUrl;
                  a.download = `site_wise_dry_waste_segregation_${fromDate}_to_${toDate}.xlsx`;
                  a.click();
                  URL.revokeObjectURL(downloadUrl);
                  toast.success('Download completed');
                }
              } catch { toast.error('Failed to download'); }
            };
            return (
              <SortableChartItem key={analytic.id} id={analytic.id}>
                <SiteWiseDryWasteSegregationCard data={rawData} onDownload={handleWasteDownload} />
              </SortableChartItem>
            );
          }
          default:
            return null;
        }

      case "incident_management": {
        const PIE_COLORS_INC = ["#A89078", "#D8DCDD", "#6B4C3A", "#C4B8A8", "#9E9E9E"];

        const buildIncidentPieData = (raw: any): { name: string; value: number }[] => {
          if (!raw?.response) return [];
          return Object.entries(raw.response)
            .filter(([, val]) => typeof val === "number" && (val as number) > 0)
            .map(([key, val]) => ({ name: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), value: val as number }));
        };

        const buildIncidentBarData = (raw: any): { name: string; value: number }[] => {
          if (!raw?.response) return [];
          return Object.entries(raw.response).map(([site, val]) => ({
            name: site,
            value: Number(val),
          }));
        };

        const defaultRange = assetDateRange || {
          startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
          endDate: new Date(),
        };

        switch (analytic.endpoint) {
          case "top_categories": {
            const pieData = buildIncidentPieData(rawData).map((d, i) => ({
              ...d,
              color: PIE_COLORS_INC[i % PIE_COLORS_INC.length],
            }));
            return (
              <AssetAnalyticsCard
                title="Top 5 Category-wise Incidents"
                type="categoryWise"
                data={pieData}
                dateRange={defaultRange}
                info="Incidents divided by main categories"
                onDownload={async () => {
                  if (!dateRange?.from || !dateRange?.to) return;
                  try {
                    await incidentAnalyticsAPI.downloadTopCategories(dateRange.from, dateRange.to);
                    toast.success("Downloaded successfully");
                  } catch {
                    toast.error("Failed to download");
                  }
                }}
              />
            );
          }
          case "status_summary": {
            const STATUS_COLORS: Record<string, string> = {
              open: "#A89078",
              closed: "#C4B8A8",
              other: "#D8DCDD",
              under_investigation: "#6B4C3A",
            };
            const statusData = rawData?.response
              ? Object.entries(rawData.response)
                  .filter(([, val]) => typeof val === "number" && (val as number) > 0)
                  .map(([key, val]) => ({
                    name: key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
                    value: val as number,
                    color: STATUS_COLORS[key] || "#9E9E9E",
                  }))
              : [];
            return (
              <AssetAnalyticsCard
                title="Incident Status Distribution"
                type="categoryWise"
                data={statusData}
                dateRange={defaultRange}
                info="Open vs Closed vs Under Investigation"
                onDownload={async () => {
                  if (!dateRange?.from || !dateRange?.to) return;
                  try {
                    await incidentAnalyticsAPI.downloadStatusSummary(dateRange.from, dateRange.to);
                    toast.success("Downloaded successfully");
                  } catch {
                    toast.error("Failed to download");
                  }
                }}
              />
            );
          }
          case "level_wise":
            return (
              <AssetAnalyticsCard
                title="Level Wise Incidents"
                type="groupWise"
                data={buildIncidentBarData(rawData)}
                dateRange={defaultRange}
                info="Incidents grouped by risk levels"
                onDownload={async () => {
                  if (!dateRange?.from || !dateRange?.to) return;
                  try {
                    await incidentAnalyticsAPI.downloadLevelWise(dateRange.from, dateRange.to);
                    toast.success("Downloaded successfully");
                  } catch {
                    toast.error("Failed to download");
                  }
                }}
              />
            );
          case "rca_data": {
            const rcaRows: any[] = rawData?.response || [];
            const RCA_COLS = [
              { key: "site_name", label: "Site" },
              { key: "incident_occurrence_date", label: "Date" },
              { key: "incident_category_name", label: "Category" },
              { key: "incident_level_name", label: "Level" },
              { key: "incident_status_raw", label: "Status" },
              { key: "incident_description", label: "Description" },
              { key: "incident_rca_text", label: "RCA" },
            ];
            const getLevelBadgeClass = (level: string) => {
              if (!level) return "bg-gray-100 text-gray-600";
              if (level.includes("High") || level.includes("Extreme")) return "bg-red-100 text-red-700";
              if (level.includes("Medium") || level.includes("Moderate")) return "bg-yellow-100 text-yellow-700";
              if (level.includes("Low")) return "bg-green-100 text-green-700";
              return "bg-gray-100 text-gray-600";
            };
            const getStatusBadgeClass = (status: string) => {
              if (!status) return "bg-gray-100 text-gray-600";
              const s = status.toLowerCase();
              if (s === "open") return "bg-blue-100 text-blue-700";
              if (s === "closed") return "bg-green-100 text-green-700";
              if (s.includes("observation") || s.includes("investigation")) return "bg-yellow-100 text-yellow-700";
              return "bg-gray-100 text-gray-600";
            };
            return (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#1A1A1A]">RCA Data</h3>
                  {/* <button
                    type="button"
                    onClick={async () => {
                      if (!dateRange?.from || !dateRange?.to) return;
                      try {
                        await incidentAnalyticsAPI.downloadRcaData(dateRange.from, dateRange.to);
                        toast.success("Downloaded successfully");
                      } catch {
                        toast.error("Failed to download");
                      }
                    }}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#C72030] border border-[#C72030] rounded px-3 py-1.5 hover:bg-[#C72030] hover:text-white transition-colors"
                  >
                    Export
                  </button> */}
                </div>
                {rcaRows.length === 0 ? (
                    <div className="py-12 text-center text-sm text-gray-400">No RCA data found.</div>
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-gray-200 mx-4 mb-4 mt-2">
                    <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header text-center" style={{ backgroundColor: "#D97655" }}>Sr.</th>
                          {RCA_COLS.map(c => (
                            <th key={c.key} className="px-4 py-3 text-white font-semibold text-xs whitespace-nowrap analytics-header text-center" style={{ backgroundColor: "#D97655" }}>{c.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rcaRows.slice(0, 20).map((row, idx) => (
                          <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#ffffff" : "#F6F4EE" }}>
                            <td className="px-4 py-3 text-left text-gray-500 font-medium text-xs border-b border-gray-100 whitespace-nowrap">{idx + 1}</td>
                            {RCA_COLS.map(c => {
                              const val = row[c.key] ?? null;
                              if (c.key === "incident_level_name") {
                                return (
                                  <td key={c.key} className="px-4 py-3 text-left whitespace-nowrap border-b border-gray-100">
                                    {val ? <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${getLevelBadgeClass(val)}`}>{val}</span> : <span className="text-gray-400">-</span>}
                                  </td>
                                );
                              }
                              if (c.key === "incident_status_raw") {
                                return (
                                  <td key={c.key} className="px-4 py-3 text-left whitespace-nowrap border-b border-gray-100">
                                    {val ? <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${getStatusBadgeClass(val)}`}>{val.replace(/_/g, " ").replace(/\b\w/g, (ch: string) => ch.toUpperCase())}</span> : <span className="text-gray-400">-</span>}
                                  </td>
                                );
                              }
                              const isLong = ["incident_description", "incident_rca_text"].includes(c.key);
                              return (
                                <td key={c.key} className={`px-4 py-3 text-left text-gray-700 text-xs border-b border-gray-100 ${isLong ? "max-w-[180px]" : "whitespace-nowrap"}`}>
                                  {val ? (isLong ? <span title={val} className="block truncate">{val}</span> : val) : <span className="text-gray-400">-</span>}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                    </div>
                  )}
                {rcaRows.length > 20 && (
                  <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 text-center">
                    Showing first 20 of {rcaRows.length} records — export for full data
                  </div>
                )}
              </div>
            );
          }
          case "body_injury_chart": {
            const startDate = dateRange?.from
              ? dateRange.from.toISOString().split("T")[0]
              : undefined;
            const endDate = dateRange?.to
              ? dateRange.to.toISOString().split("T")[0]
              : undefined;
            return (
              <BodyInjuryChartCard
                startDate={startDate}
                endDate={endDate}
              />
            );
          }
          default:
            return null;
        }
      }

      default:
        return null;
    }
  };

  const effectiveLayouts = layouts || [];

  return (
    <>
      <style>
        {`
          /* Grid Layout Item Styles */
          .react-grid-layout {
            background: transparent;
          }
          
          .react-grid-item {
            overflow: visible !important;
            background: transparent !important;
            border-radius: 0;
            box-shadow: none;
            padding: 0;
            transition: box-shadow 0.3s ease;
          }
          
          .react-grid-item > .react-resizable-handle {
            position: absolute;
            width: 20px;
            height: 20px;
            bottom: 0;
            right: 0;
            cursor: se-resize;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><polygon points="10 0 10 10 0 10" fill="%23999" opacity="0.5"/></svg>') no-repeat bottom right;
            background-origin: content-box;
            box-sizing: border-box;
            padding: 0 8px 8px 0;
          }
          
          .react-grid-item > .react-resizable-handle::after {
            content: "";
            position: absolute;
            right: 3px;
            bottom: 3px;
            width: 5px;
            height: 5px;
            border-right: 2px solid #999;
            border-bottom: 2px solid #999;
            opacity: 0.5;
          }

          /* Card wrapper - allows resize to work properly */
          .analytics-card-wrapper {
            height: 100%;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            background: white;
            display: flex;
            flex-direction: column;
          }
          
          .analytics-card-wrapper:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }

          /* Card content - scales with resize */
          .analytics-card-content {
            flex: 1;
            overflow: auto;
            min-height: 0;
          }

          /* Placeholder styling for resize */
          .react-grid-placeholder {
            background: #e5e7eb !important;
            opacity: 0.5 !important;
            border-radius: 8px;
            border: 2px dashed #999 !important;
            z-index: 2;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            -o-user-select: none;
            user-select: none;
          }

          /* Card specific styles */
          [data-lov-name="Card"].bg-card,
          .bg-card {
            height: 100% !important;
            box-shadow: none !important;
            border-radius: 0;
          }
          
          .bg-card.coverage-card {
            height: 100% !important;
            max-height: none !important;
            box-shadow: none !important;
          }

          [data-lov-name="CardContent"].p-6.pt-0,
          .bg-card .p-6.pt-0 {
            height: auto !important;
            overflow-y: auto !important;
          }
          
          .tracking-tight {
            color: #000000;
            font-weight: 600;
          }
          
          .bg-card svg,
          .cursor-grab svg {
            color: #000000 !important;
          }

          .bg-card button {
            border: none !important;
          }

          .bg-card button svg {
            color: #000000 !important;
          }

          h1, h2, h3, h4, h5, h6 {
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

          {/* Page Title Section */}

          {/* Filter Controls Section */}
          <div className="bg-white ">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="bg-white border-b border-analytics-border">
                  <div className="px-6 py-4">
                    <h1 className="text-lg font-bold text-gray-900">
                      {location.pathname === "/dashboard-executive"
                        ? "Executive Dashboard View "
                        : "Dashboard View"}
                    </h1>
                  </div>
                </div>
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
          </div>

          {/* Summary Stats */}
          <div className="p-6">
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

            <div className="flex gap-6">
              {/* Main Content Area */}
              <div className="flex-1">
                {selectedAnalytics.length === 0 ? (
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
                ) : (
                  <div className="relative w-full">
                    <ResponsiveGridLayout
                      className="layout"
                      layouts={{ lg: effectiveLayouts }}
                      onLayoutChange={(layout) => handleLayoutChange(layout)}
                      onDragStop={(layout) => persistLayout(layout)}
                      onResizeStop={(layout) => persistLayout(layout)}
                      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                      cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
                      rowHeight={48}
                      margin={[12, 12]}
                      resizeHandles={["se"]}
                      containerPadding={[0, 0]}
                      compactType="vertical"
                      isDraggable={true}
                      isResizable={true}
                    >
                      {/* Analytics Cards */}
                      {chartOrder.map((chartId) => {
                        const analytic = selectedAnalytics.find(
                          (a) => a.id === chartId
                        );
                        if (!analytic) return null;

                        const perCardLoading =
                          !!loadingMap?.[analytic.module]?.[analytic.endpoint];

                        return (
                          <div key={analytic.id} className="analytics-card-wrapper">
                            <SectionLoader loading={perCardLoading} className="flex-1">
                              <div className="analytics-card-content">
                                {renderAnalyticsCard(analytic)}
                              </div>
                            </SectionLoader>
                          </div>
                        );
                      })}
                    </ResponsiveGridLayout>
                  </div>
                )}
              </div>

              {/* Recent Updates Sidebar - Always Visible */}
              <div className="flex-shrink-0 self-stretch">
                <RecentUpdatedSidebar />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Widget */}
      {location.pathname === "/dashboard" || location.pathname === "/dashboard-executive" ? (
        <DashboardAIAssistant />
      ) : (
        <AIAssistantWidget />
      )}
    </>
  );
};