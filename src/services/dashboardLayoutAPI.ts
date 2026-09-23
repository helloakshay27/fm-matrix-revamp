import { getFullUrl, getAuthenticatedFetchOptions } from "@/config/apiConfig";

// See `dashboard_layout (2).md` for the full endpoint reference.
export const DASHBOARD_LAYOUT_TYPE = "Executive Dashboard";

export interface DashboardLayoutRecord {
  id: number;
  chart_code: string | null;
  height: string | null;
  width: string | null;
  position: string | null;
  preffered_by: number | null;
  type: string | null;
  created_at: string;
  updated_at: string;
}

interface DashboardLayoutIndexResponse {
  code: number;
  count: number;
  dashboard_layouts: DashboardLayoutRecord[];
}

interface DashboardLayoutShowResponse {
  code: number;
  message?: string;
  dashboard_layout: DashboardLayoutRecord;
}

export interface DashboardLayoutPayload {
  chart_code: string;
  height: string;
  width: string;
  position: string;
}

/** Fetches this user's saved dashboard layouts. Always scope by preferredBy — `show`/`update`/`destroy` operate on any row by id regardless of owner, so an unscoped GET is the only thing standing between "my layouts" and "everyone's layouts". */
export async function fetchDashboardLayouts(preferredBy: number): Promise<DashboardLayoutRecord[]> {
  const response = await fetch(
    getFullUrl(`/dashboard_layouts?q[preffered_by_eq]=${preferredBy}&q[type_eq]=${encodeURIComponent(DASHBOARD_LAYOUT_TYPE)}`),
    getAuthenticatedFetchOptions("GET")
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard layouts (${response.status})`);
  }
  const data: DashboardLayoutIndexResponse = await response.json();
  return Array.isArray(data.dashboard_layouts) ? data.dashboard_layouts : [];
}

export async function createDashboardLayout(payload: DashboardLayoutPayload): Promise<DashboardLayoutRecord> {
  const response = await fetch(
    getFullUrl("/dashboard_layouts"),
    getAuthenticatedFetchOptions("POST", { dashboard_layout: { ...payload, type: DASHBOARD_LAYOUT_TYPE } })
  );
  if (!response.ok) {
    throw new Error(`Failed to create dashboard layout for ${payload.chart_code} (${response.status})`);
  }
  const data: DashboardLayoutShowResponse = await response.json();
  return data.dashboard_layout;
}

export async function updateDashboardLayout(
  id: number,
  payload: DashboardLayoutPayload
): Promise<DashboardLayoutRecord> {
  const response = await fetch(
    getFullUrl(`/dashboard_layouts/${id}`),
    getAuthenticatedFetchOptions("PATCH", { dashboard_layout: { ...payload, type: DASHBOARD_LAYOUT_TYPE } })
  );
  if (!response.ok) {
    throw new Error(`Failed to update dashboard layout ${id} (${response.status})`);
  }
  const data: DashboardLayoutShowResponse = await response.json();
  return data.dashboard_layout;
}

export async function deleteDashboardLayout(id: number): Promise<void> {
  const response = await fetch(getFullUrl(`/dashboard_layouts/${id}`), getAuthenticatedFetchOptions("DELETE"));
  if (!response.ok) {
    throw new Error(`Failed to delete dashboard layout ${id} (${response.status})`);
  }
}
