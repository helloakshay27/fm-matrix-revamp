import { useQuery } from "@tanstack/react-query";
import { fetchNotificationTypes } from "../api/customNotificationsApi";

export function useNotificationTypesQuery() {
  return useQuery({
    queryKey: ["pulse-notification-types"],
    queryFn: fetchNotificationTypes,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
