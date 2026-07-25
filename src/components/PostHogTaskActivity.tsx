import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

type TaskActivityEvent =
  | "Task List Viewed"
  | "Task View Switched"
  | "Task Filter Applied"
  | "Task Search Performed"
  | "Task List Exported"
  | "Task Detail Opened"
  | "Checklist Execution Started"
  | "Checklist Item Answered"
  | "Task Submitted (UI)"
  | "Task Rescheduled (UI)"
  | "Task Analytics Date Range Changed"
  | "Task Analytics Report Toggled"
  | "Task Columns Customised"
  // Business lifecycle events (Task & PPM catalogue) — curated, not UI-usage
  | "Checklist Started"
  | "Checklist Item Completed"
  | "Maintenance Task Submitted"
  | "Maintenance Task Assigned"
  | "Maintenance Task Rescheduled"
  | "Maintenance Task Reviewed";

interface PostHogTaskActivityProps {
  event: TaskActivityEvent;
  properties?: Record<string, unknown>;
}

export function PostHogTaskActivity({ event, properties }: PostHogTaskActivityProps) {
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
