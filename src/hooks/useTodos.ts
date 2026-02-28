import {
    useQuery,
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { useCallback } from "react";
import {
    fetchTodos,
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
        toDate?: string
    ) =>
        [
            ...todosQueryKeys.lists(),
            { taskType, userIds: userIds.join(","), search, fromDate, toDate },
        ] as const,
    infinite: (taskType: "my" | "all", userIds: string[], search?: string, fromDate?: string, toDate?: string) =>
        [...todosQueryKeys.lists(), "infinite", { taskType, userIds: userIds.join(","), search, fromDate, toDate }] as const,
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
}: UseTodosOptions = {}) => {
    return useInfiniteQuery({
        queryKey: todosQueryKeys.infinite(taskType, userIds, search, fromDate, toDate),
        queryFn: ({ pageParam = 1 }) =>
            fetchTodos(pageParam, taskType, userIds, search, fromDate, toDate),
        getNextPageParam: (lastPage) => lastPage.pagination.next_page,
        initialPageParam: 1,
        staleTime: 30 * 1000, // 30 seconds
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
