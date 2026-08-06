import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardDepartmentHealthScorecard } from "@/services/ceoDashboardApi";

export const useCeoDashboardDepartmentHealthScorecard = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "departmentHealthScorecard", fromDate, toDate],
    queryFn: () => fetchCeoDashboardDepartmentHealthScorecard(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
