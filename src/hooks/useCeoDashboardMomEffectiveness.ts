import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardMomEffectiveness } from "@/services/ceoDashboardApi";

export const useCeoDashboardMomEffectiveness = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "momEffectiveness", fromDate, toDate],
    queryFn: () => fetchCeoDashboardMomEffectiveness(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
