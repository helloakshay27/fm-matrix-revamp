import { useQuery } from "@tanstack/react-query";
import { fetchSupplierVehicles } from "../api/transportVehiclesApi";
import { TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX } from "../const/transportSupplierConstants";
import type { SupplierVehicleFilters } from "../types/transportVehicle";

// Root key for every vehicle query of a supplier (list, filtered lists, detail) —
// invalidating it refreshes all of them after a create/update/status change.
export const supplierVehiclesQueryKey = (supplierId: number) =>
  [TRANSPORT_SUPPLIERS_QUERY_KEY_PREFIX, "vehicles", supplierId] as const;

export function useSupplierVehiclesQuery(supplierId: number, filters: SupplierVehicleFilters = {}) {
  return useQuery({
    queryKey: [...supplierVehiclesQueryKey(supplierId), "list", filters.active ?? false, filters.driverId ?? null],
    queryFn: () => fetchSupplierVehicles(supplierId, filters),
    refetchOnWindowFocus: false,
  });
}
