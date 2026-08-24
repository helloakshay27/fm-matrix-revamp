import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendCustomNotificationNow } from "../api/customNotificationsApi";

export function useSendNowMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sendCustomNotificationNow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notification-detail", id] });
    },
  });
}
