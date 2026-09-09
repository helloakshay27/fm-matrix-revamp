import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomNotificationApprover } from "../api/customNotificationsApi";

interface DeleteApproverVariables {
  id: number;
  pmsSiteId: number;
}

export function useDeleteCustomNotificationApproverMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: DeleteApproverVariables) => deleteCustomNotificationApprover(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["pulse-custom-notification-approvers", variables.pmsSiteId],
      });
    },
  });
}
