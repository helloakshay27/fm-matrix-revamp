import { gateIntegrationClient } from "./gateIntegrationClient";
import type { EscalationUserOption } from "../types/formOptions";

// Confirmed via curl: GET /pms/sites/:site_id/security_users.json
// Response shape wasn't included in the sample, so this defensively accepts
// either a bare array or a { security_users | users: [...] } wrapper.
export const fetchSecurityUsers = async (
  siteId: number
): Promise<EscalationUserOption[]> => {
  const { data } = await gateIntegrationClient.get<
    EscalationUserOption[] | { security_users?: EscalationUserOption[]; users?: EscalationUserOption[] }
  >(`/pms/sites/${siteId}/security_users.json`);

  if (Array.isArray(data)) return data;
  return data.security_users ?? data.users ?? [];
};
