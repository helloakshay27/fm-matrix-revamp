import { useQueries, useQuery } from '@tanstack/react-query';
import {
  fetchAdoptionEngagement,
  fetchAdoptionTrend,
  fetchGrowth,
  fetchModules,
  fetchRetention,
  fetchRoles,
  fetchTrafficSession,
  fetchUsageAndDistribution,
  fetchWorkflowUsage,
  type DeviceType,
  type RangeFilters,
  type TrafficSessionResponse,
} from './adoptionApi';
import { GROWTH_WEEKS, RETENTION_WEEKS, TREND_WEEKS } from '../data/constants';
import { fetchAllSites, fetchCompanyNames } from './sitesApi';
import {
  fetchApprovalQueue,
  fetchBroadcastOverview,
  fetchDraftPrs,
  fetchEventsOverview,
  fetchLeaseOverview,
  fetchOverdueInvoices,
  fetchPendingApprovals,
  fetchPendingRequisitionValue,
  fetchPrSrSplit,
  fetchProcurementPipeline,
  fetchTopPendingRecords,
  fetchWalletDistribution,
  fetchWalletOverview,
  fetchWalletTransactions,
} from './dashboardApi';

/** All Layer-1/2/3 calls share these; one object keeps every query key in step. */
export interface QueryFilters {
  /** False until the allowed-sites list has settled, so we don't fire every call twice. */
  enabled: boolean;
  from: string;
  to: string;
  siteIds: string[];
  devices: DeviceType[];
  licensedSeats: number | null;
  module: string | null;
  subModule: string | null;
  /** Incremented only by an explicit dashboard load/refresh action. */
  requestId?: number;
}

function ymd(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** `days` inclusive of today, matching the API's IST 00:00 → 23:59 snapping. */
export function dateRangeFor(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - (days - 1));
  return { from: ymd(from), to: ymd(to) };
}

const range = (f: QueryFilters): RangeFilters => ({
  from: f.from,
  to: f.to,
  siteIds: f.siteIds,
  devices: f.devices,
});

/** Analytics is read-mostly and each call is a multi-second ClickHouse scan — cache generously. */
const CACHE = {
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: false,
} as const;

const keyBase = (f: QueryFilters) => [
  f.from,
  f.to,
  f.siteIds.join(','),
  f.devices.join(','),
  f.requestId ?? 0,
];

/** Every site on the tenant — drives the scope dropdown and the site-wise fan-out. */
export function useAllSites(enabled = true) {
  return useQuery({
    queryKey: ['fm-adoption', 'all-sites'],
    queryFn: fetchAllSites,
    // A user click produces one request. Do not retry implicitly.
    enabled,
    retry: false,
    staleTime: 30 * 60_000,
    gcTime: 60 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

/** Company id → name, for labelling the Regional tier. Never blocks: failure yields {}. */
export function useCompanyNames(enabled = true) {
  return useQuery({
    queryKey: ['fm-adoption', 'company-names'],
    queryFn: fetchCompanyNames,
    enabled,
    retry: false,
    staleTime: 30 * 60_000,
    gcTime: 60 * 60_000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
}

export function useTrafficSession(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'traffic_session', ...keyBase(f)],
    queryFn: () => fetchTrafficSession(range(f)),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useUsageAndDistribution(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'usage_and_distribution', ...keyBase(f)],
    queryFn: () => fetchUsageAndDistribution(range(f)),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useAdoptionEngagement(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'adoption_engagement', ...keyBase(f), f.licensedSeats],
    queryFn: () => fetchAdoptionEngagement({ ...range(f), licensedSeats: f.licensedSeats }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useAdoptionTrend(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'adoption_trend', f.to, f.siteIds.join(','), f.devices.join(','), f.requestId ?? 0],
    queryFn: () =>
      fetchAdoptionTrend({
        to: f.to,
        weeks: TREND_WEEKS,
        siteIds: f.siteIds,
        devices: f.devices,
      }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useGrowth(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'growth', f.to, f.siteIds.join(','), f.devices.join(','), f.requestId ?? 0],
    queryFn: () =>
      fetchGrowth({ to: f.to, weeks: GROWTH_WEEKS, siteIds: f.siteIds, devices: f.devices }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useRetention(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'retention', f.to, f.siteIds.join(','), f.devices.join(','), f.requestId ?? 0],
    queryFn: () =>
      fetchRetention({ to: f.to, weeks: RETENTION_WEEKS, siteIds: f.siteIds, devices: f.devices }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useRoles(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'roles', ...keyBase(f)],
    queryFn: () => fetchRoles(range(f)),
    enabled: f.enabled,
    ...CACHE,
  });
}

/** Top-level module tree (path segment 1) — drives the module nav. */
export function useModuleTree(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'modules', ...keyBase(f)],
    queryFn: () => fetchModules(range(f)),
    enabled: f.enabled,
    ...CACHE,
  });
}

/** Sub-modules of the selected module (path segment 2). */
export function useSubModuleTree(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'modules', f.module, ...keyBase(f)],
    queryFn: () => fetchModules({ ...range(f), module: f.module! }),
    enabled: f.enabled && !!f.module,
    ...CACHE,
  });
}

export function useWorkflowUsage(f: QueryFilters) {
  return useQuery({
    queryKey: [
      'fm-adoption',
      'workflow_usage',
      f.module,
      f.subModule,
      ...keyBase(f),
    ],
    queryFn: () =>
      fetchWorkflowUsage({
        ...range(f),
        module: f.module ?? undefined,
        subModule: f.subModule ?? undefined,
      }),
    enabled: f.enabled && !!f.module,
    ...CACHE,
  });
}

/** FM Matrix CRM and procurement widgets. Each endpoint gets its own cache entry so a
 * partial backend failure does not blank the rest of the dashboard. */
export function useFmDashboardQueries(f: QueryFilters) {
  const options = { enabled: f.enabled && !!f.token && f.siteIds.length > 0, ...CACHE };
  const tokenOnlyOptions = { enabled: f.enabled && !!f.token, ...CACHE };
  return {
    leaseOverview: useQuery({ queryKey: ['fm-dashboard', 'lease-overview', ...fmKey(f)], queryFn: () => fetchLeaseOverview(fmParams(f)), ...options }),
    eventsOverview: useQuery({ queryKey: ['fm-dashboard', 'events-overview', ...fmKey(f)], queryFn: () => fetchEventsOverview(fmParams(f)), ...options }),
    broadcastOverview: useQuery({ queryKey: ['fm-dashboard', 'broadcast-overview', ...fmKey(f)], queryFn: () => fetchBroadcastOverview(fmParams(f)), ...options }),
    walletOverview: useQuery({ queryKey: ['fm-dashboard', 'wallet-overview', ...fmKey(f)], queryFn: () => fetchWalletOverview(fmParams(f)), ...options }),
    walletDistribution: useQuery({ queryKey: ['fm-dashboard', 'wallet-distribution', ...fmKey(f)], queryFn: () => fetchWalletDistribution(fmParams(f)), ...options }),
    walletTransactions: useQuery({ queryKey: ['fm-dashboard', 'wallet-transactions', ...fmKey(f)], queryFn: () => fetchWalletTransactions(fmParams(f)), ...options }),
    pendingApprovals: useQuery({ queryKey: ['fm-dashboard', 'pending-approvals', ...fmKey(f)], queryFn: () => fetchPendingApprovals(fmParams(f)), ...options }),
    draftPrs: useQuery({ queryKey: ['fm-dashboard', 'draft-prs', ...fmKey(f)], queryFn: () => fetchDraftPrs(fmParams(f)), ...options }),
    procurementPipeline: useQuery({ queryKey: ['fm-dashboard', 'procurement-pipeline', ...fmKey(f)], queryFn: () => fetchProcurementPipeline(fmParams(f)), ...options }),
    pendingRequisitionValue: useQuery({ queryKey: ['fm-dashboard', 'pending-requisition-value', ...fmKey(f)], queryFn: () => fetchPendingRequisitionValue(fmParams(f)), ...options }),
    prSrSplit: useQuery({ queryKey: ['fm-dashboard', 'pr-sr-split', ...fmKey(f)], queryFn: () => fetchPrSrSplit(fmParams(f)), ...options }),
    overdueInvoices: useQuery({ queryKey: ['fm-dashboard', 'overdue-invoices', f.token], queryFn: () => fetchOverdueInvoices({ token: f.token }), ...tokenOnlyOptions }),
    approvalQueue: useQuery({ queryKey: ['fm-dashboard', 'approval-queue', ...fmKey(f)], queryFn: () => fetchApprovalQueue(fmParams(f)), ...options }),
    topPendingRecords: useQuery({ queryKey: ['fm-dashboard', 'top-pending-records', ...fmKey(f)], queryFn: () => fetchTopPendingRecords(fmParams(f)), ...options }),
  };
}

export interface SiteLeagueEntry {
  siteId: string;
  data: TrafficSessionResponse | undefined;
}

export function useSiteLeague(f: QueryFilters, siteIds: string[], enabled: boolean) {
  // `traffic_session` aggregates all supplied site ids. Query every site
  // separately so the league table contains actual per-site values.
  const queries = useQueries({
    queries: siteIds.map((siteId) => ({
      queryKey: ['fm-adoption', 'traffic_session', f.from, f.to, siteId, f.devices.join(','), f.requestId ?? 0],
      queryFn: () =>
        fetchTrafficSession({ from: f.from, to: f.to, siteIds: [siteId], devices: f.devices }),
      enabled: enabled && f.enabled,
      ...CACHE,
    })),
  });

  return {
    entries: siteIds.map((siteId, index) => ({ siteId, data: queries[index]?.data })) as SiteLeagueEntry[],
    isLoading: enabled && queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
    error: queries.find((query) => query.error)?.error ?? null,
    loaded: queries.filter((query) => query.data !== undefined).length,
    failed: queries.filter((query) => query.isError).length,
    total: siteIds.length,
  };
}
