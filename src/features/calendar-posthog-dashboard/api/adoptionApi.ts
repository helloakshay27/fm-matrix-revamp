import axios from 'axios';
import { CALENDAR_TENANT_URL } from './calendarTenant';
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
 * FM Adoption Analytics API, bound to the Calendar tenant.
 *
 * Same nine endpoints, same query contract and the same response shapes as
 * `/posthog-dashboard` and `/vi-posthog-dashboard` — the response interfaces are imported
 * from the FM feature rather than restated, so the three dashboards can never drift apart on
 * the contract. Only the tenant `url` differs; see api/calendarTenant.ts for how that is
 * resolved and why, including the measured traffic per host.
 *
 * No auth header: this API is unauthenticated and `team` is fixed server-side to 1. Note that
 * this base URL is the ANALYTICS service — it is unrelated to the app's own REST backend from
 * `getBaseUrl()`, and unrelated again to the tenant `url` param.
 */
export const ANALYTICS_BASE_URL =
  (import.meta.env.VITE_CALENDAR_ADOPTION_API_URL as string | undefined) ??
  'https://posthog-api.lockated.com';

export { CALENDAR_TENANT_URL as ANALYTICS_TENANT_URL } from './calendarTenant';

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

/**
 * `site_id` is deliberately not sent.
 *
 * Vi passes it because Circles are its scope selector; FM's own layer states outright that it
 * is not part of the API contract. Calendar App is a single-persona product with no site or
 * tier dimension at all — the wireframe has no scope selector — so there is nothing to scope
 * by and nothing to send.
 */
function baseParams(devices?: DeviceType[]) {
  const p: Record<string, string> = { url: CALENDAR_TENANT_URL };
  if (devices?.length) p.device_type = devices.join(',');
  return p;
}

const rangeParams = (f: RangeFilters) => ({
  ...baseParams(f.devices),
  from: f.from,
  to: f.to,
});

const weeklyParams = (f: WeeklyFilters) => ({
  ...baseParams(f.devices),
  to: f.to,
  weeks: String(f.weeks),
});

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
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
 * `seat_utilisation.value` comes back null and that is expected.
 *
 * The endpoint's own note: "Seat count (licensed_seats) is billing data, not in events — pass
 * ?licensed_seats=N. Without it, value is null; used_seats still returns." This dashboard has
 * no seat input and invents no denominator, so the Account Utilisation tile renders the real
 * `used_seats` count instead — see data/calendarMetricIds.ts.
 */
export const fetchAdoptionEngagement = (f: RangeFilters) =>
  get<AdoptionEngagementResponse>('adoption_engagement', rangeParams(f));

export const fetchAdoptionTrend = (f: WeeklyFilters) =>
  get<AdoptionTrendResponse>('adoption_trend', weeklyParams(f));

export const fetchGrowth = (f: WeeklyFilters) => get<GrowthResponse>('growth', weeklyParams(f));

export const fetchRetention = (f: WeeklyFilters) =>
  get<RetentionResponse>('retention', weeklyParams(f));

/**
 * Drives the "What users actually create" card.
 *
 * The catalogue's real lens there is `event_created{event_type}` — event / task / reminder —
 * but no endpoint exposes an arbitrary event property as a breakdown. `roles` is the only
 * share-of-users split the API offers, so the card reports that instead and says so in its
 * own `i` popover rather than showing an item-type split the data cannot support.
 */
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
