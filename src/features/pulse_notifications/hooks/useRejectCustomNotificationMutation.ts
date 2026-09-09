import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rejectCustomNotification } from "../api/customNotificationsApi";

export function useRejectCustomNotificationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rejectionReason: string) => rejectCustomNotification(id, rejectionReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notification-detail", id] });
    },
  });
}
