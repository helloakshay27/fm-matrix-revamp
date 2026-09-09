import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSupplier } from "../api/suppliersApi";
import { SUPPLIERS_QUERY_KEY_PREFIX } from "../const/supplierConstants";
import type { UpdateSupplierPayload } from "../types/supplier";

export function useUpdateSupplierMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSupplierPayload) => updateSupplier(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY_PREFIX] });
    },
  });
}
