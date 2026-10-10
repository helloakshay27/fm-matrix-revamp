/**
 * PATM Analytics API client.
 *
 * All requests are scoped to project_code=PTM-01.
 * app_id is optional — the user will pass it later to narrow to a specific app.
 *
 * Base URL : VITE_FM_ADOPTION_API_URL (default https://posthog-api.lockated.com)
 * Endpoints: /fm/adoption/* (same ClickHouse-backed endpoints as FM/Pulse dashboards)
 */

import axios from 'axios';

// Re-export all response types from the shared adoptionApi so callers only import from here.
export type {
  TrafficSessionResponse,
  UsageDistributionResponse,
  AdoptionEngagementResponse,
  AdoptionTrendResponse,
  GrowthResponse,
  RetentionResponse,
  RolesResponse,
  ModulesResponse,
  WorkflowUsageResponse,
  RecentActiveUsersResponse,
  WorkflowFunnelStep,
  WorkflowFlowRow,
  WorkflowEntryScreen,
  GrowthWeekRow,
  RetentionCohort,
  WeeklyWau,
  ModuleNode,
} from '@/features/posthog-dashboard/api/adoptionApi';

/* ── constants ─────────────────────────────────────────────────────── */

export const PATM_PROJECT_CODE = 'PTM-01';

export const ANALYTICS_BASE_URL =
  (import.meta.env.VITE_FM_ADOPTION_API_URL as string | undefined) ??
  'https://posthog-api.lockated.com';

/** Frontend tenant whose events are queried; never the backend API host. */
function getPatmBaseUrl(override?: string): string {
  return override ?? 'fm-matrix.lockated.com';
}

/* ── axios client ───────────────────────────────────────────────────── */

const client = axios.create({
  baseURL: ANALYTICS_BASE_URL,
  timeout: 60_000,
  headers: { 'Content-Type': 'application/json' },
});

client.interceptors.request.use((config) => {
  const token =
    localStorage.getItem('access_token') ||
    sessionStorage.getItem('access_token') ||
    localStorage.getItem('token') ||
    '';
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// HTTP failures stay rejected so the dashboard can display an error state.

/* ── query-string builder (raw commas for multi-value params) ─────── */

type Pair = [string, string | string[] | number | undefined | null];

function buildQuery(pairs: Pair[]): string {
  const parts: string[] = [];
  for (const [key, value] of pairs) {
    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      parts.push(`${key}=${value.join(',')}`);
    } else {
      parts.push(`${key}=${encodeURIComponent(String(value))}`);
    }
  }
  return parts.join('&');
}

async function get<T>(endpoint: string, pairs: Pair[]): Promise<T> {
  const qs = buildQuery(pairs);
  const { data } = await client.get<T>(
    `/fm/adoption/${endpoint}${qs ? `?${qs}` : ''}`,
  );
  return data;
}

/* ── filter types ───────────────────────────────────────────────────── */

export interface PATMRangeFilters {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  appId?: string; // passed once the user supplies one
  baseUrl?: string; // frontend tenant URL; defaults to fm-matrix.lockated.com
  device?: string; // 'all' | 'desktop' | 'mobile' → mapped to Desktop/Mobile
}

export interface PATMWeeklyFilters {
  to: string;
  weeks: number;
  appId?: string;
  baseUrl?: string;
  device?: string;
}

/* ── device mapping ─────────────────────────────────────────────────── */

function mapDevice(device?: string): string | undefined {
  if (device === 'desktop') return 'Desktop';
  if (device === 'mobile') return 'Mobile';
  return undefined; // 'all' → param omitted, API aggregates all platforms
}

/* ── shared param builders ──────────────────────────────────────────── */

function rangeParams(f: PATMRangeFilters): Pair[] {
  const url = getPatmBaseUrl(f.baseUrl);
  const deviceType = mapDevice(f.device);
  return [
    ['project_code', PATM_PROJECT_CODE],
    ['url', url],
    ...(f.appId ? [['app_id', f.appId] as Pair] : []),
    ['from', f.from],
    ['to', f.to],
    ...(deviceType ? [['device_type', deviceType] as Pair] : []),
  ];
}

function weeklyParams(f: PATMWeeklyFilters): Pair[] {
  const url = getPatmBaseUrl(f.baseUrl);
  const deviceType = mapDevice(f.device);
  return [
    ['project_code', PATM_PROJECT_CODE],
    ['url', url],
    ...(f.appId ? [['app_id', f.appId] as Pair] : []),
    ['to', f.to],
    ['weeks', f.weeks],
    ...(deviceType ? [['device_type', deviceType] as Pair] : []),
  ];
}

/* ── Layer 1 · Traffic & Session ────────────────────────────────────── */

import type { TrafficSessionResponse } from '@/features/posthog-dashboard/api/adoptionApi';
export const fetchPatmTrafficSession = (f: PATMRangeFilters) =>
  get<TrafficSessionResponse>('traffic_session', rangeParams(f));

import type { UsageDistributionResponse } from '@/features/posthog-dashboard/api/adoptionApi';
export const fetchPatmUsageAndDistribution = (f: PATMRangeFilters) =>
  get<UsageDistributionResponse>('usage_and_distribution', rangeParams(f));

/* ── Layer 2 · Adoption & Engagement ───────────────────────────────── */

import type { AdoptionEngagementResponse } from '@/features/posthog-dashboard/api/adoptionApi';
export const fetchPatmAdoptionEngagement = (
  f: PATMRangeFilters & { licensedSeats?: number | null },
) => {
  const pairs = rangeParams(f);
  if (f.licensedSeats != null && f.licensedSeats > 0)
    pairs.push(['licensed_seats', f.licensedSeats]);
  return get<AdoptionEngagementResponse>('adoption_engagement', pairs);
};

import type { AdoptionTrendResponse } from '@/features/posthog-dashboard/api/adoptionApi';
export const fetchPatmAdoptionTrend = (f: PATMWeeklyFilters) =>
  get<AdoptionTrendResponse>('adoption_trend', weeklyParams(f));

import type { GrowthResponse } from '@/features/posthog-dashboard/api/adoptionApi';
export const fetchPatmGrowth = (f: PATMWeeklyFilters) =>
  get<GrowthResponse>('growth', weeklyParams(f));

import type { RetentionResponse } from '@/features/posthog-dashboard/api/adoptionApi';
export const fetchPatmRetention = (f: PATMWeeklyFilters) =>
  get<RetentionResponse>('retention', weeklyParams(f));

/* ── Layer 3 · Workflow Usage ───────────────────────────────────────── */

import type { ModulesResponse } from '@/features/posthog-dashboard/api/adoptionApi';
export const fetchPatmModules = (f: PATMRangeFilters & { module?: string }) => {
  // Discover frontend paths within the PATM project; app_id stays optional.
  const pairs: Pair[] = [
    ['url', getPatmBaseUrl(f.baseUrl)],
    ['project_code', PATM_PROJECT_CODE],
    ['from', f.from],
    ['to', f.to],
    ['app_id', f.appId],
    ['device_type', mapDevice(f.device)],
  ];
  if (f.module) pairs.push(['module', f.module]);
  return get<ModulesResponse>('modules', pairs);
};

import type { WorkflowUsageResponse } from '@/features/posthog-dashboard/api/adoptionApi';
export const fetchPatmWorkflowUsage = (
  f: PATMRangeFilters & { module?: string; subModule?: string },
) => {
  const pairs = rangeParams(f);
  if (f.module) pairs.push(['module', f.module]);
  if (f.subModule) pairs.push(['sub_module', f.subModule]);
  return get<WorkflowUsageResponse>('workflow_usage', pairs);
};
