// @ts-nocheck
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJobDescription } from "../api/jobsApi";

export function useUpdateJob(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, payload }) => updateJobDescription(jobId, payload),
    onSuccess: async (data, variables, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["jobs-list"] }),
        queryClient.invalidateQueries({ queryKey: ["jobs-detail", variables?.jobId] }),
      ]);
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
    },
  });
}
