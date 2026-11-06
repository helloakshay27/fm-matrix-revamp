import { useMemo } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zoneApi, type ViZoneFilters, type ViZonePayload } from "./zoneApi";

/** Large enough to load every zone of a circle in one request for dropdowns. */
const CIRCLE_ZONES_LIMIT = 500;

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

/** Active zones of one circle for the Audit / Incident / Inspection forms (none until a circle is picked). */
export const useCircleZones = (circleId: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [...zoneKeys.all, "circle", circleId] as const,
    queryFn: async () => (await zoneApi.list(1, { circleId, active: "true" }, CIRCLE_ZONES_LIMIT)).data,
    enabled: !!circleId,
    ...fetchOnChangeOnly,
  });
  const zones = useMemo(
    () => (data ?? []).map((zone) => ({ value: String(zone.id), label: zone.name })),
    [data]
  );
  const placeholder = !circleId
    ? "Select circle first"
    : isError
      ? "Couldn't load zones"
      : !isLoading && zones.length === 0
        ? "No zones in this circle"
        : "Select zone";
  return { zones, loading: isLoading, placeholder };
};

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
