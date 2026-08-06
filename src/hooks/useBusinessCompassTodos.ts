import { useQuery } from "@tanstack/react-query";
import { fetchBusinessCompassTodos } from "@/services/businessCompassTodosApi";

interface UseBusinessCompassTodosOptions {
  page?: number;
  filters?: Record<string, string>;
  enabled?: boolean;
  // When true, calls /business_compass/todos/my_todos instead of /business_compass/todos.
  my?: boolean;
}

export const useBusinessCompassTodos = ({
  page = 1,
  filters = {},
  enabled = true,
  my = false,
}: UseBusinessCompassTodosOptions = {}) => {
  return useQuery({
    queryKey: ["businessCompassTodos", "list", page, filters, my],
    queryFn: () => fetchBusinessCompassTodos(page, filters, my),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    enabled,
  });
};
