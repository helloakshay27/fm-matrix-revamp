import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

interface PostHogAssetActivityProps {
  event:
    | "Asset List Viewed"
    | "Asset Analytics Viewed"
    | "Asset Analytics Widget Configured"
    | "Asset Detail Viewed"
    | "Asset Tab Viewed"
    | "Asset QR Viewed"
    | "Asset Export Clicked"
    | "Asset Filter Applied"
    | "Asset Columns Changed"
    | "Asset Status Inline-Edited";
  properties?: Record<string, unknown>;
}

export function PostHogAssetActivity({ event, properties }: PostHogAssetActivityProps) {
  const posthog = usePostHog();
  useEffect(() => {
    if (posthog) {
      posthog.capture(event, properties);
    }
  }, [posthog, event, properties]);
  return null;
}
