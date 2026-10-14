import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupplierDriver } from "../api/transportDriversApi";
import { supplierDriversQueryKey } from "./useSupplierDriversQuery";

export function useCreateSupplierDriverMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplierDriver,
    onSuccess: (_data, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: supplierDriversQueryKey(supplierId) });
    },
  });
}
