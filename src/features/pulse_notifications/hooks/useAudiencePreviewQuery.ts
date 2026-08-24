import { useQuery } from "@tanstack/react-query";
import { fetchAudiencePreview } from "../api/customNotificationsApi";
import type { AudiencePreviewPayload } from "../types/customNotification";

export function useAudiencePreviewQuery(payload: AudiencePreviewPayload | null) {
  return useQuery({
    queryKey: ["pulse-audience-preview", payload],
    queryFn: () => fetchAudiencePreview(payload as AudiencePreviewPayload),
    enabled: payload != null,
    refetchOnWindowFocus: false,
  });
}
