import type {
  DailyAiToneStyle,
  TaskIssueGroupConfig,
} from "./types";

export const DRAFT_STORAGE_PREFIX = "business-compass-daily-report-draft";

export const badgePoints =
  "bc-points-badge border-0 shadow-none !bg-[#CECBF6] !text-[#5c5a8a] hover:!bg-[#c4c1f0]";

export const ORIGINAL_DATA_OMIT_KEYS = [
  // task-side bookkeeping
  "task_code",
  "total_issues",
  "completed_issues",
  "total_sub_tasks",
  "completed_sub_tasks",
  "sub_tasks_managements",
  "estimated_min",
  "successor_task",
  "predecessor_task",
  "project_status_id",
  "completion_percent",
  "created_by_name",
  "milestone_title",
  "task_allocation_times",
  // issue-side bookkeeping
  "url",
  "comments",
  "attachments",
  "issue_status_logs",
  "issue_allocation_times",
  "created_by",
  "created_by_id",
  "issue_type",
  "issue_type_name",
  "started_at",
  "resource_id",
  "resource_type",
  "milestone_id",
  "milstone_name",
  "task_management_id",
  "task_management_name",
  "sub_task_management_name",
  "project_management_id",
  "time_taken_to_complete",
  "total_effective_minutes",
  "description",
  "is_started",
  // shared
  "responsible_person_id",
];

export const COMPLETED_STATUSES = new Set([
  "completed",
  "closed",
  "done",
]);

export const PRIORITY_COLORS: Record<string, { bg: string; color: string }> = {
  P1: { bg: "#fee2e2", color: "#991b1b" },
  P2: { bg: "#fef3c7", color: "#92400e" },
  P3: { bg: "#dbeafe", color: "#1e40af" },
  P4: { bg: "#dcfce7", color: "#166534" },
};

export const taskIssueGroups: readonly TaskIssueGroupConfig[] = [
  {
    key: "overdue",
    label: "Overdue",
    statuses: ["overdue", "overdued"],
    colorClass: "text-red-700",
    bgItem: "bg-red-50/60 border-red-200",
    headerBg: "bg-red-50 hover:bg-red-100",
    pillBg: "bg-red-100 text-red-700",
    showAddToTomorrow: true,
    showBulkAdd: true,
  },
  {
    key: "in_progress",
    label: "In Progress",
    statuses: ["in_progress", "started"],
    colorClass: "text-sky-700",
    bgItem: "bg-sky-50/60 border-sky-200",
    headerBg: "bg-sky-50 hover:bg-sky-100",
    pillBg: "bg-sky-100 text-sky-700",
    showAddToTomorrow: true,
    showBulkAdd: false,
  },
  {
    key: "pending",
    label: "Open",
    statuses: ["open", "pending"],
    colorClass: "text-slate-600",
    bgItem: "bg-slate-50/60 border-slate-200",
    headerBg: "bg-slate-50 hover:bg-slate-100",
    pillBg: "bg-slate-100 text-slate-600",
    showAddToTomorrow: true,
    showBulkAdd: false,
  },
  {
    key: "on_hold",
    label: "On Hold",
    statuses: ["on_hold"],
    colorClass: "text-orange-700",
    bgItem: "bg-orange-50/60 border-orange-200",
    headerBg: "bg-orange-50 hover:bg-orange-100",
    pillBg: "bg-orange-100 text-orange-700",
    showAddToTomorrow: true,
    showBulkAdd: false,
  },
  {
    key: "reopened",
    label: "Reopened",
    statuses: ["reopen", "reopened"],
    colorClass: "text-purple-700",
    bgItem: "bg-purple-50/60 border-purple-200",
    headerBg: "bg-purple-50 hover:bg-purple-100",
    pillBg: "bg-purple-100 text-purple-700",
    showAddToTomorrow: true,
    showBulkAdd: false,
  },
];

export const taskStatusFilterOptions: {
  key: string;
  label: string;
  statuses: string[];
}[] = [
  {
    key: "open",
    label: "Open",
    statuses: ["open", "pending", "reopen", "reopened"],
  },
  {
    key: "overdue",
    label: "Overdue",
    statuses: ["overdue", "overdued"],
  },
  {
    key: "in_progress",
    label: "In Progress",
    statuses: ["in_progress", "started"],
  },
  {
    key: "on_hold",
    label: "On Hold",
    statuses: ["on_hold"],
  },
];

export const dailyAiToneStyles: Record<
  string,
  { icon: string; action: string; iconBg: string }
> = {
  red: {
    icon: "text-[#ef4444]",
    action: "text-[#ef6b62]",
    iconBg: "bg-[#fff1f0]",
  },
  green: {
    icon: "text-[#29b881]",
    action: "text-[#23c989]",
    iconBg: "bg-[#eefbf5]",
  },
  orange: {
    icon: "text-[#f59e0b]",
    action: "text-[#f28a4b]",
    iconBg: "bg-[#fff6eb]",
  },
  purple: {
    icon: "text-[#7567d9]",
    action: "text-[#9586e8]",
    iconBg: "bg-[#f3f1ff]",
  },
};

export const aiToneOptions: { key: string; label: string; description: string }[] = [
  {
    key: "default",
    label: "Default",
    description: "Balanced and professional",
  },
  {
    key: "desi",
    label: "Desi",
    description: "Casual and friendly",
  },
  {
    key: "corporate",
    label: "Corporate",
    description: "Formal and business-ready",
  },
  {
    key: "simple",
    label: "Simple",
    description: "Short and to the point",
  },
  {
    key: "clarity",
    label: "Clarity",
    description: "Clear and easy to read",
  },
];

export const dailyAiToneInstructions: Record<string, DailyAiToneStyle> = {
  default: {
    label: "Default",
    description: "Balanced and professional",
    instructions:
      "Write professionally balanced, action-oriented suggestions with a confident tone.",
  },
  desi: {
    label: "Desi",
    description: "Casual and friendly",
    instructions:
      "Use a friendly, casual Hinglish tone. Keep it warm, simple and encouraging.",
  },
  corporate: {
    label: "Corporate",
    description: "Formal and business-ready",
    instructions:
      "Use a formal corporate tone with crisp, professional language and actionable phrasing.",
  },
  simple: {
    label: "Simple",
    description: "Short and to the point",
    instructions:
      "Keep every suggestion short, punchy and to the point. Avoid extra words.",
  },
  clarity: {
    label: "Clarity",
    description: "Clear and easy to read",
    instructions:
      "Write clear, structured suggestions with simple words so anyone can understand.",
  },
};

export const dailyReportUrlPrefix = "business-compass-daily-report";

export const emptyTaskIssueItem = {
  id: "",
  title: "",
  type: "task" as const,
  status: "pending",
  priority: "",
  created_at: "",
  responsible: null,
  originalData: null,
};

export const statusFilterForGroup: Record<string, string[]> = {
  overdue: ["overdue", "overdued"],
  in_progress: ["in_progress", "started"],
  pending: ["open", "pending"],
  on_hold: ["on_hold"],
  reopened: ["reopen", "reopened"],
};
