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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SectionCard, fetchAnalytics } from "./Shared";

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

  // Merge department_performance and department_summary
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

const AnalyticsTab = () => {
  const [period, setPeriod] = useState("last_14_days");
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

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
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">
            Team Analytics
          </h2>
        </div>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none bg-[#fffaf8] border border-[rgba(218,119,86,0.22)] text-gray-700 py-2 pl-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[rgba(218,119,86,0.2)] focus:border-[#DA7756] text-sm font-medium cursor-pointer"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_14_days">Last 14 Days</option>
            <option value="last_30_days">Last 30 Days</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#DA7756]/70">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-28 bg-neutral-100 rounded-2xl" />
          <div className="h-64 bg-neutral-100 rounded-2xl" />
        </div>
      ) : (
        a && (
          <div className="space-y-8">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#fffaf8] rounded-2xl border border-[rgba(218,119,86,0.18)] p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Total Users
                  </span>
                  <Users className="w-6 h-6 text-[#DA7756]" />
                </div>
                <div className="text-3xl font-extrabold text-[#7a341d]">
                  {a.totalUsers}
                </div>
              </div>

              <div className="bg-[#fef6f4] rounded-2xl border border-[rgba(218,119,86,0.18)] p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Active Reporters
                  </span>
                  <TrendingUp className="w-6 h-6 text-[#DA7756]" />
                </div>
                <div className="text-3xl font-extrabold text-[#7a341d]">
                  {a.activeReporters}
                </div>
              </div>

              <div className="bg-[#fff4ef] rounded-2xl border border-[rgba(218,119,86,0.18)] p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Lagging
                  </span>
                  <TrendingDown className="w-6 h-6 text-[#DA7756]" />
                </div>
                <div className="text-3xl font-extrabold text-[#7a341d]">
                  {a.lagging}
                </div>
              </div>

              <div className="bg-[#fff8f1] rounded-2xl border border-[rgba(218,119,86,0.18)] p-5 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Not Reporting
                  </span>
                  <Activity className="w-6 h-6 text-[#DA7756]" />
                </div>
                <div className="text-3xl font-extrabold text-[#7a341d]">
                  {a.notReporting}
                </div>
              </div>
            </div>

            {/* Middle Section: Trend Chart & Old Department Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <SectionCard>
                <div className="flex items-center gap-2 mb-4 font-semibold text-neutral-700 text-sm">
                  <Activity className="w-4 h-4 text-[#DA7756]" /> Daily Activity
                  Trend
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <ReLineChart data={a.activityTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "#a3a3a3" }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="reports"
                      stroke="#DA7756"
                      strokeWidth={2}
                      dot={false}
                      name="Reports"
                    />
                    <Line
                      type="monotone"
                      dataKey="accomplishments"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                      name="Accomplishments"
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </SectionCard>

              {/* Restored Chart */}
              <SectionCard>
                <div className="flex items-center gap-2 mb-4 font-semibold text-neutral-700 text-sm">
                  <Building2 className="w-4 h-4 text-[#DA7756]" /> Department
                  Breakdown
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[250px] pr-1">
                  {a.deptBreakdown.map((dept) => (
                    <div key={dept.name} className="flex items-center gap-3">
                      <div
                        className="text-xs font-semibold text-neutral-600 w-32 truncate shrink-0"
                        title={dept.name}
                      >
                        {dept.name}
                      </div>
                      <div className="flex-1 bg-neutral-100 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min(dept.rate, 100)}%`,
                            background:
                              dept.rate >= 70
                                ? "#22c55e"
                                : dept.rate >= 40
                                  ? "#f59e0b"
                                  : "#ef4444",
                          }}
                        />
                      </div>
                      <div className="text-xs font-bold text-neutral-700 w-12 text-right shrink-0">
                        {dept.submitted}/{dept.total}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Department Reporting Summary Grid (New API Format) */}
            <div className="bg-white rounded-2xl border border-[rgba(218,119,86,0.18)] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-6 font-bold text-neutral-800 text-lg">
                <Building2 className="w-5 h-5 text-[#DA7756]" /> Department
                Reporting Summary
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {a.deptBreakdown.map((dept, index) => {
<<<<<<< Updated upstream
                  const bgColor =
                    index % 2 === 0 ? "bg-[#fffaf8]" : "bg-[#fef6f4]";
=======
                  const bgColor = index % 2 === 0 ? "bg-[#fffaf8]" : "bg-[#fef6f4]";
>>>>>>> Stashed changes

                  return (
                    <div
                      key={dept.name}
                      className={`${bgColor} rounded-2xl p-4 border border-[rgba(218,119,86,0.14)] transition-transform hover:scale-[1.01]`}
                    >
                      {/* Card Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3
                            className="font-bold text-gray-900 text-[15px] leading-tight mb-1 truncate max-w-[140px]"
                            title={dept.name}
                          >
                            {dept.name}
                          </h3>
                          <p className="text-xs text-gray-500 font-medium">
                            {dept.total} members
                          </p>
                        </div>
                        <div className="bg-[#DA7756] text-white text-[11px] font-bold px-2 py-0.5 rounded-xl shadow-sm">
                          {dept.rate}%
                        </div>
                      </div>

                      {/* Stats Inner Cards */}
                      <div className="flex gap-2">
                        {/* TODAY */}
                        <div className="bg-white rounded-xl p-2.5 flex-1 shadow-sm border border-[rgba(218,119,86,0.1)]">
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide mb-1">
                            Today
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-center">
                              <div className="text-green-600 font-bold text-lg leading-none">
                                {dept.today.done}
                              </div>
                              <div className="text-[9px] text-gray-500 mt-1">
                                Done
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-red-500 font-bold text-lg leading-none">
                                {dept.today.pending}
                              </div>
                              <div className="text-[9px] text-gray-500 mt-1">
                                Pending
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* THIS WEEK */}
                        <div className="bg-white rounded-xl p-2.5 flex-1 shadow-sm border border-[rgba(218,119,86,0.1)]">
                          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-wide mb-1">
                            This Week
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-center">
                              <div className="text-[#DA7756] font-bold text-lg leading-none">
                                {dept.thisWeek.done}
                              </div>
                              <div className="text-[9px] text-gray-500 mt-1">
                                Done
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-orange-500 font-bold text-lg leading-none">
                                {dept.thisWeek.pending}
                              </div>
                              <div className="text-[9px] text-gray-500 mt-1">
                                Pending
                              </div>
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
        )
      )}
    </div>
  );
};

export default AnalyticsTab;
