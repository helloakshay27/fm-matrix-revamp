// FM Dashboard analytics API — one file for all 11 module sections
// (Tickets, Assets, Audit, AMC, Checklists, Inventory, Waste, Attendance,
// Survey, Vendor, Safety) instead of one file per module, so the whole
// /fm_dashboard/* surface lives in a single place.
//
// Base URL and auth are always resolved dynamically via apiConfig (getFullUrl,
// getAuthenticatedFetchOptions) — never hardcode a host here. Endpoint shape:
// GET {baseUrl}/fm_dashboard/{module}/{endpoint}?site_id=<comma-list>&from_date=YYYY-MM-DD&to_date=YYYY-MM-DD
// -> { success, message, <endpoint_key>: {...}, filters: {...} }
import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

// ============================================================================
// Shared
// ============================================================================

export interface FmDashboardFilters {
  site_ids: number[];
  site_names: string[];
  from_date: string | null;
  to_date: string | null;
}

export interface FmDashboardParams {
  /** Site IDs the current user is allowed to see — fetched from /pms/sites/allowed_sites.json. */
  siteIds: (number | string)[];
  /** yyyy-mm-dd */
  fromDate?: string;
  /** yyyy-mm-dd */
  toDate?: string;
}

function buildFmDashboardQuery({ siteIds, fromDate, toDate }: FmDashboardParams): string {
  const params = new URLSearchParams();
  if (siteIds.length) params.set("site_id", siteIds.join(","));
  if (fromDate) params.set("from_date", fromDate);
  if (toDate) params.set("to_date", toDate);
  return params.toString();
}

export async function fetchFmDashboardJson<T>(endpoint: string, params: FmDashboardParams): Promise<T> {
  const qs = buildFmDashboardQuery(params);
  const url = `${getFullUrl(endpoint)}${qs ? `?${qs}` : ""}`;
  const response = await fetch(url, getAuthenticatedFetchOptions("GET"));
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`FM dashboard request failed (${response.status}) for ${endpoint}: ${body}`);
  }
  return response.json() as Promise<T>;
}

// ============================================================================
// Tickets
// ============================================================================

export type TicketsDashboardFilters = FmDashboardFilters;
export type TicketsDashboardParams = FmDashboardParams;

export interface TicketsOverviewData {
  kpis: {
    golden_open: number;
    red_flag_open: number;
    golden_avg_age_days: number;
    site_wide_avg_age_days: string;
    response_sla: {
      percent: string;
      breached_percent: string;
      resolution_percent: string;
    };
    customer_tickets: number;
    internal_tickets: number;
  };
  pool_composition: {
    total: number;
    pending: number;
    in_progress: number;
    on_hold: number;
    closed: number;
  };
}

export interface TicketCategoryBreakdown {
  category_type_id: number;
  name: string;
  total: number;
  status_breakdown: {
    pending: number;
    in_progress: number;
    on_hold: number;
    closed: number;
  };
  tat_breach_percent: number;
  vs_last_month_percent: number | null;
  avg_ageing_days: string;
}

export interface TicketUserBreakdown {
  user_id: number;
  name: string;
  ticket_count: number;
}

export interface TicketDepartmentBreakdown {
  department_id?: number;
  name: string;
  ticket_count: number;
}

export interface TicketLocationBreakdown {
  tower_id: number;
  name: string;
  ticket_count: number;
}

export interface TicketSourceBreakdown {
  source: string;
  ticket_count: number;
}

export interface TicketsBreakdownData {
  by_category: TicketCategoryBreakdown[];
  by_user: TicketUserBreakdown[];
  by_department: TicketDepartmentBreakdown[];
  by_location: TicketLocationBreakdown[];
  by_source: TicketSourceBreakdown[];
}

export interface TicketTechnicianWorkload {
  user_id: number;
  name: string;
  open_ticket_count: number;
}

// Response shape for populated rows isn't confirmed against live data (the API
// returned an empty array at integration time) — keyed defensively so several
// plausible field names are accepted once real rows appear.
export interface TicketGoldenRedFlagPerson {
  user_id?: number;
  name?: string;
  user_name?: string;
  golden_avg_age_days?: number | string;
  red_flag_avg_age_days?: number | string;
  golden?: number | string;
  red_flag?: number | string;
  [key: string]: unknown;
}

export interface TicketsWorkforceData {
  technician_workload: {
    team_avg_open_tickets: number;
    data: TicketTechnicianWorkload[];
  };
  golden_red_flag_by_person: {
    site_wide_avg_age_days: string;
    data: TicketGoldenRedFlagPerson[];
  };
}

// Shape for populated rows isn't confirmed against live data (empty at
// integration time) — kept defensive for the same reason as above.
export interface TicketRepeatComplaint {
  issue?: string;
  tenant?: string;
  description?: string;
  count?: number;
  ticket_count?: number;
  [key: string]: unknown;
}

export interface TicketAssetLinked {
  pms_asset_id: number;
  name: string;
  ticket_count: number;
}

export interface TicketsQualityData {
  repeat_complaints: TicketRepeatComplaint[];
  asset_linked_tickets: {
    total_tickets: number;
    repeat_offender_asset_count: number;
    assets: TicketAssetLinked[];
  };
}

export interface TicketVolumeHeatmap {
  days: string[];
  hours: number[];
  data: number[][];
}

export interface TicketPeakHour {
  hour: number;
  ticket_count: number;
}

export interface TicketsTrendsData {
  volume_heatmap: TicketVolumeHeatmap;
  peak_hours: TicketPeakHour[];
  first_reply_vs_resolution: {
    data: { month: string; avg_reply_hrs: string | number; avg_resolution_days: string | number | null }[];
  };
  sla_breach: {
    total_breaches: number;
    total_tickets: number;
    percent_of_all_tickets: number;
    data: { month: string; breach_count: number }[];
  };
  resolved_by_age_tier: { tier: string; count: number }[];
  unresolved_by_age_tier: { tier: string; count: number }[];
}

interface TicketsOverviewResponse {
  success: number;
  message: string;
  tickets_overview: TicketsOverviewData;
  filters: TicketsDashboardFilters;
}
interface TicketsBreakdownResponse {
  success: number;
  message: string;
  tickets_breakdown: TicketsBreakdownData;
  filters: TicketsDashboardFilters;
}
interface TicketsWorkforceResponse {
  success: number;
  message: string;
  tickets_workforce: TicketsWorkforceData;
  filters: TicketsDashboardFilters;
}
interface TicketsQualityResponse {
  success: number;
  message: string;
  tickets_quality: TicketsQualityData;
  filters: TicketsDashboardFilters;
}
interface TicketsTrendsResponse {
  success: number;
  message: string;
  tickets_trends: TicketsTrendsData;
  filters: TicketsDashboardFilters;
}

export interface TicketsByTenantRow {
  entity_id: number;
  name: string;
  ticket_count: number;
}

export interface TicketsCsatData {
  score: number | null;
  scale_max: number;
  rated_tickets: number;
  distribution: { rating: number; count: number }[];
}

export interface TicketsApproachingEscalationData {
  threshold_hours: number;
  count: number;
  response_due: number;
  resolution_due: number;
}

export interface TicketsCategoryComparisonRow {
  category_type_id: number;
  name: string;
  total: number;
  status_count: { pending: number; in_progress: number; on_hold: number; closed: number };
  status_percent: { pending: number; in_progress: number; on_hold: number; closed: number };
}

const TICKETS_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/tickets/tickets_overview.json",
  TRENDS: "/fm_dashboard/tickets/tickets_trends.json",
  BREAKDOWN: "/fm_dashboard/tickets/tickets_breakdown.json",
  WORKFORCE: "/fm_dashboard/tickets/tickets_workforce.json",
  QUALITY: "/fm_dashboard/tickets/tickets_quality.json",
  BY_TENANT: "/fm_dashboard/tickets/tickets_by_tenant.json",
  CSAT: "/fm_dashboard/tickets/tickets_csat.json",
  APPROACHING_ESCALATION: "/fm_dashboard/tickets/tickets_approaching_escalation.json",
  CATEGORY_COMPARISON: "/fm_dashboard/tickets/tickets_category_comparison.json",
} as const;

export const fetchTicketsOverview = (params: TicketsDashboardParams) =>
  fetchFmDashboardJson<TicketsOverviewResponse>(TICKETS_ENDPOINTS.OVERVIEW, params).then((res) => res.tickets_overview);

export const fetchTicketsTrends = (params: TicketsDashboardParams) =>
  fetchFmDashboardJson<TicketsTrendsResponse>(TICKETS_ENDPOINTS.TRENDS, params).then((res) => res.tickets_trends);

export const fetchTicketsBreakdown = (params: TicketsDashboardParams) =>
  fetchFmDashboardJson<TicketsBreakdownResponse>(TICKETS_ENDPOINTS.BREAKDOWN, params).then((res) => res.tickets_breakdown);

export const fetchTicketsWorkforce = (params: TicketsDashboardParams) =>
  fetchFmDashboardJson<TicketsWorkforceResponse>(TICKETS_ENDPOINTS.WORKFORCE, params).then((res) => res.tickets_workforce);

export const fetchTicketsQuality = (params: TicketsDashboardParams) =>
  fetchFmDashboardJson<TicketsQualityResponse>(TICKETS_ENDPOINTS.QUALITY, params).then((res) => res.tickets_quality);

export const fetchTicketsByTenant = (params: TicketsDashboardParams) =>
  fetchFmDashboardJson<{ tickets_by_tenant: TicketsByTenantRow[] }>(TICKETS_ENDPOINTS.BY_TENANT, params).then(
    (res) => res.tickets_by_tenant ?? []
  );

export const fetchTicketsCsat = (params: TicketsDashboardParams) =>
  fetchFmDashboardJson<{ tickets_csat: TicketsCsatData }>(TICKETS_ENDPOINTS.CSAT, params).then((res) => res.tickets_csat);

export const fetchTicketsApproachingEscalation = (params: TicketsDashboardParams) =>
  fetchFmDashboardJson<{ tickets_approaching_escalation: TicketsApproachingEscalationData }>(
    TICKETS_ENDPOINTS.APPROACHING_ESCALATION,
    params
  ).then((res) => res.tickets_approaching_escalation);

export const fetchTicketsCategoryComparison = (params: TicketsDashboardParams) =>
  fetchFmDashboardJson<{ tickets_category_comparison: TicketsCategoryComparisonRow[] }>(
    TICKETS_ENDPOINTS.CATEGORY_COMPARISON,
    params
  ).then((res) => res.tickets_category_comparison ?? []);

// ============================================================================
// Assets
// ============================================================================

export interface AssetTopDown {
  pms_asset_id: number;
  name: string;
  location: string;
  hours_down: number | null;
}

export interface AssetsOverviewData {
  total_assets: number;
  condition: {
    good: number;
    fair: number;
    bad: number;
    equipment_health_score: number;
  };
  replacement_due_count: number;
  asset_health: {
    total: number;
    breakdown_rate_percent: number;
    in_use: number;
    breakdown: number;
    allocated: number;
    in_store: number;
    disposed: number;
    unclassified: number;
  };
  top_currently_down: AssetTopDown[];
  breakdown_rate_vs_range?: {
    current_percent: number;
    healthy_min_percent: number;
    healthy_max_percent: number;
    status: string;
  };
}

export interface AssetsConditionData {
  critical_vs_noncritical_breakdown: {
    critical: { total: number; breakdown_percent: number };
    non_critical: { total: number; breakdown_percent: number };
  };
  amc_coverage: {
    covered_count: number;
    uncovered_count: number;
    covered_percent: number;
  };
}

export interface AssetCategoryTotal {
  pms_asset_group_id: number;
  name: string;
  total: number;
}

export interface AssetCategoryBreakdownCount {
  pms_asset_group_id: number;
  name: string;
  breakdown_count: number;
}

export interface AssetCategoryCost {
  pms_asset_group_id: number;
  name: string;
  total_cost: number;
}

export interface AssetAllocationBreakdown {
  allocation_type: string;
  total: number;
  breakdown_count: number;
  breakdown_rate_percent: number;
}

export interface AssetsCategoryData {
  total_portfolio_value: number;
  category_wise_breakdown: AssetCategoryTotal[];
  breakdowns_by_category: AssetCategoryBreakdownCount[];
  cost_by_category: AssetCategoryCost[];
  breakdowns_by_allocation: AssetAllocationBreakdown[];
  broken_allocated_to_others_count?: number;
  subgroup_wise_breakdown?: AssetSubgroupBreakdown[];
}

export interface AssetSubgroupBreakdown {
  pms_asset_sub_group_id: number;
  name: string;
  total: number;
  breakdown_count: number;
}

export interface AssetHighMaintenanceCost {
  pms_asset_id: number;
  name: string;
  total_repair_cost: number;
  purchase_cost: number;
  repair_cost_ratio_percent: number | null;
}

export interface AssetRepeatOffender {
  pms_asset_id: number;
  name: string;
  breakdown_count: number;
  mtbf_days: number;
}

export interface AssetsMaintenanceData {
  mttr: { hours: string | number; minutes: string | number };
  mtbf: { days: number };
  // Shape unconfirmed against live data (returned empty at integration time).
  repair_cost_vs_asset_value: Record<string, unknown>[];
  high_maintenance_cost_assets: AssetHighMaintenanceCost[];
  top_repeat_offenders: AssetRepeatOffender[];
  asset_ownership_cost?: AssetOwnershipCost[];
}

export interface AssetOwnershipCost {
  pms_asset_id: number;
  name: string;
  repair_cost: number;
  amc_cost: number;
  total_cost: number;
}

interface AssetsOverviewResponse {
  success: number;
  message: string;
  assets_overview: AssetsOverviewData;
  filters: FmDashboardFilters;
}
interface AssetsConditionResponse {
  success: number;
  message: string;
  assets_condition: AssetsConditionData;
  filters: FmDashboardFilters;
}
interface AssetsCategoryResponse {
  success: number;
  message: string;
  assets_category: AssetsCategoryData;
  filters: FmDashboardFilters;
}
interface AssetsMaintenanceResponse {
  success: number;
  message: string;
  assets_maintenance: AssetsMaintenanceData;
  filters: FmDashboardFilters;
}

const ASSETS_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/assets/assets_overview",
  CONDITION: "/fm_dashboard/assets/assets_condition",
  CATEGORY: "/fm_dashboard/assets/assets_category",
  MAINTENANCE: "/fm_dashboard/assets/assets_maintenance",
} as const;

export const fetchAssetsOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AssetsOverviewResponse>(ASSETS_ENDPOINTS.OVERVIEW, params).then((res) => res.assets_overview);

export const fetchAssetsCondition = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AssetsConditionResponse>(ASSETS_ENDPOINTS.CONDITION, params).then((res) => res.assets_condition);

export const fetchAssetsCategory = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AssetsCategoryResponse>(ASSETS_ENDPOINTS.CATEGORY, params).then((res) => res.assets_category);

export const fetchAssetsMaintenance = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AssetsMaintenanceResponse>(ASSETS_ENDPOINTS.MAINTENANCE, params).then((res) => res.assets_maintenance);

// ============================================================================
// Audit
// ============================================================================
// Note: against a typical site scope this data is sparse (see FM_Dashboard_All_APIs_Curls.md —
// only a handful of audit records exist system-wide, and date-filtering excludes records with no
// start_date), so several of these arrays are frequently empty in practice.

export interface AuditByType {
  audit_type: string;
  total: number;
  completed: number;
  completion_percent: number;
}

export interface AuditsOverviewData {
  total_audits: number;
  audit_score_percent: number;
  status_breakdown: {
    scheduled: number;
    in_progress: number;
    paused: number;
    completed: number;
    overdue: number;
    closed: number;
    cancelled: number;
  };
  by_type: AuditByType[];
}

export interface AuditCompletionRow {
  audit_id: number;
  name: string;
  status: string;
  applicable_total: number;
  found_count: number;
  missing_count: number;
  completion_percent: number;
}

export interface AuditsAssetComplianceData {
  total_assets: number;
  missing_assets_detected: number;
  assets_missing_documentation: number;
  qr_barcode_compliance: {
    compliant_count: number;
    compliance_percent: number;
  };
  audit_completion: AuditCompletionRow[];
}

export interface AuditExecutionConcentrationRow {
  user_id: number;
  name: string;
  audits_count: number;
  share_percent: number;
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface AuditStalledRow {
  audit_id?: number;
  name?: string;
  assigned_to?: string;
  days_stalled?: number;
  [key: string]: unknown;
}

export interface AuditsExecutionData {
  avg_audit_duration_hours: number;
  stalled_audits: AuditStalledRow[];
  execution_concentration: AuditExecutionConcentrationRow[];
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface AuditFindingsBySite {
  site_id?: number;
  site_name?: string;
  findings_count?: number;
  [key: string]: unknown;
}

export interface AuditRepositoryRow {
  audit_type: string;
  total: number;
  completed: number;
}

export interface AuditsFindingsData {
  findings_by_site: AuditFindingsBySite[];
  repository: AuditRepositoryRow[];
}

interface AuditsOverviewResponse {
  success: number;
  message: string;
  audits_overview: AuditsOverviewData;
  filters: FmDashboardFilters;
}
interface AuditsAssetComplianceResponse {
  success: number;
  message: string;
  audits_asset_compliance: AuditsAssetComplianceData;
  filters: FmDashboardFilters;
}
interface AuditsExecutionResponse {
  success: number;
  message: string;
  audits_execution: AuditsExecutionData;
  filters: FmDashboardFilters;
}
interface AuditsFindingsResponse {
  success: number;
  message: string;
  audits_findings: AuditsFindingsData;
  filters: FmDashboardFilters;
}

const AUDIT_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/audits/audits_overview",
  ASSET_COMPLIANCE: "/fm_dashboard/audits/audits_asset_compliance",
  EXECUTION: "/fm_dashboard/audits/audits_execution",
  FINDINGS: "/fm_dashboard/audits/audits_findings",
} as const;

export const fetchAuditsOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AuditsOverviewResponse>(AUDIT_ENDPOINTS.OVERVIEW, params).then((res) => res.audits_overview);

export const fetchAuditsAssetCompliance = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AuditsAssetComplianceResponse>(AUDIT_ENDPOINTS.ASSET_COMPLIANCE, params).then(
    (res) => res.audits_asset_compliance
  );

export const fetchAuditsExecution = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AuditsExecutionResponse>(AUDIT_ENDPOINTS.EXECUTION, params).then((res) => res.audits_execution);

export const fetchAuditsFindings = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AuditsFindingsResponse>(AUDIT_ENDPOINTS.FINDINGS, params).then((res) => res.audits_findings);

// ============================================================================
// AMC
// ============================================================================

export interface AmcOverviewData {
  total_contracts: number;
  health: {
    active: number;
    expired: number;
    flagged: number;
    never_serviced: number;
    upcoming_visits_30d: number;
    due_missed_visits: number;
  };
  /**
   * Newer API: one row per contract type, e.g. [{ amc_type: "Asset", count: 27807 }].
   * Older API: { asset_contracts, service_contracts }. Both are still seen in the wild.
   */
  contract_split: AmcContractSplitRow[] | { asset_contracts?: number; service_contracts?: number };
  cost: {
    total_amc_value: number;
    cost_at_risk_percent: number;
  };
  frequency_wise_visits?: {
    sample_size: number;
    data: AmcFrequencyVisitRow[];
  };
}

export interface AmcContractSplitRow {
  amc_type: string;
  count: number;
}

export interface AmcFrequencyVisitRow {
  frequency: string;
  contracts: number;
  expected_visits: number;
  completed_visits: number;
}

/** One row per contract — bucketed client-side from days_to_expiry. */
export interface AmcExpiryUrgencyRow {
  id?: number;
  contract_name?: string | null;
  amc_end_date?: string | null;
  days_to_expiry: number | null;
  criticality: string;
  /** Older API shape: rows were pre-aggregated per bucket instead of per contract. */
  expiry_bucket?: string;
  count?: number;
}

export interface AmcExpiryData {
  expiry_timeline: {
    expired: number;
    expiring_0_30: number;
    expiring_31_90: number;
    active_90_plus: number;
    today?: string;
    without_expiry_date?: number;
  };
  urgency_vs_criticality: AmcExpiryUrgencyRow[];
}

export interface AmcVendorConcentrationRow {
  supplier_id?: number;
  vendor_name: string;
  total_contracts: number;
  expired_contracts: number;
  contracts_with_missed_visit: number;
  missed_or_expired_percent: number;
}

export interface AmcMonthlyCost {
  month: string;
  total_cost: number;
}

export interface AmcVendorStatusContract {
  contract_name: string | null;
  amc_start_date: string | null;
  amc_end_date: string | null;
  amc_cost: number | null;
  status: string;
  completed_visits: number;
  missed_visits: number;
}

export interface AmcVendorStatusRow {
  vendor_name: string;
  total_contracts: number;
  missed_visits: number;
  contracts: AmcVendorStatusContract[];
}

export interface AmcVendorData {
  vendor_concentration: AmcVendorConcentrationRow[];
  monthly_cost_trend: AmcMonthlyCost[];
  vendor_status?: AmcVendorStatusRow[];
}

export interface AmcCoverageByCategory {
  pms_asset_group_id: number;
  name: string;
  total: number;
  covered: number;
  coverage_percent: number;
}

export interface AmcCoverageData {
  critical_assets_without_amc: number;
  high_pending_service_calls: number;
  coverage_by_category: AmcCoverageByCategory[];
}

interface AmcOverviewResponse {
  success: number;
  message: string;
  amc_overview: AmcOverviewData;
  filters: FmDashboardFilters;
}
interface AmcExpiryResponse {
  success: number;
  message: string;
  amc_expiry: AmcExpiryData;
  filters: FmDashboardFilters;
}
interface AmcVendorResponse {
  success: number;
  message: string;
  amc_vendor: AmcVendorData;
  filters: FmDashboardFilters;
}
interface AmcCoverageResponse {
  success: number;
  message: string;
  amc_coverage: AmcCoverageData;
  filters: FmDashboardFilters;
}

const AMC_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/amc/amc_overview",
  EXPIRY: "/fm_dashboard/amc/amc_expiry",
  VENDOR: "/fm_dashboard/amc/amc_vendor",
  COVERAGE: "/fm_dashboard/amc/amc_coverage",
} as const;

export const fetchAmcOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AmcOverviewResponse>(AMC_ENDPOINTS.OVERVIEW, params).then((res) => res.amc_overview);

export const fetchAmcExpiry = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AmcExpiryResponse>(AMC_ENDPOINTS.EXPIRY, params).then((res) => res.amc_expiry);

export const fetchAmcVendor = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AmcVendorResponse>(AMC_ENDPOINTS.VENDOR, params).then((res) => res.amc_vendor);

export const fetchAmcCoverage = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AmcCoverageResponse>(AMC_ENDPOINTS.COVERAGE, params).then((res) => res.amc_coverage);

// ============================================================================
// Checklists
// ============================================================================

export interface ChecklistStatusBreakdown {
  scheduled: number;
  open: number;
  work_in_progress: number;
  overdue: number;
  closed: number;
}

export interface ChecklistScheduleTypeBreakdown {
  schedule_type: string;
  total: number;
  closure_rate_percent: number;
  status: ChecklistStatusBreakdown;
}

export interface ChecklistExecutionBreakdown {
  execution: string;
  total: number;
  closure_rate_percent: number;
  status: ChecklistStatusBreakdown;
}

export interface ChecklistsOverviewData {
  total: number;
  closure_rate_percent: number;
  status_breakdown: ChecklistStatusBreakdown;
  schedule_type_breakdown: ChecklistScheduleTypeBreakdown[];
  category_split: { technical: number; non_technical: number };
  execution_breakdown: ChecklistExecutionBreakdown[];
}

export interface ChecklistSiteWiseCompliance {
  pms_site_id: number;
  site_name: string;
  total: number;
  closed: number;
  compliance_percent: number;
}

export interface ChecklistTopCompleted {
  form_name: string;
  completed_count: number;
}

export interface ChecklistsComplianceData {
  site_wise_compliance: ChecklistSiteWiseCompliance[];
  top_completed: ChecklistTopCompleted[];
  weightage_scoring: {
    achieved_score: number;
    max_score: number;
    weightage_score_percent: number;
  };
}

export interface ChecklistMonthlyTrend {
  month: string;
  completed: number;
  pending: number;
}

export interface ChecklistsTrendsData {
  monthly_trend: ChecklistMonthlyTrend[];
}

export interface ChecklistPerpetuallySkipped {
  custom_form_id: number;
  name: string;
  total_occurrences: number;
  skipped_count: number;
  skip_rate_percent: number;
}

export interface ChecklistOverdueByType {
  schedule_type: string;
  overdue_count: number;
}

export interface ChecklistHighPendingSite {
  pms_site_id: number;
  site_name: string;
  pending_count: number;
}

export interface ChecklistsFindingsData {
  perpetually_skipped: ChecklistPerpetuallySkipped[];
  overdue_by_type: ChecklistOverdueByType[];
  high_pending_sites: ChecklistHighPendingSite[];
}

interface ChecklistsOverviewResponse {
  success: number;
  message: string;
  checklists_overview: ChecklistsOverviewData;
  filters: FmDashboardFilters;
}
interface ChecklistsComplianceResponse {
  success: number;
  message: string;
  checklists_compliance: ChecklistsComplianceData;
  filters: FmDashboardFilters;
}
interface ChecklistsTrendsResponse {
  success: number;
  message: string;
  checklists_trends: ChecklistsTrendsData;
  filters: FmDashboardFilters;
}
interface ChecklistsFindingsResponse {
  success: number;
  message: string;
  checklists_findings: ChecklistsFindingsData;
  filters: FmDashboardFilters;
}

const CHECKLISTS_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/checklists/checklists_overview",
  COMPLIANCE: "/fm_dashboard/checklists/checklists_compliance",
  TRENDS: "/fm_dashboard/checklists/checklists_trends",
  FINDINGS: "/fm_dashboard/checklists/checklists_findings",
} as const;

export const fetchChecklistsOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<ChecklistsOverviewResponse>(CHECKLISTS_ENDPOINTS.OVERVIEW, params).then(
    (res) => res.checklists_overview
  );

export const fetchChecklistsCompliance = (params: FmDashboardParams) =>
  fetchFmDashboardJson<ChecklistsComplianceResponse>(CHECKLISTS_ENDPOINTS.COMPLIANCE, params).then(
    (res) => res.checklists_compliance
  );

export const fetchChecklistsTrends = (params: FmDashboardParams) =>
  fetchFmDashboardJson<ChecklistsTrendsResponse>(CHECKLISTS_ENDPOINTS.TRENDS, params).then((res) => res.checklists_trends);

export const fetchChecklistsFindings = (params: FmDashboardParams) =>
  fetchFmDashboardJson<ChecklistsFindingsResponse>(CHECKLISTS_ENDPOINTS.FINDINGS, params).then(
    (res) => res.checklists_findings
  );

// ============================================================================
// Inventory
// ============================================================================

export interface InventoryTypeCriticalityRow {
  inventory_type: string;
  criticality: string;
  count: number;
}

export interface InventoryOverviewData {
  total_items: number;
  active_count: number;
  inactive_count: number;
  eco_friendly_count: number;
  type_criticality_breakdown: InventoryTypeCriticalityRow[];
  current_inventory_value: { value: number; costed_items_count: number };
  inventory_health_score: number;
}

export interface InventoryCriticalStockRow {
  pms_inventory_id?: number;
  inventory_id?: number;
  name?: string;
  quantity?: number;
  min_stock_level?: string | number;
  criticality?: string;
  deficit?: number;
  [key: string]: unknown;
}

export interface InventoryUrgentRestockRow {
  pms_inventory_id?: number;
  inventory_id?: number;
  name?: string;
  quantity?: number;
  min_stock_level?: string | number;
  criticality?: string;
  expiry_date?: string | null;
  [key: string]: unknown;
}

export interface InventoryDeadStockByCategory {
  category: string;
  item_count: number;
  value_at_risk: number;
}

export interface InventoryStockHealthData {
  critical_stock_count: number;
  critical_stock_status: InventoryCriticalStockRow[];
  urgent_restock_priority: InventoryUrgentRestockRow[];
  dead_stock: {
    total_value: number;
    item_count: number;
    by_category: InventoryDeadStockByCategory[];
  };
}

export interface InventoryMonthlyCost {
  month?: string;
  total_cost?: number;
  [key: string]: unknown;
}

export interface InventoryCategoryConsumption {
  category?: string;
  consumed_quantity?: number;
  consumed_value?: number;
  [key: string]: unknown;
}

export interface InventoryConsumptionData {
  turnover_ratio: number;
  monthly_cost_trend: InventoryMonthlyCost[];
  category_wise_consumption: InventoryCategoryConsumption[];
}

export interface InventoryOperationsData {
  grn_workflow: { total: number; completed: number; pending: number };
  green_inventory: { adoption_percent: number; eco_friendly_count: number; total_items: number };
}

interface InventoryOverviewResponse {
  success: number;
  message: string;
  inventory_overview: InventoryOverviewData;
  filters: FmDashboardFilters;
}
interface InventoryStockHealthResponse {
  success: number;
  message: string;
  inventory_stock_health: InventoryStockHealthData;
  filters: FmDashboardFilters;
}
interface InventoryConsumptionResponse {
  success: number;
  message: string;
  inventory_consumption: InventoryConsumptionData;
  filters: FmDashboardFilters;
}
interface InventoryOperationsResponse {
  success: number;
  message: string;
  inventory_operations: InventoryOperationsData;
  filters: FmDashboardFilters;
}

const INVENTORY_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/inventory/inventory_overview.json",
  STOCK_HEALTH: "/fm_dashboard/inventory/inventory_stock_health.json",
  CONSUMPTION: "/fm_dashboard/inventory/inventory_consumption.json",
  OPERATIONS: "/fm_dashboard/inventory/inventory_operations.json",
  KPIS_TABLE: "/fm_dashboard/inventory/inventory_kpis_table",
} as const;

export const fetchInventoryOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<InventoryOverviewResponse>(INVENTORY_ENDPOINTS.OVERVIEW, params).then((res) => res.inventory_overview);

export const fetchInventoryStockHealth = (params: FmDashboardParams) =>
  fetchFmDashboardJson<InventoryStockHealthResponse>(INVENTORY_ENDPOINTS.STOCK_HEALTH, params).then(
    (res) => res.inventory_stock_health
  );

export const fetchInventoryConsumption = (params: FmDashboardParams) =>
  fetchFmDashboardJson<InventoryConsumptionResponse>(INVENTORY_ENDPOINTS.CONSUMPTION, params).then(
    (res) => res.inventory_consumption
  );

export const fetchInventoryOperations = (params: FmDashboardParams) =>
  fetchFmDashboardJson<InventoryOperationsResponse>(INVENTORY_ENDPOINTS.OPERATIONS, params).then(
    (res) => res.inventory_operations
  );

export const fetchInventoryKpisTable = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ inventory_kpis_table: unknown }>(INVENTORY_ENDPOINTS.KPIS_TABLE, params).then(
    (res) => res.inventory_kpis_table
  );

// ============================================================================
// Waste
// ============================================================================

export interface WasteOverviewData {
  record_count: number;
  total_generated_kg: number;
  total_recycled_kg: number;
  recycling_rate_percent: number;
  vendor_coverage_percent: number;
  last_activity_date: string | null;
  days_since_last_activity: number | null;
}

export interface WasteCategoryRow {
  category: string;
  generated_kg: number;
  recycled_kg: number;
}

export interface WasteCommodityRow {
  commodity: string;
  generated_kg: number;
  recycled_kg: number;
}

export interface WasteBuildingRow {
  pms_building_id: number;
  name: string;
  generated_kg: number;
}

export interface WasteBreakdownData {
  by_category: WasteCategoryRow[];
  by_commodity: WasteCommodityRow[];
  by_building: WasteBuildingRow[];
}

export interface WasteTrendWeek {
  week_start: string;
  generated_kg: number;
  recycled_kg: number;
}

export interface WasteTrendData {
  weekly_trend: WasteTrendWeek[];
}

export interface WasteVendorRow {
  pms_supplier_id: number;
  vendor_name: string;
  total_handled_kg: number;
  record_count: number;
  last_activity_date: string | null;
}

export interface WasteVendorData {
  by_vendor: WasteVendorRow[];
  untagged: { record_count: number; total_kg: number };
}

interface WasteOverviewResponse {
  success: number;
  message: string;
  waste_overview: WasteOverviewData;
  filters: FmDashboardFilters;
}
interface WasteBreakdownResponse {
  success: number;
  message: string;
  waste_breakdown: WasteBreakdownData;
  filters: FmDashboardFilters;
}
interface WasteTrendResponse {
  success: number;
  message: string;
  waste_trend: WasteTrendData;
  filters: FmDashboardFilters;
}
interface WasteVendorResponse {
  success: number;
  message: string;
  waste_vendor: WasteVendorData;
  filters: FmDashboardFilters;
}

const WASTE_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/waste/waste_overview.json",
  BREAKDOWN: "/fm_dashboard/waste/waste_breakdown.json",
  TREND: "/fm_dashboard/waste/waste_trend.json",
  VENDOR: "/fm_dashboard/waste/waste_vendor.json",
  RECORDS: "/fm_dashboard/waste/waste_records",
} as const;

export const fetchWasteOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<WasteOverviewResponse>(WASTE_ENDPOINTS.OVERVIEW, params).then((res) => res.waste_overview);

export const fetchWasteBreakdown = (params: FmDashboardParams) =>
  fetchFmDashboardJson<WasteBreakdownResponse>(WASTE_ENDPOINTS.BREAKDOWN, params).then((res) => res.waste_breakdown);

export const fetchWasteTrend = (params: FmDashboardParams) =>
  fetchFmDashboardJson<WasteTrendResponse>(WASTE_ENDPOINTS.TREND, params).then((res) => res.waste_trend);

export const fetchWasteVendor = (params: FmDashboardParams) =>
  fetchFmDashboardJson<WasteVendorResponse>(WASTE_ENDPOINTS.VENDOR, params).then((res) => res.waste_vendor);

export const fetchWasteRecords = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ waste_records: unknown }>(WASTE_ENDPOINTS.RECORDS, params).then((res) => res.waste_records);

// ============================================================================
// Attendance
// ============================================================================
// Note: attendance_overview is a live "today" snapshot (not scoped by from_date/to_date), so it
// can legitimately show all zeros when the selected site list has no attendance recorded today.

export interface AttendanceOverviewData {
  roster_size: number;
  present_count: number;
  absent_count: number;
  late_count: number;
  on_time_percent: number;
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface AttendanceDepartmentRow {
  department?: string;
  present_count?: number;
  absent_count?: number;
  [key: string]: unknown;
}

export interface AttendanceDepartmentData {
  department_breakdown: AttendanceDepartmentRow[];
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface AttendanceTrendMonth {
  month?: string;
  present_percent?: number;
  present_count?: number;
  absent_count?: number;
  [key: string]: unknown;
}

export interface AttendanceTrendData {
  monthly_trend: AttendanceTrendMonth[];
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface AttendanceRepeatAbsenceRow {
  employee_name?: string;
  department?: string;
  absence_count?: number;
  [key: string]: unknown;
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface AttendanceHabitualLatecomerRow {
  employee_name?: string;
  department?: string;
  late_count?: number;
  [key: string]: unknown;
}

export interface AttendancePatternsData {
  repeat_absence: AttendanceRepeatAbsenceRow[];
  habitual_latecomers: AttendanceHabitualLatecomerRow[];
}

export interface AttendanceStaffingGapDailyRow {
  date: string;
  working_day: boolean;
  absent_staff: number;
  present_staff: number;
  total_tickets: number;
  breached_tickets: number;
  breach_percent: number;
}

export interface AttendanceStaffingGapVsBreachData {
  absent_staff: {
    absent_staff_count: number;
    absent_person_days: number;
    total_staff: number;
    working_days: number;
  };
  ticket_breach: {
    total_tickets: number;
    breached_tickets: number;
    breach_percent: number;
  };
  daily: AttendanceStaffingGapDailyRow[];
}

interface AttendanceOverviewResponse {
  success: number;
  message: string;
  attendance_overview: AttendanceOverviewData;
  filters: FmDashboardFilters;
}
interface AttendanceDepartmentResponse {
  success: number;
  message: string;
  attendance_department: AttendanceDepartmentData;
  filters: FmDashboardFilters;
}
interface AttendanceTrendResponse {
  success: number;
  message: string;
  attendance_trend: AttendanceTrendData;
  filters: FmDashboardFilters;
}
interface AttendancePatternsResponse {
  success: number;
  message: string;
  attendance_patterns: AttendancePatternsData;
  filters: FmDashboardFilters;
}

const ATTENDANCE_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/attendance/attendance_overview.json",
  DEPARTMENT: "/fm_dashboard/attendance/attendance_department.json",
  TREND: "/fm_dashboard/attendance/attendance_trend.json",
  PATTERNS: "/fm_dashboard/attendance/attendance_patterns.json",
  STAFFING_GAP_VS_BREACH: "/fm_dashboard/attendance/staffing_gap_vs_breach",
} as const;

export const fetchAttendanceOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AttendanceOverviewResponse>(ATTENDANCE_ENDPOINTS.OVERVIEW, params).then(
    (res) => res.attendance_overview
  );

export const fetchAttendanceDepartment = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AttendanceDepartmentResponse>(ATTENDANCE_ENDPOINTS.DEPARTMENT, params).then(
    (res) => res.attendance_department
  );

export const fetchAttendanceTrend = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AttendanceTrendResponse>(ATTENDANCE_ENDPOINTS.TREND, params).then((res) => res.attendance_trend);

export const fetchAttendancePatterns = (params: FmDashboardParams) =>
  fetchFmDashboardJson<AttendancePatternsResponse>(ATTENDANCE_ENDPOINTS.PATTERNS, params).then(
    (res) => res.attendance_patterns
  );

export const fetchAttendanceStaffingGapVsBreach = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ staffing_gap_vs_breach: AttendanceStaffingGapVsBreachData }>(
    ATTENDANCE_ENDPOINTS.STAFFING_GAP_VS_BREACH,
    params
  ).then((res) => res.staffing_gap_vs_breach);

// ============================================================================
// Survey
// ============================================================================

export interface SurveyOverviewData {
  total_responses: number;
  total_surveys_in_scope: number;
  total_rating_answers: number;
  avg_csat: number;
  sentiment: {
    positive_count: number;
    negative_count: number;
    positive_percent: number;
    negative_percent: number;
  };
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface SurveyCategoryRow {
  category?: string;
  count?: number;
  percent?: number;
  [key: string]: unknown;
}

export interface SurveyBreakdownData {
  total_selections: number;
  response_by_category: SurveyCategoryRow[];
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface SurveyTrendWeek {
  week_start?: string;
  avg_csat?: number;
  response_count?: number;
  [key: string]: unknown;
}

export interface SurveyTrendData {
  weekly_trend: SurveyTrendWeek[];
}

export interface SurveyTimingHour {
  hour: number;
  response_count: number;
}

export interface SurveyTimingData {
  total_responses: number;
  hourly_heatmap: SurveyTimingHour[];
}

interface SurveyOverviewResponse {
  success: number;
  message: string;
  survey_overview: SurveyOverviewData;
  filters: FmDashboardFilters;
}
interface SurveyBreakdownResponse {
  success: number;
  message: string;
  survey_breakdown: SurveyBreakdownData;
  filters: FmDashboardFilters;
}
interface SurveyTrendResponse {
  success: number;
  message: string;
  survey_trend: SurveyTrendData;
  filters: FmDashboardFilters;
}
interface SurveyTimingResponse {
  success: number;
  message: string;
  survey_timing: SurveyTimingData;
  filters: FmDashboardFilters;
}

const SURVEY_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/survey/survey_overview.json",
  BREAKDOWN: "/fm_dashboard/survey/survey_breakdown.json",
  TREND: "/fm_dashboard/survey/survey_trend.json",
  WEEKLY_CSAT_BREAKDOWN: "/fm_dashboard/survey/survey_weekly_csat_breakdown",
  TIMING: "/fm_dashboard/survey/survey_timing.json",
} as const;

export const fetchSurveyOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<SurveyOverviewResponse>(SURVEY_ENDPOINTS.OVERVIEW, params).then((res) => res.survey_overview);

export const fetchSurveyBreakdown = (params: FmDashboardParams) =>
  fetchFmDashboardJson<SurveyBreakdownResponse>(SURVEY_ENDPOINTS.BREAKDOWN, params).then((res) => res.survey_breakdown);

export const fetchSurveyTrend = (params: FmDashboardParams) =>
  fetchFmDashboardJson<SurveyTrendResponse>(SURVEY_ENDPOINTS.TREND, params).then((res) => res.survey_trend);

export const fetchSurveyWeeklyCsatBreakdown = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ survey_weekly_csat_breakdown: unknown }>(SURVEY_ENDPOINTS.WEEKLY_CSAT_BREAKDOWN, params).then(
    (res) => res.survey_weekly_csat_breakdown
  );

export const fetchSurveyTiming = (params: FmDashboardParams) =>
  fetchFmDashboardJson<SurveyTimingResponse>(SURVEY_ENDPOINTS.TIMING, params).then((res) => res.survey_timing);

// ============================================================================
// Vendor
// ============================================================================

export interface VendorOverviewData {
  total_vendors: number;
  active_count: number;
  inactive_count: number;
  onboarding_pending_count: number;
  kyc: { due_within_30_days: number; tracked_count: number };
  pending_vendor_tasks: number;
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface VendorPerformanceRow {
  vendor_name?: string;
  pms_supplier_id?: number;
  total_requests?: number;
  breached?: number;
  sla_compliance_percent?: number;
  [key: string]: unknown;
}

export interface VendorPerformanceData {
  overall: { total_requests: number; breached: number; sla_compliance_percent: number };
  by_vendor: VendorPerformanceRow[];
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface VendorRepeatIssueRow {
  vendor_name?: string;
  issue?: string;
  repeat_count?: number;
  [key: string]: unknown;
}

export interface VendorRepeatIssuesData {
  repeat_issues: VendorRepeatIssueRow[];
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface VendorKycRiskRow {
  vendor_name?: string;
  pms_supplier_id?: number;
  kyc_expiry_date?: string;
  contract_type?: string;
  [key: string]: unknown;
}

export interface VendorKycRiskData {
  total_active_count: number;
  total_at_risk_count: number;
  vendors_with_expired_kyc_and_live_contracts: VendorKycRiskRow[];
}

interface VendorOverviewResponse {
  success: number;
  message: string;
  vendor_overview: VendorOverviewData;
  filters: FmDashboardFilters;
}
interface VendorPerformanceResponse {
  success: number;
  message: string;
  vendor_performance: VendorPerformanceData;
  filters: FmDashboardFilters;
}
interface VendorRepeatIssuesResponse {
  success: number;
  message: string;
  vendor_repeat_issues: VendorRepeatIssuesData;
  filters: FmDashboardFilters;
}
interface VendorKycRiskResponse {
  success: number;
  message: string;
  vendor_kyc_risk: VendorKycRiskData;
  filters: FmDashboardFilters;
}

export interface VendorPerformanceTableRow {
  pms_supplier_id: number;
  vendor_name: string;
  total_contracts: number;
  live_contracts: number;
  completed_visits: number;
  missed_visits: number;
}

export interface VendorPerformanceScoreData {
  score: number | null;
  grade: string | null;
  sla_compliance_percent: number | null;
  response_within_target_percent: number | null;
  contract_fulfilment_percent: number | null;
}

export interface VendorOnTimeCompletionData {
  on_time_percent: number | null;
  on_time_visits: number;
  scheduled_visits: number;
  completed_visits: number;
  missed_visits: number;
  completed_without_actual_date: number;
}

export interface VendorHealthData {
  total_missed_visits: number;
  by_vendor: { pms_supplier_id: number; vendor_name: string; missed_visits: number }[];
}

export interface VendorContractRenewalsData {
  total_renewals_due: number;
  kyc_renewals_due: number;
  amc_renewals_due: number;
}

export interface VendorResponseTrendData {
  by_month: { month: string; avg_response_hours: number | null; sla_target_hours: number | null }[];
}

export interface VendorWorkflowBottlenecksData {
  slowest_stage: string | null;
  stages: { stage: string; avg_hours: number | null }[];
}

export interface VendorKycStatusData {
  total_at_risk_count: number;
  expired_count: number;
  missing_count: number;
  total_active_count: number;
}

const VENDOR_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/vendor/vendor_overview.json",
  PERFORMANCE: "/fm_dashboard/vendor/vendor_performance.json",
  REPEAT_ISSUES: "/fm_dashboard/vendor/vendor_repeat_issues.json",
  KYC_RISK: "/fm_dashboard/vendor/vendor_kyc_risk.json",
  PERFORMANCE_TABLE: "/fm_dashboard/vendor/vendor_performance_table.json",
  PERFORMANCE_SCORE: "/fm_dashboard/vendor/vendor_performance_score.json",
  ON_TIME_COMPLETION: "/fm_dashboard/vendor/vendor_on_time_completion.json",
  HEALTH: "/fm_dashboard/vendor/vendor_health.json",
  CONTRACT_RENEWALS: "/fm_dashboard/vendor/vendor_contract_renewals.json",
  RESPONSE_TREND: "/fm_dashboard/vendor/vendor_response_trend.json",
  WORKFLOW_BOTTLENECKS: "/fm_dashboard/vendor/vendor_workflow_bottlenecks.json",
  KYC_STATUS: "/fm_dashboard/vendor/vendor_kyc_status.json",
} as const;

export const fetchVendorOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<VendorOverviewResponse>(VENDOR_ENDPOINTS.OVERVIEW, params).then((res) => res.vendor_overview);

export const fetchVendorPerformance = (params: FmDashboardParams) =>
  fetchFmDashboardJson<VendorPerformanceResponse>(VENDOR_ENDPOINTS.PERFORMANCE, params).then((res) => res.vendor_performance);

export const fetchVendorRepeatIssues = (params: FmDashboardParams) =>
  fetchFmDashboardJson<VendorRepeatIssuesResponse>(VENDOR_ENDPOINTS.REPEAT_ISSUES, params).then(
    (res) => res.vendor_repeat_issues
  );

export const fetchVendorKycRisk = (params: FmDashboardParams) =>
  fetchFmDashboardJson<VendorKycRiskResponse>(VENDOR_ENDPOINTS.KYC_RISK, params).then((res) => res.vendor_kyc_risk);

export const fetchVendorPerformanceTable = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ vendor_performance_table: { by_vendor: VendorPerformanceTableRow[] } }>(
    VENDOR_ENDPOINTS.PERFORMANCE_TABLE,
    params
  ).then((res) => res.vendor_performance_table?.by_vendor ?? []);

export const fetchVendorPerformanceScore = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ vendor_performance_score: VendorPerformanceScoreData }>(
    VENDOR_ENDPOINTS.PERFORMANCE_SCORE,
    params
  ).then((res) => res.vendor_performance_score);

export const fetchVendorOnTimeCompletion = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ vendor_on_time_completion: VendorOnTimeCompletionData }>(
    VENDOR_ENDPOINTS.ON_TIME_COMPLETION,
    params
  ).then((res) => res.vendor_on_time_completion);

export const fetchVendorHealth = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ vendor_health: VendorHealthData }>(VENDOR_ENDPOINTS.HEALTH, params).then((res) => res.vendor_health);

export const fetchVendorContractRenewals = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ vendor_contract_renewals: VendorContractRenewalsData }>(
    VENDOR_ENDPOINTS.CONTRACT_RENEWALS,
    params
  ).then((res) => res.vendor_contract_renewals);

export const fetchVendorResponseTrend = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ vendor_response_trend: VendorResponseTrendData }>(VENDOR_ENDPOINTS.RESPONSE_TREND, params).then(
    (res) => res.vendor_response_trend
  );

export const fetchVendorWorkflowBottlenecks = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ vendor_workflow_bottlenecks: VendorWorkflowBottlenecksData }>(
    VENDOR_ENDPOINTS.WORKFLOW_BOTTLENECKS,
    params
  ).then((res) => res.vendor_workflow_bottlenecks);

export const fetchVendorKycStatus = (params: FmDashboardParams) =>
  fetchFmDashboardJson<{ vendor_kyc_status: VendorKycStatusData }>(VENDOR_ENDPOINTS.KYC_STATUS, params).then(
    (res) => res.vendor_kyc_status
  );

// ============================================================================
// Permits (Safety module)
// ============================================================================

async function fetchSafetyDashboardJson<T extends { success?: number; message?: string }>(
  endpoint: string,
  params: FmDashboardParams
): Promise<T> {
  const response = await fetchFmDashboardJson<T>(endpoint, params);
  if (response.success === 0) {
    throw new Error(response.message || `Safety dashboard request failed for ${endpoint}`);
  }
  return response;
}

export interface PermitsStatusBreakdown {
  open?: number;
  expired?: number;
  draft?: number;
  approved?: number;
  closed?: number;
  hold?: number;
  rejected?: number;
  [key: string]: unknown;
}

export interface PermitsOverviewData {
  total_permits: number;
  status_breakdown: PermitsStatusBreakdown;
  permit_compliance?: {
    percent: number;
    valid_count: number;
    active_count: number;
    total_permits: number;
  };
  safety_compliance?: {
    percent: number;
    active_permits_checked: number;
  };
  permit_violations?: { count: number };
  draft_percent_of_total?: number;
  [key: string]: unknown;
}

export interface PermitLevelBottleneckRow {
  invoice_approval_level_id?: number;
  level_name?: string;
  oldest_stuck_days?: number;
  stuck_count?: number;
  [key: string]: unknown;
}

export interface PermitTypeRiskRow {
  permit_type_id?: number;
  name?: string;
  count?: number;
  [key: string]: unknown;
}

export interface PermitsBottleneckData {
  approval_level_bottleneck?: PermitLevelBottleneckRow[];
  risk_weighted_type_breakdown?: PermitTypeRiskRow[];
  [key: string]: unknown;
}

export interface PermitAgeTimelinePoint {
  pms_permit_id?: number;
  reference_number?: string;
  permit_type?: string;
  age_days?: number;
  status?: string;
  [key: string]: unknown;
}

export interface PermitExceptionRow {
  pms_permit_id?: number;
  reference_number?: string;
  permit_type?: string;
  raised_date?: string;
  expiry_date?: string;
  days_open?: number;
  status?: string;
  exception_category?: string;
  [key: string]: unknown;
}

export interface PermitRepeatExtensionRow {
  pms_permit_id?: number;
  reference_number?: string;
  permit_type?: string;
  status?: string;
  extension_count?: number;
  [key: string]: unknown;
}

export interface PermitsDetailData {
  age_timeline?: { total: number; data: PermitAgeTimelinePoint[] };
  repeat_extensions?: { total: number; data: PermitRepeatExtensionRow[] };
  exceptions_log?: {
    total: number;
    by_category: Record<string, number>;
    data: PermitExceptionRow[];
  };
  [key: string]: unknown;
}

interface PermitsOverviewResponse {
  success: number;
  message: string;
  permits_overview: PermitsOverviewData;
  filters: FmDashboardFilters;
}
interface PermitsBottleneckResponse {
  success: number;
  message: string;
  permits_bottleneck: PermitsBottleneckData;
  filters: FmDashboardFilters;
}
interface PermitsDetailResponse {
  success: number;
  message: string;
  permits_detail: PermitsDetailData;
  filters: FmDashboardFilters;
}

const PERMITS_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/permit/permits_overview",
  BOTTLENECK: "/fm_dashboard/permit/permits_bottleneck",
  DETAIL: "/fm_dashboard/permit/permits_detail",
} as const;

export const fetchPermitsOverview = (params: FmDashboardParams) =>
  fetchSafetyDashboardJson<PermitsOverviewResponse>(PERMITS_ENDPOINTS.OVERVIEW, params).then((res) => res.permits_overview);

export const fetchPermitsBottleneck = (params: FmDashboardParams) =>
  fetchSafetyDashboardJson<PermitsBottleneckResponse>(PERMITS_ENDPOINTS.BOTTLENECK, params).then(
    (res) => res.permits_bottleneck
  );

export const fetchPermitsDetail = (params: FmDashboardParams) =>
  fetchSafetyDashboardJson<PermitsDetailResponse>(PERMITS_ENDPOINTS.DETAIL, params).then((res) => res.permits_detail);

// ============================================================================
// Incidents (Safety module)
// ============================================================================

export interface IncidentsStatusBreakdown {
  total?: number;
  open?: number;
  under_investigation?: number;
  pending?: number;
  closed?: number;
  final_closure?: number;
  provisional_closure?: number;
  other?: number;
  [key: string]: unknown;
}

export interface IncidentTrendPoint {
  month?: string;
  incident_count?: number;
  [key: string]: unknown;
}

export interface IncidentsTrendData {
  monthly_trend?: IncidentTrendPoint[];
  external_support?: {
    count: number;
    total: number;
    percent: number;
  };
  [key: string]: unknown;
}

export interface IncidentRootCauseRow {
  root_cause?: string;
  count?: number;
  [key: string]: unknown;
}

export interface IncidentsAnalysisData {
  root_cause_breakdown?: IncidentRootCauseRow[];
  percent?: number;
  closure_rate_percent?: number;
  closed_incident_quality?: {
    qualifying_count: number;
    total_closed: number;
    percent: number;
  };
  avg_resolution_time?: { days: number; sample_size: number };
  safety_compliance_score?: number;
  [key: string]: unknown;
}

export interface IncidentLocationRow {
  tower_id?: number;
  location?: string;
  low_risk_count?: number;
  [key: string]: unknown;
}

export interface IncidentBodyPartRow {
  category?: string;
  name?: string;
  [bodyPart: string]: unknown;
}

export interface IncidentRequiringActionRow {
  incident_id: number;
  date: string;
  category: string | null;
  level: string;
  status: string;
  description: string;
  rca: string | null;
  assigned_to: string;
  days_open: number;
}

export interface IncidentsHotspotsData {
  status_breakdown?: IncidentsStatusBreakdown;
  severity_distribution?: Record<string, number>;
  quiet_escalation_by_location?: {
    location_coverage_count: number;
    data: IncidentLocationRow[];
  };
  by_body_part?: IncidentBodyPartRow[];
  incidents_requiring_action_count?: number;
  incidents_requiring_action?: IncidentRequiringActionRow[];
  [key: string]: unknown;
}

interface IncidentsTrendResponse {
  success: number;
  message: string;
  incidents_trend: IncidentsTrendData;
  filters: FmDashboardFilters;
}
interface IncidentsAnalysisResponse {
  success: number;
  message: string;
  incidents_analysis: IncidentsAnalysisData;
  filters: FmDashboardFilters;
}
interface IncidentsHotspotsResponse {
  success: number;
  message: string;
  incidents_hotspots: IncidentsHotspotsData;
  filters: FmDashboardFilters;
}

export interface IncidentKpisData {
  zero_incident_days: number;
  incident_rate: {
    incidents: number;
    area: number;
    rate: number;
  };
  ltir: {
    injuries: number;
    work_hours: number;
    value: number;
  };
}

const INCIDENTS_ENDPOINTS = {
  TREND: "/fm_dashboard/incident/incidents_trend",
  ANALYSIS: "/fm_dashboard/incident/incidents_analysis",
  HOTSPOTS: "/fm_dashboard/incident/incidents_hotspots",
} as const;

export const fetchIncidentsTrend = (params: FmDashboardParams) =>
  fetchSafetyDashboardJson<IncidentsTrendResponse>(INCIDENTS_ENDPOINTS.TREND, params).then((res) => res.incidents_trend);

export const fetchIncidentsAnalysis = (params: FmDashboardParams) =>
  fetchSafetyDashboardJson<IncidentsAnalysisResponse>(INCIDENTS_ENDPOINTS.ANALYSIS, params).then(
    (res) => res.incidents_analysis
  );

export const fetchIncidentsHotspots = (params: FmDashboardParams) =>
  fetchSafetyDashboardJson<IncidentsHotspotsResponse>(INCIDENTS_ENDPOINTS.HOTSPOTS, params).then(
    (res) => res.incidents_hotspots
  );

export const fetchIncidentKpis = (siteIds: FmDashboardParams["siteIds"]) =>
  fetchSafetyDashboardJson<{ success: number; message?: string; data: IncidentKpisData }>("/incident_dashboard/incident_kpis", {
    siteIds,
  }).then((res) => res.data);

// ============================================================================
// Finance
// ============================================================================
// Unlike every module above, these 8 endpoints don't share one `_overview` /
// `_trends` grouping — each is its own narrow resource, per the
// `fm matrix dashboards finance/` Bruno collection at the repo root (the
// source of truth for path/method/params). Field names below are NOT
// verified against a live response: that collection points at
// http://localhost:3000, which wasn't running/reachable from this
// environment, and no backend source for these routes was found on this
// machine either. Every fetch here therefore returns the raw envelope value
// as a loosely-typed record (falling back to the whole response body if the
// guessed envelope key — the endpoint's own name — doesn't match) instead of
// a strict interface, and FinancePanel.tsx reads it with tolerant,
// multi-key-candidate lookups. Once a real response is confirmed, tighten
// these the same way Tickets/Assets/etc. are typed above.

export type FinanceRecord = Record<string, unknown>;

async function fetchFinanceValue(
  endpoint: string,
  envelopeKey: string,
  params: FmDashboardParams
): Promise<FinanceRecord | FinanceRecord[]> {
  const res = await fetchFmDashboardJson<FinanceRecord>(endpoint, params);
  const value = res[envelopeKey];
  return (value ?? res) as FinanceRecord | FinanceRecord[];
}

const FINANCE_ENDPOINTS = {
  PENDING_APPROVALS: "/fm_dashboard/procurement/pending_approvals",
  DRAFT_PRS: "/fm_dashboard/requisitions/draft_prs",
  PROCUREMENT_PIPELINE: "/fm_dashboard/procurement/procurement_pipeline",
  PENDING_VALUE: "/fm_dashboard/requisitions/pending_value",
  PR_SR_SPLIT: "/fm_dashboard/procurement/pr_sr_split",
  // No site_id param in the reference collection's capture for this one — called the same
  // way as the others anyway for consistency; an unrecognized query param should be harmless.
  OVERDUE_INVOICES: "/fm_dashboard/invoices/overdue_invoices",
  APPROVAL_QUEUE: "/fm_dashboard/approvals/approval_queue",
  TOP_PENDING_RECORDS: "/fm_dashboard/approvals/top_pending_records",
} as const;

export const fetchFinancePendingApprovals = (params: FmDashboardParams) =>
  fetchFinanceValue(FINANCE_ENDPOINTS.PENDING_APPROVALS, "pending_approvals", params);

export const fetchFinanceDraftPrs = (params: FmDashboardParams) =>
  fetchFinanceValue(FINANCE_ENDPOINTS.DRAFT_PRS, "draft_prs", params);

export const fetchFinanceProcurementPipeline = (params: FmDashboardParams) =>
  fetchFinanceValue(FINANCE_ENDPOINTS.PROCUREMENT_PIPELINE, "procurement_pipeline", params);

export const fetchFinancePendingValue = (params: FmDashboardParams) =>
  fetchFinanceValue(FINANCE_ENDPOINTS.PENDING_VALUE, "pending_value", params);

export const fetchFinancePrSrSplit = (params: FmDashboardParams) =>
  fetchFinanceValue(FINANCE_ENDPOINTS.PR_SR_SPLIT, "pr_sr_split", params);

export const fetchFinanceOverdueInvoices = (params: FmDashboardParams) =>
  fetchFinanceValue(FINANCE_ENDPOINTS.OVERDUE_INVOICES, "overdue_invoices", params);

export const fetchFinanceApprovalQueue = (params: FmDashboardParams) =>
  fetchFinanceValue(FINANCE_ENDPOINTS.APPROVAL_QUEUE, "approval_queue", params);

export const fetchFinanceTopPendingRecords = (params: FmDashboardParams) =>
  fetchFinanceValue(FINANCE_ENDPOINTS.TOP_PENDING_RECORDS, "top_pending_records", params);

// ============================================================================
// AI Insights (Finance + CRM)
// ============================================================================
// 8 endpoints total, per the `cm and finance all apis/{crm,finance}/*AI
// Insight*.yml` Bruno collection at the repo root — the source of truth for
// path/method/params, same as the CRM/Finance sections above. None of these
// have been hit against a live backend (same reachability caveat noted
// there), so every fetch returns a loosely-typed record and callers pull a
// headline/bullet list out of it via extractAiInsights() instead of assuming
// one fixed schema.

export type AiInsightRecord = Record<string, unknown>;

async function fetchAiInsight(endpoint: string, params: FmDashboardParams): Promise<AiInsightRecord> {
  return fetchFmDashboardJson<AiInsightRecord>(endpoint, params);
}

const FINANCE_AI_INSIGHT_ENDPOINTS = {
  FINANCE_ALERTS: "/fm_dashboard/overview/ai_insights.json",
  FINANCIAL_INTELLIGENCE: "/fm_dashboard/overview/financial_intelligence_ai_insights.json",
  BILL_INFORMATION: "/fm_dashboard/invoices/bill_information_ai_insights.json",
  // No site_id param in the reference collection's capture for this one — see Finance's OVERDUE_INVOICES above.
  OVERDUE_INVOICES: "/fm_dashboard/invoices/ai_insights.json",
  APPROVAL_QUEUE: "/fm_dashboard/approvals/approval_queue_ai_insights.json",
  PO_WO_GRN_SES: "/fm_dashboard/procurement/po_wo_ai_insights.json",
} as const;

export const fetchFinanceAlertsAiInsight = (params: FmDashboardParams) =>
  fetchAiInsight(FINANCE_AI_INSIGHT_ENDPOINTS.FINANCE_ALERTS, params);

export const fetchFinancialIntelligenceAiInsight = (params: FmDashboardParams) =>
  fetchAiInsight(FINANCE_AI_INSIGHT_ENDPOINTS.FINANCIAL_INTELLIGENCE, params);

export const fetchBillInformationAiInsight = (params: FmDashboardParams) =>
  fetchAiInsight(FINANCE_AI_INSIGHT_ENDPOINTS.BILL_INFORMATION, params);

export const fetchOverdueInvoicesAiInsight = (params: FmDashboardParams) =>
  fetchAiInsight(FINANCE_AI_INSIGHT_ENDPOINTS.OVERDUE_INVOICES, params);

export const fetchApprovalQueueAiInsight = (params: FmDashboardParams) =>
  fetchAiInsight(FINANCE_AI_INSIGHT_ENDPOINTS.APPROVAL_QUEUE, params);

export const fetchPoWoGrnSesAiInsight = (params: FmDashboardParams) =>
  fetchAiInsight(FINANCE_AI_INSIGHT_ENDPOINTS.PO_WO_GRN_SES, params);

const CRM_AI_INSIGHT_ENDPOINTS = {
  CUSTOMERS: "/fm_dashboard/crm/customers/ai_insights.json",
  EVENTS: "/fm_dashboard/crm/events/ai_insights.json",
} as const;

export const fetchCustomersAiInsight = (params: FmDashboardParams) =>
  fetchAiInsight(CRM_AI_INSIGHT_ENDPOINTS.CUSTOMERS, params);

export const fetchEventsAiInsight = (params: FmDashboardParams) =>
  fetchAiInsight(CRM_AI_INSIGHT_ENDPOINTS.EVENTS, params);

/** Headline + bullet list pulled out of one of the AI-insight endpoints above. */
export interface AiInsightSummary {
  headline: string | null;
  items: string[];
}

export const EMPTY_AI_INSIGHT: AiInsightSummary = { headline: null, items: [] };

function aiInsightText(value: unknown): string | null {
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const row = value as AiInsightRecord;
    for (const key of ["message", "insight", "description", "text", "title"]) {
      const v = row[key];
      if (typeof v === "string" && v.trim() !== "") return v.trim();
    }
  }
  return null;
}

/**
 * Tolerant reader for the AI-insight endpoints — every one of them is
 * expected to return a differently-shaped envelope, so this unwraps whatever
 * common envelope/headline/list keys it can find rather than assuming one
 * fixed schema. Once a real response is confirmed, tighten per-endpoint.
 */
export function extractAiInsights(raw: AiInsightRecord | null | undefined): AiInsightSummary {
  if (!raw || typeof raw !== "object") return EMPTY_AI_INSIGHT;

  let value: AiInsightRecord = raw;
  for (const key of ["ai_insights", "ai_insight", "insights", "data", "result"]) {
    const nested = raw[key];
    if (Array.isArray(nested)) {
      const items = nested.map(aiInsightText).filter((s): s is string => s !== null);
      if (items.length) return { headline: null, items };
    } else if (nested && typeof nested === "object") {
      value = nested as AiInsightRecord;
      break;
    }
  }

  const headline = aiInsightText(value["headline"]) ?? aiInsightText(value["title"]) ?? aiInsightText(value["summary"]);

  for (const key of ["insights", "items", "recommendations", "messages", "alerts", "points"]) {
    const list = value[key];
    if (Array.isArray(list)) {
      const items = list.map(aiInsightText).filter((s): s is string => s !== null);
      if (items.length) return { headline, items };
    }
  }

  const single = aiInsightText(value["insight"]) ?? aiInsightText(value["message"]) ?? aiInsightText(value["text"]);
  return { headline, items: single ? [single] : [] };
}

// ============================================================================
// Patrolling
// ============================================================================

export const PATROLLING_ENDPOINTS = [
  "patrolling_overview",
  "patrolling_status_distribution",
  "patrolling_trend",
  "patrolling_guard_performance",
  "patrolling_location_analysis",
  "patrolling_tickets_by_category",
  "patrolling_ticket_link_and_staff",
  "patrolling_completion_by_shift",
] as const;

export type PatrollingEndpoint = (typeof PATROLLING_ENDPOINTS)[number];

/** Raw response — inner shape varies per endpoint, so the UI normalises it defensively. */
export type PatrollingResponse = Record<string, unknown>;

export function fetchPatrolling(
  endpoint: PatrollingEndpoint,
  params: FmDashboardParams
): Promise<PatrollingResponse> {
  return fetchFmDashboardJson<PatrollingResponse>(
    `/fm_dashboard/patrolling/${endpoint}.json`,
    params
  );
}
