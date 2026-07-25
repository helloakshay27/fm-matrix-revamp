import { useEffect } from "react";
import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

interface PostHogAuditActivityProps {
  event:
    | "Audit Schedule List Viewed"
    | "Audit Conducted List Viewed"
    | "Audit Wizard Step Viewed"
    | "Add Question clicked"
    | "Add Section clicked"
    | "Save to Draft clicked"
    | "Master Checklist Import clicked"
    | "Download Sample Format clicked"
    | "Report opened"
    | "Audit Filter Applied"
    | "Audit Schedule Defined"
    | "Audit Started"
    | "Audit Completed"
    | "Master Checklist Created";
  properties?: Record<string, unknown>;
}

export function PostHogAuditActivity({ event, properties }: PostHogAuditActivityProps) {
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
