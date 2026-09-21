// Confirmed via the existing AddVisitorGatePage.tsx / ticketManagementAPI usage
// for the same underlying endpoint (allowed_sites).
export interface SiteOption {
  id: number;
  name: string;
}

// GET /pms/sites/:site_id/security_users.json response shape wasn't sampled —
// name field kept optional/dual so the UI can fall back between them.
export interface EscalationUserOption {
  id: number;
  full_name?: string;
  name?: string;
}

// Confirmed via real response: GET /pms/buildings.json?site_id=:id
export interface BuildingOption {
  id: number;
  name: string;
}

export interface BuildingsPagination {
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface BuildingsResponse {
  pms_buildings: BuildingOption[];
  pagination: BuildingsPagination;
}
