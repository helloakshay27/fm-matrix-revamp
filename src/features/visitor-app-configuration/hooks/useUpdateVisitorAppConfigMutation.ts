import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateVisitorAppConfig } from "../api/visitorAppConfigApi";
import { visitorAppConfigQueryKey } from "./useVisitorAppConfigQuery";

export function useUpdateVisitorAppConfigMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVisitorAppConfig,
    onSuccess: (_data, { siteId }) => {
      queryClient.invalidateQueries({ queryKey: visitorAppConfigQueryKey(siteId) });
    },
  });
}
