import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus, Eye, AlertTriangle, Clock, CheckCircle, Settings,
  Search, PauseCircle, LifeBuoy, Calendar, Filter, BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import IncidentFilterModal from "@/components/IncidentFilterModal";
import { incidentService, type Incident } from "@/services/incidentService";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TicketAnalyticsFilterDialog } from "@/components/TicketAnalyticsFilterDialog";
import { CumulativePowerWidget } from "@/components/charts/CumulativePowerWidget";
import { SiteWisePowerConsumptionChart } from "@/components/charts/SiteWisePowerConsumptionChart";

// ── dnd-kit ────────────────────────────────────────────────────────────────────
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

type ChartKey =
  | "categoryPieChart"
  | "permitStatus"
  | "levelWiseChart"
  | "statusWiseChart"
  | "permitPerSiteChart"
  | "detailedLogsTable";

interface PieSource { name: string; value: number; color: string; }
interface BarDataItem {
  site: string; mains: number; dg: number;
  renewable: number; consumptionPerSqFt: number; costPerSqFt: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PIE_COLORS = ["#A89078", "#D8DCDD", "#6B4C3A", "#C4B8A8", "#9E9E9E"];

const CHART_LABELS: Record<ChartKey, string> = {
  categoryPieChart:   "Top 5 Category-wise Incidents",
  permitStatus:       "Permit Status",
  levelWiseChart:     "Level Wise Incidents",
  statusWiseChart:    "Incident Status Distribution",
  permitPerSiteChart: "Permit Per Site",
  detailedLogsTable:  "Detailed Incident Logs",
};

const ALL_CHART_KEYS: ChartKey[] = [
  "categoryPieChart",
  "permitStatus",
  "levelWiseChart",
  "statusWiseChart",
  "permitPerSiteChart",
  "detailedLogsTable",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ddmmyyyyToYYYYMMDD = (d: string) => {
  const [dd, mm, yyyy] = d.split("/");
  return `${yyyy}-${mm}-${dd}`;
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "High Risk": case "Extreme Risk": return "bg-red-100 text-red-800";
    case "Medium Risk": return "bg-yellow-100 text-yellow-800";
    case "Low Risk":    return "bg-green-100 text-green-800";
    default:            return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":              return "bg-blue-100 text-blue-800";
    case "Under Observation": return "bg-yellow-100 text-yellow-800";
    case "Closed":            return "bg-green-100 text-green-800";
    default:                  return "bg-gray-100 text-gray-800";
  }
};

const calculateStats = (incidents: any[]) => ({
  total:           incidents.length,
  open:            incidents.filter(i => i.current_status === "Open").length,
  underObservation:incidents.filter(i => i.current_status === "Under Observation").length,
  closed:          incidents.filter(i => i.current_status === "Closed").length,
});

// ─── Download helper ──────────────────────────────────────────────────────────

const downloadFile = async (url: string, filename: string) => {
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw new Error("Export failed");
  const disposition = res.headers.get("Content-Disposition");
  if (disposition?.includes("filename=")) {
    const match = disposition.match(/filename="?([^";]+)"?/);
    if (match?.[1]) filename = match[1];
  }
  const blob = await res.blob();
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};

// ─── SortableChartItem ────────────────────────────────────────────────────────

const SortableChartItem = ({
  id, children, className = "",
}: { id: string; children: React.ReactNode; className?: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const handlePointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") || target.closest("a") || target.closest("input") ||
      target.closest(".recharts-wrapper") || target.closest("th") || target.closest("td") ||
      target.closest("[data-no-drag]") || target.tagName === "BUTTON" ||
      target.tagName === "INPUT" || target.closest("svg")
    ) {
      e.stopPropagation();
      return;
    }
    listeners?.onPointerDown?.(e);
  };

  return (
    <div
      ref={setNodeRef} style={style} {...attributes}
      onPointerDown={handlePointerDown}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 h-full ${className}`}
    >
      {children}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const IncidentDashboard = () => {
  const navigate = useNavigate();

  // ── List tab state ────────────────────────────────────────────────────────
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [originalIncidents, setOriginalIncidents] = useState<Incident[]>([]);
  const [countStats, setCountStats] = useState<{
    total_incidents: number; open: number; under_investigation: number;
    closed: number; pending: number; support_required: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilterQuery, setActiveFilterQuery] = useState("");

  // ── Analytics tab state ───────────────────────────────────────────────────
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [isChartSelectorOpen, setIsChartSelectorOpen] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<Record<ChartKey, boolean>>({
    categoryPieChart:   true,
    permitStatus:       true,
    levelWiseChart:     true,
    statusWiseChart:    true,
    permitPerSiteChart: true,
    detailedLogsTable:  true,
  });
  const [chartOrder, setChartOrder] = useState<ChartKey[]>([...ALL_CHART_KEYS]);

  const getDefaultDateRange = () => {
    const today = new Date();
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    const fmt = (d: Date) =>
      `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    return { startDate: fmt(lastYear), endDate: fmt(today) };
  };
  const [analyticsDateRange, setAnalyticsDateRange] = useState(getDefaultDateRange);

  // ── Analytics API data states ─────────────────────────────────────────────
  const [analyticsStats, setAnalyticsStats] = useState({
    total: 0, open: 0, under_investigation: 0, closed: 0, other: 0,
  });
  const [statusSummaryData, setStatusSummaryData] = useState<PieSource[]>([]);
  const [levelData, setLevelData] = useState<BarDataItem[]>([]);
  const [categoryData, setCategoryData] = useState<PieSource[]>([]);
  const [permitStatusData, setPermitStatusData] = useState<PieSource[]>([]);
  const [permitSiteData, setPermitSiteData] = useState<any[]>([]);
  const [permitSiteBars, setPermitSiteBars] = useState<{ dataKey: string; name: string; fill: string; stackId: string }[]>([]);

  // ── dnd sensors ───────────────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setChartOrder(items => {
        const oldIndex = items.indexOf(active.id as ChartKey);
        const newIndex = items.indexOf(over?.id as ChartKey);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // ── Columns ───────────────────────────────────────────────────────────────
  const columns: ColumnConfig[] = [
    { key: "srNo",            label: "Sr. No.",       sortable: false, defaultVisible: true, draggable: false },
    { key: "id",              label: "ID",            sortable: true,  defaultVisible: true, draggable: true },
    { key: "description",     label: "Description",   sortable: true,  defaultVisible: true, draggable: true },
    { key: "site_name",       label: "Site",          sortable: true,  defaultVisible: true, draggable: false },
    { key: "inc_time",        label: "Incident Time", sortable: true,  defaultVisible: true, draggable: true },
    { key: "inc_level_name",  label: "Level",         sortable: true,  defaultVisible: true, draggable: true },
    { key: "category_name",   label: "Category",      sortable: true,  defaultVisible: true, draggable: true },
    { key: "current_status",  label: "Status",        sortable: true,  defaultVisible: true, draggable: true },
  ];

  const videoColumns: ColumnConfig[] = [
    { key: "srNo",              label: "Sr. No.",         sortable: false, defaultVisible: true, draggable: false },
    { key: "location",          label: "Location",        sortable: true,  defaultVisible: true, draggable: true },
    { key: "incident_date",     label: "Date",            sortable: true,  defaultVisible: true, draggable: true },
    { key: "incident_category", label: "Category",        sortable: true,  defaultVisible: true, draggable: true },
    { key: "level",             label: "Level",           sortable: true,  defaultVisible: true, draggable: true },
    { key: "incident_status",   label: "Status",          sortable: true,  defaultVisible: true, draggable: true },
    { key: "action_owner",      label: "Action Owner",    sortable: true,  defaultVisible: true, draggable: true },
  ];

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchIncidents(currentPage, activeFilterQuery);
    fetchCounts();
  }, [currentPage, activeFilterQuery]);

  useEffect(() => {
    const { startDate, endDate } = analyticsDateRange;
    fetchStatusSummary(startDate, endDate);
    fetchLevelWise(startDate, endDate);
    fetchTopCategories(startDate, endDate);
    fetchPermitStatus(startDate, endDate);
    fetchPermitSiteData(startDate, endDate);
  }, [analyticsDateRange]);

  // ── API helpers ───────────────────────────────────────────────────────────
  const getApiBase = () => {
    const baseUrl = localStorage.getItem("baseUrl") || "";
    const token   = localStorage.getItem("token")   || "";
    return { baseUrl, token, valid: !!(baseUrl && token) };
  };

  const buildParams = (fromDate: string, toDate: string, extra: Record<string, string> = {}) => {
    const { token } = getApiBase();
    return new URLSearchParams({
      from_date:    ddmmyyyyToYYYYMMDD(fromDate),
      to_date:      ddmmyyyyToYYYYMMDD(toDate),
      access_token: token,
      ...extra,
    });
  };

  // ── API calls (List) ──────────────────────────────────────────────────────
  const fetchIncidents = async (page: number = 1, filterQuery: string = "") => {
    try {
      setLoading(true);
      setError(null);
      let query = `page=${page}${filterQuery ? `&${filterQuery}` : ""}`;
      const response = await incidentService.getIncidents(query);
      const incidentsArr = response.data?.incidents || [];
      setIncidents(incidentsArr);
      setOriginalIncidents(incidentsArr);
      
      const pagination = response.pagination || {};
      setCurrentPage(pagination.current_page || 1);
      setTotalPages(pagination.total_pages || 1);
      setTotalCount(pagination.total_count || incidentsArr.length || 0);
    } catch (err) {
      setError("Failed to fetch incidents");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    try {
      const counts = await incidentService.getIncidentCounts();
      setCountStats(counts);
    } catch (err) { console.error(err); }
  };

  // ── API calls (Analytics) ─────────────────────────────────────────────────
  const fetchStatusSummary = async (fromDate: string, toDate: string) => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(fromDate, toDate);
      const res = await fetch(`https://${baseUrl}/incident_dashboard/status_summary.json?${params}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success === 1 && json.response) {
        const r = json.response;
        const open = r.open ?? 0, closed = r.closed ?? 0, other = r.other ?? 0, under = r.under_investigation ?? 0;
        setAnalyticsStats({ total: open + closed + other + under, open, under_investigation: under, closed, other });
        setStatusSummaryData([
          { name: "Open",                value: open,   color: "#A89078" },
          { name: "Closed",              value: closed, color: "#C4B8A8" },
          { name: "Other",               value: other,  color: "#D8DCDD" },
          { name: "Under Investigation", value: under,  color: "#6B4C3A" },
        ]);
      }
    } catch (err) { console.error(err); }
  };

  const fetchLevelWise = async (fromDate: string, toDate: string) => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(fromDate, toDate);
      const res = await fetch(`https://${baseUrl}/incident_dashboard/level_wise.json?${params}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success === 1 && json.response) {
        setLevelData(Object.entries(json.response).map(([site, value]) => ({
          site, mains: Number(value), dg: 0, renewable: 0, consumptionPerSqFt: 0, costPerSqFt: 0,
        })));
      }
    } catch (err) { console.error(err); }
  };

  const fetchTopCategories = async (fromDate: string, toDate: string) => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(fromDate, toDate);
      const res = await fetch(`https://${baseUrl}/incident_dashboard/top_categories.json?${params}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success === 1 && json.response) {
        setCategoryData(Object.entries(json.response).map(([name, value], i) => ({
          name, value: Number(value), color: PIE_COLORS[i % PIE_COLORS.length],
        })));
      }
    } catch (err) { console.error(err); }
  };

  const fetchPermitStatus = async (fromDate: string, toDate: string) => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(fromDate, toDate);
      const res = await fetch(`https://${baseUrl}/pms/permits/permits_status_data.json?${params}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success === 1 && json.response) {
        const r = json.response;
        setPermitStatusData([
          { name: 'Closed',   value: r.Closed   ?? 0, color: '#6B4C3A' },
          { name: 'Extended', value: r.Extended ?? 0, color: '#C4B8A8' },
          { name: 'Open',     value: r.Open     ?? 0, color: '#A89078' },
        ]);
      }
    } catch (err) { console.error(err); }
  };

  const fetchPermitSiteData = async (fromDate: string, toDate: string) => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(fromDate, toDate);
      const res = await fetch(`https://${baseUrl}/pms/permits/site_wise_permits_report.json?${params}`);
      if (!res.ok) return;
      const json = await res.json();
      if (json.success === 1 && json.response) {
        const r = json.response;
        const typeMap = new Map<string, string>(); 
        Object.values(r).forEach((permits: any) => {
          permits.forEach(([, name]: [number, string]) => {
            const key = name.trim().toLowerCase();
            if (!typeMap.has(key)) typeMap.set(key, name.trim());
          });
        });
        const typeList = Array.from(typeMap.values()); 

        const chartData = Object.entries(r).map(([site, permits]: [string, any]) => {
          const row: any = { site: site.trim() };
          typeList.forEach(t => { row[t] = 0; });
          permits.forEach(([count, name]: [number, string]) => {
            const normalized = typeMap.get(name.trim().toLowerCase());
            if (normalized) row[normalized] = (row[normalized] || 0) + count;
          });
          return row;
        });

        const bars = typeList.map((name, i) => ({
          dataKey: name,
          name,
          fill: PIE_COLORS[i % PIE_COLORS.length] || '#A89078',
          stackId: 'a',
        }));

        setPermitSiteData(chartData);
        setPermitSiteBars(bars);
      }
    } catch (err) { console.error(err); }
  };

  // ── Analytics Export Handlers (Cleaned Up) ────────────────────────────────
  const handleExportLevelWise = async () => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(analyticsDateRange.startDate, analyticsDateRange.endDate, { export: "true" });
      await downloadFile(`https://${baseUrl}/incident_dashboard/level_wise.json?${params}`, `level_wise_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (err) { toast.error("Failed to export level wise data"); }
  };

  const handleExportTopCategories = async () => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(analyticsDateRange.startDate, analyticsDateRange.endDate, { export: "true" });
      await downloadFile(`https://${baseUrl}/incident_dashboard/top_categories.json?${params}`, `top_categories_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (err) { toast.error("Failed to export top categories"); }
  };

  const handleExportPermitStatus = async () => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(analyticsDateRange.startDate, analyticsDateRange.endDate, { export: "true" });
      await downloadFile(`https://${baseUrl}/pms/permits/permits_status_data.json?${params}`, `permit_status_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (err) { toast.error("Failed to export permit status"); }
  };

  const handleExportPermitSite = async () => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(analyticsDateRange.startDate, analyticsDateRange.endDate, { export: "true" });
      await downloadFile(`https://${baseUrl}/pms/permits/site_wise_permits_download.json?${params}`, `permit_per_site_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (err) { toast.error("Failed to export permit per site data"); }
  };

  const handleExportIncidents = async () => {
    const { baseUrl, token, valid } = getApiBase();
    if (!valid) { toast.error("API details missing."); return; }
    try {
      const res = await fetch(`https://${baseUrl}/pms/incidents/export.xlsx`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" },
      });
      if (!res.ok) throw new Error("Export failed");
      await downloadFile(`https://${baseUrl}/pms/incidents/export.xlsx`, `incidents_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (err) { toast.error("Failed to export incidents"); }
  };

  // ── Render cells ──────────────────────────────────────────────────────────
  const renderCell = (item: Incident, columnKey: string) => {
    const index = incidents.findIndex(i => i.id === item.id);
    switch (columnKey) {
      case "srNo":           return <span className="font-medium">{(currentPage - 1) * 20 + index + 1}</span>;
      case "site_name":      return <span>{item.site_name || item.building_name || "-"}</span>;
      case "inc_time":       return <span>{item.inc_time ? new Date(item.inc_time).toLocaleString() : "-"}</span>;
      case "inc_level_name": return <Badge className={getLevelColor(item.inc_level_name)}>{item.inc_level_name}</Badge>;
      case "current_status": return <Badge className={getStatusColor(item.current_status)}>{item.current_status}</Badge>;
      default:               return <span>{String(item[columnKey as keyof Incident] ?? "-")}</span>;
    }
  };

  const renderVideoCell = (item: any, columnKey: string) => {
    const index = incidents.findIndex(i => i.id === item.id);
    switch (columnKey) {
      case "srNo":              return <span className="font-medium">{(currentPage - 1) * 20 + index + 1}</span>;
      case "location":          return <span>{item.site_name || item.building_name || "-"}</span>;
      case "incident_date":     return <span>{item.inc_time ? new Date(item.inc_time).toLocaleDateString("en-GB") : "-"}</span>;
      case "level":             return <span className={["High Risk", "Extreme Risk"].includes(item.inc_level_name) ? "text-[#EB4C5E] font-medium" : "text-gray-700"}>{item.inc_level_name || "-"}</span>;
      default:                  return <span>{item[columnKey] || "-"}</span>;
    }
  };

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleCardClick = (type: string) => {
    const map: Record<string, string> = {
      open: "q[current_status_eq]=Open", closed: "q[current_status_eq]=Closed",
      under_investigation: "q[current_status_eq]=Under%20Investigation",
    };
    setActiveFilterQuery(map[type] ?? "");
    setCurrentPage(1);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const stats = calculateStats(incidents);
  const orderedVisibleCharts = chartOrder.filter(k => selectedCharts[k]);
  const gridCharts           = orderedVisibleCharts.filter(k => k !== "detailedLogsTable");
  const tableVisible         = orderedVisibleCharts.includes("detailedLogsTable");

  const StatCard = ({ icon, label, value }: { icon: React.ReactElement; label: string; value: number }) => (
    <div className="bg-[#F6F4EE] p-6 rounded-lg shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
        {React.cloneElement(icon, { className: "w-6 h-6 text-[#C72030]" })}
      </div>
      <div>
        <div className="text-2xl font-semibold text-[#1A1A1A]">{value}</div>
        <div className="text-sm font-medium text-[#1A1A1A]">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] border-none font-semibold">
            <AlertTriangle className="w-4 h-4" /> List
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] border-none font-semibold">
            <BarChart3 className="w-4 h-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* ── List Tab ──────────────────────────────────────────────────── */}
        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div onClick={() => handleCardClick('total')} className="cursor-pointer"><StatCard icon={<AlertTriangle />} label="Total Incidents" value={countStats?.total_incidents ?? stats.total} /></div>
            <div onClick={() => handleCardClick('open')} className="cursor-pointer"><StatCard icon={<Clock />} label="Open" value={countStats?.open ?? stats.open} /></div>
            <div onClick={() => handleCardClick('under_investigation')} className="cursor-pointer"><StatCard icon={<Search />} label="Under Investigation" value={countStats?.under_investigation ?? stats.underObservation} /></div>
            <div onClick={() => handleCardClick('closed')} className="cursor-pointer"><StatCard icon={<CheckCircle />} label="Closed" value={countStats?.closed ?? stats.closed} /></div>
          </div>

          <EnhancedTable
            data={incidents} columns={columns} renderCell={renderCell}
            renderActions={item => <Button variant="ghost" size="sm" onClick={() => navigate(`/safety/incident/new-details/${item.id}`)}><Eye className="w-4 h-4" /></Button>}
            loading={loading} emptyMessage={error ?? "No incidents found"}
            enableSearch enableExport handleExport={handleExportIncidents}
            storageKey="incidents-dashboard" pagination={false}
            leftActions={<Button onClick={() => navigate("/safety/incident/add")} className="bg-[#C72030] text-white"><Plus className="w-4 h-4 mr-2" /> Add Incident</Button>}
            onFilterClick={() => setIsFilterModalOpen(true)}
          />

          {totalPages > 0 && (
             <div className="mt-6 flex justify-center items-center gap-4 text-sm text-gray-600">
                <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
             </div>
          )}
        </TabsContent>

        {/* ── Analytics Tab ─────────────────────────────────────────────── */}
        <TabsContent value="analytics" className="space-y-4 mt-6">
          
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
            <Button variant="outline" onClick={() => setIsAnalyticsFilterOpen(true)} className="w-full sm:w-[280px] justify-between">
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {analyticsDateRange.startDate} - {analyticsDateRange.endDate}</div>
              <Filter className="w-4 h-4" />
            </Button>
            
            <div className="relative">
              <Button variant="outline" onClick={() => setIsChartSelectorOpen(!isChartSelectorOpen)} className="w-full sm:w-[280px] justify-between">
                <div className="flex items-center gap-2"><Settings className="w-4 h-4" /> Display Charts</div>
              </Button>
              {isChartSelectorOpen && (
                <div className="absolute right-0 mt-2 w-full bg-white border rounded-md shadow-lg z-50 p-2">
                  {ALL_CHART_KEYS.map(key => (
                    <label key={key} className="flex items-center gap-3 p-2 hover:bg-gray-50 cursor-pointer">
                      <input type="checkbox" checked={selectedCharts[key]} onChange={() => setSelectedCharts(p => ({ ...p, [key]: !p[key] }))} className="rounded text-[#C72030]" />
                      <span className="text-sm">{CHART_LABELS[key]}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
             <StatCard icon={<AlertTriangle />} label="Total Incidents" value={analyticsStats.total} />
             <StatCard icon={<Clock />} label="Open" value={analyticsStats.open} />
             <StatCard icon={<Search />} label="Under Investigation" value={analyticsStats.under_investigation} />
             <StatCard icon={<CheckCircle />} label="Closed" value={analyticsStats.closed} />
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
              <div className="space-y-6 mt-6">
                
                {gridCharts.length > 0 && (
                  <div className={`grid grid-cols-1 gap-6 ${gridCharts.length > 1 ? "lg:grid-cols-2" : ""}`}>
                    {gridCharts.map(key => {
                      if (key === "categoryPieChart") return (
                        <SortableChartItem key={key} id={key}>
                          <CumulativePowerWidget title="Top 5 Category-wise Incidents" sources={categoryData} showPercentage={false} onDownload={handleExportTopCategories} className="h-full" />
                        </SortableChartItem>
                      );
                      if (key === "permitStatus") return (
                        <SortableChartItem key={key} id={key}>
                          <CumulativePowerWidget title="Permit Status" sources={permitStatusData} showPercentage={false} onDownload={handleExportPermitStatus} className="h-full" />
                        </SortableChartItem>
                      );
                      if (key === "levelWiseChart") return (
                        <SortableChartItem key={key} id={key}>
                          <SiteWisePowerConsumptionChart title="Level Wise Incidents" data={levelData} bars={[{ dataKey: 'mains', name: 'Count', fill: '#A89078' }]} lines={[]} leftYFormatter={v => String(v)} onDownload={handleExportLevelWise} className="h-full" />
                        </SortableChartItem>
                      );
                      if (key === "statusWiseChart") return (
                        <SortableChartItem key={key} id={key}>
                          <CumulativePowerWidget title="Incident Status Distribution" sources={statusSummaryData} showPercentage={false} className="h-full" />
                        </SortableChartItem>
                      );
                      if (key === "permitPerSiteChart") return (
                        <SortableChartItem key={key} id={key} className="lg:col-span-2">
                          <SiteWisePowerConsumptionChart title="Permit Per Site" data={permitSiteData} bars={permitSiteBars} lines={[]} leftYFormatter={v => String(v)} onDownload={handleExportPermitSite} className="h-full" />
                        </SortableChartItem>
                      );
                      return null;
                    })}
                  </div>
                )}

                {tableVisible && (
                  <SortableChartItem key="detailedLogsTable" id="detailedLogsTable">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-[#4A154B]">Detailed Incident Logs</h3>
                        <p className="text-sm text-gray-500 mt-1">View, search, and organize all incident data.</p>
                      </div>
                      <div data-no-drag>
                        <EnhancedTable data={incidents} columns={videoColumns} renderCell={renderVideoCell} loading={loading} emptyMessage={error ?? "No incident logs available."} storageKey="video-style" pagination={false} enableSearch searchPlaceholder="Search detailed logs..." />
                      </div>
                    </div>
                  </SortableChartItem>
                )}

                {orderedVisibleCharts.length === 0 && (
                  <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p>No charts selected. Use "Display Charts" to show charts.</p>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </TabsContent>
      </Tabs>

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      <IncidentFilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} incidents={originalIncidents} onApply={(f, q) => { setIncidents(f); setActiveFilterQuery(q || ""); setCurrentPage(1); }} onReset={() => { setIncidents(originalIncidents); setActiveFilterQuery(""); setCurrentPage(1); fetchIncidents(1, ""); }} setCurrentPage={setCurrentPage} setTotalPages={setTotalPages} setTotalCount={setTotalCount} />
      <TicketAnalyticsFilterDialog isOpen={isAnalyticsFilterOpen} title="Incident" onClose={() => setIsAnalyticsFilterOpen(false)} onApplyFilters={setAnalyticsDateRange} currentStartDate={analyticsDateRange.startDate} currentEndDate={analyticsDateRange.endDate} />
    </div>
  );
};