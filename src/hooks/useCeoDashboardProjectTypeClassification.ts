import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardProjectTypeClassification } from "@/services/ceoDashboardApi";

export const useCeoDashboardProjectTypeClassification = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "projectTypeClassification", fromDate, toDate],
    queryFn: () => fetchCeoDashboardProjectTypeClassification(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
