import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCustomNotification } from "../api/customNotificationsApi";
import type { SaveCustomNotificationVariables } from "../types/customNotification";

export function useUpdateCustomNotificationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, files }: SaveCustomNotificationVariables) =>
      updateCustomNotification(id, payload, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notification-detail", id] });
    },
  });
}
