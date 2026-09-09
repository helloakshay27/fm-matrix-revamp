import { useQuery } from "@tanstack/react-query";
import { fetchAudienceUsers } from "../api/notificationAudienceApi";

export function useAudienceUsersQuery() {
  return useQuery({
    queryKey: ["pulse-audience-users"],
    queryFn: fetchAudienceUsers,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
