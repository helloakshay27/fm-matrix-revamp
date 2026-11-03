import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  trainingCategoryApi,
  type TrainingCategoryFilters,
  type TrainingCategoryPayload,
} from "./trainingCategoryApi";
import {
  trainingChecklistApi,
  type TrainingChecklistFilters,
  type TrainingQuestionPayload,
} from "./trainingChecklistApi";

/** Large enough to load every category in one request for dropdowns. */
const CATEGORY_OPTIONS_LIMIT = 500;

export const trainingCategoryKeys = {
  all: ["vi-training", "categories"] as const,
  list: (page: number, filters: TrainingCategoryFilters) =>
    [...trainingCategoryKeys.all, "list", page, filters.search ?? "", filters.active ?? ""] as const,
  options: () => [...trainingCategoryKeys.all, "options"] as const,
};

export const trainingChecklistKeys = {
  all: ["vi-training", "checklist"] as const,
  list: (page: number, filters: TrainingChecklistFilters) =>
    [...trainingChecklistKeys.all, "list", page, filters.categoryId ?? "", filters.active ?? "", filters.search ?? ""] as const,
};

// Fetch only on key change or mutation invalidation (as on the inspection masters).
const fetchOnChangeOnly = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: false,
} as const;

/* ------------------------------------------------------- Training categories */

export const useTrainingCategories = (page: number, filters: TrainingCategoryFilters) =>
  useQuery({
    queryKey: trainingCategoryKeys.list(page, filters),
    queryFn: () => trainingCategoryApi.list(page, filters),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
    ...fetchOnChangeOnly,
  });

/** Every category (active and inactive), for dropdowns and id → name lookups. */
export const useTrainingCategoryOptions = () =>
  useQuery({
    queryKey: trainingCategoryKeys.options(),
    queryFn: async () => (await trainingCategoryApi.list(1, {}, CATEGORY_OPTIONS_LIMIT)).data,
    ...fetchOnChangeOnly,
  });

export const useCreateTrainingCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: TrainingCategoryPayload) => trainingCategoryApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingCategoryKeys.all }),
  });
};

export const useUpdateTrainingCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<TrainingCategoryPayload> }) =>
      trainingCategoryApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingCategoryKeys.all }),
  });
};

export const useDeleteTrainingCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => trainingCategoryApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: trainingCategoryKeys.all }),
  });
};

/* ------------------------------------------------------- Training checklist */

export const useTrainingChecklist = (page: number, filters: TrainingChecklistFilters) =>
  useQuery({
    queryKey: trainingChecklistKeys.list(page, filters),
    queryFn: () => trainingChecklistApi.list(page, filters),
    placeholderData: keepPreviousData,
    ...fetchOnChangeOnly,
  });

// Question changes also move a category's questions_count, so both lists are refreshed.
const useInvalidateChecklist = () => {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: trainingChecklistKeys.all });
    qc.invalidateQueries({ queryKey: trainingCategoryKeys.all });
  };
};

export const useCreateTrainingQuestion = () => {
  const invalidate = useInvalidateChecklist();
  return useMutation({
    mutationFn: (payload: TrainingQuestionPayload) => trainingChecklistApi.create(payload),
    onSuccess: invalidate,
  });
};

export const useUpdateTrainingQuestion = () => {
  const invalidate = useInvalidateChecklist();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Omit<TrainingQuestionPayload, "training_subject_id">>;
    }) => trainingChecklistApi.update(id, payload),
    onSuccess: invalidate,
  });
};

export const useDeleteTrainingQuestion = () => {
  const invalidate = useInvalidateChecklist();
  return useMutation({
    mutationFn: (id: number) => trainingChecklistApi.delete(id),
    onSuccess: invalidate,
  });
};
