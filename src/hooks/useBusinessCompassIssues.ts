import { useQuery } from "@tanstack/react-query";
import { fetchBusinessCompassIssues } from "@/services/businessCompassIssuesApi";

interface UseBusinessCompassIssuesOptions {
  page?: number;
  filters?: string;
  enabled?: boolean;
  // When true, calls /business_compass/issues/my_issues instead of /business_compass/issues.
  my?: boolean;
}

export const useBusinessCompassIssues = ({
  page = 1,
  filters = "",
  enabled = true,
  my = false,
}: UseBusinessCompassIssuesOptions = {}) => {
  return useQuery({
    queryKey: ["businessCompassIssues", "list", page, filters, my],
    queryFn: () => fetchBusinessCompassIssues(page, filters, my),
    staleTime: 30 * 1000,
    enabled,
  });
};
