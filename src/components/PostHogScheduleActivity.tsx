import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

type ScheduleActivityEvent =
  | "Schedule List Viewed"
  | "Schedule Import Opened"
  | "Schedule Create Started"
  | "Schedule Form Block Completed"
  | "Schedule Saved"
  | "Schedule Create Abandoned"
  | "Schedule Detail Viewed"
  // Business lifecycle events (Task & PPM catalogue) — curated, not UI-usage
  | "Maintenance Schedule Defined";

interface PostHogScheduleActivityProps {
  event: ScheduleActivityEvent;
  properties?: Record<string, unknown>;
}

export function PostHogScheduleActivity({ event, properties }: PostHogScheduleActivityProps) {
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
