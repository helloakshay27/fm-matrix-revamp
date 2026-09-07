import { useQuery } from '@tanstack/react-query';
import {
  GROWTH_WEEKS,
  RETENTION_WEEKS,
  TREND_WEEKS,
} from '@/features/posthog-dashboard/data/constants';
import {
  ANALYTICS_TENANT_URL,
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
} from './adoptionApi';
import { CALENDAR_MODULE, CALENDAR_SUB_MODULE } from '../data/constants';

/** All Layer-1/2/3 calls share these; one object keeps every query key in step. */
export interface QueryFilters {
  from: string;
  to: string;
  devices: DeviceType[];
  module: string | null;
  subModule: string | null;
}

const range = (f: QueryFilters): RangeFilters => ({
  from: f.from,
  to: f.to,
  devices: f.devices,
});

/** Analytics is read-mostly and each call is a multi-second ClickHouse scan — cache generously. */
const CACHE = { staleTime: 5 * 60_000, gcTime: 30 * 60_000, refetchOnWindowFocus: false } as const;

/**
 * Query-key root. `fm-adoption` is shared with the other analytics dashboards so one Refresh
 * invalidates the whole family, but the tenant host is part of every key — without it two
 * dashboards would collide in the cache whenever their date/device filters happened to match,
 * and each would render the other tenant's numbers.
 */
export const ROOT = ['fm-adoption', ANALYTICS_TENANT_URL] as const;

const keyBase = (f: QueryFilters) => [f.from, f.to, f.devices.join(',')];

export function useTrafficSession(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'traffic_session', ...keyBase(f)],
    queryFn: () => fetchTrafficSession(range(f)),
    ...CACHE,
  });
}

export function useUsageAndDistribution(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'usage_and_distribution', ...keyBase(f)],
    queryFn: () => fetchUsageAndDistribution(range(f)),
    ...CACHE,
  });
}

export function useAdoptionEngagement(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'adoption_engagement', ...keyBase(f)],
    queryFn: () => fetchAdoptionEngagement(range(f)),
    ...CACHE,
  });
}

export function useAdoptionTrend(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'adoption_trend', f.to, f.devices.join(',')],
    queryFn: () => fetchAdoptionTrend({ to: f.to, weeks: TREND_WEEKS, devices: f.devices }),
    ...CACHE,
  });
}

export function useGrowth(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'growth', f.to, f.devices.join(',')],
    queryFn: () => fetchGrowth({ to: f.to, weeks: GROWTH_WEEKS, devices: f.devices }),
    ...CACHE,
  });
}

export function useRetention(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'retention', f.to, f.devices.join(',')],
    queryFn: () => fetchRetention({ to: f.to, weeks: RETENTION_WEEKS, devices: f.devices }),
    ...CACHE,
  });
}

export function useRoles(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'roles', ...keyBase(f)],
    queryFn: () => fetchRoles(range(f)),
    ...CACHE,
  });
}

/**
 * Top-level module tree (path segment 1).
 *
 * Also drives the module league table at the bottom of Adoption & Engagement — see that
 * card's own note for why it is a module breakdown rather than the wireframe's provider one.
 */
export function useModuleTree(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'modules', ...keyBase(f)],
    queryFn: () => fetchModules(range(f)),
    ...CACHE,
  });
}

/**
 * The selected workflow's funnel.
 *
 * Disabled when the workflow has no web route (`apiModule === null`): omitting `module` makes
 * the endpoint fall back to its own maintenance/ticket default, which would print Helpdesk
 * numbers under, say, Password Reset. Those render as awaiting data instead.
 */
export function useWorkflowUsage(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'workflow_usage', f.module, f.subModule, ...keyBase(f)],
    queryFn: () =>
      fetchWorkflowUsage({
        ...range(f),
        module: f.module ?? undefined,
        subModule: f.subModule ?? undefined,
      }),
    enabled: !!f.module,
    ...CACHE,
  });
}

/**
 * The calendar module's own row from the `modules` tree — the ONE genuinely calendar-scoped
 * source of top-line numbers this API offers.
 *
 * Layer 1 and Layer 2 cannot be narrowed to a page: `traffic_session` and friends silently
 * ignore `module`/`sub_module`, and the endpoint's own formula block confirms why —
 * `U1 = uniq(distinct_id) over the period`, with no `$pathname` dimension anywhere. Verified
 * by calling it with and without the params and getting byte-identical tiles.
 *
 * `modules?module=employee` IS path-scoped (segment 2 of `$pathname`), so the `calendar` row
 * off that response is what the Calendar-only strip on Traffic & Session reports.
 */
export function useCalendarModule(f: QueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'modules', CALENDAR_MODULE, ...keyBase(f)],
    queryFn: () => fetchModules({ ...range(f), module: CALENDAR_MODULE }),
    select: (data) => data.tree.find((m) => m.name === CALENDAR_SUB_MODULE) ?? null,
    ...CACHE,
  });
}
