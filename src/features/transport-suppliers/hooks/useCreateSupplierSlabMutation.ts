import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupplierSlab } from "../api/transportSlabsApi";
import { supplierSlabsQueryKey } from "./useSupplierSlabsQuery";
import { transportSupplierDetailQueryKey } from "./useTransportSupplierDetailQuery";

export function useCreateSupplierSlabMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplierSlab,
    onSuccess: (_data, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: supplierSlabsQueryKey(supplierId) });
      // A new slab can change the supplier's current_transportation_slab.
      queryClient.invalidateQueries({ queryKey: transportSupplierDetailQueryKey(supplierId) });
    },
  });
}
