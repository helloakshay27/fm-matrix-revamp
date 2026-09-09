import { useQuery } from "@tanstack/react-query";
import { fetchAudienceSites } from "../api/notificationAudienceApi";

export function useAudienceSitesQuery(userId: number | null) {
  return useQuery({
    queryKey: ["pulse-audience-sites", userId],
    queryFn: () => fetchAudienceSites(userId as number),
    enabled: userId != null && !Number.isNaN(userId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
