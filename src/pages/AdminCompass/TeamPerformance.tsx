import React, { useState, useEffect, useMemo } from "react";
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
  Check,
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import axios from "axios";
import TeamMembersTable from "./TeamMembersTable";
import { cn } from "@/lib/utils";
import { getBaseUrl, getToken } from "@/utils/auth";

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

const EMPTY_DASHBOARD_DATA: TeamDashboardData = {
  summary: {
    active_members: 0,
    total_kpis: 0,
    completed_actions: 0,
    team_reviews: 0,
  },
  period: { from: "", to: "" },
  total_members: 0,
  members: [],
  grouped_by_department: [],
};

const getDashboardToken = () =>
  localStorage.getItem("auth_token") || getToken() || "";

const normalizeDashboardData = (payload: unknown): TeamDashboardData => {
  const record =
    payload && typeof payload === "object"
      ? (payload as Partial<TeamDashboardData>)
      : {};
  const groupedByDepartment = Array.isArray(record.grouped_by_department)
    ? record.grouped_by_department
    : [];
  const members = Array.isArray(record.members)
    ? record.members
    : groupedByDepartment.flatMap((group) =>
        Array.isArray(group.members) ? group.members : []
      );

  return {
    ...EMPTY_DASHBOARD_DATA,
    ...record,
    summary: {
      ...EMPTY_DASHBOARD_DATA.summary,
      ...(record.summary || {}),
    },
    period: {
      ...EMPTY_DASHBOARD_DATA.period,
      ...(record.period || {}),
    },
    members,
    grouped_by_department: groupedByDepartment,
    total_members: record.total_members ?? members.length,
  };
};

const csvHeaders: Array<{ label: string; key: keyof TeamMember }> = [
  { label: "Score", key: "score" },
  { label: "Name", key: "name" },
  { label: "Email", key: "email" },
  { label: "Designation", key: "designation" },
  { label: "Department", key: "department" },
  { label: "Daily Reports", key: "daily_reports" },
  { label: "Day Rating", key: "day_rating" },
  { label: "Weekly Reports", key: "weekly_reports" },
  { label: "Week Rating", key: "week_rating" },
  { label: "Tasks", key: "tasks" },
  { label: "Issues", key: "issues" },
  { label: "KPIs", key: "kpis" },
  { label: "Daily Checklists", key: "daily_checklists" },
  { label: "Weekly Checklists", key: "weekly_checklists" },
  { label: "SOPs", key: "sops" },
  { label: "Goals", key: "goals" },
  { label: "DISC Type", key: "disc_type" },
];

const escapeCsvValue = (value: unknown) => {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const downloadCsvFile = (filename: string, csv: string) => {
  const blob = new Blob([`\uFEFF${csv}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
};

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
  const [departmentOpen, setDepartmentOpen] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [departmentId] = useState<string>("");
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
        const baseUrl = getBaseUrl();
        const token = getDashboardToken();
        if (!baseUrl || !token) {
          console.error("Missing authentication credentials");
          return;
        }

        const queryParams = new URLSearchParams();
        if (departmentId) queryParams.append("department_id", departmentId);
        queryParams.append("group_by_dept", groupByDept.toString());

        const requestConfig = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        };
        const queryString = queryParams.toString();
        const endpoints = [
          "/business_compass/team_dashboard.json",
          "/team_dashboard.json",
        ];
        let response;
        let lastError: unknown;

        for (const endpoint of endpoints) {
          try {
            response = await axios.get(
              `${baseUrl}${endpoint}?${queryString}`,
              requestConfig
            );
            break;
          } catch (error) {
            lastError = error;
            if (!axios.isAxiosError(error) || error.response?.status !== 404) {
              throw error;
            }
          }
        }

        if (!response) throw lastError;

        const data = normalizeDashboardData(
          response.data?.data ?? response.data?.team_dashboard ?? response.data
        );
        setDashboardData(data);
        const uniqueDepts = Array.from(
          new Set(
            data.members?.map((m: TeamMember) => m.department).filter(Boolean)
          )
        ) as string[];
        setDepartments(uniqueDepts);
      } catch (error) {
        console.error("Error fetching team dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamDashboard();
  }, [
    departmentId,
    groupByDept,
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

  const handleDownloadCsv = () => {
    if (!filteredMembers.length) {
      console.warn("No team members to export");
      return;
    }

    const rows = [
      csvHeaders.map((header) => escapeCsvValue(header.label)).join(","),
      ...filteredMembers.map((member) =>
        csvHeaders
          .map((header) => escapeCsvValue(member[header.key]))
          .join(",")
      ),
    ];
    const today = new Date().toISOString().slice(0, 10);
    downloadCsvFile(`team-dashboard-${today}.csv`, rows.join("\r\n"));
  };

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
  const departmentOptions = useMemo(
    () =>
      [...departments].sort((left, right) =>
        left.localeCompare(right, undefined, { sensitivity: "base" })
      ),
    [departments]
  );
  const selectedDepartmentLabel =
    departmentFilter === "all" ? "All Departments" : departmentFilter;

  return (
    <div style={{ fontFamily: C.font }} className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-[20px] border p-4 shadow-sm"
                style={{ background: C.cardBg, borderColor: C.primaryBord }}
              >
                <div className="flex items-center gap-4">
                  <Shimmer w="48px" h={48} />
                  <div className="flex flex-col gap-2 flex-1">
                    <Shimmer w="60%" h={10} />
                    <Shimmer w="35%" h={28} />
                  </div>
                </div>
              </div>
            ))
          : summaryCards.map((card, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-[20px] border p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  background: C.cardBg,
                  borderColor: C.primaryBord,
                }}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: card.bg }}
                >
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p
                    className="text-[11px] font-medium uppercase tracking-wide"
                    style={{ color: C.textMuted }}
                  >
                    {card.title}
                  </p>
                  <p
                    className="mt-1 text-3xl font-semibold tabular-nums"
                    style={{ color: C.textMain }}
                  >
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs font-normal" style={{ color: C.textMuted }}>
                    {card.tag}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Filters */}
      <div
        className="space-y-4 rounded-[20px] border p-4 shadow-sm sm:p-5"
        style={{
          background: C.cardBg,
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

          <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "flex h-9 w-[190px] items-center justify-between rounded-xl border bg-white/80 px-3 text-left text-sm font-normal outline-none transition-colors hover:bg-white focus-visible:border-[#DA7756] focus-visible:ring-2 focus-visible:ring-[#DA7756]/20"
                )}
                style={{ borderColor: C.primaryBord, color: C.textMain }}
              >
                <span className="truncate">{selectedDepartmentLabel}</span>
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 text-neutral-400" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[260px] p-0" align="start">
              <Command>
                <CommandInput placeholder="Search department..." />
                <CommandList>
                  <CommandEmpty>No department found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="All Departments"
                      onSelect={() => {
                        setDepartmentFilter("all");
                        setDepartmentOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          departmentFilter === "all" ? "opacity-100" : "opacity-0"
                        )}
                      />
                      All Departments
                    </CommandItem>
                    {departmentOptions.map((dept) => (
                      <CommandItem
                        key={dept}
                        value={dept}
                        onSelect={() => {
                          setDepartmentFilter(dept);
                          setDepartmentOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            departmentFilter === dept ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {dept}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

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
            type="button"
            onClick={() => setGroupByDept(!groupByDept)}
            className="inline-flex h-9 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all"
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
            type="button"
            onClick={handleDownloadCsv}
            disabled={loading || filteredMembers.length === 0}
            className="inline-flex h-9 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: C.cardBg,
              color: loading || filteredMembers.length === 0 ? C.textMuted : C.primary,
              borderColor: C.primaryBord,
              fontFamily: C.font,
            }}
            onMouseEnter={(e) => {
              if (!loading && filteredMembers.length > 0) {
                e.currentTarget.style.background = C.primaryBg;
              }
            }}
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
              className="text-[11px] font-medium"
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
            type="button"
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
            className="h-9 rounded-xl border px-4 text-[12px] font-medium transition-all"
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
                  className="text-sm font-medium"
                  style={{ color: C.textMain }}
                >
                  {group.department}
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-medium text-white"
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
                              className="px-3 py-3 text-center text-[10px] font-medium uppercase tracking-wider"
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
                            <td className="px-3 py-3">
  <div className="flex items-center gap-2">
    <div
      className="shrink-0 rounded-full"
      style={{
        width: "32px",
        height: "32px",
        backgroundColor: ["#3b82f6","#a855f7","#ec4899","#22c55e","#f97316","#ef4444","#6366f1","#06b6d4"][index % 8],
        position: "relative",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "11px",
          fontWeight: 600,
          color: "white",
          lineHeight: 1,
        }}
      >
        {member.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)}
      </span>
    </div>
    <div>
      <p className="text-xs font-medium" style={{ color: C.textMain }}>
        {member.name}
      </p>
      <p className="text-[11px]" style={{ color: C.textMuted }}>
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
                                className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
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
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-sky-100 px-2 text-[11px] font-medium text-sky-700">
                                {member.daily_reports}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className="rounded-lg border px-2 py-1 text-[11px] font-medium"
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
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-sky-100 px-2 text-[11px] font-medium text-sky-700">
                                {member.weekly_reports}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span
                                className="rounded-lg border px-2 py-1 text-[11px] font-medium"
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
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-purple-100 px-2 text-[11px] font-medium text-purple-700">
                                {member.tasks}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-rose-100 px-2 text-[11px] font-medium text-rose-700">
                                {member.issues}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-emerald-100 px-2 text-[11px] font-medium text-emerald-700">
                                {member.kpis}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-amber-100 px-2 text-[11px] font-medium text-amber-700">
                                {member.daily_checklists}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-lg bg-indigo-100 px-2 text-[11px] font-medium text-indigo-700">
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
