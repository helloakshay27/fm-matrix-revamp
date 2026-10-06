import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTransportSupplier } from "../api/transportSuppliersApi";
import { transportSuppliersQueryKey } from "./useTransportSuppliersQuery";
import { transportSupplierDetailQueryKey } from "./useTransportSupplierDetailQuery";

export function useUpdateTransportSupplierMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTransportSupplier,
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: transportSuppliersQueryKey });
      queryClient.invalidateQueries({ queryKey: transportSupplierDetailQueryKey(id) });
    },
  });
}
