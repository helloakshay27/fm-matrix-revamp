import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitCustomNotificationForApproval } from "../api/customNotificationsApi";

export function useSubmitForApprovalMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => submitCustomNotificationForApproval(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notification-detail", id] });
    },
  });
}
