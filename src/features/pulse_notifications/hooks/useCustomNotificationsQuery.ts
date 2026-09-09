import { useQuery } from "@tanstack/react-query";
import { fetchCustomNotifications } from "../api/customNotificationsApi";
import type { CustomNotificationsQueryParams } from "../types/customNotification";

export const customNotificationsQueryKey = (params: CustomNotificationsQueryParams) =>
  ["pulse-custom-notifications", params] as const;

export function useCustomNotificationsQuery(params: CustomNotificationsQueryParams) {
  return useQuery({
    queryKey: customNotificationsQueryKey(params),
    queryFn: () => fetchCustomNotifications(params),
    refetchOnWindowFocus: false,
  });
}
