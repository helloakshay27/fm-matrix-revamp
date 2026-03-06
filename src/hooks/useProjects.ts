import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  changeProjectStatus,
  deleteProject,
  bulkDeleteProjects,
  importProjects,
} from "@/services/projectsApi";
import {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
  ApiError,
} from "@/types/projects";

/**
 * Query Keys for projects
 * Using hierarchical structure for better cache management
 * https://tanstack.com/query/latest/docs/framework/react/important-defaults
 */
export const projectsQueryKeys = {
  all: ["projects"] as const,
  lists: () => [...projectsQueryKeys.all, "list"] as const,
  list: (
    filters: string,
    search: string,
    sortBy?: string,
    sortDirection?: "asc" | "desc"
  ) =>
    [...projectsQueryKeys.lists(), { filters, search, sortBy, sortDirection }] as const,
  paginated: (page: number, filters: string, search: string) =>
    [...projectsQueryKeys.lists(), "paginated", { page, filters, search }] as const,
  details: () => [...projectsQueryKeys.all, "detail"] as const,
  detail: (id: number | string) =>
    [...projectsQueryKeys.details(), id] as const,
};

/**
 * useProjects - Fetch paginated list of projects
 *
 * Features:
 * - Automatic caching with 30s stale time
 * - Automatic refetch on focus
 * - Search and filter support (Ransack format)
 * - Sorting support
 * - Pagination support
 *
 * Example:
 * const { data, isLoading, error, isFetching } = useProjects({
 *   page: 1,
 *   filters: "q[status_eq]=active&",
 *   search: "test",
 *   sortBy: "title",
 *   sortDirection: "asc"
 * });
 */
interface UseProjectsOptions {
  page?: number;
  filters?: string;
  search?: string;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export const useProjects = ({
  page = 1,
  filters = "",
  search = "",
  sortBy,
  sortDirection,
}: UseProjectsOptions = {}) => {
  return useQuery({
    queryKey: projectsQueryKeys.paginated(page, filters, search),
    queryFn: () =>
      fetchProjects(page, filters, search, sortBy, sortDirection),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

/**
 * useProject - Fetch a single project by ID
 *
 * Features:
 * - Automatic caching per project ID
 * - Fresh data for 30 seconds
 * - Refetch on window focus
 * - Only fetches when ID is provided (enabled: !!id)
 *
 * Example:
 * const { data: project, isLoading, error } = useProject(123);
 */
export const useProject = (id: number | string | undefined) => {
  return useQuery({
    queryKey: projectsQueryKeys.detail(id!),
    queryFn: () => fetchProjectById(id!),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

/**
 * useCreateProject - Create a new project
 *
 * Features:
 * - Automatic cache invalidation after success
 * - Invalidates all project lists to trigger refetch
 * - Error handling
 * - Loading state
 *
 * Example:
 * const createMutation = useCreateProject();
 * createMutation.mutate({
 *   project_management: {
 *     title: "New Project",
 *     start_date: "2026-01-01",
 *     end_date: "2026-12-31",
 *     status: "active",
 *     owner_id: 1,
 *     priority: "high",
 *     active: true,
 *     project_type_id: 1
 *   }
 * });
 */
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => createProject(payload),
    onSuccess: () => {
      // Invalidate all projects lists to trigger refetch
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.lists(),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to create project:", error.message);
    },
  });
};

/**
 * useUpdateProject - Update an existing project
 *
 * Features:
 * - Automatic cache invalidation for list and detail
 * - Invalidates both the list and the specific project detail
 * - Error handling
 *
 * Example:
 * const updateMutation = useUpdateProject();
 * updateMutation.mutate({
 *   id: 123,
 *   data: { project_management: { status: "completed" } }
 * });
 */
export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateProjectPayload;
    }) => {
      return updateProject(id, data);
    },
    onSuccess: (data) => {
      // Invalidate both list and specific project detail
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.detail(data.id),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to update project:", error.message);
    },
  });
};

/**
 * useChangeProjectStatus - Change project status
 *
 * Features:
 * - Quick status update
 * - Automatic cache invalidation
 * - Cascading invalidation of list and details
 *
 * Example:
 * const statusMutation = useChangeProjectStatus();
 * statusMutation.mutate({
 *   id: 123,
 *   status: "completed"
 * });
 */
export const useChangeProjectStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number | string;
      status: string;
    }) => {
      return changeProjectStatus(id, status);
    },
    onSuccess: (data) => {
      // Invalidate both list and specific project detail
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.detail(data.id),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to change project status:", error.message);
    },
  });
};

/**
 * useDeleteProject - Delete a project
 *
 * Features:
 * - Automatic cache invalidation
 * - Cascading invalidation of list and details
 * - Error handling
 *
 * Example:
 * const deleteMutation = useDeleteProject();
 * deleteMutation.mutate(123);
 */
export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteProject(id),
    onSuccess: (_, id) => {
      // Invalidate both list and specific project detail
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.detail(id),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to delete project:", error.message);
    },
  });
};

/**
 * useBulkDeleteProjects - Delete multiple projects
 *
 * Example:
 * const bulkDeleteMutation = useBulkDeleteProjects();
 * bulkDeleteMutation.mutate([1, 2, 3]);
 */
export const useBulkDeleteProjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => bulkDeleteProjects(ids),
    onSuccess: () => {
      // Invalidate all projects lists
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.lists(),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to delete projects:", error.message);
    },
  });
};

/**
 * useImportProjects - Import projects from file
 *
 * Example:
 * const importMutation = useImportProjects();
 * importMutation.mutate(file);
 */
export const useImportProjects = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => importProjects(file),
    onSuccess: () => {
      // Invalidate all projects lists
      queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.lists(),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to import projects:", error.message);
    },
  });
};

/**
 * Utility hook to manually invalidate queries
 * Useful for custom scenarios where automatic invalidation isn't triggered
 *
 * Example:
 * const { invalidateList, invalidateDetail } = useInvalidateProjects();
 * await invalidateList();
 */
export const useInvalidateProjects = () => {
  const queryClient = useQueryClient();

  return {
    invalidateList: useCallback(() => {
      return queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.lists(),
      });
    }, [queryClient]),
    invalidateDetail: useCallback((id: number | string) => {
      return queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.detail(id),
      });
    }, [queryClient]),
    invalidateAll: useCallback(() => {
      return queryClient.invalidateQueries({
        queryKey: projectsQueryKeys.all,
      });
    }, [queryClient]),
  };
};
