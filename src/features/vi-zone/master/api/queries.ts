import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zoneApi, type ViZoneFilters, type ViZonePayload } from "./zoneApi";

export const zoneKeys = {
  all: ["vi-zone", "zones"] as const,
  list: (page: number, filters: ViZoneFilters) =>
    [...zoneKeys.all, "list", page, filters.circleId ?? "", filters.active ?? "", filters.search ?? ""] as const,
  circles: () => ["vi-zone", "circles"] as const,
};

// Fetch only on key change or mutation invalidation (as on the training masters).
const fetchOnChangeOnly = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: false,
} as const;

export const useZones = (page: number, filters: ViZoneFilters) =>
  useQuery({
    queryKey: zoneKeys.list(page, filters),
    queryFn: () => zoneApi.list(page, filters),
    // Keep the current page on screen while the next one loads.
    placeholderData: keepPreviousData,
    ...fetchOnChangeOnly,
  });

export const useCircleOptions = () =>
  useQuery({
    queryKey: zoneKeys.circles(),
    queryFn: zoneApi.circles,
    ...fetchOnChangeOnly,
  });

export const useCreateZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ViZonePayload) => zoneApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: zoneKeys.all }),
  });
};

export const useUpdateZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Omit<ViZonePayload, "company_cluster_id">> }) =>
      zoneApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: zoneKeys.all }),
  });
};

export const useDeleteZone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => zoneApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: zoneKeys.all }),
  });
};
