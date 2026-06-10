// ─────────────────────────────────────────────
// ReportsTab.tsx — Enhanced UI
// ─────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart2,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity,
  Settings2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  Users,
  Star,
  Target,
  Zap,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import { periodOptions, getAuthHeaders, getBaseUrl } from "./Shared";

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
      ? data.activity_trend.map((d) => ({
        date: d.date,
        attendance: d.count || 0,
      }))
      : generateEmptyTrendForReport(endDate, 7),
    kpiTrend: validKpiTrend
      ? data.kpi_trend.map((d) => ({ date: d.date, kpi: d.avg_score || 0 }))
      : generateEmptyTrendForReport(endDate, 7),
    memberStats: Array.isArray(data.member_stats) ? data.member_stats : [],
    _raw: raw,
  };
};

// ── PILL SELECT ──
const PillSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const selected = options.find((o) => String(o.value) === String(value));

  React.useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative shrink-0" style={{ fontFamily: "'Inter', sans-serif" }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 bg-white border rounded-full px-4 py-1.5 text-sm font-medium transition-all",
          open ? "border-[#DA7756] shadow-sm" : "border-gray-200 hover:border-gray-300",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="text-gray-800 text-sm">
          {disabled ? "Loading…" : selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={cn("w-3.5 h-3.5 text-gray-500 transition-transform", open && "rotate-180")} />
      </button>

      {open && !disabled && (
        <div
          className="absolute top-full left-0 mt-1.5 z-[999] bg-white border border-gray-100 rounded-2xl overflow-hidden min-w-full"
          style={{ maxHeight: 220, overflowY: "auto", boxShadow: "0 8px 24px rgba(0,0,0,0.10)" }}
        >
          <div className="py-1.5">
            {options.map((opt) => {
              const isSelected = String(value) === String(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(String(opt.value)); setOpen(false); }}
                  className={cn(
                    "w-full text-left px-4 py-2 text-sm transition-colors",
                    isSelected ? "bg-orange-50 text-[#DA7756] font-semibold" : "text-gray-700 hover:bg-gray-50"
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── APIS ──
const fetchDynamicMeetings = async () => {
  const res = await fetch(`${getBaseUrl()}/daily_meeting_configs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const raw = await res.text();
  let json;
  try { json = JSON.parse(raw); } catch { json = []; }

  let list = [];
  if (Array.isArray(json)) list = json;
  else if (Array.isArray(json.data?.daily_meeting_configs)) list = json.data.daily_meeting_configs;
  else if (Array.isArray(json.data?.meeting_configs)) list = json.data.meeting_configs;
  else if (Array.isArray(json.data)) list = json.data;
  else if (Array.isArray(json.daily_meeting_configs)) list = json.daily_meeting_configs;

  return list.map((m) => ({
    id: String(m.id),
    label: m.name ?? m.title ?? m.label ?? `Meeting ${m.id}`,
    is_default: m.is_default || m.isDefault || false,
  }));
};

const fetchDynamicReport = async ({ meetingId, period }) => {
  const url = new URL(`${getBaseUrl()}/user_journals/daily_meeting_report`);
  if (meetingId) url.searchParams.append("meeting_id", meetingId);
  if (period) url.searchParams.append("period", period);

  const res = await fetch(url.toString(), { method: "GET", headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
  const raw = await res.text();
  try { return JSON.parse(raw); } catch { return null; }
};

const fetchDailyMeetingStatusForCalendar = async (dateStr, meetingId) => {
  const url = new URL(`${getBaseUrl()}/user_journals/daily_meeting`);
  url.searchParams.append("date", dateStr);
  if (meetingId) url.searchParams.append("meeting_id", meetingId);

  try {
    const res = await fetch(url.toString(), { method: "GET", headers: getAuthHeaders() });
    if (!res.ok) return "missed";
    const json = await res.json();
    const dateRow = json.data?.date_row || [];
    const targetDateObj = dateRow.find((d) => d.full_date === dateStr);
    if (targetDateObj) {
      return targetDateObj.status === "non_meeting" ? "holiday" : targetDateObj.status;
    }
    return "missed";
  } catch { return "missed"; }
};

// ── STAT CARD ──
const StatCard = ({ icon: Icon, iconBg, iconColor, accentColor, label, value, sub }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
    <div className="h-1 w-full" style={{ background: accentColor }} />
    <div className="p-4 flex flex-col justify-between flex-1">
      <div className="flex items-center gap-2 mb-3">
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
          <Icon className={cn("w-4 h-4", iconColor)} />
        </div>
        <span className="text-xs text-gray-500 font-medium leading-snug">{label}</span>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</div>
        <div className="text-[11px] text-gray-400 font-medium">{sub}</div>
      </div>
    </div>
  </div>
);

// ── CHART TOOLTIP ──
const ChartTooltipStyle = {
  borderRadius: "12px",
  border: "1px solid #F3F4F6",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "'Inter', sans-serif",
};

// ── MAIN COMPONENT ──
const ReportsTab = ({
  selectedMeetingId: externalSelectedMeetingId,
  onSelectedMeetingChange,
} = {}) => {
  const [dynamicMeetings, setDynamicMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingIdState] = useState(externalSelectedMeetingId || "");
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("last_7_days");

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isKpiExpanded, setIsKpiExpanded] = useState(false);

  const [weekOffset, setWeekOffset] = useState(0);
  const [weeklyStatusData, setWeeklyStatusData] = useState([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  useEffect(() => {
    if (!externalSelectedMeetingId) return;
    setSelectedMeetingIdState((current) =>
      current === externalSelectedMeetingId ? current : externalSelectedMeetingId
    );
  }, [externalSelectedMeetingId]);

  const setSelectedMeetingId = (meetingId) => {
    setSelectedMeetingIdState(meetingId);
    if (meetingId) onSelectedMeetingChange?.(String(meetingId));
  };

  useEffect(() => {
    const loadMeetingsDropdown = async () => {
      setIsFetchingMeetings(true);
      try {
        const fetchedList = await fetchDynamicMeetings();
        setDynamicMeetings(fetchedList);
        if (fetchedList.length > 0) {
          const defaultMeeting = fetchedList.find((m) => m.is_default);
          if (externalSelectedMeetingId) {
            setSelectedMeetingId(String(externalSelectedMeetingId));
          } else if (defaultMeeting) {
            setSelectedMeetingId(String(defaultMeeting.id));
          } else {
            setSelectedMeetingId(String(fetchedList[0].id));
          }
        }
      } catch (err) {
        console.error("Failed to load meetings", err);
      } finally {
        setIsFetchingMeetings(false);
      }
    };
    loadMeetingsDropdown();
  }, [externalSelectedMeetingId]);

  const loadReport = useCallback(async () => {
    if (!selectedMeetingId) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const raw = await fetchDynamicReport({ meetingId: selectedMeetingId, period: selectedPeriod });
      setReport(normalizeReport(raw));
    } catch (err) {
      setApiError(err.message);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMeetingId, selectedPeriod]);

  const loadCalendarWeek = useCallback(async () => {
    if (!selectedMeetingId) return;
    setIsCalendarLoading(true);
    try {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - weekOffset * 7);

      const daysToFetch = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() - i);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
        const dateNum = d.getDate().toString();
        daysToFetch.push({ day: dayName, date: dateNum, dateStr, isWeekend: dayName === "Sat" || dayName === "Sun" });
      }

      const weekResults = await Promise.all(
        daysToFetch.map(async (dayObj) => {
          if (dayObj.isWeekend) return { ...dayObj, status: "holiday" };
          const status = await fetchDailyMeetingStatusForCalendar(dayObj.dateStr, selectedMeetingId);
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
  }, [weekOffset, selectedMeetingId]);

  useEffect(() => { loadReport(); }, [loadReport]);
  useEffect(() => { loadCalendarWeek(); }, [loadCalendarWeek]);

  const r = report;

  const getCalendarDateLabel = () => {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - weekOffset * 7);
    const end = new Date(baseDate);
    const fmt = (d) =>
      d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    return `Daily Report for ${fmt(end)}`;
  };

  return (
    <div className="space-y-5 pb-12" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── TOP HEADER ROW ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-[#DA7756]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-none">Meetings Report</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium">Analytics & attendance overview</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <PillSelect
            value={selectedMeetingId}
            onChange={(val) => setSelectedMeetingId(String(val))}
            disabled={isFetchingMeetings}
            placeholder="Select Meeting"
            options={dynamicMeetings.map((m) => ({ value: String(m.id), label: m.label }))}
          />
          <PillSelect
            value={selectedPeriod}
            onChange={setSelectedPeriod}
            placeholder="Period"
            options={periodOptions}
          />
          <button
            onClick={() => { loadReport(); loadCalendarWeek(); }}
            disabled={isLoading || isCalendarLoading}
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-[#DA7756] hover:border-orange-200 transition-all disabled:opacity-40 shadow-sm"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", (isLoading || isCalendarLoading) && "animate-spin text-[#DA7756]")} />
          </button>
        </div>
      </div>

      {apiError && (
        <div className="bg-red-50 text-red-600 text-sm font-medium p-4 rounded-2xl flex items-center gap-3 border border-red-100">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {apiError.includes("No Auth Token")
            ? "No auth token — save it in Settings tab first."
            : `API error: ${apiError}`}
        </div>
      )}

      {/* ── SKELETON ── */}
      {isLoading && (
        <div className="space-y-5 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 h-[220px]" />
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 h-[100px]" />
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5 h-12" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 h-[300px]" />
            <div className="bg-white rounded-2xl border border-gray-100 p-5 h-[300px]" />
          </div>
        </div>
      )}

      {!isLoading && !apiError && !r && (
        <div className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-gray-100 rounded-2xl bg-white">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
            <BarChart2 size={28} className="text-[#DA7756]" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No report data for this period</p>
          <p className="text-xs text-gray-400 mt-1">Select a meeting and period to load analytics</p>
        </div>
      )}

      {!isLoading && r && (
        <div className="space-y-5">

          {/* ── ROW 1: Calendar (left) + KPI Stats (right) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5">

            {/* Calendar Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 pt-5 pb-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Weekly View</p>
                    <p className="text-sm font-semibold text-gray-700">{getCalendarDateLabel()}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setWeekOffset((prev) => prev + 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setWeekOffset((prev) => Math.max(0, prev - 1))}
                      disabled={weekOffset === 0}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 bg-white transition-colors",
                        weekOffset === 0 ? "opacity-30 cursor-not-allowed text-gray-300" : "hover:bg-gray-50 hover:border-gray-300 text-gray-400 hover:text-gray-700"
                      )}
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Day cards row */}
                <div
                  className={cn(
                    "flex gap-2 overflow-x-auto pb-1 transition-opacity duration-200",
                    isCalendarLoading ? "opacity-40" : "opacity-100"
                  )}
                  style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
                >
                  {weeklyStatusData.map((dateItem, i) => {
                    const status = dateItem.status;
                    const isToday = weekOffset === 0 && i === weeklyStatusData.length - 1;

                    let topBarColor = "#E5E7EB";
                    let cardBg = "#F9FAFB";
                    let borderColor = "#E5E7EB";
                    let dayColor = "#9CA3AF";
                    let numColor = "#9CA3AF";
                    let hasDot = false;

                    if (isToday) {
                      topBarColor = "#DA7756";
                      cardBg = "#fff";
                      borderColor = "#DA7756";
                      dayColor = "#6B7280";
                      numColor = "#111827";
                      hasDot = true;
                    } else if (status === "submitted" || status === "fill" || status === "done") {
                      topBarColor = "#2DD4BF";
                      cardBg = "#F0FDFA";
                      borderColor = "#99F6E4";
                      dayColor = "#0F766E";
                      numColor = "#0F766E";
                    } else if (status === "missed") {
                      topBarColor = "#F87171";
                      cardBg = "#FFF5F5";
                      borderColor = "#FCA5A5";
                      dayColor = "#DC2626";
                      numColor = "#DC2626";
                    } else if (status === "holiday") {
                      topBarColor = "#D1D5DB";
                      cardBg = "#F9FAFB";
                      borderColor = "#E5E7EB";
                      dayColor = "#9CA3AF";
                      numColor = "#9CA3AF";
                    }

                    return (
                      <div
                        key={dateItem.dateStr || i}
                        className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl relative select-none overflow-hidden"
                        style={{
                          width: 72,
                          height: 88,
                          background: cardBg,
                          border: `1.5px solid ${borderColor}`,
                        }}
                      >
                        {/* Colored top bar */}
                        <div
                          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                          style={{ background: topBarColor }}
                        />
                        {hasDot && (
                          <span
                            className="absolute rounded-full"
                            style={{ width: 7, height: 7, top: 8, right: 8, background: "#DA7756" }}
                          />
                        )}
                        <span
                          className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 mt-1"
                          style={{ color: dayColor }}
                        >
                          {dateItem.day}
                        </span>
                        <span
                          className="text-[26px] font-bold leading-none"
                          style={{ color: numColor }}
                        >
                          {dateItem.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 flex-wrap px-5 py-3 border-t border-gray-50 bg-gray-50/50">
                {[
                  { color: "#2DD4BF", label: "Filled" },
                  { color: "#F87171", label: "Missed" },
                  { color: "#D1D5DB", label: "Holiday" },
                  { color: "#DA7756", label: "Today" },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                    <span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* KPI Stats 2×2 */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard
                icon={Calendar}
                iconBg="bg-blue-50"
                iconColor="text-blue-500"
                accentColor="#3B82F6"
                label="Meetings this month"
                value={r.meetingsThisMonth ?? 0}
                sub="Calculated from API"
              />
              <StatCard
                icon={CheckCircle2}
                iconBg="bg-green-50"
                iconColor="text-green-500"
                accentColor="#22C55E"
                label="Attendance rate"
                value={`${Number(r.attendanceRate || 0).toFixed(1)} %`}
                sub="Overall attendance"
              />
              <StatCard
                icon={Star}
                iconBg="bg-amber-50"
                iconColor="text-amber-500"
                accentColor="#F59E0B"
                label="Average self rating"
                value={`${r.avgSelfRating ? Number(r.avgSelfRating).toFixed(1) : "0.0"}/10`}
                sub="Team average"
              />
              <StatCard
                icon={AlertTriangle}
                iconBg="bg-red-50"
                iconColor="text-red-500"
                accentColor="#EF4444"
                label="Unresolved"
                value={r.unresolvedTasks ?? 0}
                sub="Total stuck issues"
              />
            </div>
          </div>

          {/* ── ROW 2: Filter bar ── */}
          <div className="flex items-center gap-6 bg-white rounded-2xl border border-gray-100 px-5 py-3 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Meetings</span>
              <PillSelect
                value={selectedMeetingId}
                onChange={(val) => setSelectedMeetingId(String(val))}
                disabled={isFetchingMeetings}
                placeholder="Select Meeting"
                options={dynamicMeetings.map((m) => ({ value: String(m.id), label: m.label }))}
              />
            </div>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Members</span>
              <PillSelect
                value=""
                onChange={() => {}}
                placeholder="All members"
                options={[
                  { value: "", label: "All members" },
                  ...(r.memberStats || []).map((m, i) => ({ value: String(i), label: m.name || `Member ${i + 1}` })),
                ]}
              />
            </div>
          </div>

          {/* ── ROW 3: Charts ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

            {/* Attendance Trend */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #22C55E, #4ADE80)" }} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Attendance Trend</p>
                      <p className="text-[11px] text-gray-400 font-medium">Daily meeting participation</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">
                    {r.activityTrend?.length || 0} days
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={r.activityTrend || []}>
                    <defs>
                      <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.18} />
                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}
                      axisLine={false}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                      dx={-8}
                    />
                    <Tooltip contentStyle={ChartTooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="attendance"
                      stroke="#22C55E"
                      strokeWidth={2.5}
                      fill="url(#attendanceGradient)"
                      dot={{ fill: "#22C55E", r: 4, strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6, fill: "#22C55E" }}
                      name="Attendance %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* KPI Achievement */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #EF4444, #F87171)" }} />
              <div className="p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center">
                      <Activity className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">KPI Achievement</p>
                      <p className="text-[11px] text-gray-400 font-medium">Performance score over time</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                    {r.kpiTrend?.length || 0} days
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={r.kpiTrend || []}>
                    <defs>
                      <linearGradient id="kpiGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}
                      axisLine={false}
                      tickLine={false}
                      dy={8}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9CA3AF", fontFamily: "'Inter', sans-serif" }}
                      axisLine={false}
                      tickLine={false}
                      domain={[0, 100]}
                      dx={-8}
                    />
                    <Tooltip contentStyle={ChartTooltipStyle} />
                    <Area
                      type="monotone"
                      dataKey="kpi"
                      stroke="#EF4444"
                      strokeWidth={2.5}
                      fill="url(#kpiGradient)"
                      dot={{ fill: "#EF4444", r: 4, strokeWidth: 2, stroke: "#fff" }}
                      activeDot={{ r: 6, fill: "#EF4444" }}
                      name="KPI %"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── ROW 4: Sub Metric Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: AlertTriangle,
                iconColor: "text-red-500",
                iconBg: "bg-red-50",
                accentColor: "#EF4444",
                label: "Issue Resolution",
                value: "0%",
                sub: "0 Resolved · 0 Open",
              },
              {
                icon: Target,
                iconColor: "text-green-500",
                iconBg: "bg-green-50",
                accentColor: "#22C55E",
                label: "KPI Achievement",
                value: "0%",
                sub: "0 total entries",
              },
              {
                icon: Zap,
                iconColor: "text-amber-500",
                iconBg: "bg-amber-50",
                accentColor: "#F59E0B",
                label: "Issue Metrics",
                value: "0 days",
                sub: "0 total stuck issues",
              },
            ].map(({ icon: Icon, iconColor, iconBg, accentColor, label, value, sub }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-1" style={{ background: accentColor }} />
                <div className="p-4 flex gap-3 items-center">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
                    <Icon className={cn("w-5 h-5", iconColor)} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</div>
                    <div className="text-lg font-bold text-gray-900 leading-none mb-0.5">{value}</div>
                    <div className="text-[11px] font-medium text-gray-400">{sub}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── TEAM MEMBER KPIs Accordion ── */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              type="button"
              className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50/80 transition-colors text-left"
              onClick={() => setIsKpiExpanded(!isKpiExpanded)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-[#DA7756]" />
                </div>
                <span className="font-bold text-gray-900 text-sm">Team Member KPIs</span>
                <span
                  className="min-w-[28px] h-6 flex items-center justify-center rounded-full text-white text-xs font-bold px-2"
                  style={{ background: "#DA7756" }}
                >
                  {r.memberStats?.length || 0}
                </span>
              </div>
              <div className="w-7 h-7 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-xl transition-colors hover:bg-gray-100">
                {isKpiExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </div>
            </button>

            {isKpiExpanded && (
              <div className="border-t border-gray-100">
                {!r.memberStats || r.memberStats.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
                      <Users className="w-5 h-5 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">No team members found</p>
                  </div>
                ) : (
                  <div className="p-4 grid grid-cols-1 gap-3 max-h-[520px] overflow-y-auto">
                    {r.memberStats.map((member, i) => (
                      <div key={i} className="bg-gray-50/60 rounded-2xl border border-gray-100 p-4">
                        {/* Member header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0"
                              style={{ background: "#DA7756" }}
                            >
                              {(member.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-bold text-sm text-gray-900">{member.name || "Unknown Member"}</span>
                          </div>
                          <span className="px-2.5 py-0.5 bg-white border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-lg">
                            {member.kpis?.length || 0} KPIs
                          </span>
                        </div>

                        {/* KPI items */}
                        {!member.kpis || member.kpis.length === 0 ? (
                          <p className="text-xs font-medium text-gray-400 italic pl-1">No KPIs assigned.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {member.kpis.map((kpi, kIdx) => {
                              const score = parseInt(kpi.score) || 0;
                              const scoreColor = score >= 75 ? "#22C55E" : score >= 40 ? "#F59E0B" : "#EF4444";
                              return (
                                <div
                                  key={kIdx}
                                  className="flex justify-between items-center bg-white border border-gray-100 p-3 rounded-xl"
                                >
                                  <div className="flex-1 min-w-0 pr-2">
                                    <div className="text-sm font-semibold text-gray-900 truncate mb-0.5">{kpi.name}</div>
                                    <div className="text-[11px] font-medium text-gray-400">
                                      {kpi.entries || 0} entries · {kpi.value || "0.0/0.0"} {kpi.unit}
                                    </div>
                                    {/* Progress bar */}
                                    <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
                                      <div
                                        className="h-full rounded-full transition-all"
                                        style={{ width: `${Math.min(score, 100)}%`, background: scoreColor }}
                                      />
                                    </div>
                                  </div>
                                  <span
                                    className="px-2.5 py-1 text-white text-[11px] font-bold rounded-lg min-w-[44px] text-center shrink-0"
                                    style={{ background: scoreColor }}
                                  >
                                    {kpi.score || "0%"}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
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
