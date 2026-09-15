import { gateIntegrationClient } from "./gateIntegrationClient";
import type { SocietyGatesResponse } from "../types/societyGate";

// Confirmed via curl + real response: GET /admin/society_gates.json
// Response is { quikgate_society_gates: [...], quikgate_pagination: {...} }.
export const fetchSocietyGates = async (
  page: number = 1
): Promise<SocietyGatesResponse> => {
  const { data } = await gateIntegrationClient.get<SocietyGatesResponse>(
    "/admin/society_gates.json",
    { params: { page } }
  );
  return data;
};

export interface CreateSocietyGatePayload {
  gate_name: string;
  gate_device: string;
  society_block_id: number;
  building_id: number;
  user_id: number;
  // Only used when toggling the Status switch via update — the list's
  // "Status" column reads/writes this field (1/0, not a real boolean).
  approve?: number;
}

// Confirmed via curl: POST /admin/society_gates.json
// Body is { type: "quikgate", society_gate: {...} } — "type" sits at the
// top level, not inside society_gate.
export const createSocietyGate = async (
  payload: CreateSocietyGatePayload
): Promise<void> => {
  await gateIntegrationClient.post("/admin/society_gates.json", {
    type: "quikgate",
    society_gate: payload,
  });
};

export interface UpdateSocietyGateArgs {
  id: number;
  payload: CreateSocietyGatePayload;
}

// No curl was provided for update — this assumes the standard Rails REST
// convention (PUT to the member route, same body shape as create). Verify
// against the live API before relying on it.
export const updateSocietyGate = async ({
  id,
  payload,
}: UpdateSocietyGateArgs): Promise<void> => {
  await gateIntegrationClient.put(`/admin/society_gates/${id}.json`, {
    type: "quikgate",
    society_gate: payload,
  });
};
