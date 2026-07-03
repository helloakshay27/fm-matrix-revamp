import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardIssueResolution } from "@/services/ceoDashboardApi";

export const useCeoDashboardIssueResolution = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "issueResolution", fromDate, toDate],
    queryFn: () => fetchCeoDashboardIssueResolution(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
