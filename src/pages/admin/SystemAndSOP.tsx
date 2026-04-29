// ─────────────────────────────────────────────
// MissedEntitiesTab.tsx  —  Missed Entries
// ─────────────────────────────────────────────
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  Filter,
  Layers,
  RefreshCw,
  Search,
  Users,
  X,
  Check,
} from "lucide-react";

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────
const C = {
  primary: "#DA7756",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "#e8e3de",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
  surfaceInput: "#fffaf8",
};

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface MissedEntryDetail {
  id: string;
  kpiName: string;
  missedOn?: string;
}

interface MissedUserRow {
  id: string;
  name: string;
  email: string;
  department: string;
  missedCount: number;
  entries: MissedEntryDetail[];
}

interface UserOption {
  id: string;
  name: string;
}

interface DepartmentOption {
  id: string;
  name: string;
}

interface KpiOption {
  id: string;
  name: string;
}

interface SelectOption {
  value: string;
  label: string;
}

// ─────────────────────────────────────────────
// API HELPERS & CONFIG
// ─────────────────────────────────────────────

// Robust Base URL generator (prevents double https:// and trailing slashes)
const getBaseUrl = () => {
  let url = localStorage.getItem("baseUrl") || "";
  url = url.trim().replace(/\/$/, ""); // Remove trailing slash
  if (url && !url.startsWith("http")) {
    url = `https://${url}`;
  }
  return url;
};

const getToken = () => localStorage.getItem("token") || "";

const apiHeaders = () => ({
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// Fetch missed entries from API (Fully Dynamic GET)
const fetchMissedEntries = async (params: {
  lookbackDays: string;
  departmentId: string;
  assigneeId: string;
}): Promise<MissedUserRow[]> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) throw new Error("Base URL not found in localStorage");

  const query = new URLSearchParams();
  if (params.lookbackDays) query.set("lookback_days", params.lookbackDays);
  if (params.departmentId && params.departmentId !== "all") query.set("department_id", params.departmentId);
  if (params.assigneeId && params.assigneeId !== "all") query.set("assignee_id", params.assigneeId);

  const endpoint = `${baseUrl}/kpis/missed_entries.json${query.toString() ? `?${query.toString()}` : ""}`;

  // Debug log to confirm API hit
  console.log("Fetching Initial Data:", endpoint);

  const res = await fetch(endpoint, {
    method: "GET",
    headers: apiHeaders(),
  });

  if (!res.ok) throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
  const json = await res.json();

  // Robust data extraction
  const arr: any[] = Array.isArray(json)
    ? json
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json?.missed_entries)
        ? json.missed_entries
        : Array.isArray(json?.users)
          ? json.users
          : [];

  return arr.map((u: any, idx: number) => {
    const entries: MissedEntryDetail[] = (
      Array.isArray(u.missed_kpis)
        ? u.missed_kpis
        : Array.isArray(u.entries)
          ? u.entries
          : Array.isArray(u.kpis)
            ? u.kpis
            : []
    ).map((e: any, ei: number) => ({
      id: String(e.id ?? e.kpi_id ?? `${idx}-${ei}`),
      kpiName: e.kpi_name ?? e.name ?? e.kpiName ?? `KPI ${ei + 1}`,
      missedOn: e.missed_on ?? e.missedOn ?? e.date ?? undefined,
    }));

    return {
      id: String(u.id ?? u.user_id ?? idx),
      name: u.name ?? u.user_name ?? u.full_name ?? `User ${idx + 1}`,
      email: u.email ?? "",
      department: u.department_name ?? u.department ?? "",
      missedCount: u.missed_count ?? u.missedCount ?? entries.length,
      entries,
    };
  });
};

// Filter APIs
const fetchUsers = async (): Promise<UserOption[]> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return [];
  const orgId = localStorage.getItem("org_id") || "";
  const url = orgId ? `${baseUrl}/api/users?organization_id=${orgId}` : `${baseUrl}/api/users`;
  const res = await fetch(url, { method: "GET", headers: apiHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  const arr: any[] = Array.isArray(json) ? json : (json.data ?? json.users ?? []);
  return arr.map((u: any) => ({
    id: String(u.id),
    name: u.name || `${u.firstname || ""} ${u.lastname || ""}`.trim() || u.email || `User ${u.id}`,
  }));
};

const fetchDepartments = async (): Promise<DepartmentOption[]> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return [];
  const res = await fetch(`${baseUrl}/pms/departments.json`, { method: "GET", headers: apiHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  const arr: any[] = Array.isArray(json) ? json : (json.data ?? json.departments ?? []);
  return arr.map((d: any) => ({
    id: String(d.id),
    name: d.name ?? d.department_name ?? `Dept ${d.id}`,
  }));
};

const fetchKpis = async (): Promise<KpiOption[]> => {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return [];
  const res = await fetch(`${baseUrl}/kpis`, { method: "GET", headers: apiHeaders() });
  if (!res.ok) return [];
  const json = await res.json();
  const arr: any[] = Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : (json.kpis ?? []);
  return arr.map((k: any) => ({
    id: String(k.id),
    name: k.name ?? k.kpi_name ?? `KPI ${k.id}`,
  }));
};

// ─────────────────────────────────────────────
// SEARCHABLE SELECT
// ─────────────────────────────────────────────
const SearchableSelect: React.FC<{
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  loading?: boolean;
}> = ({ value, onChange, options, placeholder = "Search...", loading = false }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const selected = options.find((o) => o.value === value);
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} style={{ position: "relative", zIndex: open ? 9999 : 1, flex: 1, minWidth: 150 }}>
      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder={loading ? "Loading..." : placeholder}
          value={open ? search : (selected?.label ?? "")}
          onClick={() => { if (!loading) { setOpen(true); setSearch(""); } }}
          onChange={(e) => { setSearch(e.target.value); setOpen(true); }}
          readOnly={!open}
          disabled={loading}
          style={{
            width: "100%", border: `1px solid ${C.primaryBord}`, borderRadius: 10,
            padding: "8px 36px 8px 12px", fontSize: 13, fontWeight: 600,
            color: loading ? C.textMuted : C.textMain, background: C.surfaceInput,
            outline: "none", cursor: loading ? "not-allowed" : "pointer",
            boxSizing: "border-box", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            transition: "border-color .15s, box-shadow .15s",
          }}
          onFocus={(e) => {
            if (!loading) {
              e.currentTarget.style.borderColor = C.primary;
              e.currentTarget.style.boxShadow = `0 0 0 3px rgba(218,119,86,0.15)`;
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = C.primaryBord;
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
          }}
        />
        <div style={{ position: "absolute", right: 10, top: "50%", transform: open ? "translateY(-50%) rotate(180deg)" : "translateY(-50%)", color: "#9ca3af", pointerEvents: "none", transition: "transform .2s", display: "flex" }}>
          <ChevronDown style={{ width: 16, height: 16 }} />
        </div>
      </div>

      {open && !loading && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: `1px solid ${C.borderLgt}`, borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", maxHeight: 220, overflowY: "auto", zIndex: 9999 }}>
          {value && value !== "all" && (
            <div onClick={() => { onChange("all"); setOpen(false); setSearch(""); }} style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#ef4444", cursor: "pointer", borderBottom: `1px solid ${C.borderLgt}` }}>
              ✕ Clear
            </div>
          )}
          {filtered.length === 0 ? (
            <div style={{ padding: 12, fontSize: 13, color: C.textMuted, textAlign: "center" }}>No results found</div>
          ) : (
            filtered.map((o) => (
              <div key={o.value} onClick={() => { onChange(o.value); setOpen(false); setSearch(""); }} style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600, color: o.value === value ? C.primary : C.textMain, background: o.value === value ? C.primaryTint : "transparent", cursor: "pointer", borderBottom: `1px solid ${C.borderLgt}`, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "background .1s" }} onMouseEnter={(e) => { if (o.value !== value) e.currentTarget.style.background = "#f9fafb"; }} onMouseLeave={(e) => { e.currentTarget.style.background = o.value === value ? C.primaryTint : "transparent"; }}>
                {o.label}
                {o.value === value && <Check style={{ width: 14, height: 14, color: C.primary }} strokeWidth={3} />}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// USER MISSED CARD & FILTER PILL & SHIMMER
// ─────────────────────────────────────────────
const UserMissedCard: React.FC<{ user: MissedUserRow; open: boolean; onOpenChange: (open: boolean) => void; }> = ({ user, open, onOpenChange }) => (
  <div style={{ overflow: "hidden", borderRadius: 12, border: "1px solid rgba(218,119,86,0.4)", background: "rgba(218,119,86,0.06)", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
    <button type="button" onClick={() => onOpenChange(!open)} style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 20px", textAlign: "left", background: "transparent", border: "none", cursor: "pointer", transition: "background .15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(218,119,86,0.10)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
      <div style={{ minWidth: 0, flex: 1, textAlign: "left" }}>
        <p style={{ fontWeight: 700, color: C.textMain, margin: 0, fontSize: 14 }}>{user.name}</p>
        {user.email && <p style={{ margin: "2px 0 0", fontSize: 13, color: C.textMuted }}>{user.email}</p>}
        {user.department && (
          <span style={{ marginTop: 8, display: "inline-flex", borderRadius: 6, border: "1px solid rgba(218,119,86,0.22)", background: "#fff", padding: "2px 8px", fontSize: 11, fontWeight: 600, color: C.textMain }}>
            {user.department}
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{ borderRadius: 999, background: C.primary, padding: "6px 12px", fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap" }}>
          {user.missedCount} missed
        </span>
        <ChevronDown style={{ width: 20, height: 20, color: C.textMuted, transition: "transform .2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </div>
    </button>
    <div style={{ maxHeight: open ? 2000 : 0, overflow: "hidden", transition: "max-height .25s ease" }}>
      <div style={{ borderTop: "1px solid rgba(218,119,86,0.2)", background: "#fff", padding: "12px 20px" }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.textMuted }}>Missed KPIs</p>
        {user.entries.length === 0 ? (
          <p style={{ fontSize: 13, color: "#a3a3a3", margin: 0, padding: "8px 0" }}>No missed KPI details available.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
            {user.entries.map((e) => (
              <li key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, borderRadius: 8, border: `1px solid ${C.primaryBord}`, background: "#fff", padding: "8px 12px", fontSize: 13 }}>
                <span style={{ fontWeight: 500, color: C.textMain }}>{e.kpiName}</span>
                {e.missedOn && <span style={{ fontSize: 11, color: C.textMuted, flexShrink: 0 }}>{e.missedOn}</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </div>
);

const FilterPill: React.FC<{ label: string; onClear: () => void }> = ({ label, onClear }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, paddingLeft: 12, paddingRight: 6, paddingTop: 4, paddingBottom: 4, fontSize: 11, fontWeight: 700, border: `1px solid ${C.primaryBord}`, background: C.primaryTint, color: C.primary }}>
    {label}
    <button onClick={onClear} style={{ display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 999, padding: 2, border: "none", background: "transparent", cursor: "pointer", color: C.primary }} onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(218,119,86,0.20)")} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
      <X style={{ width: 12, height: 12 }} />
    </button>
  </span>
);

const Shimmer: React.FC<{ w?: string; h?: number }> = ({ w = "100%", h = 16 }) => (
  <div style={{ width: w, height: h, borderRadius: 8, background: "linear-gradient(90deg, #e5e1d8 25%, #f0ece5 50%, #e5e1d8 75%)", backgroundSize: "200% 100%", animation: "me-shimmer 1.4s infinite" }} />
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const MissedEntitiesTab: React.FC = () => {
  const [search, setSearch] = useState("");
  const [groupByDept, setGroupByDept] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const [lookbackDays, setLookbackDays] = useState("30");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState("all");
  const [selectedKpiId, setSelectedKpiId] = useState("all");

  const [userRows, setUserRows] = useState<MissedUserRow[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [kpis, setKpis] = useState<KpiOption[]>([]);

  const [loadingEntries, setLoadingEntries] = useState(true); // Start loading immediately
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // 1. DYNAMIC INITIAL LOAD (Filters & Data simultaneously)
  useEffect(() => {
    // Fetch options silently
    Promise.allSettled([fetchUsers(), fetchDepartments(), fetchKpis()]).then(
      ([uRes, dRes, kRes]) => {
        if (uRes.status === "fulfilled") setUsers(uRes.value);
        if (dRes.status === "fulfilled") setDepartments(dRes.value);
        if (kRes.status === "fulfilled") setKpis(kRes.value);
        setLoadingFilters(false);
      }
    );
  }, []);

  const loadMissedEntries = useCallback(async () => {
    setLoadingEntries(true);
    setApiError(null);
    try {
      const data = await fetchMissedEntries({
        lookbackDays,
        departmentId: selectedDepartmentId,
        assigneeId: selectedUserId,
      });
      setUserRows(data);
    } catch (err: any) {
      console.error("API Error: ", err.message);
      setApiError(err.message ?? "Failed to load missed entries. Please check your baseUrl.");
    } finally {
      setLoadingEntries(false);
    }
  }, [lookbackDays, selectedDepartmentId, selectedUserId]);

  // 2. Trigger fetch exactly when filters change or mount occurs
  useEffect(() => {
    loadMissedEntries();
  }, [loadMissedEntries]);

  // ── Dropdown options ──
  const departmentOptions: SelectOption[] = useMemo(() => [
    { value: "all", label: "All Departments" },
    ...departments.map((d) => ({ value: d.id, label: d.name })),
  ], [departments]);

  const userOptions: SelectOption[] = useMemo(() => [
    { value: "all", label: "All Users" },
    ...users.map((u) => ({ value: u.id, label: u.name })),
  ], [users]);

  const kpiOptions: SelectOption[] = useMemo(() => [
    { value: "all", label: "All KPIs" },
    ...kpis.map((k) => ({ value: k.id, label: k.name })),
  ], [kpis]);

  const lookbackOptions: SelectOption[] = [
    { value: "7", label: "Last 7 days" },
    { value: "30", label: "Last 30 days" },
    { value: "60", label: "Last 60 days" },
    { value: "90", label: "Last 90 days" },
  ];

  // Client Filter
  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return userRows.filter((u) => {
      const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.entries.some((e) => e.kpiName.toLowerCase().includes(q));
      const matchesKpi = selectedKpiId === "all" || u.entries.some((e) => {
        const kpiName = kpis.find((k) => k.id === selectedKpiId)?.name ?? "";
        return e.kpiName === kpiName;
      });
      return matchesSearch && matchesKpi;
    });
  }, [search, selectedKpiId, userRows, kpis]);

  const totalMissed = useMemo(() => filteredUsers.reduce((acc, u) => acc + u.missedCount, 0), [filteredUsers]);
  const lookbackLabel = lookbackOptions.find((o) => o.value === lookbackDays)?.label ?? `${lookbackDays} days`;

  const groupedByDept = useMemo(() => {
    const map = new Map<string, MissedUserRow[]>();
    for (const u of filteredUsers) {
      const key = u.department || "Unassigned";
      const list = map.get(key) ?? [];
      list.push(u);
      map.set(key, list);
    }
    return map;
  }, [filteredUsers]);

  const hasActiveFilters = selectedDepartmentId !== "all" || selectedUserId !== "all" || selectedKpiId !== "all" || lookbackDays !== "30";

  const clearAllFilters = () => {
    setSelectedDepartmentId("all");
    setSelectedUserId("all");
    setSelectedKpiId("all");
    setLookbackDays("30");
    setSearch("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        @keyframes me-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
        @keyframes me-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* ── Summary Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <div style={{ borderRadius: 16, border: "1px solid rgba(244,63,94,0.25)", background: "rgba(255,241,242,0.9)", padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", margin: 0 }}>Total Missed Entries</p>
              <p style={{ margin: "4px 0 0", fontSize: 36, fontWeight: 700, lineHeight: 1, color: C.textMain }}>{loadingEntries ? "—" : totalMissed}</p>
            </div>
            <span style={{ display: "inline-flex", width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(244,63,94,0.12)", flexShrink: 0 }}>
              <AlertCircle style={{ width: 22, height: 22, color: "#e11d48" }} />
            </span>
          </div>
        </div>

        <div style={{ borderRadius: 16, border: "1px solid rgba(16,185,129,0.25)", background: "rgba(236,253,245,0.9)", padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", margin: 0 }}>Users with Missed Entries</p>
              <p style={{ margin: "4px 0 0", fontSize: 36, fontWeight: 700, lineHeight: 1, color: C.textMain }}>{loadingEntries ? "—" : filteredUsers.length}</p>
            </div>
            <span style={{ display: "inline-flex", width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(16,185,129,0.12)", flexShrink: 0 }}>
              <Users style={{ width: 22, height: 22, color: "#059669" }} />
            </span>
          </div>
        </div>

        <div style={{ borderRadius: 16, border: "1px solid rgba(14,165,233,0.25)", background: "rgba(240,249,255,0.9)", padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#6b7280", margin: 0 }}>Lookback Period</p>
              <p style={{ margin: "4px 0 0", fontSize: 26, fontWeight: 700, lineHeight: 1.2, color: "#0c4a6e" }}>{lookbackLabel}</p>
            </div>
            <span style={{ display: "inline-flex", width: 44, height: 44, alignItems: "center", justifyContent: "center", borderRadius: 999, background: "rgba(14,165,233,0.12)", flexShrink: 0 }}>
              <CalendarDays style={{ width: 22, height: 22, color: "#0284c7" }} />
            </span>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{ borderRadius: 12, border: `1px solid ${C.primaryBord}`, background: C.primaryTint, padding: 20, boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Filter style={{ width: 18, height: 18, color: C.primary }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.textMain }}>Filters</span>
          </div>
          <button onClick={loadMissedEntries} title="Refresh" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 10, border: `1px solid ${C.primaryBord}`, background: "#fff", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "background .15s" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#f9f5f3")} onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
            <RefreshCw style={{ width: 15, height: 15, color: C.primary, animation: loadingEntries ? "me-spin 1s linear infinite" : "none" }} />
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 200px", minWidth: 200 }}>
            <Search style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: "#9ca3af", pointerEvents: "none" }} />
            <input type="search" placeholder="Search user or KPI…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: "100%", border: `1px solid ${C.primaryBord}`, borderRadius: 10, padding: "8px 12px 8px 34px", fontSize: 13, color: C.textMain, background: C.surfaceInput, outline: "none", boxSizing: "border-box", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", transition: "border-color .15s, box-shadow .15s" }} onFocus={(e) => { e.currentTarget.style.borderColor = C.primary; e.currentTarget.style.boxShadow = `0 0 0 3px rgba(218,119,86,0.15)`; }} onBlur={(e) => { e.currentTarget.style.borderColor = C.primaryBord; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }} />
          </div>
          <SearchableSelect value={selectedDepartmentId} onChange={setSelectedDepartmentId} options={departmentOptions} placeholder="All Departments" loading={loadingFilters} />
          <SearchableSelect value={selectedUserId} onChange={setSelectedUserId} options={userOptions} placeholder="All Users" loading={loadingFilters} />
          <SearchableSelect value={selectedKpiId} onChange={setSelectedKpiId} options={kpiOptions} placeholder="All KPIs" loading={loadingFilters} />
          <SearchableSelect value={lookbackDays} onChange={setLookbackDays} options={lookbackOptions} placeholder="Lookback Period" />
        </div>

        {hasActiveFilters && (
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: C.textMuted }}>Active:</span>
            {selectedDepartmentId !== "all" && <FilterPill label={`Dept: ${departmentOptions.find((d) => d.value === selectedDepartmentId)?.label ?? selectedDepartmentId}`} onClear={() => setSelectedDepartmentId("all")} />}
            {selectedUserId !== "all" && <FilterPill label={`User: ${userOptions.find((u) => u.value === selectedUserId)?.label ?? selectedUserId}`} onClear={() => setSelectedUserId("all")} />}
            {selectedKpiId !== "all" && <FilterPill label={`KPI: ${kpiOptions.find((k) => k.value === selectedKpiId)?.label ?? selectedKpiId}`} onClear={() => setSelectedKpiId("all")} />}
            {lookbackDays !== "30" && <FilterPill label={lookbackLabel} onClear={() => setLookbackDays("30")} />}
            <button onClick={clearAllFilters} style={{ fontSize: 11, fontWeight: 700, color: C.textMuted, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2, padding: 0, transition: "color .15s" }} onMouseEnter={(e) => (e.currentTarget.style.color = C.primary)} onMouseLeave={(e) => (e.currentTarget.style.color = C.textMuted)}>
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* ── Error ── */}
      {apiError && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 16, border: "1px solid #fecaca", background: "#fee2e2", padding: "12px 16px", fontSize: 13, color: "#991b1b" }}>
          <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
          <span style={{ flex: 1, fontWeight: 600 }}>Failed to load: {apiError}</span>
          <button onClick={loadMissedEntries} style={{ display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 10, border: "1px solid #fecaca", background: "#fff", padding: "6px 12px", fontSize: 11, fontWeight: 700, color: "#991b1b", cursor: "pointer" }} onMouseEnter={(e) => (e.currentTarget.style.background = "#fee2e2")} onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}>
            <RefreshCw style={{ width: 13, height: 13 }} /> Retry
          </button>
        </div>
      )}

      {/* ── List ── */}
      <div>
        <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: C.textMain, margin: 0 }}>Missed Entries by User</h2>
          <button type="button" onClick={() => setGroupByDept((v) => !v)} style={{ display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 10, border: groupByDept ? `1px solid ${C.primary}` : `1px solid ${C.primaryBord}`, background: groupByDept ? C.primary : "#fff", color: groupByDept ? "#fff" : C.textMain, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", transition: "all .15s" }} onMouseEnter={(e) => { if (!groupByDept) e.currentTarget.style.background = "#f3ebe8"; }} onMouseLeave={(e) => { if (!groupByDept) e.currentTarget.style.background = "#fff"; }}>
            <Layers style={{ width: 15, height: 15 }} />
            Group by Department
          </button>
        </div>

        {loadingEntries ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ borderRadius: 12, border: "1px solid rgba(218,119,86,0.4)", background: "rgba(218,119,86,0.06)", padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <Shimmer w="40%" h={16} />
                <Shimmer w="60%" h={12} />
                <Shimmer w="20%" h={10} />
              </div>
            ))}
          </div>
        ) : !groupByDept ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filteredUsers.map((user) => (
              <UserMissedCard key={user.id} user={user} open={openId === user.id} onOpenChange={(o) => setOpenId(o ? user.id : null)} />
            ))}
            {filteredUsers.length === 0 && (
              <div style={{ borderRadius: 12, border: "1px dashed rgba(218,119,86,0.3)", background: "rgba(218,119,86,0.03)", padding: "48px 16px", textAlign: "center", fontSize: 13, color: C.textMuted }}>
                No missed entries match your filters.
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {Array.from(groupedByDept.entries()).map(([dept, deptUsers]) => (
              <div key={dept}>
                <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.textMuted }}>{dept}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {deptUsers.map((user) => (
                    <UserMissedCard key={user.id} user={user} open={openId === user.id} onOpenChange={(o) => setOpenId(o ? user.id : null)} />
                  ))}
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <div style={{ borderRadius: 12, border: "1px dashed rgba(218,119,86,0.3)", background: "rgba(218,119,86,0.03)", padding: "48px 16px", textAlign: "center", fontSize: 13, color: C.textMuted }}>
                No missed entries match your filters.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissedEntitiesTab;