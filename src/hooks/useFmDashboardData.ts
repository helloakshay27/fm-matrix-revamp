// FM Dashboard data-fetching hooks — one file for all 10 module sections
// (Tickets, Assets, Audit, AMC, Checklists, Inventory, Waste, Attendance,
// Survey, Vendor) instead of one hook per module. Each hook follows the same
// shape: fetch its module's endpoints in parallel via Promise.all, skip
// entirely while `enabled` is false or sites/dates aren't resolved yet.
import { useEffect, useState } from "react";
import {
  fetchTicketsOverview,
  fetchTicketsTrends,
  fetchTicketsBreakdown,
  fetchTicketsWorkforce,
  fetchTicketsQuality,
  type TicketsOverviewData,
  type TicketsTrendsData,
  type TicketsBreakdownData,
  type TicketsWorkforceData,
  type TicketsQualityData,
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
  type InventoryOverviewData,
  type InventoryStockHealthData,
  type InventoryConsumptionData,
  type InventoryOperationsData,
  fetchWasteOverview,
  fetchWasteBreakdown,
  fetchWasteTrend,
  fetchWasteVendor,
  type WasteOverviewData,
  type WasteBreakdownData,
  type WasteTrendData,
  type WasteVendorData,
  fetchAttendanceOverview,
  fetchAttendanceDepartment,
  fetchAttendanceTrend,
  fetchAttendancePatterns,
  type AttendanceOverviewData,
  type AttendanceDepartmentData,
  type AttendanceTrendData,
  type AttendancePatternsData,
  fetchSurveyOverview,
  fetchSurveyBreakdown,
  fetchSurveyTrend,
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
  fetchIncidentsOverview,
  fetchIncidentsTrend,
  fetchIncidentsAnalysis,
  fetchIncidentsHotspots,
  type IncidentsOverviewData,
  type IncidentsTrendData,
  type IncidentsAnalysisData,
  type IncidentsHotspotsData,
} from "@/services/fmDashboardAPI";

interface UseFmDashboardModuleArgs {
  siteIds: number[];
  fromDate: string;
  toDate: string;
  /** Skip fetching entirely (e.g. while this section isn't on screen, or sites haven't resolved yet). */
  enabled: boolean;
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
}

const EMPTY_TICKETS_DATA: TicketsDashboardData = {
  overview: null,
  trends: null,
  breakdown: null,
  workforce: null,
  quality: null,
};

export function useTicketsDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
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
    ])
      .then(([overview, trends, breakdown, workforce, quality]) => {
        if (cancelled) return;
        setData({ overview, trends, breakdown, workforce, quality });
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

export function useAssetsDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
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

export function useAuditDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
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

export function useAmcDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
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

export function useChecklistsDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
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
}

const EMPTY_INVENTORY_DATA: InventoryDashboardData = {
  overview: null,
  stockHealth: null,
  consumption: null,
  operations: null,
};

export function useInventoryDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
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
    ])
      .then(([overview, stockHealth, consumption, operations]) => {
        if (cancelled) return;
        setData({ overview, stockHealth, consumption, operations });
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
}

const EMPTY_WASTE_DATA: WasteDashboardData = {
  overview: null,
  breakdown: null,
  trend: null,
  vendor: null,
};

export function useWasteDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
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
    Promise.all([fetchWasteOverview(params), fetchWasteBreakdown(params), fetchWasteTrend(params), fetchWasteVendor(params)])
      .then(([overview, breakdown, trend, vendor]) => {
        if (cancelled) return;
        setData({ overview, breakdown, trend, vendor });
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
}

const EMPTY_ATTENDANCE_DATA: AttendanceDashboardData = {
  overview: null,
  department: null,
  trend: null,
  patterns: null,
};

export function useAttendanceDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
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
    ])
      .then(([overview, department, trend, patterns]) => {
        if (cancelled) return;
        setData({ overview, department, trend, patterns });
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
}

const EMPTY_SURVEY_DATA: SurveyDashboardData = {
  overview: null,
  breakdown: null,
  trend: null,
  timing: null,
};

export function useSurveyDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
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
    Promise.all([fetchSurveyOverview(params), fetchSurveyBreakdown(params), fetchSurveyTrend(params), fetchSurveyTiming(params)])
      .then(([overview, breakdown, trend, timing]) => {
        if (cancelled) return;
        setData({ overview, breakdown, trend, timing });
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
}

const EMPTY_VENDOR_DATA: VendorDashboardData = {
  overview: null,
  performance: null,
  repeatIssues: null,
  kycRisk: null,
};

export function useVendorDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
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
    ])
      .then(([overview, performance, repeatIssues, kycRisk]) => {
        if (cancelled) return;
        setData({ overview, performance, repeatIssues, kycRisk });
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

export function usePermitsDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
  const [data, setData] = useState<PermitsDashboardData>(EMPTY_PERMITS_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const siteIdsKey = siteIds.join(",");

  useEffect(() => {
    if (!enabled || siteIds.length === 0 || !fromDate || !toDate) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const params = { siteIds, fromDate, toDate };
    Promise.all([fetchPermitsOverview(params), fetchPermitsBottleneck(params), fetchPermitsDetail(params)])
      .then(([overview, bottleneck, detail]) => {
        if (cancelled) return;
        setData({ overview, bottleneck, detail });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
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
  overview: IncidentsOverviewData | null;
  trend: IncidentsTrendData | null;
  analysis: IncidentsAnalysisData | null;
  hotspots: IncidentsHotspotsData | null;
}

const EMPTY_INCIDENTS_DATA: IncidentsDashboardData = {
  overview: null,
  trend: null,
  analysis: null,
  hotspots: null,
};

export function useIncidentsDashboardData({ siteIds, fromDate, toDate, enabled }: UseFmDashboardModuleArgs) {
  const [data, setData] = useState<IncidentsDashboardData>(EMPTY_INCIDENTS_DATA);
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
      fetchIncidentsOverview(params),
      fetchIncidentsTrend(params),
      fetchIncidentsAnalysis(params),
      fetchIncidentsHotspots(params),
    ])
      .then(([overview, trend, analysis, hotspots]) => {
        if (cancelled) return;
        setData({ overview, trend, analysis, hotspots });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
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
