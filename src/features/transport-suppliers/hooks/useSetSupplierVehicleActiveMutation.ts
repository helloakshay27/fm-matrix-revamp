import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setSupplierVehicleActive } from "../api/transportVehiclesApi";
import { supplierVehiclesQueryKey } from "./useSupplierVehiclesQuery";

// Activate / deactivate a vehicle.
export function useSetSupplierVehicleActiveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: setSupplierVehicleActive,
    onSuccess: (_data, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: supplierVehiclesQueryKey(supplierId) });
    },
  });
}
