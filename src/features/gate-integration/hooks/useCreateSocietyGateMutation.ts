import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSocietyGate } from "../api/societyGatesApi";

export const useCreateSocietyGateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSocietyGate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gate-integration", "society-gates"] });
    },
  });
};
