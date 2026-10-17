import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSupplierVehicle } from "../api/transportVehiclesApi";
import { supplierVehiclesQueryKey } from "./useSupplierVehiclesQuery";

export function useUpdateSupplierVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSupplierVehicle,
    onSuccess: (_data, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: supplierVehiclesQueryKey(supplierId) });
    },
  });
}
