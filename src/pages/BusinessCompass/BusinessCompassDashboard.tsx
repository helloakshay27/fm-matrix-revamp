import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Sparkles, X, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./BusinessCompass.css";
import { getBaseUrl, getToken } from "@/utils/auth";

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

interface TeamChatMessage {
  id: number;
  body: string;
  sender_name: string;
  project_space: string;
  created_at: string;
  label: string;
}

interface HallOfFameMember {
  user_id: number;
  name: string;
  total_points: number;
  weekly_points: number;
  daily_points: number;
  feedback_points: number;
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
    latest_team_chat: { total: number; items: TeamChatMessage[] };
    hall_of_fame: { items: HallOfFameMember[] };
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
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekDates(offset: number): Date[] {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  return Array.from({ length: 6 }, (_, i) => {
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
          <circle cx="34" cy="34" r={r} fill="none" stroke="#f0f0f0" strokeWidth="7" />
          <circle
            cx="34" cy="34" r={r}
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
      <span className="text-[10px] sm:text-[11px] text-gray-500 font-semibold">{label}</span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
const BusinessCompassDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weekOffset, setWeekOffset] = useState(0);
  const [focusMode, setFocusMode] = useState<"Daily" | "Weekly">("Daily");
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiChatTab, setAiChatTab] = useState<"accomplishments" | "plan">("accomplishments");
  const [aiMessage, setAiMessage] = useState("");

  const weekDates = getWeekDates(weekOffset);
  const today = new Date();

  // ── API ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const baseUrl = getBaseUrl() ?? "https://fm-uat-api.lockated.com";
        const token = getToken();
        if (!token) return;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };
        const res = await fetch(
          `${baseUrl.replace(/\/$/, "")}/business_compass/dashboard`,
          { headers }
        );
        if (res.ok) setDashboardData(await res.json());
      } catch (e) {
        console.error("Failed to fetch dashboard:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Derived ──────────────────────────────────────────────────────────────
  const d = dashboardData?.data;
  const health = d?.business_health_score;
  const score = health?.score ?? 0;
  const outOf = health?.out_of ?? 100;
  const scoreLabel = health?.label ?? "Needs Attention";
  const scorePct = Math.min((score / outOf) * 100, 100);
  const kpis = d?.critical_numbers?.items ?? [];
  const issues = d?.top_stuck_issues?.items ?? [];
  const counters = d?.counters;
  const profileName = d?.profile?.user_name ?? "User";

  const accomplishments = [
    "UI & Prototyping: Finalized high-fidelity screen variations and interactive states for the main dashboard.",
    "Accessibility: Resolved core contrast and touch-target flags across the primary user flow.",
    "Alignment: Presented wireframes to stakeholders and gathered layout feedback.",
  ];
  const todosOverdue = ["Share Updates with the team", "Polish UI and Components"];
  const todosHigh = ["Share Updates with the team"];

  // ── Issue badge helper ───────────────────────────────────────────────────
  const issueBadgeClass = (priority: string) => {
    const p = (priority ?? "").toLowerCase();
    if (p === "medium") return "bg-yellow-100 text-yellow-700";
    if (p === "low") return "bg-green-100 text-green-700";
    return "bg-[#ffe4e4] text-[#e05050]"; // high / default
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="relative bg-[#f6f4ee] min-h-screen font-poppins">
      {/* ── Outer wrapper: stacks on mobile, side-by-side on desktop ── */}
      <div className="flex flex-col lg:flex-row gap-4 p-3 sm:p-4 lg:p-5">

        {/* ════════════════════════════════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:flex-1 lg:min-w-0 flex flex-col gap-4">

          <h1 className="text-[18px] sm:text-[22px] font-bold text-[#1a1a1a]">Dashboard</h1>

          {/* ── Welcome Banner ── */}
          <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <CardContent className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-[16px] sm:text-[18px] font-bold italic text-[#1a1a1a]">
                  Welcome back {profileName}!
                </p>
                <p className="text-[12px] sm:text-[13px] text-gray-400 mt-0.5">
                  Here's your Weekly overview.
                </p>
              </div>
              <Button
                variant="outline"
                className="self-start sm:self-auto border border-[#DA7756] bg-white text-[#DA7756] rounded-xl px-5 h-9 text-sm font-semibold hover:bg-[#fef6f4] shadow-none whitespace-nowrap"
                onClick={() => navigate("/business-compass/profile")}
              >
                Complete profile
              </Button>
            </CardContent>
          </Card>

          {/* ── Business Health Score ── */}
          <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <CardContent className="px-4 sm:px-6 py-4 sm:py-5">

              {/* Header */}
              <div className="flex items-start justify-between mb-8 sm:mb-8">
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

              {/* Gradient bar – extra top-padding so the "you" bubble doesn't clip */}
              <div className="relative mx-1 mb-1 pt-10">
                <div
                  className="absolute flex flex-col items-center"
                  style={{
                    left: `${scorePct}%`,
                    transform: "translateX(-50%)",
                    bottom: "calc(100% - 32px)",
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
                      width: 0, height: 0,
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderTop: "5px solid #4ECDC4",
                    }}
                  />
                </div>
                <div
                  className="h-2.5 sm:h-3 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to right, #f87171 0%, #fb923c 22%, #facc15 44%, #86efac 66%, #2dd4bf 100%)",
                  }}
                />
              </div>

              {/* Labels */}
              <div className="flex justify-between text-[10px] sm:text-[11px] text-gray-400 font-medium mb-4 px-0.5 mt-1.5">
                <span>Poor</span>
                <span>Normal</span>
                <span>Good</span>
                <span>Excellent</span>
              </div>

              {/* 4 metric cards – 2-col on mobile, 4-col on sm+ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                <div className="rounded-xl p-2.5 sm:p-3 text-center bg-white border border-gray-100">
                  <div className="text-[10px] sm:text-[11px] text-gray-400 font-semibold mb-1">KPI</div>
                  <div className="text-[18px] sm:text-[22px] font-black text-[#1a1a1a]">
                    {health?.components?.kpi?.percentage ?? 0}%
                  </div>
                </div>
                <div
                  className="rounded-xl p-2.5 sm:p-3 text-center"
                  style={{ backgroundColor: "#fce8e8", border: "1px solid #fbcfcf" }}
                >
                  <div className="text-[10px] sm:text-[11px] text-gray-500 font-semibold mb-1">Issues</div>
                  <div className="text-[18px] sm:text-[22px] font-black text-[#1a1a1a]">
                    {health?.components?.issues?.count ?? 0}
                  </div>
                </div>
                <div
                  className="rounded-xl p-2.5 sm:p-3 text-center"
                  style={{ backgroundColor: "#e8f0fe", border: "1px solid #c7d9fd" }}
                >
                  <div className="text-[10px] sm:text-[11px] text-gray-500 font-semibold mb-1">Systems</div>
                  <div className="text-[18px] sm:text-[22px] font-black text-[#1a1a1a]">
                    {health?.components?.systems?.healthy ?? 0}/
                    {health?.components?.systems?.total ?? 0}
                  </div>
                </div>
                <div
                  className="rounded-xl p-2.5 sm:p-3 text-center"
                  style={{ backgroundColor: "#e8f4fe", border: "1px solid #c7e5fd" }}
                >
                  <div className="text-[10px] sm:text-[11px] text-gray-500 font-semibold mb-1">Goals</div>
                  <div className="text-[18px] sm:text-[22px] font-black text-[#1a1a1a]">
                    {health?.components?.goals?.achieved ?? 0}/
                    {health?.components?.goals?.total ?? 0}
                  </div>
                </div>
              </div>

              {/* AI suggestion row */}
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 px-3 sm:px-4 py-2.5 rounded-xl bg-[#fef9f7] border border-[#DA7756]/15">
                <div className="flex items-center gap-2 text-[12px] sm:text-[13px] text-gray-600">
                  <Sparkles size={14} className="text-[#DA7756] flex-shrink-0" />
                  Ai suggestion to improve business score.
                </div>
                <Button className="h-8 px-4 sm:px-5 bg-[#DA7756] hover:bg-[#c9673f] text-white text-[11px] sm:text-[12px] font-bold rounded-lg shadow-none whitespace-nowrap self-end xs:self-auto">
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Today's Focus + Tasks Overview – 1-col mobile, 2-col md+ ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Today's Focus */}
            <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <CardContent className="px-4 sm:px-5 py-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a]">Today's Focus</h3>
                  <div className="relative">
                    <select
                      value={focusMode}
                      onChange={(e) => setFocusMode(e.target.value as "Daily" | "Weekly")}
                      className="appearance-none text-[11px] sm:text-[12px] border border-gray-200 rounded-lg pl-3 pr-6 py-1 text-[#1a1a1a] font-semibold bg-white outline-none cursor-pointer"
                    >
                      <option>Daily</option>
                      <option>Weekly</option>
                    </select>
                    <ChevronRight
                      size={11}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
                    />
                  </div>
                </div>

                <p className="text-[10px] sm:text-[11px] text-gray-400 mb-3">
                  {focusMode} Report for {formatWeekLabel(weekDates)}
                </p>

                {/* Week calendar */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <button
                    onClick={() => setWeekOffset((o) => o - 1)}
                    className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0 text-gray-400"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  <div className="flex-1 grid grid-cols-6 gap-0">
                    {weekDates.map((date, i) => {
                      const isToday = date.toDateString() === today.toDateString();
                      return (
                        <div key={i} className="flex flex-col items-center gap-0.5 sm:gap-1">
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
                            {DAY_LABELS[i]}
                          </span>
                          <div
                            className={cn(
                              "w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-[11px] sm:text-[13px] font-bold transition-colors cursor-pointer",
                              isToday
                                ? "bg-[#DA7756] text-white"
                                : "text-[#374151] hover:bg-gray-50"
                            )}
                          >
                            {date.getDate()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setWeekOffset((o) => o + 1)}
                    className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0 text-gray-400"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap">
                  {[
                    ["#DA7756", "Filled"],
                    ["#60a5fa", "Viewed"],
                    ["#fbbf24", "Holiday"],
                    ["#d1d5db", "Upcoming"],
                  ].map(([color, label]) => (
                    <div key={label} className="flex items-center gap-1">
                      <div
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-[9px] sm:text-[10px] text-gray-400">{label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tasks Overview */}
            <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <CardContent className="px-4 sm:px-5 py-4">
                <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a] mb-4 sm:mb-5">
                  Tasks Overview
                </h3>
                <div className="flex items-center justify-around">
                  <CircleProgress
                    value={counters?.daily_reports ?? 234}
                    max={Math.max(counters?.daily_reports ?? 234, 300)}
                    color="#3b82f6"
                    label="Assigned"
                  />
                  <CircleProgress
                    value={counters?.weekly_reports ?? 189}
                    max={Math.max(counters?.weekly_reports ?? 189, 300)}
                    color="#22c55e"
                    label="Completed"
                  />
                  <CircleProgress
                    value={counters?.daily_pending ?? 52}
                    max={Math.max(counters?.daily_pending ?? 52, 100)}
                    color="#f87171"
                    label="Overdue"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Accomplishments + To Do's – 1-col mobile, 2-col md+ ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Accomplishments */}
            <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <CardContent className="px-4 sm:px-5 py-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[12px] sm:text-[13px] font-bold text-[#1a1a1a]">
                      Accomplishments AI overview
                    </h3>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#DA7756] bg-[#fef6f4] border border-[#DA7756]/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                      ✦ 0/25 Pts
                    </span>
                  </div>
                  <button
                    onClick={() => setAiChatOpen(true)}
                    className="text-[10px] sm:text-[11px] text-[#DA7756] font-bold hover:underline whitespace-nowrap flex-shrink-0"
                  >
                    View All →
                  </button>
                </div>
                <ul className="space-y-2">
                  {accomplishments.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] sm:text-[12px] text-gray-600 leading-relaxed">
                      <span className="text-[#DA7756] mt-0.5 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* To Do's */}
            <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <CardContent className="px-4 sm:px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[12px] sm:text-[13px] font-bold text-[#1a1a1a]">To Do's</h3>
                    <span className="text-[9px] sm:text-[10px] font-bold text-[#DA7756] bg-[#fef6f4] border border-[#DA7756]/20 px-2 py-0.5 rounded-full">
                      0/20 Pts
                    </span>
                  </div>
                  <button className="text-[10px] sm:text-[11px] text-[#DA7756] font-bold hover:underline">
                    View All →
                  </button>
                </div>

                <div className="mb-3">
                  <p className="text-[9px] sm:text-[10px] font-bold text-[#DA7756] uppercase tracking-wider mb-2">
                    OverDue
                  </p>
                  <div className="space-y-1.5">
                    {todosOverdue.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 py-1 text-[11px] sm:text-[12px] text-gray-600 border-b border-gray-50 last:border-0"
                      >
                        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-orange-500 uppercase tracking-wider mb-2">
                    High Priority
                  </p>
                  <div className="space-y-1.5">
                    {todosHigh.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 py-1 text-[11px] sm:text-[12px] text-gray-600">
                        <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            RIGHT PANEL
            – full width below main on mobile/tablet
            – fixed 260px sidebar on desktop (lg+)
        ════════════════════════════════════════════════════════════════ */}
        <div className="w-full lg:w-[260px] lg:flex-shrink-0 flex flex-col gap-4">

          {/* On mobile, show KPI + Issues side-by-side inside panel row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">

            {/* ── KPI's ── */}
            <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <CardContent className="px-4 py-4">
                <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a] mb-3">KPI's</h3>
                <div className="flex items-stretch gap-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    {kpis.length > 0
                      ? kpis.slice(0, 2).map((kpi, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-1 p-2 sm:p-2.5 rounded-xl bg-[#faf9f7] border border-gray-100"
                        >
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-semibold">
                            {kpi.frequency_label}
                          </span>
                          <span className="text-[11px] sm:text-[12px] font-bold text-[#1a1a1a] leading-tight line-clamp-2">
                            {kpi.name}
                          </span>
                          <span className="text-[12px] sm:text-[13px] font-black text-[#1a1a1a] mt-1">
                            {kpi.current_value}/{kpi.target_value}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-gray-400">{kpi.unit}</span>
                        </div>
                      ))
                      : ["Daily", "Daily"].map((label, i) => (
                        <div
                          key={i}
                          className="flex flex-col gap-1 p-2 sm:p-2.5 rounded-xl bg-[#faf9f7] border border-gray-100"
                        >
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-semibold">{label}</span>
                          <span className="text-[11px] sm:text-[12px] font-bold text-[#1a1a1a] leading-tight">
                            Courtesy call
                          </span>
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <span className="text-[12px] sm:text-[13px] font-black text-[#1a1a1a]">
                              0/2 calls
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                  <button className="flex items-center justify-center w-5 sm:w-6 flex-shrink-0 text-gray-400 hover:text-[#DA7756] transition-colors">
                    <ChevronRight size={15} />
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* ── Top Stuck Issues ── */}
            <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <CardContent className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] sm:text-[14px] font-bold text-[#1a1a1a]">Top Stuck Issues</h3>
                  <button
                    onClick={() => navigate("/vas/issues")}
                    className="text-[10px] sm:text-[11px] text-[#DA7756] font-bold hover:underline flex items-center gap-0.5"
                  >
                    View All <ChevronRight size={10} />
                  </button>
                </div>
                <div>
                  {issues.length > 0
                    ? issues.slice(0, 6).map((issue, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 py-2 border-b border-gray-50 last:border-0"
                      >
                        <span className="text-[11px] sm:text-[12px] text-gray-700 flex-1 line-clamp-2 leading-snug">
                          {issue.title}
                        </span>
                        <span className={cn(
                          "flex-shrink-0 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded font-bold",
                          issueBadgeClass(issue.priority)
                        )}>
                          {issue.priority || issue.status || "High"}
                        </span>
                      </div>
                    ))
                    : [
                      "Observer Issue",
                      "Permits are going for approval despite being in drafts",
                      "Permits are going for approval despite being in drafts",
                      "Permits are going for approval despite being in drafts",
                      "Permits are going for approval despite being in drafts",
                    ].map((title, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between gap-2 py-2 border-b border-gray-50 last:border-0"
                      >
                        <span className="text-[11px] sm:text-[12px] text-gray-700 flex-1 line-clamp-2 leading-snug">
                          {title}
                        </span>
                        <span className="flex-shrink-0 text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded font-bold bg-[#ffe4e4] text-[#e05050]">
                          High
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Counters ── */}
          <Card className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <CardContent className="px-4 py-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
                {[
                  { label: "Daily report/pending", value: `${counters?.daily_reports ?? 0}/${counters?.daily_pending ?? 0}` },
                  { label: "Weekly report/pending", value: `${counters?.weekly_reports ?? 0}/${counters?.weekly_pending ?? 0}` },
                  { label: "KPI", value: String(counters?.kpis ?? 0) },
                  { label: "JDs", value: String(counters?.job_descriptions ?? 0) },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="text-center p-2 sm:p-2.5 rounded-xl bg-[#faf9f7] border border-gray-100"
                  >
                    <p className="text-[8px] sm:text-[9px] text-gray-400 font-medium leading-tight mb-1">
                      {label}
                    </p>
                    <p className="text-[13px] sm:text-[15px] font-black text-[#1a1a1a]">{value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          AI CHAT – Glass Morphism Panel
          Full-width on mobile, 500px on sm+
      ════════════════════════════════════════════════════════════════════ */}
      {aiChatOpen && (
        <div
          className="fixed bottom-0 left-0 right-0 sm:left-auto sm:right-0 sm:w-[480px] md:w-[500px] z-50 overflow-hidden"
          style={{
            borderRadius: "20px 20px 0 0",
            background: "rgba(250, 248, 243, 0.82)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            border: "1px solid rgba(255,255,255,0.60)",
            borderBottom: "none",
            boxShadow: "0 -8px 48px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.70)",
          }}
        >
          {/* Tab bar */}
          <div
            className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.45)" }}
          >
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setAiChatTab("accomplishments")}
                className={cn(
                  "px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold transition-all whitespace-nowrap",
                  aiChatTab === "accomplishments"
                    ? "bg-[#DA7756] text-white shadow-sm"
                    : "text-gray-600 bg-white/40 hover:bg-white/60"
                )}
              >
                Fill my accomplishments
              </button>
              <button
                onClick={() => setAiChatTab("plan")}
                className={cn(
                  "px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-[12px] font-semibold transition-all whitespace-nowrap",
                  aiChatTab === "plan"
                    ? "bg-[#DA7756] text-white shadow-sm"
                    : "text-gray-600 bg-white/40 hover:bg-white/60"
                )}
              >
                Plan for next day
              </button>
            </div>
            <button
              onClick={() => setAiChatOpen(false)}
              className="ml-2 w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-full hover:bg-white/60 text-gray-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          {/* Chat body */}
          <div className="h-36 sm:h-40 px-4 sm:px-5 py-4 overflow-y-auto flex items-center justify-center">
            <p className="text-[12px] sm:text-[13px] text-gray-400 italic text-center">
              {aiChatTab === "accomplishments"
                ? "AI will help you fill your accomplishments..."
                : "AI will help you plan for tomorrow..."}
            </p>
          </div>

          {/* Input */}
          <div className="px-4 sm:px-5 pb-5 pt-1">
            <div
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 rounded-2xl"
              style={{
                background: "rgba(255,255,255,0.65)",
                border: "1px solid rgba(255,255,255,0.80)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              }}
            >
              <Sparkles size={13} className="text-[#DA7756] flex-shrink-0" />
              <input
                type="text"
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") setAiMessage(""); }}
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
      )}

      {/* Floating AI trigger */}
      {!aiChatOpen && (
        <button
          onClick={() => setAiChatOpen(true)}
          title="AI Assistant"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#DA7756] text-white shadow-lg flex items-center justify-center hover:bg-[#c9673f] transition-colors z-50"
        >
          <Sparkles size={18} className="sm:hidden" />
          <Sparkles size={20} className="hidden sm:block" />
        </button>
      )}
    </div>
  );
};

export default BusinessCompassDashboard;
