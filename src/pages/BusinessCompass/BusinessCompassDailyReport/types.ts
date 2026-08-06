import type { TransitionProps as MuiTransitionProps } from "@mui/material/transitions";

export interface AttachmentFile {
  id: number;
  document_file_name: string;
  document_content_type: string;
  document_file_size: number;
  document_updated_at: string;
  relation: string;
  relation_id: number;
  active: number;
  changed_by: string | null;
  added_from: string | null;
  comments: string | null;
  url: string;
  document_url: string;
}

export interface DailyReport {
  id: number;
  user_id: number;
  journal_type: string;
  start_date: string;
  end_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  report_data?: {
    kpi?: string;
    total_score?: number;
    is_absent?: boolean;
    absence_reason?: string;
    self_rating?: number;
    sections?: {
      attendance?: number;
      collaboration?: number;
      tasks_completed?: number;
      is_absent?: boolean;
      self_rating?: number;
      kpi_achievement?: number;
      accomplishments?: number;
      tasks_issues_todos?: number;
      planning?: number;
      timing?: number;
    };
    details?: {
      notes?: string | null;
      is_absent?: boolean;
      self_rating?: number;
    };
    accomplishments?: {
      items: { title: string }[];
      attachments: any[];
    };
    tomorrow_plan?: { title: string }[];
    tasks_issues?: any[];
    past_kpis?: {
      kpi_id: number;
      actual_value: number | string;
      target_value: number | string;
      notes: string;
    }[];
  };
  url: string;
  attachments: AttachmentFile[];
  self_rating?: number;
  is_absent?: boolean;
}

export interface AccomplishmentItem {
  id: string;
  text: string;
  completed: boolean;
  starred: boolean;
  fromYesterday?: boolean;
  // Set when this item was pulled in from a reportee's report — the reportee
  // stays the owner of record even though it's submitted inside this report.
  ownerId?: number | string | null;
  ownerName?: string | null;
  // Task / issue / todo reference — row ko Daily tab me clickable banata hai.
  source_id?: number | string | null;
  source_type?: string | null;
  type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  originalData?: any;
}

export interface PlanningItem {
  id: string;
  text: string;
  starred: boolean;
  source_id?: number | null;
  source_type?: string | null;
  type?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  ownerId?: number | string | null;
  ownerName?: string | null;
  fromWeeklyPlan?: boolean;
  originalData?: any;
}

export interface DailyReportDraft {
  reportId?: number | null;
  accomplishments?: AccomplishmentItem[];
  planningItems?: PlanningItem[];
  selfRating?: number[];
  isAbsent?: boolean;
  absenceReason?: string;
  kpiEntries?: { [key: number]: string };
  selectedTasksIssues?: { [key: string]: boolean };
  hiddenAutoIds?: string[];
}

export interface ApplyDraftOptions {
  allowEmptyLists?: boolean;
  // Union with whatever's already in state instead of replacing it, so a stale
  // draft can't silently drop items (e.g. yesterday's carry-over) set moments earlier.
  mergeWithCurrent?: boolean;
}

export interface UploadedFile {
  id: number;
  name: string;
  size: number;
  type: string;
  base64?: string;
  file?: File;
}

export const taskIssueGroupKeys = [
  "overdue",
  "in_progress",
  "pending",
  "on_hold",
  "reopened",
] as const;

export type TaskIssueGroupKey = (typeof taskIssueGroupKeys)[number];

export const taskIssueGroupKeySet = new Set<string>(taskIssueGroupKeys);

export interface TaskIssueGroupConfig {
  key: TaskIssueGroupKey | "from_yesterday";
  label: string;
  statuses: readonly string[];
  colorClass: string;
  bgItem: string;
  headerBg: string;
  pillBg: string;
  showAddToTomorrow: boolean;
  showBulkAdd: boolean;
}

export type TaskIssueType = "task" | "issue" | "todo";

export interface MergedTaskIssueItem {
  id: string;
  title: string;
  type: TaskIssueType;
  status: string;
  priority: string;
  created_at: string;
  responsible: number | null;
  originalData: any;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
}

export interface ReporteeSummary {
  total: number;
  submitted: number;
  missed: number;
}

export interface AiInsight {
  title: string;
  icon: string;
  text: string;
}

export type DailyAiSuggestion =
  | { type: "accomplishments"; item: string }
  | { type: "planning"; item: string }
  | { type: "kpi"; item: string };

export type AiToneKey = "default" | "desi" | "corporate" | "simple" | "clarity";

export interface DailyAiToneStyle {
  label: string;
  description: string;
  instructions: string;
}

export type TaskStatusFilter = "all" | TaskIssueGroupKey;

export type PendingConfirmAction = "play" | "pause";

export interface DailyReportViewProps {
  baseUrl: string;
  token: string;
}

export type TransitionProps = MuiTransitionProps & {
  children: React.ReactElement;
};
