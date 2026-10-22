import { useQuery } from '@tanstack/react-query';
import {
  fetchAdoptionEngagement,
  fetchAdoptionTrend,
  fetchRecentActiveUsers,
  fetchGrowth,
  fetchModules,
  fetchRetention,
  fetchRoles,
  fetchTrafficSession,
  fetchUsageAndDistribution,
  fetchWorkflowUsage,
  type AccountingOsType,
  ACCOUNTING_APP_ID,
} from './adoptionApi';

export interface AccountingQueryFilters {
  enabled?: boolean;
  from: string;
  to: string;
  os?: AccountingOsType[];
  provider?: string;
  module?: string | null;
  subModule?: string | null;
}

const CACHE = { staleTime: 5 * 60_000, gcTime: 30 * 60_000, refetchOnWindowFocus: false } as const;

const ROOT = ['accounting-adoption', 'app', ACCOUNTING_APP_ID] as const;

const keyBase = (f: AccountingQueryFilters) => [
  f.from,
  f.to,
  f.os ? f.os.join(',') : 'all',
  f.provider || 'all',
];

export function useTrafficSession(f: AccountingQueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'traffic_session', ...keyBase(f)],
    queryFn: () =>
      fetchTrafficSession({
        from: f.from,
        to: f.to,
        os: f.os,
        provider: f.provider,
      }),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function useUsageAndDistribution(f: AccountingQueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'usage_and_distribution', ...keyBase(f)],
    queryFn: () =>
      fetchUsageAndDistribution({
        from: f.from,
        to: f.to,
        os: f.os,
        provider: f.provider,
      }),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function useAdoptionEngagement(f: AccountingQueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'adoption_engagement', ...keyBase(f)],
    queryFn: () =>
      fetchAdoptionEngagement({
        from: f.from,
        to: f.to,
        os: f.os,
        provider: f.provider,
      }),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function useAdoptionTrend(f: AccountingQueryFilters, weeks = 8) {
  return useQuery({
    queryKey: [...ROOT, 'adoption_trend', f.to, f.os ? f.os.join(',') : 'all', f.provider || 'all', weeks],
    queryFn: () =>
      fetchAdoptionTrend({
        to: f.to,
        weeks,
        os: f.os,
        provider: f.provider,
      }),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function useGrowth(f: AccountingQueryFilters, weeks = 6) {
  return useQuery({
    queryKey: [...ROOT, 'growth', f.to, f.os ? f.os.join(',') : 'all', f.provider || 'all', weeks],
    queryFn: () =>
      fetchGrowth({
        to: f.to,
        weeks,
        os: f.os,
        provider: f.provider,
      }),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function useRetention(f: AccountingQueryFilters, weeks = 6) {
  return useQuery({
    queryKey: [...ROOT, 'retention', f.to, f.os ? f.os.join(',') : 'all', f.provider || 'all', weeks],
    queryFn: () =>
      fetchRetention({
        to: f.to,
        weeks,
        os: f.os,
        provider: f.provider,
      }),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function useRoles(f: AccountingQueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'roles', ...keyBase(f)],
    queryFn: () =>
      fetchRoles({
        from: f.from,
        to: f.to,
        os: f.os,
        provider: f.provider,
      }),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function useModules(f: AccountingQueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'modules', ...keyBase(f), f.module ?? ''],
    queryFn: () =>
      fetchModules({
        from: f.from,
        to: f.to,
        os: f.os,
        provider: f.provider,
        module: f.module ?? undefined,
      }),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function useWorkflowUsage(f: AccountingQueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'workflow_usage', ...keyBase(f), f.module ?? '', f.subModule ?? ''],
    queryFn: () =>
      fetchWorkflowUsage({
        from: f.from,
        to: f.to,
        os: f.os,
        provider: f.provider,
        module: f.module ?? undefined,
        subModule: f.subModule ?? undefined,
      }),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}

export function useRecentActiveUsers(f: AccountingQueryFilters) {
  return useQuery({
    queryKey: [...ROOT, 'recent_active_users', ...keyBase(f)],
    queryFn: () =>
      fetchRecentActiveUsers({
        from: f.from,
        to: f.to,
        os: f.os,
        provider: f.provider,
      }),
    enabled: f.enabled !== false,
    ...CACHE,
  });
}
