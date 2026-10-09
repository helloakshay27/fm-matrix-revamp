/**
 * React Query hooks for PATM Analytics (project_code=PTM-01).
 * All hooks return the raw response shape from adoptionApi.ts.
 */

import { useQuery } from '@tanstack/react-query';
import {
  fetchPatmTrafficSession,
  fetchPatmUsageAndDistribution,
  fetchPatmAdoptionEngagement,
  fetchPatmAdoptionTrend,
  fetchPatmGrowth,
  fetchPatmRetention,
  fetchPatmModules,
  fetchPatmWorkflowUsage,
  type PATMRangeFilters,
  type PATMWeeklyFilters,
} from './patmApi';

// ClickHouse scans are expensive — cache generously and never auto-refetch.
const CACHE = {
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: false,
} as const;

export const TREND_WEEKS = 8;
export const GROWTH_WEEKS = 6;
export const RETENTION_WEEKS = 6;

/* ── Layer 1 ─────────────────────────────────────────────────────── */

export function usePatmTrafficSession(
  f: PATMRangeFilters & { enabled?: boolean },
) {
  return useQuery({
    queryKey: [
      'patm',
      'traffic_session',
      f.baseUrl ?? 'fm-matrix.lockated.com',
      f.from,
      f.to,
      f.appId ?? '',
      f.device ?? 'all',
    ],
    queryFn: () => fetchPatmTrafficSession(f),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function usePatmUsageAndDistribution(
  f: PATMRangeFilters & { enabled?: boolean },
) {
  return useQuery({
    queryKey: [
      'patm',
      'usage_distribution',
      f.baseUrl ?? 'fm-matrix.lockated.com',
      f.from,
      f.to,
      f.appId ?? '',
      f.device ?? 'all',
    ],
    queryFn: () => fetchPatmUsageAndDistribution(f),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

/* ── Layer 2 ─────────────────────────────────────────────────────── */

export function usePatmAdoptionEngagement(
  f: PATMRangeFilters & { licensedSeats?: number | null; enabled?: boolean },
) {
  return useQuery({
    queryKey: [
      'patm',
      'adoption_engagement',
      f.baseUrl ?? 'fm-matrix.lockated.com',
      f.from,
      f.to,
      f.appId ?? '',
      f.device ?? 'all',
      f.licensedSeats ?? '',
    ],
    queryFn: () => fetchPatmAdoptionEngagement(f),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function usePatmAdoptionTrend(
  f: PATMWeeklyFilters & { enabled?: boolean },
) {
  return useQuery({
    queryKey: [
      'patm',
      'adoption_trend',
      f.baseUrl ?? 'fm-matrix.lockated.com',
      f.to,
      f.appId ?? '',
      f.weeks,
      f.device ?? 'all',
    ],
    queryFn: () => fetchPatmAdoptionTrend(f),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function usePatmGrowth(f: PATMWeeklyFilters & { enabled?: boolean }) {
  return useQuery({
    queryKey: [
      'patm',
      'growth',
      f.baseUrl ?? 'fm-matrix.lockated.com',
      f.to,
      f.appId ?? '',
      f.weeks,
      f.device ?? 'all',
    ],
    queryFn: () => fetchPatmGrowth(f),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function usePatmRetention(f: PATMWeeklyFilters & { enabled?: boolean }) {
  return useQuery({
    queryKey: [
      'patm',
      'retention',
      f.baseUrl ?? 'fm-matrix.lockated.com',
      f.to,
      f.appId ?? '',
      f.weeks,
      f.device ?? 'all',
    ],
    queryFn: () => fetchPatmRetention(f),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

/* ── Layer 3 ─────────────────────────────────────────────────────── */

export function usePatmModules(f: PATMRangeFilters & { enabled?: boolean }) {
  return useQuery({
    queryKey: [
      'patm',
      'modules',
      f.baseUrl ?? 'fm-matrix.lockated.com',
      f.from,
      f.to,
      f.appId ?? '',
      f.device ?? 'all',
    ],
    queryFn: () => fetchPatmModules(f),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function usePatmSubModules(
  f: PATMRangeFilters & { module?: string; enabled?: boolean },
) {
  return useQuery({
    queryKey: [
      'patm',
      'sub_modules',
      f.baseUrl ?? 'fm-matrix.lockated.com',
      f.module ?? '',
      f.from,
      f.to,
      f.appId ?? '',
      f.device ?? 'all',
    ],
    queryFn: () => fetchPatmModules({ ...f, module: f.module }),
    enabled: f.enabled !== false && !!f.module,
    ...CACHE,
  });
}

export function usePatmWorkflowUsage(
  f: PATMRangeFilters & {
    module?: string;
    subModule?: string;
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey: [
      'patm',
      'workflow_usage',
      f.baseUrl ?? 'fm-matrix.lockated.com',
      f.module ?? '',
      f.subModule ?? '',
      f.from,
      f.to,
      f.appId ?? '',
      f.device ?? 'all',
    ],
    queryFn: () => fetchPatmWorkflowUsage(f),
    enabled: f.enabled !== false && !!f.module,
    ...CACHE,
  });
}
