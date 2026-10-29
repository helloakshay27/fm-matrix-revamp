import { apiClient } from "@/utils/apiClient";

export interface InspectionType {
  id: number;
  company_id?: number;
  name: string;
  active: boolean;
  lat_long_required?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InspectionTypePayload {
  name: string;
  lat_long_required: boolean;
  /** Only sent by the table's status toggle. */
  active?: boolean;
}

export interface InspectionTypePagination {
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface InspectionTypeListResponse {
  code: number;
  data: InspectionType[];
  pagination: InspectionTypePagination;
}

export const INSPECTION_TYPE_PER_PAGE = 10;

const ENDPOINT = "/vi_inspection_type_masters";

export const inspectionTypeApi = {
  list: async (page: number, perPage: number = INSPECTION_TYPE_PER_PAGE): Promise<InspectionTypeListResponse> => {
    const { data } = await apiClient.get<InspectionTypeListResponse>(`${ENDPOINT}.json`, {
      params: { page, per_page: perPage },
    });
    return {
      code: data?.code,
      data: data?.data ?? [],
      pagination: {
        current_page: data?.pagination?.current_page ?? page,
        total_count: data?.pagination?.total_count ?? data?.data?.length ?? 0,
        total_pages: Math.max(1, data?.pagination?.total_pages ?? 1),
      },
    };
  },

  create: async (payload: InspectionTypePayload): Promise<InspectionType> => {
    const { data } = await apiClient.post<InspectionType>(`${ENDPOINT}.json`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  update: async (id: number, payload: Partial<InspectionTypePayload>): Promise<InspectionType> => {
    const { data } = await apiClient.put<InspectionType>(`${ENDPOINT}/${id}.json`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}.json`);
  },
};
