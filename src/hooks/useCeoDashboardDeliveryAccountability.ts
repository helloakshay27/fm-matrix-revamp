import { useQuery } from "@tanstack/react-query";
import { fetchCeoDashboardDeliveryAccountability } from "@/services/ceoDashboardApi";

export const useCeoDashboardDeliveryAccountability = (
  fromDate?: string,
  toDate?: string
) => {
  return useQuery({
    queryKey: ["ceoDashboardSummary", "deliveryAccountability", fromDate, toDate],
    queryFn: () => fetchCeoDashboardDeliveryAccountability(fromDate, toDate),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
