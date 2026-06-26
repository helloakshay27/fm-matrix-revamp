import { useQuery } from "@tanstack/react-query";
import { fetchBusinessCompassTodos } from "@/services/businessCompassTodosApi";

interface UseBusinessCompassTodosOptions {
  page?: number;
  filters?: Record<string, string>;
  enabled?: boolean;
}

export const useBusinessCompassTodos = ({
  page = 1,
  filters = {},
  enabled = true,
}: UseBusinessCompassTodosOptions = {}) => {
  return useQuery({
    queryKey: ["businessCompassTodos", "list", page, filters],
    queryFn: () => fetchBusinessCompassTodos(page, filters),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
    enabled,
  });
};
