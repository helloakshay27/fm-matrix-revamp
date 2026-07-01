import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchGanttTasks, updateGanttTask } from "@/services/ganttChartApi";
import { toast } from "sonner";

export const ganttQueryKeys = {
  all: ["gantt"] as const,
  lists: () => [...ganttQueryKeys.all, "list"] as const,
  list: (
    projectId?: string,
    milestoneId?: string,
    taskType?: string,
    filters?: Record<string, any>
  ) => [...ganttQueryKeys.lists(), { projectId, milestoneId, taskType, filters }] as const,
};

interface UseGanttTasksOptions {
  projectId?: string;
  milestoneId?: string;
  taskType?: "all" | "my";
  filters?: Record<string, any>;
}

export const useGanttTasks = ({
  projectId,
  milestoneId,
  taskType = "all",
  filters = {},
}: UseGanttTasksOptions = {}) => {
  return useQuery({
    queryKey: ganttQueryKeys.list(projectId, milestoneId, taskType, filters),
    queryFn: () => {
      const params: Record<string, any> = {
        per_page: 500,
        page: 1,
      };
      if (projectId) params["q[project_management_id_eq]"] = projectId;
      if (milestoneId) params["q[milestone_id_eq]"] = milestoneId;
      Object.entries(filters).forEach(([k, v]) => {
        params[k] = v;
      });
      return fetchGanttTasks(params, taskType);
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

interface UpdateGanttTaskPayload {
  task_management: {
    title: string;
    expected_start_date: string | null;
    target_date: string | null;
    status: string;
  };
}

export const useUpdateGanttTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGanttTaskPayload }) =>
      updateGanttTask(id, data),
    onSuccess: () => {
      toast.success("Task updated successfully!");
      queryClient.invalidateQueries({ queryKey: ganttQueryKeys.lists() });
    },
    onError: () => {
      toast.error("Failed to update task.");
    },
  });
};
