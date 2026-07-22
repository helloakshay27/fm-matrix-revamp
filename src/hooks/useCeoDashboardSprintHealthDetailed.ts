import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardSprintHealthDetailed } from "@/services/ceoDashboardApi";

export const useCeoDashboardSprintHealthDetailed = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "sprintHealthDetailed", fromDate, toDate],
    queryFn: () => fetchCeoDashboardSprintHealthDetailed(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
