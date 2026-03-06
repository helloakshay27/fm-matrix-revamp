import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import {
  fetchTasks,
  fetchMyTasks,
  fetchTaskById,
  createTask,
  updateTask,
  changeTaskStatus,
  updateTaskCompletion,
  deleteTask,
  importTasks,
} from "@/services/tasksApi";
import {
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  ApiError,
} from "@/types/tasks";

/**
 * Query Keys for tasks
 * Using hierarchical structure for better cache management
 * https://tanstack.com/query/latest/docs/framework/react/important-defaults
 */
export const tasksQueryKeys = {
  all: ["tasks"] as const,
  lists: () => [...tasksQueryKeys.all, "list"] as const,
  list: (
    taskType: "all" | "my",
    page: number,
    filters: Record<string, any>,
    sortBy?: string,
    sortDirection?: "asc" | "desc"
  ) =>
    [
      ...tasksQueryKeys.lists(),
      "paginated",
      { taskType, page, filters, sortBy, sortDirection },
    ] as const,
  details: () => [...tasksQueryKeys.all, "detail"] as const,
  detail: (id: number | string) =>
    [...tasksQueryKeys.details(), id] as const,
};

/**
 * useTasks - Fetch paginated list of tasks
 *
 * Features:
 * - Automatic caching with 30s stale time
 * - Automatic refetch on focus
 * - Filter support (Ransack format)
 * - Sorting support
 * - Pagination support
 * - Support for "all tasks" and "my tasks" modes
 *
 * Example:
 * const { data, isLoading, error } = useTasks({
 *   taskType: "all",
 *   page: 1,
 *   filters: { "q[status_eq]": "open" },
 *   sortBy: "title",
 *   sortDirection: "asc"
 * });
 */
interface UseTasksOptions {
  taskType?: "all" | "my";
  page?: number;
  filters?: Record<string, any>;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export const useTasks = ({
  taskType = "all",
  page = 1,
  filters = {},
  sortBy,
  sortDirection,
}: UseTasksOptions = {}) => {
  return useQuery({
    queryKey: tasksQueryKeys.list(taskType, page, filters, sortBy, sortDirection),
    queryFn: () =>
      taskType === "my"
        ? fetchMyTasks(page, filters, sortBy, sortDirection)
        : fetchTasks(page, filters, sortBy, sortDirection),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

/**
 * useTask - Fetch a single task by ID
 *
 * Features:
 * - Automatic caching per task ID
 * - Fresh data for 30 seconds
 * - Refetch on window focus
 * - Only fetches when ID is provided (enabled: !!id)
 *
 * Example:
 * const { data: task, isLoading, error } = useTask(123);
 */
export const useTask = (id: number | string | undefined) => {
  return useQuery({
    queryKey: tasksQueryKeys.detail(id!),
    queryFn: () => fetchTaskById(id!),
    enabled: !!id, // Only fetch if ID is provided
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });
};

/**
 * useCreateTask - Create a new task
 *
 * Features:
 * - Automatic cache invalidation after success
 * - Invalidates all task lists to trigger refetch
 * - Error handling
 * - Loading state
 *
 * Example:
 * const createMutation = useCreateTask();
 * createMutation.mutate({
 *   task_management: {
 *     title: "New Task",
 *     expected_start_date: "2026-01-01",
 *     target_date: "2026-01-31",
 *     status: "open",
 *     priority: "Medium",
 *     active: true
 *   }
 * });
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: () => {
      // Invalidate all tasks lists to trigger refetch
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.lists(),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to create task:", error.message);
    },
  });
};

/**
 * useUpdateTask - Update an existing task
 *
 * Features:
 * - Automatic cache invalidation for list and detail
 * - Invalidates both the list and the specific task detail
 * - Error handling
 *
 * Example:
 * const updateMutation = useUpdateTask();
 * updateMutation.mutate({
 *   id: 123,
 *   data: { task_management: { title: "Updated Title" } }
 * });
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string;
      data: UpdateTaskPayload;
    }) => {
      return updateTask(id, data);
    },
    onSuccess: (data) => {
      // Invalidate both list and specific task detail
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.detail(data.id),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to update task:", error.message);
    },
  });
};

/**
 * useChangeTaskStatus - Change task status
 *
 * Features:
 * - Quick status update
 * - Automatic cache invalidation
 * - Cascading invalidation of list and details
 *
 * Example:
 * const statusMutation = useChangeTaskStatus();
 * statusMutation.mutate({
 *   id: 123,
 *   status: "completed"
 * });
 */
export const useChangeTaskStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number | string;
      status: string;
    }) => {
      return changeTaskStatus(id, status);
    },
    onSuccess: (data) => {
      // Invalidate both list and specific task detail
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.detail(data.id),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to change task status:", error.message);
    },
  });
};

/**
 * useUpdateTaskCompletion - Update task completion percentage
 *
 * Features:
 * - Update completion percent
 * - Automatic cache invalidation
 * - Error handling
 *
 * Example:
 * const completionMutation = useUpdateTaskCompletion();
 * completionMutation.mutate({
 *   id: 123,
 *   completionPercent: 75
 * });
 */
export const useUpdateTaskCompletion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      completionPercent,
    }: {
      id: number | string;
      completionPercent: number;
    }) => {
      return updateTaskCompletion(id, completionPercent);
    },
    onSuccess: (data) => {
      // Invalidate both list and specific task detail
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.detail(data.id),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to update task completion:", error.message);
    },
  });
};

/**
 * useDeleteTask - Delete a task
 *
 * Features:
 * - Delete task
 * - Automatic cache invalidation
 * - Error handling
 *
 * Example:
 * const deleteMutation = useDeleteTask();
 * deleteMutation.mutate(123);
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteTask(id),
    onSuccess: () => {
      // Invalidate all tasks lists
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.lists(),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to delete task:", error.message);
    },
  });
};

/**
 * useImportTasks - Import tasks from file
 *
 * Features:
 * - Import tasks in bulk from file
 * - Automatic cache invalidation
 * - Error handling
 *
 * Example:
 * const importMutation = useImportTasks();
 * importMutation.mutate(file);
 */
export const useImportTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => importTasks(file),
    onSuccess: () => {
      // Invalidate all tasks lists
      queryClient.invalidateQueries({
        queryKey: tasksQueryKeys.lists(),
      });
    },
    onError: (error: ApiError) => {
      console.error("Failed to import tasks:", error.message);
    },
  });
};

/**
 * useInvalidateTasks - Helper to manually invalidate task queries
 * 
 * Use this when you need to force a refetch of tasks after an external change
 * 
 * Example:
 * const invalidate = useInvalidateTasks();
 * await invalidate.all(); // Invalidate all task caches
 */
export const useInvalidateTasks = () => {
  const queryClient = useQueryClient();

  return {
    all: useCallback(
      () => queryClient.invalidateQueries({ queryKey: tasksQueryKeys.all }),
      [queryClient]
    ),
    lists: useCallback(
      () => queryClient.invalidateQueries({ queryKey: tasksQueryKeys.lists() }),
      [queryClient]
    ),
    detail: useCallback(
      (id: number | string) =>
        queryClient.invalidateQueries({
          queryKey: tasksQueryKeys.detail(id),
        }),
      [queryClient]
    ),
  };
};
