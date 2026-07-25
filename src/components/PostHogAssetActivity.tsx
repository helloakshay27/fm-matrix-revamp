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
  const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

  const getCommonContext = () => ({
    project_id: "P-223",
    project_code: "FM-01",
    site_id: localStorage.getItem("selectedSiteId") ?? undefined,
    site_name: localStorage.getItem("selectedSiteName") ?? undefined,
    company_id: localStorage.getItem("selectedCompanyId") ?? undefined,
    company_name: localStorage.getItem("selectedCompany") ?? undefined,
    organization_id: localStorage.getItem("selectedOrgId") ?? undefined,
    organization_name: localStorage.getItem("selectedOrg") ?? undefined,
    platform: "web",
    release_version: RELEASE_VERSION,
  });

  useEffect(() => {
    if (posthog) {
      posthog.capture(event, { ...getCommonContext(), ...(properties ?? {}) });
    }
  }, [posthog, event, properties]);
  return null;
}
