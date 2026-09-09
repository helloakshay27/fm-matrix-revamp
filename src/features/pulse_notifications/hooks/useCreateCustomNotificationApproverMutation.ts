import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomNotificationApprover } from "../api/customNotificationsApi";
import type { CreateCustomNotificationApproverPayload } from "../types/customNotification";

export function useCreateCustomNotificationApproverMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCustomNotificationApproverPayload) =>
      createCustomNotificationApprover(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pulse-custom-notification-approvers", variables.pms_site_id],
      });
    },
  });
}
