import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { inspectionTypeApi, type InspectionTypePayload } from "./inspectionTypeApi";
import {
  inspectionChecklistApi,
  type InspectionChecklistFilters,
  type InspectionChecklistPayload,
} from "./inspectionChecklistApi";

/** Large enough to load every inspection type in one request for dropdowns. */
const INSPECTION_TYPE_OPTIONS_LIMIT = 500;

export const inspectionTypeKeys = {
  all: ["vi-inspection", "inspection-types"] as const,
  list: (page: number) => [...inspectionTypeKeys.all, "list", page] as const,
  options: () => [...inspectionTypeKeys.all, "options"] as const,
};

export const inspectionChecklistKeys = {
  all: ["vi-inspection", "inspection-checklist"] as const,
  list: (page: number, filters: InspectionChecklistFilters) =>
    [...inspectionChecklistKeys.all, "list", page, filters.inspectionTypeId ?? "", filters.active ?? ""] as const,
};

// Shared with the list query below: fetch only on key change or mutation invalidation.
const fetchOnChangeOnly = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: false,
} as const;

export const useInspectionTypes = (page: number) =>
  useQuery({
    queryKey: inspectionTypeKeys.list(page),
    queryFn: () => inspectionTypeApi.list(page),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
    // Fetch only when the page changes (or after a mutation invalidates the list) — the app's
    // default QueryClient would otherwise also refetch the old page on window focus / remount,
    // which fires alongside the new page's request.
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

/** Every inspection type (active and inactive), for dropdowns and id → name lookups. */
export const useInspectionTypeOptions = () =>
  useQuery({
    queryKey: inspectionTypeKeys.options(),
    queryFn: async () => (await inspectionTypeApi.list(1, INSPECTION_TYPE_OPTIONS_LIMIT)).data,
    ...fetchOnChangeOnly,
  });

export const useCreateInspectionType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InspectionTypePayload) => inspectionTypeApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: inspectionTypeKeys.all }),
  });
};

export const useUpdateInspectionType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<InspectionTypePayload> }) =>
      inspectionTypeApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: inspectionTypeKeys.all }),
  });
};

export const useDeleteInspectionType = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => inspectionTypeApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: inspectionTypeKeys.all }),
  });
};

/* ------------------------------------------------------- Inspection checklist */

export const useInspectionChecklist = (page: number, filters: InspectionChecklistFilters) =>
  useQuery({
    queryKey: inspectionChecklistKeys.list(page, filters),
    queryFn: () => inspectionChecklistApi.list(page, filters),
    placeholderData: keepPreviousData,
    ...fetchOnChangeOnly,
  });

export const useCreateInspectionChecklist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: InspectionChecklistPayload) => inspectionChecklistApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: inspectionChecklistKeys.all }),
  });
};

export const useUpdateInspectionChecklist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<InspectionChecklistPayload> }) =>
      inspectionChecklistApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: inspectionChecklistKeys.all }),
  });
};

export const useDeleteInspectionChecklist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => inspectionChecklistApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: inspectionChecklistKeys.all }),
  });
};
