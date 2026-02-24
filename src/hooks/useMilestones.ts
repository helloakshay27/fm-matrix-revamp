import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  fetchMilestones,
  fetchMilestoneById,
  createMilestone,
  updateMilestone,
  changeMilestoneStatus,
  deleteMilestone,
  importMilestones,
} from "@/services/milestonesApi";
import {
  Milestone,
  CreateMilestonePayload,
  UpdateMilestonePayload,
  ApiError,
} from "@/types/milestones";

/**
 * Query Keys for milestones
 * Using hierarchical structure for better cache management
 * https://tanstack.com/query/latest/docs/framework/react/important-defaults
 */
export const milestonesQueryKeys = {
  all: ["milestones"] as const,
  lists: () => [...milestonesQueryKeys.all, "list"] as const,
  list: (projectId: number | string, sortBy?: string, sortDirection?: "asc" | "desc") =>
    [...milestonesQueryKeys.lists(), { projectId, sortBy, sortDirection }] as const,
  details: () => [...milestonesQueryKeys.all, "detail"] as const,
  detail: (projectId: number | string, milestoneId: number | string) =>
    [...milestonesQueryKeys.details(), { projectId, milestoneId }] as const,
};

/**
 * useMilestones - Fetch list of milestones for a project
 *
 * Features:
 * - Automatic caching with 30s stale time
 * - Automatic refetch on focus
 * - Sorting support
 *
 * Example:
 * const { data, isLoading, error, isFetching } = useMilestones({
 *   projectId: 1,
 *   sortBy: "title",
 *   sortDirection: "asc"
 * });
 */
interface UseMilestonesOptions {
  projectId: number | string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export const useMilestones = ({
  projectId,
  sortBy,
  sortDirection,
}: UseMilestonesOptions) => {
  return useQuery({
    queryKey: milestonesQueryKeys.list(projectId, sortBy, sortDirection),
    queryFn: () =>
      fetchMilestones(projectId, sortBy, sortDirection),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 1,
  });
};

/**
 * useMilestone - Fetch a single milestone
 */
export const useMilestone = (projectId: number | string, milestoneId: number | string) => {
  return useQuery({
    queryKey: milestonesQueryKeys.detail(projectId, milestoneId),
    queryFn: () => fetchMilestoneById(milestoneId),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

/**
 * useCreateMilestone - Create a new milestone
 *
 * Features:
 * - Automatic cache invalidation
 * - Promise-based mutation
 *
 * Example:
 * const { mutateAsync, isPending } = useCreateMilestone();
 * await mutateAsync({ projectId: 1, milestone: {...} });
 */
export const useCreateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, payload }: { projectId: number | string; payload: CreateMilestonePayload }) =>
      createMilestone(payload),
    onSuccess: (data, variables) => {
      // Invalidate list to force refetch
      queryClient.invalidateQueries({
        queryKey: milestonesQueryKeys.lists(),
      });
    },
    onError: (error: any) => {
      console.error("❌ [useMilestones] Create failed:", error.message);
    },
  });
};

/**
 * useUpdateMilestone - Update a milestone
 */
export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      milestoneId,
      payload,
    }: {
      projectId: number | string;
      milestoneId: number | string;
      payload: UpdateMilestonePayload;
    }) => updateMilestone(milestoneId, payload),
    onSuccess: (data, variables) => {
      // Invalidate both list and detail
      queryClient.invalidateQueries({
        queryKey: milestonesQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: milestonesQueryKeys.detail(variables.projectId, variables.milestoneId),
      });
    },
    onError: (error: any) => {
      console.error("❌ [useMilestones] Update failed:", error.message);
    },
  });
};

/**
 * useChangeMilestoneStatus - Change milestone status
 *
 * Features:
 * - Optimistic updates possible
 * - Automatic cache invalidation
 *
 * Example:
 * const { mutateAsync } = useChangeMilestoneStatus();
 * await mutateAsync({ projectId: 1, milestoneId: 5, status: "completed" });
 */
export const useChangeMilestoneStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      milestoneId,
      status,
    }: {
      projectId: number | string;
      milestoneId: number | string;
      status: string;
    }) => changeMilestoneStatus(milestoneId, status),
    onSuccess: (data, variables) => {
      // Invalidate cache so list refetches
      queryClient.invalidateQueries({
        queryKey: milestonesQueryKeys.lists(),
      });
    },
    onError: (error: any) => {
      console.error("❌ [useMilestones] Status change failed:", error.message);
    },
  });
};

/**
 * useDeleteMilestone - Delete a milestone
 */
export const useDeleteMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      milestoneId,
    }: {
      projectId: number | string;
      milestoneId: number | string;
    }) => deleteMilestone(milestoneId),
    onSuccess: (data, variables) => {
      // Invalidate list to force refetch
      queryClient.invalidateQueries({
        queryKey: milestonesQueryKeys.lists(),
      });
    },
    onError: (error: any) => {
      console.error("❌ [useMilestones] Delete failed:", error.message);
    },
  });
};

/**
 * useImportMilestones - Import milestones from file
 */
export const useImportMilestones = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, file }: { projectId: number | string; file: File }) =>
      importMilestones(file),
    onSuccess: (data, variables) => {
      // Invalidate list to force refetch
      queryClient.invalidateQueries({
        queryKey: milestonesQueryKeys.lists(),
      });
    },
    onError: (error: any) => {
      console.error("❌ [useMilestones] Import failed:", error.message);
    },
  });
};

/**
 * useInvalidateMilestones - Manual cache invalidation helper
 * Useful for forcing refetch after operations
 */
export const useInvalidateMilestones = () => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: milestonesQueryKeys.all,
    });
  }, [queryClient]);
};
