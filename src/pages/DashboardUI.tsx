import React, { useState, useEffect, useCallback, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  FileText,
  FolderOpen,
  CheckCircle,
  Clock,
  Calendar,
  ClipboardList,
  PauseCircle,
  AlertCircle,
  XCircle,
  Download,
  Loader2,
  ChevronDown,
  X,
  Search,
  Eye,
  RefreshCw,
  MessageSquare,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import DashboardChart from "@/components/charts/DashboardChart";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import { AssetAnalyticsSelector } from "@/components/AssetAnalyticsSelector";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";
import jsPDF from "jspdf";

// ─────────────────────────────────────────────────────────
// ── CHART OPTIONS ──
// ─────────────────────────────────────────────────────────
const DASHBOARD_CHART_OPTIONS = [
  {
    id: "projectCompletion",
    label: "Project Completion Rate",
    description: "Completion rate across projects",
  },
  {
    id: "milestonesOverview",
    label: "Milestones Overview",
    description: "Milestone KPI cards",
  },
  {
    id: "milestoneCompletion",
    label: "Milestone Completion Rate",
    description: "Completion rate per milestone",
  },
  {
    id: "assigneeMilestone",
    label: "Assignee Wise Milestone Status",
    description: "Milestone status by assignee",
  },
  {
    id: "tasksOverview",
    label: "Tasks Overview",
    description: "Task KPI cards",
  },
  {
    id: "issuesOverview",
    label: "Issues Overview",
    description: "Issue KPI cards",
  },
  {
    id: "taskCompletion",
    label: "Task Completion Rate",
    description: "Completion rate per task",
  },
  {
    id: "assigneeTask",
    label: "Assignee Wise Task Status",
    description: "Task status by assignee",
  },
  {
    id: "taskDependencies",
    label: "Task Dependencies",
    description: "Blocking / blocked-by / related",
  },
  {
    id: "issueBreakdown",
    label: "Project Wise Issue Breakdown",
    description: "Issue breakdown per project",
  },
  {
    id: "assigneeIssue",
    label: "Assignee Wise Issues",
    description: "Issue status by assignee",
  },
];
const DASHBOARD_CHART_KEYS = DASHBOARD_CHART_OPTIONS.map((o) => o.id);

// ── Report Modal chart options ──
const REPORT_CHART_OPTIONS = [
  {
    id: "milestoneProgress",
    label: "Milestone Progress",
    description: "Completed vs balance milestones",
  },
  {
    id: "taskWiseProgress",
    label: "Task Wise Progress",
    description: "Completed vs balance tasks",
  },
  {
    id: "issueWiseProgress",
    label: "Issue Wise Progress",
    description: "Issue status breakdown",
  },
  {
    id: "milestoneActivityProgress",
    label: "Milestone Activity Wise Progress",
    description: "Milestone-wise completion",
  },
  {
    id: "activityCompletion",
    label: "Activity % Completion",
    description: "Task-wise completion",
  },
  {
    id: "taskDetails",
    label: "Task Details",
    description: "Detailed task information table",
  },
  {
    id: "issueDetails",
    label: "Issue Details",
    description: "Project issues table",
  },
];
const REPORT_CHART_KEYS = REPORT_CHART_OPTIONS.map((o) => o.id);

const MILESTONE_COLORS = ["#AF8260", "#E5E7EB"];
const TASK_COLORS = ["#AF8260", "#E5E7EB"];
const ISSUE_COLORS = ["#E8806B", "#F5A899", "#C94A2B", "#AF8260", "#2E7D9E", "#D4A5A5"];

// ─────────────────────────────────────────────────────────
// ── INTERFACES & HELPERS ──
// ─────────────────────────────────────────────────────────
interface ProjectDropdownItem {
  id: number;
  title: string;
}

interface KpiData {
  milestones: {
    total: number;
    open: number;
    completed: number;
    in_progress: number;
  };
  tasks: {
    total: number;
    open: number;
    in_progress: number;
    completed: number;
    on_hold: number;
    overdue: number;
    aborted: number;
  };
  issues: {
    total: number;
    open: number;
    in_progress: number;
    on_hold: number;
    completed: number;
    closed: number;
    reopened: number;
  };
}

interface ReportProjectInfo {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  completion_percentage: number;
  balance: number;
}
interface ReportMilestoneSummary {
  average_completion: number;
  balance: number;
}
interface ReportMilestoneItem {
  id: number;
  code: string | null;
  title: string;
  status: string;
  completion_percentage: number;
  balance: number;
}
interface ReportTaskSummary {
  average_completion: number;
  balance: number;
}
interface ReportIssueSummary {
  total: number;
  open: number;
  in_progress: number;
  on_hold: number;
  completed: number;
  closed: number;
  reopened: number;
}
interface ReportTaskItem {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  related_to_milestone: string;
  responsible_person: string;
  completion_percentage: number;
  balance: number;
}
interface ReportIssueItem {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  name: string;
  related_to_milestone: string;
  related_to_task: string;
  responsible_person: string;
}
interface ReportPriorityBreakdown {
  priority: string;
  task_count: number;
  issue_count: number;
}

const fmt = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(2).replace(/\.?0+$/, "")}k` : String(n);

const getMax = (data: Record<string, unknown>[], keys: string[]) => {
  let max = 0;
  data.forEach((d) =>
    keys.forEach((k) => {
      if (typeof d[k] === "number" && (d[k] as number) > max)
        max = d[k] as number;
    })
  );
  if (max === 0) return 10;
  const raw = max * 1.15;
  if (raw <= 10) return Math.ceil(raw);
  if (raw <= 50) return Math.ceil(raw / 5) * 5;
  if (raw <= 100) return Math.ceil(raw / 10) * 10;
  if (raw <= 500) return Math.ceil(raw / 25) * 25;
  if (raw <= 1000) return Math.ceil(raw / 50) * 50;
  return Math.ceil(raw / 100) * 100;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

// ── Column configs ──
const MILESTONE_ACTIVITY_COLUMNS = [
  { key: "title", label: "Milestone", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  {
    key: "completion_percentage",
    label: "% Completed",
    sortable: true,
    defaultVisible: true,
  },
  { key: "balance", label: "% Balance", sortable: true, defaultVisible: true },
];
const ACTIVITY_COMPLETION_COLUMNS = [
  { key: "title", label: "Task", sortable: true, defaultVisible: true },
  {
    key: "progress",
    label: "% Completion",
    sortable: true,
    defaultVisible: true,
  },
];
const TASK_DETAILS_COLUMNS = [
  { key: "title", label: "Task", sortable: true, defaultVisible: true },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  { key: "priority", label: "Priority", sortable: true, defaultVisible: true },
  {
    key: "related_to_milestone",
    label: "Milestone",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "responsible_person",
    label: "Responsible Person",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "completion_percentage",
    label: "% Completed",
    sortable: true,
    defaultVisible: true,
  },
  { key: "balance", label: "% Balance", sortable: true, defaultVisible: true },
];
const ISSUE_DETAILS_COLUMNS = [
  { key: "title", label: "Title", sortable: true, defaultVisible: true },
  {
    key: "description",
    label: "Description",
    sortable: true,
    defaultVisible: true,
  },
  { key: "status", label: "Status", sortable: true, defaultVisible: true },
  { key: "priority", label: "Priority", sortable: true, defaultVisible: true },
  {
    key: "related_to_milestone",
    label: "Milestone",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "related_to_task",
    label: "Task",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "responsible_person",
    label: "Responsible Person",
    sortable: true,
    defaultVisible: true,
  },
];

const STATUS_STYLES: Record<string, string> = {
  open: "bg-red-100 text-red-700",
  Open: "bg-red-100 text-red-700",
  in_progress: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  Resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};
const PRIORITY_STYLES: Record<string, string> = {
  Low: "bg-blue-100 text-blue-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-orange-100 text-orange-700",
  Urgent: "bg-red-100 text-red-700",
};

// ── KPI Card ──
const KpiCard: React.FC<{
  title: string;
  value: string;
  icon: React.ReactNode;
}> = ({ title, value, icon }) => (
  <div className="relative bg-[#F6F4EE] border border-gray-100 p-5 rounded-lg transition-shadow duration-300 hover:shadow-lg flex items-center gap-4 cursor-pointer min-h-[88px]">
    <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded shrink-0">
      {icon}
    </div>
    <div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
      <div className="text-sm font-medium text-[#1A1A1A]">{title}</div>
    </div>
  </div>
);

// ── Section Header ──
const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode }> = ({
  title,
  icon,
}) => (
  <div className="flex items-center gap-2 mb-4 mt-2">
    {icon || <BarChart3 className="w-5 h-5 text-[#A0856C]" />}
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
  </div>
);

// ── Chart Card ──
const ChartCard: React.FC<{
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  headerBgColor?: string;
}> = ({ title, action, children, headerBgColor }) => (
  <div className="bg-white rounded-lg border border-gray-100 transition-shadow duration-300 hover:shadow-lg p-5 h-full flex flex-col">
    <div className="flex items-center justify-between mb-4 gap-4 px-3 py-2 -mx-3 -mt-5 rounded-t-lg" style={{ backgroundColor: headerBgColor || '#ffffff' }}>
      <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">
        {title}
      </h3>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
    <div className="flex-1 w-full overflow-hidden">{children}</div>
  </div>
);

// ── Custom pie label ──
const renderOutsideLabel = ({
  cx,
  cy,
  midAngle,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  percent: number;
}) => {
  const RADIAN = Math.PI / 180;
  const pct = Math.round(percent * 100);
  if (pct < 1) return null;
  const sin = Math.sin(-midAngle * RADIAN);
  const cos = Math.cos(-midAngle * RADIAN);
  const sx = cx + (outerRadius + 6) * cos;
  const sy = cy + (outerRadius + 6) * sin;
  const mx = cx + (outerRadius + 20) * cos;
  const my = cy + (outerRadius + 20) * sin;
  const ex = mx + (cos >= 0 ? 12 : -12);
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";
  return (
    <g>
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke="#9ca3af"
        strokeWidth={1}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill="#9ca3af" />
      <text
        x={ex + (cos >= 0 ? 4 : -4)}
        y={ey}
        textAnchor={textAnchor}
        dominantBaseline="central"
        fill="#374151"
        fontSize={12}
        fontWeight={600}
      >
        {pct}%
      </text>
    </g>
  );
};

// ── Donut Chart Card ──
const DonutChartCard: React.FC<{
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
  loading?: boolean;
  total?: number;
  headerBgColor?: string;
}> = ({ title, data, colors, loading, total, headerBgColor }) => (
  <ChartCard title={title} headerBgColor={headerBgColor}>
    <div className="flex flex-col items-center justify-center h-full">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="w-full px-6 relative">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  labelLine={false}
                  label={renderOutsideLabel}
                >
                  {data.map((_, i) => (
                    <Cell key={i} fill={colors[i % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: 10,
                    border: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            {total !== undefined && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{total}</div>
                  <div className="text-xs text-gray-500 font-medium">Total</div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center justify-center gap-5 mt-2 flex-wrap">
            {data.map((d, i) => (
              <div
                key={d.name}
                className="flex items-center gap-1.5 text-xs text-gray-600 font-medium"
              >
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ background: colors[i % colors.length] }}
                />
                {d.name}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  </ChartCard>
);

// ── Progress cell ──
const renderProgressCell = (value: number | null) => {
  if (value === null || value === undefined)
    return <span className="text-gray-300 text-xs">—</span>;
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full"
          style={{ width: `${Math.min(value, 100)}%`, background: "#AF8260" }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-700 w-8 text-right">
        {value}%
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// ── MAIN COMPONENT ──
// ─────────────────────────────────────────────────────────
const DashboardUI: React.FC = () => {
  const [selectedCharts, setSelectedCharts] =
    useState<string[]>(DASHBOARD_CHART_KEYS);

  const [projectsList, setProjectsList] = useState<ProjectDropdownItem[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectSearch, setProjectSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const projectId = selectedProjectIds.join(",");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setProjectSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleProject = (id: string) =>
    setSelectedProjectIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  const removeProject = (id: string) =>
    setSelectedProjectIds((prev) => prev.filter((p) => p !== id));
  const filteredProjects = projectsList.filter((p) =>
    p.title.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const [loading, setLoading] = useState(false);
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [projectCompletionData, setProjectCompletionData] = useState<
    { name: string; completion_rate: number }[]
  >([]);
  const [milestoneCompletionData, setMilestoneCompletionData] = useState<
    { name: string; completion_rate: number }[]
  >([]);
  const [taskCompletionData, setTaskCompletionData] = useState<
    { name: string; completion_rate: number }[]
  >([]);
  const [assigneeMilestoneData, setAssigneeMilestoneData] = useState<
    { name: string; open: number; completed: number; in_progress: number }[]
  >([]);
  const [assigneeTaskData, setAssigneeTaskData] = useState<
    {
      name: string;
      open: number;
      in_progress: number;
      completed: number;
      on_hold: number;
      overdue: number;
      aborted: number;
    }[]
  >([]);
  const [assigneeIssueData, setAssigneeIssueData] = useState<
    {
      name: string;
      open: number;
      in_progress: number;
      on_hold: number;
      completed: number;
      closed: number;
      reopened: number;
    }[]
  >([]);
  const [taskDependenciesData, setTaskDependenciesData] = useState<
    { name: string; blocking: number; blocked_by: number; related: number }[]
  >([]);
  const [issueBreakdownData, setIssueBreakdownData] = useState<
    {
      name: string;
      open: number;
      in_progress: number;
      completed: number;
      closed: number;
    }[]
  >([]);

  // ── Report modal state ──
  const [reportOpen, setReportOpen] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportDownloading, setReportDownloading] = useState(false);
  const [reportProjectId, setReportProjectId] = useState<string>("");
  const [reportProject, setReportProject] = useState<ReportProjectInfo | null>(
    null
  );
  const [reportMilestoneSummary, setReportMilestoneSummary] =
    useState<ReportMilestoneSummary | null>(null);
  const [reportMilestones, setReportMilestones] = useState<
    ReportMilestoneItem[]
  >([]);
  const [reportTaskSummary, setReportTaskSummary] =
    useState<ReportTaskSummary | null>(null);
  const [reportTasks, setReportTasks] = useState<ReportTaskItem[]>([]);
  const [reportIssueSummary, setReportIssueSummary] =
    useState<ReportIssueSummary | null>(null);
  const [reportIssues, setReportIssues] = useState<ReportIssueItem[]>([]);
  const [reportPriorities, setReportPriorities] = useState<
    ReportPriorityBreakdown[]
  >([]);
  const [reportSelectedCharts, setReportSelectedCharts] =
    useState<string[]>(REPORT_CHART_KEYS);
  const [milestoneSearch, setMilestoneSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskDetailsSearch, setTaskDetailsSearch] = useState("");
  const [issueDetailsSearch, setIssueDetailsSearch] = useState("");

  // ── Derived report data ──
  const raMilestoneChart = reportMilestoneSummary
    ? [
      {
        name: "Completed",
        value: Number(reportMilestoneSummary.average_completion.toFixed(1)),
      },
      {
        name: "Balance",
        value: Number(reportMilestoneSummary.balance.toFixed(1)),
      },
    ]
    : [
      { name: "Completed", value: 0 },
      { name: "Balance", value: 100 },
    ];

  const raTaskChart = reportTaskSummary
    ? [
      {
        name: "Completed",
        value: Number(reportTaskSummary.average_completion.toFixed(1)),
      },
      {
        name: "Balance",
        value: Number(reportTaskSummary.balance.toFixed(1)),
      },
    ]
    : [
      { name: "Completed", value: 0 },
      { name: "Balance", value: 100 },
    ];

  const raIssueChart = reportIssueSummary
    ? [
      {
        name: "Open",
        value: Math.round(
          ((reportIssueSummary.open || 0) /
            (reportIssueSummary.total || 1)) *
          100
        ),
      },
      {
        name: "In Progress",
        value: Math.round(
          ((reportIssueSummary.in_progress || 0) /
            (reportIssueSummary.total || 1)) *
          100
        ),
      },
      {
        name: "On Hold",
        value: Math.round(
          ((reportIssueSummary.on_hold || 0) /
            (reportIssueSummary.total || 1)) *
          100
        ),
      },
      {
        name: "Completed",
        value: Math.round(
          ((reportIssueSummary.completed || 0) /
            (reportIssueSummary.total || 1)) *
          100
        ),
      },
      {
        name: "Closed",
        value: Math.round(
          ((reportIssueSummary.closed || 0) /
            (reportIssueSummary.total || 1)) *
          100
        ),
      },
      {
        name: "Reopened",
        value: Math.round(
          ((reportIssueSummary.reopened || 0) /
            (reportIssueSummary.total || 1)) *
          100
        ),
      },
    ]
    : [
      { name: "Open", value: 0 },
      { name: "In Progress", value: 0 },
      { name: "On Hold", value: 0 },
      { name: "Completed", value: 0 },
      { name: "Closed", value: 0 },
      { name: "Reopened", value: 0 },
    ];

  const milestoneTableData = reportMilestones.map((m) => ({
    id: String(m.id),
    title: m.title,
    status: m.status,
    completion_percentage: `${m.completion_percentage}%`,
    balance: `${m.balance}%`,
  }));
  const activityTableData = reportTasks.map((t) => ({
    id: String(t.id),
    title: t.title,
    progress: t.completion_percentage,
  }));
  const taskDetailsData = reportTasks.map((t) => ({
    id: String(t.id),
    title: t.title,
    status: t.status,
    priority: t.priority,
    related_to_milestone: t.related_to_milestone,
    responsible_person: t.responsible_person,
    completion_percentage: `${t.completion_percentage}%`,
    balance: `${t.balance}%`,
  }));
  const issueDetailsData = reportIssues.map((iss) => ({
    id: String(iss.id),
    title: iss.title,
    description: iss.description?.replace(/<[^>]*>/g, "") || "—",
    status: iss.status,
    priority: iss.priority,
    related_to_milestone: iss.related_to_milestone,
    related_to_task: iss.related_to_task,
    responsible_person: iss.responsible_person,
  }));

  const safeSearch = (val: string) => (val || "").toLowerCase();
  const safeText = (text: unknown) => (text ? String(text).toLowerCase() : "");
  const filteredMilestoneTableData = milestoneTableData.filter((m) =>
    safeText(m.title).includes(safeSearch(milestoneSearch))
  );
  const filteredActivityTableData = activityTableData.filter((t) =>
    safeText(t.title).includes(safeSearch(taskSearch))
  );
  const filteredTaskDetailsData = taskDetailsData.filter((t) =>
    safeText(t.title).includes(safeSearch(taskDetailsSearch))
  );
  const filteredIssueDetailsData = issueDetailsData.filter((iss) =>
    safeText(iss.title).includes(safeSearch(issueDetailsSearch))
  );

  const openReportModal = () => {
    setReportProjectId(
      selectedProjectIds.length > 0 ? selectedProjectIds[0] : ""
    );
    setReportOpen(true);
  };

  const fetchReportData = useCallback(async (pid: string) => {
    if (!pid) return;
    setReportLoading(true);
    try {
      const headers = {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      };
      const [msRes, tsRes, isRes, pbRes] = await Promise.all([
        fetch(
          getFullUrl(
            `/patm_report/project_milestones_summary.json?project_id=${pid}`
          ),
          { headers }
        ),
        fetch(
          getFullUrl(
            `/patm_report/project_task_summary.json?project_id=${pid}`
          ),
          { headers }
        ),
        fetch(
          getFullUrl(
            `/patm_report/project_issue_summary.json?project_id=${pid}`
          ),
          { headers }
        ),
        fetch(
          getFullUrl(
            `/patm_report/project_priority_breakdown.json?project_id=${pid}`
          ),
          { headers }
        ),
      ]);
      const [msJson, tsJson, isJson, pbJson] = await Promise.all([
        msRes.json(),
        tsRes.json(),
        isRes.json(),
        pbRes.json(),
      ]);
      if (msJson.success && msJson.data?.[0]) {
        const d = msJson.data[0];
        setReportProject(d.project || null);
        setReportMilestoneSummary(d.milestone_summary || null);
        setReportMilestones(d.milestones || []);
      }
      if (tsJson.success && tsJson.data?.[0]) {
        const d = tsJson.data[0];
        setReportTaskSummary(d.task_summary || null);
        setReportTasks(d.tasks || []);
      }
      if (isJson.success && isJson.data?.[0]) {
        const d = isJson.data[0];
        setReportIssueSummary(d.issue_summary || null);
        setReportIssues(d.issues || []);
      }
      if (pbJson.success && pbJson.data?.[0])
        setReportPriorities(pbJson.data[0].priorities || []);
    } catch (err) {
      console.error("Error fetching report data:", err);
    } finally {
      setReportLoading(false);
    }
  }, []);

  useEffect(() => {
    if (reportOpen && reportProjectId) fetchReportData(reportProjectId);
  }, [reportOpen, reportProjectId, fetchReportData]);

  // ── Helper: Convert hex color to RGB tuple ──
  const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
      : [0, 0, 0];
  };

  // ─────────────────────────────────────────────────────────
  // ── jsPDF DOWNLOAD (matches ReportAnalytics exactly) ──
  // ─────────────────────────────────────────────────────────
  const handleReportPdfDownload = async () => {
    setReportDownloading(true);
    try {
      const A4_W = 595;
      const A4_H = 842;
      const MARGIN = 40;
      const CONTENT_W = A4_W - MARGIN * 2;

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      let y = MARGIN;

      // ── Load logo ──
      const logoUrl = "/panchshil.png";
      let logoData: string | undefined;
      try {
        const logoResponse = await fetch(logoUrl);
        const logoBlob = await logoResponse.blob();
        logoData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(logoBlob);
        });
      } catch (err) {
        console.warn("Failed to load logo:", err);
      }

      const checkPage = (needed: number) => {
        if (y + needed > A4_H - MARGIN) {
          pdf.addPage();
          y = MARGIN;
        }
      };

      const addLogoToPage = () => {
        if (logoData) {
          const logoW = 40;
          const logoH = 40;
          const logoX = A4_W - MARGIN - logoW;
          const logoY = MARGIN - 5;
          try {
            pdf.addImage(logoData, "PNG", logoX, logoY, logoW, logoH);
          } catch (err) {
            console.warn("Failed to add logo to page:", err);
          }
        }
      };

      const drawRect = (
        rx: number,
        ry: number,
        rw: number,
        rh: number,
        fill: [number, number, number]
      ) => {
        pdf.setFillColor(...fill);
        pdf.rect(rx, ry, rw, rh, "F");
      };

      const formatStatusLabel = (status: string): string => {
        return status
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      };

      const sectionHeader = (
        title: string,
        headerColor?: [number, number, number],
        statusCounts?: Record<string, number>,
        total?: number
      ) => {
        const hasStatusCounts = statusCounts && Object.keys(statusCounts).length > 0;
        const headerHeight = hasStatusCounts ? 36 : 20;
        checkPage(hasStatusCounts ? 50 : 30);
        const headerBg = headerColor || [246, 244, 238];
        drawRect(MARGIN, y, CONTENT_W, headerHeight, headerBg);

        // Draw title
        pdf.setFontSize(10);
        pdf.setTextColor(26, 26, 26);
        pdf.setFont("helvetica", "bold");
        pdf.text(title, MARGIN + 8, y + 13);

        // Draw status counts below title
        if (hasStatusCounts) {
          const statusItems = Object.entries(statusCounts);
          let statusX = MARGIN + 8;
          const statusY = y + 24;

          pdf.setFontSize(7.5);
          pdf.setTextColor(55, 65, 81);
          pdf.setFont("helvetica", "normal");

          // Draw total count first if provided
          if (total !== undefined) {
            const totalText = `Total: ${total}`;
            pdf.text(totalText, statusX, statusY);
            statusX += pdf.getTextWidth(totalText) + 5;
          }

          statusItems.forEach(([status, count]) => {
            const formattedStatus = formatStatusLabel(status);
            const statusText = `${formattedStatus}: ${count}`;
            const textWidth = pdf.getTextWidth(statusText);

            // Draw text (no background)
            pdf.text(statusText, statusX, statusY);

            statusX += textWidth + 5;
          });
        }

        y += headerHeight + 8;
      };

      const drawTable = (
        columns: { key: string; label: string; width: number }[],
        rows: Record<string, unknown>[],
        headerColor?: [number, number, number]
      ) => {
        checkPage(20);
        const tableHeaderBg = headerColor || [243, 244, 246];
        drawRect(MARGIN, y, CONTENT_W, 16, tableHeaderBg);
        let cx = MARGIN;
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(107, 114, 128);
        columns.forEach((col) => {
          pdf.text(col.label, cx + 4, y + 11);
          cx += col.width;
        });
        y += 16;

        if (rows.length === 0) {
          checkPage(20);
          pdf.setFontSize(8);
          pdf.setTextColor(156, 163, 175);
          pdf.setFont("helvetica", "normal");
          pdf.text("No data available", MARGIN + CONTENT_W / 2, y + 12, {
            align: "center",
          });
          y += 24;
          return;
        }

        rows.forEach((row, ri) => {
          const BADGE_H = 14;
          const CELL_PAD_V = 8;
          pdf.setFontSize(7.5);
          pdf.setFont("helvetica", "normal");
          let rowH = BADGE_H + CELL_PAD_V;

          const cellLines: string[][] = columns.map((col) => {
            const isSpecial =
              col.key === "status" ||
              col.key === "priority" ||
              col.key === "progress";
            if (isSpecial) return [String(row[col.key] ?? "—")];
            const lines = pdf.splitTextToSize(
              String(row[col.key] ?? "—"),
              col.width - 8
            );
            rowH = Math.max(rowH, lines.length * 10 + CELL_PAD_V);
            return lines;
          });

          checkPage(rowH + 2);
          if (ri % 2 === 1)
            drawRect(MARGIN, y, CONTENT_W, rowH, [250, 250, 250]);

          cx = MARGIN;
          columns.forEach((col, ci) => {
            const rawVal = String(row[col.key] ?? "—");

            if (col.key === "status") {
              const s = rawVal.replace(/_/g, " ");
              const isCompleted =
                rawVal.includes("completed") || rawVal.includes("Resolved");
              const isProgress = rawVal.includes("progress");
              const isOpen = rawVal.includes("open") || rawVal.includes("Open");
              const bg: [number, number, number] = isCompleted
                ? [209, 250, 229]
                : isProgress
                  ? [254, 249, 195]
                  : isOpen
                    ? [254, 226, 226]
                    : [243, 244, 246];
              const fg: [number, number, number] = isCompleted
                ? [6, 95, 70]
                : isProgress
                  ? [146, 64, 14]
                  : isOpen
                    ? [153, 27, 27]
                    : [55, 65, 81];
              const badgeTop = y + (rowH - BADGE_H) / 2;
              pdf.setFontSize(7);
              pdf.setFont("helvetica", "bold");
              const tw = pdf.getTextWidth(s);
              const pad = 5;
              drawRect(cx + 4, badgeTop, tw + pad * 2, BADGE_H, bg);
              pdf.setTextColor(...fg);
              pdf.text(s, cx + 4 + pad, badgeTop + BADGE_H * 0.68);
            } else if (col.key === "priority") {
              const p = rawVal;
              const bg: [number, number, number] =
                p === "Urgent"
                  ? [254, 226, 226]
                  : p === "High"
                    ? [255, 237, 213]
                    : p === "Medium"
                      ? [254, 249, 195]
                      : [219, 234, 254];
              const fg: [number, number, number] =
                p === "Urgent"
                  ? [153, 27, 27]
                  : p === "High"
                    ? [154, 52, 18]
                    : p === "Medium"
                      ? [146, 64, 14]
                      : [30, 64, 175];
              const badgeTop = y + (rowH - BADGE_H) / 2;
              pdf.setFontSize(7);
              pdf.setFont("helvetica", "bold");
              const tw = pdf.getTextWidth(p);
              const pad = 5;
              drawRect(cx + 4, badgeTop, tw + pad * 2, BADGE_H, bg);
              pdf.setTextColor(...fg);
              pdf.text(p, cx + 4 + pad, badgeTop + BADGE_H * 0.68);
            } else if (col.key === "progress") {
              const val = Number(row.progress ?? 0);
              const barW = col.width - 36;
              const barY = y + rowH / 2 - 3;
              drawRect(cx + 4, barY, barW, 6, [229, 231, 235]);
              if (val > 0)
                drawRect(
                  cx + 4,
                  barY,
                  (barW * Math.min(val, 100)) / 100,
                  6,
                  [175, 130, 96]
                );
              pdf.setFontSize(7);
              pdf.setFont("helvetica", "bold");
              pdf.setTextColor(55, 65, 81);
              pdf.text(`${val}%`, cx + barW + 8, barY + 5);
            } else {
              pdf.setFontSize(7.5);
              pdf.setFont("helvetica", "normal");
              pdf.setTextColor(55, 65, 81);
              const lines = cellLines[ci];
              const textBlockH = lines.length * 10;
              const startY =
                lines.length === 1
                  ? y + rowH / 2 + 3
                  : y + (rowH - textBlockH) / 2 + 9;
              lines.forEach((line: string, li: number) => {
                pdf.text(line, cx + 4, startY + li * 10);
              });
            }
            cx += col.width;
          });

          pdf.setDrawColor(229, 231, 235);
          pdf.setLineWidth(0.3);
          pdf.line(MARGIN, y + rowH, MARGIN + CONTENT_W, y + rowH);
          y += rowH;
        });
        y += 10;
      };

      const drawDonutPanel = (
        panelTitle: string,
        data: { name: string; value: number }[],
        colors: [number, number, number][],
        offsetX: number,
        panelW: number,
        headerColor?: [number, number, number]
      ) => {
        const SIZE = 300;
        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d")!;
        const ccx = SIZE / 2,
          ccy = SIZE / 2,
          outerR = 100,
          innerR = 55;
        const total = data.reduce((s, d) => s + d.value, 0) || 1;
        let sa = -Math.PI / 2;
        data.forEach((d, i) => {
          if (d.value <= 0) return;
          const sweep = (d.value / total) * 2 * Math.PI;
          const [r, g, b] = colors[i % colors.length];
          ctx.beginPath();
          ctx.moveTo(ccx + innerR * Math.cos(sa), ccy + innerR * Math.sin(sa));
          ctx.arc(ccx, ccy, outerR, sa, sa + sweep);
          ctx.arc(ccx, ccy, innerR, sa + sweep, sa, true);
          ctx.closePath();
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fill();
          sa += sweep;
        });
        const imgData = canvas.toDataURL("image/png");
        const imgW = 70,
          imgH = 70;
        const imgX = MARGIN + offsetX + 8;
        const imgY = y + 26;

        const headerBg = headerColor || [246, 244, 238];
        drawRect(MARGIN + offsetX, y, panelW, 20, headerBg);
        pdf.setFontSize(9);
        pdf.setTextColor(26, 26, 26);
        pdf.setFont("helvetica", "bold");
        pdf.text(panelTitle, MARGIN + offsetX + 8, y + 13);

        pdf.addImage(imgData, "PNG", imgX, imgY, imgW, imgH);
        const legendX = imgX + imgW + 12;
        const legendStartY = imgY + imgH / 2 - (data.length * 14) / 2;
        data.forEach((d, i) => {
          const lly = legendStartY + i * 16;
          drawRect(legendX, lly, 10, 10, colors[i % colors.length]);
          pdf.setFontSize(6.5);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(55, 65, 81);
          pdf.text(`${d.name}: ${d.value}%`, legendX + 13, lly + 7);
        });
      };

      const orderedVisible = REPORT_CHART_KEYS.filter((k) =>
        reportSelectedCharts.includes(k)
      );

      // ── Add logo to first page ──
      addLogoToPage();

      // ── Report header ──
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.setFont("helvetica", "normal");
      pdf.text("Reports > Analytics", MARGIN, y);
      y += 24;
      pdf.setFontSize(18);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont("helvetica", "bold");
      pdf.text("REPORT ANALYTICS", MARGIN, y);
      y += 30;

      // ── Project banner ──
      if (reportProject) {
        drawRect(MARGIN, y, CONTENT_W, 44, [246, 244, 238]);
        pdf.setFontSize(12);
        pdf.setTextColor(26, 26, 26);
        pdf.setFont("helvetica", "bold");
        pdf.text(reportProject.title, MARGIN + 12, y + 16);
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Project ID: #${reportProject.id}`, MARGIN + 12, y + 30);
        y += 54;

        const kpis = [
          { label: "Start Date", value: formatDate(reportProject.start_date) },
          { label: "End Date", value: formatDate(reportProject.end_date) },
          {
            label: "Completion",
            value: `${reportProject.completion_percentage}%`,
          },
          { label: "Balance", value: `${reportProject.balance}%` },
        ];
        const kW = (CONTENT_W - 12) / 4;
        kpis.forEach((k, i) => {
          const kx = MARGIN + i * (kW + 4);
          drawRect(kx, y, kW, 52, [246, 244, 238]);
          pdf.setFontSize(16);
          pdf.setTextColor(26, 26, 26);
          pdf.setFont("helvetica", "bold");
          pdf.text(k.value, kx + 10, y + 22);
          pdf.setFontSize(8);
          pdf.setTextColor(55, 65, 81);
          pdf.setFont("helvetica", "normal");
          pdf.text(k.label, kx + 10, y + 38);
        });
        y += 62;
      }

      // ── Priority breakdown ──
      if (reportPriorities.length > 0) {
        checkPage(80);
        const pW =
          (CONTENT_W - (reportPriorities.length - 1) * 4) /
          reportPriorities.length;
        reportPriorities.forEach((p, i) => {
          const px = MARGIN + i * (pW + 4);
          drawRect(px, y, pW, 68, [246, 244, 238]);
          pdf.setFontSize(8);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(26, 26, 26);
          pdf.text(`${p.priority} Priority`, px + 10, y + 14);
          pdf.setDrawColor(209, 213, 219);
          pdf.setLineWidth(0.5);
          pdf.line(px + pW / 2, y + 20, px + pW / 2, y + 60);
          pdf.setFontSize(7);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(107, 114, 128);
          pdf.text("Tasks", px + 10, y + 30);
          pdf.setFontSize(18);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(26, 26, 26);
          pdf.text(String(p.task_count), px + 10, y + 52);
          pdf.setFontSize(7);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(107, 114, 128);
          pdf.text("Issues", px + pW / 2 + 10, y + 30);
          pdf.setFontSize(18);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(26, 26, 26);
          pdf.text(String(p.issue_count), px + pW / 2 + 10, y + 52);
        });
        y += 76;
      }

      // ── Donut charts row ──
      const showMilestone = orderedVisible.includes("milestoneProgress");
      const showTask = orderedVisible.includes("taskWiseProgress");
      const showIssue = orderedVisible.includes("issueWiseProgress");
      if (showMilestone || showTask || showIssue) {
        checkPage(160);
        const numCharts = [showMilestone, showTask, showIssue].filter(Boolean).length;

        if (numCharts === 1) {
          const FULL_W = CONTENT_W;
          if (showMilestone) {
            drawDonutPanel(
              "Milestone Progress",
              raMilestoneChart,
              [
                [175, 130, 96],
                [229, 231, 235],
              ],
              0,
              FULL_W,
              hexToRgb("#e1fcbd")
            );
          } else if (showTask) {
            drawDonutPanel(
              "Task Wise Progress",
              raTaskChart,
              [
                [175, 130, 96],
                [229, 231, 235],
              ],
              0,
              FULL_W,
              hexToRgb("#c7ffff")
            );
          } else if (showIssue) {
            drawDonutPanel(
              "Issue Wise Progress",
              raIssueChart,
              ISSUE_COLORS.map(hexToRgb),
              0,
              FULL_W,
              hexToRgb("#ffe1e0")
            );
          }
        } else if (numCharts === 2) {
          const HALF_W = CONTENT_W / 2 - 6;
          let offsetX = 0;
          if (showMilestone) {
            drawDonutPanel(
              "Milestone Progress",
              raMilestoneChart,
              [
                [175, 130, 96],
                [229, 231, 235],
              ],
              offsetX,
              HALF_W,
              hexToRgb("#e1fcbd")
            );
            offsetX += HALF_W + 12;
          }
          if (showTask) {
            drawDonutPanel(
              "Task Wise Progress",
              raTaskChart,
              [
                [175, 130, 96],
                [229, 231, 235],
              ],
              offsetX,
              HALF_W,
              hexToRgb("#c7ffff")
            );
            offsetX += HALF_W + 12;
          }
          if (showIssue) {
            drawDonutPanel(
              "Issue Wise Progress",
              raIssueChart,
              ISSUE_COLORS.map(hexToRgb),
              offsetX,
              HALF_W,
              hexToRgb("#ffe1e0")
            );
          }
        } else {
          // numCharts === 3
          const THIRD_W = CONTENT_W / 3 - 8;
          if (showMilestone) {
            drawDonutPanel(
              "Milestone Progress",
              raMilestoneChart,
              [
                [175, 130, 96],
                [229, 231, 235],
              ],
              0,
              THIRD_W,
              hexToRgb("#e1fcbd")
            );
          }
          if (showTask) {
            drawDonutPanel(
              "Task Wise Progress",
              raTaskChart,
              [
                [175, 130, 96],
                [229, 231, 235],
              ],
              THIRD_W + 12,
              THIRD_W,
              hexToRgb("#c7ffff")
            );
          }
          if (showIssue) {
            drawDonutPanel(
              "Issue Wise Progress",
              raIssueChart,
              ISSUE_COLORS.map(hexToRgb),
              2 * (THIRD_W + 12),
              THIRD_W,
              hexToRgb("#ffe1e0")
            );
          }
        }
        y += 116;
      }

      if (orderedVisible.includes("milestoneActivityProgress")) {
        const milestoneCounts = reportMilestones.reduce(
          (acc: Record<string, number>, m) => {
            acc[m.status] = (acc[m.status] || 0) + 1;
            return acc;
          },
          {}
        );
        sectionHeader(
          "Milestone Activity Wise Progress",
          hexToRgb("#e1fcbd"),
          milestoneCounts,
          reportMilestones.length
        );
        drawTable(
          [
            { key: "title", label: "Milestone", width: CONTENT_W * 0.44 },
            { key: "status", label: "Status", width: CONTENT_W * 0.2 },
            {
              key: "completion_percentage",
              label: "% Completed",
              width: CONTENT_W * 0.18,
            },
            { key: "balance", label: "% Balance", width: CONTENT_W * 0.18 },
          ],
          filteredMilestoneTableData as Record<string, unknown>[],
          // hexToRgb("#b0ed3e")
        );
      }

      if (orderedVisible.includes("activityCompletion")) {
        const taskCounts = reportTasks.reduce(
          (acc: Record<string, number>, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
          },
          {}
        );
        sectionHeader(
          "Activity % Completion"
        );
        drawTable(
          [
            { key: "title", label: "Task", width: CONTENT_W * 0.6 },
            { key: "progress", label: "% Completion", width: CONTENT_W * 0.4 },
          ],
          filteredActivityTableData as Record<string, unknown>[],
          // hexToRgb("#3eeded")
        );
      }

      if (orderedVisible.includes("taskDetails")) {
        const taskDetailsCounts = reportTasks.reduce(
          (acc: Record<string, number>, t) => {
            acc[t.status] = (acc[t.status] || 0) + 1;
            return acc;
          },
          {}
        );
        sectionHeader(
          "Task Details",
          hexToRgb("#c7ffff"),
          taskDetailsCounts,
          reportTasks.length
        );
        drawTable(
          [
            { key: "title", label: "Task", width: CONTENT_W * 0.22 },
            { key: "status", label: "Status", width: CONTENT_W * 0.13 },
            { key: "priority", label: "Priority", width: CONTENT_W * 0.1 },
            {
              key: "related_to_milestone",
              label: "Milestone",
              width: CONTENT_W * 0.18,
            },
            {
              key: "responsible_person",
              label: "Responsible",
              width: CONTENT_W * 0.17,
            },
            {
              key: "completion_percentage",
              label: "% Done",
              width: CONTENT_W * 0.1,
            },
            { key: "balance", label: "% Bal", width: CONTENT_W * 0.1 },
          ],
          filteredTaskDetailsData as Record<string, unknown>[],
          // hexToRgb("#3eeded")
        );
      }

      if (orderedVisible.includes("issueDetails")) {
        const issueCounts = reportIssueSummary ? {
          open: reportIssueSummary.open,
          in_progress: reportIssueSummary.in_progress,
          on_hold: reportIssueSummary.on_hold,
          completed: reportIssueSummary.completed,
          closed: reportIssueSummary.closed,
          reopened: reportIssueSummary.reopened,
        } : {};
        sectionHeader(
          "Issue Details",
          hexToRgb("#ffe1e0"),
          issueCounts,
          reportIssueSummary?.total
        );
        drawTable(
          [
            { key: "title", label: "Title", width: CONTENT_W * 0.18 },
            {
              key: "description",
              label: "Description",
              width: CONTENT_W * 0.22,
            },
            { key: "status", label: "Status", width: CONTENT_W * 0.12 },
            { key: "priority", label: "Priority", width: CONTENT_W * 0.1 },
            {
              key: "related_to_milestone",
              label: "Milestone",
              width: CONTENT_W * 0.16,
            },
            { key: "related_to_task", label: "Task", width: CONTENT_W * 0.12 },
            {
              key: "responsible_person",
              label: "Responsible",
              width: CONTENT_W * 0.1,
            },
          ],
          filteredIssueDetailsData as Record<string, unknown>[],
          // hexToRgb("#f7a2a1")
        );
      }

      const slug = reportProject?.title
        ? reportProject.title.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase()
        : reportProjectId;
      pdf.save(`report-analytics-${slug}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF download failed. Please try again.");
    } finally {
      setReportDownloading(false);
    }
  };

  // ── Dashboard data fetching ──
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      try {
        const res = await fetch(
          getFullUrl("/project_managements/projects_for_dropdown.json"),
          {
            headers: {
              Authorization: getAuthHeader(),
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        setProjectsList(json.project_managements || json || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const fetchKpis = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await fetch(
        getFullUrl(`/patm_dashboard/patm_kpis.json?project_id=${projectId}`),
        {
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success) setKpis(json.data);
    } catch (err) {
      console.error("Error fetching KPIs:", err);
    }
  }, [projectId]);

  const fetchCompletionRate = useCallback(
    async (type: string) => {
      if (!projectId) return [];
      try {
        const res = await fetch(
          getFullUrl(
            `/patm_dashboard/patm_completion_rate.json?project_id=${projectId}&type=${type}`
          ),
          {
            headers: {
              Authorization: getAuthHeader(),
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success)
          return (json.data || []).map(
            (d: { title: string; completion_rate: number }) => ({
              name: d.title,
              completion_rate: d.completion_rate,
            })
          );
      } catch (err) {
        console.error(`Error fetching ${type} completion:`, err);
      }
      return [];
    },
    [projectId]
  );

  const fetchAssigneeWise = useCallback(
    async (type: string) => {
      if (!projectId) return [];
      try {
        const res = await fetch(
          getFullUrl(
            `/patm_dashboard/patm_assignee_wise.json?project_id=${projectId}&type=${type}`
          ),
          {
            headers: {
              Authorization: getAuthHeader(),
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (json.success)
          return (json.data || []).map(
            (d: {
              assignee_name: string;
              breakdown: Record<string, number>;
            }) => ({ name: d.assignee_name, ...d.breakdown })
          );
      } catch (err) {
        console.error(`Error fetching assignee ${type}:`, err);
      }
      return [];
    },
    [projectId]
  );

  const fetchTaskDependencies = useCallback(async () => {
    if (!projectId) return [];
    try {
      const res = await fetch(
        getFullUrl(
          `/patm_dashboard/patm_task_dependencies.json?project_id=${projectId}`
        ),
        {
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success)
        return (json.data || []).map(
          (d: {
            title: string;
            blocking: number;
            blocked_by: number;
            related: number;
          }) => ({
            name: d.title,
            blocking: d.blocking,
            blocked_by: d.blocked_by,
            related: d.related,
          })
        );
    } catch (err) {
      console.error("Error fetching task dependencies:", err);
    }
    return [];
  }, [projectId]);

  const fetchIssueBreakdown = useCallback(async () => {
    if (!projectId) return [];
    try {
      const res = await fetch(
        getFullUrl(
          `/patm_dashboard/patm_issue_breakdown.json?project_id=${projectId}`
        ),
        {
          headers: {
            Authorization: getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success)
        return (json.data || []).map(
          (d: {
            title: string;
            open: number;
            in_progress: number;
            completed: number;
            closed: number;
          }) => ({
            name: d.title,
            open: d.open,
            in_progress: d.in_progress,
            completed: d.completed,
            closed: d.closed,
          })
        );
    } catch (err) {
      console.error("Error fetching issue breakdown:", err);
    }
    return [];
  }, [projectId]);

  const loadAllData = useCallback(() => {
    if (selectedProjectIds.length === 0) return;
    setLoading(true);
    Promise.all([
      fetchKpis(),
      fetchCompletionRate("project").then(setProjectCompletionData),
      fetchCompletionRate("milestone").then(setMilestoneCompletionData),
      fetchCompletionRate("task").then(setTaskCompletionData),
      fetchAssigneeWise("milestone").then(setAssigneeMilestoneData),
      fetchAssigneeWise("task").then(setAssigneeTaskData),
      fetchAssigneeWise("issue").then(setAssigneeIssueData),
      fetchTaskDependencies().then(setTaskDependenciesData),
      fetchIssueBreakdown().then(setIssueBreakdownData),
    ]).finally(() => setLoading(false));
  }, [
    selectedProjectIds,
    fetchKpis,
    fetchCompletionRate,
    fetchAssigneeWise,
    fetchTaskDependencies,
    fetchIssueBreakdown,
  ]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const refreshProjectCompletion = useCallback(() => {
    fetchCompletionRate("project").then(setProjectCompletionData);
  }, [fetchCompletionRate]);
  const refreshMilestoneCompletion = useCallback(() => {
    fetchCompletionRate("milestone").then(setMilestoneCompletionData);
  }, [fetchCompletionRate]);
  const refreshTaskCompletion = useCallback(() => {
    fetchCompletionRate("task").then(setTaskCompletionData);
  }, [fetchCompletionRate]);
  const refreshAssigneeMilestone = useCallback(() => {
    fetchAssigneeWise("milestone").then(setAssigneeMilestoneData);
  }, [fetchAssigneeWise]);
  const refreshAssigneeTask = useCallback(() => {
    fetchAssigneeWise("task").then(setAssigneeTaskData);
  }, [fetchAssigneeWise]);
  const refreshAssigneeIssue = useCallback(() => {
    fetchAssigneeWise("issue").then(setAssigneeIssueData);
  }, [fetchAssigneeWise]);
  const refreshTaskDependencies = useCallback(() => {
    fetchTaskDependencies().then(setTaskDependenciesData);
  }, [fetchTaskDependencies]);
  const refreshIssueBreakdown = useCallback(() => {
    fetchIssueBreakdown().then(setIssueBreakdownData);
  }, [fetchIssueBreakdown]);

  const milestoneCards = kpis
    ? [
      {
        title: "Total Milestones",
        value: fmt(kpis.milestones.total),
        icon: <FileText className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "Open Milestones",
        value: fmt(kpis.milestones.open),
        icon: <FolderOpen className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "Completed Milestones",
        value: fmt(kpis.milestones.completed),
        icon: <CheckCircle className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "In Progress Milestones",
        value: fmt(kpis.milestones.in_progress),
        icon: <Clock className="w-6 h-6 text-[#C72030]" />,
      },
    ]
    : [];

  const taskCards = kpis
    ? [
      {
        title: "Total Tasks",
        value: fmt(kpis.tasks.total),
        icon: <ClipboardList className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "Open Tasks",
        value: fmt(kpis.tasks.open),
        icon: <FolderOpen className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "In Progress Tasks",
        value: fmt(kpis.tasks.in_progress),
        icon: <Clock className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "Completed Tasks",
        value: fmt(kpis.tasks.completed),
        icon: <CheckCircle className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "On Hold Tasks",
        value: fmt(kpis.tasks.on_hold),
        icon: <PauseCircle className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "Overdue Tasks",
        value: fmt(kpis.tasks.overdue),
        icon: <AlertCircle className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "Aborted Tasks",
        value: fmt(kpis.tasks.aborted),
        icon: <XCircle className="w-6 h-6 text-[#C72030]" />,
      },
    ]
    : [];

  const issueCards = kpis
    ? [
      {
        title: "Total Issues",
        value: fmt(kpis.issues.total),
        icon: <AlertCircle className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "Open Issues",
        value: fmt(kpis.issues.open),
        icon: <FolderOpen className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "In Progress Issues",
        value: fmt(kpis.issues.in_progress),
        icon: <Clock className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "On Hold Issues",
        value: fmt(kpis.issues.on_hold),
        icon: <PauseCircle className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "Completed Issues",
        value: fmt(kpis.issues.completed),
        icon: <CheckCircle className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "Closed Issues",
        value: fmt(kpis.issues.closed),
        icon: <XCircle className="w-6 h-6 text-[#C72030]" />,
      },
      {
        title: "Reopened Issues",
        value: fmt(kpis.issues.reopened),
        icon: <RefreshCw className="w-6 h-6 text-[#C72030]" />,
      },
    ]
    : [];

  // ── Search bar helpers ──
  const SearchInput: React.FC<{
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
  }> = ({ placeholder, value, onChange }) => (
    <div className="relative w-[200px] sm:w-[250px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C72030] focus:border-[#C72030]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );

  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen bg-white">
      {/* ── Header ── */}
      <div>
        <div className="text-sm text-gray-600 mb-2">
          Projects &gt; Dashboard
        </div>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
          PROJECT DASHBOARD
        </h1>
      </div>

      {/* ── Project Multi-Select + Charts Selector + Download ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => !projectsLoading && setDropdownOpen((o) => !o)}
            className={`bg-white border rounded-lg px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer min-w-[340px] max-w-[520px] flex items-center gap-2 flex-wrap min-h-[42px] ${dropdownOpen ? "border-[#C72030] ring-2 ring-[#C72030]/20" : "border-gray-300"} ${projectsLoading ? "opacity-50 pointer-events-none" : ""}`}
          >
            {projectsLoading ? (
              <span className="text-gray-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading projects...
              </span>
            ) : selectedProjectIds.length === 0 ? (
              <span className="text-gray-400">Select projects...</span>
            ) : (
              selectedProjectIds.map((id) => {
                const proj = projectsList.find((p) => String(p.id) === id);
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 bg-[#F6F4EE] border border-gray-200 rounded px-2 py-0.5 text-xs font-medium text-gray-700 max-w-[180px]"
                  >
                    <span className="truncate">{proj?.title || id}</span>
                    <X
                      className="w-3 h-3 text-gray-400 hover:text-[#C72030] cursor-pointer shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeProject(id);
                      }}
                    />
                  </span>
                );
              })
            )}
            <div className="ml-auto shrink-0 pl-2">
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </div>
          </div>

          {dropdownOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#C72030] focus:border-[#C72030]"
                  />
                </div>
              </div>
              <div className="max-h-[240px] overflow-y-auto py-1">
                {filteredProjects.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-400 text-center">
                    No projects found
                  </div>
                ) : (
                  filteredProjects.map((p) => {
                    const isSelected = selectedProjectIds.includes(
                      String(p.id)
                    );
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProject(String(p.id))}
                        className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer text-sm hover:bg-gray-50 ${isSelected ? "bg-[#F6F4EE]" : ""}`}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${isSelected ? "bg-[#C72030] border-[#C72030]" : "border-gray-300"}`}
                        >
                          {isSelected && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={3}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="truncate text-gray-700">
                          {p.title}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
              {selectedProjectIds.length > 0 && (
                <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {selectedProjectIds.length} selected
                  </span>
                  <button
                    onClick={() => {
                      setSelectedProjectIds([]);
                      setProjectSearch("");
                    }}
                    className="text-xs text-[#C72030] hover:underline font-medium"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <AssetAnalyticsSelector
            options={DASHBOARD_CHART_OPTIONS}
            selectedOptions={selectedCharts}
            onSelectionChange={setSelectedCharts}
            title="Select Charts"
            buttonLabel="Charts"
          />
          <Button
            variant="outline"
            onClick={openReportModal}
            className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-300 px-4 py-2"
          >
            <Eye className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Preview & Download PDF
            </span>
          </Button>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-3 text-gray-600 text-base">
            Loading dashboard data...
          </span>
        </div>
      ) : (
        <div className="space-y-8">
          {selectedCharts.includes("projectCompletion") && (
            <DashboardChart
              data={projectCompletionData}
              title="Project Completion Rate"
              xMax={getMax(projectCompletionData, ["completion_rate"])}
              bars={[
                {
                  dataKey: "completion_rate",
                  name: "Completion Rate (%)",
                  color: "#CBAE9A",
                },
              ]}
              unit="%"
              onRefresh={refreshProjectCompletion}
            />
          )}
          {selectedCharts.includes("milestonesOverview") && (
            <div>
              <SectionHeader
                title="Milestones Overview"
                icon={<FileText className="w-5 h-5 text-[#A0856C]" />}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {milestoneCards.length > 0 ? (
                  milestoneCards.map((c, i) => <KpiCard key={i} {...c} />)
                ) : (
                  <div className="col-span-full text-center text-gray-400 py-6">
                    No milestone data available
                  </div>
                )}
              </div>
            </div>
          )}
          {selectedCharts.includes("milestoneCompletion") && (
            <DashboardChart
              data={milestoneCompletionData}
              title="Milestone Completion Rate"
              xMax={getMax(milestoneCompletionData, ["completion_rate"])}
              bars={[
                {
                  dataKey: "completion_rate",
                  name: "Completion Rate (%)",
                  color: "#A68A7A",
                },
              ]}
              unit="%"
              onRefresh={refreshMilestoneCompletion}
            />
          )}
          {selectedCharts.includes("assigneeMilestone") && (
            <DashboardChart
              data={assigneeMilestoneData}
              title="Assignee Wise Milestone Status (in count)"
              xMax={getMax(assigneeMilestoneData, [
                "open",
                "completed",
                "in_progress",
              ])}
              bars={[
                { dataKey: "completed", name: "Completed", color: "#E5E7EB" },
                {
                  dataKey: "in_progress",
                  name: "In Progress",
                  color: "#9CA3AF",
                },
                { dataKey: "open", name: "Open", color: "#8A7365" },
              ]}
              onRefresh={refreshAssigneeMilestone}
            />
          )}
          {selectedCharts.includes("tasksOverview") && (
            <div>
              <SectionHeader
                title="Tasks Overview"
                icon={<ClipboardList className="w-5 h-5 text-[#A0856C]" />}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {taskCards.length > 0 ? (
                  taskCards.map((c, i) => <KpiCard key={i} {...c} />)
                ) : (
                  <div className="col-span-full text-center text-gray-400 py-6">
                    No task data available
                  </div>
                )}
              </div>
            </div>
          )}
          {selectedCharts.includes("issuesOverview") && (
            <div>
              <SectionHeader
                title="Issues Overview"
                icon={<AlertCircle className="w-5 h-5 text-[#A0856C]" />}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {issueCards.length > 0 ? (
                  issueCards.map((c, i) => <KpiCard key={i} {...c} />)
                ) : (
                  <div className="col-span-full text-center text-gray-400 py-6">
                    No issue data available
                  </div>
                )}
              </div>
            </div>
          )}
          {selectedCharts.includes("taskCompletion") && (
            <DashboardChart
              data={taskCompletionData}
              title="Task Completion Rate"
              xMax={getMax(taskCompletionData, ["completion_rate"])}
              bars={[
                {
                  dataKey: "completion_rate",
                  name: "Completion Rate (%)",
                  color: "#9CA3AF",
                },
              ]}
              unit="%"
              onRefresh={refreshTaskCompletion}
            />
          )}
          {selectedCharts.includes("assigneeTask") && (
            <DashboardChart
              data={assigneeTaskData}
              title="Assignee Wise Task Status (in count)"
              xMax={getMax(assigneeTaskData, [
                "open",
                "in_progress",
                "completed",
                "on_hold",
                "overdue",
                "aborted",
              ])}
              bars={[
                { dataKey: "open", name: "Open", color: "#D4C4B7" },
                {
                  dataKey: "in_progress",
                  name: "In Progress",
                  color: "#E5E7EB",
                },
                { dataKey: "completed", name: "Completed", color: "#D1D5DB" },
                { dataKey: "on_hold", name: "On Hold", color: "#A68A7A" },
                { dataKey: "overdue", name: "Overdue", color: "#6B7280" },
                { dataKey: "aborted", name: "Aborted", color: "#374151" },
              ]}
              onRefresh={refreshAssigneeTask}
            />
          )}
          {selectedCharts.includes("taskDependencies") && (
            <DashboardChart
              data={taskDependenciesData}
              title="Task Dependencies (in count)"
              xMax={getMax(taskDependenciesData, [
                "blocking",
                "blocked_by",
                "related",
              ])}
              bars={[
                { dataKey: "blocking", name: "Blocking", color: "#C72030" },
                { dataKey: "blocked_by", name: "Blocked By", color: "#A68A7A" },
                { dataKey: "related", name: "Related", color: "#CBAE9A" },
              ]}
              onRefresh={refreshTaskDependencies}
            />
          )}
          {selectedCharts.includes("issueBreakdown") && (
            <DashboardChart
              data={issueBreakdownData}
              title="Project Wise Issue Breakdown (in count)"
              xMax={getMax(issueBreakdownData, [
                "open",
                "in_progress",
                "completed",
                "closed",
              ])}
              bars={[
                { dataKey: "open", name: "Open", color: "#D4C4B7" },
                {
                  dataKey: "in_progress",
                  name: "In Progress",
                  color: "#9CA3AF",
                },
                { dataKey: "completed", name: "Completed", color: "#E5E7EB" },
                { dataKey: "closed", name: "Closed", color: "#6B7280" },
              ]}
              onRefresh={refreshIssueBreakdown}
            />
          )}
          {selectedCharts.includes("assigneeIssue") && (
            <DashboardChart
              data={assigneeIssueData}
              title="Assignee Wise Issues (in count)"
              xMax={getMax(assigneeIssueData, [
                "open",
                "in_progress",
                "on_hold",
                "completed",
                "closed",
                "reopened",
              ])}
              bars={[
                { dataKey: "open", name: "Open", color: "#D4C4B7" },
                {
                  dataKey: "in_progress",
                  name: "In Progress",
                  color: "#9CA3AF",
                },
                { dataKey: "on_hold", name: "On Hold", color: "#A68A7A" },
                { dataKey: "completed", name: "Completed", color: "#E5E7EB" },
                { dataKey: "closed", name: "Closed", color: "#6B7280" },
                { dataKey: "reopened", name: "Reopened", color: "#CBAE9A" },
              ]}
              onRefresh={refreshAssigneeIssue}
            />
          )}
          {selectedCharts.length === 0 && (
            <div className="py-16 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" />
              <p>
                No charts selected. Please select a chart from the Charts
                dropdown above.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Report Analytics Dialog (matches ReportAnalytics page exactly) ── */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-gray-200 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Reports &gt; Analytics
                </div>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  REPORT ANALYTICS
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500 mt-0.5">
                  Preview and download project analytics report
                </DialogDescription>
              </div>
              <div className="flex items-center gap-3">
                {/* Project selector */}
                <div className="relative w-[280px]">
                  <div className="flex items-center justify-between w-full px-4 py-2 bg-white border border-[#C72030] rounded-md text-sm font-medium text-gray-700 cursor-pointer">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FolderOpen className="w-4 h-4 text-[#C72030] shrink-0" />
                      <span className="truncate">
                        {projectsLoading
                          ? "Loading..."
                          : projectsList.find(
                            (p) => String(p.id) === reportProjectId
                          )?.title || "Select a project"}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-[#C72030] shrink-0" />
                  </div>
                  <select
                    title="Select Report Project"
                    value={reportProjectId}
                    onChange={(e) => setReportProjectId(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="" disabled>
                      Select a project
                    </option>
                    {projectsList.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Charts selector */}
                <AssetAnalyticsSelector
                  options={REPORT_CHART_OPTIONS}
                  selectedOptions={reportSelectedCharts}
                  onSelectionChange={setReportSelectedCharts}
                  title="Select Charts"
                  buttonLabel="Charts"
                />
                {/* Download button */}
                <Button
                  variant="outline"
                  onClick={handleReportPdfDownload}
                  disabled={reportDownloading || reportLoading}
                  className="flex items-center gap-2 border-gray-300 min-w-[140px]"
                  size="sm"
                >
                  {reportDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {reportLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
                <span className="ml-3 text-gray-600">
                  Loading report data...
                </span>
              </div>
            ) : !reportProjectId ? (
              <div className="text-center py-20">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  No Project Selected
                </h2>
                <p className="text-gray-500">
                  Please select a project to view analytics.
                </p>
              </div>
            ) : (
              <>
                {/* Project Info */}
                {reportProject && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between bg-[#F6F4EE] border border-gray-200 rounded-lg px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded-full">
                          <FileText className="w-5 h-5 text-[#C72030]" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-[#1A1A1A]">
                            {reportProject.title}
                          </h2>
                          <span className="text-xs text-gray-500">
                            Project ID: #{reportProject.id}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          icon: <Calendar className="w-6 h-6 text-[#C72030]" />,
                          value: formatDate(reportProject.start_date),
                          label: "Start Date",
                        },
                        {
                          icon: <Clock className="w-6 h-6 text-[#C72030]" />,
                          value: formatDate(reportProject.end_date),
                          label: "End Date",
                        },
                        {
                          icon: (
                            <CheckCircle className="w-6 h-6 text-[#C72030]" />
                          ),
                          value: `${reportProject.completion_percentage}%`,
                          label: "Completion",
                        },
                        {
                          icon: <XCircle className="w-6 h-6 text-[#C72030]" />,
                          value: `${reportProject.balance}%`,
                          label: "Balance",
                        },
                      ].map((kpi) => (
                        <div
                          key={kpi.label}
                          className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg flex items-center gap-4 min-h-[88px]"
                        >
                          <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                            {kpi.icon}
                          </div>
                          <div>
                            <div className="text-xl font-semibold">
                              {kpi.value}
                            </div>
                            <div className="text-sm font-medium text-[#1A1A1A]">
                              {kpi.label}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Priority Breakdown */}
                {reportPriorities.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {reportPriorities.map((p) => (
                      <div
                        key={p.priority}
                        className="relative bg-[#F6F4EE] border border-gray-100 p-6 rounded-lg transition-shadow duration-300 hover:shadow-lg min-h-[88px]"
                      >
                        <div className="flex items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-[#C4B89D54] flex items-center justify-center rounded">
                              <BarChart3 className="w-6 h-6 text-[#C72030]" />
                            </div>
                            <span className="text-sm font-semibold text-[#1A1A1A]">
                              {p.priority} Priority
                            </span>
                          </div>
                        </div>
                        <div className="flex">
                          <div className="flex-1 pr-3 border-r border-gray-300">
                            <div className="text-xs text-gray-500">Tasks</div>
                            <div className="text-2xl font-bold text-[#1A1A1A]">
                              {p.task_count}
                            </div>
                          </div>
                          <div className="flex-1 pl-3">
                            <div className="text-xs text-gray-500">Issues</div>
                            <div className="text-2xl font-bold text-[#1A1A1A]">
                              {p.issue_count}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Charts grid — same layout as ReportAnalytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {reportSelectedCharts.includes("milestoneProgress") && (
                    <div className="col-span-1">
                      <DonutChartCard
                        title="Milestone Progress"
                        data={raMilestoneChart}
                        colors={MILESTONE_COLORS}
                        loading={reportLoading}
                        headerBgColor="#e1fcbd"
                      />
                    </div>
                  )}

                  {reportSelectedCharts.includes("taskWiseProgress") && (
                    <div className="col-span-1">
                      <DonutChartCard
                        title="Task Wise Progress"
                        data={raTaskChart}
                        colors={TASK_COLORS}
                        loading={reportLoading}
                        headerBgColor="#c7ffff"
                      />
                    </div>
                  )}

                  {reportSelectedCharts.includes("issueWiseProgress") && (
                    <div className="col-span-1">
                      <DonutChartCard
                        title="Issue Wise Progress"
                        data={raIssueChart}
                        colors={ISSUE_COLORS}
                        loading={reportLoading}
                        total={reportIssueSummary?.total}
                        headerBgColor="#ffe1e0"
                      />
                    </div>
                  )}

                  {reportSelectedCharts.includes(
                    "milestoneActivityProgress"
                  ) && (
                      <div className="col-span-1 lg:col-span-2 xl:col-span-4">
                        <ChartCard
                          title="Milestone Activity Wise Progress"
                          headerBgColor="#e1fcbd"
                          action={
                            <SearchInput
                              placeholder="Search by milestone"
                              value={milestoneSearch}
                              onChange={setMilestoneSearch}
                            />
                          }
                        >
                          <div className="max-h-[400px] overflow-y-auto pr-2">
                            <EnhancedTable
                              data={filteredMilestoneTableData}
                              columns={MILESTONE_ACTIVITY_COLUMNS}
                              renderCell={(item, columnKey) => {
                                if (columnKey === "status") {
                                  const n = (item.status as string)?.replace(
                                    /_/g,
                                    " "
                                  );
                                  return (
                                    <span
                                      className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize leading-none ${STATUS_STYLES[item.status as string] ?? "bg-gray-100 text-gray-600"}`}
                                    >
                                      {n}
                                    </span>
                                  );
                                }
                                return (
                                  <div className="flex items-center h-full py-1 text-xs text-gray-600 whitespace-normal break-words">
                                    {item[columnKey] as string}
                                  </div>
                                );
                              }}
                              hideTableSearch
                              hideTableExport
                              hideColumnsButton
                              storageKey="ra-modal-milestone-activity"
                            />
                          </div>
                        </ChartCard>
                      </div>
                    )}

                  {reportSelectedCharts.includes("activityCompletion") && (
                    <div className="col-span-1 lg:col-span-2 xl:col-span-4">
                      <ChartCard
                        title="Activity % Completion - Graphical"
                        action={
                          <SearchInput
                            placeholder="Search by task"
                            value={taskSearch}
                            onChange={setTaskSearch}
                          />
                        }
                      >
                        <div className="max-h-[400px] overflow-y-auto pr-2">
                          <EnhancedTable
                            data={filteredActivityTableData}
                            columns={ACTIVITY_COMPLETION_COLUMNS}
                            renderCell={(item, columnKey) => {
                              if (columnKey === "title")
                                return (
                                  <div
                                    className="flex items-center h-full py-1 truncate"
                                    title={item.title as string}
                                  >
                                    <span className="text-sm font-medium text-gray-800">
                                      {item.title as string}
                                    </span>
                                  </div>
                                );
                              return renderProgressCell(
                                item.progress as number
                              );
                            }}
                            hideTableSearch
                            hideTableExport
                            hideColumnsButton
                            storageKey="ra-modal-activity-completion"
                          />
                        </div>
                      </ChartCard>
                    </div>
                  )}

                  {reportSelectedCharts.includes("taskDetails") && (
                    <div className="col-span-1 lg:col-span-2 xl:col-span-4">
                      <ChartCard
                        title="Task Details"
                        headerBgColor="#c7ffff"
                        action={
                          <SearchInput
                            placeholder="Search by task"
                            value={taskDetailsSearch}
                            onChange={setTaskDetailsSearch}
                          />
                        }
                      >
                        <EnhancedTable
                          data={filteredTaskDetailsData}
                          columns={TASK_DETAILS_COLUMNS}
                          renderCell={(item, columnKey) => {
                            if (columnKey === "status") {
                              const n = (item.status as string)?.replace(
                                /_/g,
                                " "
                              );
                              return (
                                <span
                                  className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize leading-none ${STATUS_STYLES[item.status as string] ?? "bg-gray-100 text-gray-600"}`}
                                >
                                  {n}
                                </span>
                              );
                            }
                            if (columnKey === "priority")
                              return (
                                <span
                                  className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold leading-none ${PRIORITY_STYLES[item.priority as string] ?? "bg-gray-100 text-gray-600"}`}
                                >
                                  {item.priority as string}
                                </span>
                              );
                            return (
                              <div className="flex items-center h-full py-1 text-sm text-gray-700 whitespace-normal break-words">
                                {item[columnKey] as string}
                              </div>
                            );
                          }}
                          hideTableSearch
                          hideTableExport={false}
                          hideColumnsButton
                          storageKey="ra-modal-task-details"
                          pagination
                        />
                      </ChartCard>
                    </div>
                  )}

                  {reportSelectedCharts.includes("issueDetails") && (
                    <div className="col-span-1 lg:col-span-2 xl:col-span-4">
                      <ChartCard
                        title="Issue Details"
                        headerBgColor="#ffe1e0"
                        action={
                          <SearchInput
                            placeholder="Search by issue"
                            value={issueDetailsSearch}
                            onChange={setIssueDetailsSearch}
                          />
                        }
                      >
                        <EnhancedTable
                          data={filteredIssueDetailsData}
                          columns={ISSUE_DETAILS_COLUMNS}
                          renderCell={(item, columnKey) => {
                            if (columnKey === "priority")
                              return (
                                <span
                                  className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold leading-none ${PRIORITY_STYLES[item.priority as string] ?? "bg-gray-100 text-gray-600"}`}
                                >
                                  {item.priority as string}
                                </span>
                              );
                            return (
                              <div className="flex items-center h-full py-1 text-sm text-gray-700 whitespace-normal break-words">
                                {item[columnKey] as string}
                              </div>
                            );
                          }}
                          hideTableSearch
                          hideTableExport={false}
                          hideColumnsButton
                          storageKey="ra-modal-issue-details"
                          pagination
                        />
                      </ChartCard>
                    </div>
                  )}

                  {reportSelectedCharts.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                      <p>
                        No charts selected. Please select a chart from the
                        dropdown above.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardUI;
