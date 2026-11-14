import axios from 'axios';
import { axiosGet, runExportJob, type ExportPhase } from './exportJob';
import {
  FM_ADOPTION_TENANT_URL,
  FM_ADOPTION_PROJECT_CODE,
} from '@/config/fmAdoptionTenant';


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

/* Panchshil Pulse project code (TEP-01). Only the WRITE side uses it now:
   src/utils/posthogHelpers.ts stamps it on Pulse events. The Pulse dashboard
   reads its own API (PULSE_ADOPTION_PATH), which fixes TEP-01 on the server,
   so no request carries it. */
export const ANALYTICS_PROJECT_CODE = FM_ADOPTION_PROJECT_CODE;

/* Each dashboard on this client has its own usage-analytics API in the
   backend, and that API fixes on the server which app's events it reads
   (app id, project code, client, …). A dashboard passes its API as `api`
   (RangeFilters / WeeklyFilters / QueryFilters) and then sends only the
   filters: from / to / weeks, the platform, module / sub_module. */
export const FM_ADOPTION_PATH = '/commercial/fm/adoption';
/** Panchshil Pulse: the Pulse web portal and app, project code TEP-01 (see Commercial::PulseController). */
export const PULSE_ADOPTION_PATH = '/commercial/pulse/adoption';

/**
 * Pulse's platform buttons → the API's platform param. Each sends what its
 * label says (the comparison is case-insensitive server-side):
 *   "all"      → nothing, so the API counts every platform (web and app).
 *   "ios"      → { os: 'ios' }, iOS only.
 *   "android"  → { os: 'android' }, Android only.
 */
export const getDeviceInfo = (dev?: string): Record<string, string> => {
  if (dev === 'ios') return { os: 'ios' };
  if (dev === 'android') return { os: 'android' };
  return {};
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
  /** The dashboard's own analytics API (e.g. PULSE_ADOPTION_PATH). The API fixes the app's
      scope, so the request carries only the filters; without it the request goes to FM's API. */
  api?: string;
  siteIds?: string[];
  devices?: DeviceType[];
  /** Platform button ("all" | "ios" | "android"), sent as `os` (see getDeviceInfo). Pulse only. */
  dev?: string;
}

export interface RecentActiveUser {
  user_id: string;
  display_name: string;
  path: string | null;
  last_event: string | null;
  minutes_ago: number | null;
  site_name: string | null;
}

export interface RecentActiveUsersResponse {
  users: RecentActiveUser[];
}

/** Filters for the three look-back endpoints (adoption_trend / growth / retention). */
export interface WeeklyFilters {
  to: string; // YYYY-MM-DD
  weeks: number;
  /** Start of the selected range. Only growth reads it: its weeks follow the range. */
  from?: string;
  /** The dashboard's own analytics API; see RangeFilters.api. */
  api?: string;
  /** Optional product scoping for dashboards that share these endpoints. */
  projectCode?: string;
  /** Optional analytics tenant override; the tenant is independent of projectCode. */
  tenantUrl?: string;
  signal?: AbortSignal;
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

type Pair = [string, string | string[] | number | undefined | null];

/**
 * Which analytics API a request goes to. Each dashboard on this client has its own usage-analytics API
 * in the backend, which fixes which app's events it reads:
 *   - `api` given (Pulse): that API.
 *   - Club Management sends project_code CM-01, which picks its API.
 *   - Otherwise FM's API (Commercial::FmController), which needs site_id: a request without one gets
 *     a 422 instead of every app's data.
 */
const ADOPTION_PATH_BY_PROJECT_CODE: Record<string, string> = {
  'CM-01': '/commercial/club/adoption',
};

const adoptionPath = (api: string | undefined, pairs: Pair[]): string => {
  if (api) return api;
  const code = pairs.find(([key]) => key === 'project_code')?.[1];
  return (typeof code === 'string' && ADOPTION_PATH_BY_PROJECT_CODE[code]) || FM_ADOPTION_PATH;
};

/**
 * GET helper: appends a manually built query string (raw commas preserved for
 * site_id) to the endpoint and returns the parsed response.
 */
const get = async <T>(endpoint: string, pairs: Pair[], signal?: AbortSignal, api?: string): Promise<T> => {
  const qs = buildQuery(pairs);
  const url = `${adoptionPath(api, pairs)}/${endpoint}${qs ? `?${qs}` : ''}`;
  const { data } = await analyticsClient.get<T>(url, { signal });
  return data;
};

export const RECENT_ACTIVE_USERS_EXPORT_ENDPOINT = '/fm/adoption/recent_active_users.xlsx';

export const fetchRecentActiveUsers = (f: RangeFilters) => {
  const pairs: Pair[] =
    f.appId != null
      ? [
        ['app_id', f.appId],
        ['device_type', f.recentDeviceType],
        ['from', f.from],
        ['to', f.to],
      ]
      : rangeParams(f);
  return get<RecentActiveUsersResponse>('recent_active_users', [...pairs, ['limit', 10]], f.signal, f.api);
};

/** The .xlsx of every event in the range, made in the background on the server (see exportJob). */
export async function downloadRecentActiveUsers(f: RangeFilters, onPhase?: (phase: ExportPhase) => void): Promise<Blob> {
  const pairs = rangeParams(f);
  const qs = buildQuery(pairs);
  const base = adoptionPath(f.api, pairs);
  const { blob } = await runExportJob({
    exportUrl: `${base}/active_users_export${qs ? `?${qs}` : ''}`,
    adoptionUrl: base,
    get: axiosGet(analyticsClient),
    onPhase,
  });
  return blob;
}

/* Shared param slices ---------------------------------------------------- */

/** The platform filter: Pulse's single `os` param from its button, else the `device_type` list. */
const platformParams = (dev: string | undefined, devices: DeviceType[] | undefined): Pair[] =>
  dev !== undefined ? Object.entries(getDeviceInfo(dev)) : [['device_type', devices]];

/** The scope part. A dashboard with its own API sends none: the API fixes its app on the server. */
const scopeParams = ({ api, projectCode, tenantUrl }: Pick<RangeFilters, 'api' | 'projectCode' | 'tenantUrl'>): Pair[] =>
  api
    ? []
    : [
      ['url', tenantUrl || ANALYTICS_TENANT],
      ...(projectCode ? [['project_code', projectCode] as Pair] : []),
    ];

const rangeParams = (f: RangeFilters): Pair[] => [
  ...scopeParams(f),
  ['from', f.from],
  ['to', f.to],
  ['site_id', f.siteIds],
  ...platformParams(f.dev, f.devices),
];

const weeklyParams = (f: WeeklyFilters): Pair[] => [
  ...scopeParams(f),
  ['to', f.to],
  ['weeks', f.weeks],
  ['site_id', f.siteIds],
  ...platformParams(f.dev, f.devices),
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
  get<TrafficSessionResponse>('traffic_session', rangeParams(f), f.signal, f.api);

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
  get<UsageDistributionResponse>('usage_and_distribution', rangeParams(f), f.signal, f.api);

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
  /** baseline_weeks: how many weeks the average used (weeks before the app went live are left out). */
  adoption_trend: { value: number | null; wau_now: number; wau_4wk_ago: number; baseline_weeks?: number | null };
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
  return get<AdoptionEngagementResponse>('adoption_engagement', pairs, f.api);
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
  get<AdoptionTrendResponse>('adoption_trend', weeklyParams(f), f.api);

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

export const fetchGrowth = (f: WeeklyFilters) => get<GrowthResponse>('growth', weeklyParams(f), f.api);

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
  get<RetentionResponse>('retention', weeklyParams(f), f.api);

/* ------------------------------------------------------ Layer 2 · roles (A8) */

export interface RolesResponse {
  meta: AdoptionMeta;
  total_users: number;
  roles: { role: string; users: number; events: number; active_share: number }[];
  info?: AdoptionInfo;
}

export const fetchRoles = (f: RangeFilters) => get<RolesResponse>('roles', rangeParams(f), f.api);

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
  return get<ModulesResponse>('modules', pairs, f.api);
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
  return get<WorkflowUsageResponse>('workflow_usage', pairs, f.api);
};
