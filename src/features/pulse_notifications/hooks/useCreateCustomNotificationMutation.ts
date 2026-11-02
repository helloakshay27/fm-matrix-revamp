import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomNotification } from "../api/customNotificationsApi";
import type { SaveCustomNotificationVariables } from "../types/customNotification";

export function useCreateCustomNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, files }: SaveCustomNotificationVariables) =>
      createCustomNotification(payload, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notifications"] });
    },
  });
}
