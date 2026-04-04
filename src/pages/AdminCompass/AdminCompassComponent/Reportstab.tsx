// ─────────────────────────────────────────────
// ReportsTab.jsx
// ─────────────────────────────────────────────
import React, { useState, useEffect, useCallback } from "react";
import {
  FileSpreadsheet, BarChart2, Calendar, AlertTriangle,
  CheckCircle2, TrendingUp, Activity, Settings,
  ChevronDown, ChevronUp, RefreshCw, X,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area,
  LineChart as ReLineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import { fetchMeetingReport, periodOptions, BtnIcon, BASE_URL, getAuthHeaders } from "./shared";

// ─────────────────────────────────────────────
// Meetings API
// ─────────────────────────────────────────────
const fetchMeetingsAPI = async () => {
  const res = await fetch(`${BASE_URL}/daily_meeting_configs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  const raw = await res.text();
  console.log("[Meetings] GET status:", res.status, "raw:", raw.slice(0, 400));
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try { json = JSON.parse(raw); } catch { json = []; }
  let list = [];
  if (Array.isArray(json))                                  list = json;
  else if (Array.isArray(json.data?.daily_meeting_configs)) list = json.data.daily_meeting_configs;
  else if (Array.isArray(json.data?.meeting_configs))       list = json.data.meeting_configs;
  else if (Array.isArray(json.data))                        list = json.data;
  else if (Array.isArray(json.daily_meeting_configs))       list = json.daily_meeting_configs;
  else if (Array.isArray(json.meeting_configs))             list = json.meeting_configs;
  console.log("[Meetings] parsed count:", list.length);
  return list.map((m) => ({
    id:    String(m.id),
    label: m.name ?? m.title ?? m.label ?? `Meeting ${m.id}`,
  }));
};

// ─────────────────────────────────────────────
// Calendar helpers (same as DailyTab)
// ─────────────────────────────────────────────
const fetchDailyMeetingCalendar = async (meetingId, date) => {
  const url = `${BASE_URL}/user_journals/daily_meeting?meeting_id=${meetingId}&date=${date}`;
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders() });
  const raw = await res.text();
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let json;
  try { json = JSON.parse(raw); } catch { json = {}; }
  return json?.data ?? json;
};

const labelFromFullDate = (fullDate) => {
  if (!fullDate) return "";
  const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
  const m = parseInt(fullDate.split("-")[1], 10);
  return months[m - 1] ?? "";
};

const mapDateStatus = (apiStatus, day, isToday) => {
  if (day === "Sun") return "holiday";
  
  // UPDATED: "non_meeting" always maps to "done" (green)
  if (apiStatus === "non_meeting") return "done";
  
  const map = { 
    missed:   "missed", 
    done:     "done", 
    holiday:  "holiday", 
    upcoming: "upcoming",
    today:    "today"
  };
  return map[apiStatus] ?? "upcoming";
};

const DATE_STATUS_STYLES = {
  done:     { bg: "#f0fdf4", text: "#16a34a", border: "#86efac" },
  missed:   { bg: "#fff5f5", text: "#ef4444", border: "#fca5a5" },
  holiday:  { bg: "#fffbeb", text: "#f59e0b", border: "#fcd34d" },
  upcoming: { bg: "#f3f4f6", text: "#9ca3af", border: "#e5e7eb" },
  today:    { bg: "rgba(218,119,86,0.15)", text: "#b85a38", border: "#DA7756" },
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
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
  const validActivityTrend = Array.isArray(data.activity_trend) && data.activity_trend.length > 0;
  const validKpiTrend      = Array.isArray(data.kpi_trend)      && data.kpi_trend.length      > 0;
  const endDate = data.period?.to;
  return {
    period:            data.period           || { from: "", to: "" },
    config:            data.config           || {},
    meetingsThisMonth: data.meetings_this_month ?? 0,
    attendanceRate:    data.attendance_rate  ?? 0,
    avgSelfRating:     data.avg_self_rating  ?? 0,
    unresolvedTasks:   data.unresolved_tasks ?? 0,
    activityTrend:     validActivityTrend ? data.activity_trend : generateEmptyTrendForReport(endDate, 7),
    kpiTrend:          validKpiTrend      ? data.kpi_trend      : generateEmptyTrendForReport(endDate, 7),
    memberStats:       Array.isArray(data.member_stats) ? data.member_stats : [],
    weeklyHistory:     Array.isArray(data.history)      ? data.history      : [],
    _raw: raw,
  };
};

// ─────────────────────────────────────────────
// ReportsTab
// ─────────────────────────────────────────────
const ReportsTab = () => {
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [selectedPeriod, setSelectedPeriod]       = useState("last_7_days");
  const [report, setReport]                       = useState(null);
  const [isLoading, setIsLoading]                 = useState(false);
  const [apiError, setApiError]                   = useState(null);
  const [isKpiExpanded, setIsKpiExpanded]         = useState(false);
  // ── Calendar (DailyTab-style date chips) ──
  const [dateRow, setDateRow]                     = useState([]);
  const [selectedFullDate, setSelectedFullDate]   = useState(() => new Date().toISOString().split("T")[0]);
  const [isFetchingCalendar, setIsFetchingCalendar] = useState(false);

  // ── Meetings from API ──
  const [meetings, setMeetings]                     = useState([]);
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);

  const loadMeetings = useCallback(async () => {
    setIsFetchingMeetings(true);
    try {
      const data = await fetchMeetingsAPI();
      setMeetings(data);
      // Auto-select first meeting
      if (data.length > 0) {
        const firstId = data[0].id;
        setSelectedMeetingId(prev => prev || firstId);
        loadCalendar(firstId, new Date().toISOString().split("T")[0]);
      }
    } catch (err) {
      console.error("[Meetings] fetch error:", err);
    } finally {
      setIsFetchingMeetings(false);
    }
  }, []);

  useEffect(() => { loadMeetings(); }, [loadMeetings]);

  // ── Load calendar date row ──
  const loadCalendar = useCallback(async (meetingId, dateStr) => {
    if (!meetingId) return;
    setIsFetchingCalendar(true);
    try {
      const data = await fetchDailyMeetingCalendar(meetingId, dateStr);
      const mapped = (data.date_row ?? []).map((d, idx) => ({
        id:        idx,
        dateNum:   d.date,
        day:       d.day,
        label:     labelFromFullDate(d.full_date),
        status:    mapDateStatus(d.status, d.day, d.is_today),
        fullDate:  d.full_date,
        isToday:   d.is_today,
        isMeeting: d.is_meeting,
      }));
      setDateRow(mapped);
      // Keep selectedFullDate on the matched entry or today

    } catch (err) {
      console.error("[Calendar] fetch error:", err);
    } finally {
      setIsFetchingCalendar(false);
    }
  }, []);

  // ── Report load ──
  const loadReport = useCallback(async () => {
    if (!selectedMeetingId) return;
    setIsLoading(true);
    setApiError(null);
    try {
      const raw = await fetchMeetingReport({ meetingId: selectedMeetingId, period: selectedPeriod });
      setReport(normalizeReport(raw));
    } catch (err) {
      setApiError(err.message);
      setReport(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMeetingId, selectedPeriod]);

  useEffect(() => { loadReport(); }, [loadReport]);

  const r = report;

  return (
    <div className="space-y-5 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Meeting Reports</h2>
          <p className="text-sm text-neutral-500 mt-0.5">
            {r?.config?.name ? r.config.name : "Select a meeting to load report"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">

          {/* Meeting dropdown — API driven */}
          <div className="relative">
            <select
              value={selectedMeetingId}
              onChange={e => {
                setSelectedMeetingId(e.target.value);
                loadCalendar(e.target.value, selectedFullDate);
              }}
              disabled={isFetchingMeetings}
              className="appearance-none bg-white border border-[rgba(218,119,86,0.22)] rounded-xl py-2 pl-4 pr-8 text-sm font-semibold text-neutral-700 focus:outline-none shadow-sm disabled:opacity-60"
            >
              <option value="">
                {isFetchingMeetings ? "Loading…" : "All Meetings"}
              </option>
              {meetings.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5 pointer-events-none" />
          </div>

          {/* Period dropdown */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="appearance-none bg-white border border-[rgba(218,119,86,0.22)] rounded-xl py-2 pl-4 pr-8 text-sm font-semibold text-neutral-700 focus:outline-none shadow-sm"
            >
              {periodOptions.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 w-3.5 h-3.5 pointer-events-none" />
          </div>

          <BtnIcon onClick={loadReport} title="Refresh">
            <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
          </BtnIcon>
        </div>
      </div>

      {/* Error */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2 text-red-600 text-xs font-bold shadow-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {apiError.includes("No Auth Token")
            ? "No auth token — save it in Settings tab first."
            : `API error: ${apiError}`}
        </div>
      )}

      {/* Loading skeleton */}
      {isLoading && (
        <div className="space-y-5 animate-pulse">
          <div className="h-32 bg-neutral-100 rounded-2xl" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-neutral-100 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="h-56 bg-neutral-100 rounded-2xl" />
            <div className="h-56 bg-neutral-100 rounded-2xl" />
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !apiError && !r && (
        <div className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-neutral-200 rounded-2xl">
          <BarChart2 size={48} className="mb-4 opacity-20" />
          <p className="text-sm text-neutral-400 font-medium">No report data for this period</p>
        </div>
      )}

      {/* Report content */}
      {!isLoading && r && (
        <div className="space-y-6">
          {/* ── DailyTab-style date chip calendar ── */}
          <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-neutral-800 font-bold text-sm">
                <Calendar className="w-5 h-5 text-neutral-500" /> Meeting Status
              </div>
              {isFetchingCalendar && <RefreshCw className="w-3.5 h-3.5 text-[#DA7756] animate-spin" />}
            </div>

            {/* Date chips */}
            {isFetchingCalendar ? (
              <div className="flex gap-2.5 overflow-x-auto pb-3">
                {[1,2,3,4,5,6,7].map(n => (
                  <div key={n} className="flex-shrink-0 rounded-2xl bg-neutral-100 animate-pulse" style={{ width: 70, height: 84 }} />
                ))}
              </div>
            ) : dateRow.length === 0 ? (
              <p className="text-xs text-neutral-400 italic py-4 text-center">Select a meeting to see date status</p>
            ) : (
              <div className="flex gap-2.5 overflow-x-auto pb-3 justify-center flex-wrap">
                {dateRow.map(date => {
                  const sc = DATE_STATUS_STYLES[date.status] ?? DATE_STATUS_STYLES.upcoming;
                  const isSelected = date.fullDate === selectedFullDate;
                  return (
                    <div
                      key={date.id}
                        className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl select-none"
                      style={{
                        width:      70,
                        height:     84,
                        background: sc.bg,
                        border:     `1.5px solid ${sc.border}`,
                        color:      sc.text,
                        cursor:     "default",
                        opacity:    date.status === "holiday" ? 0.6 : 1,
                        boxShadow:  "0 1px 2px rgba(0,0,0,0.04)",
                      }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">{date.day}</span>
                      <span className="text-2xl font-extrabold leading-none my-0.5">{date.dateNum}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{date.label}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="flex gap-4 text-xs font-medium flex-wrap justify-center text-neutral-500 mt-1">
              {[
                { color: "#22c55e", label: "Meeting Done" },
                { color: "#ef4444", label: "Missed" },
                { color: "#f59e0b", label: "Holiday" },
                { color: "#d1d5db", label: "Upcoming" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-md inline-block border border-black/10" style={{ background: color }} /> {label}
                </div>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#eff6ff] rounded-2xl p-5 border border-blue-100 flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-xs font-bold text-blue-900 tracking-wider uppercase mb-2">Meetings This Month</div>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-blue-900">{r.meetingsThisMonth}</div>
                <div className="text-xs font-semibold text-blue-600 mt-1">0 missed of 3 working days</div>
              </div>
            </div>
            <div className="bg-[#f0fdf4] rounded-2xl p-5 border border-green-100 flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-xs font-bold text-green-900 tracking-wider uppercase mb-2">Attendance Rate</div>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-green-900">{Number(r.attendanceRate).toFixed(1)}%</div>
                <div className="text-xs font-semibold text-green-600 mt-1">0/154 attended</div>
              </div>
            </div>
            <div className="bg-[#faf5ff] rounded-2xl p-5 border border-purple-100 flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-xs font-bold text-purple-900 tracking-wider uppercase mb-2">Avg Self-Rating</div>
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-purple-900">{r.avgSelfRating ? Number(r.avgSelfRating).toFixed(1) : "0.0"}/10</div>
                <div className="text-xs font-semibold text-purple-600 mt-1">0 ratings</div>
              </div>
            </div>
            <div className="bg-[#fff7ed] rounded-2xl p-5 border border-orange-100 flex flex-col justify-between shadow-sm">
              <div className="flex items-start justify-between">
                <div className="text-xs font-bold text-orange-900 tracking-wider uppercase mb-2">Unresolved</div>
                <AlertTriangle className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-orange-900">{r.unresolvedTasks}</div>
                <div className="text-xs font-semibold text-orange-600 mt-1">stuck issues</div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] shadow-sm p-4">
              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-800">
                <TrendingUp className="w-4 h-4 text-neutral-500" /> Attendance Trend (Last 7 Days)
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={r.activityTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="attendance" stroke="#22c55e" strokeWidth={2} fill="#dcfce7" name="Attendance %" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] shadow-sm p-4">
              <div className="flex items-center gap-2 mb-4 text-sm font-bold text-neutral-800">
                <TrendingUp className="w-4 h-4 text-purple-500" /> KPI Achievement Trend
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <ReLineChart data={r.kpiTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#a3a3a3" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="kpi" stroke="#a855f7" strokeWidth={2} dot={{ fill: "#a855f7", r: 3 }} name="KPI %" />
                </ReLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Issue & KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { bg: "#fff7ed", border: "orange-100", icon: AlertTriangle, iconColor: "text-orange-500", label: "Issue Resolution", value: "0%", sub: "0 Resolved · 0 Open" },
              { bg: "#eff6ff", border: "blue-100",   icon: Activity,      iconColor: "text-blue-500",   label: "KPI Achievement", value: "0%", sub: "0 total entries" },
              { bg: "#fef2f2", border: "red-100",    icon: Settings,      iconColor: "text-red-500",    label: "Issue Metrics",   value: "0 days", sub: "0 total stuck issues" },
            ].map(({ bg, border, icon: Icon, iconColor, label, value, sub }) => (
              <div key={label} className={`rounded-2xl p-4 border border-${border} flex gap-4 shadow-sm items-center`} style={{ background: bg }}>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                  <Icon className={cn("w-5 h-5", iconColor)} />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-0.5">{label}</div>
                  <div className="text-2xl font-extrabold text-blue-600 mb-1">{value}</div>
                  <div className="text-[11px] font-semibold text-neutral-500">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Team KPIs */}
          <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] shadow-sm overflow-hidden">
            <div
              className="p-4 flex items-center justify-between cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors border-b border-neutral-100"
              onClick={() => setIsKpiExpanded(!isKpiExpanded)}
            >
              <div>
                <div className="flex items-center gap-2 font-bold text-neutral-800 text-sm">
                  <TrendingUp className="w-4 h-4 text-purple-600" /> Team Member KPIs{" "}
                  <span className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-bold">{r.memberStats.length} KPIs</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  {r.period.from} - {r.period.to} • Click to {isKpiExpanded ? "collapse" : "expand"}
                </div>
              </div>
              {isKpiExpanded ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
            </div>
            {isKpiExpanded && (
              <div className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
                {r.memberStats.length === 0 ? (
                  <div className="p-8 text-center text-sm text-neutral-400">No Team Members Found</div>
                ) : (
                  r.memberStats.map((member, i) => (
                    <div key={i} className="p-4 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-sm text-neutral-800">{member.name || "Unknown Member"}</div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-lg">{member.kpis?.length || 0} KPIs</span>
                      </div>
                      {!member.kpis || member.kpis.length === 0 ? (
                        <div className="text-xs text-neutral-400">No KPIs assigned</div>
                      ) : (
                        <div className="space-y-2 mt-3">
                          {member.kpis.map((kpi, kIdx) => (
                            <div key={kIdx} className="flex justify-between items-center bg-white border border-neutral-100 p-2.5 rounded-xl">
                              <div>
                                <div className="text-sm font-semibold text-neutral-700">{kpi.name}</div>
                                <div className="text-[10px] text-neutral-400 mt-0.5">{kpi.entries || 0} entries · {kpi.value || "0.0/0.0"} {kpi.unit}</div>
                              </div>
                              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-lg border border-red-200">{kpi.score || "0%"}</span>
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