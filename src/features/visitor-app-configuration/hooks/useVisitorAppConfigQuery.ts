import { useQuery } from "@tanstack/react-query";
import { fetchVisitorAppConfig } from "../api/visitorAppConfigApi";
import { VISITOR_APP_CONFIG_QUERY_KEY_PREFIX } from "../const/visitorAppConfigConstants";

export const visitorAppConfigQueryKey = (siteId: string | null) =>
  [VISITOR_APP_CONFIG_QUERY_KEY_PREFIX, "detail", siteId] as const;

export function useVisitorAppConfigQuery(siteId: string | null) {
  return useQuery({
    queryKey: visitorAppConfigQueryKey(siteId),
    queryFn: () => fetchVisitorAppConfig(siteId as string),
    enabled: !!siteId,
    refetchOnWindowFocus: false,
  });
}
