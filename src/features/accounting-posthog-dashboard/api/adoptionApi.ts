import axios, { AxiosHeaders } from 'axios';
import { axiosGet, runExportJob, type ExportPhase } from '@/features/posthog-dashboard/api/exportJob';
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

/* ---------------------------------------------------------------------------
 * Calendar App Adoption Analytics API client.
 *
 * Base URL : VITE_ACCOUNTING_ADOPTION_API_URL or VITE_FM_ADOPTION_API_URL (default https://posthog-api.lockated.com)
 * Scope    : app_id=29 (passed in place of project_code / web url)
 * ------------------------------------------------------------------------- */

export const ANALYTICS_BASE_URL =
  (import.meta.env.VITE_ACCOUNTING_ADOPTION_API_URL as string | undefined) ??
  (import.meta.env.VITE_FM_ADOPTION_API_URL as string | undefined) ??
  'https://posthog-api.lockated.com';

/** Calendar App application ID passed in place of project code. */
export const ACCOUNTING_APP_ID =
  (import.meta.env.VITE_ACCOUNTING_ADOPTION_APP_ID as string | undefined) ?? '29';

export type AccountingOsType = 'iOS' | 'Android';

export interface AccountingRangeFilters {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  os?: AccountingOsType[];
  provider?: string;
}

export interface AccountingWeeklyFilters {
  to: string; // YYYY-MM-DD
  weeks: number;
  /** Start of the selected range. Only growth reads it: its weeks follow the range. */
  from?: string;
  os?: AccountingOsType[];
  provider?: string;
}

/** Accounting's own usage-analytics API. */
const ACCOUNTING_ADOPTION_PATH = '/commercial/accounting/adoption';

const client = axios.create({
  baseURL: ANALYTICS_BASE_URL,
  timeout: 60_000,
  headers: { 'Content-Type': 'application/json' },
});

/* Attach Bearer token when present. */
client.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    '';
  if (token) {
    config.headers = AxiosHeaders.from(config.headers);
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

function baseParams(os?: AccountingOsType[], provider?: string): Record<string, string> {
  // The Accounting API (Commercial::AccountingController) fixes the app on the server, so no app_id is sent.
  const p: Record<string, string> = {};
  if (os?.length) {
    // Specific platform selected → send lowercase os param (ios / android)
    p.os = os.map((o) => o.toLowerCase()).join(',');
  } else {
    // "All" selected → indicate this is a mobile app to the backend
    p.device_type = 'mobile';
  }
  if (provider && provider !== 'All Providers') {
    p.provider = provider;
  }
  return p;
}

const rangeParams = (f: AccountingRangeFilters): Record<string, string> => ({
  ...baseParams(f.os, f.provider),
  from: f.from,
  to: f.to,
});

const weeklyParams = (f: AccountingWeeklyFilters): Record<string, string> => ({
  ...baseParams(f.os, f.provider),
  to: f.to,
  weeks: String(f.weeks),
});

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const res = await client.get<T>(`${ACCOUNTING_ADOPTION_PATH}/${path}?${qs}`);
  return res.data;
}

/* ------------------------------------------------------------------ Layer 1 */

export const fetchTrafficSession = (f: AccountingRangeFilters) =>
  get<TrafficSessionResponse>('traffic_session', rangeParams(f));

export const fetchUsageAndDistribution = (f: AccountingRangeFilters) =>
  get<UsageDistributionResponse>('usage_and_distribution', rangeParams(f));

/* ------------------------------------------------------------------ Layer 2 */

export const fetchAdoptionEngagement = (f: AccountingRangeFilters) =>
  get<AdoptionEngagementResponse>('adoption_engagement', rangeParams(f));

export const fetchAdoptionTrend = (f: AccountingWeeklyFilters) =>
  get<AdoptionTrendResponse>('adoption_trend', weeklyParams(f));

export const fetchGrowth = (f: AccountingWeeklyFilters) =>
  get<GrowthResponse>('growth', { ...weeklyParams(f), ...(f.from ? { from: f.from } : {}) });

export const fetchRetention = (f: AccountingWeeklyFilters) =>
  get<RetentionResponse>('retention', weeklyParams(f));

export const fetchRoles = (f: AccountingRangeFilters) =>
  get<RolesResponse>('roles', rangeParams(f));

/* ------------------------------------------------------------------ Layer 3 */

export const fetchModules = (f: AccountingRangeFilters & { module?: string }) =>
  get<ModulesResponse>('modules', {
    ...rangeParams(f),
    ...(f.module ? { module: f.module } : {}),
  });

export const fetchWorkflowUsage = (f: AccountingRangeFilters & { module?: string; subModule?: string }) =>
  get<WorkflowUsageResponse>('workflow_usage', {
    ...rangeParams(f),
    ...(f.module ? { module: f.module } : {}),
    ...(f.subModule ? { sub_module: f.subModule } : {}),
  });

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

export interface RecentActiveUser {
  user_id: string;
  /** "First Last" as the API sends it (the person's name). */
  user_name?: string | null;
  email?: string | null;
  /** Older API field; the API now sends user_name. */
  display_name?: string | null;
  path: string | null;
  last_event: string | null;
  minutes_ago: number | null;
  site_name: string | null;
}

export interface RecentActiveUsersResponse {
  users: RecentActiveUser[];
}

export const RECENT_ACTIVE_USERS_EXPORT_ENDPOINT = `${ACCOUNTING_ADOPTION_PATH}/active_users_export`;

export const fetchRecentActiveUsers = (f: AccountingRangeFilters) =>
  get<RecentActiveUsersResponse>('recent_active_users', {
    ...rangeParams(f),
    limit: '10',
  });

/** The .xlsx of every event in the range, made in the background on the server (see exportJob). */
export async function downloadRecentActiveUsers(f: AccountingRangeFilters, onPhase?: (phase: ExportPhase) => void): Promise<Blob> {
  const qs = new URLSearchParams({
    ...rangeParams(f),
  });
  const { blob } = await runExportJob({
    exportUrl: `${RECENT_ACTIVE_USERS_EXPORT_ENDPOINT}?${qs.toString()}`,
    adoptionUrl: RECENT_ACTIVE_USERS_EXPORT_ENDPOINT.replace(/\/active_users_export$/, ''),
    get: axiosGet(client),
    onPhase,
  });
  return blob;
}
