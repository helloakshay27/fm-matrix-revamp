import axios from 'axios';
import type {
  AdoptionEngagementResponse,
  AdoptionTrendResponse,
  DeviceType,
  GrowthResponse,
  ModulesResponse,
  RangeFilters,
  RetentionResponse,
  RolesResponse,
  TrafficSessionResponse,
  UsageDistributionResponse,
  WeeklyFilters,
  WorkflowUsageResponse,
} from '@/features/posthog-dashboard/api/adoptionApi';

/**
 * FM Adoption Analytics API, bound to the Vi my Workspace tenant.
 *
 * Same nine endpoints, same query contract and the same response shapes as
 * `/posthog-dashboard` — the response interfaces are imported from that feature rather than
 * restated, so the two dashboards can never drift apart on the contract. Only the analytics
 * deployment and the `url` tenant parameter differ, and both are the two consts below.
 *
 * No auth header: this API is unauthenticated and `team` is fixed server-side to 1. Tenant
 * metadata (sites/companies) goes through the app's authenticated `apiClient` instead —
 * see `sitesApi`.
 */
export const ANALYTICS_BASE_URL =
  (import.meta.env.VITE_VI_ADOPTION_API_URL as string | undefined) ??
  'https://posthog-api.lockated.com';

/**
 * Vi my Workspace is a mobile product, so every call is scoped by `app_id` instead of by the
 * web host: mobile-app events carry no `url`, and sending both AND-s them together and returns
 * nothing (verified against the API — any app_id combined with a url yields 0 sessions).
 * For the same reason the platform toggle is iOS / Android (the `os` property) rather than the
 * FM dashboard's Desktop / Mobile `device_type` split.
 */
export const VI_APP_ID = (import.meta.env.VITE_VI_ADOPTION_APP_ID as string | undefined) ?? '40';

/**
 * Vi my Workspace ships as a mobile app only, so `device_type` is pinned rather than exposed
 * as a control. Verified against the API: adding it to an app_id query changes nothing
 * (every app_id event is already Mobile), so it narrows the scan without dropping data.
 */
const VI_DEVICE_TYPE: DeviceType = 'Mobile';

/** `os` values the API matches on — case-sensitive. */
export type OsType = 'iOS' | 'Android';

/**
 * Same shape as the FM filters minus `devices` and `siteIds`: `device_type` is pinned to
 * Mobile above rather than picked, and `site_id` is never sent — mobile-app events carry no
 * site, so filtering on one returns nothing. The only platform filter a caller passes is `os`.
 */
export interface ViRangeFilters extends Omit<RangeFilters, 'devices' | 'siteIds'> {
  os?: OsType[];
  /**
   * Which Vi surface to count. Defaults to `app` — the mobile app this dashboard is about.
   * `web` swaps `app_id`/`device_type` for the web host, and exists only for the web-vs-app
   * split card, which has to reach outside the dashboard's own scope to compare the two.
   */
  surface?: ViSurface;
}

/** The two Vi surfaces: the mobile app (`app_id`) and the web app (its host). */
export type ViSurface = 'app' | 'web';

export interface ViWeeklyFilters extends Omit<WeeklyFilters, 'devices' | 'siteIds'> {
  os?: OsType[];
}

/**
 * The Vi web host. Kept for reference/reporting only — it is NOT sent as a filter (see
 * VI_APP_ID above); mobile-app events carry no host, so filtering on it drops all of them.
 */
export const ANALYTICS_TENANT_URL =
  (import.meta.env.VITE_VI_ADOPTION_TENANT_URL as string | undefined) ??
  'vi-web.gophygital.work';

const client = axios.create({ baseURL: ANALYTICS_BASE_URL, timeout: 60_000 });

export type {
  AdoptionEngagementResponse,
  AdoptionTrendResponse,
  DeviceType,
  GrowthResponse,
  ModulesResponse,
  RangeFilters,
  RetentionResponse,
  RolesResponse,
  TrafficSessionResponse,
  UsageDistributionResponse,
  WeeklyFilters,
  WorkflowUsageResponse,
};

function baseParams(os?: OsType[], surface: ViSurface = 'app') {
  const p: Record<string, string> =
    surface === 'web'
      ? { url: ANALYTICS_TENANT_URL }
      : { app_id: VI_APP_ID, device_type: VI_DEVICE_TYPE };
  if (os?.length) p.os = os.join(',');
  return p;
}

const rangeParams = (f: ViRangeFilters) => ({
  ...baseParams(f.os, f.surface),
  from: f.from,
  to: f.to,
});

const weeklyParams = (f: ViWeeklyFilters) => ({
  ...baseParams(f.os),
  to: f.to,
  weeks: String(f.weeks),
});

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const res = await client.get<T>(`/fm/adoption/${path}?${qs}`);
  return res.data;
}

/* ------------------------------------------------------------------ Layer 1 */

export const fetchTrafficSession = (f: ViRangeFilters) =>
  get<TrafficSessionResponse>('traffic_session', rangeParams(f));

export const fetchUsageAndDistribution = (f: ViRangeFilters) =>
  get<UsageDistributionResponse>('usage_and_distribution', rangeParams(f));

/* ------------------------------------------------------------------ Layer 2 */

/**
 * Seat count is NOT passed from the client, so `seat_utilisation.value` is always null.
 *
 * The endpoint's own note is unambiguous about this: "Seat count (licensed_seats) is billing
 * data, not in events — pass ?licensed_seats=N. Without it, value is null; used_seats still
 * returns." There is no server-side fallback — it cannot derive the denominator, and this
 * dashboard has no seat input to supply one.
 *
 * That is a deliberate trade: a number typed into the UI is not API data, and this dashboard
 * takes every value from the API. `used_seats` comes back regardless, so A1 renders as an
 * active-seat count instead of an empty percentage — see data/viMetricIds.ts asActiveSeats.
 */
export const fetchAdoptionEngagement = (f: ViRangeFilters) =>
  get<AdoptionEngagementResponse>('adoption_engagement', rangeParams(f));

export const fetchAdoptionTrend = (f: ViWeeklyFilters) =>
  get<AdoptionTrendResponse>('adoption_trend', weeklyParams(f));

export const fetchGrowth = (f: ViWeeklyFilters) => get<GrowthResponse>('growth', weeklyParams(f));

export const fetchRetention = (f: ViWeeklyFilters) =>
  get<RetentionResponse>('retention', weeklyParams(f));

export const fetchRoles = (f: ViRangeFilters) => get<RolesResponse>('roles', rangeParams(f));

/* ------------------------------------------------------------------ Layer 3 */

/** Omit `module` for the top-level tree (path segment 1); pass it for sub-modules (segment 2). */
export const fetchModules = (f: ViRangeFilters & { module?: string }) =>
  get<ModulesResponse>('modules', {
    ...rangeParams(f),
    ...(f.module ? { module: f.module } : {}),
  });

/** Defaults server-side to maintenance / ticket (helpdesk) when module/sub_module are omitted. */
export const fetchWorkflowUsage = (f: ViRangeFilters & { module?: string; subModule?: string }) =>
  get<WorkflowUsageResponse>('workflow_usage', {
    ...rangeParams(f),
    ...(f.module ? { module: f.module } : {}),
    ...(f.subModule ? { sub_module: f.subModule } : {}),
  });
