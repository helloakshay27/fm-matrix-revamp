import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupplierVehicle } from "../api/transportVehiclesApi";
import { supplierVehiclesQueryKey } from "./useSupplierVehiclesQuery";

export function useCreateSupplierVehicleMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplierVehicle,
    onSuccess: (_data, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: supplierVehiclesQueryKey(supplierId) });
    },
  });
}
