// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { fetchJobDetail } from "../api/jobsApi";

export function useFetchJobDetail(jobId) {
  return useQuery({
    queryKey: ["jobs-detail", jobId],
    queryFn: () => fetchJobDetail(jobId),
    enabled: Boolean(jobId),
    staleTime: 2 * 60 * 1000,
  });
}
