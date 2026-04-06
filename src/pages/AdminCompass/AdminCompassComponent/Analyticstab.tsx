// ─────────────────────────────────────────────
// AnalyticsTab.jsx — Unified Modern Theme (Matching Calendar & Reports)
// ─────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import {
  Activity, Building2, Users, TrendingUp,
  TrendingDown, ChevronDown, AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart as ReLineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import { fetchAnalytics } from "./Shared"; // Removed SectionCard as we are building custom themed cards

// ── DATA NORMALIZATION ──
const generateEmptyTrend = (days = 7) => {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      date: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }),
      reports: 0, accomplishments: 0, stuck: 0, kpi: 0,
    });
  }
  return result;
};

const normalizeAnalytics = (raw) => {
  if (!raw) return null;
  const validTrend = Array.isArray(raw.activity_trend) && raw.activity_trend.length > 0;
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
          submitted: 0, rate: 0,
          today: d.today || { done: 0, pending: 0 },
          thisWeek: d.this_week || { done: 0, pending: 0 },
        });
      }
    });
  }

  return {
    totalUsers: raw.total_users ?? 0,
    activeReporters: raw.active_reporters ?? 0,
    lagging: raw.logging ?? 0, // Assuming raw.logging is typo in original logic for lagging
    notReporting: raw.not_reporting ?? 0,
    activityTrend: validTrend ? raw.activity_trend : generateEmptyTrend(7),
    deptBreakdown: Array.from(deptMap.values()),
    _raw: raw,
  };
};

// ── MAIN COMPONENT ──
const AnalyticsTab = () => {
  const [period, setPeriod] = useState("last_14_days");
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true); setApiError(null);
      try {
        const raw = await fetchAnalytics(period);
        setAnalytics(normalizeAnalytics(raw));
      } catch (err) {
        setApiError(err.message); setAnalytics(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, [period]);

  const a = analytics;

  return (
    <div className="space-y-6 pb-12  min-h-screen pt-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* Dynamic Header and Controls */}
      <div className="bg-white rounded-[32px] border border-[#F0EBE8] shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-[48px] h-[48px] rounded-[14px] bg-[#FDF5F1] border border-[#F6E1D7] flex items-center justify-center shrink-0">
              <Activity className="w-6 h-6 text-[#D37E5F]" />
            </div>
            <div>
              <h2 className="text-[24px] font-black text-[#1A1A1A] tracking-tight">Team Analytics</h2>
              <p className="text-[12px] font-bold text-[#8C8580] uppercase tracking-widest mt-1">
                Overview & Insights
              </p>
            </div>
          </div>

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

      {apiError && (
        <div className="bg-[#EB4A4A]/10 text-[#EB4A4A] text-sm font-bold p-5 rounded-[20px] flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {apiError.includes("No Auth Token") ? "No auth token — save it in Settings tab first." : `API error: ${apiError}`}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-6 animate-pulse">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (<div key={i} className="h-32 bg-[#F0EBE8] rounded-[24px]" />))}
          </div>
          <div className="h-72 bg-[#F0EBE8] rounded-[32px]" />
        </div>
      ) : (
        a && (
          <div className="space-y-6">
            
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Users", val: a.totalUsers, icon: Users, color: "text-[#2ECC71]" },
                { label: "Active Reporters", val: a.activeReporters, icon: TrendingUp, color: "text-[#DAB835]" },
                { label: "Lagging", val: a.lagging, icon: TrendingDown, color: "text-[#EB4A4A]" },
                { label: "Not Reporting", val: a.notReporting, icon: AlertTriangle, color: "text-[#8C8580]" },
              ].map((metric, i) => (
                <div key={i} className="bg-[#FCFAFA] rounded-[24px] border border-[#F0EBE8] p-6 shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform">
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EBE8" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8C8580", fontWeight: "bold" }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8C8580", fontWeight: "bold" }} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", fontWeight: "bold" }} />
                    <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold", paddingTop: "10px" }} />
                    <Line type="monotone" dataKey="reports" stroke="#EB4A4A" strokeWidth={3} dot={{ fill: "#EB4A4A", r: 3, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} name="Reports" />
                    <Line type="monotone" dataKey="accomplishments" stroke="#2ECC71" strokeWidth={3} dot={{ fill: "#2ECC71", r: 3, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} name="Accomplishments" />
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
                    <div key={dept.name} className="flex flex-col gap-2 bg-[#FCFAFA] p-4 rounded-[16px] border border-[#F0EBE8]">
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-black text-[#1A1A1A] truncate max-w-[200px]" title={dept.name}>
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
                            background: dept.rate >= 70 ? "#2ECC71" : dept.rate >= 40 ? "#F4D35E" : "#EB4A4A",
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
                        <h3 className="font-black text-[#1A1A1A] text-base mb-1 truncate max-w-[160px]" title={dept.name}>
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
                            <div className="text-[9px] font-bold text-[#8C8580] uppercase mt-1">Done</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[#EB4A4A] font-black text-xl leading-none">
                              {dept.today.pending}
                            </div>
                            <div className="text-[9px] font-bold text-[#8C8580] uppercase mt-1">Pending</div>
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
                            <div className="text-[9px] font-bold text-[#8C8580] uppercase mt-1">Done</div>
                          </div>
                          <div className="text-center">
                            <div className="text-[#F4D35E] font-black text-xl leading-none">
                              {dept.thisWeek.pending}
                            </div>
                            <div className="text-[9px] font-bold text-[#8C8580] uppercase mt-1">Pending</div>
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