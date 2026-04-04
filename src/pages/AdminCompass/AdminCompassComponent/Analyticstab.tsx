import React, { useState, useEffect } from "react";
import {
  Activity,
  Building2,
  Users,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  BarChart, // Added BarChart
  Bar,      // Added Bar
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SectionCard, fetchAnalytics } from "./shared";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
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

const PASTEL_COLORS = [
  "bg-indigo-50",
  "bg-fuchsia-50",
  "bg-emerald-50",
  "bg-amber-50",
  "bg-red-50",
  "bg-cyan-50",
  "bg-blue-50",
  "bg-purple-50",
  "bg-green-50",
  "bg-orange-50",
];

// Rate badge color based on submission rate
const rateBadgeColor = (rate) => {
  if (rate >= 70) return "bg-green-600";
  if (rate >= 40) return "bg-amber-500";
  return "bg-red-500";
};

// ─────────────────────────────────────────────
// Normalize API response
// Merges department_performance + department_summary by department name
// ─────────────────────────────────────────────
const normalizeAnalytics = (raw) => {
  if (!raw) return null;

  const validTrend =
    Array.isArray(raw.activity_trend) && raw.activity_trend.length > 0;

  // Build a map keyed by trimmed department name
  const deptMap = new Map();

  // 1. Seed from department_performance
  if (Array.isArray(raw.department_performance)) {
    raw.department_performance.forEach((d) => {
      const key = (d.department ?? "").trim();
      deptMap.set(key, {
        name:      key || "Unknown",
        total:     d.total_members    ?? 0,
        submitted: d.submitted        ?? 0,
        rate:      Math.round(d.submission_rate ?? 0), // float → int %
        today:     { done: 0, pending: 0 },
        thisWeek:  { done: 0, pending: 0 },
      });
    });
  }

  // 2. Merge today / this_week from department_summary
  if (Array.isArray(raw.department_summary)) {
    raw.department_summary.forEach((d) => {
      const key = (d.department ?? "").trim();
      if (deptMap.has(key)) {
        const existing  = deptMap.get(key);
        existing.today    = { done: d.today?.done    ?? 0, pending: d.today?.pending    ?? 0 };
        existing.thisWeek = { done: d.this_week?.done ?? 0, pending: d.this_week?.pending ?? 0 };
      } else {
        // In summary but not in performance — add it anyway
        deptMap.set(key, {
          name:      key || "Unknown",
          total:     d.total_members ?? 0,
          submitted: 0,
          rate:      0,
          today:     { done: d.today?.done    ?? 0, pending: d.today?.pending    ?? 0 },
          thisWeek:  { done: d.this_week?.done ?? 0, pending: d.this_week?.pending ?? 0 },
        });
      }
    });
  }

  return {
    period:          raw.period ?? null,
    totalUsers:      raw.total_users      ?? 0,
    activeReporters: raw.active_reporters ?? 0,
    lagging:         raw.logging          ?? 0,
    notReporting:    raw.not_reporting    ?? 0,
    activityTrend:   validTrend ? raw.activity_trend : generateEmptyTrend(7),
    deptBreakdown:   Array.from(deptMap.values()),
  };
};

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const AnalyticsTab = () => {
  const [period, setPeriod]     = useState("last_14_days");
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError]   = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const raw = await fetchAnalytics(period);
        setAnalytics(normalizeAnalytics(raw));
      } catch (err) {
        setApiError(err.message);
        setAnalytics(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, [period]);

  const a = analytics;

  return (
    <div className="pb-12 space-y-6">

      {/* ── Header & Controls ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Team Analytics</h2>
          {a?.period && (
            <p className="text-xs text-neutral-400 mt-0.5">
              {a.period.from} → {a.period.to}
            </p>
          )}
        </div>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium cursor-pointer"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_14_days">Last 14 Days</option>
            <option value="last_30_days">Last 30 Days</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* ── Error ── */}
      {apiError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-500 text-sm">
          Failed to load analytics: {apiError}
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-neutral-100 rounded-2xl" />
            ))}
          </div>
          <div className="h-64 bg-neutral-100 rounded-2xl" />
          <div className="h-64 bg-neutral-100 rounded-2xl" />
        </div>

      ) : a && (
        <div className="space-y-8">

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Total Users</span>
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-3xl font-extrabold text-neutral-900">{a.totalUsers}</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Active Reporters</span>
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-3xl font-extrabold text-green-600">{a.activeReporters}</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Lagging</span>
                <TrendingDown className="w-6 h-6 text-orange-500" />
              </div>
              <div className="text-3xl font-extrabold text-orange-500">{a.lagging}</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Not Reporting</span>
              </div>
              <div className="text-3xl font-extrabold text-red-600">{a.notReporting}</div>
            </div>
          </div>

          {/* ── Trend Chart + Department Breakdown ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SectionCard>
              <div className="flex items-center gap-2 mb-4 font-semibold text-neutral-700 text-sm">
                <Activity className="w-4 h-4 text-[#DA7756]" /> Daily Activity Trend
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <ReLineChart data={a.activityTrend}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a3a3a3" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#a3a3a3" }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="reports"         stroke="#DA7756" strokeWidth={2} dot={false} name="Reports" />
                  <Line type="monotone" dataKey="accomplishments" stroke="#22c55e" strokeWidth={2} dot={false} name="Accomplishments" />
                </ReLineChart>
              </ResponsiveContainer>
            </SectionCard>

            {/* UPDATED: Department Breakdown as a Bar Chart with Coral Color */}
            <SectionCard>
              <div className="flex items-center gap-2 mb-4 font-semibold text-neutral-700 text-sm">
                <Building2 className="w-4 h-4 text-[#FF7F50]" /> Department Breakdown
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={a.deptBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: "#a3a3a3" }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: "#a3a3a3" }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="rate" 
                    name="Submission Rate (%)" 
                    fill="#FF7F50" // Coral Color
                    radius={[4, 4, 0, 0]} 
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>

          {/* ── Department Reporting Summary ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 font-bold text-neutral-800 text-lg">
                <Building2 className="w-5 h-5 text-indigo-600" />
                Department Reporting Summary
              </div>
              <span className="text-xs text-neutral-400 font-medium">
                {a.deptBreakdown.length} departments
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {a.deptBreakdown.map((dept, index) => {
                const bgColor = PASTEL_COLORS[index % PASTEL_COLORS.length];
                const todayTotal   = dept.today.done + dept.today.pending;
                const weekTotal    = dept.thisWeek.done + dept.thisWeek.pending;
                const todayPct     = todayTotal  > 0 ? Math.round((dept.today.done    / todayTotal)  * 100) : 0;
                const weekPct      = weekTotal   > 0 ? Math.round((dept.thisWeek.done / weekTotal)   * 100) : 0;

                return (
                  <div
                    key={`${dept.name}-${index}`}
                    className={`${bgColor} rounded-xl p-4 transition-transform hover:scale-[1.01]`}
                  >
                    {/* Card Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="min-w-0 flex-1 mr-2">
                        <h3
                          className="font-bold text-gray-900 text-[15px] leading-tight mb-0.5 truncate"
                          title={dept.name}
                        >
                          {dept.name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {dept.total} members
                        </p>
                      </div>
                      <div className={`${rateBadgeColor(dept.rate)} text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm shrink-0`}>
                        {dept.rate}%
                      </div>
                    </div>

                    {/* Submission progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>Submissions</span>
                        <span>{dept.submitted} / {dept.total}</span>
                      </div>
                      <div className="bg-white/70 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min(dept.rate, 100)}%`,
                            background:
                              dept.rate >= 70 ? "#22c55e" :
                              dept.rate >= 40 ? "#f59e0b" : "#ef4444",
                          }}
                        />
                      </div>
                    </div>

                    {/* Today + This Week inner cards */}
                    <div className="flex gap-2">
                      {/* TODAY */}
                      <div className="bg-white rounded-lg p-2.5 flex-1 shadow-sm">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                            Today
                          </div>
                          {todayTotal > 0 && (
                            <span className="text-[9px] font-bold text-gray-400">
                              {todayPct}%
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="text-green-600 font-bold text-lg leading-none">
                              {dept.today.done}
                            </div>
                            <div className="text-[9px] text-gray-400 mt-0.5">Done</div>
                          </div>
                          <div className="w-px h-6 bg-gray-100" />
                          <div className="text-center">
                            <div className="text-red-500 font-bold text-lg leading-none">
                              {dept.today.pending}
                            </div>
                            <div className="text-[9px] text-gray-400 mt-0.5">Pending</div>
                          </div>
                        </div>
                      </div>

                      {/* THIS WEEK */}
                      <div className="bg-white rounded-lg p-2.5 flex-1 shadow-sm">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide">
                            Week
                          </div>
                          {weekTotal > 0 && (
                            <span className="text-[9px] font-bold text-gray-400">
                              {weekPct}%
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-center">
                            <div className="text-blue-600 font-bold text-lg leading-none">
                              {dept.thisWeek.done}
                            </div>
                            <div className="text-[9px] text-gray-400 mt-0.5">Done</div>
                          </div>
                          <div className="w-px h-6 bg-gray-100" />
                          <div className="text-center">
                            <div className="text-orange-500 font-bold text-lg leading-none">
                              {dept.thisWeek.pending}
                            </div>
                            <div className="text-[9px] text-gray-400 mt-0.5">Pending</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AnalyticsTab;