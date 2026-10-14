import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchAdoptionEngagement,
  fetchAdoptionTrend,
  fetchGrowth,
  fetchModules,
  fetchRetention,
  fetchRecentActiveUsers,
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
  /** Raw platform/device selection ("all" | "ios" | "android") — Pulse only. */
  dev?: string;
  licensedSeats: number | null;
  module: string | null;
  subModule: string | null;
  /** Incremented only by an explicit dashboard load/refresh action. */
  requestId?: number;
  /** Auth token for FM API calls */
  token: string;
  /** Some tenants, such as Pulse, intentionally scope by project instead of site_id. */
  allowEmptySites?: boolean;
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
  dev: f.dev,
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

/** Query key components for FM Matrix API calls (token, site_id, date range). */
const fmKey = (f: QueryFilters) => [
  f.token,
  f.siteIds.join(','),
  f.from,
  f.to,
  f.requestId ?? 0,
];

/** Parameters for FM Matrix API endpoints. */
function fmParams(f: QueryFilters) {
  return {
    token: f.token,
    site_id: f.siteIds.length === 1 ? f.siteIds[0] : undefined,
    from_date: f.from,
    to_date: f.to,
  };
}

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
        dev: f.dev,
      }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useGrowth(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'growth', f.to, f.siteIds.join(','), f.devices.join(','), f.requestId ?? 0],
    queryFn: () =>
      fetchGrowth({ to: f.to, weeks: GROWTH_WEEKS, siteIds: f.siteIds, devices: f.devices, dev: f.dev }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useRetention(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'retention', f.to, f.siteIds.join(','), f.devices.join(','), f.requestId ?? 0],
    queryFn: () =>
      fetchRetention({ to: f.to, weeks: RETENTION_WEEKS, siteIds: f.siteIds, devices: f.devices, dev: f.dev }),
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

export function useRecentActiveUsers(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'recent_active_users', ...keyBase(f)],
    queryFn: () => fetchRecentActiveUsers(range(f)),
    enabled: f.enabled && (f.allowEmptySites === true || f.siteIds.length > 0),
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

export function useWorkflowUsage(
  f: QueryFilters,
  opts: { requireModule?: boolean } = {}
) {
  const requireModule = opts.requireModule ?? true;
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
    enabled: f.enabled && (!requireModule || !!f.module),
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
  // `traffic_session` aggregates all supplied site ids, so the league table still needs one
  // call per site for real per-site values. To keep the load on the analytics API down,
  // those calls run one at a time inside a single query: each site waits for the previous
  // one, on first load and on Refresh alike (separate per-site queries would all be
  // refetched in parallel). Rows stream in through `progress` as each site lands.
  const runKey = [f.from, f.to, siteIds.join(','), f.devices.join(','), f.dev ?? '', f.requestId ?? 0].join('|');
  const [progress, setProgress] = useState<{
    runKey: string;
    entries: SiteLeagueEntry[];
    failed: number;
  } | null>(null);

  const query = useQuery({
    queryKey: ['fm-adoption', 'site_league', runKey],
    queryFn: async ({ signal }) => {
      const entries: SiteLeagueEntry[] = siteIds.map((siteId) => ({ siteId, data: undefined }));
      let failed = 0;
      setProgress({ runKey, entries: entries.slice(), failed });
      for (let i = 0; i < siteIds.length; i++) {
        // Filters changed or the page unmounted: stop instead of finishing a stale run.
        if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
        try {
          const data = await fetchTrafficSession({
            from: f.from,
            to: f.to,
            siteIds: [siteIds[i]],
            devices: f.devices,
            dev: f.dev,
          });
          entries[i] = { siteId: siteIds[i], data };
        } catch {
          // One failing site must not blank the rest of the table.
          failed++;
        }
        setProgress({ runKey, entries: entries.slice(), failed });
      }
      return { entries, failed };
    },
    enabled: enabled && f.enabled && siteIds.length > 0,
    ...CACHE,
  });

  // While a run is in flight, show the rows it has fetched so far and keep the previous
  // run's values for the sites it hasn't reached yet, so a Refresh doesn't blank the table.
  const live = query.isFetching && progress?.runKey === runKey ? progress : null;
  const previous = query.data?.entries ?? [];
  const entries: SiteLeagueEntry[] = live
    ? live.entries.map((e) => (e.data ? e : previous.find((p) => p.siteId === e.siteId) ?? e))
    : previous.length
      ? previous
      : siteIds.map((siteId) => ({ siteId, data: undefined }));
  const failed = live ? live.failed : query.data?.failed ?? 0;

  return {
    entries,
    isLoading: enabled && query.isLoading,
    isError: query.isError || failed > 0,
    error: query.error ?? null,
    loaded: (live ? live.entries : entries).filter((e) => e.data !== undefined).length,
    failed,
    total: siteIds.length,
  };
}
