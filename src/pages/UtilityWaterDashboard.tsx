import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchWaterAssetsData } from "@/store/slices/waterAssetsSlice";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  Import,
  RefreshCw,
  FileDown,
  Printer,
  Filter,
  Package,
  CheckCircle,
  AlertTriangle,
  Droplets,
  Activity,
  Settings,
  Calendar,
  BarChart3,
} from "lucide-react";
import { API_CONFIG } from "@/config/apiConfig";
import { WaterFilterDialog } from "../components/WaterFilterDialog";
import { BulkUploadDialog } from "../components/BulkUploadDialog";
import { AssetDataTable } from "../components/AssetDataTable";
import { AssetStats } from "../components/AssetStats";
import { StatsCard } from "../components/StatsCard";
import { useWaterAssetSearch } from "../hooks/useWaterAssetSearch";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// ── Same components as IncidentDashboard ──────────────────────────────────────
import { AssetAnalyticsSelector } from "@/components/AssetAnalyticsSelector";
import { AssetAnalyticsFilterDialog } from "@/components/AssetAnalyticsFilterDialog";

import { SiteWisePowerConsumptionChart } from "@/components/charts/SiteWisePowerConsumptionChart";
import { WaterTimeSeriesChart } from "@/components/charts/WaterTimeSeriesChart";

// ── dnd-kit ───────────────────────────────────────────────────────────────────
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Types ────────────────────────────────────────────────────────────────────
type ChartKey = "sourceBreakdown" | "siteWise" | "timeSeries";

// ─── Chart Options — same pattern as INCIDENT_CHART_OPTIONS ──────────────────
const WATER_CHART_OPTIONS = [
  {
    id: "sourceBreakdown",
    label: "Source Breakdown",
    description: "Water consumption by source type",
  },
  {
    id: "siteWise",
    label: "Site Wise Water",
    description: "Site-wise domestic water consumption",
  },
  {
    id: "timeSeries",
    label: "Water Consumption Time Series",
    description: "Water consumption trend over time",
  },
];

const WATER_CHART_KEYS = WATER_CHART_OPTIONS.map((opt) => opt.id);

// ─── SortableChartItem ────────────────────────────────────────────────────────
const SortableChartItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
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
      className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md group"
    >
      {children}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const UtilityWaterDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const {
    items: waterAssets,
    loading,
    error,
    totalCount,
    totalPages,
    filters,
    stats,
  } = useSelector((state: RootState) => state.waterAssets);

  // List tab state
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [uploadType, setUploadType] = useState<"import" | "update">("import");

  // Analytics tab state
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [selectedCharts, setSelectedCharts] =
    useState<string[]>(WATER_CHART_KEYS);
  const [chartOrder, setChartOrder] = useState<string[]>(WATER_CHART_KEYS);

  // KPI card data from API
  const [kpiData, setKpiData] = useState<{
    total_consumption: number;
    domestic: number;
    flushing: number;
    irrigation: number;
  } | null>(null);
  const [kpiLoading, setKpiLoading] = useState(false);

  // Water source chart data from API
  const [waterSourceData, setWaterSourceData] = useState<any[]>([]);
  const [waterSourceLoading, setWaterSourceLoading] = useState(false);

  // Site-wise water consumption data from API
  const [siteWaterApiData, setSiteWaterApiData] = useState<any[]>([]);
  const [siteWaterLoading, setSiteWaterLoading] = useState(false);

  // Time series data from API
  const [timeSeriesApiData, setTimeSeriesApiData] = useState<any[]>([]);
  const [timeSeriesLoading, setTimeSeriesLoading] = useState(false);

  // ── Date range ────────────────────────────────────────────────────────────
  const getDefaultDateRange = () => {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    return { startDate: fmt(lastYear), endDate: fmt(today) };
  };
  const [analyticsDateRange, setAnalyticsDateRange] =
    useState(getDefaultDateRange);

  // Convert DD/MM/YYYY → Date (for AssetAnalyticsFilterDialog props)
  const getDialogDate = (dateStr: string) => {
    const [dd, mm, yyyy] = dateStr.split("/");
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  };

  // Called when AssetAnalyticsFilterDialog applies — receives YYYY-MM-DD strings
  const handleApplyAnalyticsFilters = (startStr: string, endStr: string) => {
    const formatToDDMMYYYY = (d: string) => {
      const [y, m, day] = d.split("-");
      return `${day}/${m}/${y}`;
    };
    setAnalyticsDateRange({
      startDate: formatToDDMMYYYY(startStr),
      endDate: formatToDDMMYYYY(endStr),
    });
  };

  // ── dnd sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setChartOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Water asset search hook
  const {
    assets: searchAssets,
    loading: searchLoading,
    error: searchError,
    searchWaterAssets: performSearch,
  } = useWaterAssetSearch();

  // Visible columns
  const [visibleColumns] = useState({
    actions: true,
    serialNumber: true,
    assetName: true,
    assetId: true,
    assetNo: true,
    assetStatus: true,
    site: true,
    building: true,
    wing: true,
    floor: true,
    area: true,
    room: true,
    meterType: true,
    assetType: true,
  });

  // Fetch on mount
  useEffect(() => {
    dispatch(fetchWaterAssetsData({ page: currentPage }));
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      dispatch(fetchWaterAssetsData({ page: currentPage, filters }));
    }
  }, [currentPage, filters, dispatch]);

  // ── Helper: convert DD/MM/YYYY → YYYY-MM-DD for API ────────────────────
  const toApiDate = (ddmmyyyy: string): string => {
    const parts = ddmmyyyy.split("/");
    if (parts.length !== 3) return ddmmyyyy;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  // ── Helper: get site_id from localStorage ─────────────────────────────────
  const getSiteId = () => localStorage.getItem("selectedSiteId") || "";

  // ── Fetch all water analytics data ────────────────────────────────────────
  const fetchWaterAnalytics = useCallback(async () => {
    const siteId = getSiteId();
    const fromDate = toApiDate(analyticsDateRange.startDate);
    const toDate = toApiDate(analyticsDateRange.endDate);
    const baseUrl = API_CONFIG.BASE_URL;
    const token = API_CONFIG.TOKEN;
    if (!baseUrl || !token) return;

    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    // 1️⃣ KPI cards
    setKpiLoading(true);
    try {
      const kpiRes = await fetch(
        `${baseUrl}/utility_dashboard/water_kpis.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}`,
        { headers }
      );
      if (kpiRes.ok) {
        const kpiJson = await kpiRes.json();
        if (kpiJson.success === 1 && kpiJson.response) {
          setKpiData(kpiJson.response);
        }
      }
    } catch (err) {
      console.error("Error fetching water KPIs:", err);
    } finally {
      setKpiLoading(false);
    }

    // 2️⃣ Water Source Consumption chart
    setWaterSourceLoading(true);
    try {
      const srcRes = await fetch(
        `${baseUrl}/utility_dashboard/water_source.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}`,
        { headers }
      );
      if (srcRes.ok) {
        const srcJson = await srcRes.json();
        if (srcJson.success === 1 && srcJson.response && typeof srcJson.response === "object") {
          const transformed = Object.entries(srcJson.response).map(([sourceName, values]: [string, any]) => ({
            site: sourceName,
            mains: values.domestic || values.total || 0,
            dg: values.flushing || 0,
            renewable: values.irrigation || 0,
            consumptionPerSqFt: values.consumption_per_sq_feet ?? null,
            costPerSqFt: values.cost_per_sq_feet ?? null,
          }));
          setWaterSourceData(transformed);
        } else {
          setWaterSourceData([]);
        }
      }
    } catch (err) {
      console.error("Error fetching water source data:", err);
    } finally {
      setWaterSourceLoading(false);
    }

    // 3️⃣ Site Wise Water Consumption chart
    setSiteWaterLoading(true);
    try {
      const siteRes = await fetch(
        `${baseUrl}/utility_dashboard/site_wise_water_consumption.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}`,
        { headers }
      );
      if (siteRes.ok) {
        const siteJson = await siteRes.json();
        if (siteJson.success === 1 && siteJson.response && typeof siteJson.response === "object") {
          const transformed = Object.entries(siteJson.response).map(([siteName, values]: [string, any]) => ({
            site: siteName,
            mains: values.domestic || 0,
            dg: values.flushing || 0,
            renewable: values.irrigation || 0,
            consumptionPerSqFt: values.consumption_per_sq_feet ?? null,
            costPerSqFt: values.cost_per_sq_feet ?? null,
          }));
          setSiteWaterApiData(transformed);
        } else {
          setSiteWaterApiData([]);
        }
      }
    } catch (err) {
      console.error("Error fetching site-wise water data:", err);
    } finally {
      setSiteWaterLoading(false);
    }

    // 4️⃣ Water Consumption Time Series
    setTimeSeriesLoading(true);
    try {
      const tsRes = await fetch(
        `${baseUrl}/utility_dashboard/water_consumption_time_series.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}`,
        { headers }
      );
      if (tsRes.ok) {
        const tsJson = await tsRes.json();
        if (tsJson.success === 1 && tsJson.response && typeof tsJson.response === "object") {
          const transformed = Object.entries(tsJson.response).map(([monthKey, values]: [string, any]) => ({
            date: monthKey,
            consumption: values.total || 0,
            domestic: values.domestic_KL || 0,
            flushing: values.flushing_KL || 0,
            irrigation: values.irrigation_KL || 0,
            average: values.average || 0,
            peak: values.total || 0,
          }));
          setTimeSeriesApiData(transformed);
        } else {
          setTimeSeriesApiData([]);
        }
      }
    } catch (err) {
      console.error("Error fetching water time series data:", err);
    } finally {
      setTimeSeriesLoading(false);
    }
  }, [analyticsDateRange]);

  useEffect(() => {
    fetchWaterAnalytics();
  }, [fetchWaterAnalytics]);

  // ── Download handlers ─────────────────────────────────────────────────────
  const handleWaterSourceDownload = async () => {
    const siteId = getSiteId();
    const fromDate = toApiDate(analyticsDateRange.startDate);
    const toDate = toApiDate(analyticsDateRange.endDate);
    const baseUrl = API_CONFIG.BASE_URL;
    const token = API_CONFIG.TOKEN;
    try {
      const res = await fetch(
        `${baseUrl}/utility_dashboard/water_download.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}&type=source`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (res.ok) {
        const blob = await res.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `water_source_consumption_${fromDate}_to_${toDate}.xlsx`;
        a.click();
        URL.revokeObjectURL(downloadUrl);
      }
    } catch (err) {
      console.error("Error downloading water source data:", err);
    }
  };

  const handleSiteWiseWaterDownload = async () => {
    const siteId = getSiteId();
    const fromDate = toApiDate(analyticsDateRange.startDate);
    const toDate = toApiDate(analyticsDateRange.endDate);
    const baseUrl = API_CONFIG.BASE_URL;
    const token = API_CONFIG.TOKEN;
    try {
      const res = await fetch(
        `${baseUrl}/utility_dashboard/water_download.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}&type=sitewise`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (res.ok) {
        const blob = await res.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `site_wise_water_consumption_${fromDate}_to_${toDate}.xlsx`;
        a.click();
        URL.revokeObjectURL(downloadUrl);
      }
    } catch (err) {
      console.error("Error downloading site-wise water data:", err);
    }
  };

  const handleTimeSeriesDownload = async () => {
    const siteId = getSiteId();
    const fromDate = toApiDate(analyticsDateRange.startDate);
    const toDate = toApiDate(analyticsDateRange.endDate);
    const baseUrl = API_CONFIG.BASE_URL;
    const token = API_CONFIG.TOKEN;
    try {
      const res = await fetch(
        `${baseUrl}/utility_dashboard/water_download.json?site_id=${siteId}&from_date=${fromDate}&to_date=${toDate}&type=timeseries`,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );
      if (res.ok) {
        const blob = await res.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = `water_time_series_${fromDate}_to_${toDate}.xlsx`;
        a.click();
        URL.revokeObjectURL(downloadUrl);
      }
    } catch (err) {
      console.error("Error downloading water time series data:", err);
    }
  };

  // Transform assets
  const transformedAssets = waterAssets.map((asset, index) => ({
    id: asset.id?.toString() || "",
    name: asset.name || "",
    serialNumber: (currentPage - 1) * 15 + index + 1,
    assetNumber: asset.asset_number || "",
    status: asset.status as "in_use" | "in_storage" | "breakdown" | "disposed",
    siteName: asset.site_name || "",
    building:
      typeof asset.building === "string"
        ? { name: asset.building }
        : asset.building || null,
    wing:
      typeof asset.wing === "string"
        ? { name: asset.wing }
        : asset.wing || null,
    area:
      typeof asset.area === "string"
        ? { name: asset.area }
        : asset.area || null,
    pmsRoom:
      typeof asset.room === "string"
        ? { name: asset.room }
        : asset.room || null,
    assetGroup: asset.meter_type || "",
    assetSubGroup: asset.asset_type || "",
    assetType: false,
    purchaseCost: asset.purchase_cost,
    currentBookValue: asset.current_book_value,
    floor:
      typeof asset.floor === "string"
        ? { name: asset.floor }
        : asset.floor || null,
    category: asset.meter_type || "Water Asset",
  }));

  const transformedSearchedAssets = searchAssets.map((asset, index) => ({
    id: asset.id?.toString() || "",
    name: asset.name || "",
    serialNumber: (currentPage - 1) * 15 + index + 1,
    assetNumber: asset.asset_number || "",
    status: asset.status as "in_use" | "in_storage" | "breakdown" | "disposed",
    siteName: asset.site_name || "",
    building:
      typeof asset.building === "string"
        ? { name: asset.building }
        : asset.building || null,
    wing:
      typeof asset.wing === "string"
        ? { name: asset.wing }
        : asset.wing || null,
    area:
      typeof asset.area === "string"
        ? { name: asset.area }
        : asset.area || null,
    pmsRoom:
      typeof asset.room === "string"
        ? { name: asset.room }
        : asset.room || null,
    assetGroup: asset.meter_type || "",
    assetSubGroup: asset.asset_type || "",
    assetType: false,
    floor:
      typeof asset.floor === "string"
        ? { name: asset.floor }
        : asset.floor || null,
    category: asset.meter_type || "Water Asset",
  }));

  const displayAssets = searchTerm.trim()
    ? transformedSearchedAssets
    : transformedAssets;
  const isSearchMode = searchTerm.trim().length > 0;

  const pagination = {
    currentPage,
    totalPages: totalPages || 1,
    totalCount: totalCount || 0,
  };

  const handleAdd = () => navigate("/utility/water/add-asset?type=Water");
  const handleAddSchedule = () =>
    navigate("/maintenance/schedule/add?type=Water");
  const handleImport = () => {
    setUploadType("import");
    setIsBulkUploadOpen(true);
  };
  const handleUpdate = () => {
    setUploadType("update");
    setIsBulkUploadOpen(true);
  };
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) performSearch(term);
  };
  const handleRefresh = () =>
    dispatch(fetchWaterAssetsData({ page: currentPage, filters }));
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    dispatch(fetchWaterAssetsData({ page, filters }));
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedAssets(displayAssets.map((asset) => asset.id));
    else setSelectedAssets([]);
  };
  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) setSelectedAssets((prev) => [...prev, assetId]);
    else setSelectedAssets((prev) => prev.filter((id) => id !== assetId));
  };
  const handleViewAsset = (assetId: string) =>
    navigate(`/maintenance/asset/details/${assetId}?type=Water`);

  // Only render charts that are visible and in drag order
  const orderedVisibleCharts = chartOrder.filter((key) =>
    selectedCharts.includes(key)
  );
  const twoColCharts = orderedVisibleCharts.filter(
    (k) => k === "sourceBreakdown" || k === "siteWise"
  );
  const timeSeriesVisible = orderedVisibleCharts.includes("timeSeries");

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen">
      {/* Breadcrumb & Title */}
      <div>
        <div className="text-sm text-gray-600 mb-2">
          Assets &gt; Water Asset List
        </div>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
          WATER ASSET LIST
        </h1>
      </div>

      {error ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      ) : (
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
            <TabsTrigger
              value="list"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <Droplets className="w-4 h-4" />
              List
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* ── List Tab ──────────────────────────────────────────────────── */}
          <TabsContent value="list" className="mt-6 space-y-6">
            <AssetStats
              stats={{
                total_count: stats.total,
                total_value: 0,
                non_it_assets: stats.total,
                it_assets: 0,
                in_use_count: stats.inUse,
                breakdown_count: stats.breakdown,
                in_store: 0,
                allocated_count: 0,
                dispose_assets: 0,
              }}
            />

            <div className="relative">
              <AssetDataTable
                assets={displayAssets}
                selectedAssets={selectedAssets}
                visibleColumns={visibleColumns}
                onSelectAll={handleSelectAll}
                onSelectAsset={handleSelectAsset}
                onViewAsset={handleViewAsset}
                handleAddAsset={handleAdd}
                handleImport={handleImport}
                onFilterOpen={() => setIsFilterOpen(true)}
                onSearch={handleSearch}
                onRefreshData={handleRefresh}
                handleAddSchedule={handleAddSchedule}
                loading={loading || searchLoading}
              />

              {!loading &&
                !searchLoading &&
                displayAssets.length === 0 &&
                Object.keys(filters).length > 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-500 text-lg mb-2">
                      No water assets found
                    </div>
                    <div className="text-gray-400 text-sm">
                      Try adjusting your filters to see more results
                    </div>
                  </div>
                )}
            </div>

            {!isSearchMode && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          pagination.currentPage > 1 &&
                          handlePageChange(pagination.currentPage - 1)
                        }
                        className={
                          pagination.currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        isActive={pagination.currentPage === 1}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>

                    {pagination.currentPage > 4 && (
                      <PaginationItem>
                        <span className="px-4 py-2">...</span>
                      </PaginationItem>
                    )}

                    {Array.from(
                      { length: 3 },
                      (_, i) => pagination.currentPage - 1 + i
                    )
                      .filter(
                        (page) => page > 1 && page < pagination.totalPages
                      )
                      .map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => handlePageChange(page)}
                            isActive={pagination.currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                    {pagination.currentPage < pagination.totalPages - 3 && (
                      <PaginationItem>
                        <span className="px-4 py-2">...</span>
                      </PaginationItem>
                    )}

                    {pagination.totalPages > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() =>
                            handlePageChange(pagination.totalPages)
                          }
                          isActive={
                            pagination.currentPage === pagination.totalPages
                          }
                        >
                          {pagination.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          pagination.currentPage < pagination.totalPages &&
                          handlePageChange(pagination.currentPage + 1)
                        }
                        className={
                          pagination.currentPage === pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <div className="text-center mt-2 text-sm text-gray-600">
                  Showing page {pagination.currentPage} of{" "}
                  {pagination.totalPages} ({pagination.totalCount} total water
                  assets)
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Analytics Tab ─────────────────────────────────────────────── */}
          <TabsContent value="analytics" className="space-y-4 mt-6">
            {/* Filters row */}
            <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
              {/* Date filter — same as IncidentDashboard */}
              <Button
                variant="outline"
                onClick={() => setIsAnalyticsFilterOpen(true)}
                className="flex items-center justify-between w-full sm:w-[280px] px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {analyticsDateRange.startDate} -{" "}
                    {analyticsDateRange.endDate}
                  </span>
                </div>
                <Filter className="w-4 h-4 text-gray-600" />
              </Button>

              {/* Chart selector — SAME AssetAnalyticsSelector as IncidentDashboard */}
              <div className="w-full sm:w-auto">
                <AssetAnalyticsSelector
                  options={WATER_CHART_OPTIONS}
                  selectedOptions={selectedCharts}
                  onSelectionChange={setSelectedCharts}
                  title="Select Water Charts"
                  buttonLabel="Charts"
                  dateRange={{
                    startDate: getDialogDate(analyticsDateRange.startDate),
                    endDate: getDialogDate(analyticsDateRange.endDate),
                  }}
                />
              </div>
            </div>

            {/* Water stats cards — EXACTLY as original, not touched */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 mb-6">
              {[
                {
                  label: "Total Water Consumption",
                  value: kpiLoading ? "Loading..." : `${(kpiData?.total_consumption ?? 0).toLocaleString()} kL`,
                  icon: <Droplets className="w-6 h-6 text-[#C72030]" />,
                },
                {
                  label: "Domestic Total",
                  value: kpiLoading ? "Loading..." : `${(kpiData?.domestic ?? 0).toLocaleString()} kL`,
                  icon: <Activity className="w-6 h-6 text-[#C72030]" />,
                },
                {
                  label: "Flushing Total",
                  value: kpiLoading ? "Loading..." : `${(kpiData?.flushing ?? 0).toLocaleString()} kL`,
                  icon: <RefreshCw className="w-6 h-6 text-[#C72030]" />,
                },
                {
                  label: "Irrigation Total",
                  value: kpiLoading ? "Loading..." : `${(kpiData?.irrigation ?? 0).toLocaleString()} kL`,
                  icon: <RefreshCw className="w-6 h-6 text-[#C72030]" />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative bg-[#F6F4EE] p-6 rounded-lg shadow-[0px_1px_8px_rgba(45,45,45,0.05)] flex items-center gap-4 cursor-pointer hover:shadow-lg transition-all duration-300 min-h-[88px]"
                >
                  <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xl font-semibold">{item.value}</div>
                    <div className="text-sm font-medium text-[#1A1A1A]">
                      {item.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── DndContext ─────────────────────────────────────────────── */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={chartOrder}
                strategy={rectSortingStrategy}
              >
                <div className="space-y-6 mt-6">
                  {twoColCharts.length > 0 && (
                    <div
                      className={`grid grid-cols-1 gap-6 ${twoColCharts.length > 1 ? "md:grid-cols-2" : ""}`}
                    >
                      {twoColCharts.map((key) => {
                        if (key === "sourceBreakdown") {
                          return (
                            <SortableChartItem key={key} id={key}>
                              <SiteWisePowerConsumptionChart
                                title="Water Source Consumption"
                                data={waterSourceData}
                                bars={[
                                  { dataKey: "mains", name: "Domestic", fill: "#C72030" },
                                  { dataKey: "dg", name: "Flushing", fill: "#C6B692" },
                                  { dataKey: "renewable", name: "Irrigation", fill: "#8B6914" },
                                ]}
                                onDownload={handleWaterSourceDownload}
                              />
                            </SortableChartItem>
                          );
                        }
                        if (key === "siteWise") {
                          return (
                            <SortableChartItem key={key} id={key}>
                              <SiteWisePowerConsumptionChart
                                title="Site Wise Domestic Water Consumption"
                                data={siteWaterApiData}
                                bars={[
                                  { dataKey: "mains", name: "Domestic", fill: "#C72030" },
                                  { dataKey: "dg", name: "Flushing", fill: "#C6B692" },
                                  { dataKey: "renewable", name: "Irrigation", fill: "#8B6914" },
                                ]}
                                onDownload={handleSiteWiseWaterDownload}
                              />
                            </SortableChartItem>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}

                  {timeSeriesVisible && (
                    <SortableChartItem key="timeSeries" id="timeSeries">
                      <WaterTimeSeriesChart
                        title="Water Consumption - Time Series"
                        data={timeSeriesApiData}
                        onDownload={handleTimeSeriesDownload}
                      />
                    </SortableChartItem>
                  )}

                  {orderedVisibleCharts.length === 0 && (
                    <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p>
                        No charts selected. Please select a chart from the
                        dropdown above.
                      </p>
                    </div>
                  )}
                </div>
              </SortableContext>
            </DndContext>
          </TabsContent>
        </Tabs>
      )}

      {/* Dialogs */}
      <WaterFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <BulkUploadDialog
        open={isBulkUploadOpen}
        onOpenChange={setIsBulkUploadOpen}
        title={
          uploadType === "import"
            ? "Import Water Assets"
            : "Update Water Assets"
        }
      />

      {/* SAME AssetAnalyticsFilterDialog as IncidentDashboard */}
      <AssetAnalyticsFilterDialog
        isOpen={isAnalyticsFilterOpen}
        onClose={() => setIsAnalyticsFilterOpen(false)}
        onApplyFilters={handleApplyAnalyticsFilters}
        currentStartDate={getDialogDate(analyticsDateRange.startDate)}
        currentEndDate={getDialogDate(analyticsDateRange.endDate)}
      />
    </div>
  );
};

export default UtilityWaterDashboard;
