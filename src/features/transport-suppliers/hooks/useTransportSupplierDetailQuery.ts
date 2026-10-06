import { useQuery } from "@tanstack/react-query";
import { fetchTransportSupplierDetail } from "../api/transportSuppliersApi";
import { TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX } from "../const/transportSupplierConstants";

export const transportSupplierDetailQueryKey = (id: number) =>
  [TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX, "detail", id] as const;

export function useTransportSupplierDetailQuery(id: number | null) {
  return useQuery({
    queryKey: transportSupplierDetailQueryKey(id ?? 0),
    queryFn: () => fetchTransportSupplierDetail(id as number),
    enabled: id !== null,
    refetchOnWindowFocus: false,
  });
}
