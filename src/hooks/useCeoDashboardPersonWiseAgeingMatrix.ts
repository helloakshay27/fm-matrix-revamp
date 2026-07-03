import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardPersonWiseAgeingMatrix } from "@/services/ceoDashboardApi";

export const useCeoDashboardPersonWiseAgeingMatrix = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "personWiseAgeingMatrix", fromDate, toDate],
    queryFn: () => fetchCeoDashboardPersonWiseAgeingMatrix(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
