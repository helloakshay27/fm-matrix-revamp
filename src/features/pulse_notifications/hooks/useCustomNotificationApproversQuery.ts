import { useQuery } from "@tanstack/react-query";
import { fetchCustomNotificationApprovers } from "../api/customNotificationsApi";

export function useCustomNotificationApproversQuery(pmsSiteId: number | null) {
  return useQuery({
    queryKey: ["pulse-custom-notification-approvers", pmsSiteId],
    queryFn: () => fetchCustomNotificationApprovers(pmsSiteId as number),
    enabled: pmsSiteId != null && !Number.isNaN(pmsSiteId),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}
