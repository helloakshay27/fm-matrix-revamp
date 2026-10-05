import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransportSupplier } from "../api/transportSuppliersApi";
import { transportSuppliersQueryKey } from "./useTransportSuppliersQuery";

export function useCreateTransportSupplierMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTransportSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transportSuppliersQueryKey });
    },
  });
}
