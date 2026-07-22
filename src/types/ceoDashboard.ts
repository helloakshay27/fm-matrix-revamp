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

export interface CeoDashboardSprintRow {
  id: number;
  name: string;
  status: string;
  overrun: string;
  action: string;
  completion_percentage: string;
}

export interface CeoDashboardActiveSprint {
  id: number;
  name: string;
  owner: string;
  start_date: string;
  end_date: string;
  status: string;
  tasks_done: number;
  tasks_total: number;
  completion_percentage: number;
  overrun_days: number;
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardSprintHealthSummaryCards {
  abandoned_test: number;
  active_sprints: number;
  completed: number;
}

export interface CeoDashboardSprintHealthDetailed {
  top_warning: string;
  summary_cards: CeoDashboardSprintHealthSummaryCards;
  active_sprints: CeoDashboardActiveSprint[];
  sprint_history: CeoDashboardSprintRow[];
  bottom_warning: CeoDashboardWarningBox;
}

export interface CeoDashboardSprintHealthDetailedResponse {
  status: string;
  data: CeoDashboardSprintHealthDetailed;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardLongestRunningProject {
  [key: string]: unknown;
}

export interface CeoDashboardDeadlineCoverage {
  no_end_date_count: number;
  no_end_date_percentage: number;
  have_end_date_count: number;
  have_end_date_percentage: number;
  avg_completion: number;
  longest_running_projects: CeoDashboardLongestRunningProject[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardMilestoneStatusStat {
  status: string;
  count: number;
  avg_completion: number;
}

export interface CeoDashboardMilestoneHealth {
  chart_data: CeoDashboardMilestoneStatusStat[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardDeliveryAccountability {
  deadline_coverage: CeoDashboardDeadlineCoverage;
  milestone_health: CeoDashboardMilestoneHealth;
}

export interface CeoDashboardDeliveryAccountabilityResponse {
  status: string;
  data: CeoDashboardDeliveryAccountability;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardZeroActivityProject {
  name: string;
  subtitle: string;
  days_since_last_activity: number;
}

export interface CeoDashboardLowActivityProject {
  name: string;
  subtitle: string;
  days_since_last_task: number;
}

export interface CeoDashboardZeroActivity {
  title: string;
  projects: CeoDashboardZeroActivityProject[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardLowActivity {
  title: string;
  projects: CeoDashboardLowActivityProject[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardProjectInactivityAlert {
  zero_activity: CeoDashboardZeroActivity;
  low_activity: CeoDashboardLowActivity;
}

export interface CeoDashboardProjectInactivityAlertResponse {
  status: string;
  data: CeoDashboardProjectInactivityAlert;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardBacklogSummaryBar {
  avg_created_per_week: number;
  avg_completed_per_week: number;
  net_growth_per_week: number;
  net_growth_trend_text: string;
  net_growth_percentage: number;
}

export interface CeoDashboardMetricItem {
  label: string;
  value: string;
}

export interface CeoDashboardCreatedVsCompletedPoint {
  week: string;
  created: number;
  completed: number;
}

export interface CeoDashboardCreatedVsCompletedPanel {
  title: string;
  chart_data: CeoDashboardCreatedVsCompletedPoint[];
  metrics: {
    anomaly: CeoDashboardMetricItem;
    open_tasks: CeoDashboardMetricItem;
    overdue_tasks: CeoDashboardMetricItem;
  };
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardVelocityPoint {
  week: string;
  completed: number;
  target: number;
}

export interface CeoDashboardVelocityPanel {
  title: string;
  chart_data: CeoDashboardVelocityPoint[];
  metrics: {
    best_week: CeoDashboardMetricItem;
    avg_completion: CeoDashboardMetricItem;
    trend_direction: CeoDashboardMetricItem;
    target_to_clear: CeoDashboardMetricItem;
  };
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardBacklogAndIssues {
  summary_bar: CeoDashboardBacklogSummaryBar;
  created_vs_completed_panel: CeoDashboardCreatedVsCompletedPanel;
  weekly_completion_velocity_panel: CeoDashboardVelocityPanel;
}

export interface CeoDashboardBacklogAndIssuesResponse {
  status: string;
  data: CeoDashboardBacklogAndIssues;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardIssueResolutionSummary {
  total_issues: number;
  open_issues: number;
  reopened_issues: number;
}

export interface CeoDashboardAvgDaysPoint {
  month: string;
  avg_days: number;
}

export interface CeoDashboardAvgDaysToResolvePanel {
  title: string;
  chart_data: CeoDashboardAvgDaysPoint[];
  metrics: {
    avg_resolution_time_this_month: CeoDashboardMetricItem;
    fastest_resolution: CeoDashboardMetricItem;
    slowest_resolution: CeoDashboardMetricItem;
    issues_open_30_plus_days: CeoDashboardMetricItem;
  };
}

export interface CeoDashboardEscalationBucket {
  bucket: string;
  count: number;
}

export interface CeoDashboardEscalationRiskPanel {
  title: string;
  chart_data: CeoDashboardEscalationBucket[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardIssueTypeStat {
  type: string;
  count: number;
}

export interface CeoDashboardIssueSource {
  source: string;
  count: number;
}

export interface CeoDashboardIssuesByTypePanel {
  title: string;
  chart_data: CeoDashboardIssueTypeStat[];
  warning_box: CeoDashboardWarningBox;
  top_issue_sources: CeoDashboardIssueSource[];
}

export interface CeoDashboardOverdueProjectStat {
  project: string;
  count: number;
}

export interface CeoDashboardReopenedIssue {
  [key: string]: unknown;
}

export interface CeoDashboardOverdueTasksReopenedIssuesPanel {
  title: string;
  chart_data: CeoDashboardOverdueProjectStat[];
  warning_box: CeoDashboardWarningBox;
  reopened_issues: CeoDashboardReopenedIssue[];
}

export interface CeoDashboardIssueResolution {
  summary: CeoDashboardIssueResolutionSummary;
  avg_days_to_resolve_panel: CeoDashboardAvgDaysToResolvePanel;
  issues_open_30_plus_escalation_risk_panel: CeoDashboardEscalationRiskPanel;
  issues_by_type_top_sources_panel: CeoDashboardIssuesByTypePanel;
  overdue_tasks_reopened_issues_panel: CeoDashboardOverdueTasksReopenedIssuesPanel;
}

export interface CeoDashboardIssueResolutionResponse {
  status: string;
  data: CeoDashboardIssueResolution;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardMomConductedPoint {
  month: string;
  full_month: string;
  count: number;
}

export interface CeoDashboardMomConductedPanel {
  title: string;
  chart_data: CeoDashboardMomConductedPoint[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardMomStatusStat {
  status: string;
  count: number;
  percentage: number;
}

export interface CeoDashboardMomStatusBreakdownPanel {
  title: string;
  chart_data: CeoDashboardMomStatusStat[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardMomFollowThroughMetrics {
  action_items_raised_total: number;
  completed: number;
  no_status_lost: number;
}

export interface CeoDashboardMomFollowThroughPanel {
  title: string;
  completion_rate_text: string;
  badge: string;
  completion_percentage: number;
  metrics: CeoDashboardMomFollowThroughMetrics;
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardMomEffectiveness {
  mom_conducted_panel: CeoDashboardMomConductedPanel;
  status_breakdown_panel: CeoDashboardMomStatusBreakdownPanel;
  follow_through_panel: CeoDashboardMomFollowThroughPanel;
}

export interface CeoDashboardMomEffectivenessResponse {
  status: string;
  data: CeoDashboardMomEffectiveness;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardExecutionScore {
  score: number;
  out_of: number;
  label: string;
  factors: string;
}

export interface CeoDashboardTaskCompletion {
  percentage: number;
  completed: number;
  total: number;
}

export interface CeoDashboardOverdueRate {
  percentage: number;
  overdue: number;
  total: number;
}

export interface CeoDashboardEstimationCoverage {
  percentage: number;
  with_hours: number;
  total: number;
}

export interface CeoDashboardMomFollowThrough {
  percentage: number;
  followed: number;
  total: number;
}

export interface CeoDashboardProcessGap {
  recurring_count: number;
  total: number;
  percentage: number;
  message: string;
}

export interface CeoDashboardEfficiencyOverview {
  execution_score: CeoDashboardExecutionScore;
  task_completion: CeoDashboardTaskCompletion;
  avg_cycle_time_days: number;
  overdue_rate: CeoDashboardOverdueRate;
  estimation_coverage: CeoDashboardEstimationCoverage;
  mom_follow_through: CeoDashboardMomFollowThrough;
  process_gap: CeoDashboardProcessGap;
}

export interface CeoDashboardEfficiencyOverviewResponse {
  status: string;
  data: CeoDashboardEfficiencyOverview;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardOverdueOwner {
  rank: number;
  name: string;
  overdue_count: number;
}

export interface CeoDashboardTopOverdueOwners {
  title: string;
  owners: CeoDashboardOverdueOwner[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardZeroWorkPerson {
  name: string;
  initials: string;
  department: string;
  badge: string;
}

export interface CeoDashboardZeroWork {
  title: string;
  description: string;
  people: CeoDashboardZeroWorkPerson[];
}

export interface CeoDashboardZeroVelocityPerson {
  name: string;
  initials: string;
  department: string;
  tasks_assigned: number;
  open_tasks: number;
  todos: number;
  issues: number;
  completed_this_month: number;
  badge: string;
  subtitle: string;
}

export interface CeoDashboardZeroVelocity {
  title: string;
  description: string;
  people: CeoDashboardZeroVelocityPerson[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardWorkHolder {
  name: string;
  open_tasks: number;
  percentage: number;
  risk: string;
}

export interface CeoDashboardRestOfTeam {
  label: string;
  percentage: number;
  risk: string;
}

export interface CeoDashboardConcentrationChartPoint {
  name: string;
  percentage: number;
}

export interface CeoDashboardWorkConcentrationRisk {
  title: string;
  description: string;
  top_holders: CeoDashboardWorkHolder[];
  rest_of_team: CeoDashboardRestOfTeam;
  chart_data: CeoDashboardConcentrationChartPoint[];
  total_open_tasks: number;
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardPeopleAlerts {
  top_overdue_owners: CeoDashboardTopOverdueOwners;
  zero_work: CeoDashboardZeroWork;
  zero_velocity: CeoDashboardZeroVelocity;
  work_concentration_risk: CeoDashboardWorkConcentrationRisk;
}

export interface CeoDashboardPeopleAlertsResponse {
  status: string;
  data: CeoDashboardPeopleAlerts;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardEffortChartPoint {
  name: string;
  estimated_hrs: number;
  actual_hrs: number;
}

export interface CeoDashboardEffortOutlier {
  user_id: number;
  name: string;
  estimated_hrs: number;
  actual_hrs: number;
  diff: number;
  diff_label: string;
  badge: string;
}

export interface CeoDashboardEffortAccuracy {
  title: string;
  chart_data: CeoDashboardEffortChartPoint[];
  outliers: CeoDashboardEffortOutlier[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardOverdueAgeBucket {
  bucket: string;
  count: number;
  percentage: number;
}

export interface CeoDashboardOverdueTrendPoint {
  label: string;
  count: number;
}

export interface CeoDashboardOverdueTrendPanel {
  title: string;
  chart_data: CeoDashboardOverdueTrendPoint[];
  warning_box: CeoDashboardWarningBox;
}

export interface CeoDashboardOverdueAgeTrend {
  title: string;
  total_overdue: number;
  age_buckets: CeoDashboardOverdueAgeBucket[];
  trend_panel: CeoDashboardOverdueTrendPanel;
}

export interface CeoDashboardEffortAndOverdue {
  effort_accuracy: CeoDashboardEffortAccuracy;
  overdue_age_trend: CeoDashboardOverdueAgeTrend;
}

export interface CeoDashboardEffortAndOverdueResponse {
  status: string;
  data: CeoDashboardEffortAndOverdue;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardAgeingBuckets {
  bucket_1_day: number;
  bucket_2_7_days: number;
  bucket_8_15_days: number;
  bucket_16_30_days: number;
  bucket_30_plus_days: number;
  total_overdue: number;
}

export interface CeoDashboardAgeingRow extends CeoDashboardAgeingBuckets {
  user_id: number;
  name: string;
}

export interface CeoDashboardAgeingOthers extends CeoDashboardAgeingBuckets {
  label: string;
  person_count: number;
}

export interface CeoDashboardPersonWiseAgeingMatrix {
  title: string;
  description: string;
  rows: CeoDashboardAgeingRow[];
  others: CeoDashboardAgeingOthers;
  grand_total: CeoDashboardAgeingBuckets;
}

export interface CeoDashboardPersonWiseAgeingMatrixResponse {
  status: string;
  data: CeoDashboardPersonWiseAgeingMatrix;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}

export interface CeoDashboardPersonTaskStats {
  open: number;
  in_progress: number;
  done: number;
  overdue: number;
}

export interface CeoDashboardPersonTodoStats {
  open: number;
  done: number;
  overdue: number;
}

export interface CeoDashboardPersonIssueStats {
  open: number;
}

export interface CeoDashboardPersonDoneRecently {
  count: number;
  type: string;
  title: string;
  completed_at: string;
}

export interface CeoDashboardPersonOverdueItem {
  type: string;
  title: string;
  due_date: string;
}

export interface CeoDashboardBreakdownMember {
  user_id: number;
  name: string;
  department: string;
  status_indicator: string;
  tasks: CeoDashboardPersonTaskStats;
  todos: CeoDashboardPersonTodoStats;
  issues: CeoDashboardPersonIssueStats;
  done_recently: CeoDashboardPersonDoneRecently | null;
  top_overdue: CeoDashboardPersonOverdueItem[];
}

export interface CeoDashboardBreakdownDepartment {
  department_name: string;
  member_count: number;
  members: CeoDashboardBreakdownMember[];
}

export interface CeoDashboardPerPersonBreakdown {
  departments: CeoDashboardBreakdownDepartment[];
}

export interface CeoDashboardPerPersonBreakdownResponse {
  status: string;
  data: CeoDashboardPerPersonBreakdown;
  meta: {
    filters_applied: Record<string, string>;
    generated_at: string;
  };
}
