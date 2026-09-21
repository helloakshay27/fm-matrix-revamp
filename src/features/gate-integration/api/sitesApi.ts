import { gateIntegrationClient } from "./gateIntegrationClient";
import type { SiteOption } from "../types/formOptions";

const getCurrentUserId = (): string => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?.id ? String(user.id) : "";
  } catch {
    return "";
  }
};

// Confirmed via ticketManagementAPI.getSites (AddVisitorGatePage.tsx):
// GET /pms/sites/allowed_sites.json?user_id=<id> -> { sites: [...] }
export const fetchAllowedSites = async (): Promise<SiteOption[]> => {
  const { data } = await gateIntegrationClient.get<{ sites: SiteOption[] }>(
    "/pms/sites/allowed_sites.json",
    { params: { user_id: getCurrentUserId() } }
  );
  return data.sites ?? [];
};
