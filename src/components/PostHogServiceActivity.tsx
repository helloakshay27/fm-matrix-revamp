import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

type ServiceActivityEvent = "Soft Service List Viewed";

interface PostHogServiceActivityProps {
  event: ServiceActivityEvent;
  properties?: Record<string, unknown>;
}

export function PostHogServiceActivity({ event, properties }: PostHogServiceActivityProps) {
  const posthog = usePostHog();

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
