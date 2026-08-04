// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { fetchJobDescriptions } from "../api/jobsApi";

export function useFetchJobs() {
  return useQuery({
    queryKey: ["jobs-list"],
    queryFn: fetchJobDescriptions,
    staleTime: 2 * 60 * 1000,
  });
}
