import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardProjectInactivityAlert } from "@/services/ceoDashboardApi";

export const useCeoDashboardProjectInactivityAlert = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "projectInactivityAlert", fromDate, toDate],
    queryFn: () => fetchCeoDashboardProjectInactivityAlert(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
