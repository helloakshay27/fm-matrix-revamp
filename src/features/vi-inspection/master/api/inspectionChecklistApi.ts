import { apiClient } from "@/utils/apiClient";
import type { InspectionTypePagination } from "./inspectionTypeApi";

export interface InspectionChecklistQuestion {
  id: number;
  company_id?: number;
  inspection_type_id: number;
  question: string;
  position?: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InspectionChecklistPayload {
  inspection_type_id: string;
  question: string;
  active: boolean;
}

export interface InspectionChecklistFilters {
  inspectionTypeId?: string;
  /** "true" | "false" — omitted for all. */
  active?: string;
}

export interface InspectionChecklistListResponse {
  code: number;
  data: InspectionChecklistQuestion[];
  pagination: InspectionTypePagination;
}

export const INSPECTION_CHECKLIST_PER_PAGE = 10;

const ENDPOINT = "/vi_inspection_checklist_question_masters";

export const inspectionChecklistApi = {
  list: async (
    page: number,
    filters: InspectionChecklistFilters = {},
    perPage: number = INSPECTION_CHECKLIST_PER_PAGE
  ): Promise<InspectionChecklistListResponse> => {
    const { data } = await apiClient.get<InspectionChecklistListResponse>(`${ENDPOINT}.json`, {
      params: {
        page,
        per_page: perPage,
        inspection_type_id: filters.inspectionTypeId || undefined,
        active: filters.active || undefined,
      },
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

  create: async (payload: InspectionChecklistPayload): Promise<InspectionChecklistQuestion> => {
    const { data } = await apiClient.post<InspectionChecklistQuestion>(`${ENDPOINT}.json`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  update: async (
    id: number,
    payload: Partial<InspectionChecklistPayload>
  ): Promise<InspectionChecklistQuestion> => {
    const { data } = await apiClient.put<InspectionChecklistQuestion>(`${ENDPOINT}/${id}.json`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${ENDPOINT}/${id}.json`);
  },
};
