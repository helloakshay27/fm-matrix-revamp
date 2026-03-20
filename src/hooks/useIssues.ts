import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  fetchIssues,
  fetchIssueById,
  updateIssueApi,
  importIssuesApi,
  downloadSampleIssueFile,
} from "@/services/issuesApi";

/**
 * Query Keys for issues
 * Using hierarchical structure for better cache management
 */
export const issuesQueryKeys = {
  all: ["issues"] as const,
  lists: () => [...issuesQueryKeys.all, "list"] as const,
  list: (
    page: number,
    filters: string,
    search: string,
    sortBy?: string,
    sortDirection?: "asc" | "desc"
  ) =>
    [...issuesQueryKeys.lists(), { page, filters, search, sortBy, sortDirection }] as const,
  details: () => [...issuesQueryKeys.all, "detail"] as const,
  detail: (id: string | number) =>
    [...issuesQueryKeys.details(), id] as const,
};

interface UseIssuesOptions {
  baseUrl?: string;
  token?: string;
  page?: number;
  filters?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  enabled?: boolean;
}

/**
 * useIssues - Fetch paginated list of issues
 *
 * Features:
 * - Automatic caching with 30s stale time
 * - Automatic refetch on focus
 * - Search and filter support (Ransack format)
 * - Sorting support
 * - Pagination support
 *
 * Example:
 * const { data, isLoading, error, isFetching } = useIssues({
 *   page: 1,
 *   filters: "q[status_eq]=open&",
 *   search: "bug",
 *   sortBy: "created_at",
 *   sortDirection: "desc"
 * });
 */
export const useIssues = ({
  baseUrl,
  token,
  page = 1,
  filters = "",
  search = "",
  sortBy,
  sortDirection,
  enabled = true,
}: UseIssuesOptions = {}) => {
  return useQuery({
    queryKey: issuesQueryKeys.list(page, filters, search, sortBy, sortDirection),
    queryFn: () =>
      fetchIssues({
        baseUrl,
        token,
        page,
        filters,
        search,
        sortBy,
        sortDirection,
      }),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
    enabled: enabled && !!token, // Only fetch if token is available
  });
};

/**
 * useIssue - Fetch a single issue by ID
 *
 * Features:
 * - Automatic caching per issue ID
 * - Fresh data for 30 seconds
 * - Refetch on window focus
 * - Only fetches when ID is provided (enabled: !!id)
 */
export const useIssue = (
  id: string | number | undefined,
  baseUrl?: string,
  token?: string
) => {
  return useQuery({
    queryKey: issuesQueryKeys.detail(id!),
    queryFn: () => fetchIssueById(id!, baseUrl, token),
    enabled: !!id && !!token,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });
};

/**
 * useUpdateIssue - Update an issue
 *
 * Features:
 * - Automatic cache invalidation for list and detail
 * - Invalidates all issue lists to ensure fresh data
 * - Error handling
 *
 * Example:
 * const updateMutation = useUpdateIssue();
 * updateMutation.mutate({
 *   id: "123",
 *   data: { status: "completed" },
 *   baseUrl: "api.example.com",
 *   token: "token123"
 * });
 */
export const useUpdateIssue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
      baseUrl,
      token,
    }: {
      id: string | number;
      data: any;
      baseUrl?: string;
      token?: string;
    }) => {
      return updateIssueApi(id, data, baseUrl, token);
    },
    onSuccess: (data) => {
      // Invalidate all issue lists to trigger refetch
      queryClient.invalidateQueries({
        queryKey: issuesQueryKeys.lists(),
      });
      // Also invalidate the specific issue detail
      if (data.id) {
        queryClient.invalidateQueries({
          queryKey: issuesQueryKeys.detail(data.id),
        });
      }
    },
    onError: (error: any) => {
      console.error("Failed to update issue:", error.message);
    },
  });
};

/**
 * useImportIssues - Import issues from file
 *
 * Features:
 * - Automatic cache invalidation after success
 * - Invalidates all issue lists
 * - Error handling
 *
 * Example:
 * const importMutation = useImportIssues();
 * importMutation.mutate({
 *   file: file,
 *   baseUrl: "api.example.com",
 *   token: "token123"
 * });
 */
export const useImportIssues = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      baseUrl,
      token,
    }: {
      file: File;
      baseUrl?: string;
      token?: string;
    }) => {
      return importIssuesApi(file, baseUrl, token);
    },
    onSuccess: () => {
      // Invalidate all issue lists to trigger refetch
      queryClient.invalidateQueries({
        queryKey: issuesQueryKeys.lists(),
      });
    },
    onError: (error: any) => {
      console.error("Failed to import issues:", error.message);
    },
  });
};

/**
 * useDownloadSampleIssueFile - Download sample issues file
 */
export const useDownloadSampleIssueFile = () => {
  return useMutation({
    mutationFn: async ({
      baseUrl,
      token,
    }: {
      baseUrl?: string;
      token?: string;
    }) => {
      return downloadSampleIssueFile(baseUrl, token);
    },
    onError: (error: any) => {
      console.error("Failed to download sample file:", error.message);
    },
  });
};
