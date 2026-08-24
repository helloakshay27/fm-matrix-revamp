import { useQuery } from "@tanstack/react-query";
import { fetchAudienceCommunities } from "../api/notificationAudienceApi";

export function useAudienceCommunitiesQuery() {
  return useQuery({
    queryKey: ["pulse-audience-communities"],
    queryFn: fetchAudienceCommunities,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
