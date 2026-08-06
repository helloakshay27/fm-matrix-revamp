import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardOverallSummary } from "@/services/ceoDashboardApi";

export const useCeoDashboardSummary = (fromDate?: string, toDate?: string) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "overallSummary", fromDate, toDate],
    queryFn: () => fetchCeoDashboardOverallSummary(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
