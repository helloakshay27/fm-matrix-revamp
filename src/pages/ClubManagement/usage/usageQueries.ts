import { useQueries, useQuery } from "@tanstack/react-query";
import {
  fetchAdoptionEngagement,
  fetchAdoptionTrend,
  fetchGrowth,
  fetchModules,
  fetchRetention,
  fetchRecentActiveUsers,
  fetchRoles,
  fetchTrafficSession,
  fetchUsageAndDistribution,
  fetchWorkflowUsage,
} from "@/features/posthog-dashboard/api/adoptionApi";
import type { RangeFilters, WeeklyFilters } from "@/features/posthog-dashboard/api/adoptionApi";
import type { UsageFilters } from "./usageData";

export const CLUB_PROJECT_CODE = "CM-01";
const configuredTenant = (import.meta.env.VITE_FM_ADOPTION_TENANT_URL as string | undefined)?.trim();
const CLUB_TENANT = configuredTenant || "fm-matrix.lockated.com";
const CACHE = {
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
  refetchOnWindowFocus: false,
  retry: 1,
} as const;

function rangeParams(filters: UsageFilters): RangeFilters {
  return {
    from: filters.rangeFrom,
    to: filters.rangeTo,
    projectCode: CLUB_PROJECT_CODE,
    tenantUrl: CLUB_TENANT,
  };
}

function weeklyParams(filters: UsageFilters, weeks: number): WeeklyFilters {
  return {
    to: filters.rangeTo,
    weeks,
    projectCode: CLUB_PROJECT_CODE,
    tenantUrl: CLUB_TENANT,
  };
}

export function useTrafficUsageQueries(filters: UsageFilters) {
  const params = rangeParams(filters);
  return useQueries({
    queries: [
      {
        queryKey: ["club-usage", "traffic_session", params],
        queryFn: ({ signal }) => fetchTrafficSession({ ...params, signal }),
        ...CACHE,
      },
      {
        queryKey: ["club-usage", "usage_and_distribution", params],
        queryFn: ({ signal }) => fetchUsageAndDistribution({ ...params, signal }),
        ...CACHE,
      },
    ],
  });
}

export function useClubRecentActiveUsers(filters: UsageFilters) {
  const params: RangeFilters = rangeParams(filters);
  return useQuery({
    queryKey: ["club-usage", "recent-active-users", params],
    queryFn: ({ signal }) => fetchRecentActiveUsers({ ...params, signal }),
    ...CACHE,
  });
}

export function useAdoptionUsageQueries(filters: UsageFilters) {
  const params = rangeParams(filters);
  const trend = weeklyParams(filters, 8);
  const growth = weeklyParams(filters, 6);
  const retention = weeklyParams(filters, 8);
  return useQueries({
    queries: [
      { queryKey: ["club-usage", "adoption_engagement", params], queryFn: ({ signal }) => fetchAdoptionEngagement({ ...params, signal }), ...CACHE },
      { queryKey: ["club-usage", "adoption_trend", trend], queryFn: ({ signal }) => fetchAdoptionTrend({ ...trend, signal }), ...CACHE },
      { queryKey: ["club-usage", "growth", growth], queryFn: ({ signal }) => fetchGrowth({ ...growth, signal }), ...CACHE },
      { queryKey: ["club-usage", "retention", retention], queryFn: ({ signal }) => fetchRetention({ ...retention, signal }), ...CACHE },
      { queryKey: ["club-usage", "roles", params], queryFn: ({ signal }) => fetchRoles({ ...params, signal }), ...CACHE },
    ],
  });
}

export function useUsageModules(filters: UsageFilters, module?: string) {
  const params = { ...rangeParams(filters), module };
  return useQuery({
    queryKey: ["club-usage", module ? "sub-modules" : "modules", params],
    queryFn: ({ signal }) => fetchModules({ ...params, signal }),
    ...CACHE,
  });
}

export function useWorkflowUsageQueries(
  filters: UsageFilters,
  module?: string,
  subModule?: string,
  filtersSettled = true,
) {
  const params = { ...rangeParams(filters), module, subModule };
  return useQuery({
    queryKey: ["club-usage", "workflow_usage", params],
    queryFn: ({ signal }) => fetchWorkflowUsage({ ...params, signal }),
    enabled: Boolean(module) && filtersSettled,
    ...CACHE,
  });
}
