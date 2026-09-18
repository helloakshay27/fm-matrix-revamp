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

/* ---------------------------------------------------------------------------
 * Calendar App Adoption Analytics API client.
 *
 * Base URL : VITE_CALENDAR_ADOPTION_API_URL or VITE_FM_ADOPTION_API_URL (default https://posthog-api.lockated.com)
 * Scope    : app_id=29 & appid=29 (passed in place of project_code / web url)
 * ------------------------------------------------------------------------- */

export const ANALYTICS_BASE_URL =
  (import.meta.env.VITE_CALENDAR_ADOPTION_API_URL as string | undefined) ??
  (import.meta.env.VITE_FM_ADOPTION_API_URL as string | undefined) ??
  'https://posthog-api.lockated.com';

/** Calendar App application ID passed in place of project code. */
export const CALENDAR_APP_ID =
  (import.meta.env.VITE_CALENDAR_ADOPTION_APP_ID as string | undefined) ?? '29';

export type CalendarOsType = 'iOS' | 'Android';

export interface CalendarRangeFilters {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  os?: CalendarOsType[];
  provider?: string;
}

export interface CalendarWeeklyFilters {
  to: string; // YYYY-MM-DD
  weeks: number;
  os?: CalendarOsType[];
  provider?: string;
}

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
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* Silent degradation on 404 or non-JSON responses. */
client.interceptors.response.use(
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

function baseParams(os?: CalendarOsType[], provider?: string): Record<string, string> {
  const p: Record<string, string> = {
    app_id: CALENDAR_APP_ID,
  };
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

const rangeParams = (f: CalendarRangeFilters): Record<string, string> => ({
  ...baseParams(f.os, f.provider),
  from: f.from,
  to: f.to,
});

const weeklyParams = (f: CalendarWeeklyFilters): Record<string, string> => ({
  ...baseParams(f.os, f.provider),
  to: f.to,
  weeks: String(f.weeks),
});

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const res = await client.get<T>(`/fm/adoption/${path}?${qs}`);
  return res.data;
}

/* ------------------------------------------------------------------ Layer 1 */

export const fetchTrafficSession = (f: CalendarRangeFilters) =>
  get<TrafficSessionResponse>('traffic_session', rangeParams(f));

export const fetchUsageAndDistribution = (f: CalendarRangeFilters) =>
  get<UsageDistributionResponse>('usage_and_distribution', rangeParams(f));

/* ------------------------------------------------------------------ Layer 2 */

export const fetchAdoptionEngagement = (f: CalendarRangeFilters) =>
  get<AdoptionEngagementResponse>('adoption_engagement', rangeParams(f));

export const fetchAdoptionTrend = (f: CalendarWeeklyFilters) =>
  get<AdoptionTrendResponse>('adoption_trend', weeklyParams(f));

export const fetchGrowth = (f: CalendarWeeklyFilters) =>
  get<GrowthResponse>('growth', weeklyParams(f));

export const fetchRetention = (f: CalendarWeeklyFilters) =>
  get<RetentionResponse>('retention', weeklyParams(f));

export const fetchRoles = (f: CalendarRangeFilters) =>
  get<RolesResponse>('roles', rangeParams(f));

/* ------------------------------------------------------------------ Layer 3 */

export const fetchModules = (f: CalendarRangeFilters & { module?: string }) =>
  get<ModulesResponse>('modules', {
    ...rangeParams(f),
    ...(f.module ? { module: f.module } : {}),
  });

export const fetchWorkflowUsage = (f: CalendarRangeFilters & { module?: string; subModule?: string }) =>
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
