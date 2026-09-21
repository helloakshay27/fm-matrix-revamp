import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSocietyGate } from "../api/societyGatesApi";

export const useUpdateSocietyGateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSocietyGate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gate-integration", "society-gates"] });
    },
  });
};
