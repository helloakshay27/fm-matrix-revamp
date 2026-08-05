import { useQuery } from "@tanstack/react-query";
import { fetchBusinessCompassIssues } from "@/services/businessCompassIssuesApi";

interface UseBusinessCompassIssuesOptions {
  page?: number;
  filters?: string;
  enabled?: boolean;
}

export const useBusinessCompassIssues = ({
  page = 1,
  filters = "",
  enabled = true,
}: UseBusinessCompassIssuesOptions = {}) => {
  return useQuery({
    queryKey: ["businessCompassIssues", "list", page, filters],
    queryFn: () => fetchBusinessCompassIssues(page, filters),
    staleTime: 30 * 1000,
    enabled,
  });
};
