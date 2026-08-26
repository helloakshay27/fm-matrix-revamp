import { useQuery } from "@tanstack/react-query";
import { fetchNotificationRecipients } from "../api/customNotificationsApi";

export function useNotificationRecipientsQuery(
  id: number | null,
  page: number,
  perPage: number
) {
  return useQuery({
    queryKey: ["pulse-notification-recipients", id, page, perPage],
    queryFn: () => fetchNotificationRecipients(id as number, page, perPage),
    enabled: id != null && !Number.isNaN(id),
    refetchOnWindowFocus: false,
  });
}
