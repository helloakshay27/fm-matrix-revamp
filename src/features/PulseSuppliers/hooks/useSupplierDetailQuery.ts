import { useQuery } from "@tanstack/react-query";
import { fetchSupplierDetail } from "../api/suppliersApi";
import { SUPPLIERS_QUERY_KEY_PREFIX } from "../const/supplierConstants";

export function useSupplierDetailQuery(id: number | null) {
  return useQuery({
    queryKey: [SUPPLIERS_QUERY_KEY_PREFIX, "detail", id],
    queryFn: () => fetchSupplierDetail(id as number),
    enabled: id != null && !Number.isNaN(id),
    refetchOnWindowFocus: false,
  });
}
