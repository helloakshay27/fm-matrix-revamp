/* eslint-disable react-refresh/only-export-components */
// ─────────────────────────────────────────────
// shared.jsx — API, constants, shared components
// ─────────────────────────────────────────────
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FileText, Plus, MessageSquare, X, ChevronDown } from "lucide-react";

export const getBaseUrl = () => {
  let url = localStorage.getItem("baseUrl") ?? "";
  url = url.trim().replace(/\/+$/, ""); // trailing slash hatao
  if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
};

export const bootstrapAuthToken = (token) => {
  if (token) localStorage.setItem("token", token);
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No Auth Token — run bootstrapAuthToken() first");
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ── Normalizers ──
export const normalizeLog = (raw) => ({
  id: raw.id ?? Math.random(),
  date: raw.date ?? raw.report_date ?? raw.created_at ?? "",
  user: raw.user ?? raw.name ?? raw.full_name ?? raw.employee_name ?? raw.username ?? "Unknown User",
  email: raw.email ?? raw.user_email ?? raw.employee_email ?? "N/A",
  score: raw.score ?? raw.total_score ?? raw.kpi_score ?? raw.performance_score ?? 0,
  dept: raw.dept ?? raw.department ?? raw.department_name ?? raw.team ?? "General",
  highlights: raw.highlights ?? raw.summary ?? (raw.accomplishments_count ? `${raw.accomplishments_count} accomplishments` : "No highlights"),
  submittedAt: raw.submittedAt ?? raw.submitted_at ?? raw.created_at ?? raw.submission_time ?? "Pending",
  _raw: raw,
});

// ── API Functions ──
export const fetchDailyLogsFromAPI = async ({ meetingId, dateStr, isGrouped, departmentId = "", search = "" }) => {
  const headers = getAuthHeaders();
  const queryParams = new URLSearchParams({ meeting_id: meetingId || "1", date: dateStr });
  if (isGrouped) queryParams.append("group_by_dept", "true");
  if (departmentId) queryParams.append("department_id", departmentId);
  if (search.trim()) queryParams.append("search", search.trim());

  const url = `${getBaseUrl()}/user_journals/daily_log?${queryParams.toString()}`;
  const response = await fetch(url, { method: "GET", headers });
  if (response.status === 404) return isGrouped ? {} : [];
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const result = await response.json();
  if (isGrouped) {
    const payload = result.data ?? result;
    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const normalized = {};
      Object.entries(payload).forEach(([dept, logs]) => {
        normalized[dept] = Array.isArray(logs) ? logs.map(normalizeLog) : [];
      });
      return normalized;
    }
    return {};
  }
  const raw = result.data ?? result;
  return Array.isArray(raw) ? raw.map(normalizeLog) : [];
};

export const fetchDailyHistoryFromAPI = async ({ meetingId = "1", weeks = 4 }) => {
  const headers = getAuthHeaders();
  const queryParams = new URLSearchParams({ meeting_id: meetingId, weeks: String(weeks) });
  const url = `${getBaseUrl()}/user_journals/daily_history?${queryParams.toString()}`;
  const response = await fetch(url, { method: "GET", headers });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  const raw = result.data ?? result;
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((entry) => ({
    id: entry.id ?? Math.random(),
    date: entry.date ?? entry.report_date ?? entry.meeting_date ?? "",
    meetingName: entry.meeting_name ?? entry.meeting ?? entry.title ?? "",
    status: entry.status ?? entry.meeting_status ?? "completed",
    submittedAt: entry.submitted_at ?? entry.submittedAt ?? entry.created_at ?? "",
    attendees: entry.attendees_count ?? entry.attendees ?? entry.total_members ?? 0,
    submittedCount: entry.submitted_count ?? entry.reports_submitted ?? 0,
    missedCount: entry.missed_count ?? entry.reports_missed ?? 0,
    totalMembers: entry.total_members ?? entry.team_size ?? 0,
    meetingNotes: entry.meeting_notes ?? entry.notes ?? entry.remarks ?? "",
    _raw: entry,
  }));
};

export const fetchMeetingReport = async ({ meetingId = "1", period = "last_7_days" }) => {
  const headers = getAuthHeaders();
  const url = `${getBaseUrl()}/user_journals/daily_meeting_report?meeting_id=${meetingId}&period=${period}`;
  const res = await fetch(url, { method: "GET", headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
};

export const fetchAnalytics = async (period = "last_7_days") => {
  const headers = getAuthHeaders();
  const url = `${getBaseUrl()}/user_journals/analytics?period=${period}`;
  const res = await fetch(url, { method: "GET", headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
};

export const fetchMeetingConfigs = async () => {
  const headers = getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs`, { method: "GET", headers });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json) ? json : (json.data ?? json.daily_meeting_configs ?? []);
  return arr.map((c) => ({
    id: c.id,
    name: c.name ?? "Unnamed",
    meetingTime: c.meeting_time ?? c.time ?? "",
    meetingDays: Array.isArray(c.meeting_days) ? c.meeting_days : [],
    isDefault: c.is_default ?? false,
    meetingHeadId: c.meeting_head?.id ?? c.meeting_head_id ?? null,
    meetingHead: c.meeting_head?.name ?? c.head_name ?? null,
    departmentId: c.department?.id ?? c.department_id ?? null,
    department: c.department?.name ?? c.department_name ?? null,
    memberIds: Array.isArray(c.member_ids) ? c.member_ids : [],
    members: Array.isArray(c.members) ? c.members : [],
    _raw: c,
  }));
};

export const createMeetingConfig = async (payload) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs`, { method: "POST", headers, body: JSON.stringify(payload) });
  if (!res.ok) { const errBody = await res.text(); throw new Error(`HTTP ${res.status}: ${errBody}`); }
  return await res.json();
};

export const updateMeetingConfig = async (id, payload) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs/${id}`, { method: "PUT", headers, body: JSON.stringify(payload) });
  if (!res.ok) { const errBody = await res.text(); throw new Error(`HTTP ${res.status}: ${errBody}`); }
  return await res.json();
};

export const deleteMeetingConfig = async (id) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs/${id}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
};

export const fetchConfigMembers = async (configId) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs/${configId}/members`, { method: "GET", headers });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data ?? []);
};

export const addMembersToConfig = async (configId, memberIds) => {
  if (!memberIds || memberIds.length === 0) return;
  const headers = getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs/${configId}/add_members`, {
    method: "POST", headers, body: JSON.stringify({ member_ids: memberIds }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

export const removeMemberFromConfig = async (configId, userId) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs/${configId}/remove_member?user_id=${userId}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

// ── Dynamic Data Fetchers (previously static arrays) ──

/** Replaces static `datesData` — fetches meeting calendar dates */
export const fetchMeetingDates = async ({ meetingId = "1", weeks = 2 } = {}) => {
  const headers = getAuthHeaders();
  const url = `${getBaseUrl()}/user_journals/meeting_dates?meeting_id=${meetingId}&weeks=${weeks}`;
  const res = await fetch(url, { method: "GET", headers });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json) ? json : (json.data ?? []);
  return arr.map((d, i) => ({
    id: d.id ?? i + 1,
    dateNum: d.date_num ?? d.day_number ?? new Date(d.date).getDate().toString().padStart(2, "0"),
    day: d.day ?? d.day_name ?? new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
    monthYear: d.month_year ?? new Date(d.date).toLocaleDateString("en-US", { month: "short", year: "numeric" }).replace(" ", ", "),
    status: d.status ?? "upcoming",
    label: d.label ?? d.status_label ?? "",
    fullDate: d.date ?? d.full_date ?? "",
    _raw: d,
  }));
};

/** Replaces static `failedMembers` — fetches members who missed a meeting on a date */
export const fetchMissedMembers = async ({ meetingId = "1", dateStr }) => {
  const headers = getAuthHeaders();
  const url = `${getBaseUrl()}/user_journals/missed_members?meeting_id=${meetingId}&date=${dateStr}`;
  const res = await fetch(url, { method: "GET", headers });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json) ? json : (json.data ?? []);
  return arr.map((m) => m.name ?? m.full_name ?? m.employee_name ?? m.username ?? "Unknown");
};

/** Replaces static `departmentOptions` — fetches departments from API */
export const fetchDepartments = async () => {
  const headers = getAuthHeaders();
  const res = await fetch(`${getBaseUrl()}/departments`, { method: "GET", headers });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json) ? json : (json.data ?? json.departments ?? []);
  return arr.map((d) => ({
    id: String(d.id),
    label: d.name ?? d.department_name ?? d.label ?? "Unnamed",
    _raw: d,
  }));
};

/** Replaces static `ALL_USERS` — fetches all users/employees from API */
export const fetchAllUsers = async ({ search = "", departmentId = "" } = {}) => {
  const headers = getAuthHeaders();
  const queryParams = new URLSearchParams();
  if (search.trim()) queryParams.append("search", search.trim());
  if (departmentId) queryParams.append("department_id", departmentId);
  const url = `${getBaseUrl()}/users?${queryParams.toString()}`;
  const res = await fetch(url, { method: "GET", headers });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const arr = Array.isArray(json) ? json : (json.data ?? json.users ?? []);
  return arr.map((u) => ({
    id: u.id,
    name: u.name ?? u.full_name ?? u.employee_name ?? u.username ?? "Unknown",
    email: u.email ?? u.user_email ?? u.employee_email ?? "N/A",
    department: u.department ?? u.department_name ?? "",
    _raw: u,
  }));
};

/** Replaces static `meetingOptions` — derived from fetchMeetingConfigs */
export const fetchMeetingOptions = async () => {
  const configs = await fetchMeetingConfigs();
  return configs.map((c) => ({ id: String(c.id), label: c.name }));
};

/** Replaces static `detailedReports` — fetches a single user's detailed daily report */
export const fetchDetailedReport = async ({ meetingId = "1", dateStr, userId }) => {
  const headers = getAuthHeaders();
  const queryParams = new URLSearchParams({ meeting_id: meetingId, date: dateStr });
  if (userId) queryParams.append("user_id", userId);
  const url = `${getBaseUrl()}/user_journals/detailed_report?${queryParams.toString()}`;
  const res = await fetch(url, { method: "GET", headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  const raw = json.data ?? json;
  if (!raw) return null;
  return {
    id: raw.id ?? Math.random(),
    user: raw.user ?? raw.name ?? raw.full_name ?? "Unknown",
    email: raw.email ?? raw.user_email ?? "N/A",
    dept: raw.dept ?? raw.department ?? raw.department_name ?? "General",
    timestamp: raw.timestamp ?? raw.submitted_at ?? raw.created_at ?? "",
    score: raw.score ?? raw.total_score ?? 0,
    kpiStats: Array.isArray(raw.kpi_stats) ? raw.kpi_stats : [],
    tasksAndIssues: Array.isArray(raw.tasks_and_issues) ? raw.tasks_and_issues : (Array.isArray(raw.tasks) ? raw.tasks : []),
    accomplishments: Array.isArray(raw.accomplishments) ? raw.accomplishments : [],
    plans: Array.isArray(raw.plans) ? raw.plans : (Array.isArray(raw.tomorrow_plans) ? raw.tomorrow_plans : []),
    _raw: raw,
  };
};

// ── UI-only Constants (not data — safe to keep) ──
export const C = {
  primary: "#DA7756",
  primaryHov: "#c9674a",
  primaryBg: "#fef6f4",
  textMain: "#1a1a1a",
  borderLgt: "#e5e7eb",
  pageBg: "#f6f4ee",
};

export const kpiClass = {
  border: "border border-[rgba(218,119,86,0.22)]",
  borderSoft: "border border-[rgba(218,119,86,0.18)]",
  borderStrong: "border border-[rgba(218,119,86,0.28)]",
  surfaceCard: "bg-[#faf9f6]",
  surfaceInput: "bg-[#faf9f6]",
  surfacePanel: "bg-[#fef6f4]",
  focusRing: "focus:border-[#DA7756] focus:outline-none focus:ring-2 focus:ring-[#DA7756]/25",
  focusRingSm: "focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756]/25",
  checkbox: "rounded border-[rgba(218,119,86,0.42)] text-[#DA7756] focus:ring-2 focus:ring-[#DA7756]/30 focus:ring-offset-0",
  btnSecondary: "rounded-lg border border-[rgba(218,119,86,0.3)] bg-[#fef6f4] font-semibold text-[#1a1a1a] transition-colors hover:bg-[#f3ebe8]",
  btnIcon: "rounded-lg border border-[rgba(218,119,86,0.3)] bg-[#fef6f4] text-[#DA7756] transition-colors hover:bg-[#f3ebe8]",
  btnDanger: "rounded-lg border border-red-200/80 bg-[#fff5f3] text-red-600 transition-colors hover:bg-red-100/60",
};

export const fullMonthNames = {
  Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May",
  Jun: "June", Jul: "July", Aug: "August", Sep: "September", Oct: "October",
  Nov: "November", Dec: "December",
};

export const statusColors = {
  missed:   { bg: "#fee2e2", border: "#fca5a5", text: "#ef4444" },
  done:     { bg: "#dcfce7", border: "#bbf7d0", text: "#22c55e" },
  holiday:  { bg: "#ffedd5", border: "#fed7aa", text: "#f97316" },
  upcoming: { bg: "#f3f4f6", border: "#e5e7eb", text: "#9ca3af" },
};

export const periodOptions = [
  { value: "last_7_days",  label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "last_90_days", label: "Last 3 Months" },
  { value: "this_month",   label: "This Month" },
  { value: "last_month",   label: "Last Month" },
];

// ── Shared UI Components ──
export const SectionCard = ({ children, className = "" }) => (
  <Card className={cn("rounded-2xl border shadow-sm border-[rgba(218,119,86,0.18)] bg-[rgba(218,119,86,0.05)] p-4 sm:p-5", className)}>
    {children}
  </Card>
);

export const BtnPrimary = ({ children, onClick, className = "", type = "button", icon: Icon }) => (
  <button type={type} onClick={onClick} className={cn("inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#DA7756] text-white shadow-sm hover:bg-[#c9674a] active:scale-[0.97] transition-all duration-150", className)}>
    {Icon && <Icon className="w-4 h-4" />} {children}
  </button>
);

export const BtnOutline = ({ children, onClick, className = "", icon: Icon, iconClass = "" }) => (
  <button onClick={onClick} className={cn("inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-white border border-[rgba(218,119,86,0.25)] text-neutral-700 shadow-sm hover:bg-[#fef6f4] hover:border-[rgba(218,119,86,0.45)] active:scale-[0.97] transition-all duration-150", className)}>
    {Icon && <Icon className={cn("w-4 h-4", iconClass)} />} {children}
  </button>
);

export const BtnIcon = ({ onClick, children, className = "", title = "", disabled = false }) => (
  <button disabled={disabled} onClick={onClick} title={title} className={cn("inline-flex items-center justify-center w-8 h-8 rounded-xl bg-white border border-[rgba(218,119,86,0.22)] text-neutral-500 shadow-sm transition-all duration-150", disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fef6f4] hover:text-[#DA7756] active:scale-[0.95]", className)}>
    {children}
  </button>
);

export const BtnPurple = ({ children, onClick, className = "", icon: Icon }) => (
  <button onClick={onClick} className={cn("inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#DA7756] text-white shadow-sm hover:bg-[#c9674a] active:scale-[0.97] transition-all duration-150", className)}>
    {Icon && <Icon className="w-4 h-4" />} {children}
  </button>
);

export const BtnDanger = ({ children, onClick, className = "", icon: Icon }) => (
  <button onClick={onClick} className={cn("inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-white border border-red-200 text-red-600 shadow-sm hover:bg-red-50 active:scale-[0.97] transition-all duration-150", className)}>
    {Icon && <Icon className="w-4 h-4" />} {children}
  </button>
);

export const getInitials = (name) => {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
};