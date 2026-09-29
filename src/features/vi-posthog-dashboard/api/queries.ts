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
  fetchRecentActiveUsers,
  fetchRoles,
  fetchTrafficSession,
  fetchUsageAndDistribution,
  fetchWorkflowUsage,
  type OsType,
  type ViDeviceSplitRow,
  type ViRangeFilters,
  type ViSurface,
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
  /**
   * The Layer-3 scope: one name straight out of the `modules` tree, sent as `module`.
   *
   * There is no sub-module counterpart. Under `scope_mode: app` the tree's names are the
   * Vi app's own event groups (`msafe_home`, `tickets_create`, `home_post_possession`, …),
   * which are flat — a second segment only exists for `$pathname`-scoped web modules, and
   * sending `sub_module` on top of an app module narrows the query to nothing.
   */
  module: string | null;
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

export function useRecentActiveUsers(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'recent_active_users', ...keyBase(f)],
    queryFn: () => fetchRecentActiveUsers(range(f)),
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

/**
 * The selected module's workflow_usage — the funnel, tiles, flows and entry screens behind
 * Layer 3.
 *
 * Only `module` is sent (see QueryFilters.module): the tree these names come from is flat,
 * so there is no sub-module to pass, and the response's `funnel` block is the real event
 * sequence for that module.
 */
export function useWorkflowUsage(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'workflow_usage', f.module, ...keyBase(f)],
    queryFn: () => fetchWorkflowUsage({ ...range(f), module: f.module ?? undefined }),
    enabled: f.enabled && !!f.module,
    ...CACHE,
  });
}

/** One row of the platform split — one OS out of the response. */
export interface PlatformSplitRow {
  os: string;
  label: string;
  users: number;
  sessions: number;
  /** 0..1 share of all sessions in the period. */
  share: number;
}

/** Both platforms are always drawn, so a zero reads as "nobody on iOS", not as missing data. */
const PLATFORMS_SHOWN = ['Android', 'iOS'] as const;

/**
 * Android vs iOS share of sessions, read off one response's `device_split` block.
 *
 * The split lives in the `os_breakdown` nested under each device row, so the rows are
 * flattened and summed per OS across devices: an OS row's own `session_share` is its share of
 * ITS DEVICE, which would read 100% for Android on a Mobile-only response and say nothing
 * about the period. The share below is recomputed against `total_sessions` instead.
 *
 * One unpinned call — tenant host and `project_code` only, no `app_id` and no pinned
 * `device_type`. The platform toggle is deliberately left out of the key: comparing the
 * platforms is the whole point of the card, so it must not be filtered to one of them.
 */
export function usePlatformSplit(f: QueryFilters) {
  const q = useQuery({
    queryKey: [...ROOT, 'usage_and_distribution', 'platform-split', f.from, f.to],
    queryFn: () => fetchUsageAndDistribution({ from: f.from, to: f.to, surface: 'web' }),
    enabled: f.enabled,
    ...CACHE,
  });

  const rows = useMemo<PlatformSplitRow[]>(() => {
    const split = q.data?.device_split;
    const devices = (split?.devices ?? []) as ViDeviceSplitRow[];
    if (devices.length === 0) return [];

    const totals = new Map<string, { users: number; sessions: number }>();
    for (const d of devices) {
      for (const o of d.os_breakdown ?? []) {
        const t = totals.get(o.os) ?? { users: 0, sessions: 0 };
        totals.set(o.os, { users: t.users + o.users, sessions: t.sessions + o.sessions });
      }
    }
    if (totals.size === 0) return [];

    // Against the period's own total, so the two bars are shares of the same denominator.
    let total = split?.total_sessions ?? 0;
    if (!total) for (const t of totals.values()) total += t.sessions;

    // The two known platforms first and always, then anything else the API reported.
    const names = [...PLATFORMS_SHOWN, ...[...totals.keys()].filter((o) => !PLATFORMS_SHOWN.includes(o as (typeof PLATFORMS_SHOWN)[number]))];
    return names.map((os) => {
      const t = totals.get(os) ?? { users: 0, sessions: 0 };
      return {
        os,
        label: os,
        users: t.users,
        sessions: t.sessions,
        share: total > 0 ? t.sessions / total : 0,
      };
    });
  }, [q.data]);

  return { rows, isLoading: q.isLoading, error: q.error as Error | null };
}
