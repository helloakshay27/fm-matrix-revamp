import { useMutation, useQueryClient } from "@tanstack/react-query";
import { approveCustomNotification } from "../api/customNotificationsApi";

export function useApproveCustomNotificationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => approveCustomNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notification-detail", id] });
    },
  });
}
