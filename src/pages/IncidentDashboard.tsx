import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Eye,
  AlertTriangle,
  Clock,
  CheckCircle,
  Search,
  Calendar,
  Filter,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  Activity,
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import IncidentFilterModal from "@/components/IncidentFilterModal";
import { incidentService, type Incident } from "@/services/incidentService";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { ColumnConfig } from "@/hooks/useEnhancedTable";
import { toast } from "sonner";
import { AssetAnalyticsSelector } from "@/components/AssetAnalyticsSelector";
import { AssetAnalyticsFilterDialog } from "@/components/AssetAnalyticsFilterDialog";
import { CumulativePowerWidget } from "@/components/charts/CumulativePowerWidget";
import { SiteWisePowerConsumptionChart } from "@/components/charts/SiteWisePowerConsumptionChart";

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
interface PieSource {
  name: string;
  value: number;
  color: string;
}
interface BarDataItem {
  site: string;
  mains: number;
  dg: number;
  renewable: number;
  consumptionPerSqFt: number;
  costPerSqFt: number;
}
interface KpiData {
  zero_incident_days: number;
  incident_rate: { incidents: number; area: number; rate: number };
  ltir: { injuries: number; work_hours: number; value: number };
}
interface RcaRow {
  site_name: string | null;
  society_building_name: string | null;
  incident_occurrence_date: string | null;
  incident_occurrence_time: string | null;
  incident_category_name: string | null;
  incident_description: string | null;
  incident_rca_text: string | null;
  incident_corrective_action: string | null;
  incident_preventive_action: string | null;
  incident_status_raw: string | null;
  assigned_to_user_name: string | null;
  incident_level_name: string | null;
}
interface RcaPagination {
  current_page: number;
  per_page: number;
  total_records: number;
  total_pages: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PIE_COLORS = ["#A89078", "#D8DCDD", "#6B4C3A", "#C4B8A8", "#9E9E9E"];

const INCIDENT_CHART_OPTIONS = [
  {
    id: "categoryPieChart",
    label: "Top 5 Category-wise Incidents",
    description: "Incidents divided by main categories",
  },
  {
    id: "statusWiseChart",
    label: "Incident Status Distribution",
    description: "Open vs Closed vs Under Investigation",
  },
  {
    id: "levelWiseChart",
    label: "Level Wise Incidents",
    description: "Incidents grouped by risk levels",
  },
  {
    id: "rcaTable",
    label: "RCA Data Table",
    description: "Root cause analysis detailed logs",
  },
];

const INCIDENT_CHART_KEYS = INCIDENT_CHART_OPTIONS.map((opt) => opt.id);

// ─── RCA column config ────────────────────────────────────────────────────────
const RCA_COLUMNS: { key: keyof RcaRow; label: string }[] = [
  { key: "site_name", label: "Site" },
  { key: "incident_occurrence_date", label: "Date" },
  { key: "incident_occurrence_time", label: "Time" },
  { key: "incident_category_name", label: "Category" },
  { key: "incident_level_name", label: "Level" },
  { key: "incident_status_raw", label: "Status" },
  { key: "incident_description", label: "Description" },
  { key: "incident_rca_text", label: "RCA" },
  { key: "incident_corrective_action", label: "Corrective Action" },
  { key: "incident_preventive_action", label: "Preventive Action" },
  { key: "assigned_to_user_name", label: "Assigned To" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ddmmyyyyToYYYYMMDD = (d: string) => {
  const [dd, mm, yyyy] = d.split("/");
  return `${yyyy}-${mm}-${dd}`;
};

const formatTime = (iso: string | null) => {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "-";
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "High Risk":
    case "Extreme Risk":
      return "bg-red-100 text-red-800";
    case "Medium Risk":
    case "Moderate Risk":
      return "bg-yellow-100 text-yellow-800";
    case "Low Risk":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-800";
    case "Closed":
      return "bg-green-100 text-green-800";
    case "Under Observation":
      return "bg-yellow-100 text-yellow-800";
    case "final_closure":
      return "bg-purple-100 text-purple-800";
    case "provisional_closure":
      return "bg-orange-100 text-orange-800";
    case "Draft":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getIncidentStatusColor = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-blue-100 text-blue-800";
    case "Under Observation":
      return "bg-yellow-100 text-yellow-800";
    case "Closed":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const calculateStats = (incidents: any[]) => ({
  total: incidents.length,
  open: incidents.filter((i) => i.current_status === "Open").length,
  underObservation: incidents.filter(
    (i) => i.current_status === "Under Observation"
  ).length,
  closed: incidents.filter((i) => i.current_status === "Closed").length,
});

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
  id,
  children,
  className = "",
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
      target.closest("a") ||
      target.closest("input") ||
      target.closest("textarea") ||
      target.closest(".recharts-wrapper") ||
      target.closest("[data-no-drag]") ||
      target.tagName === "BUTTON" ||
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA"
    ) {
      e.stopPropagation();
      return;
    }
    listeners?.onPointerDown?.(e);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      onPointerDown={handlePointerDown}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 h-full ${className}`}
    >
      {children}
    </div>
  );
};

// ─── StatCard ─────────────────────────────────────────────────────────────────
const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactElement;
  label: string;
  value: number | string;
}) => (
  <div className="bg-[#F6F4EE] rounded-lg shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow px-5 py-4 min-h-[96px] h-full">
    <div className="w-14 h-14 min-w-[56px] bg-[#C4B89D54] flex items-center justify-center rounded flex-shrink-0">
      {React.cloneElement(icon, { className: "w-6 h-6 text-[#C72030]" })}
    </div>
    <div className="flex flex-col justify-center min-w-0">
      <div className="text-2xl font-semibold text-[#1A1A1A] leading-tight">
        {value}
      </div>
      <div className="text-sm font-medium text-[#1A1A1A] whitespace-nowrap">
        {label}
      </div>
    </div>
  </div>
);

const StatCardGrid = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 items-stretch">
    {children}
  </div>
);

// ─── RCA Table ────────────────────────────────────────────────────────────────
const RcaTable = ({
  data,
  pagination,
  loading,
  onPageChange,
  onDownload,
  onSearch,
  searchValue,
}: {
  data: RcaRow[];
  pagination: RcaPagination | null;
  loading: boolean;
  onPageChange: (page: number) => void;
  onDownload: () => void;
  onSearch: (val: string) => void;
  searchValue: string;
}) => {
  const totalPages = pagination?.total_pages ?? 1;
  const currentPage = pagination?.current_page ?? 1;
  const totalRecords = pagination?.total_records ?? 0;
  const perPage = pagination?.per_page ?? 20;

  // 🌟 FIX: Local Filtering for Sr. No.
  // Hum pehle data ko original index ke sath map karte hain,
  // phir target Sr. No. se filter karte hain taaki row number kharab na ho.
  const displayData = searchValue.trim()
    ? data
      .map((row, index) => ({ row, originalIndex: index }))
      .filter(({ originalIndex }) => {
        const currentSrNo = (currentPage - 1) * perPage + originalIndex + 1;
        return currentSrNo.toString().includes(searchValue.trim());
      })
    : data.map((row, index) => ({ row, originalIndex: index }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-[#1A1A1A]">RCA Data</h3>
        <div className="flex items-center gap-2" data-no-drag>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search by Sr. No..."
              type="number"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="pl-9 h-9 w-full sm:w-[220px] text-sm"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="h-9 gap-1.5 whitespace-nowrap"
          >
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            Loading...
          </div>
        ) : displayData.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No RCA data found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Sr. No.
                </th>
                {RCA_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayData.map(({ row, originalIndex }) => (
                <tr
                  key={originalIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-500 font-medium text-sm">
                    {(currentPage - 1) * perPage + originalIndex + 1}
                  </td>
                  {RCA_COLUMNS.map((col) => {
                    const val = row[col.key];
                    if (col.key === "incident_occurrence_time") {
                      return (
                        <td
                          key={col.key}
                          className="px-4 py-3 text-gray-700 whitespace-nowrap text-sm"
                        >
                          {formatTime(val)}
                        </td>
                      );
                    }
                    if (col.key === "incident_level_name") {
                      return (
                        <td
                          key={col.key}
                          className="px-4 py-3 whitespace-nowrap"
                        >
                          {val ? (
                            <Badge className={`text-xs ${getLevelColor(val)}`}>
                              {val}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    }
                    if (col.key === "incident_status_raw") {
                      return (
                        <td
                          key={col.key}
                          className="px-4 py-3 whitespace-nowrap"
                        >
                          {val ? (
                            <Badge className={`text-xs ${getStatusColor(val)}`}>
                              {val
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    }
                    const isLong = [
                      "incident_description",
                      "incident_rca_text",
                      "incident_corrective_action",
                      "incident_preventive_action",
                    ].includes(col.key);
                    if (isLong) {
                      return (
                        <td
                          key={col.key}
                          className="px-4 py-3 text-sm text-gray-700 max-w-[200px]"
                        >
                          {val ? (
                            <span title={val} className="block truncate">
                              {val}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={col.key}
                        className="px-4 py-3 text-gray-700 whitespace-nowrap text-sm"
                      >
                        {val ?? <span className="text-gray-400">-</span>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!loading && totalRecords > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs text-gray-500">
            Showing {Math.min((currentPage - 1) * perPage + 1, totalRecords)}–
            {Math.min(currentPage * perPage, totalRecords)} of {totalRecords}{" "}
            records
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-8"
            >
              Previous
            </Button>
            <span className="text-xs text-gray-600 px-1">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-8"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const IncidentDashboard = () => {
  const navigate = useNavigate();

  // ── List tab state
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [originalIncidents, setOriginalIncidents] = useState<Incident[]>([]);
  const [countStats, setCountStats] = useState<{
    total_incidents: number;
    open: number;
    under_investigation: number;
    closed: number;
    pending: number;
    support_required: number;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilterQuery, setActiveFilterQuery] = useState("");

  // ── KPI state
  const [kpiData, setKpiData] = useState<KpiData | null>(null);

  // ── RCA state
  const [rcaData, setRcaData] = useState<RcaRow[]>([]);
  const [rcaPagination, setRcaPagination] = useState<RcaPagination | null>(
    null
  );
  const [rcaLoading, setRcaLoading] = useState(false);
  const [rcaPage, setRcaPage] = useState(1);
  const [rcaSearch, setRcaSearch] = useState("");

  // ── Analytics tab state
  const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
  const [selectedCharts, setSelectedCharts] =
    useState<string[]>(INCIDENT_CHART_KEYS);
  const [chartOrder, setChartOrder] = useState<string[]>(INCIDENT_CHART_KEYS);

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

  // ── Analytics API data states
  const [analyticsStats, setAnalyticsStats] = useState({
    total: 0,
    open: 0,
    under_investigation: 0,
    closed: 0,
    other: 0,
  });
  const [statusSummaryData, setStatusSummaryData] = useState<PieSource[]>([]);
  const [levelData, setLevelData] = useState<BarDataItem[]>([]);
  const [categoryData, setCategoryData] = useState<PieSource[]>([]);

  // ── dnd sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
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

  const columns: ColumnConfig[] = [
    {
      key: "srNo",
      label: "Sr. No.",
      sortable: false,
      defaultVisible: true,
      draggable: false,
    },
    {
      key: "id",
      label: "ID",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "site_name",
      label: "Site",
      sortable: true,
      defaultVisible: true,
      draggable: false,
    },
    {
      key: "inc_time",
      label: "Incident Time",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "inc_level_name",
      label: "Level",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "category_name",
      label: "Category",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
    {
      key: "current_status",
      label: "Status",
      sortable: true,
      defaultVisible: true,
      draggable: true,
    },
  ];

  // ── Effects
  useEffect(() => {
    fetchIncidents(currentPage, activeFilterQuery);
    fetchCounts();
  }, [currentPage, activeFilterQuery]);

  useEffect(() => {
    const { startDate, endDate } = analyticsDateRange;
    fetchStatusSummary(startDate, endDate);
    fetchLevelWise(startDate, endDate);
    fetchTopCategories(startDate, endDate);
    fetchKpis(startDate, endDate);
    setRcaPage(1);
  }, [analyticsDateRange]);

  // 🌟 FIX: API sirf tabhi call hoga jab page badlega. Typing par nahi.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRcaData(
        analyticsDateRange.startDate,
        analyticsDateRange.endDate,
        rcaPage
      );
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [rcaPage, analyticsDateRange]);

  const getApiBase = () => {
    const baseUrl = localStorage.getItem("baseUrl") || "";
    const token = localStorage.getItem("token") || "";
    return { baseUrl, token, valid: !!(baseUrl && token) };
  };

  const getSelectedSiteId = () =>
    localStorage.getItem("selectedSiteId") ||
    localStorage.getItem("site_id") ||
    localStorage.getItem("siteId") ||
    "";

  const buildParams = (
    fromDate: string,
    toDate: string,
    extra: Record<string, string> = {}
  ) => {
    const { token } = getApiBase();
    return new URLSearchParams({
      from_date: ddmmyyyyToYYYYMMDD(fromDate),
      to_date: ddmmyyyyToYYYYMMDD(toDate),
      access_token: token,
      ...extra,
    });
  };

  const fetchIncidents = async (page: number = 1, filterQuery: string = "") => {
    try {
      setLoading(true);
      setError(null);
      const query = `page=${page}${filterQuery ? `&${filterQuery}` : ""}`;
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
    } catch (err) {
      console.error(err);
    }
  };

  const fetchKpis = async (fromDate: string, toDate: string) => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(fromDate, toDate);
      const res = await fetch(
        `https://${baseUrl}/incident_dashboard/incident_kpis.json?${params}`
      );
      if (!res.ok) return;
      const json = await res.json();
      if (json.success === 1 && json.data) setKpiData(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🌟 FIX: Removed search text from Backend API call
  const fetchRcaData = async (
    fromDate: string,
    toDate: string,
    page: number
  ) => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    setRcaLoading(true);
    try {
      const extra: Record<string, string> = { page: String(page) };
      const params = buildParams(fromDate, toDate, extra);
      const res = await fetch(
        `https://${baseUrl}/incident_dashboard/rca_data.json?${params}`
      );
      if (!res.ok) return;
      const json = await res.json();
      if (json.success === 1) {
        setRcaData(json.response || []);
        setRcaPagination(json.pagination || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRcaLoading(false);
    }
  };

  // 🌟 FIX: Search krne par auto-calculate target page
  const handleRcaSearch = (val: string) => {
    setRcaSearch(val);
    const srNo = parseInt(val.trim(), 10);
    const perPage = rcaPagination?.per_page ?? 20;

    if (!isNaN(srNo) && srNo > 0) {
      const targetPage = Math.ceil(srNo / perPage);
      const maxPage = rcaPagination?.total_pages ?? 1;
      const validPage = Math.min(targetPage, maxPage);

      if (validPage !== rcaPage) {
        setRcaPage(validPage);
      }
    } else if (!val.trim()) {
      setRcaPage(1); // clear krne par wapas page 1 pe
    }
  };

  const handleRcaPageChange = (page: number) => setRcaPage(page);

  const handleExportRca = async () => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) {
      toast.error("API details missing.");
      return;
    }
    try {
      const params = buildParams(
        analyticsDateRange.startDate,
        analyticsDateRange.endDate,
        { export: "true" }
      );
      await downloadFile(
        `https://${baseUrl}/incident_dashboard/rca_data.json?${params}`,
        `rca_data_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch {
      toast.error("Failed to export RCA data");
    }
  };

  const fetchStatusSummary = async (fromDate: string, toDate: string) => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(fromDate, toDate);
      const res = await fetch(
        `https://${baseUrl}/incident_dashboard/status_summary.json?${params}`
      );
      if (!res.ok) return;
      const json = await res.json();
      if (json.success === 1 && json.response) {
        const r = json.response;
        const open = r.open ?? 0,
          closed = r.closed ?? 0,
          other = r.other ?? 0,
          under = r.under_investigation ?? 0;
        setAnalyticsStats({
          total: open + closed + other + under,
          open,
          under_investigation: under,
          closed,
          other,
        });
        setStatusSummaryData([
          { name: "Open", value: open, color: "#A89078" },
          { name: "Closed", value: closed, color: "#C4B8A8" },
          { name: "Other", value: other, color: "#D8DCDD" },
          { name: "Under Investigation", value: under, color: "#6B4C3A" },
        ]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportStatusSummary = async () => {
    const { baseUrl, valid } = getApiBase();
    const siteId = getSelectedSiteId();
    if (!valid || !siteId) {
      toast.error("API details missing.");
      return;
    }
    try {
      const params = buildParams(
        analyticsDateRange.startDate,
        analyticsDateRange.endDate,
        {
          site_id: siteId,
          export: "true",
        }
      );
      await downloadFile(
        `https://${baseUrl}/incident_dashboard/status_summary.json?${params}`,
        `incident_status_distribution_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch {
      toast.error("Failed to export incident status distribution");
    }
  };

  const fetchLevelWise = async (fromDate: string, toDate: string) => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(fromDate, toDate);
      const res = await fetch(
        `https://${baseUrl}/incident_dashboard/level_wise.json?${params}`
      );
      if (!res.ok) return;
      const json = await res.json();
      if (json.success === 1 && json.response) {
        setLevelData(
          Object.entries(json.response).map(([site, value]) => ({
            site,
            mains: Number(value),
            dg: 0,
            renewable: 0,
            consumptionPerSqFt: 0,
            costPerSqFt: 0,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTopCategories = async (fromDate: string, toDate: string) => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(fromDate, toDate);
      const res = await fetch(
        `https://${baseUrl}/incident_dashboard/top_categories.json?${params}`
      );
      if (!res.ok) return;
      const json = await res.json();
      if (json.success === 1 && json.response) {
        setCategoryData(
          Object.entries(json.response).map(([name, value], i) => ({
            name,
            value: Number(value),
            color: PIE_COLORS[i % PIE_COLORS.length],
          }))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportLevelWise = async () => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(
        analyticsDateRange.startDate,
        analyticsDateRange.endDate,
        { export: "true" }
      );
      await downloadFile(
        `https://${baseUrl}/incident_dashboard/level_wise.json?${params}`,
        `level_wise_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch {
      toast.error("Failed to export level wise data");
    }
  };

  const handleExportTopCategories = async () => {
    const { baseUrl, valid } = getApiBase();
    if (!valid) return;
    try {
      const params = buildParams(
        analyticsDateRange.startDate,
        analyticsDateRange.endDate,
        { export: "true" }
      );
      await downloadFile(
        `https://${baseUrl}/incident_dashboard/top_categories.json?${params}`,
        `top_categories_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch {
      toast.error("Failed to export top categories");
    }
  };

  const handleExportIncidents = async () => {
    const { baseUrl, token, valid } = getApiBase();
    if (!valid) {
      toast.error("API details missing.");
      return;
    }
    try {
      await downloadFile(
        `https://${baseUrl}/pms/incidents/export.xlsx?access_token=${token}`,
        `incidents_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch {
      toast.error("Failed to export incidents");
    }
  };

  const renderCell = (item: Incident, columnKey: string) => {
    const index = incidents.findIndex((i) => i.id === item.id);
    switch (columnKey) {
      case "srNo":
        return (
          <span className="font-medium">
            {(currentPage - 1) * 20 + index + 1}
          </span>
        );
      case "site_name":
        return <span>{item.site_name || item.building_name || "-"}</span>;
      case "inc_time":
        return (
          <span>
            {item.inc_time ? new Date(item.inc_time).toLocaleString() : "-"}
          </span>
        );
      case "inc_level_name":
        return (
          <Badge className={getLevelColor(item.inc_level_name)}>
            {item.inc_level_name}
          </Badge>
        );
      case "current_status":
        return (
          <Badge className={getIncidentStatusColor(item.current_status)}>
            {item.current_status}
          </Badge>
        );
      default:
        return <span>{String(item[columnKey as keyof Incident] ?? "-")}</span>;
    }
  };

  const handleCardClick = (type: string) => {
    const map: Record<string, string> = {
      open: "q[current_status_eq]=Open",
      closed: "q[current_status_eq]=Closed",
      under_investigation: "q[current_status_eq]=Under%20Investigation",

    };
    setActiveFilterQuery(map[type] ?? "");
    setCurrentPage(1);
  };

  const stats = calculateStats(incidents);
  const orderedVisibleCharts = chartOrder.filter((k) =>
    selectedCharts.includes(k)
  );

  return (
    <div className="p-4 sm:p-6">
      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200">
          <TabsTrigger
            value="list"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] border-none font-semibold"
          >
            <AlertTriangle className="w-4 h-4" /> List
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center gap-2 data-[state=active]:bg-[#EDEAE3] data-[state=active]:text-[#C72030] border-none font-semibold"
          >
            <BarChart3 className="w-4 h-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        {/* ── LIST TAB ─────────────────────────────────────────────────────── */}
        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 items-stretch">
            <div
              onClick={() => handleCardClick("total")}
              className="cursor-pointer"
            >
              <StatCard
                icon={<AlertTriangle />}
                label="Total Incidents"
                value={countStats?.total_incidents ?? stats.total}
              />
            </div>
            <div
              onClick={() => handleCardClick("open")}
              className="cursor-pointer"
            >
              <StatCard
                icon={<Clock />}
                label="Open"
                value={countStats?.open ?? stats.open}
              />
            </div>
            <div
              onClick={() => handleCardClick("under_investigation")}
              className="cursor-pointer"
            >
              <StatCard
                icon={<Search />}
                label="Under Investigation"
                value={
                  countStats?.under_investigation ?? stats.underObservation
                }
              />
            </div>
            <div
              onClick={() => handleCardClick("closed")}
              className="cursor-pointer"
            >
              <StatCard
                icon={<CheckCircle />}
                label="Closed"
                value={countStats?.closed ?? stats.closed}
              />
            </div>
            <div
              onClick={() => handleCardClick("pending")}
              className="cursor-pointer"
            >
              <StatCard
                icon={<AlertTriangle />}
                label="Pending"
                value={countStats?.pending ?? 0}
              />
            </div>
            <div
              onClick={() => handleCardClick("support_required")}
              className="cursor-pointer"
            >
              <StatCard
                icon={<ShieldCheck />}
                label="Support Required"
                value={countStats?.support_required ?? 0}
              />
            </div>
          </div>

          <EnhancedTable
            data={incidents}
            columns={columns}
            renderCell={renderCell}
            renderActions={(item) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  navigate(`/safety/incident/new-details/${item.id}`)
                }
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            loading={loading}
            emptyMessage={error ?? "No incidents found"}
            enableSearch
            enableExport
            handleExport={handleExportIncidents}
            storageKey="incidents-dashboard"
            pagination={false}
            leftActions={
              <Button
                onClick={() => navigate("/safety/incident/add")}
                className="bg-[#C72030] text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Incident
              </Button>
            }
            onFilterClick={() => setIsFilterModalOpen(true)}
          />

          {totalPages > 0 && (
            <div className="mt-6 flex justify-center items-center gap-4 text-sm text-gray-600">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ── ANALYTICS TAB ────────────────────────────────────────────────── */}
        <TabsContent value="analytics" className="space-y-4 mt-6">
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
            <Button
              variant="outline"
              onClick={() => setIsAnalyticsFilterOpen(true)}
              className="w-full sm:w-[280px] justify-between"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {analyticsDateRange.startDate}{" "}
                - {analyticsDateRange.endDate}
              </div>
              <Filter className="w-4 h-4" />
            </Button>
            <div className="w-full sm:w-auto">
              <AssetAnalyticsSelector
                // @ts-expect-error Asset selector accepts this chart option shape at runtime.
                options={INCIDENT_CHART_OPTIONS}
                selectedOptions={selectedCharts}
                onSelectionChange={setSelectedCharts}
                title="Select Incident Charts"
                buttonLabel="Charts"
                dateRange={{
                  startDate: getDialogDate(analyticsDateRange.startDate),
                  endDate: getDialogDate(analyticsDateRange.endDate),
                }}
              />
            </div>
          </div>

          <StatCardGrid>
            <StatCard
              icon={<AlertTriangle />}
              label="Total Incidents"
              value={kpiData?.incident_rate.incidents ?? analyticsStats.total}
            />
            <StatCard
              icon={<Clock />}
              label="Open"
              value={analyticsStats.open}
            />
            <StatCard
              icon={<Search />}
              label="Under Investigation"
              value={analyticsStats.under_investigation}
            />
            <StatCard
              icon={<CheckCircle />}
              label="Closed"
              value={analyticsStats.closed}
            />
            <StatCard
              icon={<ShieldCheck />}
              label="Zero Incident Days"
              value={kpiData?.zero_incident_days ?? "-"}
            />
            <StatCard
              icon={<TrendingUp />}
              label="Incident Rate"
              value={kpiData ? kpiData.incident_rate.rate.toFixed(2) : "-"}
            />
            <StatCard
              icon={<Activity />}
              label="LTIR"
              value={kpiData ? kpiData.ltir.value.toFixed(2) : "-"}
            />
          </StatCardGrid>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                {orderedVisibleCharts.map((key) => {
                  const isFullWidth =
                    key === "levelWiseChart" || key === "rcaTable";
                  return (
                    <div
                      key={key}
                      className={
                        isFullWidth ? "lg:col-span-2 col-span-1" : "col-span-1"
                      }
                    >
                      <SortableChartItem id={key} className="h-full">
                        {key === "categoryPieChart" && (
                          <CumulativePowerWidget
                            title="Top 5 Category-wise Incidents"
                            sources={categoryData}
                            showPercentage={false}
                            onDownload={handleExportTopCategories}
                            className="h-full"
                          />
                        )}
                        {key === "statusWiseChart" && (
                          <CumulativePowerWidget
                            title="Incident Status Distribution"
                            sources={statusSummaryData}
                            showPercentage={false}
                            onDownload={handleExportStatusSummary}
                            className="h-full"
                          />
                        )}
                        {key === "levelWiseChart" && (
                          <SiteWisePowerConsumptionChart
                            title="Level Wise Incidents"
                            data={levelData}
                            bars={[
                              {
                                dataKey: "mains",
                                name: "Count",
                                fill: "#A89078",
                              },
                            ]}
                            lines={[]}
                            leftYFormatter={(v) => String(v)}
                            onDownload={handleExportLevelWise}
                            className="w-full"
                          />
                        )}
                        {key === "rcaTable" && (
                          <RcaTable
                            data={rcaData}
                            pagination={rcaPagination}
                            loading={rcaLoading}
                            onPageChange={handleRcaPageChange}
                            onDownload={handleExportRca}
                            onSearch={handleRcaSearch}
                            searchValue={rcaSearch}
                          />
                        )}
                      </SortableChartItem>
                    </div>
                  );
                })}

                {orderedVisibleCharts.length === 0 && (
                  <div className="lg:col-span-2 py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                    <p>
                      No charts selected. Use "Display Charts" to show charts.
                    </p>
                  </div>
                )}
              </div>
            </SortableContext>
          </DndContext>
        </TabsContent>
      </Tabs>

      <IncidentFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        incidents={originalIncidents}
        onApply={(f, q) => {
          setIncidents(f);
          setActiveFilterQuery(q || "");
          setCurrentPage(1);
        }}
        onReset={() => {
          setIncidents(originalIncidents);
          setActiveFilterQuery("");
          setCurrentPage(1);
          fetchIncidents(1, "");
        }}
        setCurrentPage={setCurrentPage}
        setTotalPages={setTotalPages}
        setTotalCount={setTotalCount}
      />
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
