import { useQuery } from "@tanstack/react-query";
import { fetchSupplierSlabs } from "../api/transportSlabsApi";
import { TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX } from "../const/transportSupplierConstants";

export const supplierSlabsQueryKey = (supplierId: number) =>
  [TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX, "slabs", supplierId] as const;

export function useSupplierSlabsQuery(supplierId: number) {
  return useQuery({
    queryKey: supplierSlabsQueryKey(supplierId),
    queryFn: () => fetchSupplierSlabs(supplierId),
    refetchOnWindowFocus: false,
  });
}
