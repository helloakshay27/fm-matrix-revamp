import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardBacklogAndIssues } from "@/services/ceoDashboardApi";

export const useCeoDashboardBacklogAndIssues = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "backlogAndIssues", fromDate, toDate],
    queryFn: () => fetchCeoDashboardBacklogAndIssues(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
