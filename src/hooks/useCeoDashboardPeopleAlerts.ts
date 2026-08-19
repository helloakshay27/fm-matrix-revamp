import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardPeopleAlerts } from "@/services/ceoDashboardApi";

export const useCeoDashboardPeopleAlerts = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "peopleAlerts", fromDate, toDate],
    queryFn: () => fetchCeoDashboardPeopleAlerts(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
