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

const keyBase = (f: QueryFilters) => [f.from, f.to, f.siteIds.join(','), f.devices.join(',')];

/** Every site on the tenant — drives the scope dropdown and the site-wise fan-out. */
export function useAllSites() {
  return useQuery({
    queryKey: ['fm-adoption', 'all-sites'],
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
    queryKey: ['fm-adoption', 'company-names'],
    queryFn: fetchCompanyNames,
    retry: 1,
    staleTime: 30 * 60_000,
    gcTime: 60 * 60_000,
    refetchOnWindowFocus: false,
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
    queryKey: ['fm-adoption', 'adoption_trend', f.to, f.siteIds.join(','), f.devices.join(',')],
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
    queryKey: ['fm-adoption', 'growth', f.to, f.siteIds.join(','), f.devices.join(',')],
    queryFn: () =>
      fetchGrowth({ to: f.to, weeks: GROWTH_WEEKS, siteIds: f.siteIds, devices: f.devices }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useRetention(f: QueryFilters) {
  return useQuery({
    queryKey: ['fm-adoption', 'retention', f.to, f.siteIds.join(','), f.devices.join(',')],
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

export interface SiteLeagueEntry {
  siteId: string;
  data: TrafficSessionResponse | undefined;
}

/**
 * There is no per-site breakdown endpoint, so the site-wise table fans `traffic_session`
 * out one call per site. Only enabled on the "All sites" scope — a single-site scope
 * already has these numbers in the Layer-1 tiles.
 *
 * Rows stream in as each call lands rather than waiting for the whole fan-out, so
 * `loaded`/`total` drive a progress note next to the table.
 */
export function useSiteLeague(f: QueryFilters, siteIds: string[], enabled: boolean) {
  const results = useQueries({
    queries: siteIds.map((siteId) => ({
      queryKey: ['fm-adoption', 'traffic_session', f.from, f.to, siteId, f.devices.join(',')],
      queryFn: () =>
        fetchTrafficSession({ from: f.from, to: f.to, siteIds: [siteId], devices: f.devices }),
      enabled: enabled && f.enabled,
      ...CACHE,
    })),
  });

  return {
    entries: results.map((r, i) => ({ siteId: siteIds[i], data: r.data })) as SiteLeagueEntry[],
    isLoading: enabled && results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
    loaded: results.filter((r) => r.data !== undefined).length,
    failed: results.filter((r) => r.isError).length,
    total: siteIds.length,
  };
}
