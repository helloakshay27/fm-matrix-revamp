import React, { useState, useEffect } from "react";
import {
  Users,
  LineChart,
  CheckCircle,
  Crosshair,
  Search,
  Download,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import TeamMembersTable from "./TeamMembersTable";

const C = {
  primary: "#DA7756",
  primaryHov: "#c9673f",
  primaryBg: "#fdf9f7",
  primaryTint: "rgba(218,119,86,0.06)",
  primaryBord: "#e8e3de",
  primaryBordStrong: "#d4cdc6",
  pageBg: "#f6f4ee",
  cardBg: "#ffffff",
  tealBg: "#9EC8BA",
  textMain: "#1a1a1a",
  textMuted: "#6b7280",
  borderLgt: "#ebebeb",
  font: "'Poppins', sans-serif",
};

interface TeamMember {
  user_id: number;
  name: string;
  email: string;
  designation: string | null;
  department: string | null;
  department_id: number | null;
  score: number;
  daily_reports: number;
  day_rating: number;
  weekly_reports: number;
  week_rating: number;
  daily_checklists: number;
  weekly_checklists: number;
  tasks: number;
  issues: number;
  kpis: number;
  sops: number;
  goals: number;
  disc_type: string | null;
}

interface DepartmentGroup {
  department: string;
  count: number;
  members: TeamMember[];
}

interface TeamDashboardData {
  summary: {
    active_members: number;
    total_kpis: number;
    completed_actions: number;
    team_reviews: number;
  };
  period: { from: string; to: string };
  total_members: number;
  members?: TeamMember[];
  grouped_by_department?: DepartmentGroup[];
}

const Shimmer = ({ w = "100%", h = 16 }: { w?: string; h?: number }) => (
  <div
    className="animate-pulse rounded-2xl"
    style={{ width: w, height: h, background: "#e5e1d8" }}
  />
);

export const TeamPerformance = () => {
  const [dashboardData, setDashboardData] = useState<TeamDashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentId, setDepartmentId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [minDailyReports, setMinDailyReports] = useState("");
  const [minWeeklyReports, setMinWeeklyReports] = useState("");
  const [minKpis, setMinKpis] = useState("");
  const [minTasks, setMinTasks] = useState("");
  const [groupByDept, setGroupByDept] = useState(false);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());

  const toggleDeptExpansion = (deptName: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptName)) newExpanded.delete(deptName);
    else newExpanded.add(deptName);
    setExpandedDepts(newExpanded);
  };

  useEffect(() => {
    const fetchTeamDashboard = async () => {
      try {
        setLoading(true);
        const baseUrl = localStorage.getItem("baseUrl");
        const token = localStorage.getItem("token");
        if (!baseUrl || !token) {
          toast.error("Missing authentication credentials");
          return;
        }

        const queryParams = new URLSearchParams();
        queryParams.append("search", searchTerm);
        if (departmentId) queryParams.append("department_id", departmentId);
        queryParams.append("group_by_dept", groupByDept.toString());
        if (minScore) queryParams.append("min_score", minScore);
        if (maxScore) queryParams.append("max_score", maxScore);
        if (minDailyReports)
          queryParams.append("min_daily_reports", minDailyReports);
        if (minWeeklyReports)
          queryParams.append("min_weekly_reports", minWeeklyReports);
        if (minKpis) queryParams.append("min_kpis", minKpis);
        if (minTasks) queryParams.append("min_tasks", minTasks);

        const response = await axios.get(
          `https://${baseUrl}/team_dashboard.json?${queryParams.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = response.data.data;
        setDashboardData(data);
        const uniqueDepts = Array.from(
          new Set(
            data.members.map((m: TeamMember) => m.department).filter(Boolean)
          )
        ) as string[];
        setDepartments(uniqueDepts);
      } catch (error) {
        console.error("Error fetching team dashboard:", error);
        toast.error("Failed to load team dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchTeamDashboard();
  }, [
    searchTerm,
    departmentId,
    groupByDept,
    minScore,
    maxScore,
    minDailyReports,
    minWeeklyReports,
    minKpis,
    minTasks,
  ]);

  const filteredMembers = (dashboardData?.members || []).filter((member) => {
    const matchesSearch =
      !searchTerm ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.designation || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesDept =
      departmentFilter === "all" || member.department === departmentFilter;
    const matchesScore =
      (!minScore || member.score >= parseInt(minScore)) &&
      (!maxScore || member.score <= parseInt(maxScore));
    const matchesDailyReports =
      !minDailyReports || member.daily_reports >= parseInt(minDailyReports);
    const matchesWeeklyReports =
      !minWeeklyReports || member.weekly_reports >= parseInt(minWeeklyReports);
    const matchesKpis = !minKpis || member.kpis >= parseInt(minKpis);
    const matchesTasks = !minTasks || member.tasks >= parseInt(minTasks);
    return (
      matchesSearch &&
      matchesDept &&
      matchesScore &&
      matchesDailyReports &&
      matchesWeeklyReports &&
      matchesKpis &&
      matchesTasks
    );
  });

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    departmentFilter,
    minScore,
    maxScore,
    minDailyReports,
    minWeeklyReports,
    minKpis,
    minTasks,
  ]);

  const summaryCards = [
    {
      title: "Active Members",
      value: dashboardData?.summary.active_members ?? 0,
      icon: <Users className="w-5 h-5" style={{ color: "#3b82f6" }} />,
      accent: "#3b82f6",
      bg: "#eff6ff",
      tag: "Team",
    },
    {
      title: "Total KPIs",
      value: dashboardData?.summary.total_kpis ?? 0,
      icon: <LineChart className="w-5 h-5" style={{ color: "#22c55e" }} />,
      accent: "#22c55e",
      bg: "#f0fdf4",
      tag: "Tracking",
    },
    {
      title: "Completed Actions",
      value: dashboardData?.summary.completed_actions ?? 0,
      icon: <CheckCircle className="w-5 h-5" style={{ color: "#ef4444" }} />,
      accent: "#ef4444",
      bg: "#fef2f2",
      tag: "This Week",
    },
    {
      title: "Team Reviews",
      value: dashboardData?.summary.team_reviews ?? 0,
      icon: <Crosshair className="w-5 h-5" style={{ color: C.primary }} />,
      accent: C.primary,
      bg: "#fdf9f7",
      tag: "Total",
    },
  ];

  const inputCls =
    "text-sm rounded-xl border bg-white/80 focus-visible:ring-2 focus-visible:ring-[#DA7756]/20 focus-visible:border-[#DA7756]";

  return (
    <div style={{ fontFamily: C.font }} className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border"
                style={{ background: C.cardBg, borderColor: C.primaryBord }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col gap-2 flex-1">
                    <Shimmer w="60%" h={12} />
                    <Shimmer w="40%" h={28} />
                    <Shimmer w="50%" h={20} />
                  </div>
                  <Shimmer w="40px" h={40} />
                </div>
              </div>
            ))
          : summaryCards.map((card, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl border flex items-start justify-between shadow-sm"
                style={{
                  background: card.bg,
                  borderColor: C.primaryBord,
                  borderTop: `3px solid ${card.accent}`,
                }}
              >
                <div className="flex flex-col gap-1.5">
                  <p
                    className="text-[11px] font-black uppercase tracking-[0.12em]"
                    style={{ color: card.accent }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="text-3xl font-black"
                    style={{ color: C.textMain }}
                  >
                    {card.value}
                  </p>
                  <span
                    className="text-[11px] font-black px-2.5 py-1 rounded-full w-fit"
                    style={{
                      background: `${card.accent}20`,
                      color: card.accent,
                    }}
                  >
                    {card.tag}
                  </span>
                </div>
                <div
                  className="p-2.5 rounded-xl"
                  style={{ background: `${card.accent}15` }}
                >
                  {card.icon}
                </div>
              </div>
            ))}
      </div>

      {/* Filters */}
      <div
        className="rounded-2xl border p-5 space-y-4"
        style={{
          background: "rgba(218,119,86,0.07)",
          borderColor: C.primaryBord,
        }}
      >
        {/* Row 1 */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[240px]">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: `${C.primary}99` }}
            />
            <Input
              type="text"
              placeholder="Search by name, email, or designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 h-9 ${inputCls}`}
              style={{ borderColor: C.primaryBord }}
            />
          </div>

          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger
              className={`w-[170px] h-9 ${inputCls}`}
              style={{ borderColor: C.primaryBord }}
            >
              <SelectValue placeholder="All Departments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger
              className={`w-[140px] h-9 ${inputCls}`}
              style={{ borderColor: C.primaryBord }}
            >
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
            </SelectContent>
          </Select>

          <button
            onClick={() => setGroupByDept(!groupByDept)}
            className="inline-flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-black border transition-all"
            style={{
              background: groupByDept ? C.primary : C.cardBg,
              color: groupByDept ? "#fff" : C.textMain,
              borderColor: groupByDept ? C.primary : C.primaryBord,
              fontFamily: C.font,
            }}
            onMouseEnter={(e) => {
              if (!groupByDept)
                e.currentTarget.style.borderColor = C.primaryBordStrong;
            }}
            onMouseLeave={(e) => {
              if (!groupByDept)
                e.currentTarget.style.borderColor = C.primaryBord;
            }}
          >
            <LayoutGrid className="h-4 w-4" />
            Group by Dept
          </button>

          <button
            className="inline-flex items-center gap-2 px-4 h-9 rounded-xl text-sm font-black border transition-all"
            style={{
              background: C.cardBg,
              color: C.primary,
              borderColor: C.primaryBord,
              fontFamily: C.font,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = C.primaryBg)
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = C.cardBg)}
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
        </div>

        {/* Row 2 - Advanced Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <label
              className="text-[11px] font-black"
              style={{ color: C.textMuted }}
            >
              Score:
            </label>
            <Input
              type="number"
              placeholder="Min"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className={`w-20 h-9 ${inputCls}`}
              style={{ borderColor: C.primaryBord }}
            />
            <span className="text-xs" style={{ color: C.textMuted }}>
              –
            </span>
            <Input
              type="number"
              placeholder="Max"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              className={`w-20 h-9 ${inputCls}`}
              style={{ borderColor: C.primaryBord }}
            />
          </div>
          <Input
            type="number"
            placeholder="Min Daily Reports"
            value={minDailyReports}
            onChange={(e) => setMinDailyReports(e.target.value)}
            className={`w-36 h-9 ${inputCls}`}
            style={{ borderColor: C.primaryBord }}
          />
          <Input
            type="number"
            placeholder="Min Weekly Reports"
            value={minWeeklyReports}
            onChange={(e) => setMinWeeklyReports(e.target.value)}
            className={`w-40 h-9 ${inputCls}`}
            style={{ borderColor: C.primaryBord }}
          />
          <Input
            type="number"
            placeholder="Min KPIs"
            value={minKpis}
            onChange={(e) => setMinKpis(e.target.value)}
            className={`w-28 h-9 ${inputCls}`}
            style={{ borderColor: C.primaryBord }}
          />
          <Input
            type="number"
            placeholder="Min Tasks"
            value={minTasks}
            onChange={(e) => setMinTasks(e.target.value)}
            className={`w-28 h-9 ${inputCls}`}
            style={{ borderColor: C.primaryBord }}
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setDepartmentFilter("all");
              setMinScore("");
              setMaxScore("");
              setMinDailyReports("");
              setMinWeeklyReports("");
              setMinKpis("");
              setMinTasks("");
              setGroupByDept(false);
              setExpandedDepts(new Set());
              setCurrentPage(1);
            }}
            className="px-4 h-9 rounded-xl text-[12px] font-black border transition-all"
            style={{
              background: C.cardBg,
              color: C.primary,
              borderColor: C.primaryBord,
              fontFamily: C.font,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = C.primaryBg)
            }
            onMouseLeave={(e) => (e.currentTarget.style.background = C.cardBg)}
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table */}
      {groupByDept && dashboardData?.grouped_by_department ? (
        <div className="space-y-3">
          {dashboardData.grouped_by_department.map((group) => (
            <div
              key={group.department}
              className="rounded-2xl border overflow-hidden"
              style={{
                borderColor: C.primaryBord,
                background: "rgba(218,119,86,0.05)",
              }}
            >
              <button
                onClick={() => toggleDeptExpansion(group.department)}
                className="w-full flex items-center gap-3 px-6 py-4 transition-colors text-left"
                style={{ fontFamily: C.font }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(218,119,86,0.06)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                {expandedDepts.has(group.department) ? (
                  <ChevronDown
                    className="h-4 w-4 shrink-0"
                    style={{ color: C.primary }}
                  />
                ) : (
                  <ChevronRight
                    className="h-4 w-4 shrink-0"
                    style={{ color: C.primary }}
                  />
                )}
                <Users
                  className="h-4 w-4 shrink-0"
                  style={{ color: C.primary }}
                />
                <span
                  className="font-black text-sm"
                  style={{ color: C.textMain }}
                >
                  {group.department}
                </span>
                <span
                  className="text-[11px] font-black px-2.5 py-0.5 rounded-full text-white"
                  style={{ background: C.primary }}
                >
                  {group.count} members
                </span>
              </button>

              {expandedDepts.has(group.department) && (
                <div
                  className="border-t p-4"
                  style={{ borderColor: C.primaryBord, background: C.cardBg }}
                >
                  <div
                    className="overflow-x-auto rounded-xl border"
                    style={{ borderColor: C.primaryBord }}
                  >
                    <table className="w-full min-w-[1400px] text-sm">
                      <thead>
                        <tr
                          style={{
                            borderBottom: `1px solid ${C.primaryBord}`,
                            background: "rgba(218,119,86,0.06)",
                          }}
                        >
                          {[
                            "Score",
                            "User",
                            "Designation",
                            "Department",
                            "Daily Reports",
                            "Day Rating",
                            "Weekly Reports",
                            "Week Rating",
                            "Tasks",
                            "Issues",
                            "KPIs",
                            "Daily Checklists",
                            "Weekly Checklists",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-3 py-3 text-center text-[10px] font-black uppercase tracking-wider"
                              style={{ color: C.textMuted }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {group.members.map((member, index) => (
                          <tr
                            key={member.user_id}
                            className="transition-colors"
                            style={{ borderBottom: `1px solid ${C.borderLgt}` }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = C.primaryBg)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = "transparent")
                            }
                          >
                            <td className="px-3 py-3 text-center">
                              <div
                                className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-xs font-black ${member.score >= 40 ? "bg-emerald-100 text-emerald-700" : member.score >= 20 ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}
                              >
                                {member.score}
                              </div>
                            </td>
                            <td className="px-3 py-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white ${["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-orange-500", "bg-red-500", "bg-indigo-500", "bg-cyan-500"][index % 8]}`}
                                >
                                  {member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)}
                                </div>
                                <div>
                                  <p
                                    className="font-black text-xs"
                                    style={{ color: C.textMain }}
                                  >
                                    {member.name}
                                  </p>
                                  <p
                                    className="text-[11px]"
                                    style={{ color: C.textMuted }}
                                  >
                                    {member.email}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td
                              className="px-3 py-3 text-center text-xs font-semibold"
                              style={{ color: C.textMuted }}
                            >
                              {member.designation || "—"}
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className="rounded-full px-2.5 py-1 text-[11px] font-black border"
                                style={{
                                  background: C.cardBg,
                                  borderColor: C.primaryBord,
                                  color: C.textMain,
                                }}
                              >
                                {member.department || "—"}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[11px] font-black bg-sky-100 text-sky-700">
                                {member.daily_reports}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className="rounded-lg px-2 py-1 text-[11px] font-black border"
                                style={{
                                  background: C.cardBg,
                                  borderColor: C.primaryBord,
                                  color: C.textMain,
                                }}
                              >
                                {member.day_rating}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[11px] font-black bg-sky-100 text-sky-700">
                                {member.weekly_reports}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className="rounded-lg px-2 py-1 text-[11px] font-black border"
                                style={{
                                  background: C.cardBg,
                                  borderColor: C.primaryBord,
                                  color: C.textMain,
                                }}
                              >
                                {member.week_rating}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[11px] font-black bg-purple-100 text-purple-700">
                                {member.tasks}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[11px] font-black bg-rose-100 text-rose-700">
                                {member.issues}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[11px] font-black bg-emerald-100 text-emerald-700">
                                {member.kpis}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[11px] font-black bg-amber-100 text-amber-700">
                                {member.daily_checklists}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg px-2 text-[11px] font-black bg-indigo-100 text-indigo-700">
                                {member.weekly_checklists}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <TeamMembersTable
          members={paginatedMembers}
          loading={loading}
          totalMembers={filteredMembers.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};
