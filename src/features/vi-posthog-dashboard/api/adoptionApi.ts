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

function baseParams(siteIds?: string[], devices?: DeviceType[]) {
  const p: Record<string, string> = { url: ANALYTICS_TENANT_URL };
  if (siteIds?.length) p.site_id = siteIds.join(',');
  if (devices?.length) p.device_type = devices.join(',');
  return p;
}

const rangeParams = (f: RangeFilters) => ({
  ...baseParams(f.siteIds, f.devices),
  from: f.from,
  to: f.to,
});

const weeklyParams = (f: WeeklyFilters) => ({
  ...baseParams(f.siteIds, f.devices),
  to: f.to,
  weeks: String(f.weeks),
});

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  // Build the query string manually so site_id commas are NOT percent-encoded (%2C),
  // matching the format the server expects: site_id=2189,2190,2191,...
  const base = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (k === 'site_id') continue; // appended below with literal commas
    base.append(k, v);
  }
  let qs = base.toString();
  if (params.site_id) qs += (qs ? '&' : '') + 'site_id=' + params.site_id;
  const res = await client.get<T>(`/fm/adoption/${path}?${qs}`);
  return res.data;
}

/* ------------------------------------------------------------------ Layer 1 */

export const fetchTrafficSession = (f: RangeFilters) =>
  get<TrafficSessionResponse>('traffic_session', rangeParams(f));

export const fetchUsageAndDistribution = (f: RangeFilters) =>
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
export const fetchAdoptionEngagement = (f: RangeFilters) =>
  get<AdoptionEngagementResponse>('adoption_engagement', rangeParams(f));

export const fetchAdoptionTrend = (f: WeeklyFilters) =>
  get<AdoptionTrendResponse>('adoption_trend', weeklyParams(f));

export const fetchGrowth = (f: WeeklyFilters) => get<GrowthResponse>('growth', weeklyParams(f));

export const fetchRetention = (f: WeeklyFilters) =>
  get<RetentionResponse>('retention', weeklyParams(f));

export const fetchRoles = (f: RangeFilters) => get<RolesResponse>('roles', rangeParams(f));

/* ------------------------------------------------------------------ Layer 3 */

/** Omit `module` for the top-level tree (path segment 1); pass it for sub-modules (segment 2). */
export const fetchModules = (f: RangeFilters & { module?: string }) =>
  get<ModulesResponse>('modules', {
    ...rangeParams(f),
    ...(f.module ? { module: f.module } : {}),
  });

/** Defaults server-side to maintenance / ticket (helpdesk) when module/sub_module are omitted. */
export const fetchWorkflowUsage = (f: RangeFilters & { module?: string; subModule?: string }) =>
  get<WorkflowUsageResponse>('workflow_usage', {
    ...rangeParams(f),
    ...(f.module ? { module: f.module } : {}),
    ...(f.subModule ? { sub_module: f.subModule } : {}),
  });
