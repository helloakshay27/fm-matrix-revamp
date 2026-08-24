import { useQuery } from "@tanstack/react-query";
import { fetchCustomNotificationDetail } from "../api/customNotificationsApi";

export function useCustomNotificationDetailQuery(id: number | null) {
  return useQuery({
    queryKey: ["pulse-custom-notification-detail", id],
    queryFn: () => fetchCustomNotificationDetail(id as number),
    enabled: id != null && !Number.isNaN(id),
    refetchOnWindowFocus: false,
  });
}
