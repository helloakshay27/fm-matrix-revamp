// ─────────────────────────────────────────────
// ReportsTab.jsx
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import {
  FileSpreadsheet,
  BarChart2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Settings,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  X,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  fetchMeetingReport,
  meetingOptions,
  periodOptions,
  BtnIcon,
} from "./Shared";

const generateEmptyTrendForReport = (endDateStr, days = 7) => {
  const result = [];
  const end = endDateStr ? new Date(endDateStr) : new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    result.push({
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      attendance: 0,
      kpi: 0,
    });
  }
  return result;
};

const normalizeReport = (raw) => {
  if (!raw) return null;
  const data = raw.data || raw;
  const validActivityTrend =
    Array.isArray(data.activity_trend) && data.activity_trend.length > 0;
  const validKpiTrend =
    Array.isArray(data.kpi_trend) && data.kpi_trend.length > 0;
  const endDate = data.period?.to;
  return {
    period: data.period || { from: "", to: "" },
    config: data.config || {},
    meetingsThisMonth: data.meetings_this_month ?? 0,
    attendanceRate: data.attendance_rate ?? 0,
    avgSelfRating: data.avg_self_rating ?? 0,
    unresolvedTasks: data.unresolved_tasks ?? 0,
    activityTrend: validActivityTrend
      ? data.activity_trend
      : generateEmptyTrendForReport(endDate, 7),
    kpiTrend: validKpiTrend
      ? data.kpi_trend
      : generateEmptyTrendForReport(endDate, 7),
    memberStats: Array.isArray(data.member_stats) ? data.member_stats : [],
    weeklyHistory: Array.isArray(data.history) ? data.history : [],
    _raw: raw,
  };
};

const mapApiHistoryToWeek = (apiHistoryArray, baseDateOffset = 0) => {
  const days = [];
  const baseDate = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - baseDateOffset * 7 - i);
    const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
    const dateNum = d.getDate().toString();
    let status = "holiday";
    if (dayName !== "Sat" && dayName !== "Sun") {
      status = d.getDate() % 2 !== 0 ? "done" : "missed";
    }
    days.push({ day: dayName, date: dateNum, status });
  }
  return days;
};

const ReportsTab = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState("1");
  const [selectedPeriod, setSelectedPeriod] = useState("last_7_days");
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isKpiExpanded, setIsKpiExpanded] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const loadReport = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const raw = await fetchMeetingReport({
        meetingId: selectedMeetingId,
        period: selectedPeriod,
      });
      setReport(normalizeReport(raw));
    } catch (err) {
      setApiError(err.message);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [selectedMeetingId, selectedPeriod]);

  const r = report;
  const weeklyStatusData = r
    ? mapApiHistoryToWeek(r.weeklyHistory, weekOffset)
    : [];
  const weekLabel =
    weekOffset === 0
      ? "Current Week"
      : weekOffset === 1
        ? "1 week ago"
        : `${weekOffset} weeks ago`;

  return (
    <div className="space-y-5 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">
            Meeting Reports
          </h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            {r?.config?.name ? r.config.name : "Loading..."}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <select
              value={selectedMeetingId}
              onChange={(e) => setSelectedMeetingId(e.target.value)}
              className="appearance-none bg-[#fffaf8] border border-[rgba(218,119,86,0.22)] rounded-xl py-2 pl-4 pr-8 text-sm font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.18)] shadow-sm"
            >
              {meetingOptions.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#DA7756]/70 w-3.5 h-3.5 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-[#fffaf8] border border-[rgba(218,119,86,0.22)] rounded-xl py-2 pl-4 pr-8 text-sm font-semibold text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.18)] shadow-sm"
            >
              {periodOptions.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#DA7756]/70 w-3.5 h-3.5 pointer-events-none" />
          </div>
          <BtnIcon onClick={loadReport} title="Refresh">
            <RefreshCw
              className={cn("w-3.5 h-3.5", isLoading && "animate-spin")}
            />
          </BtnIcon>
        </div>
      </div>

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2 text-red-600 text-xs font-bold shadow-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {apiError.includes("No Auth Token")
            ? "No auth token — save it in Settings tab first."
            : `API error: ${apiError}`}
        </div>
      )}

      {isLoading && (
        <div className="space-y-5 animate-pulse">
          <div className="h-32 bg-neutral-100 rounded-2xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-neutral-100 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="h-56 bg-neutral-100 rounded-2xl" />
            <div className="h-56 bg-neutral-100 rounded-2xl" />
          </div>
        </div>
      )}

      {!isLoading && !apiError && !r && (
        <div className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-neutral-200 rounded-2xl">
          <BarChart2 size={48} className="mb-4 opacity-20" />
          <p className="text-sm text-neutral-400 font-medium">
            No report data for this period
          </p>
        </div>
      )}

      {!isLoading && r && (
        <div className="space-y-6">
          {/* Weekly Status */}
          <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-neutral-800 font-bold text-sm">
                <Calendar className="w-5 h-5 text-[#DA7756]" /> Meeting Status (
                {weekLabel})
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="w-7 h-7 flex items-center justify-center border border-[rgba(218,119,86,0.22)] rounded-lg hover:bg-[#fef6f4] text-[#DA7756] transition-colors active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                  disabled={weekOffset === 0}
                  className={cn(
                    "w-7 h-7 flex items-center justify-center border border-[rgba(218,119,86,0.22)] rounded-lg transition-colors",
                    weekOffset === 0
                      ? "opacity-30 cursor-not-allowed bg-[#fffaf8]"
                      : "hover:bg-[#fef6f4] text-[#DA7756] active:scale-95"
                  )}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {weeklyStatusData.map((d, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center justify-center w-[12%] min-w-[70px] h-20 rounded-xl border flex-shrink-0 bg-white transition-all duration-300",
                    d.status === "done" && "border-green-400 bg-green-50/30",
                    d.status === "missed" && "border-red-300 bg-red-50/30",
                    d.status === "holiday" &&
                      "border-[rgba(218,119,86,0.25)] bg-[#fef6f4]"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      d.status === "done" && "text-green-600",
                      d.status === "missed" && "text-red-500",
                      d.status === "holiday" && "text-[#DA7756]"
                    )}
                  >
                    {d.day}
                  </span>
                  <span
                    className={cn(
                      "text-xl font-bold mt-0.5",
                      d.status === "done" && "text-green-600",
                      d.status === "missed" && "text-red-500",
                      d.status === "holiday" && "text-[#DA7756]"
                    )}
                  >
                    {d.date}
                  </span>
                  <div className="mt-1">
                    {d.status === "done" && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                    {d.status === "missed" && (
                      <X className="w-4 h-4 text-red-500" />
                    )}
                    {d.status === "holiday" && (
                      <span className="text-[#DA7756]/80 font-bold text-lg leading-none">
                        ~
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-5 mt-3 text-xs text-neutral-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Meeting
                Done
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-red-400 rounded-sm" /> Missed
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-[#f6a67d] rounded-sm" /> Holiday
              </span>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#fffaf8] rounded-2xl p-5 border border-[rgba(218,119,86,0.14)] flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-xs font-bold text-[#7a341d] tracking-wider uppercase mb-2">
                  Meetings This Month
                </div>
                <Calendar className="w-5 h-5 text-[#DA7756]" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#7a341d]">
                  {r.meetingsThisMonth}
                </div>
                <div className="text-xs font-semibold text-[#DA7756] mt-1">
                  0 missed of 3 working days
                </div>
              </div>
            </div>
            <div className="bg-[#fef6f4] rounded-2xl p-5 border border-[rgba(218,119,86,0.14)] flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-xs font-bold text-[#7a341d] tracking-wider uppercase mb-2">
                  Attendance Rate
                </div>
                <CheckCircle2 className="w-5 h-5 text-[#DA7756]" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#7a341d]">
                  {Number(r.attendanceRate).toFixed(1)}%
                </div>
                <div className="text-xs font-semibold text-[#DA7756] mt-1">
                  0/154 attended
                </div>
              </div>
            </div>
            <div className="bg-[#fff4ef] rounded-2xl p-5 border border-[rgba(218,119,86,0.14)] flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-xs font-bold text-[#7a341d] tracking-wider uppercase mb-2">
                  Avg Self-Rating
                </div>
                <TrendingUp className="w-5 h-5 text-[#DA7756]" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#7a341d]">
                  {r.avgSelfRating ? Number(r.avgSelfRating).toFixed(1) : "0.0"}
                  /10
                </div>
                <div className="text-xs font-semibold text-[#DA7756] mt-1">
                  0 ratings
                </div>
              </div>
            </div>
            <div className="bg-[#fff8f1] rounded-2xl p-5 border border-[rgba(218,119,86,0.14)] flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-xs font-bold text-[#7a341d] tracking-wider uppercase mb-2">
                  Unresolved
                </div>
                <AlertTriangle className="w-5 h-5 text-[#DA7756]" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#7a341d]">
                  {r.unresolvedTasks}
                </div>
                <div className="text-xs font-semibold text-[#DA7756] mt-1">
                  stuck issues
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] shadow-sm p-4">
              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-800">
                <TrendingUp className="w-4 h-4 text-[#DA7756]" /> Attendance
                Trend (Last 7 Days)
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={r.activityTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#22c55e"
                    strokeWidth={2}
                    fill="#dcfce7"
                    name="Attendance %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] shadow-sm p-4">
              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-800">
                <TrendingUp className="w-4 h-4 text-[#DA7756]" /> KPI
                Achievement Trend
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <ReLineChart data={r.kpiTrend}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="kpi"
                    stroke="#DA7756"
                    strokeWidth={2}
                    dot={{ fill: "#DA7756", r: 3 }}
                    name="KPI %"
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Issue & KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                cardClass: "bg-[#fff8f1] border-[rgba(218,119,86,0.14)]",
                icon: AlertTriangle,
                iconColor: "text-[#DA7756]",
                label: "Issue Resolution",
                value: "0%",
                sub: "0 Resolved · 0 Open",
              },
              {
                cardClass: "bg-[#fffaf8] border-[rgba(218,119,86,0.14)]",
                icon: Activity,
                iconColor: "text-[#DA7756]",
                label: "KPI Achievement",
                value: "0%",
                sub: "0 total entries",
              },
              {
                cardClass: "bg-[#fef6f4] border-[rgba(218,119,86,0.14)]",
                icon: Settings,
                iconColor: "text-[#DA7756]",
                label: "Issue Metrics",
                value: "0 days",
                sub: "0 total stuck issues",
              },
            ].map(({ cardClass, icon: Icon, iconColor, label, value, sub }) => (
              <div
                key={label}
                className={cn(
                  "rounded-2xl p-4 border flex gap-4 shadow-sm items-center",
                  cardClass
                )}
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-[rgba(218,119,86,0.12)]">
                  <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-0.5">
                    {label}
                  </div>
                  <div className="text-2xl font-extrabold text-[#7a341d] mb-1">
                    {value}
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-500">
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team KPIs */}
          <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] shadow-sm overflow-hidden">
            <div
              className="p-4 flex items-center justify-between cursor-pointer bg-[#fffaf8] hover:bg-[#fef6f4] transition-colors border-b border-[rgba(218,119,86,0.1)]"
              onClick={() => setIsKpiExpanded(!isKpiExpanded)}
            >
              <div>
                <div className="flex items-center gap-2 font-bold text-neutral-800 text-sm">
                  <TrendingUp className="w-4 h-4 text-[#DA7756]" /> Team Member
                  KPIs{" "}
                  <span className="px-2 py-0.5 rounded-full bg-[#DA7756] text-white text-[10px] font-bold">
                    {r.memberStats.length} KPIs
                  </span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {r.period.from} - {r.period.to} • Click to{" "}
                  {isKpiExpanded ? "collapse" : "expand"}
                </div>
              </div>
              {isKpiExpanded ? (
                <ChevronUp className="w-5 h-5 text-neutral-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-400" />
              )}
            </div>
            {isKpiExpanded && (
              <div className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
                {r.memberStats.length === 0 ? (
                  <div className="p-8 text-center text-sm text-neutral-400">
                    No Team Members Found
                  </div>
                ) : (
                  r.memberStats.map((member, i) => (
                    <div
                      key={i}
                      className="p-4 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-sm text-neutral-800">
                          {member.name || "Unknown Member"}
                        </div>
                        <span className="px-2 py-1 bg-[#FAECE7] text-[#993C1D] text-xs font-bold rounded-lg border border-[rgba(218,119,86,0.12)]">
                          {member.kpis?.length || 0} KPIs
                        </span>
                      </div>
                      {!member.kpis || member.kpis.length === 0 ? (
                        <div className="text-xs text-neutral-400">
                          No KPIs assigned
                        </div>
                      ) : (
                        <div className="space-y-2 mt-3">
                          {member.kpis.map((kpi, kIdx) => (
                            <div
                              key={kIdx}
                              className="flex justify-between items-center bg-white border border-neutral-100 p-2.5 rounded-xl"
                            >
                              <div>
                                <div className="text-sm font-semibold text-neutral-700">
                                  {kpi.name}
                                </div>
                                <div className="text-[10px] text-neutral-400 mt-0.5">
                                  {kpi.entries || 0} entries •{" "}
                                  {kpi.value || "0.0/0.0"} {kpi.unit}
                                </div>
                              </div>
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200">
                                {kpi.score || "0%"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsTab;
