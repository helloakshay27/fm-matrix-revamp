export interface CeoDashboardProjectsSummary {
  total: number;
  critical: number;
  at_risk: number;
  healthy: number;
}

export interface CeoDashboardTasksSummary {
  total: number;
  completed: number;
  completion_rate: number;
  overdue: number;
  open: number;
}

export interface CeoDashboardTodosSummary {
  total: number;
  open: number;
  in_progress: number;
  standalone_actions: number;
}

export interface CeoDashboardIssuesSummary {
  total: number;
  open: number;
  reopen: number;
  completed: number;
  closed: number;
}

export interface CeoDashboardMilestonesSummary {
  total: number;
  completed: number;
  completion_rate: number;
  in_progress: number;
  avg_completion_percent: number;
}

export interface CeoDashboardSprintHealthSummary {
  avg_velocity: number;
  real_sprints: number;
  total_sprints: number;
  abandoned_or_test: number;
}

export interface CeoDashboardSummaryBar {
  projects: CeoDashboardProjectsSummary;
  tasks: CeoDashboardTasksSummary;
  todos: CeoDashboardTodosSummary;
  issues: CeoDashboardIssuesSummary;
  milestones: CeoDashboardMilestonesSummary;
  sprint_health: CeoDashboardSprintHealthSummary;
}

export interface CeoDashboardOverallSummaryResponse {
  status: string;
  data: {
    summary_bar: CeoDashboardSummaryBar;
  };
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardWorkTypeStat {
  open: number;
  done: number;
  done_percentage: number;
  overdue: number;
  total: number;
}

export interface CeoDashboardWorkTypeSummary {
  projects: CeoDashboardWorkTypeStat;
  tasks: CeoDashboardWorkTypeStat;
  sub_tasks: CeoDashboardWorkTypeStat;
  todos: CeoDashboardWorkTypeStat;
  issues: CeoDashboardWorkTypeStat;
  blockers_summary: string;
}

export interface CeoDashboardHealthBucket {
  count: number;
  percentage: number;
}

export interface CeoDashboardProjectHealthSplit {
  healthy: CeoDashboardHealthBucket;
  at_risk: CeoDashboardHealthBucket;
  critical: CeoDashboardHealthBucket;
  total: number;
}

export interface CeoDashboardTaskStatusBreakdown {
  open: number;
  in_progress: number;
  done: number;
  overdue: number;
}

export interface CeoDashboardPortfolioHealth {
  work_type_summary: CeoDashboardWorkTypeSummary;
  project_health_split: CeoDashboardProjectHealthSplit;
  task_status_breakdown: CeoDashboardTaskStatusBreakdown;
}

export interface CeoDashboardPortfolioHealthResponse {
  status: string;
  data: CeoDashboardPortfolioHealth;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardOngoingProjects {
  total: number;
  active: number;
  at_risk: number;
  stalled: number;
}

export interface CeoDashboardDeliverableProjects {
  total: number;
  on_track: number;
  at_risk: number;
  critical: number;
}

export interface CeoDashboardInternalProjects {
  total: number;
  healthy: number;
  slow: number;
  idle: number;
}

export interface CeoDashboardProjectTypeClassification {
  ongoing: CeoDashboardOngoingProjects;
  deliverable: CeoDashboardDeliverableProjects;
  internal: CeoDashboardInternalProjects;
}

export interface CeoDashboardProjectTypeClassificationResponse {
  status: string;
  data: CeoDashboardProjectTypeClassification;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardProjectMatrixRow {
  id: number;
  status: string;
  project: string;
  type: string;
  manager: string;
  health_metric: string;
  issues: number;
  last_active: string;
  flag: string;
}

export interface CeoDashboardProjectMatrix {
  matrix: CeoDashboardProjectMatrixRow[];
}

export interface CeoDashboardProjectMatrixResponse {
  status: string;
  data: CeoDashboardProjectMatrix;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardDepartmentScorecardRow {
  department_id: number | null;
  department_name: string;
  people: number;
  open_tasks: number;
  in_progress: number;
  completed: number;
  overdue: number;
  completion_percentage: number;
  overdue_percentage: number;
  health: string;
}

export interface CeoDashboardWarningBox {
  title: string;
  description: string;
}

export interface CeoDashboardDepartmentHealthScorecard {
  scorecard: CeoDashboardDepartmentScorecardRow[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardDepartmentHealthScorecardResponse {
  status: string;
  data: CeoDashboardDepartmentHealthScorecard;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}
