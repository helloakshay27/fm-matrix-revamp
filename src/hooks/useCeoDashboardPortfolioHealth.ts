import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardPortfolioHealth } from "@/services/ceoDashboardApi";

export const useCeoDashboardPortfolioHealth = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "portfolioHealth", fromDate, toDate],
    queryFn: () => fetchCeoDashboardPortfolioHealth(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
