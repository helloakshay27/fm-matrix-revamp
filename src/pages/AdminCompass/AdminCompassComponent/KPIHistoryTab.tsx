// ─────────────────────────────────────────────
// KPIHistoryTab.tsx  —  KPI History Log
// ─────────────────────────────────────────────
import React, { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  ArrowDownUp,
  CalendarDays,
  Download,
  Filter,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { getToken as getAuthToken } from "@/utils/auth";

const KPI_EXPORT_HISTORY_ENDPOINT =
  "https://fm-uat-api.lockated.com/kpis/export_history.json";
const KPI_BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo4Nzk4OX0.pHlLUDAbJSUJbV-wTIdDyuXScLS7MKbPY9P3BZ8TmzI";

const getEffectiveToken = (): string => {
  const adminCompassToken = localStorage.getItem("auth_token");
  const appToken = getAuthToken();
  return adminCompassToken || appToken || KPI_BEARER_TOKEN;
};

const downloadExportHistory = async (): Promise<void> => {
  const token = getEffectiveToken();

  const response = await fetch(KPI_EXPORT_HISTORY_ENDPOINT, {
    headers: {
      Accept: "*/*",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Export failed: HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = (await response.json()) as Record<string, unknown>;
    const downloadUrl =
      (json.download_url as string | undefined) ??
      (json.file_url as string | undefined) ??
      (json.url as string | undefined);

    if (downloadUrl) {
      const fileResponse = await fetch(downloadUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!fileResponse.ok) {
        throw new Error(`Download failed: HTTP ${fileResponse.status}`);
      }

      const fileBlob = await fileResponse.blob();
      const fileUrl = URL.createObjectURL(fileBlob);
      const fileAnchor = document.createElement("a");
      fileAnchor.href = fileUrl;
      fileAnchor.download = "kpi_history_export.xlsx";
      document.body.appendChild(fileAnchor);
      fileAnchor.click();
      fileAnchor.remove();
      URL.revokeObjectURL(fileUrl);
      return;
    }

    throw new Error("Export endpoint returned JSON without download URL");
  }

  // Derive filename from Content-Disposition header or fall back to default
  const disposition = response.headers.get("content-disposition") ?? "";
  const nameMatch = disposition.match(/filename[^;=\n]*=(['"]?)([^'"\n;]+)\1/);
  const filename = nameMatch?.[2]?.trim() || "kpi_history_export.xlsx";

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { kpiClass } from "./Shared";

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
  id: string;
  name: string;
}

const selectClass = cn(
  "w-full rounded-lg px-3 py-2 text-sm text-[#1a1a1a] shadow-sm",
  kpiClass.border,
  kpiClass.surfaceInput,
  kpiClass.focusRing
);

const dateInputClass = cn(
  "w-full rounded-lg py-2 pl-3 pr-10 text-sm text-[#1a1a1a] shadow-sm placeholder:text-neutral-400",
  kpiClass.border,
  kpiClass.surfaceInput,
  kpiClass.focusRing
);

type SortKey = "date" | "achievement" | null;
type SortDir = "asc" | "desc";

const calendarDayClassNames = {
  day_selected:
    "bg-[#DA7756] text-white hover:bg-[#DA7756] hover:text-white focus:bg-[#DA7756] focus:text-white rounded-full w-10 h-10 flex items-center justify-center",
  day_today:
    "border border-[#DA7756] text-[#DA7756] font-semibold rounded-full",
};

function HistoryDatePickerField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:col-span-1">
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-medium text-neutral-500"
      >
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative w-full">
          <input
            id={id}
            readOnly
            value={value ? format(value, "dd/MM/yyyy") : ""}
            placeholder="dd/mm/yyyy"
            onClick={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(true);
              }
            }}
            className={cn(
              dateInputClass,
              "cursor-pointer pr-10 tabular-nums outline-none"
            )}
          />
          <PopoverTrigger asChild>
            <button
              type="button"
              className="absolute right-0 top-0 flex h-full w-10 items-center justify-center rounded-r-lg text-neutral-500 transition-colors hover:bg-[#fef6f4] hover:text-[#DA7756] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DA7756]/30"
              aria-label={`Open calendar — ${label}`}
            >
              <CalendarDays className="h-4 w-4" strokeWidth={2} />
            </button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          className={cn(
            "w-auto border-[rgba(218,119,86,0.2)] p-0",
            kpiClass.surfaceCard
          )}
          align="start"
        >
          <Calendar
            mode="single"
            selected={value}
            defaultMonth={value}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
            initialFocus
            classNames={calendarDayClassNames}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

type KPIHistoryTabProps = {
  users?: CompanyUserOption[];
  departments?: CompanyDepartmentOption[];
  kpis?: KPIOption[];
  entries?: KPIHistoryRow[];
  onDeleteSelected?: (ids: string[]) => Promise<void>;
};

const KPIHistoryTab: React.FC<KPIHistoryTabProps> = ({
  users = [],
  departments = [],
  kpis = [],
  entries = [],
  onDeleteSelected,
}) => {
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [selectedKpi, setSelectedKpi] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedUser, setSelectedUser] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedFrequency, setSelectedFrequency] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedCount = selectedIds.size;

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await downloadExportHistory();
      toast.success("Export downloaded successfully");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Export failed";
      toast.error(message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (!onDeleteSelected) {
      toast.error("Delete API is not configured");
      return;
    }

    const ok = window.confirm(
      `Delete ${ids.length} selected KPI histor${ids.length > 1 ? "ies" : "y"}?`
    );
    if (!ok) return;

    setIsDeleting(true);
    try {
      await onDeleteSelected(ids);
      setSelectedIds(new Set());
      toast.success("Selected KPIs deleted");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete selected KPIs";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const departmentOptions = useMemo(
    () => Array.from(new Set(departments.map((d) => d.name).filter(Boolean))),
    [departments]
  );

  const userOptions = useMemo(
    () => users.map((u) => ({ id: String(u.id), name: u.name })),
    [users]
  );

  const kpiOptions = useMemo(
    () => Array.from(new Set(kpis.map((k) => k.name).filter(Boolean))),
    [kpis]
  );

  const statusOptions = useMemo(
    () =>
      Array.from(
        new Set(entries.map((e) => e.status).filter((s) => s && s !== "-"))
      ).sort(),
    [entries]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return entries.filter((e) => {
      const matchesSearch =
        !q ||
        e.kpiName.toLowerCase().includes(q) ||
        e.user.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q);

      const matchesKpi = selectedKpi === "all" || e.kpiName === selectedKpi;
      const matchesDepartment =
        selectedDepartment === "all" || e.department === selectedDepartment;
      const matchesUser = selectedUser === "all" || e.user === selectedUser;

      const matchesFrequency =
        selectedFrequency === "all" ||
        e.frequency?.toLowerCase() === selectedFrequency.toLowerCase();
      const matchesStatus =
        selectedStatus === "all" || e.status === selectedStatus;

      return (
        matchesSearch &&
        matchesKpi &&
        matchesDepartment &&
        matchesUser &&
        matchesFrequency &&
        matchesStatus
      );
    });
  }, [entries, search, selectedDepartment, selectedKpi, selectedUser, selectedFrequency, selectedStatus]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      let cmp = 0;
      if (sortKey === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortKey === "achievement") {
        const na =
          parseFloat(String(a.achievement).replace(/[^0-9.-]/g, "")) || 0;
        const nb =
          parseFloat(String(b.achievement).replace(/[^0-9.-]/g, "")) || 0;
        cmp = na - nb;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortKey, sortDir]);

  const allSelected =
    sorted.length > 0 && sorted.every((e) => selectedIds.has(e.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sorted.map((e) => e.id)));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  const showingCount = sorted.length;
  const totalCount = entries.length;

  return (
    <div className="space-y-5">
      <div
        className={cn(
          "rounded-lg p-5 shadow-sm sm:p-6",
          kpiClass.border,
          kpiClass.surfaceCard
        )}
      >
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <CalendarDays
              className="h-6 w-6 shrink-0 text-[#DA7756]"
              strokeWidth={2}
            />
            <h2 className="text-lg font-bold text-[#1a1a1a]">
              KPI History Log
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {selectedCount > 0 && (
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={isDeleting || isExporting}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#DA7756] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c9674a] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                {isDeleting ? "Deleting..." : `Delete (${selectedCount})`}
              </button>
            )}

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting || isDeleting}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#DA7756] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c9674a] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {isExporting ? "Exporting…" : "Export All"}
            </button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            placeholder="Search KPI or User…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full rounded-lg py-2.5 pl-10 pr-3 text-sm text-[#1a1a1a] shadow-sm placeholder:text-neutral-400",
              kpiClass.border,
              kpiClass.surfaceInput,
              kpiClass.focusRing
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <select
            className={selectClass}
            value={selectedKpi}
            onChange={(e) => setSelectedKpi(e.target.value)}
          >
            <option value="all">All KPIs</option>
            {kpiOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departmentOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <select
            className={selectClass}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="all">All Users</option>
            {userOptions.map((user) => (
              <option key={user.id} value={user.name}>
                {user.name}
              </option>
            ))}
          </select>
          <select className={selectClass} defaultValue="all">
            <option value="all">All Frequencies</option>
          </select>
          <select
            className={selectClass}
            value={selectedFrequency}
            onChange={(e) => setSelectedFrequency(e.target.value)}
          >
            <option value="all">All Frequencies</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <select
            className={selectClass}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <HistoryDatePickerField
            id="kpi-history-from"
            label="From"
            value={dateFrom}
            onChange={setDateFrom}
          />
          <HistoryDatePickerField
            id="kpi-history-to"
            label="To"
            value={dateTo}
            onChange={setDateTo}
          />
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-neutral-600">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            disabled={sorted.length === 0}
            className={cn("h-4 w-4 disabled:opacity-40", kpiClass.checkbox)}
          />
          <span>
            Showing{" "}
            <span className="font-semibold text-[#1a1a1a]">{showingCount}</span>{" "}
            of{" "}
            <span className="font-semibold text-[#1a1a1a]">{totalCount}</span>{" "}
            entries
          </span>
        </label>
      </div>

      <div
        className={cn(
          "overflow-hidden rounded-lg shadow-sm",
          kpiClass.border,
          kpiClass.surfaceCard
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[rgba(218,119,86,0.12)] bg-[#f3f1ec]">
                <th className="w-10 px-3 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    disabled={sorted.length === 0}
                    className={cn(
                      "h-4 w-4 disabled:opacity-40",
                      kpiClass.checkbox
                    )}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-3 py-3 text-left font-semibold text-[#334155]">
                  <button
                    type="button"
                    onClick={() => toggleSort("date")}
                    className="inline-flex items-center gap-1 font-semibold text-[#334155] hover:text-[#1a1a1a]"
                  >
                    Date
                    <ArrowDownUp className="h-3.5 w-3.5 text-neutral-400" />
                  </button>
                </th>
                <th className="px-3 py-3 text-left font-semibold text-[#334155]">
                  Type
                </th>
                <th className="px-3 py-3 text-left font-semibold text-[#334155]">
                  KPI Name
                </th>
                <th className="px-3 py-3 text-left font-semibold text-[#334155]">
                  Department
                </th>
                <th className="px-3 py-3 text-left font-semibold text-[#334155]">
                  User
                </th>
                <th className="px-3 py-3 text-left font-semibold text-[#334155]">
                  Planned
                </th>
                <th className="px-3 py-3 text-left font-semibold text-[#334155]">
                  Actual
                </th>
                <th className="px-3 py-3 text-left font-semibold text-[#334155]">
                  <button
                    type="button"
                    onClick={() => toggleSort("achievement")}
                    className="inline-flex items-center gap-1 font-semibold text-[#334155] hover:text-[#1a1a1a]"
                  >
                    Achievement
                    <ArrowDownUp className="h-3.5 w-3.5 text-neutral-400" />
                  </button>
                </th>
                <th className="px-3 py-3 text-left font-semibold text-[#334155]">
                  Status
                </th>
                <th className="px-3 py-3 text-left font-semibold text-[#334155]">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-4 rounded-full bg-sky-50 p-5">
                        <Filter
                          className="h-12 w-12 text-sky-300"
                          strokeWidth={1.25}
                        />
                      </div>
                      <p className="text-base font-bold text-[#1a1a1a]">
                        No entries found
                      </p>
                      <p className="mt-1 text-sm text-neutral-500">
                        Try adjusting your filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-[#faf9f6]"
                  >
                    <td className="px-3 py-3 align-middle">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleOne(row.id)}
                        className={cn("h-4 w-4", kpiClass.checkbox)}
                      />
                    </td>
                    <td className="px-3 py-3 text-neutral-800">{row.date}</td>
                    <td className="px-3 py-3 text-neutral-800">{row.type}</td>
                    <td className="px-3 py-3 font-medium text-[#1a1a1a]">
                      {row.kpiName}
                    </td>
                    <td className="px-3 py-3 text-neutral-700">
                      {row.department}
                    </td>
                    <td className="px-3 py-3 text-neutral-700">{row.user}</td>
                    <td className="px-3 py-3 text-neutral-800">
                      {row.planned}
                    </td>
                    <td className="px-3 py-3 text-neutral-800">{row.actual}</td>
                    <td className="px-3 py-3 text-neutral-800">
                      {row.achievement}
                    </td>
                    <td className="px-3 py-3 text-neutral-800">{row.status}</td>
                    <td className="px-3 py-3 text-neutral-600">{row.notes}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KPIHistoryTab;
