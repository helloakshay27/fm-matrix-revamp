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
export const VI_APP_ID = (import.meta.env.VITE_VI_ADOPTION_APP_ID as string | undefined) ?? '31';


/** `os` values the API matches on — case-sensitive. */
export type OsType = 'iOS' | 'Android';

/**
 * One declared workflow from `workflow_usage`'s `workflows` block.
 *
 * This block is additive and independent of the auto-derived `funnel`: the server reads the
 * named flows out of its own `config/workflows.yml` and computes each with
 * `windowFunnel(1800)` over that flow's declared, ordered step events. That is a properly
 * sequenced funnel — a user counted at step 3 really did pass steps 1 and 2 — which the
 * per-event `flows` counts cannot express.
 *
 * `instrumented: false` on a step, and any name in `missing_steps`, mean that event is not
 * emitted anywhere in the tenant. Where the TERMINAL step is missing, `completion_pct` reads
 * low for want of data rather than because users abandoned, and `data_complete` flags exactly
 * that — so the two must be read together.
 *
 * The shared `WorkflowUsageResponse` does not declare this block, so it is typed here.
 */
export interface ApiDeclaredWorkflowStep {
  step: string;
  reach: number;
  drop_pct: number | null;
  /** False when the tenant emits this event nowhere at all. */
  instrumented: boolean;
}

export interface ApiDeclaredWorkflow {
  key: string;
  name: string;
  bucket: string;
  /** Which app's spec declared it — filterable with `?workflow_app=`. */
  app: string;
  adoption_pct: number | null;
  completion_pct: number | null;
  biggest_drop_pct: number | null;
  volume: number;
  completions: number;
  avg_seconds: number;
  steps: ApiDeclaredWorkflowStep[];
  missing_steps: string[];
  data_complete: boolean;
}

/** The workflow_usage response plus the declared-workflow block the shared type omits. */
export type ViWorkflowUsageResponse = WorkflowUsageResponse & {
  workflows?: ApiDeclaredWorkflow[];
  workflow_app?: string | null;
  scope_mode?: 'app' | 'pathname';
};

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
  /** Start of the selected range. Only growth reads it: its weeks follow the range. */
  from?: string;
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

// The Vi API (Commercial::ViController) fixes the scope on the server: the Vi app (app_id 31,
// project_code MS-01) and Vi web (client vi-web). So no app_id / project_code / url is sent, and All
// covers both; picking iOS or Android narrows to the app.
function baseParams(os?: OsType[], _surface: ViSurface = 'app') {
  const p: Record<string, string> = {};
  if (os?.length) p.os = os.join(',');
  return p;
}

const VI_ADOPTION_PATH = '/commercial/vi/adoption';

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
  const res = await client.get<T>(`${VI_ADOPTION_PATH}/${path}?${qs}`);
  return res.data;
}

export const RECENT_ACTIVE_USERS_EXPORT_ENDPOINT = `${VI_ADOPTION_PATH}/active_users_export`;

export const fetchRecentActiveUsers = (f: ViRangeFilters) =>
  get<RecentActiveUsersResponse>('recent_active_users', {
    ...rangeParams(f),
    limit: '10',
  });

export async function downloadRecentActiveUsers(f: ViRangeFilters): Promise<Blob> {
  const qs = new URLSearchParams(rangeParams(f));
  const response = await client.get<Blob>(
    `${RECENT_ACTIVE_USERS_EXPORT_ENDPOINT}?${qs.toString()}`,
    { responseType: 'blob' },
  );
  return response.data;
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

export const fetchGrowth = (f: ViWeeklyFilters) =>
  get<GrowthResponse>('growth', { ...weeklyParams(f), ...(f.from ? { from: f.from } : {}) });

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
  get<ViWorkflowUsageResponse>('workflow_usage', {
    ...rangeParams(f),
    ...(f.module ? { module: f.module } : {}),
    ...(f.subModule ? { sub_module: f.subModule } : {}),
  });
