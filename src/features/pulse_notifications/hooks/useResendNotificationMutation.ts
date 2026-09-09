import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resendCustomNotification } from "../api/customNotificationsApi";

export function useResendNotificationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => resendCustomNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notification-detail", id] });
    },
  });
}
