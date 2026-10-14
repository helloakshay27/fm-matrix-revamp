import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSupplierSlab } from "../api/transportSlabsApi";
import { supplierSlabsQueryKey } from "./useSupplierSlabsQuery";
import { transportSupplierDetailQueryKey } from "./useTransportSupplierDetailQuery";

export function useUpdateSupplierSlabMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSupplierSlab,
    onSuccess: (_data, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: supplierSlabsQueryKey(supplierId) });
      // Editing a slab can change the supplier's current_transportation_slab.
      queryClient.invalidateQueries({ queryKey: transportSupplierDetailQueryKey(supplierId) });
    },
  });
}
