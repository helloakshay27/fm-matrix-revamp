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

  const getCommonContext = () => {
    const _siteId = localStorage.getItem("selectedSiteId") ?? localStorage.getItem("site_id");
    const _companyId = localStorage.getItem("selectedCompanyId") ?? localStorage.getItem("company_id");
    const siteIdNum = _siteId && !isNaN(Number(_siteId)) ? Number(_siteId) : undefined;
    const companyIdNum = _companyId && !isNaN(Number(_companyId)) ? Number(_companyId) : undefined;
    const _userId = localStorage.getItem("userId") ?? localStorage.getItem("user_id");
    const userIdNum = _userId && !isNaN(Number(_userId)) ? Number(_userId) : undefined;
    const _orgId = localStorage.getItem("selectedOrgId") ?? localStorage.getItem("organization_id") ?? localStorage.getItem("org_id");
    const orgIdNum = _orgId && !isNaN(Number(_orgId)) ? Number(_orgId) : undefined;

    return {
      project_id: "P-223",
      project_code: "FM-01",
      site_id: siteIdNum,
      site_name: localStorage.getItem("selectedSiteName") ?? undefined,
      company_id: companyIdNum,
      company_name: localStorage.getItem("selectedCompany") ?? undefined,
      organization_id: orgIdNum,
      organization_name: localStorage.getItem("selectedOrg") ?? undefined,
      user_id: userIdNum,
      platform: "web",
      release_version: RELEASE_VERSION,
    };
  };

  useEffect(() => {
    if (posthog) {
      posthog.capture(event, { ...getCommonContext(), ...(properties ?? {}) });
    }
  }, [posthog, event, properties]);

  return null;
}
