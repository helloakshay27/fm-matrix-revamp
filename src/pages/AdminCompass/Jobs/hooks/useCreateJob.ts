// @ts-nocheck
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJobDescription } from "../api/jobsApi";

export function useCreateJob(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createJobDescription(payload),
    onSuccess: async (data, variables, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["jobs-list"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs-detail"] }),
      ]);
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
  });
}
