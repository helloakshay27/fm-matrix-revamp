import {
    useQuery,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import {
    fetchTodos,
    fetchPriorityTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    TodosResponse,
} from "@/services/todosApi";

/**
 * Query Keys for todos
 * Using hierarchical structure for better cache management
 */
export const todosQueryKeys = {
    all: ["todos"] as const,
    lists: () => [...todosQueryKeys.all, "list"] as const,
    list: (
        taskType: "my" | "all",
        userIds: string[],
        search?: string,
        fromDate?: string,
        toDate?: string,
        selectedAssignedTo?: string[],
        selectedCreators?: string[]
    ) =>
        [
            ...todosQueryKeys.lists(),
            { taskType, userIds: userIds.join(","), search, fromDate, toDate, selectedAssignedTo: selectedAssignedTo?.join(","), selectedCreators: selectedCreators?.join(",") },
        ] as const,
    infinite: (taskType: "my" | "all", userIds: string[], search?: string, fromDate?: string, toDate?: string, selectedAssignedTo?: string[], selectedCreators?: string[]) =>
        [...todosQueryKeys.lists(), "infinite", { taskType, userIds: userIds.join(","), search, fromDate, toDate, selectedAssignedTo: selectedAssignedTo?.join(","), selectedCreators: selectedCreators?.join(",") }] as const,
    priority: () => [...todosQueryKeys.all, "priority"] as const,
    priorityInfinite: (priority: string, taskType: "my" | "all", userIds: string[], fromDate?: string, toDate?: string, selectedAssignedTo?: string[], selectedCreators?: string[]) =>
        [...todosQueryKeys.priority(), "infinite", { priority, taskType, userIds: userIds.join(","), fromDate, toDate, selectedAssignedTo: selectedAssignedTo?.join(","), selectedCreators: selectedCreators?.join(",") }] as const,
    details: () => [...todosQueryKeys.all, "detail"] as const,
    detail: (id: number | string) =>
        [...todosQueryKeys.details(), id] as const,
};

interface UseTodosOptions {
    taskType?: "my" | "all";
    userIds?: string[];
    search?: string;
    fromDate?: string;
    toDate?: string;
    selectedAssignedTo?: string[];
    selectedCreators?: string[];
}

/**
 * useTodos - Fetch todos with infinite pagination
 *
 * Features:
 * - Infinite pagination with React Query
 * - Caching with 30s stale time
 * - Filter by task type (my/all)
 * - Filter by user IDs
 * - Search support
 * - Date range filtering
 * - Dashboard data (p1_count, p2_count, etc.)
 *
 * Example:
 * const { data, fetchNextPage, hasNextPage, isLoading } = useTodos({
 *   taskType: "my",
 *   search: "urgent",
 *   fromDate: "2026-02-28",
 *   toDate: "2026-03-07"
 * });
 */
export const useTodos = ({
    taskType = "my",
    userIds = [],
    search,
    fromDate,
    toDate,
    selectedAssignedTo = [],
    selectedCreators = [],
}: UseTodosOptions = {}) => {
    return useInfiniteQuery({
        queryKey: todosQueryKeys.infinite(taskType, userIds, search, fromDate, toDate, selectedAssignedTo, selectedCreators),
        queryFn: ({ pageParam = 1 }) =>
            fetchTodos(pageParam, taskType, userIds, search, fromDate, toDate, selectedAssignedTo, selectedCreators),
        getNextPageParam: (lastPage) => lastPage.pagination.next_page,
        initialPageParam: 1,
        staleTime: 30 * 1000, // 30 seconds
    });
};

interface UsePriorityTodosOptions {
    priority: string;
    taskType?: "my" | "all";
    userIds?: string[];
    excludeCompleted?: boolean;
    fromDate?: string;
    toDate?: string;
    selectedAssignedTo?: string[];
    selectedCreators?: string[];
}

/**
 * usePriorityTodos - Fetch todos by priority with infinite pagination and filters
 *
 * Features:
 * - Infinite pagination with React Query
 * - Caching with 30s stale time
 * - Filter by priority (P1, P2, P3, P4)
 * - Filter by task type (my/all)
 * - Date range filtering
 * - Filter by assigned to and created by users
 * - Option to include/exclude completed todos
 *
 * Example:
 * const { data, fetchNextPage, hasNextPage, isLoading } = usePriorityTodos({
 *   priority: "P1",
 *   taskType: "my",
 *   fromDate: "2026-02-28",
 *   toDate: "2026-03-07"
 * });
 */
export const usePriorityTodos = ({
    priority,
    taskType = "my",
    userIds = [],
    excludeCompleted = true,
    fromDate,
    toDate,
    selectedAssignedTo = [],
    selectedCreators = [],
}: UsePriorityTodosOptions) => {
    return useInfiniteQuery({
        queryKey: todosQueryKeys.priorityInfinite(priority, taskType, userIds, fromDate, toDate, selectedAssignedTo, selectedCreators),
        queryFn: ({ pageParam = 1 }) =>
            fetchPriorityTodos(pageParam, priority, taskType, userIds, excludeCompleted, fromDate, toDate, selectedAssignedTo, selectedCreators),
        getNextPageParam: (lastPage) => lastPage.pagination.next_page,
        initialPageParam: 1,
        staleTime: 30 * 1000, // 30 seconds
        enabled: !!priority, // Only fetch if priority is provided
    });
};

/**
 * useCreateTodo - Create a new todo
 *
 * Features:
 * - Automatic cache invalidation after success
 * - Invalidates all todo lists to trigger refetch
 */
export const useCreateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (todoData: any) => createTodo(todoData),
        onSuccess: () => {
            // Invalidate all todos lists
            queryClient.invalidateQueries({
                queryKey: todosQueryKeys.lists(),
            });
        },
        onError: (error: any) => {
            console.error("Failed to create todo:", error.message);
        },
    });
};

/**
 * useUpdateTodo - Update an existing todo
 */
export const useUpdateTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            data,
        }: {
            id: number | string;
            data: any;
        }) => {
            return updateTodo(id, data);
        },
        onSuccess: (data) => {
            // Invalidate both list and specific todo detail
            queryClient.invalidateQueries({
                queryKey: todosQueryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: todosQueryKeys.detail(data.id),
            });
        },
        onError: (error: any) => {
            console.error("Failed to update todo:", error.message);
        },
    });
};

/**
 * useDeleteTodo - Delete a todo
 */
export const useDeleteTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number | string) => deleteTodo(id),
        onSuccess: (_, id) => {
            // Invalidate both list and specific todo detail
            queryClient.invalidateQueries({
                queryKey: todosQueryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: todosQueryKeys.detail(id),
            });
        },
        onError: (error: any) => {
            console.error("Failed to delete todo:", error.message);
        },
    });
};

/**
 * useToggleTodo - Toggle todo completion status
 */
export const useToggleTodo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            completed,
        }: {
            id: number | string;
            completed: boolean;
        }) => toggleTodo(id, completed),
        onSuccess: () => {
            // Invalidate all todos lists
            queryClient.invalidateQueries({
                queryKey: todosQueryKeys.lists(),
            });
        },
        onError: (error: any) => {
            console.error("Failed to toggle todo:", error.message);
        },
    });
};

/**
 * Utility hook to manually invalidate queries
 */
export const useInvalidateTodos = () => {
    const queryClient = useQueryClient();

    return {
        invalidateList: useCallback(() => {
            return queryClient.invalidateQueries({
                queryKey: todosQueryKeys.lists(),
            });
        }, [queryClient]),
        invalidateDetail: useCallback((id: number | string) => {
            return queryClient.invalidateQueries({
                queryKey: todosQueryKeys.detail(id),
            });
        }, [queryClient]),
        invalidateAll: useCallback(() => {
            return queryClient.invalidateQueries({
                queryKey: todosQueryKeys.all,
            });
        }, [queryClient]),
    };
};
