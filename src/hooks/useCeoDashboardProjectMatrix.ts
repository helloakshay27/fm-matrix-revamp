import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardProjectMatrix } from "@/services/ceoDashboardApi";

export const useCeoDashboardProjectMatrix = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "projectMatrix", fromDate, toDate],
    queryFn: () => fetchCeoDashboardProjectMatrix(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
