import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import stepathonAPI, {
  TopEmployee,
  TopEmployeeInCompany,
  TopCompanyInOfficePark,
  TopCompany,
  TopOfficePark,
  GenderWiseParticipant,
  SiteWiseAchiever,
  TopSite,
} from "@/services/stepathonAPI";

// ─── Static bar chart data (kept as-is) ──────────────────────────────────────

const staticBarChartData = [
  { name: "IT", avgSteps: 17800 },
  { name: "Operations", avgSteps: 16500 },
  { name: "HR", avgSteps: 15200 },
  { name: "Finance", avgSteps: 14800 },
  { name: "Sales", avgSteps: 14100 },
  { name: "Marketing", avgSteps: 13500 },
  { name: "Legal", avgSteps: 12900 },
  { name: "Admin", avgSteps: 12100 },
  { name: "Security", avgSteps: 11400 },
  { name: "Facilities", avgSteps: 10800 },
];

// ─── Gender colour map ────────────────────────────────────────────────────────

const GENDER_COLORS: Record<string, string> = {
  male: "#c4b99d",
  female: "#8b7355",
  other: "#e5d5b5",
};

// ─── Scoreboard Card ─────────────────────────────────────────────────────────

interface ScoreboardCardProps {
  title: string;
  columns: { label: string; align?: "left" | "center" | "right" }[];
  rows: (string | number)[][];
  loading?: boolean;
}

const ScoreboardCard: React.FC<ScoreboardCardProps> = ({
  title,
  columns,
  rows,
  loading,
}) => (
  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100">
    {/* Orange header */}
    <div className="bg-[#c4b89d4a] flex items-center justify-between px-4 py-3">
      <span className="text-black font-semibold text-sm">{title}</span>
      {/* <ChevronRight className="w-5 h-5 text-black" /> */}
    </div>
    {/* Column headers */}
    <div className="grid border-b border-gray-100 bg-white" style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
      {columns.map((col, i) => (
        <div
          key={i}
          className={`px-3 py-2 text-xs font-bold text-gray-800 ${
            i === 0 ? "text-left" : i === columns.length - 1 ? "text-right" : "text-center"
          }`}
        >
          {col.label}
        </div>
      ))}
    </div>
    {/* Rows */}
    {loading ? (
      <div className="py-8 text-center text-sm text-gray-400">Loading…</div>
    ) : rows.length === 0 ? (
      <div className="py-8 text-center text-sm text-gray-400">No data available</div>
    ) : (
      rows.map((row, ri) => (
        <div
          key={ri}
          className="grid border-b border-gray-50 last:border-b-0"
          style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}
        >
          {row.map((cell, ci) => (
            <div
              key={ci}
              className={`px-3 py-2 text-sm text-gray-700 ${
                ci === 0 ? "text-left font-semibold" : ci === columns.length - 1 ? "text-right" : "text-center"
              }`}
            >
              {cell}
            </div>
          ))}
        </div>
      ))
    )}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const StepathonPage: React.FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const firstOfMonth = today.slice(0, 8) + "01";

  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);

  // ── API state ──────────────────────────────────────────────────────────────
  const [topEmployees, setTopEmployees] = useState<TopEmployee[]>([]);
  const [topEmployeesInCompany, setTopEmployeesInCompany] = useState<TopEmployeeInCompany[]>([]);
  const [topCompaniesInOfficePark, setTopCompaniesInOfficePark] = useState<TopCompanyInOfficePark[]>([]);
  const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
  const [topOfficeParks, setTopOfficeParks] = useState<TopOfficePark[]>([]);
  const [genderData, setGenderData] = useState<GenderWiseParticipant[]>([]);
  const [siteAchievers, setSiteAchievers] = useState<SiteWiseAchiever[]>([]);
  const [topSites, setTopSites] = useState<TopSite[]>([]);
  const [dailyStepCount, setDailyStepCount] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  // ── Fetch all data ─────────────────────────────────────────────────────────
  const fetchAll = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      const [
        empRes,
        empCompRes,
        coOpRes,
        coRes,
        opRes,
        genderRes,
        achieversRes,
        sitesRes,
        dailyRes,
      ] = await Promise.allSettled([
        stepathonAPI.getTopEmployees(start, end),
        stepathonAPI.getTopEmployeesInCompany(start, end),
        stepathonAPI.getTopCompaniesInOfficePark(start, end),
        stepathonAPI.getTopCompanies(start, end),
        stepathonAPI.getTopOfficeParks(start, end),
        stepathonAPI.getGenderWiseParticipants(start, end),
        stepathonAPI.getSiteWiseAchievers(start, end),
        stepathonAPI.getTop10Sites(start, end),
        stepathonAPI.getOrganisationDailyStepCount(end),
      ]);

      if (empRes.status === "fulfilled") setTopEmployees(empRes.value?.top_employees ?? []);
      if (empCompRes.status === "fulfilled") setTopEmployeesInCompany(empCompRes.value?.top_employees_in_company ?? []);
      if (coOpRes.status === "fulfilled") setTopCompaniesInOfficePark(coOpRes.value?.top_companies_in_office_park ?? []);
      if (coRes.status === "fulfilled") setTopCompanies(coRes.value?.top_companies ?? []);
      if (opRes.status === "fulfilled") setTopOfficeParks(opRes.value?.top_office_parks ?? []);
      if (genderRes.status === "fulfilled") setGenderData(genderRes.value?.data ?? []);
      if (achieversRes.status === "fulfilled") setSiteAchievers(achieversRes.value?.data ?? []);
      if (sitesRes.status === "fulfilled") setTopSites(sitesRes.value?.data ?? []);
      if (dailyRes.status === "fulfilled") setDailyStepCount(dailyRes.value?.total_steps ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll(startDate, endDate);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = () => {
    fetchAll(startDate, endDate);
  };

  // ── Derived data ───────────────────────────────────────────────────────────
  const totalGenderParticipants = genderData.reduce((s, d) => s + d.user_count, 0);

  const pieData = genderData.map((d) => ({
    name: d.gender.charAt(0).toUpperCase() + d.gender.slice(1),
    value: d.user_count,
    color: GENDER_COLORS[d.gender.toLowerCase()] ?? "#c4b99d",
  }));

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Pulse Stepathon</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-0.5">Select Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  title="Select Start Date"
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                />
              </div>
              <span className="text-gray-500 font-semibold mt-4">TO</span>
              <div className="flex flex-col">
                <label className="text-xs text-gray-500 mb-0.5">Select End Date</label>
                <input
                  type="date"
                  value={endDate}
                  title="Select End Date"
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-[#C72030]"
                />
              </div>
            </div>
            <button
              onClick={handleApply}
              className="mt-4 bg-[#F2EEE9] hover:bg-[#e8e0d4] text-[#C72030] px-6 py-1.5 text-sm font-semibold transition-colors rounded"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* ── Row 1: Scoreboards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {/* Top Employees */}
          <ScoreboardCard
            title="Top Employees"
            columns={[{ label: "Rank" }, { label: "Employees" }, { label: "Steps" }]}
            loading={loading}
            rows={topEmployees.map((e) => [
              `#${e.rank}`,
              `${e.firstname} ${e.lastname}${e.company_name ? ` (${e.company_name})` : ""}`,
              e.steps.toLocaleString(),
            ])}
          />

          {/* Top Employees in my Company */}
          <ScoreboardCard
            title="Top Employees in my Company"
            columns={[{ label: "Rank" }, { label: "Employees" }, { label: "Steps" }]}
            loading={loading}
            rows={topEmployeesInCompany.map((e) => [
              `#${e.rank}`,
              `${e.firstname} ${e.lastname}`,
              e.steps.toLocaleString(),
            ])}
          />

          {/* Top Companies in my Office Parks */}
          <ScoreboardCard
            title="Top Companies in my Office Parks"
            columns={[{ label: "Rank" }, { label: "Employees" }, { label: "Steps" }]}
            loading={loading}
            rows={topCompaniesInOfficePark.map((c) => [
              `#${c.rank}`,
              c.company_name ?? "—",
              c.steps.toLocaleString(),
            ])}
          />

          {/* Top Companies */}
          <ScoreboardCard
            title="Top Companies"
            columns={[{ label: "Rank" }, { label: "Company Name" }, { label: "Steps" }]}
            loading={loading}
            rows={topCompanies.map((c) => [
              `#${c.rank}`,
              c.company_name ?? "—",
              c.steps.toLocaleString(),
            ])}
          />

          {/* Top Office Parks */}
          <ScoreboardCard
            title="Top Office Parks"
            columns={[{ label: "Rank" }, { label: "Site Name" }, { label: "Steps" }]}
            loading={loading}
            rows={topOfficeParks.map((o) => [
              `#${o.rank}`,
              o.site_name,
              o.steps.toLocaleString(),
            ])}
          />
        </div>

        {/* ── Row 2: Gender Chart + Site Achievers + Top 10 Sites ─────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Gender-wise Participants */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <div className="bg-[#c4b89d4a] px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">Gender-wise Participants</span>
            </div>
            <CardContent className="pt-4">
              {loading ? (
                <div className="h-52 flex items-center justify-center text-sm text-gray-400">Loading…</div>
              ) : pieData.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-sm text-gray-400">No data</div>
              ) : (
                <>
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [
                            `${value} (${totalGenderParticipants ? ((value / totalGenderParticipants) * 100).toFixed(1) : 0}%)`,
                            "",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-2">
                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-xs text-gray-600">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* 20K Steps Achievers Count (site-wise) */}
          <Card className="bg-white shadow-sm border border-gray-200 h-full">
            <div className="bg-[#c4b89d4a] px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">20K Steps Achievers Count</span>
            </div>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[300px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-800 uppercase">Rank</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-800 uppercase">Site Name</th>
                      <th className="px-4 py-2 text-right text-xs font-bold text-gray-800 uppercase">User Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
                    ) : siteAchievers.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">No data available</td></tr>
                    ) : (
                      siteAchievers.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2 text-sm font-semibold text-gray-700">#{row.rank}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{row.site_name}</td>
                          <td className="px-4 py-2 text-sm text-gray-700 text-right">{row.user_count}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Top 10 Site Level Ranking */}
          <Card className="bg-white shadow-sm border border-gray-200 h-full">
            <div className="bg-[#c4b89d4a] px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">Top 10 Site Level Ranking</span>
            </div>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[300px]">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-800 uppercase">Rank</th>
                      <th className="px-4 py-2 text-left text-xs font-bold text-gray-800 uppercase">Site Name</th>
                      <th className="px-4 py-2 text-right text-xs font-bold text-gray-800 uppercase">Avg Steps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
                    ) : topSites.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">No data available</td></tr>
                    ) : (
                      topSites.map((row, i) => (
                        <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2 text-sm font-semibold text-gray-700">#{row.rank}</td>
                          <td className="px-4 py-2 text-sm text-gray-700">{row.site_name}</td>
                          <td className="px-4 py-2 text-sm text-gray-700 text-right">{row.average_steps.toLocaleString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Organisation Daily Step Count ───────────────────────────────── */}
        <Card className="bg-white shadow-sm border border-gray-200 max-w-xs">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e5e0d3] flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-4 6l2 2-4.41 5H11v3h2v-3h2.5l-2.5-3 1-2L10.5 9H9a2 2 0 0 0-1.94 1.5L6 14h2l1.5-2.5z"
                    fill="#c72030"
                  />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? "—" : dailyStepCount !== null ? dailyStepCount.toLocaleString() : "—"}
                </p>
                <p className="text-sm text-gray-600 font-medium">An Organisation's Daily Step Count</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Static Bar Chart ────────────────────────────────────────────── */}
       {/*  <Card className="bg-white shadow-sm border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-800 text-center block">
              Function Wise Average Steps
            </span>
          </div>
          <CardContent className="pt-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={staticBarChartData}
                  margin={{ top: 10, right: 20, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="name"
                    fontSize={11}
                    tick={{ fill: "#6b7280" }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    fontSize={11}
                    tick={{ fill: "#6b7280" }}
                    label={{
                      value: "Average Steps Taken",
                      angle: -90,
                      position: "insideLeft",
                      offset: -5,
                      style: { textAnchor: "middle", fill: "#6b7280", fontSize: 11 },
                    }}
                    tickFormatter={(v) => v.toLocaleString()}
                    domain={[0, 20000]}
                    ticks={[0, 5000, 10000, 15000, 20000]}
                  />
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), "Avg Steps"]} />
                  <Bar dataKey="avgSteps" fill="#c4b99d" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
};

export default StepathonPage;
