import { useQuery } from '@tanstack/react-query';
import { fetchAllSites, fetchCompanyNames } from '@/features/posthog-dashboard/api/sitesApi';
import {
  GROWTH_WEEKS,
  RETENTION_WEEKS,
  TREND_WEEKS,
} from '@/features/posthog-dashboard/data/constants';
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
  ANALYTICS_TENANT_URL,
} from './adoptionApi';

/** All Layer-1/2/3 calls share these; one object keeps every query key in step. */
export interface QueryFilters {
  /** False until the site list has settled, so we don't fire every call twice. */
  enabled: boolean;
  from: string;
  to: string;
  siteIds: string[];
  devices: DeviceType[];
  module: string | null;
  subModule: string | null;
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
const CACHE = { staleTime: 5 * 60_000, gcTime: 30 * 60_000, refetchOnWindowFocus: false } as const;

/**
 * Query-key root. `fm-adoption` is shared with `/posthog-dashboard` so one Refresh
 * invalidates the whole analytics family, but the tenant host is part of every key —
 * without it the two dashboards would collide in the cache whenever their date/site/device
 * filters happened to match, and each would render the other tenant's numbers.
 */
const ROOT = ['fm-adoption', ANALYTICS_TENANT_URL] as const;

const keyBase = (f: QueryFilters) => [f.from, f.to, f.siteIds.join(','), f.devices.join(',')];

/** Sites the signed-in user can see — drives the scope selector and every `site_id` filter. */
export function useAllSites() {
  return useQuery({
    queryKey: [...ROOT, 'all-sites'],
    queryFn: fetchAllSites,
    // Every analytics call waits on this one, so fail fast instead of retrying three times.
    retry: 1,
    staleTime: 30 * 60_000,
    gcTime: 60 * 60_000,
    refetchOnWindowFocus: false,
  });
}

/** Company id → name, for labelling the Regional tier. Never blocks: failure yields {}. */
export function useCompanyNames() {
  return useQuery({
    queryKey: [...ROOT, 'company-names'],
    queryFn: fetchCompanyNames,
    retry: 1,
    staleTime: 30 * 60_000,
    gcTime: 60 * 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useTrafficSession(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'traffic_session', ...keyBase(f)],
    queryFn: () => fetchTrafficSession(range(f)),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useUsageAndDistribution(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'usage_and_distribution', ...keyBase(f)],
    queryFn: () => fetchUsageAndDistribution(range(f)),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useAdoptionEngagement(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'adoption_engagement', ...keyBase(f)],
    queryFn: () => fetchAdoptionEngagement(range(f)),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useAdoptionTrend(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'adoption_trend', f.to, f.siteIds.join(','), f.devices.join(',')],
    queryFn: () =>
      fetchAdoptionTrend({ to: f.to, weeks: TREND_WEEKS, siteIds: f.siteIds, devices: f.devices }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useGrowth(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'growth', f.to, f.siteIds.join(','), f.devices.join(',')],
    queryFn: () =>
      fetchGrowth({ to: f.to, weeks: GROWTH_WEEKS, siteIds: f.siteIds, devices: f.devices }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useRetention(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'retention', f.to, f.siteIds.join(','), f.devices.join(',')],
    queryFn: () =>
      fetchRetention({ to: f.to, weeks: RETENTION_WEEKS, siteIds: f.siteIds, devices: f.devices }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useRoles(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'roles', ...keyBase(f)],
    queryFn: () => fetchRoles(range(f)),
    enabled: f.enabled,
    ...CACHE,
  });
}

/** Top-level module tree (path segment 1) — drives the module nav. */
export function useModuleTree(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'modules', ...keyBase(f)],
    queryFn: () => fetchModules(range(f)),
    enabled: f.enabled,
    ...CACHE,
  });
}

/** Sub-modules of the selected module (path segment 2). */
export function useSubModuleTree(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'modules', f.module, ...keyBase(f)],
    queryFn: () => fetchModules({ ...range(f), module: f.module! }),
    enabled: f.enabled && !!f.module,
    ...CACHE,
  });
}

export function useWorkflowUsage(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'workflow_usage', f.module, f.subModule, ...keyBase(f)],
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

export interface SiteLeagueEntry {
  siteId: string;
  data: TrafficSessionResponse | undefined;
}

/**
 * The site-wise table. There is no per-site endpoint, so this is a single `traffic_session`
 * call carrying the whole scoped site list as one comma-separated `site_id`.
 */
export function useSiteLeague(f: QueryFilters, siteIds: string[], enabled: boolean) {
  const query = useQuery({
    queryKey: [...ROOT, 'traffic_session', f.from, f.to, siteIds.join(','), f.devices.join(',')],
    queryFn: () => fetchTrafficSession({ from: f.from, to: f.to, siteIds, devices: f.devices }),
    enabled: enabled && f.enabled,
    ...CACHE,
  });

  return {
    entries: siteIds.map((siteId) => ({ siteId, data: query.data })) as SiteLeagueEntry[],
    isLoading: enabled && query.isLoading,
    isError: query.isError,
    loaded: query.data !== undefined ? siteIds.length : 0,
    failed: query.isError ? siteIds.length : 0,
    total: siteIds.length,
  };
}
