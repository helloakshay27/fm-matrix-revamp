import { useQuery } from "@tanstack/react-query";
import { fetchSuppliers } from "../api/suppliersApi";
import { SUPPLIERS_QUERY_KEY_PREFIX } from "../const/supplierConstants";
import type { SuppliersQueryParams } from "../types/supplier";

export const suppliersQueryKey = (params: SuppliersQueryParams) =>
  [SUPPLIERS_QUERY_KEY_PREFIX, params] as const;

export function useSuppliersQuery(params: SuppliersQueryParams) {
  return useQuery({
    queryKey: suppliersQueryKey(params),
    queryFn: () => fetchSuppliers(params),
    refetchOnWindowFocus: false,
  });
}
