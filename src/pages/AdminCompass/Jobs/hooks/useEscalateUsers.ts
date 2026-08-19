// @ts-nocheck
import { useQuery } from "@tanstack/react-query";
import { fetchEscalateUsers, EscalateUser } from "../api/usersApi";

export function useEscalateUsers() {
  return useQuery<EscalateUser[]>({
    queryKey: ["jobs-escalate-users"],
    queryFn: fetchEscalateUsers,
    staleTime: 5 * 60 * 1000,
  });
}
