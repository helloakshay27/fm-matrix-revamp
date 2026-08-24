import { useMutation, useQueryClient } from "@tanstack/react-query";
import { scheduleCustomNotification } from "../api/customNotificationsApi";

interface ScheduleParams {
  scheduledAt: string;
  expiresAt: string;
}

export function useScheduleNotificationMutation(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ scheduledAt, expiresAt }: ScheduleParams) =>
      scheduleCustomNotification(id, scheduledAt, expiresAt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["pulse-custom-notification-detail", id] });
    },
  });
}
