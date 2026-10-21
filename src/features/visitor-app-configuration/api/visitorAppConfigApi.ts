import { visitorAppConfigClient } from "./visitorAppConfigClient";
import type {
  UpdateVisitorAppConfigPayload,
  VisitorAppConfig,
} from "../types/visitorAppConfig";

// Confirmed via curl: GET /sites/:siteId/config returns the config flat, no wrapper key.
export const fetchVisitorAppConfig = async (siteId: string): Promise<VisitorAppConfig> => {
  const { data } = await visitorAppConfigClient.get<VisitorAppConfig>(
    `/sites/${siteId}/config.json`
  );
  return data;
};

// Confirmed via curl: PUT /sites/:siteId/config with the full
// { hostMode, visitorSteps, modules } body (no wrapper key).
export const updateVisitorAppConfig = async ({
  siteId,
  payload,
}: {
  siteId: string;
  payload: UpdateVisitorAppConfigPayload;
}): Promise<VisitorAppConfig> => {
  const { data } = await visitorAppConfigClient.put<VisitorAppConfig>(
    `/sites/${siteId}/config.json`,
    payload
  );
  return data;
};
