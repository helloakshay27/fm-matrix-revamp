import { useQuery } from "@tanstack/react-query";
import { fetchBusinessCompassTasks } from "@/services/businessCompassTasksApi";

interface UseBusinessCompassTasksOptions {
  page?: number;
  filters?: Record<string, any>;
  // When true, calls /business_compass/tasks/my_tasks instead of /business_compass/tasks.
  my?: boolean;
}

export const useBusinessCompassTasks = ({
  page = 1,
  filters = {},
  my = false,
}: UseBusinessCompassTasksOptions = {}) => {
  return useQuery({
    queryKey: ["businessCompassTasks", "list", page, filters, my],
    queryFn: () => fetchBusinessCompassTasks(page, filters, my),
    staleTime: 30 * 1000,
  });
};
