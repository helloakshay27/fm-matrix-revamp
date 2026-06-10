import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  X,
  Send,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./BusinessCompass.css";
import { getBaseUrl, getToken, getUser } from "@/utils/auth";

// ── Types ──────────────────────────────────────────────────────────────────
interface CriticalNumber {
  id: number;
  name: string;
  frequency_label: string;
  current_value: number;
  target_value: number;
  unit: string;
  progress_percentage: number;
}

interface TopStuckIssue {
  id: number;
  title: string;
  status: string;
  priority: string;
  responsible_person: string;
  due_date: string;
  updated_at: string;
}

interface BusinessHealthComponents {
  kpi: { percentage: number; count: number };
  issues: { count: number };
  systems: { healthy: number; total: number; average_health_score: number };
  goals: { achieved: number; total: number; percentage: number };
}

interface DashboardData {
  success: boolean;
  data: {
    profile: {
      user_name: string;
      organization_name: string;
      department: string;
      designation: string;
    };
    critical_numbers: { total: number; items: CriticalNumber[] };
    business_health_score: {
      score: number;
      out_of: number;
      label: string;
      components: BusinessHealthComponents;
    };
    top_stuck_issues: { total: number; items: TopStuckIssue[] };
    latest_team_chat: { total: number; items: any[] };
    hall_of_fame: { items: any[] };
    counters: {
      daily_reports: number;
      daily_pending: number;
      kpis: number;
      weekly_reports: number;
      weekly_pending: number;
      job_descriptions: number;
    };
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(offset: number): Date[] {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatWeekLabel(dates: Date[]): string {
  if (!dates.length) return "";
  return dates[0].toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ── Day status helpers ─────────────────────────────────────────────────────
type DayStatus = "filled" | "missed" | "holiday" | "upcoming" | "none";

function getDayStatus(
  date: Date,
  today: Date,
  filledDates: Set<string>
): DayStatus {
  const isToday = date.toDateString() === today.toDateString();
  const isPast = date < today && !isToday;
  const isFuture = date > today;
  if (isToday) return "none";
  if (isFuture) return "upcoming";
  if (filledDates.has(date.toDateString())) return "filled";
  if (isPast) return "missed";
  return "none";
}

const STATUS_DOT: Record<DayStatus, string> = {
  filled: "#22c55e",
  missed: "#f87171",
  holiday: "#fbbf24",
  upcoming: "#fb923c",
  none: "transparent",
};

// ── Circle Progress ────────────────────────────────────────────────────────
function CircleProgress({
  value,
  max = 300,
  color,
  label,
}: {
  value: number;
  max?: number;
  color: string;
  label: string;
}) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-14 h-14 sm:w-[68px] sm:h-[68px]">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 68 68">
          <circle
            cx="34"
            cy="34"
            r={r}
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="7"
          />
          <circle
            cx="34"
            cy="34"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeDasharray={circ}
            strokeDashoffset={circ - pct * circ}
            strokeLinecap="round"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[13px] sm:text-[15px] font-black text-[#1a1a1a]">
          {value}
        </span>
      </div>
      <span className="text-[10px] sm:text-[11px] text-gray-500 font-semibold">
        {label}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
const BusinessCompassDashboard: React.FC = () => {
  const navigate = useNavigate();

  // ── Dashboard data ────────────────────────────────────────────────────
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [focusMode, setFocusMode] = useState<"Daily" | "Weekly">("Daily");
  const [kpiPage, setKpiPage] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dayDataLoading, setDayDataLoading] = useState(false);

  // ── AI chat ───────────────────────────────────────────────────────────
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatTab, setAiChatTab] = useState<"accomplishments" | "plan">(
    "accomplishments"
  );
  const [aiMessage, setAiMessage] = useState("");
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);
  const [aiSuggestionsOpen, setAiSuggestionsOpen] = useState(false);

  // ── Daily dynamic data ────────────────────────────────────────────────
  const [filledDates, setFilledDates] = useState<Set<string>>(new Set());
  const [accomplishments, setAccomplishments] = useState<string[]>([]);
  const [todosOverdue, setTodosOverdue] = useState<
    { title: string; id: number }[]
  >([]);
  const [todosHigh, setTodosHigh] = useState<{ title: string; id: number }[]>(
    []
  );
  const [todosLoading, setTodosLoading] = useState(false);

  // ── Weekly dynamic data ───────────────────────────────────────────────
  const [weeklyAccomplishments, setWeeklyAccomplishments] = useState<string[]>(
    []
  );
  const [weeklyTodosOverdue, setWeeklyTodosOverdue] = useState<
    { title: string; id: number }[]
  >([]);
  const [weeklyTodosHigh, setWeeklyTodosHigh] = useState<
    { title: string; id: number }[]
  >([]);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [weeklyDataFetched, setWeeklyDataFetched] = useState(false);

  const weekDates = getWeekDates(weekOffset);
  const today = new Date();

  // ── Display helpers ───────────────────────────────────────────────────
  const displayAccomplishments =
    focusMode === "Weekly" ? weeklyAccomplishments : accomplishments;
  const displayTodosOverdue =
    focusMode === "Weekly" ? weeklyTodosOverdue : todosOverdue;
  const displayTodosHigh = focusMode === "Weekly" ? weeklyTodosHigh : todosHigh;
  const displayLoading =
    focusMode === "Weekly" ? weeklyLoading : todosLoading || dayDataLoading;

  // ── Fetch data for a specific day ─────────────────────────────────────
  const fetchDayData = async (date: Date) => {
    const baseUrl = (getBaseUrl() ?? "https://fm-uat-api.lockated.com").replace(
      /\/$/,
      ""
    );
    const token = getToken();
    if (!token) return;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    setDayDataLoading(true);
    try {
      // Fetch journal for the selected date
      const jRes = await fetch(
        `${baseUrl}/user_journals.json?q[journal_type_eq]=daily&q[start_date_eq]=${dateStr}`,
        { headers }
      );
      if (jRes.ok) {
        const jData = await jRes.json();
        const journals: any[] = Array.isArray(jData)
          ? jData
          : (jData.user_journals ?? []);
        const report = journals[0];
        const rawAcc = report?.report_data?.accomplishments;
        const accItems: any[] = Array.isArray(rawAcc)
          ? rawAcc
          : Array.isArray(rawAcc?.items)
            ? rawAcc.items
            : [];
        const items: string[] = accItems
          .map((item: any) =>
            typeof item === "string" ? item : (item?.title ?? item?.text ?? "")
          )
          .filter(Boolean);
        setAccomplishments(items);
      } else {
        setAccomplishments([]);
      }

      // Fetch todos for the selected date
      const userId = (
        JSON.parse(localStorage.getItem("user") ?? "{}") as { id?: number }
      ).id;
      if (userId) {
        setTodosLoading(true);
        try {
          const todoParams = new URLSearchParams();
          todoParams.append("q[user_id_eq]", String(userId));
          todoParams.append("for_date", dateStr);
          const todoRes = await fetch(`${baseUrl}/todos.json?${todoParams}`, {
            headers,
          });
          if (todoRes.ok) {
            const todoData = await todoRes.json();
            const todos: any[] = todoData?.todos ?? [];
            const refDate = new Date(date);
            refDate.setHours(0, 0, 0, 0);
            setTodosOverdue(
              todos
                .filter((t: any) => {
                  const ds = t.target_date || t.due_date;
                  if (!ds) return false;
                  const due = new Date(ds);
                  due.setHours(0, 0, 0, 0);
                  return due < refDate;
                })
                .slice(0, 5)
                .map((t: any) => ({ title: t.title, id: t.id }))
            );
            setTodosHigh(
              todos
                .filter((t: any) => t.priority === "P1")
                .slice(0, 5)
                .map((t: any) => ({ title: t.title, id: t.id }))
            );
          }
        } catch (e) {
          console.error("Todos error:", e);
        } finally {
          setTodosLoading(false);
        }
      }
    } catch (e) {
      console.error("Day data fetch error:", e);
    } finally {
      setDayDataLoading(false);
    }
  };

  // ── Refetch day data when selectedDate changes ──────────────────────────
  useEffect(() => {
    fetchDayData(selectedDate);
  }, [selectedDate]);

  // ── Handle day click ────────────────────────────────────────────────────
  const handleDayClick = (date: Date) => {
    const isToday = date.toDateString() === today.toDateString();
    const isFuture = date > today && !isToday;
    const isSunday = date.getDay() === 0;
    if (isFuture || isSunday) return;
    setSelectedDate(new Date(date));
  };

  // ── Selected date label ─────────────────────────────────────────────────
  const selectedDateLabel = selectedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ── Main API fetch ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const baseUrl = (
          getBaseUrl() ?? "https://fm-uat-api.lockated.com"
        ).replace(/\/$/, "");
        const token = getToken();
        if (!token) return;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        // Dashboard
        const dashRes = await fetch(`${baseUrl}/business_compass/dashboard`, {
          headers,
        });
        if (dashRes.ok) setDashboardData(await dashRes.json());

        const todayStr = new Date().toISOString().split("T")[0];

        // All journals for filled calendar dates
        const allJRes = await fetch(
          `${baseUrl}/user_journals.json?q[journal_type_eq]=daily`,
          { headers }
        );
        if (allJRes.ok) {
          const allJData = await allJRes.json();
          const allJournals: any[] = Array.isArray(allJData)
            ? allJData
            : (allJData.data?.user_journals ?? allJData.user_journals ?? []);
          const dates = new Set<string>(
            allJournals.flatMap((j: any) => {
              const raw = j.journal_date || j.start_date || j.created_at;
              if (!raw) return [];
              const d = new Date(raw);
              return isNaN(d.getTime()) ? [] : [d.toDateString()];
            })
          );
          setFilledDates(dates);
        }

        // Today's journal for accomplishments
        const todayJRes = await fetch(
          `${baseUrl}/user_journals.json?q[journal_type_eq]=daily&q[start_date_eq]=${todayStr}`,
          { headers }
        );
        if (todayJRes.ok) {
          const todayJData = await todayJRes.json();
          const todayJournals: any[] = Array.isArray(todayJData)
            ? todayJData
            : (todayJData.user_journals ?? []);
          const todayReport = todayJournals[0];
          // accomplishments can be an array OR { items: [...] }
          const rawAcc = todayReport?.report_data?.accomplishments;
          const accItems: any[] = Array.isArray(rawAcc)
            ? rawAcc
            : Array.isArray(rawAcc?.items)
              ? rawAcc.items
              : [];
          const items: string[] = accItems
            .map((item: any) =>
              typeof item === "string"
                ? item
                : (item?.title ?? item?.text ?? "")
            )
            .filter(Boolean);
          setAccomplishments(items);
        }

        // Daily todos – fetch all open todos for the user (no date restriction)
        const userId = (
          JSON.parse(localStorage.getItem("user") ?? "{}") as { id?: number }
        ).id;
        if (userId) {
          setTodosLoading(true);
          try {
            const todoParams = new URLSearchParams();
            todoParams.append("q[user_id_eq]", String(userId));
            todoParams.append("q[status_not_eq]", "completed");
            const todoRes = await fetch(`${baseUrl}/todos.json?${todoParams}`, {
              headers,
            });
            if (todoRes.ok) {
              const todoData = await todoRes.json();
              const todos: any[] = todoData?.todos ?? [];
              const now = new Date();
              now.setHours(0, 0, 0, 0);
              setTodosOverdue(
                todos
                  .filter((t: any) => {
                    const dateStr = t.target_date || t.due_date;
                    if (!dateStr) return false;
                    const due = new Date(dateStr);
                    due.setHours(0, 0, 0, 0);
                    return due < now;
                  })
                  .slice(0, 5)
                  .map((t: any) => ({ title: t.title, id: t.id }))
              );
              // P1 = Urgent & Important (Eisenhower Q1)
              setTodosHigh(
                todos
                  .filter((t: any) => t.priority === "P1")
                  .slice(0, 5)
                  .map((t: any) => ({ title: t.title, id: t.id }))
              );
            }
          } catch (e) {
            console.error("Todos error:", e);
          } finally {
            setTodosLoading(false);
          }
        }
      } catch (e) {
        console.error("Dashboard fetch error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Weekly data fetch ─────────────────────────────────────────────────
  useEffect(() => {
    if (focusMode !== "Weekly" || weeklyDataFetched) return;
    (async () => {
      setWeeklyLoading(true);
      try {
        const baseUrl = (
          getBaseUrl() ?? "https://fm-uat-api.lockated.com"
        ).replace(/\/$/, "");
        const token = getToken();
        if (!token) return;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };
        const weekStart = weekDates[0].toISOString().split("T")[0];
        const weekEnd = weekDates[5].toISOString().split("T")[0];

        // Weekly journals → accomplishments
        const jParams = new URLSearchParams();
        jParams.append("q[journal_type]", "daily");
        jParams.append("q[journal_date_gteq]", weekStart);
        jParams.append("q[journal_date_lteq]", weekEnd);
        const jRes = await fetch(`${baseUrl}/user_journals.json?${jParams}`, {
          headers,
        });
        if (jRes.ok) {
          const jData = await jRes.json();
          const journals: any[] = Array.isArray(jData)
            ? jData
            : (jData.user_journals ?? []);
          const all: string[] = [];
          journals.forEach((j: any) => {
            (j?.report_data?.accomplishments?.items ?? []).forEach(
              (it: any) => {
                const txt = it.title ?? it.text ?? "";
                if (txt) all.push(txt);
              }
            );
          });
          setWeeklyAccomplishments(all);
        }

        // Weekly todos – all open todos in the week range
        const userId = (
          JSON.parse(localStorage.getItem("user") ?? "{}") as { id?: number }
        ).id;
        if (userId) {
          const todoParams = new URLSearchParams();
          todoParams.append("q[user_id_eq]", String(userId));
          todoParams.append("q[status_not_eq]", "completed");
          todoParams.append("q[target_date_gteq]", weekStart);
          todoParams.append("q[target_date_lteq]", weekEnd);
          const todoRes = await fetch(`${baseUrl}/todos.json?${todoParams}`, {
            headers,
          });
          if (todoRes.ok) {
            const todoData = await todoRes.json();
            const todos: any[] = todoData?.todos ?? [];
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            setWeeklyTodosOverdue(
              todos
                .filter((t: any) => {
                  const dateStr = t.target_date || t.due_date;
                  if (!dateStr) return false;
                  const due = new Date(dateStr);
                  due.setHours(0, 0, 0, 0);
                  return due < now;
                })
                .slice(0, 5)
                .map((t: any) => ({ title: t.title, id: t.id }))
            );
            setWeeklyTodosHigh(
              todos
                .filter((t: any) => t.priority === "P1")
                .slice(0, 5)
                .map((t: any) => ({ title: t.title, id: t.id }))
            );
          }
        }
        setWeeklyDataFetched(true);
      } catch (e) {
        console.error("Weekly data error:", e);
      } finally {
        setWeeklyLoading(false);
      }
    })();
  }, [focusMode, weeklyDataFetched, weekDates]);

  // ── Derived data ──────────────────────────────────────────────────────
  const d = dashboardData?.data;
  const health = d?.business_health_score;
  const score = health?.score ?? 0;
  const outOf = health?.out_of ?? 100;
  const scoreLabel = health?.label ?? "Needs Attention";
  const scorePct = Math.min((score / outOf) * 100, 100);
  const kpis = d?.critical_numbers?.items ?? [];
  const issues = d?.top_stuck_issues?.items ?? [];
  const counters = d?.counters;
  const profileName = useMemo(() => {
    try {
      const saved = localStorage.getItem("bc-profile-data");
      if (saved) {
        const p = JSON.parse(saved);
        if (p.displayName?.trim()) return p.displayName.trim();
      }
    } catch (_) {
      /* ignore */
    }
    const u = getUser();
    const fullName = [u?.firstname, u?.lastname]
      .filter(Boolean)
      .join(" ")
      .trim();
    return fullName || d?.profile?.user_name || "User";
  }, [d]);

  // ── Profile completion ─────────────────────────────────────────────────
  const profileComplete = useMemo(() => {
    try {
      const saved = localStorage.getItem("bc-profile-data");
      const p = saved ? JSON.parse(saved) : null;
      if (!p) return false;
      const fields = [
        p.displayName,
        p.email,
        p.jobTitle,
        p.city,
        p.state,
        p.pinCode,
        p.dob,
        p.doj,
        p.emergencyContactName,
        p.emergencyContactNumber,
      ];
      const filled = fields.filter((f: string) => f?.trim()).length;
      return filled === fields.length;
    } catch {
      return false;
    }
  }, []);

  // ── AI Summary ───────────────────────────────────────────────
  const handleGenerateAiSummary = () => {
    setAiSuggestionsOpen(true);
  };

  const issueBadgeStyle = (priority: string): React.CSSProperties => {
    const p = (priority ?? "").toLowerCase();
    if (p === "medium")
      return {
        background: "#fff",
        border: "1px solid #f59e0b",
        color: "#b45309",
      };
    if (p === "low")
      return {
        background: "#fff",
        border: "1px solid #22c55e",
        color: "#15803d",
      };
    return {
      background: "#fff",
      border: "1px solid #fca5a5",
      color: "#e05050",
    };
  };

  // ── Placeholder issues ────────────────────────────────────────────────
  const placeholderIssues = [
    "Observer Issue",
    "Permits are going for approval despite being in drafts",
    "Permits are going for approval despite being in drafts",
    "Permits are going for approval despite being in drafts",
    "Permits are going for approval despite being in drafts",
  ];

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="relative bg-white min-h-screen font-poppins">
      <div className="p-3 sm:p-4 lg:p-5">
        <h1 className="text-[18px] sm:text-[22px] font-bold text-[#1a1a1a] mb-4">
          Dashboard
        </h1>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* ══ MAIN CONTENT ════════════════════════════════════════════════ */}
          <div className="w-full lg:flex-1 lg:min-w-0 flex flex-col gap-4">
            {/* Welcome Banner */}
            <Card className="rounded-2xl border border-gray-100 bg-[#F6F4EE] shadow-sm">
              <CardContent className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-[16px] sm:text-[18px] font-bold italic text-[#1a1a1a]">
                    Welcome back {profileName}!
                  </p>
                  <p className="text-[12px] sm:text-[13px] text-gray-400 mt-0.5">
                    Here's your Weekly overview.
                  </p>
                </div>
                {!profileComplete && (
                  <Button
                    variant="outline"
                    className="self-start sm:self-auto border border-[#DA7756] bg-white text-[#DA7756] rounded-xl px-5 h-9 text-sm font-semibold hover:bg-[#fef6f4] shadow-none whitespace-nowrap"
                    onClick={() => navigate("/business-compass/profile")}
                  >
                    Complete profile
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Business Health Score */}
            <Card className="rounded-2xl border border-gray-100 bg-[#F6F4EE] shadow-sm">
              <CardContent className="px-4 sm:px-6 py-4 sm:py-5">
                <div className="flex items-start justify-between mb-8">
                  <h2 className="text-[14px] sm:text-[15px] font-bold text-[#1a1a1a]">
                    Business Health Score
                  </h2>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[12px] sm:text-[13px] font-bold text-[#1a1a1a]">
                      + {score}/{outOf}
                    </span>
                    <span className="bg-[#4ade80]/20 text-green-700 text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {scoreLabel}
                    </span>
                  </div>
                </div>

                {/* Gradient bar – 4 separate pill segments */}
                <div className="relative pt-8 mb-1 mx-1">
                  <div
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${scorePct}%`,
                      transform: "translateX(-50%)",
                      top: 0,
                    }}
                  >
                    <span
                      className="text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm"
                      style={{ backgroundColor: "#4ECDC4" }}
                    >
                      you
                    </span>
                    <div
                      style={{
                        width: 0,
                        height: 0,
                        borderLeft: "4px solid transparent",
                        borderRight: "4px solid transparent",
                        borderTop: "5px solid #4ECDC4",
                      }}
                    />
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-2.5 sm:h-3 rounded-full flex-1 bg-[#f87171]" />
                    <div className="h-2.5 sm:h-3 rounded-full flex-1 bg-[#facc15]" />
                    <div className="h-2.5 sm:h-3 rounded-full flex-1 bg-[#86efac]" />
                    <div className="h-2.5 sm:h-3 rounded-full flex-1 bg-[#2dd4bf]" />
                  </div>
                </div>
                <div className="flex justify-between text-[10px] sm:text-[11px] text-gray-400 font-medium mb-4 mt-1.5">
                  <span>Poor</span>
                  <span>Normal</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>

                {/* 4 metric cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                  <div
                    className="rounded-xl p-2.5 sm:p-3 text-center"
                    style={{
                      backgroundColor: "#eeedf8",
                      border: "1px solid #dddcf0",
                    }}
                  >
                    <div className="text-[10px] sm:text-[11px] text-gray-400 font-semibold mb-1">
                      KPI
                    </div>
                    <div className="text-[18px] sm:text-[22px] font-black text-[#1a1a1a]">
                      {health?.components?.kpi?.percentage ?? 0}%
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-2.5 sm:p-3 text-center"
                    style={{
                      backgroundColor: "#fce8e8",
                      border: "1px solid #fbcfcf",
                    }}
                  >
                    <div className="text-[10px] sm:text-[11px] text-gray-500 font-semibold mb-1">
                      Issues
                    </div>
                    <div className="text-[18px] sm:text-[22px] font-black text-[#1a1a1a]">
                      {health?.components?.issues?.count ?? 0}
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-2.5 sm:p-3 text-center"
                    style={{
                      backgroundColor: "#e8f0fe",
                      border: "1px solid #c7d9fd",
                    }}
                  >
                    <div className="text-[10px] sm:text-[11px] text-gray-500 font-semibold mb-1">
                      Systems
                    </div>
                    <div className="text-[18px] sm:text-[22px] font-black text-[#1a1a1a]">
                      {health?.components?.systems?.healthy ?? 0}/
                      {health?.components?.systems?.total ?? 0}
                    </div>
                  </div>
                  <div
                    className="rounded-xl p-2.5 sm:p-3 text-center"
                    style={{
                      backgroundColor: "#e8f4fe",
                      border: "1px solid #c7e5fd",
                    }}
                  >
                    <div className="text-[10px] sm:text-[11px] text-gray-500 font-semibold mb-1">
                      Goals
                    </div>
                    <div className="text-[18px] sm:text-[22px] font-black text-[#1a1a1a]">
                      {health?.components?.goals?.achieved ?? 0}/
                      {health?.components?.goals?.total ?? 0}
                    </div>
                  </div>
                </div>

                {/* AI suggestion bar */}
                <div
                  style={{
                    borderRadius: "16px",
                    background: "white",
                    border: "1px solid rgba(218,119,86,0.10)",
                    boxShadow:
                      "0 0 0 5px rgba(218,119,86,0.07), 0 4px 18px rgba(218,119,86,0.10)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "12px 16px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <Sparkles size={20} color="#DA7756" />
                      <span
                        style={{
                          fontSize: "13px",
                          color: "#1a1a1a",
                          fontWeight: 500,
                        }}
                      >
                        Ai suggestion to improve business score.
                      </span>
                    </div>
                    <button
                      onClick={handleGenerateAiSummary}
                      style={{
                        backgroundColor: "#DA7756",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "8px 22px",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor =
                          "#c9673f";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLButtonElement).style.backgroundColor =
                          "#DA7756";
                      }}
                    >
                      Generate
                    </button>
                  </div>
                  {aiSuggestionsOpen && (
                    <div className="ai-suggestions-expand">
                      <div className="border-t border-[#ede5de] mx-3" />

                      {/* Header */}
                      <div className="flex items-start justify-between px-3 pt-3 pb-1">
                        <div>
                          <h4 className="text-[13px] font-bold text-[#1a1a1a]">
                            AI Suggestions
                          </h4>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Implementing all suggestions could boost your score
                            by{" "}
                            <span className="font-bold text-[#DA7756]">
                              +46 pts
                            </span>{" "}
                            →{" "}
                            <span className="font-bold text-[#DA7756]">
                              121/100
                            </span>
                          </p>
                        </div>
                        <button
                          onClick={() => setAiSuggestionsOpen(false)}
                          className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 flex-shrink-0 transition-colors ml-2"
                        >
                          <X size={13} />
                        </button>
                      </div>

                      {/* 2×2 cards */}
                      <div className="grid grid-cols-2 gap-2 px-3 pb-2">
                        <div
                          className="rounded-xl p-2.5 flex flex-col gap-1"
                          style={{
                            backgroundColor: "#fce8e8",
                            border: "1px solid #fbcfcf",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#f87171]" />
                              <span className="text-[10px] font-bold text-gray-700">
                                Issues
                              </span>
                              <span
                                className="text-[9px] font-semibold px-1 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: "#ffe4e4",
                                  color: "#e05050",
                                }}
                              >
                                High
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-600 bg-white px-1 py-0.5 rounded-full">
                              +12 pts
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-[#1a1a1a] leading-snug">
                            Resolve your top 20 critical issues
                          </p>
                          <p className="text-[10px] text-gray-500 leading-relaxed">
                            Fix top 20 by severity to reduce score drag and
                            improve KPI by ~8%.
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <div className="flex items-center gap-1 text-[9px] text-gray-400">
                              <Clock size={9} />
                              <span>1–2 weeks</span>
                            </div>
                            <button className="text-[10px] font-bold text-[#DA7756] hover:underline">
                              Start &gt;
                            </button>
                          </div>
                        </div>

                        <div
                          className="rounded-xl p-2.5 flex flex-col gap-1"
                          style={{
                            backgroundColor: "#e8f0fe",
                            border: "1px solid #c7d9fd",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#60a5fa]" />
                              <span className="text-[10px] font-bold text-gray-700">
                                Systems
                              </span>
                              <span
                                className="text-[9px] font-semibold px-1 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: "#ffe4e4",
                                  color: "#e05050",
                                }}
                              >
                                High
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-600 bg-white px-1 py-0.5 rounded-full">
                              +18 pts
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-[#1a1a1a] leading-snug">
                            Connect all 6 business systems
                          </p>
                          <p className="text-[10px] text-gray-500 leading-relaxed">
                            0 of 6 systems integrated. Enables automated data
                            flow and removes reporting gaps.
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <div className="flex items-center gap-1 text-[9px] text-gray-400">
                              <Clock size={9} />
                              <span>2–3 weeks</span>
                            </div>
                            <button className="text-[10px] font-bold text-[#DA7756] hover:underline">
                              Start &gt;
                            </button>
                          </div>
                        </div>

                        <div
                          className="rounded-xl p-2.5 flex flex-col gap-1"
                          style={{
                            backgroundColor: "#edf7ed",
                            border: "1px solid #c3e6c4",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
                              <span className="text-[10px] font-bold text-gray-700">
                                Goals
                              </span>
                              <span className="text-[9px] font-semibold px-1 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                Medium
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-600 bg-white px-1 py-0.5 rounded-full">
                              +9 pts
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-[#1a1a1a] leading-snug">
                            Define and track 4 business goals
                          </p>
                          <p className="text-[10px] text-gray-500 leading-relaxed">
                            No goals set. Measurable quarterly goals improve KPI
                            tracking by up to 15%.
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <div className="flex items-center gap-1 text-[9px] text-gray-400">
                              <Clock size={9} />
                              <span>4–6 weeks</span>
                            </div>
                            <button className="text-[10px] font-bold text-[#DA7756] hover:underline">
                              Start &gt;
                            </button>
                          </div>
                        </div>

                        <div
                          className="rounded-xl p-2.5 flex flex-col gap-1"
                          style={{
                            backgroundColor: "#fff3e8",
                            border: "1px solid #fddcbc",
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#fb923c]" />
                              <span className="text-[10px] font-bold text-gray-700">
                                KPI
                              </span>
                              <span className="text-[9px] font-semibold px-1 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                Medium
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-600 bg-white px-1 py-0.5 rounded-full">
                              +7 pts
                            </span>
                          </div>
                          <p className="text-[11px] font-bold text-[#1a1a1a] leading-snug">
                            Recalibrate KPI targets to benchmarks
                          </p>
                          <p className="text-[10px] text-gray-500 leading-relaxed">
                            KPI at 59%, below 72% industry average. Benchmark
                            data can close this gap faster.
                          </p>
                          <div className="flex items-center justify-between mt-0.5">
                            <div className="flex items-center gap-1 text-[9px] text-gray-400">
                              <Clock size={9} />
                              <span>1 week</span>
                            </div>
                            <button className="text-[10px] font-bold text-[#DA7756] hover:underline">
                              Start &gt;
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="px-3 pb-3">
                        <button
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold text-white transition-opacity hover:opacity-90"
                          style={{
                            background:
                              "linear-gradient(135deg, #DA7756 0%, #c9673f 100%)",
                            boxShadow: "0 3px 12px rgba(218,119,86,0.25)",
                          }}
                        >
                          ✦ Apply all suggestions to my action plan
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Today's Focus – single card containing all 4 sub-panels */}
            <Card className="rounded-2xl border border-gray-100  bg-[#F6F4EE] shadow-sm">
              <CardContent className="p-4 sm:p-5">
                {/* Header row */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[15px] sm:text-[16px] font-bold text-[#1a1a1a]">
                    Today's Focus
                  </h3>
                  <div className="relative">
                    <select
                      value={focusMode}
                      onChange={(e) => {
                        setFocusMode(e.target.value as "Daily" | "Weekly");
                        setKpiPage(0);
                      }}
                      className="appearance-none text-[12px] sm:text-[13px] border border-gray-200 rounded-xl pl-3 pr-8 py-1.5 text-[#1a1a1a] font-semibold bg-white outline-none cursor-pointer"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                    <ChevronRight
                      size={12}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-500 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Row 1: Calendar + Tasks Overview */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
                  {/* Calendar */}
                  <div className="lg:col-span-2 bg-[#ffffff] rounded-2xl p-3 sm:p-4">
                    <p className="text-[11px] text-gray-500 font-medium mb-3">
                      {focusMode} Report for {selectedDateLabel}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setWeekOffset((o) => o - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 flex-shrink-0 transition-colors"
                      >
                        <ChevronLeft size={13} />
                      </button>
                      <div className="flex-1 flex gap-1">
                        {weekDates.map((date, i) => {
                          const isSunday = date.getDay() === 0;
                          const isToday =
                            date.toDateString() === today.toDateString();
                          const status = getDayStatus(date, today, filledDates);

                          let cardBorder = "1px solid #e5e7eb";
                          let headerBg = "#e5e7eb";
                          let headerTextColor = "#6b7280";
                          let bodyBg = "#F7F5F0";
                          let dateTextColor = "#1a1a1a";

                          if (isSunday) {
                            cardBorder = "1px solid transparent";
                            headerBg = "transparent";
                            headerTextColor = "#000000";
                            bodyBg = "#F5F5F5";
                            dateTextColor = "#000000";
                          } else if (isToday) {
                            cardBorder = "2.5px solid #E49377";
                            headerBg = "transparent";
                            headerTextColor = "#1a1a1a";
                            bodyBg = "#FDF5F2";
                            dateTextColor = "#1a1a1a";
                          } else if (status === "filled") {
                            cardBorder = "1px solid transparent";
                            headerBg = "#82D4C4";
                            headerTextColor = "#000000";
                            dateTextColor = "#000000";
                          } else if (status === "missed") {
                            cardBorder = "1px solid transparent";
                            headerBg = "#e29393";
                            headerTextColor = "#000000";
                            dateTextColor = "#000000";
                          } else if (status === "upcoming") {
                            cardBorder = "1px solid transparent";
                            headerBg = "transparent";
                            headerTextColor = "#000000";
                            bodyBg = "#F5F5F5";
                            dateTextColor = "#000000";
                          } else if (status === "holiday") {
                            cardBorder = "1px solid #fde047";
                            headerBg = "#fef9c3";
                            headerTextColor = "#b45309";
                            dateTextColor = "#b45309";
                          }

                          const isSelectedDay =
                            selectedDate.toDateString() === date.toDateString();
                          const isClickable =
                            !isSunday && !(date > today && !isToday);

                          // Override border for selected day
                          const finalBorder = isSelectedDay
                            ? "2.5px solid #DA7756"
                            : cardBorder;
                          const finalBodyBg = isSelectedDay
                            ? "#FDF5F2"
                            : bodyBg;

                          return (
                            <div
                              key={i}
                              className="flex-1 flex flex-col items-center relative transition-all"
                              onClick={() => handleDayClick(date)}
                              style={{
                                border: finalBorder,
                                borderRadius: "12px",
                                backgroundColor: finalBodyBg,
                                cursor: isClickable ? "pointer" : "default",
                                opacity:
                                  !isClickable && !isSelectedDay ? 0.6 : 1,
                              }}
                            >
                              {status === "upcoming" && !isSunday && (
                                <div
                                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full shadow-sm"
                                  style={{ backgroundColor: "#e29393" }}
                                />
                              )}
                              {/* Decorative Top Strip */}
                              {headerBg !== "transparent" && (
                                <div
                                  className="w-full flex-shrink-0"
                                  style={{
                                    height: "6px",
                                    backgroundColor: headerBg,
                                    borderTopLeftRadius: "11px",
                                    borderTopRightRadius: "11px",
                                  }}
                                />
                              )}
                              {/* Card Content */}
                              <div
                                className="w-full flex flex-col items-center justify-center flex-1 py-1"
                                style={{
                                  borderBottomLeftRadius: "11px",
                                  borderBottomRightRadius: "11px",
                                  ...(headerBg === "transparent"
                                    ? {
                                        borderTopLeftRadius: "11px",
                                        borderTopRightRadius: "11px",
                                      }
                                    : {}),
                                }}
                              >
                                <span
                                  className="text-[10px] sm:text-[11px] font-semibold mb-0.5"
                                  style={{ color: headerTextColor }}
                                >
                                  {DAY_LABELS[i]}
                                </span>
                                <span
                                  className="text-[14px] sm:text-[17px] font-bold leading-tight"
                                  style={{ color: dateTextColor }}
                                >
                                  {date.getDate()}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => setWeekOffset((o) => o + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 flex-shrink-0 transition-colors"
                      >
                        <ChevronRight size={13} />
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-4 mt-3 flex-wrap">
                      {[
                        { color: "#82D4C4", label: "Filled", isCircle: false },
                        { color: "#e29393", label: "Missed", isCircle: false },
                        { color: "#D1D5DB", label: "Holiday", isCircle: false },
                        // { color: "#e29393", label: "Upcoming tasks", isCircle: true }
                      ].map(({ color, label, isCircle }) => (
                        <div key={label} className="flex items-center gap-1.5">
                          <div
                            className={`w-2.5 h-2.5 flex-shrink-0 ${isCircle ? "rounded-full" : "rounded-[2px]"}`}
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-[10px] sm:text-[11px] text-[#1a1a1a] font-medium">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tasks Overview */}
                  <div className="lg:col-span-1 bg-[#ffffff] rounded-2xl p-3 sm:p-4">
                    <p className="text-[13px] font-bold text-[#1a1a1a] mb-4">
                      Tasks Overview
                    </p>
                    {(() => {
                      const assigned =
                        focusMode === "Weekly"
                          ? (counters?.weekly_reports ?? 0)
                          : (counters?.daily_reports ?? 0);
                      const pending =
                        focusMode === "Weekly"
                          ? (counters?.weekly_pending ?? 0)
                          : (counters?.daily_pending ?? 0);
                      const completed = Math.max(0, assigned - pending);
                      const maxVal = Math.max(assigned, 1);
                      const rings = [
                        {
                          value: assigned,
                          color: "#a78bfa",
                          track: "#ede9fe",
                          label: "Assigned",
                        },
                        {
                          value: completed,
                          color: "#2dd4bf",
                          track: "#ccfbf1",
                          label: "Completed",
                        },
                        {
                          value: pending,
                          color: "#f87171",
                          track: "#fee2e2",
                          label: "Overdue",
                        },
                      ];
                      const r = 30;
                      const circ = 2 * Math.PI * r;
                      return (
                        <div className="flex items-center justify-around">
                          {rings.map(({ value, color, track, label }) => {
                            const pct = Math.min(value / maxVal, 1);
                            return (
                              <div
                                key={label}
                                className="flex flex-col items-center gap-2"
                              >
                                <div className="relative w-[68px] h-[68px]">
                                  <svg
                                    className="w-full h-full -rotate-90"
                                    viewBox="0 0 68 68"
                                  >
                                    <circle
                                      cx="34"
                                      cy="34"
                                      r={r}
                                      fill="none"
                                      stroke={track}
                                      strokeWidth="7"
                                    />
                                    <circle
                                      cx="34"
                                      cy="34"
                                      r={r}
                                      fill="none"
                                      stroke={color}
                                      strokeWidth="7"
                                      strokeDasharray={circ}
                                      strokeDashoffset={circ - pct * circ}
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                  <span
                                    className="absolute inset-0 flex items-center justify-center text-[15px] font-black"
                                    style={{ color }}
                                  >
                                    {value}
                                  </span>
                                </div>
                                <span className="text-[10px] sm:text-[11px] text-gray-500 font-semibold">
                                  {label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Row 2: Accomplishments + To Do's */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {/* Accomplishments */}
                  <div className="lg:col-span-2 bg-[#ffffff] rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Sparkles
                          size={14}
                          className="text-[#DA7756] flex-shrink-0"
                        />
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#1a1a1a] truncate">
                          Accomplishments Ai overview
                        </span>
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0"
                          style={{
                            backgroundColor: "#ede9fe",
                            color: "#7c3aed",
                          }}
                        >
                          8/20 Pts
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          navigate("/business-compass/daily-report")
                        }
                        className="text-[11px] text-[#DA7756] font-bold hover:underline whitespace-nowrap flex-shrink-0"
                      >
                        View All &gt;
                      </button>
                    </div>
                    {displayLoading ? (
                      <p className="text-[11px] text-gray-400 italic">
                        Loading...
                      </p>
                    ) : displayAccomplishments.length > 0 ? (
                      <ul className="space-y-2">
                        {displayAccomplishments.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-[11px] sm:text-[12px] text-gray-600 leading-relaxed"
                          >
                            <span className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[11px] text-gray-400 italic">
                        {focusMode === "Weekly"
                          ? "No accomplishments this week."
                          : "No accomplishments for today."}
                      </p>
                    )}
                  </div>

                  {/* To Do's */}
                  <div className="lg:col-span-1 bg-[#ffffff] rounded-2xl p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] sm:text-[13px] font-bold text-[#1a1a1a]">
                          To Do's
                        </span>
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                          style={{
                            backgroundColor: "#ede9fe",
                            color: "#7c3aed",
                          }}
                        >
                          8/20 Pts
                        </span>
                      </div>
                      <button
                        onClick={() => navigate("/business-compass/todo")}
                        className="text-[11px] text-[#DA7756] font-bold hover:underline whitespace-nowrap flex-shrink-0"
                      >
                        View All &gt;
                      </button>
                    </div>
                    {displayLoading ? (
                      <p className="text-[11px] text-gray-400 italic">
                        Loading...
                      </p>
                    ) : (
                      <>
                        <div className="mb-3">
                          <button
                            onClick={() => navigate("/business-compass/todo")}
                            className="text-[11px] font-bold text-[#DA7756] mb-1.5 hover:underline text-left"
                          >
                            OverDue
                          </button>
                          {displayTodosOverdue.length > 0 ? (
                            <div className="space-y-1.5">
                              {displayTodosOverdue.map((item) => (
                                <p
                                  key={item.id}
                                  className="text-[11px] sm:text-[12px] text-gray-600 leading-snug pl-0.5 cursor-pointer hover:text-[#DA7756] transition-colors"
                                  onClick={() =>
                                    navigate("/business-compass/todo")
                                  }
                                >
                                  {item.title}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-400 italic">
                              No overdue todos.
                            </p>
                          )}
                        </div>
                        <div>
                          <button
                            onClick={() => navigate("/business-compass/todo")}
                            className="text-[11px] font-bold text-[#DA7756] mb-1.5 hover:underline text-left"
                          >
                            Urgent &amp; Important
                          </button>
                          {displayTodosHigh.length > 0 ? (
                            <div className="space-y-1.5">
                              {displayTodosHigh.map((item) => (
                                <p
                                  key={item.id}
                                  className="text-[11px] sm:text-[12px] text-gray-600 leading-snug pl-0.5 cursor-pointer hover:text-[#DA7756] transition-colors"
                                  onClick={() =>
                                    navigate("/business-compass/todo")
                                  }
                                >
                                  {item.title}
                                </p>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-400 italic">
                              No urgent &amp; important todos.
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ══ RIGHT PANEL ═════════════════════════════════════════════════ */}
          <div className="w-full lg:w-[260px] lg:flex-shrink-0 flex flex-col gap-4">
            {/* KPI's – filtered by focusMode + paginated */}
            <Card className="rounded-2xl border border-gray-100 bg-[#F6F4EE] shadow-sm">
              <CardContent className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a]">
                    KPI's
                  </h3>
                  <span className="text-[10px] font-semibold text-[#DA7756] bg-white px-2 py-0.5 rounded-full border border-[#DA7756]/20">
                    {kpis.length} KPI{kpis.length !== 1 ? "'s" : ""}
                  </span>
                </div>
                {(() => {
                  const pool = kpis;
                  const perPage = 2;
                  const totalPages = Math.max(
                    1,
                    Math.ceil(pool.length / perPage)
                  );
                  const safePage = kpiPage % totalPages;
                  const paged = pool.slice(
                    safePage * perPage,
                    safePage * perPage + perPage
                  );
                  const hasMore = pool.length > perPage;
                  return (
                    <div className="flex items-stretch gap-2">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        {paged.length > 0 ? (
                          paged.map((kpi, i) => (
                            <div
                              key={kpi.id ?? i}
                              className="flex flex-col gap-1 p-2.5 rounded-xl bg-white border border-gray-200"
                            >
                              <span className="text-[9px] text-gray-400 font-semibold">
                                {kpi.frequency_label}
                              </span>
                              <span className="text-[11px] font-bold text-[#1a1a1a] leading-tight line-clamp-2">
                                {kpi.name}
                              </span>
                              <div className="flex items-baseline gap-0.5 mt-1">
                                <span className="text-[13px] font-black text-[#1a1a1a]">
                                  {kpi.current_value}
                                </span>
                                <span className="text-[9px] text-gray-400">
                                  /{kpi.target_value} {kpi.unit}
                                </span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-1 mt-0.5">
                                <div
                                  className="bg-[#DA7756] h-1 rounded-full"
                                  style={{
                                    width: `${Math.min(kpi.progress_percentage, 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-[9px] text-gray-400">
                                {kpi.progress_percentage}%
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 text-center py-6 text-[11px] text-gray-400 italic bg-white rounded-xl border border-gray-200">
                            No KPIs assigned
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          hasMore && setKpiPage((p) => (p + 1) % totalPages)
                        }
                        className={cn(
                          "flex items-center justify-center w-6 flex-shrink-0 transition-colors",
                          hasMore
                            ? "text-gray-400 hover:text-[#DA7756] cursor-pointer"
                            : "text-gray-200 cursor-default"
                        )}
                        disabled={!hasMore}
                        title={
                          hasMore ? `Page ${safePage + 1}/${totalPages}` : ""
                        }
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>

            {/* Top Stuck Issues */}
            <Card className="rounded-2xl border border-gray-100 bg-[#F6F4EE] shadow-sm">
              <CardContent className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a]">
                    Top Stuck Issues
                  </h3>
                  <button
                    onClick={() => navigate("/vas/issues")}
                    className="text-[10px] sm:text-[11px] text-[#DA7756] font-bold hover:underline flex items-center gap-0.5"
                  >
                    View All <ChevronRight size={10} />
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {issues.length > 0 ? (
                    issues.slice(0, 8).map((issue: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 bg-white rounded-xl px-3 py-2.5"
                      >
                        <span className="text-[11px] text-gray-700 flex-1 line-clamp-2 leading-snug">
                          {issue.title}
                        </span>
                        <span
                          className="flex-shrink-0 text-[10px] px-2.5 py-0.5 rounded-full font-semibold"
                          style={issueBadgeStyle(issue.priority)}
                        >
                          {issue.priority || issue.status || "High"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-[11px] text-gray-400 italic bg-white rounded-xl border border-gray-100">
                      No stuck issues
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Counters */}
            <Card className="rounded-2xl border border-gray-100 bg-[#F6F4EE] shadow-sm">
              <CardContent className="px-4 py-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                  <div
                    className="text-center p-3 rounded-xl"
                    style={{
                      backgroundColor: "#fce8e8",
                      border: "1px solid #fbcfcf",
                    }}
                  >
                    <p className="text-[9px] text-[#e05050] font-semibold leading-tight mb-1">
                      Daily report/
                      <br />
                      pending
                    </p>
                    <p className="text-[15px] font-black text-[#1a1a1a]">
                      {counters?.daily_reports ?? 0}/
                      {counters?.daily_pending ?? 0}
                    </p>
                  </div>
                  <div
                    className="text-center p-3 rounded-xl"
                    style={{
                      backgroundColor: "#fce8e8",
                      border: "1px solid #fbcfcf",
                    }}
                  >
                    <p className="text-[9px] text-[#e05050] font-semibold leading-tight mb-1">
                      Weekly report/
                      <br />
                      pending
                    </p>
                    <p className="text-[15px] font-black text-[#1a1a1a]">
                      {counters?.weekly_reports ?? 0}/
                      {counters?.weekly_pending ?? 0}
                    </p>
                  </div>
                  <div className="text-center p-3 rounded-xl bg-white border border-gray-200">
                    <p className="text-[9px] text-gray-400 font-semibold leading-tight mb-1">KPI</p>
                    <p className="text-[15px] font-black text-[#1a1a1a]">{counters?.kpis ?? 0}</p>
                  </div>
                  <div className="relative text-center p-3 rounded-xl bg-white border border-gray-200">
                    <p className="text-[9px] text-gray-400 font-semibold leading-tight mb-1">JDs</p>
                    <p className="text-[15px] font-black text-[#1a1a1a]">{counters?.job_descriptions ?? 0}</p>
                    <Sparkles size={14} className="absolute bottom-2 right-2 text-[#DA7756] opacity-60" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ══ AI CHAT – Glass Morphism Panel ══════════════════════════════════ */}
      {aiChatOpen && (
        <div
          className="fixed z-50 ai-chat-enter"
          style={{
            bottom: "68px",
            right: "16px",
            width: "min(420px, calc(100vw - 32px))",
          }}
        >
          <div
            style={{
              padding: "1.5px",
              borderRadius: "20px",
              background:
                "linear-gradient(135deg, rgba(218,119,86,0.70) 0%, rgba(251,200,170,0.40) 40%, rgba(190,185,235,0.60) 100%)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            }}
          >
            <div
              style={{
                borderRadius: "18.5px",
                background: "#ffffff",
                overflow: "hidden",
              }}
            >
              <div
                className="flex items-center justify-between px-5 pt-4 pb-3"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.45)" }}
              >
                <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
                  {(["accomplishments", "plan"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setAiChatTab(tab)}
                      className={cn(
                        "px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold transition-all whitespace-nowrap",
                        aiChatTab === tab
                          ? "bg-[#DA7756] text-white shadow-sm"
                          : "text-gray-600 bg-white/40 hover:bg-white/60"
                      )}
                    >
                      {tab === "accomplishments"
                        ? "Fill my accomplishments"
                        : "Plan for next day"}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setAiChatOpen(false)}
                  className="ml-2 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="h-36 sm:h-40 px-4 sm:px-5 py-4 flex items-center justify-center">
                <p className="text-[12px] sm:text-[13px] text-gray-400 italic text-center">
                  {aiChatTab === "accomplishments"
                    ? "AI will help you fill your accomplishments..."
                    : "AI will help you plan for tomorrow..."}
                </p>
              </div>
              <div className="px-4 sm:px-5 pb-5 pt-1">
                <div
                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-2xl"
                  style={{
                    background: "rgba(255,255,255,0.65)",
                    border: "1px solid rgba(255,255,255,0.80)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                  }}
                >
                  <Sparkles
                    size={13}
                    className="text-[#DA7756] flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setAiMessage("");
                    }}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent text-[12px] sm:text-[13px] text-gray-700 placeholder-gray-400 outline-none min-w-0"
                  />
                  {aiMessage && (
                    <button
                      onClick={() => setAiMessage("")}
                      className="text-[#DA7756] hover:text-[#c9673f] flex-shrink-0 transition-colors"
                    >
                      <Send size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI trigger – glassmorphism button */}
      {!aiChatOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-18px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 42% 38%, rgba(218,119,86,0.38) 0%, rgba(249,170,130,0.16) 50%, transparent 72%)",
              filter: "blur(10px)",
            }}
          />
          <div className="ai-btn-glow-outer">
            <div className="ai-btn-glow-spinner" />
            <button
              onClick={() => setAiChatOpen(true)}
              title="AI Assistant"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              style={{
                position: "relative",
                zIndex: 1,
                width: "52px",
                height: "52px",
                borderRadius: "17.5px",
                background:
                  "linear-gradient(148deg, rgba(255,255,255,0.97) 10%, rgba(253,218,196,0.84) 100%)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "none",
                outline: "none",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,1), 0 4px 14px rgba(218,119,86,0.15)",
                transition: "transform 0.2s ease",
              }}
            >
              <Sparkles size={24} color="#DA7756" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessCompassDashboard;
