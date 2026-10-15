import React, { useState, useEffect, useCallback } from "react";
import { usePulseEvents } from "@/components/PostHogPulseEvents";
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
import {
  Trophy,
  Users,
  Building2,
  Briefcase,
  MapPin,
  PieChart as PieChartIcon,
  Award,
  BarChart3,
  Footprints,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ANALYTICS_PALETTE } from "@/styles/chartPalette";
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
  male: ANALYTICS_PALETTE[0],
  female: ANALYTICS_PALETTE[1],
  other: ANALYTICS_PALETTE[2],
};

// ─── Section Card (matches PO Details card pattern) ─────────────────────────

interface SectionCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, icon: Icon, children }) => (
  <Card className="rounded-2xl shadow-sm border border-gray-200 h-full">
    <div className="flex items-center gap-3 px-6 pt-6 pb-3">
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center bg-gray-100 text-gray-500 shrink-0">
        <Icon className="w-[18px] h-[18px]" />
      </div>
      <h3 className="text-sm font-semibold uppercase text-[#1A1A1A]">{title}</h3>
    </div>
    <CardContent>{children}</CardContent>
  </Card>
);

// ─── Scoreboard Card ─────────────────────────────────────────────────────────

interface ScoreboardCardProps {
  title: string;
  icon: React.ElementType;
  columns: { label: string }[];
  rows: (string | number)[][];
  loading?: boolean;
}

const ScoreboardCard: React.FC<ScoreboardCardProps> = ({
  title,
  icon,
  columns,
  rows,
  loading,
}) => {
  const lastIndex = columns.length - 1;
  const cellAlign = (i: number) => (i === lastIndex ? "text-right" : "text-left");

  return (
    <SectionCard title={title} icon={icon}>
      <div className="rounded-xl bg-[#F6F4EE] overflow-hidden">
        <div className="max-h-[300px] overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#D5DBDB]">
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-4 py-2.5 text-xs font-semibold uppercase text-gray-500 ${cellAlign(i)}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading || rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-400">
                    {loading ? "Loading…" : "No data available"}
                  </td>
                </tr>
              ) : (
                rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-b border-[#D5DBDB] last:border-b-0 hover:bg-brand-selected transition-colors"
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className={`px-4 py-2.5 text-sm ${cellAlign(ci)} ${
                          ci === 0 ? "w-16 font-semibold text-brand" : "text-gray-900 font-medium"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SectionCard>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const StepathonPage: React.FC = () => {
  const pulseEvents = usePulseEvents();

  useEffect(() => {
    pulseEvents.onModuleViewed({
      module: "Stepathon",
      package: "Pulse Privilege",
      screen: "pulse_stepathon",
    });
  }, [pulseEvents]);

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
    color: GENDER_COLORS[d.gender.toLowerCase()] ?? ANALYTICS_PALETTE[3],
  }));

  return (
    <div className="p-6 mx-auto bg-white min-h-screen">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold">Pulse Stepathon</h1>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col">
            <label htmlFor="stepathon-start-date" className="text-xs text-gray-500 mb-1">
              Start Date
            </label>
            <input
              id="stepathon-start-date"
              type="date"
              value={startDate}
              max={endDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 border border-gray-300 rounded-[8px] px-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <span className="text-sm text-gray-500 font-medium pb-2.5">to</span>
          <div className="flex flex-col">
            <label htmlFor="stepathon-end-date" className="text-xs text-gray-500 mb-1">
              End Date
            </label>
            <input
              id="stepathon-end-date"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 border border-gray-300 rounded-[8px] px-3 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-brand"
            />
          </div>
          <Button size="sm" className="rounded-[8px]" onClick={handleApply} disabled={loading}>
            Apply
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* ── Row 1: Scoreboards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <ScoreboardCard
            title="Top Employees"
            icon={Trophy}
            columns={[{ label: "Rank" }, { label: "Employee" }, { label: "Steps" }]}
            loading={loading}
            rows={topEmployees.map((e) => [
              `#${e.rank}`,
              `${e.firstname} ${e.lastname}${e.company_name ? ` (${e.company_name})` : ""}`,
              e.steps.toLocaleString(),
            ])}
          />

          <ScoreboardCard
            title="Top Employees in my Company"
            icon={Users}
            columns={[{ label: "Rank" }, { label: "Employee" }, { label: "Steps" }]}
            loading={loading}
            rows={topEmployeesInCompany.map((e) => [
              `#${e.rank}`,
              `${e.firstname} ${e.lastname}`,
              e.steps.toLocaleString(),
            ])}
          />

          <ScoreboardCard
            title="Top Companies in my Office Parks"
            icon={Building2}
            columns={[{ label: "Rank" }, { label: "Company" }, { label: "Steps" }]}
            loading={loading}
            rows={topCompaniesInOfficePark.map((c) => [
              `#${c.rank}`,
              c.company_name ?? "—",
              c.steps.toLocaleString(),
            ])}
          />

          <ScoreboardCard
            title="Top Companies"
            icon={Briefcase}
            columns={[{ label: "Rank" }, { label: "Company" }, { label: "Steps" }]}
            loading={loading}
            rows={topCompanies.map((c) => [
              `#${c.rank}`,
              c.company_name ?? "—",
              c.steps.toLocaleString(),
            ])}
          />

          <ScoreboardCard
            title="Top Office Parks"
            icon={MapPin}
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
          <SectionCard title="Gender-wise Participants" icon={PieChartIcon}>
            <div className="rounded-xl bg-[#F6F4EE] p-4">
              {loading || pieData.length === 0 ? (
                <div className="h-52 flex items-center justify-center text-sm text-gray-400">
                  {loading ? "Loading…" : "No data available"}
                </div>
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
            </div>
          </SectionCard>

          <ScoreboardCard
            title="20K Steps Achievers Count"
            icon={Award}
            columns={[{ label: "Rank" }, { label: "Site Name" }, { label: "Users" }]}
            loading={loading}
            rows={siteAchievers.map((row) => [`#${row.rank}`, row.site_name, row.user_count])}
          />

          <ScoreboardCard
            title="Top 10 Site Level Ranking"
            icon={BarChart3}
            columns={[{ label: "Rank" }, { label: "Site Name" }, { label: "Avg Steps" }]}
            loading={loading}
            rows={topSites.map((row) => [
              `#${row.rank}`,
              row.site_name,
              row.average_steps.toLocaleString(),
            ])}
          />
        </div>

        {/* ── Organisation Daily Step Count ───────────────────────────────── */}
        <div className="rounded-2xl bg-white shadow-sm border border-gray-200 px-6 py-5 flex items-center gap-4 max-w-xs">
          <div className="w-11 h-11 rounded-xl bg-brand-light flex items-center justify-center shrink-0">
            <Footprints className="w-5 h-5 text-brand" />
          </div>
          <div>
            <p className="text-2xl font-bold text-[#2C2C2C]">
              {loading ? "—" : dailyStepCount !== null ? dailyStepCount.toLocaleString() : "—"}
            </p>
            <p className="text-sm text-gray-600 font-medium">Organisation's Daily Step Count</p>
          </div>
        </div>

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
