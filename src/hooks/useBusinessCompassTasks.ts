import { useQuery } from "@tanstack/react-query";
import { fetchBusinessCompassTasks } from "@/services/businessCompassTasksApi";

interface UseBusinessCompassTasksOptions {
  page?: number;
  filters?: Record<string, any>;
}

export const useBusinessCompassTasks = ({
  page = 1,
  filters = {},
}: UseBusinessCompassTasksOptions = {}) => {
  return useQuery({
    queryKey: ["businessCompassTasks", "list", page, filters],
    queryFn: () => fetchBusinessCompassTasks(page, filters),
    staleTime: 30 * 1000,
  });
};
