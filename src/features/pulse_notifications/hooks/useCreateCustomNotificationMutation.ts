import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomNotification } from "../api/customNotificationsApi";
import type { CreateCustomNotificationPayload } from "../types/customNotification";

export function useCreateCustomNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCustomNotificationPayload) =>
      createCustomNotification(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notifications"] });
    },
  });
}
