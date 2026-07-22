import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardPerPersonBreakdown } from "@/services/ceoDashboardApi";

export const useCeoDashboardPerPersonBreakdown = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "perPersonBreakdown", fromDate, toDate],
    queryFn: () => fetchCeoDashboardPerPersonBreakdown(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
