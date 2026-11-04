import { apiClient } from "@/utils/apiClient";
import {
  toPagination,
  type TrainingDeleteResult,
  type TrainingPagination,
} from "@/features/vi-training/master/api/trainingCategoryApi";

// Circle-wise zones (GET/POST/PATCH/DELETE /vi_zones). Writes are admin only.

export interface ViZone {
  id: number;
  name: string;
  /** The zone's circle; can't change after creation. */
  company_cluster_id: number;
  cluster_name?: string;
  company_cluster?: { id: number; name?: string; cluster_name?: string };
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ViZonePayload {
  name: string;
  company_cluster_id: string;
  /** Only sent by the table's status toggle. */
  active?: boolean;
}

export interface ViZoneFilters {
  circleId?: string;
  /** "true" | "false" — omitted for all. */
  active?: string;
  /** Server search on the zone name (q[name_cont]). */
  search?: string;
}

export interface ViZoneListResponse {
  data: ViZone[];
  pagination: TrainingPagination;
}

export interface CircleOption {
  id: string;
  name: string;
}

export const ZONE_PER_PAGE = 10;

const ENDPOINT = "/vi_zones";

const companyId = () => localStorage.getItem("selectedCompanyId") || localStorage.getItem("company_id") || undefined;

/** Circle name sent with the zone, if the API includes one. */
export const zoneCircleName = (zone: ViZone) =>
  zone.cluster_name || zone.company_cluster?.cluster_name || zone.company_cluster?.name || "";

export const zoneApi = {
  list: async (page: number, filters: ViZoneFilters = {}, perPage: number = ZONE_PER_PAGE): Promise<ViZoneListResponse> => {
    const { data } = await apiClient.get(`${ENDPOINT}.json`, {
      params: {
        page,
        per_page: perPage,
        company_cluster_id: filters.circleId || undefined,
        active: filters.active || undefined,
        "q[name_cont]": filters.search || undefined,
      },
    });
    const rows: ViZone[] = data?.data ?? [];
    return { data: rows, pagination: toPagination(data?.pagination, page, rows.length) };
  },

  create: async (payload: ViZonePayload): Promise<ViZone> => {
    const { data } = await apiClient.post(`${ENDPOINT}.json`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data?.data ?? data;
  },

  /** The circle can't change, so only name / active are sent. */
  update: async (id: number, payload: Partial<Omit<ViZonePayload, "company_cluster_id">>): Promise<ViZone> => {
    const { data } = await apiClient.patch(`${ENDPOINT}/${id}.json`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data?.data ?? data;
  },

  delete: async (id: number): Promise<TrainingDeleteResult> => {
    const { data } = await apiClient.delete(`${ENDPOINT}/${id}.json`);
    return { outcome: data?.outcome ?? data?.data?.outcome };
  },

  /** Circles (company clusters) for the dropdowns — the same list the Vi dashboards filter by. */
  circles: async (): Promise<CircleOption[]> => {
    const { data } = await apiClient.get("/vi_inspection_dashboard/cluster_filter.json", {
      params: { company_id: companyId() },
    });
    const clusters: { id?: number | string; cluster_name?: string; name?: string }[] = data?.clusters ?? data?.data ?? [];
    return clusters
      .map((cluster) => ({ id: String(cluster.id ?? ""), name: String(cluster.cluster_name ?? cluster.name ?? "") }))
      .filter((option) => option.id && option.name);
  },
};
