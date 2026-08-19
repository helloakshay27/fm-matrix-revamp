import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardEfficiencyOverview } from "@/services/ceoDashboardApi";

export const useCeoDashboardEfficiencyOverview = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "efficiencyOverview", fromDate, toDate],
    queryFn: () => fetchCeoDashboardEfficiencyOverview(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
