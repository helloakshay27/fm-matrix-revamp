import axios from 'axios';
import { FM_ADOPTION_TENANT_URL } from '@/config/fmAdoptionTenant';


/* ---------------------------------------------------------------------------
 * FM Adoption Analytics API client.
 *
 * The client mirrors the reference usage-analytics dashboard architecture:
 * the API host comes from VITE_FM_ADOPTION_API_URL and the tenant (`url`
 * query param) comes from the shared tenant configuration module
 * (src/config/fmAdoptionTenant.ts) — never a hardcoded string here, never
 * the backend API URL.
 *
 * Base URL : VITE_FM_ADOPTION_API_URL (default https://posthog-api.lockated.com)
 * Tenant   : sent as the `url` query param — the FRONTEND host whose analytics
 *            are returned, resolved by src/config/fmAdoptionTenant.ts.
 * Auth     : the analytics host answers openly (HTTP 200, no auth). A Bearer
 *            interceptor is attached at request time for consistency with the
 *            app's other clients and future-proofing — it only fires when a
 *            token is actually present, and the request still goes out without
 *            one. No static token is ever embedded or put in env.
 * ------------------------------------------------------------------------- */

export const ANALYTICS_BASE_URL =
  (import.meta.env.VITE_FM_ADOPTION_API_URL as string | undefined) ??
  'https://posthog-api.lockated.com';

/* Frontend/tenant host sent as the `url` query param — from the shared
   tenant configuration module, never hardcoded here. */
export const ANALYTICS_TENANT = FM_ADOPTION_TENANT_URL;

/* Panchshil Pulse project code — passed statically, mirroring the per-brand
   project_code mechanism used by Panchshil Connect. Pulse Usage Analytics
   identifies the Pulse/TEP context using project_code=TEP-01 ONLY; no
   project_id is ever sent for Pulse (never P-238, never P-223). */
export const ANALYTICS_PROJECT_CODE = 'TEP-01';

/* The Panchshil Pulse tenant switches the request construction onto the
   Connect pattern: it sends `project_code` (never the `url`/`base_url`)
   plus a single `os`/`device_type` param instead of the shared `device_type`
   array. No `project_id` is sent for Pulse. Every other tenant keeps the
   shared url + device_type array behaviour. */
const IS_PULSE = ANALYTICS_TENANT.includes('pulse');

/**
 * Platform filter → the API's single platform param, copied from Panchshil
 * Connect's getDeviceInfo: "ios" sends { os: "ios" }, "android" sends
 * { os: "Android" }, everything else ("all") sends { device_type: "mobile" }.
 */
export const getDeviceInfo = (dev?: string): Record<string, string> => {
  if (dev === 'ios') return { os: 'ios' };
  if (dev === 'android') return { os: 'Android' };
  return { device_type: 'mobile' };
};

const analyticsClient = axios.create({
  baseURL: ANALYTICS_BASE_URL,
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

/* Bearer token attached at REQUEST time, only when present. The read prefers
   the same keys the app's other clients use (see src/utils/auth.ts and the
   sign-in flow). */
analyticsClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    '';
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* Response interceptor: when a backend endpoint returns 404 (or any non-JSON
   like a Rails HTML error page), silently return null instead of throwing so
   React Query treats it as "no data" and the UI falls back to sample/empty
   state — exactly the same graceful degradation pattern the other layers
   (traffic, adoption, workflow) use. */
analyticsClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const contentType = error.response?.headers?.['content-type'] || '';
    if (status === 404 || (status >= 400 && !contentType.includes('application/json'))) {
      return Promise.resolve({ data: null });
    }
    return Promise.reject(error);
  },
);

/** `device_type` is case-sensitive server-side (`Desktop` / `Mobile`). */
export type DeviceType = 'Desktop' | 'Mobile';

/** Filters shared by the from/to endpoints. */
export interface RangeFilters {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  siteIds?: string[];
  devices?: DeviceType[];
  /** Raw platform/device selection ("all" | "ios" | "android") — used by the
      Panchshil Pulse tenant to build the Connect-style `os`/`device_type` param. */
  dev?: string;
}

/** Filters for the three look-back endpoints (adoption_trend / growth / retention). */
export interface WeeklyFilters {
  to: string; // YYYY-MM-DD
  weeks: number;
  siteIds?: string[];
  devices?: DeviceType[];
  dev?: string;
}

/* ---------------------------------------------------------------------------
 * Query-string builder.
 *
 * `site_id` must be joined with RAW commas in the query string — never
 * percent-encoded to %2C. Axios would encode array values, so we build the
 * query string manually from an ordered list of [key, value] pairs and append
 * it directly to the URL. Non-array string values are kept as-is.
 * ------------------------------------------------------------------------- */

/**
 * @param {Array<[string, string | string[] | number | undefined | null]>} pairs
 */
const buildQuery = (pairs: Array<[string, string | string[] | number | undefined | null]>) => {
  const parts: string[] = [];
  for (const [key, value] of pairs) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      // join with raw commas, e.g. site_id=2189,2190
      parts.push(`${key}=${value.join(',')}`);
    } else {
      parts.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.join('&');
};

/**
 * GET helper: appends a manually built query string (raw commas preserved for
 * site_id) to the endpoint and returns the parsed response.
 */
const get = async <T>(endpoint: string, pairs: Array<[string, string | string[] | number | undefined | null]>): Promise<T> => {
  const qs = buildQuery(pairs);
  const url = `/fm/adoption/${endpoint}${qs ? `?${qs}` : ''}`;
  const { data } = await analyticsClient.get<T>(url);
  return data;
};

/* Shared param slices ---------------------------------------------------- */

const rangeParams = ({ from, to, siteIds, devices, dev }: RangeFilters): Array<[string, string | string[] | number | undefined | null]> => [
  IS_PULSE ? ['project_code', ANALYTICS_PROJECT_CODE] : ['url', ANALYTICS_TENANT],
  ['from', from],
  ['to', to],
  ['site_id', siteIds],
  ...(IS_PULSE
    ? Object.entries(getDeviceInfo(dev))
    : ([['device_type', devices]] as Array<[string, string | string[] | number | undefined | null]>)),
];

const weeklyParams = ({ to, weeks, siteIds, devices, dev }: WeeklyFilters): Array<[string, string | string[] | number | undefined | null]> => [
  IS_PULSE ? ['project_code', ANALYTICS_PROJECT_CODE] : ['url', ANALYTICS_TENANT],
  ['to', to],
  ['weeks', weeks],
  ['site_id', siteIds],
  ...(IS_PULSE
    ? Object.entries(getDeviceInfo(dev))
    : ([['device_type', devices]] as Array<[string, string | string[] | number | undefined | null]>)),
];

/* ------------------------------------------------------------------ shared */

export interface AdoptionMeta {
  metric: string;
  layer?: string;
  level?: string;
  parent?: string | null;
  module?: string;
  sub_module?: string;
  prefix?: string;
  filters: {
    url: string;
    site_id: string[];
    device_type: string[];
    from: string;
    to: string;
  };
  generated_at: string;
}

/** Every response carries this self-describing block (summary + per-metric formulas). */
export interface AdoptionInfo {
  summary?: string;
  period?: Record<string, string>;
  formula?: Record<string, string>;
  notes?: Record<string, string>;
}

/* ------------------------------------------------- Layer 1 · traffic_session */

export interface TrafficSessionResponse {
  meta: AdoptionMeta;
  tiles: {
    active_users: number;
    screen_views: number;
    sessions: number;
    avg_session_seconds: number;
    bounce_rate: number; // already a percentage (0-100)
    recently_online: number;
  };
  previous: {
    active_users: number;
    screen_views: number;
    sessions: number;
    avg_session_seconds: number;
    bounce_rate: number;
  };
  delta_pct: {
    active_users: number | null;
    screen_views: number | null;
    sessions: number | null;
    avg_session_seconds: number | null;
    bounce_rate: number | null;
  };
  info?: AdoptionInfo;
}

export const fetchTrafficSession = (f: RangeFilters) =>
  get<TrafficSessionResponse>('traffic_session', rangeParams(f));

/* ------------------------------------------ Layer 1 · usage_and_distribution */

export interface UsageDay {
  day: string; // YYYY-MM-DD
  visitors: number;
  views: number;
  sessions: number;
}

export interface UsageDistributionResponse {
  meta: AdoptionMeta;
  usage_over_time: { current: UsageDay[]; previous: UsageDay[] };
  device_split: {
    total_sessions: number;
    devices: {
      device: string;
      users: number;
      sessions: number;
      session_share: number; // percentage
    }[];
  };
  views_per_session: number;
  info?: AdoptionInfo;
}

export const fetchUsageAndDistribution = (f: RangeFilters) =>
  get<UsageDistributionResponse>('usage_and_distribution', rangeParams(f));

/* ---------------------------------------- Layer 2 · adoption_engagement (A*) */

export interface AdoptionEngagementResponse {
  meta: AdoptionMeta;
  seat_utilisation: {
    value: number | null; // null unless licensed_seats was passed
    used_seats: number;
    licensed_seats: number | null;
    delta_pct: number | null;
  };
  stickiness: { value: number; avg_dau: number; mau: number; delta_pct: number | null };
  adoption_trend: { value: number | null; wau_now: number; wau_4wk_ago: number };
  activation: { value: number; joiners: number; delta_pct: number | null };
  module_breadth: { in_use: number; total: number };
  dormant_users: { value: number; band: string };
  info?: AdoptionInfo;
}

/** `licensedSeats` is billing data (not in events) — omit it and A1's % comes back null. */
export const fetchAdoptionEngagement = (f: RangeFilters & { licensedSeats?: number | null }) => {
  const { licensedSeats, ...rest } = f;
  const pairs = rangeParams(rest);
  if (licensedSeats != null && licensedSeats > 0) {
    pairs.push(['licensed_seats', Number(licensedSeats)]);
  }
  return get<AdoptionEngagementResponse>('adoption_engagement', pairs);
};

/* -------------------------------------------- Layer 2 · adoption_trend (A3) */

export interface WeeklyWau {
  week: string; // Monday of the ISO week
  wau: number;
}

export interface AdoptionTrendResponse {
  meta: AdoptionMeta;
  weekly: { current: WeeklyWau[]; previous: WeeklyWau[] };
  trend_pct: number | null;
  wau_now: number;
  wau_4wk_ago: number;
  info?: AdoptionInfo;
}

export const fetchAdoptionTrend = (f: WeeklyFilters) =>
  get<AdoptionTrendResponse>('adoption_trend', weeklyParams(f));

/* ------------------------------------------------------- Layer 2 · growth */

export interface GrowthWeekRow {
  week: string;
  new: number;
  returning: number;
  resurrected: number;
  dormant: number; // positive; rendered below the axis
}

export interface GrowthResponse {
  meta: AdoptionMeta;
  weeks: GrowthWeekRow[];
  info?: AdoptionInfo;
}

export const fetchGrowth = (f: WeeklyFilters) => get<GrowthResponse>('growth', weeklyParams(f));

/* ---------------------------------------------------- Layer 2 · retention */

/** week0..weekN keys are flat on the row, so index them dynamically. */
export interface RetentionCohort {
  cohort_week: string;
  size: number;
  [weekKey: string]: number | string | null;
}

export interface RetentionResponse {
  meta: AdoptionMeta;
  cohorts: RetentionCohort[];
  info?: AdoptionInfo;
}

export const fetchRetention = (f: WeeklyFilters) =>
  get<RetentionResponse>('retention', weeklyParams(f));

/* ------------------------------------------------------ Layer 2 · roles (A8) */

export interface RolesResponse {
  meta: AdoptionMeta;
  total_users: number;
  roles: { role: string; users: number; events: number; active_share: number }[];
  info?: AdoptionInfo;
}

export const fetchRoles = (f: RangeFilters) => get<RolesResponse>('roles', rangeParams(f));

/* ----------------------------------------------------- Layer 3 · modules */

export interface ModuleNode {
  name: string;
  users: number;
  events: number;
  sessions: number;
}

export interface ModulesResponse {
  meta: AdoptionMeta;
  tree: ModuleNode[];
  info?: AdoptionInfo;
}

/** Omit `module` for the top-level tree (path segment 1); pass it for sub-modules (segment 2). */
export const fetchModules = (f: RangeFilters & { module?: string }) => {
  const pairs = rangeParams(f);
  if (f.module) pairs.push(['module', f.module]);
  return get<ModulesResponse>('modules', pairs);
};

/* ---------------------------------------------- Layer 3 · workflow_usage */

export interface WorkflowKpi {
  value: number | null;
  delta_pct: number | null;
}

export interface WorkflowFunnelStep {
  step: string;
  reach: number;
  drop_pct: number | null;
  biggest: boolean;
}

export interface WorkflowFlowRow {
  path: string;
  users: number;
  events: number;
  sessions: number;
  f_comp: number | null;
}

export interface WorkflowEntryScreen {
  path: string;
  visitors: number;
  views: number;
  bounce: number; // percentage
  visitors_trend: number | null;
  views_trend: number | null;
  bounce_trend: number | null;
}

export interface WorkflowUsageResponse {
  meta: AdoptionMeta;
  kpis: {
    f_adopt: WorkflowKpi;
    f_comp: WorkflowKpi;
    f_step: WorkflowKpi;
    f_vol: WorkflowKpi;
  };
  funnel: WorkflowFunnelStep[];
  flows: WorkflowFlowRow[];
  entry_screens: WorkflowEntryScreen[];
  info?: AdoptionInfo;
}

/** Defaults server-side to maintenance / ticket (helpdesk) when module/sub_module are omitted. */
export const fetchWorkflowUsage = (
  f: RangeFilters & { module?: string; subModule?: string }
) => {
  const pairs = rangeParams(f);
  if (f.module) pairs.push(['module', f.module]);
  if (f.subModule) pairs.push(['sub_module', f.subModule]);
  return get<WorkflowUsageResponse>('workflow_usage', pairs);
};
