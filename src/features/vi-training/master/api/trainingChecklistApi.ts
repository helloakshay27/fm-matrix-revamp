import { apiClient } from "@/utils/apiClient";
import {
  activeParam,
  toPagination,
  type TrainingDeleteResult,
  type TrainingPagination,
} from "./trainingCategoryApi";

// Training checklist = the API's "training questions" (GET/POST/PATCH/DELETE /training_questions).

export interface TrainingQuestionOption {
  key: string;
  text: string;
}

export interface TrainingQuestion {
  id: number;
  company_id?: number;
  training_subject_id: number;
  question: string;
  options: TrainingQuestionOption[];
  /** Option letter, e.g. "C". */
  correct_answer: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingQuestionPayload {
  training_subject_id: string;
  question: string;
  /** Option texts in order; the API letters them A, B, C… */
  options: string[];
  correct_answer: string;
  active?: boolean;
}

export interface TrainingChecklistFilters {
  categoryId?: string;
  /** "true" | "false" — omitted for all. */
  active?: string;
  /** Server search on the question text (q[question_cont]). */
  search?: string;
}

export interface TrainingChecklistListResponse {
  data: TrainingQuestion[];
  pagination: TrainingPagination;
}

export const TRAINING_CHECKLIST_PER_PAGE = 10;
/** The API accepts 2 to 26 options (A–Z). */
export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 26;

export const optionLetter = (index: number) => String.fromCharCode(65 + index);

const ENDPOINT = "/training_questions";

export const trainingChecklistApi = {
  list: async (
    page: number,
    filters: TrainingChecklistFilters = {},
    perPage: number = TRAINING_CHECKLIST_PER_PAGE
  ): Promise<TrainingChecklistListResponse> => {
    const { data } = await apiClient.get(`${ENDPOINT}.json`, {
      params: {
        page,
        per_page: perPage,
        training_subject_id: filters.categoryId || undefined,
        active: activeParam(filters.active),
        "q[question_cont]": filters.search || undefined,
      },
    });
    const rows: TrainingQuestion[] = data?.data ?? [];
    return { data: rows, pagination: toPagination(data?.pagination, page, rows.length) };
  },

  create: async (payload: TrainingQuestionPayload): Promise<TrainingQuestion> => {
    const { data } = await apiClient.post(`${ENDPOINT}.json`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return data?.data ?? data;
  },

  /** training_subject_id can't change; options and correct_answer must be sent together. */
  update: async (
    id: number,
    payload: Partial<Omit<TrainingQuestionPayload, "training_subject_id">>
  ): Promise<TrainingQuestion> => {
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
