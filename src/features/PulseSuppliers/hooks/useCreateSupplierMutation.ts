import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupplier } from "../api/suppliersApi";
import { SUPPLIERS_QUERY_KEY_PREFIX } from "../const/supplierConstants";
import type { CreateSupplierPayload } from "../types/supplier";

export function useCreateSupplierMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSupplierPayload) => createSupplier(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY_PREFIX] });
    },
  });
}
