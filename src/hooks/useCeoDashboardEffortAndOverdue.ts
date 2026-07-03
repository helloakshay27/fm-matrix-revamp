import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardEffortAndOverdue } from "@/services/ceoDashboardApi";

export const useCeoDashboardEffortAndOverdue = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "effortAndOverdue", fromDate, toDate],
    queryFn: () => fetchCeoDashboardEffortAndOverdue(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
