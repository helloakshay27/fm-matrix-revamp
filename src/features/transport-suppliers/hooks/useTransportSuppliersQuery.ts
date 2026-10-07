import { useQuery } from "@tanstack/react-query";
import { fetchTransportSuppliers } from "../api/transportSuppliersApi";
import { TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX } from "../const/transportSupplierConstants";

export const transportSuppliersQueryKey = [TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX, "list"] as const;

export function useTransportSuppliersQuery() {
  return useQuery({
    queryKey: transportSuppliersQueryKey,
    queryFn: fetchTransportSuppliers,
    refetchOnWindowFocus: false,
  });
}
