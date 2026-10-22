import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSupplierDriver } from "../api/transportDriversApi";
import { supplierDriversQueryKey } from "./useSupplierDriversQuery";

export function useUpdateSupplierDriverMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSupplierDriver,
    onSuccess: (_data, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: supplierDriversQueryKey(supplierId) });
    },
  });
}
