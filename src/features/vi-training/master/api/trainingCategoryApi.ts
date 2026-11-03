import { apiClient } from "@/utils/apiClient";

// Training categories = the API's "training subjects" (GET/POST/PATCH/DELETE /training_subjects).

export interface TrainingCategory {
  id: number;
  name: string;
  active: boolean;
  questions_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingCategoryPayload {
  category_name: string;
  /** Only sent by the table's status toggle. */
  active?: boolean;
}

export interface TrainingPagination {
  current_page: number;
  total_count: number;
  total_pages: number;
}

export interface TrainingCategoryListResponse {
  data: TrainingCategory[];
  pagination: TrainingPagination;
}

export interface TrainingCategoryFilters {
  /** Server search on the category name (q[category_name_cont]). */
  search?: string;
  /** "true" | "false" — omitted for all. */
  active?: string;
}

/** DELETE answers with "deactivated" when trainings/questions still use the category. */
export interface TrainingDeleteResult {
  outcome?: "deleted" | "deactivated" | string;
}

export const TRAINING_CATEGORY_PER_PAGE = 10;

const ENDPOINT = "/training_subjects";

/** The API lists active rows only unless told otherwise: "all" when no status filter is set. */
export const activeParam = (active?: string) => active || "all";

export const toPagination = (pagination: Partial<TrainingPagination> | undefined, page: number, count: number): TrainingPagination => ({
  current_page: pagination?.current_page ?? page,
  total_count: pagination?.total_count ?? count,
  total_pages: Math.max(1, pagination?.total_pages ?? 1),
});

export const trainingCategoryApi = {
  list: async (
    page: number,
    filters: TrainingCategoryFilters = {},
    perPage: number = TRAINING_CATEGORY_PER_PAGE
  ): Promise<TrainingCategoryListResponse> => {
    const { data } = await apiClient.get(`${ENDPOINT}.json`, {
      params: {
        page,
        per_page: perPage,
        active: activeParam(filters.active),
        "q[category_name_cont]": filters.search || undefined,
      },
    });
    const rows: TrainingCategory[] = data?.data ?? [];
    return { data: rows, pagination: toPagination(data?.pagination, page, rows.length) };
  },

  create: async (payload: TrainingCategoryPayload): Promise<TrainingCategory> => {
    const { data } = await apiClient.post(`${ENDPOINT}.json`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data?.data ?? data;
  },

  update: async (id: number, payload: Partial<TrainingCategoryPayload>): Promise<TrainingCategory> => {
    const { data } = await apiClient.patch(`${ENDPOINT}/${id}.json`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data?.data ?? data;
  },

  delete: async (id: number): Promise<TrainingDeleteResult> => {
    const { data } = await apiClient.delete(`${ENDPOINT}/${id}.json`);
    return { outcome: data?.outcome ?? data?.data?.outcome };
  },
};
