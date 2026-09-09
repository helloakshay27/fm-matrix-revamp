import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelCustomNotification } from "../api/customNotificationsApi";

export function useCancelNotificationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelCustomNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notification-detail", id] });
    },
  });
}
