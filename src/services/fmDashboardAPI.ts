// FM Dashboard analytics API — one file for all 10 module sections
// (Tickets, Assets, Audit, AMC, Checklists, Inventory, Waste, Attendance,
// Survey, Vendor) instead of one file per module, so the whole
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

const TICKETS_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/tickets/tickets_overview",
  TRENDS: "/fm_dashboard/tickets/tickets_trends",
  BREAKDOWN: "/fm_dashboard/tickets/tickets_breakdown",
  WORKFORCE: "/fm_dashboard/tickets/tickets_workforce",
  QUALITY: "/fm_dashboard/tickets/tickets_quality",
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
  contract_split: {
    asset_contracts: number;
    service_contracts: number;
  };
  cost: {
    total_amc_value: number;
    cost_at_risk_percent: number;
  };
}

export interface AmcExpiryUrgencyRow {
  criticality: string;
  expiry_bucket: string;
  count: number;
}

export interface AmcExpiryData {
  expiry_timeline: {
    expired: number;
    expiring_0_30: number;
    expiring_31_90: number;
    active_90_plus: number;
  };
  urgency_vs_criticality: AmcExpiryUrgencyRow[];
}

export interface AmcVendorConcentrationRow {
  supplier_id: number;
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

export interface AmcVendorData {
  vendor_concentration: AmcVendorConcentrationRow[];
  monthly_cost_trend: AmcMonthlyCost[];
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
    enabled_forms: number;
    total_forms: number;
    adoption_percent: number;
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

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface InventoryCriticalStockRow {
  inventory_id?: number;
  name?: string;
  quantity?: number;
  reorder_level?: number;
  [key: string]: unknown;
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface InventoryUrgentRestockRow {
  inventory_id?: number;
  name?: string;
  quantity?: number;
  expiry_date?: string;
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

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface InventoryMonthlyCost {
  month?: string;
  value?: number;
  [key: string]: unknown;
}

// Shape unconfirmed against live data (returned empty at integration time) — kept defensive.
export interface InventoryCategoryConsumption {
  category?: string;
  value?: number;
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
  OVERVIEW: "/fm_dashboard/inventory/inventory_overview",
  STOCK_HEALTH: "/fm_dashboard/inventory/inventory_stock_health",
  CONSUMPTION: "/fm_dashboard/inventory/inventory_consumption",
  OPERATIONS: "/fm_dashboard/inventory/inventory_operations",
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
  OVERVIEW: "/fm_dashboard/waste/waste_overview",
  BREAKDOWN: "/fm_dashboard/waste/waste_breakdown",
  TREND: "/fm_dashboard/waste/waste_trend",
  VENDOR: "/fm_dashboard/waste/waste_vendor",
} as const;

export const fetchWasteOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<WasteOverviewResponse>(WASTE_ENDPOINTS.OVERVIEW, params).then((res) => res.waste_overview);

export const fetchWasteBreakdown = (params: FmDashboardParams) =>
  fetchFmDashboardJson<WasteBreakdownResponse>(WASTE_ENDPOINTS.BREAKDOWN, params).then((res) => res.waste_breakdown);

export const fetchWasteTrend = (params: FmDashboardParams) =>
  fetchFmDashboardJson<WasteTrendResponse>(WASTE_ENDPOINTS.TREND, params).then((res) => res.waste_trend);

export const fetchWasteVendor = (params: FmDashboardParams) =>
  fetchFmDashboardJson<WasteVendorResponse>(WASTE_ENDPOINTS.VENDOR, params).then((res) => res.waste_vendor);

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
  OVERVIEW: "/fm_dashboard/attendance/attendance_overview",
  DEPARTMENT: "/fm_dashboard/attendance/attendance_department",
  TREND: "/fm_dashboard/attendance/attendance_trend",
  PATTERNS: "/fm_dashboard/attendance/attendance_patterns",
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
  OVERVIEW: "/fm_dashboard/survey/survey_overview",
  BREAKDOWN: "/fm_dashboard/survey/survey_breakdown",
  TREND: "/fm_dashboard/survey/survey_trend",
  TIMING: "/fm_dashboard/survey/survey_timing",
} as const;

export const fetchSurveyOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<SurveyOverviewResponse>(SURVEY_ENDPOINTS.OVERVIEW, params).then((res) => res.survey_overview);

export const fetchSurveyBreakdown = (params: FmDashboardParams) =>
  fetchFmDashboardJson<SurveyBreakdownResponse>(SURVEY_ENDPOINTS.BREAKDOWN, params).then((res) => res.survey_breakdown);

export const fetchSurveyTrend = (params: FmDashboardParams) =>
  fetchFmDashboardJson<SurveyTrendResponse>(SURVEY_ENDPOINTS.TREND, params).then((res) => res.survey_trend);

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

const VENDOR_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/vendor/vendor_overview",
  PERFORMANCE: "/fm_dashboard/vendor/vendor_performance",
  REPEAT_ISSUES: "/fm_dashboard/vendor/vendor_repeat_issues",
  KYC_RISK: "/fm_dashboard/vendor/vendor_kyc_risk",
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

// ============================================================================
// Permits (Safety module)
// ============================================================================
// Field names below follow the naming convention confirmed across every
// other module on this API (status_breakdown: {lowercase status keys},
// *_percent, *_count, by_x arrays with name/total — see ChecklistsOverviewData
// and TicketsOverviewData). Not verified against a live response — the
// reference doc's bearer token only validates against the doc author's local
// dev server, which wasn't reachable to confirm exact field names. Kept
// defensive throughout ([key: string]: unknown + optional row fields) so real
// data still renders correctly once confirmed, and anything genuinely absent
// falls back to "—"/EmptyStateCard in the UI rather than a fabricated number.

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
  /** Confirmed field name — per the reference doc's Notes section ("permits_overview.permit_compliance ... combine client-side with incidents_overview.sohi_score"). */
  permit_compliance?: number;
  safety_compliance_percent?: number;
  violations_count?: number;
  [key: string]: unknown;
}

export interface PermitLevelBottleneckRow {
  level?: string;
  name?: string;
  stuck_count?: number;
  count?: number;
  [key: string]: unknown;
}

export interface PermitTypeRiskRow {
  type?: string;
  name?: string;
  count?: number;
  [key: string]: unknown;
}

export interface PermitsBottleneckData {
  by_level?: PermitLevelBottleneckRow[];
  by_type?: PermitTypeRiskRow[];
  [key: string]: unknown;
}

export interface PermitAgeTimelinePoint {
  days_ago?: number;
  status?: string;
  ref?: string;
  [key: string]: unknown;
}

export interface PermitExceptionRow {
  ref?: string;
  permit_ref?: string;
  type?: string;
  permit_type?: string;
  date_label?: string;
  raised_date?: string;
  expiry_date?: string;
  days_open?: number;
  status?: string;
  [key: string]: unknown;
}

export interface PermitRepeatExtensionRow {
  ref?: string;
  permit_ref?: string;
  type?: string;
  extension_count?: number;
  [key: string]: unknown;
}

export interface PermitsDetailData {
  age_timeline?: PermitAgeTimelinePoint[];
  exceptions?: PermitExceptionRow[];
  repeat_extensions?: PermitRepeatExtensionRow[];
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
  fetchFmDashboardJson<PermitsOverviewResponse>(PERMITS_ENDPOINTS.OVERVIEW, params).then((res) => res.permits_overview);

export const fetchPermitsBottleneck = (params: FmDashboardParams) =>
  fetchFmDashboardJson<PermitsBottleneckResponse>(PERMITS_ENDPOINTS.BOTTLENECK, params).then(
    (res) => res.permits_bottleneck
  );

export const fetchPermitsDetail = (params: FmDashboardParams) =>
  fetchFmDashboardJson<PermitsDetailResponse>(PERMITS_ENDPOINTS.DETAIL, params).then((res) => res.permits_detail);

// ============================================================================
// Incidents (Safety module)
// ============================================================================
// Same caveat as Permits: not verified against a live response. Two field
// names ARE confirmed from the reference doc's Notes section: `sohi_score`
// (on incidents_overview — combine client-side with permits_overview's
// permit_compliance for the SOHI-vs-Permit-Compliance contradiction card) and
// `avg_resolution_time` + `sample_size` (on incidents_analysis — the note
// warns this is thin, only ~44 incidents system-wide have a real closure
// timestamp, so check sample_size before trusting the number). Everything
// else follows this API's established naming convention. The doc also notes
// `level_wise`/`status_summary`/`top_categories`/`incident_kpis`/`rca_data`
// are NOT part of these 4 endpoints — they live on a separate, pre-existing
// `incident_dashboard/*` surface that this integration does not touch.

export interface IncidentsStatusBreakdown {
  open?: number;
  under_investigation?: number;
  pending?: number;
  closed?: number;
  final_closure?: number;
  provisional_closure?: number;
  [key: string]: unknown;
}

export interface IncidentsOverviewData {
  total_incidents: number;
  status_breakdown?: IncidentsStatusBreakdown;
  /** Confirmed field — see file-header note. */
  sohi_score?: number;
  near_miss_rate?: number;
  incidents_per_million_sqft?: number;
  ltir?: number;
  safe_man_hours?: number;
  external_support_count?: number;
  external_support_percent?: number;
  /** Raw underlying record count, when it differs from total_incidents (data-quality flag). */
  raw_record_count?: number;
  [key: string]: unknown;
}

export interface IncidentTrendPoint {
  month?: string;
  incidents?: number;
  [key: string]: unknown;
}

export interface IncidentsTrendData {
  monthly_trend?: IncidentTrendPoint[];
  [key: string]: unknown;
}

export interface IncidentSeverityRow {
  name?: string;
  severity?: string;
  count?: number;
  value?: number;
  [key: string]: unknown;
}

export interface IncidentRootCauseRow {
  name?: string;
  cause?: string;
  count?: number;
  value?: number;
  [key: string]: unknown;
}

export interface IncidentCategoryRow {
  category?: string;
  name?: string;
  count?: number;
  percent?: number;
  [key: string]: unknown;
}

export interface IncidentsAnalysisData {
  severity_distribution?: IncidentSeverityRow[];
  root_cause_breakdown?: IncidentRootCauseRow[];
  category_breakdown?: IncidentCategoryRow[];
  closure_rate_percent?: number;
  /** Confirmed field — see file-header note. Thin: only ~44 incidents system-wide have a real closure timestamp. */
  avg_resolution_time?: number;
  /** Confirmed field — check before trusting avg_resolution_time. */
  sample_size?: number;
  closure_integrity_percent?: number;
  closure_integrity_sample_size?: number;
  safety_compliance_score?: number;
  [key: string]: unknown;
}

export interface IncidentLocationRow {
  location?: string;
  name?: string;
  count?: number;
  [key: string]: unknown;
}

export interface IncidentBodyPartRow {
  category?: string;
  name?: string;
  [bodyPart: string]: unknown;
}

export interface IncidentsHotspotsData {
  by_location?: IncidentLocationRow[];
  by_body_part?: IncidentBodyPartRow[];
  [key: string]: unknown;
}

interface IncidentsOverviewResponse {
  success: number;
  message: string;
  incidents_overview: IncidentsOverviewData;
  filters: FmDashboardFilters;
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

const INCIDENTS_ENDPOINTS = {
  OVERVIEW: "/fm_dashboard/incident/incidents_overview",
  TREND: "/fm_dashboard/incident/incidents_trend",
  ANALYSIS: "/fm_dashboard/incident/incidents_analysis",
  HOTSPOTS: "/fm_dashboard/incident/incidents_hotspots",
} as const;

export const fetchIncidentsOverview = (params: FmDashboardParams) =>
  fetchFmDashboardJson<IncidentsOverviewResponse>(INCIDENTS_ENDPOINTS.OVERVIEW, params).then(
    (res) => res.incidents_overview
  );

export const fetchIncidentsTrend = (params: FmDashboardParams) =>
  fetchFmDashboardJson<IncidentsTrendResponse>(INCIDENTS_ENDPOINTS.TREND, params).then((res) => res.incidents_trend);

export const fetchIncidentsAnalysis = (params: FmDashboardParams) =>
  fetchFmDashboardJson<IncidentsAnalysisResponse>(INCIDENTS_ENDPOINTS.ANALYSIS, params).then(
    (res) => res.incidents_analysis
  );

export const fetchIncidentsHotspots = (params: FmDashboardParams) =>
  fetchFmDashboardJson<IncidentsHotspotsResponse>(INCIDENTS_ENDPOINTS.HOTSPOTS, params).then(
    (res) => res.incidents_hotspots
  );

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
