import { useMemo } from 'react';
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
  type OsType,
  type ViRangeFilters,
  type ViSurface,
  type UsageDistributionResponse,
  VI_APP_ID,
} from './adoptionApi';

/** All Layer-1/2/3 calls share these; one object keeps every query key in step. */
export interface QueryFilters {
  /** False until the site list has settled, so we don't fire every call twice. */
  enabled: boolean;
  from: string;
  to: string;
  /** Platform filter — [] is "All", otherwise ['iOS'] or ['Android']. */
  os: OsType[];
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

const range = (f: QueryFilters): ViRangeFilters => ({
  from: f.from,
  to: f.to,
  os: f.os,
});

/** Analytics is read-mostly and each call is a multi-second ClickHouse scan — cache generously. */
const CACHE = { staleTime: 5 * 60_000, gcTime: 30 * 60_000, refetchOnWindowFocus: false } as const;

/**
 * Query-key root. `fm-adoption` is shared with `/posthog-dashboard` so one Refresh
 * invalidates the whole analytics family, but the Vi app id is part of every key — without
 * it the two dashboards would collide in the cache whenever their date/site/device filters
 * happened to match, and each would render the other tenant's numbers.
 */
const ROOT = ['fm-adoption', 'app', VI_APP_ID] as const;

const keyBase = (f: QueryFilters) => [f.from, f.to, f.os.join(',')];

/** Sites the signed-in user can see — drives the Circle selector's options and labels. */
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
    queryKey: [...ROOT, 'adoption_trend', f.to, f.os.join(',')],
    queryFn: () =>
      fetchAdoptionTrend({ to: f.to, weeks: TREND_WEEKS, os: f.os }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useGrowth(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'growth', f.to, f.os.join(',')],
    queryFn: () =>
      fetchGrowth({ to: f.to, weeks: GROWTH_WEEKS, os: f.os }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useRetention(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'retention', f.to, f.os.join(',')],
    queryFn: () =>
      fetchRetention({ to: f.to, weeks: RETENTION_WEEKS, os: f.os }),
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

/** One surface's slice of the web-vs-app split. */
export interface SurfaceSplitRow {
  surface: ViSurface;
  label: string;
  users: number;
  sessions: number;
  /** 0..1 share of sessions across the two platforms. */
  share: number;
}

/**
 * Web app vs mobile app share, for the "where sessions come from" card.
 *
 * The two surfaces are not two values of one property: the mobile app is identified by
 * `app_id`, the web app by its host, and an event carries one or the other but never both.
 * So there is no single response to read the split off — it takes one call per surface.
 *
 * These two deliberately step outside the dashboard's own scoping (which pins every other
 * query to the mobile app): comparing the surfaces is the whole point of the card, so it
 * cannot be filtered to one of them. The platform toggle is left out of the key for the
 * same reason.
 */
export function useSurfaceSplit(f: QueryFilters) {
  const mk = (surface: ViSurface) => ({
    queryKey: [...ROOT, 'usage_and_distribution', 'surface-split', surface, f.from, f.to],
    queryFn: () =>
      fetchUsageAndDistribution({ from: f.from, to: f.to, surface }),
    enabled: f.enabled,
    ...CACHE,
  });

  const web = useQuery(mk('web'));
  const app = useQuery(mk('app'));

  const rows = useMemo<SurfaceSplitRow[]>(() => {
    const sessionsOf = (d: UsageDistributionResponse | undefined) =>
      d?.device_split.total_sessions ?? 0;
    const usersOf = (d: UsageDistributionResponse | undefined) =>
      (d?.device_split.devices ?? []).reduce((n, x) => n + x.users, 0);

    const counts = [
      {
        surface: 'web' as const,
        label: 'Web app',
        users: usersOf(web.data),
        sessions: sessionsOf(web.data),
      },
      {
        surface: 'app' as const,
        label: 'Mobile app',
        users: usersOf(app.data),
        sessions: sessionsOf(app.data),
      },
    ];
    const total = counts.reduce((n, c) => n + c.sessions, 0);
    if (!total) return [];
    return counts.map((c) => ({ ...c, share: c.sessions / total }));
  }, [web.data, app.data]);

  return {
    rows,
    isLoading: web.isLoading || app.isLoading,
    error: (web.error ?? app.error) as Error | null,
  };
}
