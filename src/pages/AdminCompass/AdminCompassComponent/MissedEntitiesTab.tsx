// ─────────────────────────────────────────────
// MissedEntitiesTab.tsx  —  Missed Entries (Dynamic API Version)
// ─────────────────────────────────────────────
import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  Filter,
  Layers,
  Search,
  Users,
  RefreshCw,
  Check
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { kpiClass } from "./Shared";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface MissedEntryDetail {
  id: string;
  kpiName: string;
  missedOn?: string;
  department?: string;
  frequency?: string;
}

interface CompanyUserOption {
  id: number | string;
  name: string;
  email?: string;
}

interface CompanyDepartmentOption {
  id: number | string;
  name: string;
}

interface KPIOption {
  id: string;
  name: string;
}

interface MissedUserRow {
  id: string;
  name: string;
  email: string;
  department: string;
  missedCount: number;
  entries: MissedEntryDetail[];
}

interface ApiStats {
  total_missed: number;
  users_with_missed: number;
  lookback_days: number;
}

type MissedEntitiesTabProps = {
  users?: CompanyUserOption[];
  departments?: CompanyDepartmentOption[];
  kpis?: KPIOption[];
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

// ─────────────────────────────────────────────
// CUSTOM SEARCHABLE SELECT COMPONENT (WITH SEARCH BAR INSIDE)
// ─────────────────────────────────────────────
const SearchableSelect = ({ value, onChange, options, placeholder, disabled, loading }: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the search bar when dropdown opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [open]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => String(o.value) === String(value));
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-w-[180px] flex-1" ref={ref} style={{ zIndex: open ? 50 : 1 }}>

      {/* TRIGGER BUTTON */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen(!open);
            setSearch("");
          }
        }}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-[13px] font-medium text-[#1a1a1a] shadow-sm transition-all bg-white border border-[#e8e3de] hover:bg-gray-50",
          open && "ring-2 ring-[#DA7756]/20 border-[#DA7756]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span className="truncate">{loading ? "Loading..." : displayValue}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {/* DROPDOWN MENU WITH SEARCH BAR */}
      {open && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white border border-[#e8e3de] rounded-xl shadow-[0_10px_20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">

          {/* SEARCH BOX INSIDE MENU */}
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Type to search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-gray-200 py-1.5 pl-8 pr-3 text-[13px] text-[#1a1a1a] outline-none focus:border-[#DA7756] focus:ring-1 focus:ring-[#DA7756]/20 bg-white"
              />
            </div>
          </div>

          {/* OPTIONS LIST */}
          <div className="max-h-48 overflow-y-auto p-1">
            {value && value !== 'all' && (
              <div
                className="p-2 hover:bg-red-50 cursor-pointer rounded-md text-[13px] mb-1 text-red-500 font-semibold truncate transition-colors"
                onClick={() => {
                  onChange('all');
                  setOpen(false);
                  setSearch("");
                }}
              >
                Clear Selection
              </div>
            )}
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-[13px] text-gray-500 text-center truncate">No matches found</div>
            ) : (
              filteredOptions.map((o) => {
                const isSelected = String(value) === String(o.value);
                return (
                  <div
                    key={o.value}
                    className={cn(
                      "flex items-center justify-between p-2 cursor-pointer rounded-md text-[13px] transition-colors truncate",
                      isSelected ? "text-[#DA7756] font-semibold bg-[#DA7756]/10" : "text-[#1a1a1a] hover:bg-gray-100"
                    )}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    {o.label}
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-[#DA7756]" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const MissedEntitiesTab: React.FC<MissedEntitiesTabProps> = ({
  users = [],
  departments = [],
  kpis = [],
}) => {
  // UI State
  const [search, setSearch] = useState("");
  const [groupByDept, setGroupByDept] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  // Filter State (Sent to API)
  const [lookbackDays, setLookbackDays] = useState("30");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState("all");
  const [selectedKpiName, setSelectedKpiName] = useState("all");

  // API Data State
  const [userRows, setUserRows] = useState<MissedUserRow[]>([]);
  const [apiStats, setApiStats] = useState<ApiStats>({ total_missed: 0, users_with_missed: 0, lookback_days: 30 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─────────────────────────────────────────────
  // FETCH API LOGIC
  // ─────────────────────────────────────────────
  const fetchMissedData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let baseUrl = localStorage.getItem("baseUrl") || "";
      baseUrl = baseUrl.trim().replace(/\/$/, "");
      if (baseUrl && !baseUrl.startsWith("http")) {
        baseUrl = `https://${baseUrl}`;
      }

      if (!baseUrl) throw new Error("Base URL not found in localStorage");

      const query = new URLSearchParams({ lookback_days: lookbackDays });
      if (selectedDepartment !== "all") query.set("department_id", selectedDepartment);
      if (selectedUserId !== "all") query.set("assignee_id", selectedUserId);

      const endpoint = `${baseUrl}/kpis/missed_entries.json?${query.toString()}`;

      const res = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      const json = await res.json();

      if (json.success && json.data) {
        setApiStats({
          total_missed: json.data.total_missed || 0,
          users_with_missed: json.data.users_with_missed || 0,
          lookback_days: json.data.lookback_days || Number(lookbackDays)
        });

        const rawEntries = json.data.missed_entries || [];
        const groupedUsers = new Map<string, MissedUserRow>();

        rawEntries.forEach((entry: any) => {
          const userId = String(entry.assignee_id);

          if (!groupedUsers.has(userId)) {
            const propUser = users.find((u: any) => String(u.id) === userId) as any;
            let resolvedEmail = entry.assignee_email || entry.email || propUser?.email;

            if (!resolvedEmail) {
              const nameTrimmed = entry.assignee_name?.trim() || "";
              if (nameTrimmed === "Common Admin Id") {
                resolvedEmail = "operational@lockated.com";
              } else if (nameTrimmed) {
                resolvedEmail = `${nameTrimmed.toLowerCase().replace(/\s+/g, '.')}@lockated.com`;
              } else {
                resolvedEmail = `user${userId}@lockated.com`;
              }
            }

            groupedUsers.set(userId, {
              id: userId,
              name: entry.assignee_name?.trim() || propUser?.name || `User ${userId}`,
              email: resolvedEmail,
              department: entry.department_name || "General",
              missedCount: 0,
              entries: [],
            });
          }

          const userRow = groupedUsers.get(userId)!;
          userRow.missedCount += 1;
          userRow.entries.push({
            id: `${entry.kpi_id}-${entry.period_date}`,
            kpiName: entry.kpi_name,
            missedOn: entry.period_date,
            department: entry.department_name,
            frequency: entry.frequency_label
          });
        });

        const finalRows = Array.from(groupedUsers.values()).sort((a, b) => b.missedCount - a.missedCount);
        setUserRows(finalRows);
      } else {
        throw new Error("Invalid API response format");
      }

    } catch (err: any) {
      console.error("Failed to fetch missed entries:", err);
      setError(err.message || "Failed to load data");
      setUserRows([]);
    } finally {
      setLoading(false);
    }
  }, [lookbackDays, selectedDepartment, selectedUserId, users]);

  useEffect(() => {
    fetchMissedData();
  }, [fetchMissedData]);

  // ─────────────────────────────────────────────
  // LOCAL FILTERING & DROPDOWN MAPPING
  // ─────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return userRows.filter((u) => {
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.entries.some((e) => e.kpiName.toLowerCase().includes(q));

      const matchesKpi =
        selectedKpiName === "all" ||
        u.entries.some((entry) => entry.kpiName === selectedKpiName);

      return matchesSearch && matchesKpi;
    });
  }, [search, selectedKpiName, userRows]);

  const deptSelectOptions = useMemo(() => {
    const source = departments.length > 0 ? departments.map((d) => d.name) : userRows.map((u) => u.department);
    const unique = Array.from(new Set(source.filter(Boolean)));
    return [
      { label: "All Departments", value: "all" },
      ...unique.map(d => ({ label: d, value: d }))
    ];
  }, [departments, userRows]);

  const userSelectOptions = useMemo(() => {
    let uniqueUsers: { id: string, name: string }[] = [];
    if (users.length > 0) {
      uniqueUsers = users.map((u) => ({ id: String(u.id), name: u.name }));
    } else {
      uniqueUsers = Array.from(new Map(userRows.map((u) => [u.id, { id: u.id, name: u.name }])).values());
    }
    return [
      { label: "All Users", value: "all" },
      ...uniqueUsers.map(u => ({ label: u.name, value: u.id }))
    ];
  }, [users, userRows]);

  const kpiSelectOptions = useMemo(() => {
    const fromEntries = userRows.flatMap((u) => u.entries.map((entry) => entry.kpiName));
    const fromKpiList = kpis.map((kpi) => kpi.name);
    const unique = Array.from(new Set([...fromEntries, ...fromKpiList].filter(Boolean)));
    return [
      { label: "All KPIs", value: "all" },
      ...unique.map(k => ({ label: k, value: k }))
    ];
  }, [kpis, userRows]);

  const groupedByDept = useMemo(() => {
    const map = new Map<string, MissedUserRow[]>();
    for (const u of filteredUsers) {
      const list = map.get(u.department) ?? [];
      list.push(u);
      map.set(u.department, list);
    }
    return map;
  }, [filteredUsers]);

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-rose-200/90 bg-rose-50/90 px-5 py-5 shadow-sm transition-opacity" style={{ opacity: loading ? 0.6 : 1 }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-neutral-600">Total Missed Entries</p>
              <p className="mt-1 text-4xl font-bold leading-none text-[#1a1a1a]">
                {loading ? "..." : apiStats.total_missed}
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rose-100">
              <AlertCircle className="h-6 w-6 text-rose-600" strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/90 px-5 py-5 shadow-sm transition-opacity" style={{ opacity: loading ? 0.6 : 1 }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-neutral-600">Users with Missed Entries</p>
              <p className="mt-1 text-4xl font-bold leading-none text-[#1a1a1a]">
                {loading ? "..." : apiStats.users_with_missed}
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100">
              <Users className="h-6 w-6 text-emerald-600" strokeWidth={2} />
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-sky-200/90 bg-sky-50/90 px-5 py-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-neutral-600">Lookback Period</p>
              <p className="mt-1 text-2xl font-bold leading-tight text-sky-950 sm:text-3xl">
                {apiStats.lookback_days} days
              </p>
            </div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sky-100">
              <CalendarDays className="h-6 w-6 text-sky-600" strokeWidth={2} />
            </span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className={cn("rounded-xl p-5 shadow-sm", kpiClass.borderSoft, "bg-[rgba(218,119,86,0.06)]")}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#DA7756]" strokeWidth={2} />
            <h3 className="text-sm font-bold text-[#1a1a1a]">Filters</h3>
          </div>
          <button
            onClick={fetchMissedData}
            className="rounded p-1 hover:bg-[#DA7756]/10 text-[#DA7756] transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          </button>
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-center">
          {/* Main Global Text Search */}
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Search by keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full rounded-lg py-2 pl-9 pr-3 text-[13px] font-medium text-[#1a1a1a] shadow-sm placeholder:text-neutral-500 bg-white",
                kpiClass.border, kpiClass.focusRing
              )}
            />
          </div>

          <SearchableSelect
            loading={loading}
            disabled={loading}
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            options={deptSelectOptions}
            placeholder="All Departments"
          />

          <SearchableSelect
            loading={loading}
            disabled={loading}
            value={selectedUserId}
            onChange={setSelectedUserId}
            options={userSelectOptions}
            placeholder="All Users"
          />

          <SearchableSelect
            value={selectedKpiName}
            onChange={setSelectedKpiName}
            options={kpiSelectOptions}
            placeholder="All KPIs"
          />

          <select
            disabled={loading}
            className={cn(
              "min-w-[130px] flex-1 rounded-lg px-3 py-2 text-[13px] font-medium text-[#1a1a1a] shadow-sm disabled:opacity-50 outline-none transition-all cursor-pointer border border-[#e8e3de] bg-white hover:bg-gray-50 focus:ring-2 focus:ring-[#DA7756]/15 focus:border-[#DA7756]"
            )}
            value={lookbackDays}
            onChange={(e) => setLookbackDays(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="60">Last 60 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 border border-red-200 flex items-center gap-3 text-red-800 text-sm">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* List Section */}
      <div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-[#1a1a1a]">Missed Entries by User</h2>
          <button
            type="button"
            onClick={() => setGroupByDept((v) => !v)}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors",
              groupByDept
                ? "border-[#DA7756] bg-[#DA7756] text-white hover:bg-[#c9674a]"
                : cn("text-[#1a1a1a]", kpiClass.border, kpiClass.surfacePanel, "hover:bg-[#f3ebe8]")
            )}
          >
            <Layers className="h-4 w-4" />
            Group by Department
          </button>
        </div>

        {/* Loading State UI */}
        {loading && userRows.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="h-20 w-full animate-pulse rounded-xl border bg-gray-100/50"></div>
            ))}
          </div>
        ) : !groupByDept ? (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <UserMissedCard
                key={user.id}
                user={user}
                open={openId === user.id}
                onOpenChange={(o) => setOpenId(o ? user.id : null)}
              />
            ))}
            {filteredUsers.length === 0 && !loading && (
              <p className={cn("rounded-xl border border-dashed py-12 text-center text-sm text-neutral-500", kpiClass.border, kpiClass.surfacePanel)}>
                No missed entries match your filters.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {Array.from(groupedByDept.entries()).map(([dept, users]) => (
              <div key={dept}>
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-neutral-500">{dept}</p>
                <div className="space-y-4">
                  {users.map((user) => (
                    <UserMissedCard
                      key={user.id}
                      user={user}
                      open={openId === user.id}
                      onOpenChange={(o) => setOpenId(o ? user.id : null)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && !loading && (
              <p className={cn("rounded-xl border border-dashed py-12 text-center text-sm text-neutral-500", kpiClass.border, kpiClass.surfacePanel)}>
                No missed entries match your filters.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// EXACT SCREENSHOT-MATCHED CARD COMPONENT
// ─────────────────────────────────────────────
const UserMissedCard: React.FC<{
  user: MissedUserRow;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}> = ({ user, open, onOpenChange }) => {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <div className="overflow-hidden rounded-xl border border-[#f8dfd1] bg-[#fffaf5]">

        {/* Card Header (Clickable) */}
        <CollapsibleTrigger className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#fcefe8] cursor-pointer">
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-[15px] text-[#1a1a1a]">{user.name}</p>
            {user.email && (
              <p className="mt-0.5 text-[13px] text-gray-500">{user.email}</p>
            )}
            <div className="mt-2">
              <span className="inline-flex items-center rounded bg-transparent border border-blue-200 px-2.5 py-0.5 text-[11px] font-medium text-blue-600">
                {user.department}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="rounded-md bg-[#f07b3f] px-3 py-1 text-[13px] font-semibold text-white whitespace-nowrap shadow-sm">
              {user.missedCount} missed
            </span>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-gray-400 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>

        {/* Card Expanded Content (Table) */}
        <CollapsibleContent>
          <div className="w-full">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-3 border-t border-[#f8dfd1] text-[13px] font-semibold text-gray-500 bg-[#fffaf5]">
              <div>KPI Name</div>
              <div>Department</div>
              <div>Frequency</div>
              <div>Expected Date</div>
            </div>

            {/* Table Body */}
            {user.entries.length === 0 ? (
              <div className="px-6 py-4 text-sm text-gray-500 border-t border-[#f8dfd1] bg-[#fffaf5]">
                No missed entries data available.
              </div>
            ) : (
              <div className="flex flex-col">
                {user.entries.map((e) => (
                  <div
                    key={e.id}
                    className="grid grid-cols-4 gap-4 px-6 py-4 items-center border-t border-[#f8dfd1] bg-[#fffaf5] transition-colors hover:bg-[#fcefe8]/50"
                  >
                    <div className="text-[13px] font-medium text-[#1a1a1a] pr-4 break-words">
                      {e.kpiName}
                    </div>
                    <div>
                      <span className="inline-flex rounded border border-gray-200 bg-transparent px-2.5 py-1 text-[12px] font-medium text-gray-700">
                        {e.department || user.department}
                      </span>
                    </div>
                    <div>
                      <span className="inline-flex rounded bg-[#1a1a1a] px-3 py-1 text-[11px] font-semibold text-white tracking-wide uppercase">
                        {e.frequency || "Daily"}
                      </span>
                    </div>
                    <div className="text-[13px] text-gray-700 font-medium">
                      {formatDate(e.missedOn)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>

      </div>
    </Collapsible>
  );
};

export default MissedEntitiesTab;