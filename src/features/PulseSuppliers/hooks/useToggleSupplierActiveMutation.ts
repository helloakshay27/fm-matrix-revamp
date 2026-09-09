import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSupplier } from "../api/suppliersApi";
import { SUPPLIERS_QUERY_KEY_PREFIX } from "../const/supplierConstants";
import { buildSupplierPayloadFromRecord } from "../utils/supplierPayload";
import type { Supplier } from "../types/supplier";

export function useToggleSupplierActiveMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ supplier, active }: { supplier: Supplier; active: boolean }) =>
      updateSupplier(supplier.id, {
        pms_supplier: buildSupplierPayloadFromRecord(supplier, { active }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SUPPLIERS_QUERY_KEY_PREFIX] });
    },
  });
}
