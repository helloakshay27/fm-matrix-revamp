import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetStats } from "@/components/AssetStats";
import {
  Filter,
  Zap,
  Zap as ZapIcon,
  BarChart3,
  Droplets,
  Flame,
  Wind,
  Calendar,
  Settings,
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { AssetDataTable } from "@/components/AssetDataTable";
import type { Asset } from "@/hooks/useAssets";
import { CumulativePowerWidget } from "@/components/charts/CumulativePowerWidget";
import { SiteWisePowerConsumptionChart } from "@/components/charts/SiteWisePowerConsumptionChart";

// ── Same components as IncidentDashboard ──────────────────────────────────────
import { AssetAnalyticsSelector } from "@/components/AssetAnalyticsSelector";
import { AssetAnalyticsFilterDialog } from "@/components/AssetAnalyticsFilterDialog";

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
type ChartKey = "cumulative" | "siteWise";

// ─── Chart Options ────────────────────────────────────────────────────────────
const ENERGY_CHART_OPTIONS = [
  {
    id: "cumulative",
    label: "Sub Meter Sources",
    description: "Cumulative power from sub meter sources",
  },
  {
    id: "siteWise",
    label: "Site Wise Power",
    description: "Site-wise power consumption breakdown",
  },
];

const ENERGY_CHART_KEYS = ENERGY_CHART_OPTIONS.map((opt) => opt.id);

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
const transformEnergyAsset = (
  asset: any,
  index: number,
  currentPage: number
): Asset => ({
  id: asset.id?.toString() || "",
  name: asset.name || asset.location || "",
  serialNumber: (currentPage - 1) * 15 + index + 1,
  assetNumber: asset.asset_number || asset.id || "",
  status: ((): "in_use" | "breakdown" | "disposed" | "in_storage" => {
    if (asset.status === "in_use" || asset.status === "in use") return "in_use";
    if (asset.status === "breakdown") return "breakdown";
    if (asset.status === "disposed") return "disposed";
    return "in_storage";
  })(),
  siteName: asset.site_name || asset.location?.split(" - ")[0] || "",
  building:
    typeof asset.building === "string"
      ? { name: asset.building }
      : asset.building || null,
  wing:
    typeof asset.wing === "string" ? { name: asset.wing } : asset.wing || null,
  area:
    typeof asset.area === "string" ? { name: asset.area } : asset.area || null,
  pmsRoom:
    typeof asset.room === "string" ? { name: asset.room } : asset.room || null,
  assetGroup: asset.meter_type || asset.meterType || "",
  assetSubGroup: asset.asset_type || "",
  assetType: false,
  purchaseCost: asset.purchase_cost || asset.cost,
  currentBookValue: asset.current_book_value || null,
  floor:
    typeof asset.floor === "string"
      ? { name: asset.floor }
      : asset.floor || null,
  category: asset.meter_type || asset.meterType || "Energy Asset",
});

const calculateStats = (energyData: any[] = []) => ({
  totalConsumption: energyData.reduce(
    (sum, e) => sum + (e.consumption || 0),
    0
  ),
  totalCost: energyData.reduce((sum, e) => sum + (e.cost || 0), 0),
  avgEfficiency: energyData.length
    ? energyData.reduce((sum, e) => sum + (e.efficiency || 0), 0) /
      energyData.length
    : 0,
  highUsageAlerts: energyData.filter(
    (e) => e.status === "High" || e.status === "breakdown"
  ).length,
  normalUsage: energyData.filter(
    (e) =>
      e.status === "Normal" || e.status === "in_use" || e.status === "in use"
  ).length,
  totalMeters: energyData.length,
  peakConsumption: energyData.length
    ? Math.max(...energyData.map((e) => e.consumption || 0))
    : 0,
});

// ─── Main Component ───────────────────────────────────────────────────────────
export const EnergyDashboard = () => {
  const navigate = useNavigate();

  // ── List tab state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [energyAssets, setEnergyAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);

  // ── Analytics tab state
  const [selectedCharts, setSelectedCharts] =
    useState<string[]>(ENERGY_CHART_KEYS);
  const [chartOrder, setChartOrder] = useState<string[]>(ENERGY_CHART_KEYS);
  const [sitePowerData, setSitePowerData] = useState([]);

  // ── Date range
  const getDefaultDateRange = () => {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(
        d.getMonth() + 1
      ).padStart(2, "0")}/${d.getFullYear()}`;
    return { startDate: fmt(lastYear), endDate: fmt(today) };
  };
  const [analyticsDateRange, setAnalyticsDateRange] =
    useState(getDefaultDateRange);

  const getDialogDate = (dateStr: string) => {
    const [dd, mm, yyyy] = dateStr.split("/");
    return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  };

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
        const oldIndex = items.indexOf(active.id as ChartKey);
        const newIndex = items.indexOf(over?.id as ChartKey);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ── Fetch assets
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      setError("");
      try {
        let baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        if (!baseUrl || !token)
          throw new Error("Base URL or token not set in localStorage");
        if (!/^https?:\/\//i.test(baseUrl)) baseUrl = `https://${baseUrl}`;
        let url = `${baseUrl}/pms/assets.json?page=${currentPage}&type=Energy`;
        if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch energy assets");
        const data = await response.json();
        setEnergyAssets(data.assets || []);
        setTotalCount(data.pagination?.total_count || 0);
        setTotalPages(data.pagination?.total_pages || 1);
      } catch (err: any) {
        setError(err.message || "Error fetching energy assets");
        setEnergyAssets([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchSitePowerData = async () => {
      try {
        // API logic goes here
      } catch (err) {
        console.error("Error fetching chart data", err);
      }
    };

    fetchAssets();
    fetchSitePowerData();
  }, [currentPage, searchTerm]);

  const filteredEnergyAssets = energyAssets.filter(
    (asset: any) =>
      (asset.location || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.id?.toString() || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
  const displayAssets = filteredEnergyAssets.map((asset, idx) =>
    transformEnergyAsset(asset, idx, currentPage)
  );
  const calculatedStats = calculateStats(filteredEnergyAssets);

  const stats = {
    total_count: totalCount,
    total_value: 0,
    non_it_assets: calculatedStats.normalUsage,
    it_assets: 0,
    in_use_count: calculatedStats.normalUsage,
    breakdown_count: calculatedStats.highUsageAlerts,
    in_store: 0,
    allocated_count: calculatedStats.totalMeters,
    dispose_assets: 0,
  };

  const visibleColumns = {
    actions: true,
    serialNumber: true,
    assetName: true,
    assetId: true,
    assetNo: true,
    assetStatus: true,
    site: true,
    building: false,
    wing: false,
    floor: false,
    area: false,
    room: false,
    meterType: true,
    assetType: true,
    category: true,
  };

  const handleAddReading = () =>
    navigate("/utility/energy/add-asset?type=energy");
  const handleViewAsset = (assetId: string) =>
    navigate(`/maintenance/asset/details/${assetId}?type=Energy`);
  const handleSelectAll = (checked: boolean) =>
    checked
      ? setSelectedAssets(displayAssets.map((a) => a.id))
      : setSelectedAssets([]);
  const handleSelectAsset = (assetId: string, checked: boolean) =>
    checked
      ? setSelectedAssets((p) => [...p, assetId])
      : setSelectedAssets((p) => p.filter((id) => id !== assetId));
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const orderedVisibleCharts = chartOrder.filter((k) =>
    selectedCharts.includes(k)
  );

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] data-[state=inactive]:bg-white data-[state=inactive]:text-black border-none font-semibold"
          >
            <Zap className="w-4 h-4" />
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

        {/* ── List Tab ──────────────────────────────────────────────────────── */}
        <TabsContent value="list" className="mt-6">
          <AssetStats stats={stats} />
          <div>
            <AssetDataTable
              assets={displayAssets}
              selectedAssets={selectedAssets}
              visibleColumns={visibleColumns}
              onSelectAll={handleSelectAll}
              onSelectAsset={handleSelectAsset}
              onViewAsset={handleViewAsset}
              handleAddAsset={handleAddReading}
              handleAddSchedule={() => {}}
              handleImport={() => {}}
              onFilterOpen={() => {}}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>

          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && setCurrentPage(currentPage - 1)
                    }
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(1)}
                    isActive={currentPage === 1}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                {totalPages > 1 && (
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => setCurrentPage(totalPages)}
                      isActive={currentPage === totalPages}
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      setCurrentPage(currentPage + 1)
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>

        {/* ── Analytics Tab ─────────────────────────────────────────────────── */}
        <TabsContent value="analytics" className="space-y-4 mt-4">
          {/* Filters row */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
            {/* Date filter */}
            <Button
              variant="outline"
              onClick={() => setIsAnalyticsFilterOpen(true)}
              className="flex items-center justify-between w-full sm:w-[280px] px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {analyticsDateRange.startDate} - {analyticsDateRange.endDate}
                </span>
              </div>
              <Filter className="w-4 h-4 text-gray-600" />
            </Button>

            {/* Chart selector */}
            <div className="w-full sm:w-auto">
              <AssetAnalyticsSelector
                options={ENERGY_CHART_OPTIONS}
                selectedOptions={selectedCharts}
                onSelectionChange={setSelectedCharts}
                title="Select Energy Charts"
                buttonLabel="Charts"
                dateRange={{
                  startDate: getDialogDate(analyticsDateRange.startDate),
                  endDate: getDialogDate(analyticsDateRange.endDate),
                }}
              />
            </div>
          </div>

          {/* Metric cards — ORIGINAL CSS restored */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              {
                label: "Power Consumption",
                value:
                  calculatedStats.totalConsumption > 0
                    ? `${calculatedStats.totalConsumption.toFixed(1)} kWh`
                    : "0 kWh",
                icon: <ZapIcon className="w-6 h-6 text-[#C72030]" />,
              },
              {
                label: "Total Diesel Consumed",
                value: "0 kL",
                icon: <Droplets className="w-6 h-6 text-[#C72030]" />,
              },
              {
                label: "Solar Total",
                value: "0 tCO₂",
                icon: <Wind className="w-6 h-6 text-[#C72030]" />,
              },
              {
                label: "DG Total",
                value: "0 L",
                icon: <Flame className="w-6 h-6 text-[#C72030]" />,
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

          {/* ── Charts with DnD ───────────────────────────────────────────── */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
              <div
                className={`grid grid-cols-1 gap-6 mt-6 ${
                  orderedVisibleCharts.length > 1 ? "md:grid-cols-2" : ""
                }`}
              >
                {orderedVisibleCharts.map((key) => {
                  if (key === "cumulative")
                    return (
                      <SortableChartItem key={key} id={key}>
                        <CumulativePowerWidget />
                      </SortableChartItem>
                    );
                  if (key === "siteWise")
                    return (
                      <SortableChartItem key={key} id={key}>
                        <SiteWisePowerConsumptionChart data={sitePowerData} />
                      </SortableChartItem>
                    );
                  return null;
                })}

                {orderedVisibleCharts.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
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

      {/* AssetAnalyticsFilterDialog */}
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
