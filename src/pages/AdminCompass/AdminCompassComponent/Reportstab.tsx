// ─────────────────────────────────────────────
// ReportsTab.jsx — Unified Modern Theme
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
  Users,
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
import { periodOptions, getAuthHeaders } from "./Shared";

// ── DATA NORMALIZATION & FALLBACKS ──
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
    _raw: raw,
  };
};

// ── APIs FOR DYNAMIC DATA ──

// 1. Fetch Dynamic Meetings Dropdown
const fetchDynamicMeetings = async () => {
  const res = await fetch(
    `https://fm-uat-api.lockated.com/daily_meeting_configs`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const raw = await res.text();
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    json = [];
  }

  let list = [];
  if (Array.isArray(json)) list = json;
  else if (Array.isArray(json.data?.daily_meeting_configs))
    list = json.data.daily_meeting_configs;
  else if (Array.isArray(json.data?.meeting_configs))
    list = json.data.meeting_configs;
  else if (Array.isArray(json.data)) list = json.data;
  else if (Array.isArray(json.daily_meeting_configs))
    list = json.daily_meeting_configs;

  return list.map((m) => ({
    id: String(m.id),
    label: m.name ?? m.title ?? m.label ?? `Meeting ${m.id}`,
  }));
};

// 2. Fetch Report Stats
const fetchDynamicReport = async ({ meetingId, period }) => {
  const url = new URL(
    "https://fm-uat-api.lockated.com/user_journals/daily_meeting_report"
  );
  if (meetingId && meetingId !== "all") {
    url.searchParams.append("meeting_id", meetingId);
  }
  if (period) {
    url.searchParams.append("period", period);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const raw = await res.text();
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

// 3. Fetch Single Date Status from Daily API
const fetchDailyMeetingStatusForCalendar = async (dateStr, meetingId) => {
  const url = new URL(
    "https://fm-uat-api.lockated.com/user_journals/daily_meeting"
  );
  url.searchParams.append("date", dateStr);

  if (meetingId && meetingId !== "all") {
    url.searchParams.append("meeting_id", meetingId);
  }

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) return "missed";
    const json = await res.json();

    // Find the exact date inside the date_row array returned by API
    const dateRow = json.data?.date_row || [];
    const targetDateObj = dateRow.find((d) => d.full_date === dateStr);

    if (targetDateObj) {
      return targetDateObj.status === "non_meeting"
        ? "holiday"
        : targetDateObj.status;
    }
    return "missed"; // Fallback if date not found
  } catch (err) {
    return "missed";
  }
};

// ── MAIN COMPONENT ──
const ReportsTab = () => {
  // Main States
  const [dynamicMeetings, setDynamicMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState("all");
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("last_7_days");

  // Report States
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isKpiExpanded, setIsKpiExpanded] = useState(false);

  // Calendar States
  const [weekOffset, setWeekOffset] = useState(0);
  const [weeklyStatusData, setWeeklyStatusData] = useState([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  // 1. Fetch Meetings List on Mount
  useEffect(() => {
    const loadMeetingsDropdown = async () => {
      setIsFetchingMeetings(true);
      try {
        const fetchedList = await fetchDynamicMeetings();
        setDynamicMeetings(fetchedList);
      } catch (err) {
        console.error("Failed to load meetings", err);
      } finally {
        setIsFetchingMeetings(false);
      }
    };
    loadMeetingsDropdown();
  }, []);

  // 2. Fetch Main Report
  const loadReport = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const raw = await fetchDynamicReport({
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

  // 3. Fetch Exactly Last 7 Days Calendar Status
  const loadCalendarWeek = async () => {
    setIsCalendarLoading(true);
    try {
      // Base date is Today minus weekOffset (e.g. if offset is 0, base is Today)
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - weekOffset * 7);

      const daysToFetch = [];

      // Generate exactly 7 days ending on baseDate (i = 6 down to 0)
      for (let i = 6; i >= 0; i--) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() - i);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
        const dateNum = d.getDate().toString();

        daysToFetch.push({
          day: dayName,
          date: dateNum,
          dateStr: dateStr,
          isWeekend: dayName === "Sat" || dayName === "Sun",
        });
      }

      // Fetch statuses for the 7 dates concurrently
      const weekResults = await Promise.all(
        daysToFetch.map(async (dayObj) => {
          // Automatic holiday fallback for weekends to save API calls / logic
          if (dayObj.isWeekend) {
            return { ...dayObj, status: "holiday" };
          }
          const status = await fetchDailyMeetingStatusForCalendar(
            dayObj.dateStr,
            selectedMeetingId
          );
          return { ...dayObj, status };
        })
      );

      setWeeklyStatusData(weekResults);
    } catch (err) {
      console.error(err);
      setWeeklyStatusData([]);
    } finally {
      setIsCalendarLoading(false);
    }
  };

  // Re-fetch report when dropdowns change
  useEffect(() => {
    loadReport();
  }, [selectedMeetingId, selectedPeriod]);

  // Re-fetch calendar when offset or meeting changes
  useEffect(() => {
    loadCalendarWeek();
  }, [weekOffset, selectedMeetingId]);

  const r = report;
  const weekLabel =
    weekOffset === 0 ? "Last 7 Days" : `${weekOffset} weeks ago`;

  return (
    <div
      className="space-y-6 pb-12  min-h-screen "
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Header and Controls */}
      <div className="bg-white rounded-[32px] border border-[#F0EBE8] shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-[48px] h-[48px] rounded-[14px] bg-[#FDF5F1] border border-[#F6E1D7] flex items-center justify-center shrink-0">
              <BarChart2 className="w-6 h-6 text-[#D37E5F]" />
            </div>
            <div>
              <h2 className="text-[22px] font-black text-[#1A1A1A] tracking-tight">
                Meeting Reports
              </h2>
              <p className="text-[12px] font-bold text-[#8C8580] uppercase tracking-widest mt-1">
                {selectedMeetingId === "all"
                  ? "All Meetings Data"
                  : r?.config?.name || "Loading..."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="relative">
              <select
                value={selectedMeetingId}
                onChange={(e) => setSelectedMeetingId(e.target.value)}
                disabled={isFetchingMeetings}
                className="appearance-none border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] pl-5 pr-10 py-3 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A] min-w-[160px] w-full disabled:opacity-50"
              >
                {isFetchingMeetings ? (
                  <option value="all">Loading Meetings...</option>
                ) : (
                  <>
                    <option value="all">All Meetings</option>
                    {dynamicMeetings.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.label}
                      </option>
                    ))}
                  </>
                )}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580] pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] pl-5 pr-10 py-3 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A] min-w-[160px] w-full"
              >
                {periodOptions.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580] pointer-events-none" />
            </div>

            <button
              onClick={() => {
                loadReport();
                loadCalendarWeek();
              }}
              disabled={isLoading || isCalendarLoading}
              className="w-[46px] h-[46px] flex items-center justify-center border border-[#F0EBE8] rounded-[16px] bg-white text-[#8C8580] hover:text-[#1A1A1A] hover:bg-gray-50 transition-all shrink-0 disabled:opacity-50"
            >
              <RefreshCw
                className={cn(
                  "w-5 h-5",
                  (isLoading || isCalendarLoading) &&
                    "animate-spin text-[#EB4A4A]"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      {apiError && (
        <div className="bg-[#EB4A4A]/10 text-[#EB4A4A] text-sm font-bold p-5 rounded-[20px] flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {apiError.includes("No Auth Token")
            ? "No auth token — save it in Settings tab first."
            : `API error: ${apiError}`}
        </div>
      )}

      {isLoading && (
        <div className="space-y-6 animate-pulse">
          <div className="h-36 bg-[#F0EBE8] rounded-[24px]" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-[#F0EBE8] rounded-[20px]" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-64 bg-[#F0EBE8] rounded-[24px]" />
            <div className="h-64 bg-[#F0EBE8] rounded-[24px]" />
          </div>
        </div>
      )}

      {!isLoading && !apiError && !r && (
        <div className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-[#F0EBE8] rounded-[32px] bg-white">
          <BarChart2 size={56} className="mb-4 text-[#F0EBE8]" />
          <p className="text-sm font-bold text-[#8C8580]">
            No report data for this period
          </p>
        </div>
      )}

      {!isLoading && r && (
        <div className="space-y-6">
          {/* Calendar Section (Read Only - Only Past 7 Days) */}
          <div className="bg-white rounded-[32px] border border-[#F0EBE8] shadow-sm p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3 text-[#1A1A1A] font-black text-lg">
                <div className="w-10 h-10 rounded-[12px] bg-[#FDF5F1] border border-[#F6E1D7] flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#D37E5F]" />
                </div>
                Meeting Status
                <span className="text-[#8C8580] text-sm ml-1 font-bold bg-[#FCFAFA] px-3 py-1 rounded-[8px] border border-[#F0EBE8]">
                  {weekLabel}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWeekOffset((prev) => prev + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-[#F0EBE8] rounded-[12px] hover:bg-gray-50 text-[#8C8580] hover:text-[#1A1A1A] transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                  disabled={weekOffset === 0}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center border border-[#F0EBE8] rounded-[12px] transition-colors",
                    weekOffset === 0
                      ? "opacity-30 cursor-not-allowed bg-gray-50"
                      : "hover:bg-gray-50 text-[#8C8580] hover:text-[#1A1A1A]"
                  )}
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Visual feedback while calendar API fetches */}
            <div
              className={cn(
                "flex gap-[18px] overflow-x-auto pb-4 pt-1 transition-opacity duration-300",
                isCalendarLoading ? "opacity-40" : "opacity-100"
              )}
              style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
            >
              {weeklyStatusData.map((dateItem, i) => {
                let bg, textColor, labelBg, labelColor, displayLabel;
                const status = dateItem.status;

                // STRICT COLORS based on requirement
                if (status === "missed") {
                  bg = "#F34A4A";
                  textColor = "#FFFFFF";
                  labelBg = "rgba(255,255,255,0.25)";
                  labelColor = "#FFFFFF";
                  displayLabel = "Miss";
                } else if (status === "holiday") {
                  bg = "#F5D142";
                  textColor = "#8A6D3B";
                  labelBg = "rgba(0,0,0,0.08)";
                  labelColor = "#8A6D3B";
                  displayLabel = "Holiday";
                } else if (
                  status === "submitted" ||
                  status === "fill" ||
                  status === "done"
                ) {
                  bg = "#2ECC71";
                  textColor = "#FFFFFF";
                  labelBg = "rgba(255,255,255,0.25)";
                  labelColor = "#FFFFFF";
                  displayLabel = "Filled";
                } else {
                  // Fallback for anything else in the past (treated as missed/unknown)
                  bg = "#F3F4F6";
                  textColor = "#6B7280";
                  labelBg = "#E5E7EB";
                  labelColor = "#9CA3AF";
                  displayLabel = "N/A";
                }

                return (
                  <div
                    key={dateItem.dateStr || i}
                    className="relative flex-shrink-0 mt-1 ml-1 select-none"
                  >
                    <div
                      className="flex flex-col items-center justify-center rounded-[16px] cursor-default"
                      style={{
                        width: 90,
                        height: 110,
                        background: bg,
                        color: textColor,
                        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                      }}
                    >
                      <span
                        className="text-[11px] font-extrabold uppercase tracking-widest mb-1 opacity-90"
                        style={{ color: textColor }}
                      >
                        {dateItem.day}
                      </span>
                      <span
                        className="text-[30px] font-bold leading-none"
                        style={{ color: textColor }}
                      >
                        {dateItem.date}
                      </span>
                      <div
                        className="mt-2.5 h-[18px] px-3 rounded-full flex items-center justify-center text-[9px] font-extrabold uppercase tracking-widest"
                        style={{ background: labelBg, color: labelColor }}
                      >
                        {displayLabel}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* UPDATED LEGEND - No 'Upcoming' */}
            <div className="flex gap-x-8 gap-y-3 text-[11px] font-extrabold flex-wrap justify-center text-[#9A938E] tracking-[0.1em] uppercase mt-4">
              <div className="flex items-center gap-2.5">
                <span className="w-[15px] h-[15px] rounded-full bg-[#2ECC71]" />{" "}
                Filled
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-[15px] h-[15px] rounded-full bg-[#F34A4A]" />{" "}
                Missed
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-[15px] h-[15px] rounded-full bg-[#F5D142]" />{" "}
                Holiday
              </div>
            </div>
          </div>

          {/* Dynamic KPI Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Meetings This Month",
                val: r.meetingsThisMonth ?? 0,
                sub: "Calculated from API",
                icon: Calendar,
                color: "text-[#DAB835]",
                bg: "bg-[#FCFAFA]",
              },
              {
                label: "Attendance Rate",
                val: `${Number(r.attendanceRate || 0).toFixed(1)}%`,
                sub: "Overall Attendance",
                icon: CheckCircle2,
                color: "text-[#2ECC71]",
                bg: "bg-[#FCFAFA]",
              },
              {
                label: "Avg Self-Rating",
                val: `${r.avgSelfRating ? Number(r.avgSelfRating).toFixed(1) : "0.0"}/10`,
                sub: "Team average",
                icon: TrendingUp,
                color: "text-[#EB4A4A]",
                bg: "bg-[#FCFAFA]",
              },
              {
                label: "Unresolved",
                val: r.unresolvedTasks ?? 0,
                sub: "Total stuck issues",
                icon: AlertTriangle,
                color: "text-[#DAB835]",
                bg: "bg-[#FCFAFA]",
              },
            ].map((metric, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[24px] p-6 border border-[#F0EBE8] flex flex-col justify-between shadow-sm",
                  metric.bg
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="text-[11px] font-black text-[#8C8580] tracking-widest uppercase mb-3 leading-snug">
                    {metric.label}
                  </div>
                  <div className="w-10 h-10 rounded-[12px] bg-white border border-[#F0EBE8] flex items-center justify-center shrink-0">
                    <metric.icon className={cn("w-5 h-5", metric.color)} />
                  </div>
                </div>
                <div>
                  <div className="text-[32px] font-black text-[#1A1A1A] leading-none mb-2">
                    {metric.val}
                  </div>
                  <div className="text-[11px] font-bold text-[#8C8580] uppercase tracking-wider">
                    {metric.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] border border-[#F0EBE8] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6 text-sm font-black text-[#1A1A1A] uppercase tracking-wider">
                <div className="w-8 h-8 rounded-[8px] bg-[#2ECC71]/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#2ECC71]" />
                </div>
                Attendance Trend
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={r.activityTrend || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F0EBE8"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#8C8580", fontWeight: "bold" }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#8C8580", fontWeight: "bold" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      fontWeight: "bold",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#2ECC71"
                    strokeWidth={3}
                    fill="#2ECC71"
                    fillOpacity={0.15}
                    name="Attendance %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-[24px] border border-[#F0EBE8] shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6 text-sm font-black text-[#1A1A1A] uppercase tracking-wider">
                <div className="w-8 h-8 rounded-[8px] bg-[#EB4A4A]/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-[#EB4A4A]" />
                </div>
                KPI Achievement
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <ReLineChart data={r.kpiTrend || []}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F0EBE8"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#8C8580", fontWeight: "bold" }}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#8C8580", fontWeight: "bold" }}
                    axisLine={false}
                    tickLine={false}
                    domain={[0, 100]}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                      fontWeight: "bold",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="kpi"
                    stroke="#EB4A4A"
                    strokeWidth={3}
                    dot={{
                      fill: "#EB4A4A",
                      r: 4,
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6 }}
                    name="KPI %"
                  />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Issue & KPI Sub Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: AlertTriangle,
                iconColor: "text-[#EB4A4A]",
                label: "Issue Resolution",
                value: "0%",
                sub: "0 Resolved · 0 Open",
              },
              {
                icon: Activity,
                iconColor: "text-[#2ECC71]",
                label: "KPI Achievement",
                value: "0%",
                sub: "0 total entries",
              },
              {
                icon: Settings,
                iconColor: "text-[#DAB835]",
                label: "Issue Metrics",
                value: "0 days",
                sub: "0 total stuck issues",
              },
            ].map(({ icon: Icon, iconColor, label, value, sub }) => (
              <div
                key={label}
                className="bg-white rounded-[20px] p-5 border border-[#F0EBE8] flex gap-4 shadow-sm items-center"
              >
                <div className="w-12 h-12 rounded-[14px] bg-[#FCFAFA] flex items-center justify-center shrink-0 border border-[#F0EBE8]">
                  <Icon className={cn("w-6 h-6", iconColor)} />
                </div>
                <div>
                  <div className="text-[10px] font-black text-[#8C8580] uppercase tracking-widest mb-1">
                    {label}
                  </div>
                  <div className="text-[20px] font-black text-[#1A1A1A] mb-0.5 leading-none">
                    {value}
                  </div>
                  <div className="text-[11px] font-bold text-[#8C8580]">
                    {sub}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Team KPIs Accordion */}
          <div className="bg-white rounded-[24px] border border-[#F0EBE8] shadow-sm overflow-hidden">
            <div
              className="p-6 flex items-center justify-between cursor-pointer bg-[#FCFAFA] hover:bg-gray-50 transition-colors"
              onClick={() => setIsKpiExpanded(!isKpiExpanded)}
            >
              <div>
                <div className="flex items-center gap-3 font-black text-[#1A1A1A] text-base uppercase tracking-wider">
                  <div className="w-8 h-8 rounded-[8px] bg-white border border-[#F0EBE8] flex items-center justify-center">
                    <Users className="w-4 h-4 text-[#8C8580]" />
                  </div>
                  Team Member KPIs
                  <span className="px-3 py-1 rounded-[8px] bg-[#1A1A1A] text-white text-[10px] font-bold tracking-widest ml-2">
                    {r.memberStats?.length || 0} Members
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 flex items-center justify-center bg-white border border-[#F0EBE8] rounded-[12px]">
                {isKpiExpanded ? (
                  <ChevronUp className="w-5 h-5 text-[#8C8580]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#8C8580]" />
                )}
              </div>
            </div>

            {isKpiExpanded && (
              <div className="divide-y divide-[#F0EBE8] max-h-[500px] overflow-y-auto p-4 bg-white">
                {!r.memberStats || r.memberStats.length === 0 ? (
                  <div className="p-10 text-center text-sm font-bold text-[#8C8580]">
                    No Team Members Found
                  </div>
                ) : (
                  r.memberStats.map((member, i) => (
                    <div
                      key={i}
                      className="p-4 bg-[#FCFAFA] rounded-[16px] mb-3 border border-[#F0EBE8] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-black text-sm text-[#1A1A1A] uppercase tracking-wider">
                          {member.name || "Unknown Member"}
                        </div>
                        <span className="px-3 py-1 bg-white text-[#8C8580] text-[10px] font-bold uppercase tracking-widest rounded-[8px] border border-[#F0EBE8]">
                          {member.kpis?.length || 0} Assigned KPIs
                        </span>
                      </div>

                      {!member.kpis || member.kpis.length === 0 ? (
                        <div className="text-xs font-bold text-[#8C8580] italic">
                          No KPIs assigned to this user.
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {member.kpis.map((kpi, kIdx) => (
                            <div
                              key={kIdx}
                              className="flex justify-between items-center bg-white border border-[#F0EBE8] p-4 rounded-[14px]"
                            >
                              <div>
                                <div className="text-sm font-black text-[#1A1A1A] mb-1">
                                  {kpi.name}
                                </div>
                                <div className="text-[11px] font-bold text-[#8C8580] uppercase tracking-wider">
                                  {kpi.entries || 0} entries •{" "}
                                  {kpi.value || "0.0/0.0"} {kpi.unit}
                                </div>
                              </div>
                              <span className="px-3 py-1.5 bg-[#EB4A4A] text-white text-[11px] font-black rounded-[8px] min-w-[45px] text-center">
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
