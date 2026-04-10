import React, { useState, useEffect, useCallback } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Filter,
  BarChart3,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Loader2,
  ChevronDown,
  FolderOpen,
  Search,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { AssetAnalyticsSelector } from "@/components/AssetAnalyticsSelector";
import { AssetAnalyticsFilterDialog } from "@/components/AssetAnalyticsFilterDialog";
import { getFullUrl, getAuthHeader } from "@/config/apiConfig";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { EnhancedTable } from "@/components/enhanced-table/EnhancedTable";
import jsPDF from "jspdf";

// ── Chart config ──────────────────────────────────────────────────────────────
const CHART_OPTIONS = [
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
    id: "milestoneActivityProgress",
    label: "Milestone Activity Wise Progress",
    description: "Milestone-wise completion and balance",
  },
  {
    id: "activityCompletion",
    label: "Activity % Completion",
    description: "Task-wise completion across periods",
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
const CHART_KEYS = CHART_OPTIONS.map((o) => o.id);

const MILESTONE_COLORS = ["#AF8260", "#E5E7EB"];
const TASK_COLORS = ["#AF8260", "#E5E7EB"];

// ── Column configs ────────────────────────────────────────────────────────────
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
  {
    key: "title",
    label: "Task",
    sortable: true,
    defaultVisible: true,
    width: "50%",
  },
  {
    key: "progress",
    label: "% Completion",
    sortable: true,
    defaultVisible: true,
    width: "50%",
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

const toDDMMYYYY = (d: Date) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

const parseDD = (s: string): Date => {
  const [dd, mm, yyyy] = s.split("/");
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
};

const getDefaultRange = () => {
  const today = new Date();
  const lastYear = new Date(today);
  lastYear.setFullYear(today.getFullYear() - 1);
  return { startDate: toDDMMYYYY(lastYear), endDate: toDDMMYYYY(today) };
};

// ── Custom pie label ──────────────────────────────────────────────────────────
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

// ── SortableChartItem ─────────────────────────────────────────────────────────
const SortableChartItem: React.FC<{
  id: string;
  className?: string;
  children: React.ReactNode;
}> = ({ id, className, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : "auto",
    position: isDragging ? "relative" : "static",
  } as React.CSSProperties;
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing transition-all duration-200 h-full ${className || ""}`}
    >
      {children}
    </div>
  );
};

// ── Chart card wrapper ────────────────────────────────────────────────────────
const ChartCard: React.FC<{
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, action, children }) => (
  <div className="bg-white rounded-lg border border-gray-100 transition-shadow duration-300 hover:shadow-lg p-5 h-full flex flex-col">
    <div className="flex items-center justify-between mb-4 gap-4">
      <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">
        {title}
      </h3>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
    <div className="flex-1 w-full overflow-hidden">{children}</div>
  </div>
);

// ── Donut Chart Card ──────────────────────────────────────────────────────────
const DonutChartCard: React.FC<{
  title: string;
  data: { name: string; value: number }[];
  colors: string[];
  loading?: boolean;
}> = ({ title, data, colors, loading }) => (
  <ChartCard title={title}>
    <div className="flex flex-col items-center justify-center h-full">
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          <div className="w-full px-6">
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

// ── Interfaces ────────────────────────────────────────────────────────────────
interface ProjectDropdownItem {
  id: number;
  title: string;
}
interface ProjectInfo {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  completion_percentage: number;
  balance: number;
}
interface MilestoneSummary {
  average_completion: number;
  balance: number;
}
interface MilestoneItem {
  id: number;
  code: string | null;
  title: string;
  status: string;
  completion_percentage: number;
  balance: number;
}
interface TaskSummary {
  average_completion: number;
  balance: number;
}
interface TaskItem {
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
interface IssueItem {
  id: number;
  title: string;
  description: string;
  priority: string;
  name: string;
  related_to_milestone: string;
  related_to_task: string;
  responsible_person: string;
}
interface PriorityBreakdown {
  priority: string;
  task_count: number;
  issue_count: number;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const ReportAnalytics: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryProjectId = searchParams.get("project_id");

  const [projectsList, setProjectsList] = useState<ProjectDropdownItem[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    queryProjectId || "269"
  );
  const projectId = selectedProjectId;

  const [dateRange, setDateRange] = useState(getDefaultRange);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>(CHART_KEYS);
  const [chartOrder, setChartOrder] = useState<string[]>(CHART_KEYS);
  const [isDownloading, setIsDownloading] = useState(false);

  // Search states
  const [milestoneSearch, setMilestoneSearch] = useState("");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskDetailsSearch, setTaskDetailsSearch] = useState("");
  const [issueDetailsSearch, setIssueDetailsSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState<ProjectInfo | null>(null);
  const [milestoneSummary, setMilestoneSummary] =
    useState<MilestoneSummary | null>(null);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [taskSummary, setTaskSummary] = useState<TaskSummary | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [issues, setIssues] = useState<IssueItem[]>([]);
  const [priorities, setPriorities] = useState<PriorityBreakdown[]>([]);

  useEffect(() => {
    setChartOrder(CHART_KEYS);
  }, []);

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
        console.error(err);
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const fetchMilestoneSummary = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await fetch(
        getFullUrl(
          `/patm_report/project_milestones_summary.json?project_id=${projectId}`
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
      if (json.success && json.data?.[0]) {
        const d = json.data[0];
        setProject(d.project || null);
        setMilestoneSummary(d.milestone_summary || null);
        setMilestones(d.milestones || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, [projectId]);

  const fetchTaskSummary = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await fetch(
        getFullUrl(
          `/patm_report/project_task_summary.json?project_id=${projectId}`
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
      if (json.success && json.data?.[0]) {
        const d = json.data[0];
        setTaskSummary(d.task_summary || null);
        setTasks(d.tasks || []);
      }
    } catch (err) {
      console.error(err);
    }
  }, [projectId]);

  const fetchIssueSummary = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await fetch(
        getFullUrl(
          `/patm_report/project_issue_summary.json?project_id=${projectId}`
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
      if (json.success && json.data?.[0]) setIssues(json.data[0].issues || []);
    } catch (err) {
      console.error(err);
    }
  }, [projectId]);

  const fetchPriorityBreakdown = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await fetch(
        getFullUrl(
          `/patm_report/project_priority_breakdown.json?project_id=${projectId}`
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
      if (json.success && json.data?.[0])
        setPriorities(json.data[0].priorities || []);
    } catch (err) {
      console.error(err);
    }
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    Promise.all([
      fetchMilestoneSummary(),
      fetchTaskSummary(),
      fetchIssueSummary(),
      fetchPriorityBreakdown(),
    ]).finally(() => setLoading(false));
  }, [
    projectId,
    fetchMilestoneSummary,
    fetchTaskSummary,
    fetchIssueSummary,
    fetchPriorityBreakdown,
  ]);

  // ── Derived data ────────────────────────────────────────────────────────────
  const milestoneChartData = milestoneSummary
    ? [
        {
          name: "Completed",
          value: Number(milestoneSummary.average_completion.toFixed(1)),
        },
        {
          name: "Balance",
          value: Number(milestoneSummary.balance.toFixed(1)),
        },
      ]
    : [
        { name: "Completed", value: 0 },
        { name: "Balance", value: 100 },
      ];

  const taskChartData = taskSummary
    ? [
        {
          name: "Completed",
          value: Number(taskSummary.average_completion.toFixed(1)),
        },
        { name: "Balance", value: Number(taskSummary.balance.toFixed(1)) },
      ]
    : [
        { name: "Completed", value: 0 },
        { name: "Balance", value: 100 },
      ];

  const milestoneTableData = milestones.map((m) => ({
    id: String(m.id),
    title: m.title,
    status: m.status,
    completion_percentage: `${m.completion_percentage}%`,
    balance: `${m.balance}%`,
  }));

  const activityTableData = tasks.map((t) => ({
    id: String(t.id),
    title: t.title,
    progress: t.completion_percentage,
  }));

  const taskDetailsData = tasks.map((t) => ({
    id: String(t.id),
    title: t.title,
    status: t.status,
    priority: t.priority,
    related_to_milestone: t.related_to_milestone,
    responsible_person: t.responsible_person,
    completion_percentage: `${t.completion_percentage}%`,
    balance: `${t.balance}%`,
  }));

  const issueDetailsData = issues.map((iss) => ({
    id: String(iss.id),
    title: iss.title,
    description: iss.description?.replace(/<[^>]*>/g, "") || "—",
    priority: iss.priority,
    related_to_milestone: iss.related_to_milestone,
    related_to_task: iss.related_to_task,
    responsible_person: iss.responsible_person,
  }));

  // ── Filtered data ───────────────────────────────────────────────────────────
  const safeSearch = (val: string) => (val || "").toLowerCase();
  const safeText = (text: any) => (text ? String(text).toLowerCase() : "");

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

  const selectedProjectLabel =
    projectsList.find((p) => String(p.id) === selectedProjectId)?.title ||
    "Select Project";

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

  const orderedVisible = chartOrder.filter((k) => selectedCharts.includes(k));

  // ── PDF Download ──────────────────────────────────────────────────────────
  const handleDownloadAll = async () => {
    setIsDownloading(true);
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

      const checkPage = (needed: number) => {
        if (y + needed > A4_H - MARGIN) {
          pdf.addPage();
          y = MARGIN;
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

      const sectionHeader = (title: string) => {
        checkPage(30);
        drawRect(MARGIN, y, CONTENT_W, 20, [246, 244, 238]);
        pdf.setFontSize(10);
        pdf.setTextColor(26, 26, 26);
        pdf.setFont("helvetica", "bold");
        pdf.text(title, MARGIN + 8, y + 13);
        y += 28;
      };

      const drawTable = (
        columns: { key: string; label: string; width: number }[],
        rows: Record<string, unknown>[]
      ) => {
        // Header row
        checkPage(20);
        drawRect(MARGIN, y, CONTENT_W, 16, [243, 244, 246]);
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

      // ── Draw Donut Chart via Canvas → base64 image → PDF ─────────────────
      const drawDonutChartImage = (
        title: string,
        data: { name: string; value: number }[],
        colors: [number, number, number][]
      ) => {
        checkPage(200);
        sectionHeader(title);

        // Draw on an offscreen canvas
        const SIZE = 400;
        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d")!;

        const cx = SIZE / 2;
        const cy = SIZE / 2;
        const outerR = 130;
        const innerR = 72;

        const total = data.reduce((s, d) => s + d.value, 0) || 1;
        let startAngle = -Math.PI / 2;

        // Draw each segment
        data.forEach((d, i) => {
          if (d.value <= 0) return;
          const sweep = (d.value / total) * 2 * Math.PI;
          const [r, g, b] = colors[i % colors.length];

          ctx.beginPath();
          ctx.moveTo(
            cx + innerR * Math.cos(startAngle),
            cy + innerR * Math.sin(startAngle)
          );
          ctx.arc(cx, cy, outerR, startAngle, startAngle + sweep);
          ctx.arc(cx, cy, innerR, startAngle + sweep, startAngle, true);
          ctx.closePath();
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fill();

          startAngle += sweep;
        });

        // Convert canvas to PNG base64 and embed in PDF
        const imgData = canvas.toDataURL("image/png");
        const imgW = 90; // pts
        const imgH = 90;
        const imgX = MARGIN + 10;
        const imgY = y;
        pdf.addImage(imgData, "PNG", imgX, imgY, imgW, imgH);

        // Legend to the right of the chart
        const legendX = imgX + imgW + 16;
        const legendStartY = imgY + imgH / 2 - (data.length * 18) / 2;
        data.forEach((d, i) => {
          const lly = legendStartY + i * 20;
          drawRect(legendX, lly, 11, 11, colors[i % colors.length]);
          pdf.setFontSize(9);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(55, 65, 81);
          pdf.text(`${d.name}: ${d.value}%`, legendX + 15, lly + 8.5);
        });

        y += imgH + 16;
      };

      // ── Report header ─────────────────────────────────────────────────────
      pdf.setFontSize(8);
      pdf.setTextColor(107, 114, 128);
      pdf.setFont("helvetica", "normal");
      pdf.text("Reports > Analytics", MARGIN, y);
      y += 24; // Increased space here

      pdf.setFontSize(18);
      pdf.setTextColor(17, 24, 39);
      pdf.setFont("helvetica", "bold");
      pdf.text("REPORT ANALYTICS", MARGIN, y);
      y += 30; // Increased space here as well to balance below the title

      // ── Project banner ────────────────────────────────────────────────────
      if (project) {
        drawRect(MARGIN, y, CONTENT_W, 44, [246, 244, 238]);
        pdf.setFontSize(12);
        pdf.setTextColor(26, 26, 26);
        pdf.setFont("helvetica", "bold");
        pdf.text(project.title, MARGIN + 12, y + 16);
        pdf.setFontSize(8);
        pdf.setTextColor(107, 114, 128);
        pdf.setFont("helvetica", "normal");
        pdf.text(`Project ID: #${project.id}`, MARGIN + 12, y + 30);
        y += 54;

        // KPI cards
        const kpis = [
          { label: "Start Date", value: formatDate(project.start_date) },
          { label: "End Date", value: formatDate(project.end_date) },
          {
            label: "Completion",
            value: `${project.completion_percentage}%`,
          },
          { label: "Balance", value: `${project.balance}%` },
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

      // ── Priority breakdown ────────────────────────────────────────────────
      if (priorities.length > 0) {
        checkPage(80);
        const pW =
          (CONTENT_W - (priorities.length - 1) * 4) / priorities.length;
        priorities.forEach((p, i) => {
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

      // ── Tables & charts ───────────────────────────────────────────────────

      // ── Milestone Progress + Task Wise Progress side by side ──────────────
      const showMilestone = orderedVisible.includes("milestoneProgress");
      const showTask = orderedVisible.includes("taskWiseProgress");

      if (showMilestone || showTask) {
        checkPage(160);

        const HALF_W = CONTENT_W / 2 - 6;

        // Helper: draw one donut panel into a specific X offset
        const drawDonutPanel = (
          panelTitle: string,
          data: { name: string; value: number }[],
          colors: [number, number, number][],
          offsetX: number
        ) => {
          const SIZE = 300;
          const canvas = document.createElement("canvas");
          canvas.width = SIZE;
          canvas.height = SIZE;
          const ctx = canvas.getContext("2d")!;
          const ccx = SIZE / 2;
          const ccy = SIZE / 2;
          const outerR = 100;
          const innerR = 55;
          const total = data.reduce((s, d) => s + d.value, 0) || 1;
          let sa = -Math.PI / 2;
          data.forEach((d, i) => {
            if (d.value <= 0) return;
            const sweep = (d.value / total) * 2 * Math.PI;
            const [r, g, b] = colors[i % colors.length];
            ctx.beginPath();
            ctx.moveTo(
              ccx + innerR * Math.cos(sa),
              ccy + innerR * Math.sin(sa)
            );
            ctx.arc(ccx, ccy, outerR, sa, sa + sweep);
            ctx.arc(ccx, ccy, innerR, sa + sweep, sa, true);
            ctx.closePath();
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fill();
            sa += sweep;
          });

          const imgData = canvas.toDataURL("image/png");
          const imgW = 70;
          const imgH = 70;
          const imgX = MARGIN + offsetX + 8;
          const imgY = y + 26; // below section header

          // Section header for this panel
          drawRect(MARGIN + offsetX, y, HALF_W, 20, [246, 244, 238]);
          pdf.setFontSize(9);
          pdf.setTextColor(26, 26, 26);
          pdf.setFont("helvetica", "bold");
          pdf.text(panelTitle, MARGIN + offsetX + 8, y + 13);

          pdf.addImage(imgData, "PNG", imgX, imgY, imgW, imgH);

          // Legend
          const legendX = imgX + imgW + 12;
          const legendStartY = imgY + imgH / 2 - (data.length * 18) / 2;
          data.forEach((d, i) => {
            const lly = legendStartY + i * 20;
            drawRect(legendX, lly, 10, 10, colors[i % colors.length]);
            pdf.setFontSize(8);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(55, 65, 81);
            pdf.text(`${d.name}: ${d.value}%`, legendX + 13, lly + 8);
          });
        };

        if (showMilestone && showTask) {
          // Both side by side
          drawDonutPanel(
            "Milestone Progress",
            milestoneChartData,
            [
              [175, 130, 96],
              [229, 231, 235],
            ],
            0
          );
          drawDonutPanel(
            "Task Wise Progress",
            taskChartData,
            [
              [175, 130, 96],
              [229, 231, 235],
            ],
            HALF_W + 12
          );
        } else if (showMilestone) {
          drawDonutPanel(
            "Milestone Progress",
            milestoneChartData,
            [
              [175, 130, 96],
              [229, 231, 235],
            ],
            0
          );
        } else if (showTask) {
          drawDonutPanel(
            "Task Wise Progress",
            taskChartData,
            [
              [175, 130, 96],
              [229, 231, 235],
            ],
            0
          );
        }

        y += 116; // move y past the donut row
      }

      if (orderedVisible.includes("milestoneActivityProgress")) {
        sectionHeader("Milestone Activity Wise Progress");
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
          filteredMilestoneTableData as Record<string, unknown>[]
        );
      }

      if (orderedVisible.includes("activityCompletion")) {
        sectionHeader("Activity % Completion");
        drawTable(
          [
            { key: "title", label: "Task", width: CONTENT_W * 0.6 },
            {
              key: "progress",
              label: "% Completion",
              width: CONTENT_W * 0.4,
            },
          ],
          filteredActivityTableData as Record<string, unknown>[]
        );
      }

      if (orderedVisible.includes("taskDetails")) {
        sectionHeader("Task Details");
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
          filteredTaskDetailsData as Record<string, unknown>[]
        );
      }

      if (orderedVisible.includes("issueDetails")) {
        sectionHeader("Issue Details");
        drawTable(
          [
            { key: "title", label: "Title", width: CONTENT_W * 0.2 },
            {
              key: "description",
              label: "Description",
              width: CONTENT_W * 0.25,
            },
            { key: "priority", label: "Priority", width: CONTENT_W * 0.1 },
            {
              key: "related_to_milestone",
              label: "Milestone",
              width: CONTENT_W * 0.18,
            },
            {
              key: "related_to_task",
              label: "Task",
              width: CONTENT_W * 0.15,
            },
            {
              key: "responsible_person",
              label: "Responsible",
              width: CONTENT_W * 0.12,
            },
          ],
          filteredIssueDetailsData as Record<string, unknown>[]
        );
      }

      const slug = project?.title
        ? project.title.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase()
        : projectId;
      pdf.save(`report-analytics-${slug}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("PDF download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleApplyFilters = (startStr: string, endStr: string) => {
    const conv = (s: string) => {
      const [y, m, d] = s.split("-");
      return `${d}/${m}/${y}`;
    };
    setDateRange({ startDate: conv(startStr), endDate: conv(endStr) });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setChartOrder((items) =>
        arrayMove(
          items,
          items.indexOf(active.id as string),
          items.indexOf(over?.id as string)
        )
      );
    }
  };

  if (!projectId) {
    return (
      <div className="p-4 sm:p-6 min-h-screen">
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Project Selected
          </h2>
          <p className="text-gray-500">
            Please provide a project_id query parameter to view analytics.
          </p>
        </div>
      </div>
    );
  }

  // ── Search bar UI ─────────────────────────────────────────────────────────
  const milestoneSearchAction = (
    <div className="relative w-[200px] sm:w-[250px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search by milestone"
        className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C72030] focus:border-[#C72030]"
        value={milestoneSearch}
        onChange={(e) => setMilestoneSearch(e.target.value)}
      />
    </div>
  );

  const taskSearchAction = (
    <div className="relative w-[200px] sm:w-[250px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search by task"
        className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C72030] focus:border-[#C72030]"
        value={taskSearch}
        onChange={(e) => setTaskSearch(e.target.value)}
      />
    </div>
  );

  const taskDetailsSearchAction = (
    <div className="relative w-[200px] sm:w-[250px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search by task"
        className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C72030] focus:border-[#C72030]"
        value={taskDetailsSearch}
        onChange={(e) => setTaskDetailsSearch(e.target.value)}
      />
    </div>
  );

  const issueDetailsSearchAction = (
    <div className="relative w-[200px] sm:w-[250px]">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search by issue"
        className="block w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#C72030] focus:border-[#C72030]"
        value={issueDetailsSearch}
        onChange={(e) => setIssueDetailsSearch(e.target.value)}
      />
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-4 sm:p-6 space-y-6 min-h-screen">
      {/* Title */}
      <div>
        <div className="text-sm text-gray-600 mb-2">Reports &gt; Analytics</div>
        <h1 className="font-work-sans font-semibold text-base sm:text-2xl lg:text-[26px] leading-auto tracking-normal text-gray-900">
          REPORT ANALYTICS
        </h1>
      </div>

      {/* Filter row */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 mb-6">
        <div className="relative w-full sm:w-[280px]">
          <div className="flex items-center justify-between w-full px-4 py-2 bg-white border border-[#C72030] rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <FolderOpen className="w-4 h-4 text-[#C72030] shrink-0" />
              <span className="truncate">
                {projectsLoading ? "Loading..." : selectedProjectLabel}
              </span>
            </div>
            {projectsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#C72030] shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#C72030] shrink-0" />
            )}
          </div>
          <select
            title="Select Project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={projectsLoading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
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

        <Button
          variant="outline"
          onClick={() => setFilterOpen(true)}
          className="flex items-center justify-between w-full sm:w-[280px] px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {dateRange.startDate} - {dateRange.endDate}
            </span>
          </div>
          <Filter className="w-4 h-4 text-gray-600" />
        </Button>

        <div className="w-full sm:w-auto flex items-center gap-3">
          <AssetAnalyticsSelector
            options={CHART_OPTIONS}
            selectedOptions={selectedCharts}
            onSelectionChange={setSelectedCharts}
            title="Select Charts"
            buttonLabel="Charts"
            dateRange={{
              startDate: parseDD(dateRange.startDate),
              endDate: parseDD(dateRange.endDate),
            }}
          />
        </div>
      </div>

      {/* Project Info */}
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-[#C72030]" />
          <span className="ml-2 text-gray-600">Loading project data...</span>
        </div>
      ) : project ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-[#F6F4EE] border border-gray-200 rounded-lg px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#C4B89D54] flex items-center justify-center rounded-full">
                <FileText className="w-5 h-5 text-[#C72030]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#1A1A1A]">
                  {project.title}
                </h2>
                <span className="text-xs text-gray-500">
                  Project ID: #{project.id}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleDownloadAll}
              disabled={isDownloading}
              className="flex items-center gap-2 border-gray-300 min-w-[130px]"
              size="sm"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </Button>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: <Calendar className="w-6 h-6 text-[#C72030]" />,
                value: formatDate(project.start_date),
                label: "Start Date",
              },
              {
                icon: <Clock className="w-6 h-6 text-[#C72030]" />,
                value: formatDate(project.end_date),
                label: "End Date",
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-[#C72030]" />,
                value: `${project.completion_percentage}%`,
                label: "Completion",
              },
              {
                icon: <XCircle className="w-6 h-6 text-[#C72030]" />,
                value: `${project.balance}%`,
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
                  <div className="text-xl font-semibold">{kpi.value}</div>
                  <div className="text-sm font-medium text-[#1A1A1A]">
                    {kpi.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Priority Breakdown */}
      {priorities.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {priorities.map((p) => (
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

      {/* Charts grid */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {orderedVisible.map((key) => {
              const isDonut =
                key === "milestoneProgress" || key === "taskWiseProgress";
              const isFullWidth =
                key === "taskDetails" ||
                key === "issueDetails" ||
                key === "activityCompletion" ||
                key === "milestoneActivityProgress";

              const colSpanClass = isFullWidth
                ? "col-span-1 lg:col-span-2 xl:col-span-4"
                : isDonut
                  ? "col-span-1 lg:col-span-1 xl:col-span-2"
                  : "col-span-1 lg:col-span-2";

              if (key === "milestoneProgress")
                return (
                  <SortableChartItem
                    key={key}
                    id={key}
                    className={colSpanClass}
                  >
                    <DonutChartCard
                      title="Milestone Progress"
                      data={milestoneChartData}
                      colors={MILESTONE_COLORS}
                      loading={loading}
                    />
                  </SortableChartItem>
                );

              if (key === "taskWiseProgress")
                return (
                  <SortableChartItem
                    key={key}
                    id={key}
                    className={colSpanClass}
                  >
                    <DonutChartCard
                      title="Task Wise Progress"
                      data={taskChartData}
                      colors={TASK_COLORS}
                      loading={loading}
                    />
                  </SortableChartItem>
                );

              if (key === "milestoneActivityProgress")
                return (
                  <SortableChartItem
                    key={key}
                    id={key}
                    className={colSpanClass}
                  >
                    <ChartCard
                      title="Milestone Activity Wise Progress"
                      action={milestoneSearchAction}
                    >
                      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
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
                          hideTableSearch={true}
                          hideTableExport
                          hideColumnsButton
                          storageKey="milestone-activity-progress-table"
                        />
                      </div>
                    </ChartCard>
                  </SortableChartItem>
                );

              if (key === "activityCompletion")
                return (
                  <SortableChartItem
                    key={key}
                    id={key}
                    className={colSpanClass}
                  >
                    <ChartCard
                      title="Activity % Completion - Graphical"
                      action={taskSearchAction}
                    >
                      <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <EnhancedTable
                          data={filteredActivityTableData}
                          columns={ACTIVITY_COMPLETION_COLUMNS}
                          renderCell={(item, columnKey) => {
                            if (columnKey === "title")
                              return (
                                <div
                                  className="flex items-center h-full py-1 truncate w-[150px] sm:w-[250px] md:w-[350px] lg:w-[450px]"
                                  title={item.title as string}
                                >
                                  <span className="text-sm font-medium text-gray-800">
                                    {item.title as string}
                                  </span>
                                </div>
                              );
                            return renderProgressCell(item.progress as number);
                          }}
                          hideTableSearch={true}
                          hideTableExport
                          hideColumnsButton
                          storageKey="activity-completion-graphical-table"
                        />
                      </div>
                    </ChartCard>
                  </SortableChartItem>
                );

              if (key === "taskDetails")
                return (
                  <SortableChartItem
                    key={key}
                    id={key}
                    className={colSpanClass}
                  >
                    <ChartCard
                      title="Task Details"
                      action={taskDetailsSearchAction}
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
                        hideTableSearch={true}
                        hideTableExport={false}
                        hideColumnsButton
                        storageKey="task-details-table"
                        pagination
                      />
                    </ChartCard>
                  </SortableChartItem>
                );

              if (key === "issueDetails")
                return (
                  <SortableChartItem
                    key={key}
                    id={key}
                    className={colSpanClass}
                  >
                    <ChartCard
                      title="Issue Details"
                      action={issueDetailsSearchAction}
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
                        hideTableSearch={true}
                        hideTableExport={false}
                        hideColumnsButton
                        storageKey="issue-details-table"
                        pagination
                      />
                    </ChartCard>
                  </SortableChartItem>
                );

              return null;
            })}

            {orderedVisible.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <BarChart3 className="w-10 h-10 mx-auto mb-2 opacity-20" />
                <p>
                  No charts selected. Please select a chart from the dropdown
                  above.
                </p>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <AssetAnalyticsFilterDialog
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
        currentStartDate={parseDD(dateRange.startDate)}
        currentEndDate={parseDD(dateRange.endDate)}
      />
    </div>
  );
};

export default ReportAnalytics;
