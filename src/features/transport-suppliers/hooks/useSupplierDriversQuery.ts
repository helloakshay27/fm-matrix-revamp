import { useQuery } from "@tanstack/react-query";
import { fetchSupplierDrivers } from "../api/transportDriversApi";
import { TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX } from "../const/transportSupplierConstants";

export const supplierDriversQueryKey = (supplierId: number) =>
  [TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX, "drivers", supplierId] as const;

export function useSupplierDriversQuery(supplierId: number) {
  return useQuery({
    queryKey: supplierDriversQueryKey(supplierId),
    queryFn: () => fetchSupplierDrivers(supplierId),
    refetchOnWindowFocus: false,
  });
}
