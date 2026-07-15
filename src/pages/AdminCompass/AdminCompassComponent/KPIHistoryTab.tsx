// ─────────────────────────────────────────────
// KPIHistoryTab.tsx  —  KPI History Log
// ─────────────────────────────────────────────
import React, { useEffect, useMemo, useState, useRef } from "react";
import { format } from "date-fns";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Loader2,
  Search,
  Trash2,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { kpiClass } from "./Shared";

// Helpers for dynamic Base URL and Auth Token
const getDynamicBaseUrl = (): string => {
  let url =
    localStorage.getItem("baseUrl") || localStorage.getItem("base_url") || "";
  url = url.trim().replace(/\/+$/, "");
  if (url && !url.startsWith("http")) {
    url = `https://${url}`;
  }
  return url;
};

const getDynamicToken = (): string => {
  return localStorage.getItem("auth_token") || "";
};

export interface KPIHistoryRow {
  id: string;
  kpiId?: string;
  date: string;
  type: string;
  kpiName: string;
  department: string;
  user: string;
  planned: string;
  actual: string;
  achievement: string;
  status: string;
  notes: string;
  frequency: string;
}

interface CompanyUserOption {
  id: number;
  name: string;
}

interface CompanyDepartmentOption {
  id: number;
  name: string;
}

interface KPIOption {
  id: string | number;
  name: string;
}

type KPIHistoryTabProps = {
  users?: CompanyUserOption[];
  departments?: CompanyDepartmentOption[];
  kpis?: KPIOption[];
  onDeleteSelected?: (ids: string[]) => Promise<void>;
};

const selectClass = cn(
  "w-full rounded-lg px-3 py-2 text-sm text-[#1a1a1a] shadow-sm bg-white text-left",
  kpiClass.border,
  kpiClass.surfaceInput,
  kpiClass.focusRing
);

const inputClass = cn(
  "w-full rounded-lg px-3 py-2 text-sm text-[#1a1a1a] shadow-sm bg-white placeholder:text-neutral-400",
  kpiClass.border,
  kpiClass.surfaceInput,
  kpiClass.focusRing
);

const formatDateForApi = (dateStr: string): string => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const formatLabel = (str: string) => {
  if (!str || str === "-") return "-";
  return str.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

const normalizeHistoryRow = (raw: any): KPIHistoryRow => {
  const dateRaw = raw.date ?? raw.entry_date ?? raw.created_at ?? "";
  const date = dateRaw
    ? (() => {
      const d = new Date(dateRaw);
      return Number.isNaN(d.getTime()) ? dateRaw : format(d, "dd-MM");
    })()
    : "-";

  return {
    id: String(raw.id ?? Math.random()),
    kpiId: raw.kpi_id != null ? String(raw.kpi_id) : raw.kpi?.id != null ? String(raw.kpi.id) : undefined,
    date,
    type: formatLabel(raw.log_type ?? raw.entry_type ?? raw.type ?? raw.action ?? "-"),
    kpiName: raw.kpi_name ?? raw.kpi?.name ?? raw.kpi?.kpi_name ?? "-",
    department: raw.department_name ?? raw.department ?? "-",
    user: raw.performed_by_name ?? raw.user_name ?? raw.assignee_name ?? raw.user ?? "-",
    planned: raw.planned !== null ? String(raw.planned ?? raw.planned_value ?? raw.target_value ?? "-") : "-",
    actual: raw.actual !== null ? String(raw.actual ?? raw.actual_value ?? raw.current_value ?? "-") : "-",
    achievement: raw.achievement !== null ? String(raw.achievement ?? raw.achievement_percentage ?? "-") : "-",
    status: String(raw.status ?? "-").toLowerCase(),
    notes: raw.notes ?? raw.remarks ?? raw.comment ?? "-",
    frequency: raw.frequency ?? raw.kpi_frequency ?? "-",
  };
};

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// --- CUSTOM SEARCHABLE DROPDOWN COMPONENT ---
interface SearchableSelectProps {
  options: { id: string | number; name: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  className?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options = [], value, onChange, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    (opt?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((opt) => String(opt.id) === value);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("flex w-full items-center justify-between", className)}
      >
        <span className="truncate text-[#1a1a1a]">
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0 ml-2" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg">
          <div className="flex items-center border-b border-neutral-100 px-3 py-2 bg-neutral-50/50 rounded-t-md">
            <Search className="h-4 w-4 text-neutral-400 mr-2 shrink-0" />
            <input
              type="text"
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400 text-[#1a1a1a]"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>
          <ul className="max-h-60 overflow-auto py-1 text-sm custom-scrollbar">
            <li
              className={cn(
                "cursor-pointer px-3 py-2 hover:bg-neutral-100 text-neutral-600 transition-colors",
                !value && "bg-neutral-50 font-medium text-[#1a1a1a]"
              )}
              onClick={() => {
                onChange("");
                setIsOpen(false);
                setSearchTerm("");
              }}
            >
              {placeholder}
            </li>
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-3 text-neutral-500 text-center italic text-xs">
                No results found
              </li>
            ) : (
              filteredOptions.map((opt) => (
                <li
                  key={opt.id}
                  className={cn(
                    "cursor-pointer px-3 py-2 hover:bg-neutral-100 flex items-center justify-between transition-colors",
                    String(value) === String(opt.id) && "bg-[#fff5f2] font-medium text-[#1a1a1a]"
                  )}
                  onClick={() => {
                    onChange(String(opt.id));
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <span className="truncate">{opt.name}</span>
                  {String(value) === String(opt.id) && (
                    <Check className="h-4 w-4 text-[#DA7756]" />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
// --------------------------------------------

const KPIHistoryTab: React.FC<KPIHistoryTabProps> = ({
  users = [],
  departments = [],
  kpis = [],
  onDeleteSelected,
}) => {
  const [selectedKpiId, setSelectedKpiId] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("");
  const [selectedLogType, setSelectedLogType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [historyData, setHistoryData] = useState<KPIHistoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [sortKey, setSortKey] = useState<"date" | "achievement" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Filter params properly built to send to API
  const buildQueryParams = (isExport = false) => {
    const params = new URLSearchParams();
    if (selectedKpiId) params.append("kpi_id", selectedKpiId);
    if (selectedDepartmentId) params.append("department_id", selectedDepartmentId);
    if (selectedUserId) params.append("user_id", selectedUserId);
    if (selectedFrequency) params.append("frequency", selectedFrequency);
    if (selectedLogType) params.append("log_type", selectedLogType);
    if (fromDate) params.append("from", formatDateForApi(fromDate));
    if (toDate) params.append("to", formatDateForApi(toDate));

    if (!isExport) {
      params.append("page", page.toString());
      params.append("per_page", perPage.toString());
    }
    return params.toString();
  };

  const fetchHistory = async () => {
    const baseUrl = getDynamicBaseUrl();
    const token = getDynamicToken();

    if (!baseUrl) return;

    setIsLoading(true);
    try {
      const query = buildQueryParams();
      const endpoint = `${baseUrl}/kpis/history.json${query ? `?${query}` : ""}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const json = await response.json();

      if (json.success && json.data?.history) {
        setHistoryData(json.data.history.map(normalizeHistoryRow));
        setTotalPages(json.pagination?.total_pages || 1);
        setTotalCount(json.pagination?.total_count || 0);
      } else {
        setHistoryData([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error) {
      toast.error("Failed to load history data.");
    } finally {
      setIsLoading(false);
    }
  };

  // Triggers API call perfectly whenever any filter state changes
  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    perPage,
    selectedKpiId,
    selectedDepartmentId,
    selectedUserId,
    selectedFrequency,
    selectedLogType,
    fromDate,
    toDate,
  ]);

  const handleExport = async () => {
    const baseUrl = getDynamicBaseUrl();
    const token = getDynamicToken();

    if (!baseUrl) {
      toast.error("Base URL not found");
      return;
    }

    setIsExporting(true);
    try {
      const query = buildQueryParams(true);
      const endpoint = `${baseUrl}/kpis/export_history.json${query ? `?${query}` : ""}`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Export failed: HTTP ${response.status}`);

      const contentType = response.headers.get("content-type") ?? "";
      if (
        contentType.includes("csv") ||
        contentType.includes("excel") ||
        contentType.includes("spreadsheet")
      ) {
        const disposition = response.headers.get("content-disposition") ?? "";
        const nameMatch = disposition.match(/filename[^;=\n]*=(['"]?)([^'"\n;]+)\1/);
        const filename = nameMatch?.[2]?.trim() || `kpi_history_export_${format(new Date(), "yyyy-MM-dd")}.csv`;

        const blob = await response.blob();
        downloadBlob(blob, filename);
        toast.success("Export downloaded successfully");
        return;
      }

      const json = await response.json();
      const downloadUrl = json.download_url || json.file_url || json.url;

      if (downloadUrl) {
        const resolvedUrl = downloadUrl.startsWith("http")
          ? downloadUrl
          : new URL(downloadUrl, endpoint).toString();

        const fileRes = await fetch(resolvedUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (fileRes.ok) {
          const blob = await fileRes.blob();
          downloadBlob(blob, "kpi_history_export.csv");
          toast.success("Export downloaded successfully");
        } else {
          throw new Error("Failed to fetch the export file from URL");
        }
      } else {
        throw new Error("Export API did not return a valid file or URL");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Export failed";
      toast.error(msg);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!onDeleteSelected) {
      toast.error("Delete function is not configured");
      return;
    }

    const ok = window.confirm(`Delete ${ids.length} selected record(s)?`);
    if (!ok) return;

    setIsDeleting(true);
    try {
      await onDeleteSelected(ids);
      setSelectedIds(new Set());
      toast.success("Records deleted");
      fetchHistory();
    } catch (error) {
      toast.error("Failed to delete records");
    } finally {
      setIsDeleting(false);
    }
  };

  const allSelected = historyData.length > 0 && historyData.every((e) => selectedIds.has(e.id));
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(historyData.map((e) => e.id)));
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return historyData;
    const copy = [...historyData];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortKey === "achievement") {
        const na = parseFloat(String(a.achievement).replace(/[^0-9.-]/g, "")) || 0;
        const nb = parseFloat(String(b.achievement).replace(/[^0-9.-]/g, "")) || 0;
        cmp = na - nb;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [historyData, sortKey, sortDir]);

  const toggleSort = (key: "date" | "achievement") => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  return (
    <div className="space-y-5">
      <div className={cn("rounded-lg p-5 shadow-sm sm:p-6", kpiClass.border, kpiClass.surfaceCard)}>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Filter className="h-5 w-5 shrink-0 text-[#DA7756]" strokeWidth={2} />
            <h2 className="text-lg font-bold text-[#1a1a1a]">Filter History</h2>
          </div>
          <div className="flex items-center gap-2">
            {selectedIds.size > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={isDeleting || isExporting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-60"
              >
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? "Deleting..." : `Delete (${selectedIds.size})`}
              </button>
            )}

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting || isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#DA7756] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c9674a] disabled:opacity-60"
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isExporting ? "Exporting…" : "Export Data"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">KPI</label>
            <select className={selectClass} value={selectedKpiId} onChange={(e) => { setPage(1); setSelectedKpiId(e.target.value); }}>
              <option value="">All KPIs</option>
              {kpis.map((kpi) => (
                <option key={kpi.id} value={kpi.id}>{kpi.name}</option>
              ))}
            </select>
          </div>

          {/* Department Searchable Dropdown with proper state setting */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">Department</label>
            <SearchableSelect
              options={departments}
              value={selectedDepartmentId}
              onChange={(val) => {
                setPage(1); // Page reset to 1
                setSelectedDepartmentId(val);
              }}
              placeholder="All Departments"
              className={selectClass}
            />
          </div>

          {/* User Searchable Dropdown with proper state setting */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">User</label>
            <SearchableSelect
              options={users}
              value={selectedUserId}
              onChange={(val) => {
                setPage(1); // Page reset to 1
                setSelectedUserId(val);
              }}
              placeholder="All Users"
              className={selectClass}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">Frequency</label>
            <select className={selectClass} value={selectedFrequency} onChange={(e) => { setPage(1); setSelectedFrequency(e.target.value); }}>
              <option value="">All Frequencies</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">Log Type</label>
            <select className={selectClass} value={selectedLogType} onChange={(e) => { setPage(1); setSelectedLogType(e.target.value); }}>
              <option value="">All Types</option>
              <option value="entry_submitted">Entry Submitted</option>
              <option value="kpi_created">KPI Created</option>
              <option value="kpi_updated">KPI Updated</option>
              <option value="kpi_restored">KPI Restored</option>
              <option value="kpi_archived">KPI Archived</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">From Date</label>
            <input
              type="date"
              className={inputClass}
              value={fromDate}
              onChange={(e) => { setPage(1); setFromDate(e.target.value); }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">To Date</label>
            <input
              type="date"
              className={inputClass}
              value={toDate}
              onChange={(e) => { setPage(1); setToDate(e.target.value); }}
            />
          </div>
        </div>
      </div>

      <div className={cn("overflow-hidden rounded-lg border border-neutral-200 bg-white relative min-h-[300px]")}>
        {isLoading && (
          <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="h-8 w-8 text-[#DA7756] animate-spin" />
          </div>
        )}

        <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-3">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            disabled={sortedData.length === 0}
            className="h-4 w-4 rounded border-gray-300 text-[#DA7756] focus:ring-[#DA7756]"
          />
          <span className="text-sm text-neutral-600">Showing {historyData.length} of {totalCount || historyData.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-white">
                <th className="w-12 px-5 py-3 text-left align-middle">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    disabled={sortedData.length === 0}
                    className="h-4 w-4 rounded border-gray-300 text-[#DA7756] focus:ring-[#DA7756] disabled:opacity-40"
                  />
                </th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500 whitespace-nowrap">
                  <button type="button" onClick={() => toggleSort("date")} className="inline-flex items-center gap-1 hover:text-[#1a1a1a]">
                    Date <ArrowDownUp className="h-3 w-3 text-neutral-400" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500 whitespace-nowrap">Type</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500 whitespace-nowrap">KPI Name</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500 whitespace-nowrap">Department</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500 whitespace-nowrap">User</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500 whitespace-nowrap">Planned</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500 whitespace-nowrap">Actual</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500 whitespace-nowrap">
                  <button type="button" onClick={() => toggleSort("achievement")} className="inline-flex items-center gap-1 hover:text-[#1a1a1a]">
                    Achievement <ArrowDownUp className="h-3 w-3 text-neutral-400" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500 whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-500 whitespace-nowrap">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 rounded-full bg-orange-50 p-5">
                        <Search className="h-10 w-10 text-[#DA7756]" strokeWidth={1.5} />
                      </div>
                      <p className="text-base font-bold text-[#1a1a1a]">No entries found</p>
                      <p className="mt-1 text-sm text-neutral-500">Try adjusting your API filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sortedData.map((row) => (
                  <tr key={row.id} className="border-b border-neutral-100 bg-white hover:bg-neutral-50/50">
                    <td className="px-5 py-3 align-middle">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleOne(row.id)}
                        className="h-4 w-4 rounded border-gray-300 text-[#DA7756] focus:ring-[#DA7756]"
                      />
                    </td>
                    <td className="px-4 py-3 text-[#1a1a1a] whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3 text-[#1a1a1a] whitespace-nowrap">{row.type}</td>
                    <td className="px-4 py-3 text-[#1a1a1a] whitespace-nowrap">{row.kpiName}</td>
                    <td className="px-4 py-3 text-[#1a1a1a] whitespace-nowrap">
                      <span className="inline-flex items-center rounded-md border border-neutral-300 bg-white px-2.5 py-1 text-xs text-neutral-600">
                        {row.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#1a1a1a] whitespace-nowrap">{row.user}</td>
                    <td className="px-4 py-3 text-[#1a1a1a] whitespace-nowrap">{row.planned}</td>
                    <td className="px-4 py-3 text-[#1a1a1a] whitespace-nowrap">{row.actual}</td>
                    <td className="px-4 py-3 text-[#1a1a1a] whitespace-nowrap">
                      {row.achievement !== "-" ? (row.achievement.includes('%') ? row.achievement : `${row.achievement}%`) : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={cn(
                        "inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium",
                        row.status === "red" ? "bg-red-100 text-red-500" :
                          row.status === "green" ? "bg-green-100 text-green-600" :
                            row.status === "amber" || row.status === "yellow" ? "bg-yellow-100 text-yellow-600" :
                              "bg-neutral-100 text-neutral-600"
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 truncate max-w-[150px]" title={row.notes}>
                      {row.notes}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-neutral-100 p-4 flex items-center justify-between bg-white">
          <span className="text-sm text-neutral-500">
            Showing entries from page <span className="font-semibold text-neutral-800">{page}</span> of <span className="font-semibold text-neutral-800">{totalPages}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="p-2 rounded-md hover:bg-neutral-100 disabled:opacity-50 transition-colors border border-neutral-200 shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 text-neutral-600" />
            </button>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages || isLoading}
              className="p-2 rounded-md hover:bg-neutral-100 disabled:opacity-50 transition-colors border border-neutral-200 shadow-sm"
            >
              <ChevronRight className="h-4 w-4 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIHistoryTab;