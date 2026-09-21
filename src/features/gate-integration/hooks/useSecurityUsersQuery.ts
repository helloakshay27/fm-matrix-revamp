import { useQuery } from "@tanstack/react-query";
import { fetchSecurityUsers } from "../api/usersApi";

export const useSecurityUsersQuery = (siteId: number | null) =>
  useQuery({
    queryKey: ["gate-integration", "security-users", siteId],
    queryFn: () => fetchSecurityUsers(siteId as number),
    enabled: siteId != null,
    refetchOnWindowFocus: false,
  });
