import { gateIntegrationClient } from "./gateIntegrationClient";
import type { BuildingsResponse } from "../types/formOptions";

// Confirmed via real response: GET /pms/buildings.json?site_id=:id&page=:page
// -> { pms_buildings: [...], pagination: { current_page, total_count, total_pages } }
export const fetchBuildings = async (
  siteId: number,
  page: number = 1
): Promise<BuildingsResponse> => {
  const { data } = await gateIntegrationClient.get<BuildingsResponse>(
    "/pms/buildings.json",
    { params: { site_id: siteId, page } }
  );
  return data;
};
