// ─────────────────────────────────────────────
// AnalyticsTab.jsx — Unified Modern Theme (Matching Calendar & Reports)
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import {
  Activity,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { cn } from "@/lib/utils";
import { fetchAnalytics, getBaseUrl, getAuthHeaders } from "./Shared";

// ── DATA NORMALIZATION ──
const generateEmptyTrend = (days = 7) => {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      reports: 0,
      accomplishments: 0,
      stuck: 0,
      kpi: 0,
    });
  }
  return result;
};

const normalizeAnalytics = (raw) => {
  if (!raw) return null;
  const validTrend =
    Array.isArray(raw.activity_trend) && raw.activity_trend.length > 0;
  const deptMap = new Map();

  if (Array.isArray(raw.department_performance)) {
    raw.department_performance.forEach((d) => {
      deptMap.set(d.department, {
        name: d.department ?? "Unknown",
        total: d.total_members ?? 0,
        submitted: d.submitted ?? 0,
        rate: d.submission_rate ?? 0,
        today: { done: 0, pending: 0 },
        thisWeek: { done: 0, pending: 0 },
      });
    });
  }

  if (Array.isArray(raw.department_summary)) {
    raw.department_summary.forEach((d) => {
      if (deptMap.has(d.department)) {
        const existing = deptMap.get(d.department);
        existing.today = d.today || { done: 0, pending: 0 };
        existing.thisWeek = d.this_week || { done: 0, pending: 0 };
      } else {
        deptMap.set(d.department, {
          name: d.department ?? "Unknown",
          total: d.total_members ?? 0,
          submitted: 0,
          rate: 0,
          today: d.today || { done: 0, pending: 0 },
          thisWeek: d.this_week || { done: 0, pending: 0 },
        });
      }
    });
  }

  return {
    totalUsers: raw.total_users ?? 0,
    activeReporters: raw.active_reporters ?? 0,
    lagging: raw.logging ?? 0,
    notReporting: raw.not_reporting ?? 0,
    activityTrend: validTrend ? raw.activity_trend : generateEmptyTrend(7),
    deptBreakdown: Array.from(deptMap.values()),
    _raw: raw,
  };
};

// ── CUSTOM SELECT (Matches other tabs) ──
const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "All",
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  const selected = options.find((o: any) => String(o.value) === String(value));

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "flex items-center gap-2 bg-[#FCFAFA] border rounded-[16px] pl-5 pr-4 py-3 transition-all min-w-[160px]",
          open
            ? "border-[#EB4A4A] shadow-[0_0_0_3px_rgba(235,74,74,0.10)]"
            : "border-[#F0EBE8] hover:border-[#EB4A4A]",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="flex-1 text-left text-sm font-semibold truncate">
          {disabled ? (
            <span className="text-[#8C8580]">Loading…</span>
          ) : selected ? (
            <span className="text-[#1A1A1A] font-bold">{selected.label}</span>
          ) : (
            <span className="text-[#8C8580]">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 transition-transform duration-200 shrink-0",
            open ? "rotate-180 text-[#EB4A4A]" : "text-[#8C8580]"
          )}
        />
      </button>

      {open && !disabled && (
        <div
          className="absolute top-full left-0 mt-1.5 z-[999] bg-white border border-[#F0EBE8] rounded-[20px] overflow-hidden min-w-full"
          style={{
            maxHeight: 240,
            overflowY: "auto",
            boxShadow:
              "0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="py-1.5">
            {options.map((opt) => {
              const isSelected = String(value) === String(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(String(opt.value));
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2.5 group",
                    isSelected
                      ? "bg-[#FFF5F5] text-[#D37E5F]"
                      : "text-[#1A1A1A] hover:bg-[#FFF5F5] hover:text-[#D37E5F]"
                  )}
                >
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                      isSelected
                        ? "bg-[#D37E5F]"
                        : "bg-transparent group-hover:bg-[#EB4A4A]/30"
                    )}
                  />
                  <span className="truncate flex-1 font-semibold">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <span className="ml-auto shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#EB4A4A]"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M2.5 7L5.5 10L11.5 4"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// ── API Fetcher for Meetings ──
const fetchDynamicMeetings = async () => {
  const baseUrl = localStorage.getItem("baseUrl") || "";
  const res = await fetch(`https://${baseUrl}/daily_meeting_configs`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
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
    is_default: m.is_default || m.isDefault || false, // 🛠 FIX: Extra flag
  }));
};

// ── MAIN COMPONENT ──
const AnalyticsTab = () => {
  const [dynamicMeetings, setDynamicMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [isFetchingMeetings, setIsFetchingMeetings] = useState(false);
  const [period, setPeriod] = useState("last_14_days");

  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  // 1. Fetch Meetings List on Mount
  useEffect(() => {
    const loadMeetingsDropdown = async () => {
      setIsFetchingMeetings(true);
      try {
        const fetchedList = await fetchDynamicMeetings();
        setDynamicMeetings(fetchedList);
        if (fetchedList.length > 0) {
          // 🛠 FIX: Look for default meeting, else select the first one
          const defaultMeeting = fetchedList.find((m) => m.is_default);
          if (defaultMeeting) {
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
  }, []);

  // 2. Load Analytics Data
  useEffect(() => {
    // Only load if meeting is selected
    if (!selectedMeetingId) return;

    const loadAnalytics = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        // You might need to update your fetchAnalytics function 
        // in Shared.js to accept meetingId if it currently doesn't.
        // Assuming fetchAnalytics takes (period, meetingId) here:
        const raw = await fetchAnalytics(period, selectedMeetingId);
        setAnalytics(normalizeAnalytics(raw));
      } catch (err) {
        setApiError(err.message);
        setAnalytics(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, [period, selectedMeetingId]);

  const a = analytics;

  return (
    <div
      className="space-y-6 pb-12 min-h-screen"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* Dynamic Header and Controls */}
      <div className="bg-white rounded-[32px] border border-[#F0EBE8] shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-[48px] h-[48px] rounded-[14px] bg-[#FDF5F1] border border-[#F6E1D7] flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-[#D37E5F]" />
            </div>
            <div>
              <h2 className="text-[24px] font-black text-[#1A1A1A] tracking-tight">
                Team Analytics
              </h2>
              <p className="text-[12px] font-bold text-[#8C8580] uppercase tracking-widest mt-1">
                Overview & Insights
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* ── Meeting dropdown ── */}
            <CustomSelect
              value={selectedMeetingId}
              onChange={(val) => setSelectedMeetingId(String(val))}
              disabled={isFetchingMeetings}
              placeholder="Select Meeting"
              options={dynamicMeetings.map((m) => ({
                value: String(m.id),
                label: m.label,
              }))}
            />

            {/* Time Period Filter */}
            <div className="relative shrink-0">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="appearance-none border border-[#F0EBE8] bg-[#FCFAFA] rounded-[16px] pl-5 pr-10 py-3 text-sm font-bold text-[#1A1A1A] focus:outline-none focus:border-[#EB4A4A] min-w-[180px] w-full cursor-pointer transition-colors"
              >
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_14_days">Last 14 Days</option>
                <option value="last_30_days">Last 30 Days</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8580] pointer-events-none" />
            </div>
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

      {isLoading ? (
        /* STATIC SKELETON LOADER (No Pulse) */
        <div className="space-y-6 w-full">
          {/* Top Summary Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-[24px] border border-[#F0EBE8] p-6 shadow-sm flex flex-col justify-between h-[130px]"
              >
                <div className="flex items-start justify-between">
                  <div className="h-3 bg-[#F0EBE8] rounded-full w-1/2 mb-3"></div>
                  <div className="w-10 h-10 rounded-[12px] bg-[#F0EBE8] shrink-0"></div>
                </div>
                <div className="h-8 bg-[#F0EBE8] rounded-full w-1/3 mt-2"></div>
              </div>
            ))}
          </div>

          {/* Middle Section Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] border border-[#F0EBE8] p-6 sm:p-8 h-[370px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-[8px] bg-[#F0EBE8]"></div>
                <div className="h-4 bg-[#F0EBE8] rounded-full w-1/3"></div>
              </div>
              <div className="w-full h-[240px] bg-[#F0EBE8] rounded-[16px]"></div>
            </div>

            <div className="bg-white rounded-[24px] border border-[#F0EBE8] p-6 sm:p-8 h-[370px]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-[8px] bg-[#F0EBE8]"></div>
                <div className="h-4 bg-[#F0EBE8] rounded-full w-1/3"></div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-[52px] bg-[#F0EBE8] rounded-[16px]"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section Skeleton */}
          <div className="bg-white rounded-[32px] border border-[#F0EBE8] shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-[12px] bg-[#F0EBE8]"></div>
              <div className="h-5 bg-[#F0EBE8] rounded-full w-1/4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-[#FCFAFA] rounded-[24px] p-5 border border-[#F0EBE8] h-[190px]"
                >
                  <div className="h-4 bg-[#F0EBE8] rounded-full w-1/2 mb-2"></div>
                  <div className="h-3 bg-[#F0EBE8] rounded-full w-1/4 mb-5"></div>
                  <div className="flex gap-3">
                    <div className="h-[75px] bg-[#F0EBE8] rounded-[16px] flex-1"></div>
                    <div className="h-[75px] bg-[#F0EBE8] rounded-[16px] flex-1"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        a && (
          <div className="space-y-6">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Users",
                  val: a.totalUsers,
                  icon: Users,
                  color: "text-[#2ECC71]",
                },
                {
                  label: "Active Reporters",
                  val: a.activeReporters,
                  icon: TrendingUp,
                  color: "text-[#DAB835]",
                },
                {
                  label: "Lagging",
                  val: a.lagging,
                  icon: TrendingDown,
                  color: "text-[#EB4A4A]",
                },
                {
                  label: "Not Reporting",
                  val: a.notReporting,
                  icon: AlertTriangle,
                  color: "text-[#8C8580]",
                },
              ].map((metric, i) => (
                <div
                  key={i}
                  className="bg-[#FCFAFA] rounded-[24px] border border-[#F0EBE8] p-6 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-start justify-between">
                    <div className="text-[11px] font-black text-[#8C8580] tracking-widest uppercase mb-3 leading-snug">
                      {metric.label}
                    </div>
                    <div className="w-10 h-10 rounded-[12px] bg-white border border-[#F0EBE8] flex items-center justify-center shrink-0">
                      <metric.icon className={cn("w-5 h-5", metric.color)} />
                    </div>
                  </div>
                  <div className="text-[32px] font-black text-[#1A1A1A] leading-none">
                    {metric.val}
                  </div>
                </div>
              ))}
            </div>

            {/* Middle Section: Trend Chart & Department Breakdown Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Trend Chart */}
              <div className="bg-white rounded-[24px] border border-[#F0EBE8] shadow-sm p-6 sm:p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6 text-sm font-black text-[#1A1A1A] uppercase tracking-wider">
                  <div className="w-8 h-8 rounded-[8px] bg-[#EB4A4A]/10 flex items-center justify-center">
                    <Activity className="w-4 h-4 text-[#EB4A4A]" />
                  </div>
                  Daily Activity Trend
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <ReLineChart data={a.activityTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#F0EBE8"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#8C8580",
                        fontWeight: "bold",
                      }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "#8C8580",
                        fontWeight: "bold",
                      }}
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
                    <Legend
                      wrapperStyle={{
                        fontSize: "11px",
                        fontWeight: "bold",
                        paddingTop: "10px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="reports"
                      stroke="#EB4A4A"
                      strokeWidth={3}
                      dot={{
                        fill: "#EB4A4A",
                        r: 3,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 6 }}
                      name="Reports"
                    />
                    <Line
                      type="monotone"
                      dataKey="accomplishments"
                      stroke="#2ECC71"
                      strokeWidth={3}
                      dot={{
                        fill: "#2ECC71",
                        r: 3,
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{ r: 6 }}
                      name="Accomplishments"
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>

              {/* Department Breakdown Progress Bars */}
              <div className="bg-white rounded-[24px] border border-[#F0EBE8] shadow-sm p-6 sm:p-8 flex flex-col">
                <div className="flex items-center gap-3 mb-6 text-sm font-black text-[#1A1A1A] uppercase tracking-wider">
                  <div className="w-8 h-8 rounded-[8px] bg-[#F4D35E]/20 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-[#DAB835]" />
                  </div>
                  Department Breakdown
                </div>
                <div className="space-y-4 overflow-y-auto max-h-[260px] pr-2">
                  {a.deptBreakdown.map((dept) => (
                    <div
                      key={dept.name}
                      className="flex flex-col gap-2 bg-[#FCFAFA] p-4 rounded-[16px] border border-[#F0EBE8]"
                    >
                      <div className="flex justify-between items-center">
                        <div
                          className="text-sm font-black text-[#1A1A1A] truncate max-w-[200px]"
                          title={dept.name}
                        >
                          {dept.name}
                        </div>
                        <div className="text-[11px] font-bold text-[#8C8580] bg-white border border-[#F0EBE8] px-2 py-1 rounded-[6px]">
                          {dept.submitted}/{dept.total} Submitted
                        </div>
                      </div>
                      <div className="flex-1 bg-[#F0EBE8] rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(dept.rate, 100)}%`,
                            background:
                              dept.rate >= 70
                                ? "#2ECC71"
                                : dept.rate >= 40
                                  ? "#F4D35E"
                                  : "#EB4A4A",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Department Reporting Summary Grid (Deep Dive) */}
            <div className="bg-white rounded-[32px] border border-[#F0EBE8] shadow-sm p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-8 text-lg font-black text-[#1A1A1A] uppercase tracking-wider">
                <div className="w-10 h-10 rounded-[12px] bg-[#FDF5F1] border border-[#F6E1D7] flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#D37E5F]" />
                </div>
                Department Reporting Summary
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {a.deptBreakdown.map((dept) => (
                  <div
                    key={dept.name}
                    className="bg-[#FCFAFA] rounded-[24px] p-5 border border-[#F0EBE8] hover:scale-[1.02] transition-transform duration-200"
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3
                          className="font-black text-[#1A1A1A] text-base mb-1 truncate max-w-[160px]"
                          title={dept.name}
                        >
                          {dept.name}
                        </h3>
                        <p className="text-[11px] font-bold text-[#8C8580] uppercase tracking-wider">
                          {dept.total} Members
                        </p>
                      </div>
                      <div className="bg-[#1A1A1A] text-white text-[11px] font-black px-2.5 py-1 rounded-[8px] shadow-sm">
                        {dept.rate}%
                      </div>
                    </div>

                    {/* Stats Inner Cards (Today / This Week) */}
                    <div className="flex gap-3">
                      {/* TODAY */}
                      <div className="bg-white rounded-[16px] p-3.5 flex-1 shadow-sm border border-[#F0EBE8]">
                        <div className="text-[10px] text-[#8C8580] uppercase font-black tracking-widest mb-2 border-b border-[#F0EBE8] pb-1">
                          Today
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="text-[#2ECC71] font-black text-xl leading-none">
                              {dept.today.done}
                            </div>
                            <div className="text-[9px] font-bold text-[#8C8580] uppercase mt-1">
                              Done
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-[#EB4A4A] font-black text-xl leading-none">
                              {dept.today.pending}
                            </div>
                            <div className="text-[9px] font-bold text-[#8C8580] uppercase mt-1">
                              Pending
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* THIS WEEK */}
                      <div className="bg-white rounded-[16px] p-3.5 flex-1 shadow-sm border border-[#F0EBE8]">
                        <div className="text-[10px] text-[#8C8580] uppercase font-black tracking-widest mb-2 border-b border-[#F0EBE8] pb-1">
                          This Week
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="text-[#2ECC71] font-black text-xl leading-none">
                              {dept.thisWeek.done}
                            </div>
                            <div className="text-[9px] font-bold text-[#8C8580] uppercase mt-1">
                              Done
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-[#F4D35E] font-black text-xl leading-none">
                              {dept.thisWeek.pending}
                            </div>
                            <div className="text-[9px] font-bold text-[#8C8580] uppercase mt-1">
                              Pending
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AnalyticsTab;