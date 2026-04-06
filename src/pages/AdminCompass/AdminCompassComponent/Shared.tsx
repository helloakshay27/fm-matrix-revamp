/* eslint-disable react-refresh/only-export-components */
// ─────────────────────────────────────────────
// shared.jsx — API, constants, shared components
// ─────────────────────────────────────────────
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  FileText, Plus, MessageSquare, X, ChevronDown,
} from "lucide-react";

// ── API Configuration ──
export const BASE_URL = "https://fm-uat-api.lockated.com";

export const bootstrapAuthToken = (token) => {
  if (token) localStorage.setItem("auth_token", token);
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("No Auth Token — run bootstrapAuthToken() first");
  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

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

  const url = `${BASE_URL}/user_journals/daily_log?${queryParams.toString()}`;
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
  const url = `${BASE_URL}/user_journals/daily_history?${queryParams.toString()}`;
  const response = await fetch(url, { method: "GET", headers });
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  const raw = result.data ?? result;
  const arr = Array.isArray(raw) ? raw : [];
  return arr.map((entry) => ({
    id: entry.id ?? Math.random(),
    date: entry.date ?? entry.report_date ?? entry.meeting_date ?? "",
    meetingName: entry.meeting_name ?? entry.meeting ?? entry.title ?? "HOD Huddle",
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
  const url = `${BASE_URL}/user_journals/daily_meeting_report?meeting_id=${meetingId}&period=${period}`;
  const res = await fetch(url, { method: "GET", headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
};

export const fetchAnalytics = async (period = "last_7_days") => {
  const headers = getAuthHeaders();
  const url = `${BASE_URL}/user_journals/analytics?period=${period}`;
  const res = await fetch(url, { method: "GET", headers });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data ?? json;
};

export const fetchMeetingConfigs = async () => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/daily_meeting_configs`, { method: "GET", headers });
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
  const res = await fetch(`${BASE_URL}/daily_meeting_configs`, { method: "POST", headers, body: JSON.stringify(payload) });
  if (!res.ok) { const errBody = await res.text(); throw new Error(`HTTP ${res.status}: ${errBody}`); }
  return await res.json();
};

export const updateMeetingConfig = async (id, payload) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/daily_meeting_configs/${id}`, { method: "PUT", headers, body: JSON.stringify(payload) });
  if (!res.ok) { const errBody = await res.text(); throw new Error(`HTTP ${res.status}: ${errBody}`); }
  return await res.json();
};

export const deleteMeetingConfig = async (id) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/daily_meeting_configs/${id}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
};

export const fetchConfigMembers = async (configId) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/daily_meeting_configs/${configId}/members`, { method: "GET", headers });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return Array.isArray(json) ? json : (json.data ?? []);
};

export const addMembersToConfig = async (configId, memberIds) => {
  if (!memberIds || memberIds.length === 0) return;
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/daily_meeting_configs/${configId}/add_members`, {
    method: "POST", headers, body: JSON.stringify({ member_ids: memberIds }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

export const removeMemberFromConfig = async (configId, userId) => {
  const headers = getAuthHeaders();
  const res = await fetch(`${BASE_URL}/daily_meeting_configs/${configId}/remove_member?user_id=${userId}`, { method: "DELETE", headers });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};

// ── Constants ──
export const C = {
  primary: "#DA7756",
  primaryHov: "#c9674a",
  primaryBg: "#fef6f4",
  textMain: "#1a1a1a",
  borderLgt: "#e5e7eb",
  pageBg: "#f6f4ee",
};

/** Tailwind fragments — KPI module surfaces & controls (Admin Compass) */
export const kpiClass = {
  border: "border border-[rgba(218,119,86,0.22)]",
  borderSoft: "border border-[rgba(218,119,86,0.18)]",
  borderStrong: "border border-[rgba(218,119,86,0.28)]",
  surfaceCard: "bg-[#faf9f6]",
  surfaceInput: "bg-[#faf9f6]",
  surfacePanel: "bg-[#fef6f4]",
  focusRing: "focus:border-[#DA7756] focus:outline-none focus:ring-2 focus:ring-[#DA7756]/25",
  focusRingSm: "focus:border-[#DA7756] focus:outline-none focus:ring-1 focus:ring-[#DA7756]/25",
  checkbox:
    "rounded border-[rgba(218,119,86,0.42)] text-[#DA7756] focus:ring-2 focus:ring-[#DA7756]/30 focus:ring-offset-0",
  btnSecondary:
    "rounded-lg border border-[rgba(218,119,86,0.3)] bg-[#fef6f4] font-semibold text-[#1a1a1a] transition-colors hover:bg-[#f3ebe8]",
  btnIcon:
    "rounded-lg border border-[rgba(218,119,86,0.3)] bg-[#fef6f4] text-[#DA7756] transition-colors hover:bg-[#f3ebe8]",
  btnDanger:
    "rounded-lg border border-red-200/80 bg-[#fff5f3] text-red-600 transition-colors hover:bg-red-100/60",
};

export const datesData = [
  { id: 1, dateNum: "24", day: "TUE", monthYear: "Mar, 2026", status: "missed", label: "Miss" },
  { id: 2, dateNum: "25", day: "WED", monthYear: "Mar, 2026", status: "missed", label: "Miss" },
  { id: 3, dateNum: "26", day: "THU", monthYear: "Mar, 2026", status: "done", label: "Done" },
  { id: 4, dateNum: "27", day: "FRI", monthYear: "Mar, 2026", status: "done", label: "Done" },
  { id: 5, dateNum: "28", day: "SAT", monthYear: "Mar, 2026", status: "holiday", label: "Holiday" },
  { id: 6, dateNum: "29", day: "SUN", monthYear: "Mar, 2026", status: "holiday", label: "Holiday" },
  { id: 7, dateNum: "30", day: "MON", monthYear: "Mar, 2026", status: "missed", label: "Miss" },
  { id: 8, dateNum: "31", day: "TUE", monthYear: "Mar, 2026", status: "missed", label: "Miss" },
  { id: 9, dateNum: "01", day: "WED", monthYear: "Apr, 2026", status: "upcoming", label: "" },
  { id: 10, dateNum: "02", day: "THU", monthYear: "Apr, 2026", status: "upcoming", label: "" },
  { id: 11, dateNum: "03", day: "FRI", monthYear: "Apr, 2026", status: "upcoming", label: "" },
];

export const failedMembers = ["Adhip Shetty", "Fatema Tashrifwala", "Akshay Shinde", "Arun Mohan"];

export const detailedReports = [
  {
    id: 1, user: "Bilal Shaikh", email: "bilal.shaikh@lockated.com",
    dept: "Engineering", timestamp: "Apr 1, 9:41 AM", score: 39,
    kpiStats: [{ label: "KPI", val: "0/20" }, { label: "Tasks", val: "15/25" }],
    tasksAndIssues: [{ id: 101, text: "Fix Banner", type: "task", done: false }],
    accomplishments: [{ id: 201, text: "IOS Release", done: true }],
    plans: [{ id: 301, text: "Work on Admin Module" }],
  },
];

export const fullMonthNames = { Jan: "January", Feb: "February", Mar: "March", Apr: "April", May: "May" };

export const statusColors = {
  missed: { bg: "#fee2e2", border: "#fca5a5", text: "#ef4444" },
  done: { bg: "#dcfce7", border: "#bbf7d0", text: "#22c55e" },
  holiday: { bg: "#ffedd5", border: "#fed7aa", text: "#f97316" },
  upcoming: { bg: "#f3f4f6", border: "#e5e7eb", text: "#9ca3af" },
};

export const departmentOptions = [
  { id: "1", label: "Accounts" }, { id: "2", label: "Business Excellence" },
  { id: "3", label: "Client Servicing" }, { id: "4", label: "Design" },
  { id: "5", label: "Engineering" }, { id: "6", label: "HR" },
  { id: "7", label: "Product" }, { id: "8", label: "QA" }, { id: "9", label: "Sales" },
];

export const meetingOptions = [
  { id: "1", label: "HOD Huddle" },
  { id: "2", label: "General Standup" },
];

export const periodOptions = [
  { value: "last_7_days", label: "Last 7 Days" },
  { value: "last_30_days", label: "Last 30 Days" },
  { value: "last_90_days", label: "Last 3 Months" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
];

export const ALL_USERS = [
  { id: 1, name: "Adhip Shetty", email: "adhip.shetty@lockated.com" },
  { id: 2, name: "Akshay Shinde", email: "akshay.shinde@lockated.com" },
  { id: 3, name: "Akshit Baid", email: "akshit.baid@lockated.com" },
  { id: 4, name: "Arun Mohan", email: "arun.mohan@lockated.com" },
  { id: 5, name: "Jyoti", email: "hr@lockated.com" },
  { id: 6, name: "Kshitij Rasal", email: "kshitij.rasal@lockated.com" },
  { id: 7, name: "Mahendra Lungare", email: "mahendra.lungare@lockated.com" },
  { id: 8, name: "Manav Gandhi", email: "oebusinessteams1@lockated.com" },
  { id: 9, name: "Punit Jain", email: "punit.jain@lockated.com" },
  { id: 10, name: "Ravi Sampat", email: "ravi.sampat@lockated.com" },
  { id: 11, name: "Sadanand Gupta", email: "sadanand.gupta@lockated.com" },
  { id: 12, name: "Yash Rathod", email: "yash.rathod@lockated.com" },
];

// ── Shared UI Components ──
export const SectionCard = ({ children, className = "" }) => (
  <Card className={cn("rounded-2xl border shadow-sm border-[rgba(218,119,86,0.18)] bg-[rgba(218,119,86,0.05)] p-4 sm:p-5", className)}>
    {children}
  </Card>
);

export const BtnPrimary = ({ children, onClick, className = "", type = "button" as "button" | "submit" | "reset", icon: Icon }) => (
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