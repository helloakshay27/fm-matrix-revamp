// FM Dashboard data-fetching hooks — one file for all 11 module sections
// (Tickets, Assets, Audit, AMC, Checklists, Inventory, Waste, Attendance,
// Survey, Vendor, Safety) instead of one hook per module. Each hook follows the same
// shape: fetch its module's endpoints in parallel via Promise.all, skip
// entirely while `enabled` is false or sites/dates aren't resolved yet.
import { useEffect, useRef, useState } from "react";
import {
  fetchTicketsOverview,
  fetchTicketsTrends,
  fetchTicketsBreakdown,
  fetchTicketsWorkforce,
  fetchTicketsQuality,
  fetchTicketsByTenant,
  fetchTicketsCsat,
  fetchTicketsApproachingEscalation,
  fetchTicketsCategoryComparison,
  type TicketsByTenantRow,
  type TicketsCsatData,
  type TicketsApproachingEscalationData,
  type TicketsCategoryComparisonRow,
  type TicketsOverviewData,
  type TicketsTrendsData,
  type TicketsBreakdownData,
  type TicketsWorkforceData,
  type TicketsQualityData,
  fetchVendorPerformanceTable,
  fetchVendorPerformanceScore,
  fetchVendorOnTimeCompletion,
  fetchVendorHealth,
  fetchVendorContractRenewals,
  fetchVendorResponseTrend,
  fetchVendorWorkflowBottlenecks,
  fetchVendorKycStatus,
  type VendorPerformanceTableRow,
  type VendorPerformanceScoreData,
  type VendorOnTimeCompletionData,
  type VendorHealthData,
  type VendorContractRenewalsData,
  type VendorResponseTrendData,
  type VendorWorkflowBottlenecksData,
  type VendorKycStatusData,
  fetchAssetsOverview,
  fetchAssetsCondition,
  fetchAssetsCategory,
  fetchAssetsMaintenance,
  type AssetsOverviewData,
  type AssetsConditionData,
  type AssetsCategoryData,
  type AssetsMaintenanceData,
  fetchAuditsOverview,
  fetchAuditsAssetCompliance,
  fetchAuditsExecution,
  fetchAuditsFindings,
  type AuditsOverviewData,
  type AuditsAssetComplianceData,
  type AuditsExecutionData,
  type AuditsFindingsData,
  fetchAmcOverview,
  fetchAmcExpiry,
  fetchAmcVendor,
  fetchAmcCoverage,
  type AmcOverviewData,
  type AmcExpiryData,
  type AmcVendorData,
  type AmcCoverageData,
  fetchChecklistsOverview,
  fetchChecklistsCompliance,
  fetchChecklistsTrends,
  fetchChecklistsFindings,
  type ChecklistsOverviewData,
  type ChecklistsComplianceData,
  type ChecklistsTrendsData,
  type ChecklistsFindingsData,
  fetchInventoryOverview,
  fetchInventoryStockHealth,
  fetchInventoryConsumption,
  fetchInventoryOperations,
  fetchInventoryKpisTable,
  type InventoryOverviewData,
  type InventoryStockHealthData,
  type InventoryConsumptionData,
  type InventoryOperationsData,
  fetchWasteOverview,
  fetchWasteBreakdown,
  fetchWasteTrend,
  fetchWasteVendor,
  fetchWasteRecords,
  type WasteOverviewData,
  type WasteBreakdownData,
  type WasteTrendData,
  type WasteVendorData,
  fetchAttendanceOverview,
  fetchAttendanceDepartment,
  fetchAttendanceTrend,
  fetchAttendancePatterns,
  fetchAttendanceStaffingGapVsBreach,
  type AttendanceOverviewData,
  type AttendanceDepartmentData,
  type AttendanceTrendData,
  type AttendancePatternsData,
  type AttendanceStaffingGapVsBreachData,
  fetchSurveyOverview,
  fetchSurveyBreakdown,
  fetchSurveyTrend,
  fetchSurveyWeeklyCsatBreakdown,
  fetchSurveyTiming,
  type SurveyOverviewData,
  type SurveyBreakdownData,
  type SurveyTrendData,
  type SurveyTimingData,
  fetchVendorOverview,
  fetchVendorPerformance,
  fetchVendorRepeatIssues,
  fetchVendorKycRisk,
  type VendorOverviewData,
  type VendorPerformanceData,
  type VendorRepeatIssuesData,
  type VendorKycRiskData,
  fetchPermitsOverview,
  fetchPermitsBottleneck,
  fetchPermitsDetail,
  type PermitsOverviewData,
  type PermitsBottleneckData,
  type PermitsDetailData,
  fetchIncidentKpis,
  fetchIncidentsTrend,
  fetchIncidentsAnalysis,
  fetchIncidentsHotspots,
  type IncidentKpisData,
  type IncidentsTrendData,
  type IncidentsAnalysisData,
  type IncidentsHotspotsData,
  fetchFinancePendingApprovals,
  fetchFinanceDraftPrs,
  fetchFinanceProcurementPipeline,
  fetchFinancePendingValue,
  fetchFinancePrSrSplit,
  fetchFinanceOverdueInvoices,
  fetchFinanceApprovalQueue,
  fetchFinanceTopPendingRecords,
  type FinanceRecord,
  fetchFinanceAlertsAiInsight,
  fetchFinancialIntelligenceAiInsight,
  fetchBillInformationAiInsight,
  fetchOverdueInvoicesAiInsight,
  fetchApprovalQueueAiInsight,
  fetchPoWoGrnSesAiInsight,
  fetchCustomersAiInsight,
  fetchEventsAiInsight,
  type AiInsightRecord,
} from "@/services/fmDashboardAPI";

interface UseFmDashboardModuleArgs {
  siteIds: number[];
  fromDate: string;
  toDate: string;
  /** Skip fetching entirely (e.g. while this section isn't on screen, or sites haven't resolved yet). */
  enabled: boolean;
}

/**
 * Keeps a module's data alive across tab switches.
 *
 * Each dashboard section passes `enabled` = "this tab is showing", so leaving a tab and coming back
 * flipped it false → true and every hook re-ran all of its requests. Instead, a module is switched on
 * the first time it's shown and then stays on, and its site / date params are only updated while it
 * is actually visible. Result: switching tabs never refetches; changing the site or date range
 * refetches once, when the user next looks at that tab (and immediately for the tab they're on); a
 * full page reload starts from scratch.
 */
function useKeepAliveArgs(args: UseFmDashboardModuleArgs): UseFmDashboardModuleArgs {
  const activated = useRef(false);
  const snapshot = useRef({ siteIds: args.siteIds, fromDate: args.fromDate, toDate: args.toDate });
  if (args.enabled) {
    activated.current = true;
    snapshot.current = { siteIds: args.siteIds, fromDate: args.fromDate, toDate: args.toDate };
  }
  return { ...snapshot.current, enabled: activated.current };
}

// ============================================================================
// Tickets
// ============================================================================

export interface TicketsDashboardData {
  overview: TicketsOverviewData | null;
  trends: TicketsTrendsData | null;
  breakdown: TicketsBreakdownData | null;
  workforce: TicketsWorkforceData | null;
  quality: TicketsQualityData | null;
  byTenant: TicketsByTenantRow[];
  csat: TicketsCsatData | null;
  approachingEscalation: TicketsApproachingEscalationData | null;
  categoryComparison: TicketsCategoryComparisonRow[];
}

const EMPTY_TICKETS_DATA: TicketsDashboardData = {
  overview: null,
  trends: null,
  breakdown: null,
  workforce: null,
  quality: null,
  byTenant: [],
  csat: null,
  approachingEscalation: null,
  categoryComparison: [],
};

// Secondary endpoints must never take the whole module down if one of them errors.
const optional = <T,>(request: Promise<T>): Promise<T | null> => request.catch(() => null);

export function useTicketsDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<TicketsDashboardData>(EMPTY_TICKETS_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchTicketsOverview(params),
      fetchTicketsTrends(params),
      fetchTicketsBreakdown(params),
      fetchTicketsWorkforce(params),
      fetchTicketsQuality(params),
      optional(fetchTicketsByTenant(params)),
      optional(fetchTicketsCsat(params)),
      optional(fetchTicketsApproachingEscalation(params)),
      optional(fetchTicketsCategoryComparison(params)),
    ])
      .then(([overview, trends, breakdown, workforce, quality, byTenant, csat, approachingEscalation, categoryComparison]) => {
        if (cancelled) return;
        setData({
          overview,
          trends,
          breakdown,
          workforce,
          quality,
          byTenant: byTenant ?? [],
          csat,
          approachingEscalation,
          categoryComparison: categoryComparison ?? [],
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load tickets dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Assets
// ============================================================================

export interface AssetsDashboardData {
  overview: AssetsOverviewData | null;
  condition: AssetsConditionData | null;
  category: AssetsCategoryData | null;
  maintenance: AssetsMaintenanceData | null;
}

const EMPTY_ASSETS_DATA: AssetsDashboardData = {
  overview: null,
  condition: null,
  category: null,
  maintenance: null,
};

export function useAssetsDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<AssetsDashboardData>(EMPTY_ASSETS_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchAssetsOverview(params),
      fetchAssetsCondition(params),
      fetchAssetsCategory(params),
      fetchAssetsMaintenance(params),
    ])
      .then(([overview, condition, category, maintenance]) => {
        if (cancelled) return;
        setData({ overview, condition, category, maintenance });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load assets dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Audit
// ============================================================================

export interface AuditDashboardData {
  overview: AuditsOverviewData | null;
  assetCompliance: AuditsAssetComplianceData | null;
  execution: AuditsExecutionData | null;
  findings: AuditsFindingsData | null;
}

const EMPTY_AUDIT_DATA: AuditDashboardData = {
  overview: null,
  assetCompliance: null,
  execution: null,
  findings: null,
};

export function useAuditDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<AuditDashboardData>(EMPTY_AUDIT_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchAuditsOverview(params),
      fetchAuditsAssetCompliance(params),
      fetchAuditsExecution(params),
      fetchAuditsFindings(params),
    ])
      .then(([overview, assetCompliance, execution, findings]) => {
        if (cancelled) return;
        setData({ overview, assetCompliance, execution, findings });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load audit dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// AMC
// ============================================================================

export interface AmcDashboardData {
  overview: AmcOverviewData | null;
  expiry: AmcExpiryData | null;
  vendor: AmcVendorData | null;
  coverage: AmcCoverageData | null;
}

const EMPTY_AMC_DATA: AmcDashboardData = {
  overview: null,
  expiry: null,
  vendor: null,
  coverage: null,
};

export function useAmcDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<AmcDashboardData>(EMPTY_AMC_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([fetchAmcOverview(params), fetchAmcExpiry(params), fetchAmcVendor(params), fetchAmcCoverage(params)])
      .then(([overview, expiry, vendor, coverage]) => {
        if (cancelled) return;
        setData({ overview, expiry, vendor, coverage });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load AMC dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Checklists
// ============================================================================

export interface ChecklistsDashboardData {
  overview: ChecklistsOverviewData | null;
  compliance: ChecklistsComplianceData | null;
  trends: ChecklistsTrendsData | null;
  findings: ChecklistsFindingsData | null;
}

const EMPTY_CHECKLISTS_DATA: ChecklistsDashboardData = {
  overview: null,
  compliance: null,
  trends: null,
  findings: null,
};

export function useChecklistsDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<ChecklistsDashboardData>(EMPTY_CHECKLISTS_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchChecklistsOverview(params),
      fetchChecklistsCompliance(params),
      fetchChecklistsTrends(params),
      fetchChecklistsFindings(params),
    ])
      .then(([overview, compliance, trends, findings]) => {
        if (cancelled) return;
        setData({ overview, compliance, trends, findings });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load checklists dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Inventory
// ============================================================================

export interface InventoryDashboardData {
  overview: InventoryOverviewData | null;
  stockHealth: InventoryStockHealthData | null;
  consumption: InventoryConsumptionData | null;
  operations: InventoryOperationsData | null;
  kpisTable: unknown;
}

const EMPTY_INVENTORY_DATA: InventoryDashboardData = {
  overview: null,
  stockHealth: null,
  consumption: null,
  operations: null,
  kpisTable: null,
};

export function useInventoryDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<InventoryDashboardData>(EMPTY_INVENTORY_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchInventoryOverview(params),
      fetchInventoryStockHealth(params),
      fetchInventoryConsumption(params),
      fetchInventoryOperations(params),
      fetchInventoryKpisTable(params),
    ])
      .then(([overview, stockHealth, consumption, operations, kpisTable]) => {
        if (cancelled) return;
        setData({ overview, stockHealth, consumption, operations, kpisTable });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load inventory dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Waste
// ============================================================================

export interface WasteDashboardData {
  overview: WasteOverviewData | null;
  breakdown: WasteBreakdownData | null;
  trend: WasteTrendData | null;
  vendor: WasteVendorData | null;
  records: unknown;
}

const EMPTY_WASTE_DATA: WasteDashboardData = {
  overview: null,
  breakdown: null,
  trend: null,
  vendor: null,
  records: null,
};

export function useWasteDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<WasteDashboardData>(EMPTY_WASTE_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchWasteOverview(params),
      fetchWasteBreakdown(params),
      fetchWasteTrend(params),
      fetchWasteVendor(params),
      fetchWasteRecords(params),
    ])
      .then(([overview, breakdown, trend, vendor, records]) => {
        if (cancelled) return;
        setData({ overview, breakdown, trend, vendor, records });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load waste dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Attendance
// ============================================================================

export interface AttendanceDashboardData {
  overview: AttendanceOverviewData | null;
  department: AttendanceDepartmentData | null;
  trend: AttendanceTrendData | null;
  patterns: AttendancePatternsData | null;
  staffingGapVsBreach: unknown;
}

const EMPTY_ATTENDANCE_DATA: AttendanceDashboardData = {
  overview: null,
  department: null,
  trend: null,
  patterns: null,
  staffingGapVsBreach: null,
};

export function useAttendanceDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<AttendanceDashboardData>(EMPTY_ATTENDANCE_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchAttendanceOverview(params),
      fetchAttendanceDepartment(params),
      fetchAttendanceTrend(params),
      fetchAttendancePatterns(params),
      fetchAttendanceStaffingGapVsBreach(params),
    ])
      .then(([overview, department, trend, patterns, staffingGapVsBreach]) => {
        if (cancelled) return;
        setData({ overview, department, trend, patterns, staffingGapVsBreach });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load attendance dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Survey
// ============================================================================

export interface SurveyDashboardData {
  overview: SurveyOverviewData | null;
  breakdown: SurveyBreakdownData | null;
  trend: SurveyTrendData | null;
  timing: SurveyTimingData | null;
  weeklyCsatBreakdown: unknown;
}

const EMPTY_SURVEY_DATA: SurveyDashboardData = {
  overview: null,
  breakdown: null,
  trend: null,
  timing: null,
  weeklyCsatBreakdown: null,
};

export function useSurveyDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<SurveyDashboardData>(EMPTY_SURVEY_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchSurveyOverview(params),
      fetchSurveyBreakdown(params),
      fetchSurveyTrend(params),
      fetchSurveyWeeklyCsatBreakdown(params),
      fetchSurveyTiming(params),
    ])
      .then(([overview, breakdown, trend, weeklyCsatBreakdown, timing]) => {
        if (cancelled) return;
        setData({ overview, breakdown, trend, weeklyCsatBreakdown, timing });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load survey dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Vendor
// ============================================================================

export interface VendorDashboardData {
  overview: VendorOverviewData | null;
  performance: VendorPerformanceData | null;
  repeatIssues: VendorRepeatIssuesData | null;
  kycRisk: VendorKycRiskData | null;
  performanceTable: VendorPerformanceTableRow[];
  performanceScore: VendorPerformanceScoreData | null;
  onTimeCompletion: VendorOnTimeCompletionData | null;
  health: VendorHealthData | null;
  contractRenewals: VendorContractRenewalsData | null;
  responseTrend: VendorResponseTrendData | null;
  workflowBottlenecks: VendorWorkflowBottlenecksData | null;
  kycStatus: VendorKycStatusData | null;
}

const EMPTY_VENDOR_DATA: VendorDashboardData = {
  overview: null,
  performance: null,
  repeatIssues: null,
  kycRisk: null,
  performanceTable: [],
  performanceScore: null,
  onTimeCompletion: null,
  health: null,
  contractRenewals: null,
  responseTrend: null,
  workflowBottlenecks: null,
  kycStatus: null,
};

export function useVendorDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<VendorDashboardData>(EMPTY_VENDOR_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchVendorOverview(params),
      fetchVendorPerformance(params),
      fetchVendorRepeatIssues(params),
      fetchVendorKycRisk(params),
      optional(fetchVendorPerformanceTable(params)),
      optional(fetchVendorPerformanceScore(params)),
      optional(fetchVendorOnTimeCompletion(params)),
      optional(fetchVendorHealth(params)),
      optional(fetchVendorContractRenewals(params)),
      optional(fetchVendorResponseTrend(params)),
      optional(fetchVendorWorkflowBottlenecks(params)),
      optional(fetchVendorKycStatus(params)),
    ])
      .then(
        ([
          overview,
          performance,
          repeatIssues,
          kycRisk,
          performanceTable,
          performanceScore,
          onTimeCompletion,
          health,
          contractRenewals,
          responseTrend,
          workflowBottlenecks,
          kycStatus,
        ]) => {
        if (cancelled) return;
        setData({
          overview,
          performance,
          repeatIssues,
          kycRisk,
          performanceTable: performanceTable ?? [],
          performanceScore,
          onTimeCompletion,
          health,
          contractRenewals,
          responseTrend,
          workflowBottlenecks,
          kycStatus,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load vendor dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Permits (Safety module)
// ============================================================================

export interface PermitsDashboardData {
  overview: PermitsOverviewData | null;
  bottleneck: PermitsBottleneckData | null;
  detail: PermitsDetailData | null;
}

const EMPTY_PERMITS_DATA: PermitsDashboardData = {
  overview: null,
  bottleneck: null,
  detail: null,
};

export function usePermitsDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<PermitsDashboardData>(EMPTY_PERMITS_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(EMPTY_PERMITS_DATA);

    const params = { siteIds, fromDate, toDate };
    Promise.all([fetchPermitsOverview(params), fetchPermitsBottleneck(params), fetchPermitsDetail(params)])
      .then(([overview, bottleneck, detail]) => {
        if (cancelled) return;
        setData({ overview, bottleneck, detail });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setData(EMPTY_PERMITS_DATA);
        setError(err instanceof Error ? err.message : "Failed to load permits dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Incidents (Safety module)
// ============================================================================

export interface IncidentsDashboardData {
  kpis: IncidentKpisData | null;
  trend: IncidentsTrendData | null;
  analysis: IncidentsAnalysisData | null;
  hotspots: IncidentsHotspotsData | null;
}

const EMPTY_INCIDENTS_DATA: IncidentsDashboardData = {
  kpis: null,
  trend: null,
  analysis: null,
  hotspots: null,
};

export function useIncidentsDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<IncidentsDashboardData>(EMPTY_INCIDENTS_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(EMPTY_INCIDENTS_DATA);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchIncidentKpis(siteIds),
      fetchIncidentsTrend(params),
      fetchIncidentsAnalysis(params),
      fetchIncidentsHotspots(params),
    ])
      .then(([kpis, trend, analysis, hotspots]) => {
        if (cancelled) return;
        setData({ kpis, trend, analysis, hotspots });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setData(EMPTY_INCIDENTS_DATA);
        setError(err instanceof Error ? err.message : "Failed to load incidents dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// CRM
// ============================================================================

export interface CrmDashboardData {
  leaseOverview: FinanceRecord | FinanceRecord[] | null;
  eventsOverview: FinanceRecord | FinanceRecord[] | null;
  broadcastOverview: FinanceRecord | FinanceRecord[] | null;
  walletOverview: FinanceRecord | FinanceRecord[] | null;
  walletDistribution: FinanceRecord | FinanceRecord[] | null;
  walletTransactions: FinanceRecord | FinanceRecord[] | null;
  // AI-insight endpoints — see extractAiInsights() in fmDashboardAPI.ts for how these are read.
  customersInsight: AiInsightRecord | null;
  eventsInsight: AiInsightRecord | null;
}

const EMPTY_CRM_DATA: CrmDashboardData = {
  leaseOverview: null,
  eventsOverview: null,
  broadcastOverview: null,
  walletOverview: null,
  walletDistribution: null,
  walletTransactions: null,
  customersInsight: null,
  eventsInsight: null,
};

export function useCrmDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<CrmDashboardData>(EMPTY_CRM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    console.log("[useCrmDashboardData] enabled:", enabled, "siteIds:", siteIds, "fromDate:", fromDate, "toDate:", toDate);
    if (!enabled || siteIds.length === 0) {
      console.log("[useCrmDashboardData] Skipping: enabled=", enabled, "siteIds.length=", siteIds.length);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);

    console.log("[useCrmDashboardData] Starting fetch with params:", { siteIds, fromDate, toDate });
    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchCrmLeaseOverview(params),
      fetchCrmEventsOverview(params),
      fetchCrmBroadcastOverview(params),
      fetchCrmWalletOverview(params),
      fetchCrmWalletDistribution(params),
      fetchCrmWalletTransactions(params),
      fetchCustomersAiInsight(params),
      fetchEventsAiInsight(params),
    ])
      .then(
        ([
          leaseOverview,
          eventsOverview,
          broadcastOverview,
          walletOverview,
          walletDistribution,
          walletTransactions,
          customersInsight,
          eventsInsight,
        ]) => {
          if (cancelled) return;
          console.log("[useCrmDashboardData] Data loaded successfully:", {
            leaseOverview,
            eventsOverview,
            broadcastOverview,
            walletOverview,
            walletDistribution,
            walletTransactions,
            customersInsight,
            eventsInsight,
          });
          setData({
            leaseOverview,
            eventsOverview,
            broadcastOverview,
            walletOverview,
            walletDistribution,
            walletTransactions,
            customersInsight,
            eventsInsight,
          });
        }
      )
      .catch((err: unknown) => {
        if (cancelled) return;
        const errorMsg = err instanceof Error ? err.message : "Failed to load CRM dashboard data";
        console.error("[useCrmDashboardData] Error:", errorMsg, err);
        setError(errorMsg);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}

// ============================================================================
// Finance
// ============================================================================
// See the file-header comment above fetchFinanceValue in fmDashboardAPI.ts —
// these 8 endpoints are each an independent resource (no shared `_overview`),
// and site_id is the only confirmed param (from_date/to_date are sent anyway
// for consistency with every other module, in case the backend accepts them).

export interface FinanceDashboardData {
  pendingApprovals: FinanceRecord | FinanceRecord[] | null;
  draftPrs: FinanceRecord | FinanceRecord[] | null;
  procurementPipeline: FinanceRecord | FinanceRecord[] | null;
  pendingValue: FinanceRecord | FinanceRecord[] | null;
  prSrSplit: FinanceRecord | FinanceRecord[] | null;
  overdueInvoices: FinanceRecord | FinanceRecord[] | null;
  approvalQueue: FinanceRecord | FinanceRecord[] | null;
  topPendingRecords: FinanceRecord | FinanceRecord[] | null;
  // AI-insight endpoints — see extractAiInsights() in fmDashboardAPI.ts for how these are read.
  financeAlertsInsight: AiInsightRecord | null;
  financialIntelligenceInsight: AiInsightRecord | null;
  billInformationInsight: AiInsightRecord | null;
  overdueInvoicesInsight: AiInsightRecord | null;
  approvalQueueInsight: AiInsightRecord | null;
  poWoGrnSesInsight: AiInsightRecord | null;
}

const EMPTY_FINANCE_DATA: FinanceDashboardData = {
  pendingApprovals: null,
  draftPrs: null,
  procurementPipeline: null,
  pendingValue: null,
  prSrSplit: null,
  overdueInvoices: null,
  approvalQueue: null,
  topPendingRecords: null,
  financeAlertsInsight: null,
  financialIntelligenceInsight: null,
  billInformationInsight: null,
  overdueInvoicesInsight: null,
  approvalQueueInsight: null,
  poWoGrnSesInsight: null,
};

export function useFinanceDashboardData(rawArgs: UseFmDashboardModuleArgs) {
  const { siteIds, fromDate, toDate, enabled } = useKeepAliveArgs(rawArgs);
  const [data, setData] = useState<FinanceDashboardData>(EMPTY_FINANCE_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([
      fetchFinancePendingApprovals(params),
      fetchFinanceDraftPrs(params),
      fetchFinanceProcurementPipeline(params),
      fetchFinancePendingValue(params),
      fetchFinancePrSrSplit(params),
      fetchFinanceOverdueInvoices(params),
      fetchFinanceApprovalQueue(params),
      fetchFinanceTopPendingRecords(params),
      fetchFinanceAlertsAiInsight(params),
      fetchFinancialIntelligenceAiInsight(params),
      fetchBillInformationAiInsight(params),
      fetchOverdueInvoicesAiInsight(params),
      fetchApprovalQueueAiInsight(params),
      fetchPoWoGrnSesAiInsight(params),
    ])
      .then(
        ([
          pendingApprovals,
          draftPrs,
          procurementPipeline,
          pendingValue,
          prSrSplit,
          overdueInvoices,
          approvalQueue,
          topPendingRecords,
          financeAlertsInsight,
          financialIntelligenceInsight,
          billInformationInsight,
          overdueInvoicesInsight,
          approvalQueueInsight,
          poWoGrnSesInsight,
        ]) => {
          if (cancelled) return;
          setData({
            pendingApprovals,
            draftPrs,
            procurementPipeline,
            pendingValue,
            prSrSplit,
            overdueInvoices,
            approvalQueue,
            topPendingRecords,
            financeAlertsInsight,
            financialIntelligenceInsight,
            billInformationInsight,
            overdueInvoicesInsight,
            approvalQueueInsight,
            poWoGrnSesInsight,
          });
        }
      )
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load finance dashboard data");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, siteIdsKey, fromDate, toDate]);

  return { data, loading, error };
}
