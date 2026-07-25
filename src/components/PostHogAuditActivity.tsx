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

  const getCommonContext = () => {
    const _siteId = localStorage.getItem("selectedSiteId") ?? localStorage.getItem("site_id");
    const _companyId = localStorage.getItem("selectedCompanyId") ?? localStorage.getItem("company_id");
    const siteIdNum = _siteId && !isNaN(Number(_siteId)) ? Number(_siteId) : undefined;
    const companyIdNum = _companyId && !isNaN(Number(_companyId)) ? Number(_companyId) : undefined;
    const _userId = localStorage.getItem("userId") ?? localStorage.getItem("user_id");
    const userIdNum = _userId && !isNaN(Number(_userId)) ? Number(_userId) : undefined;
    const _orgId = localStorage.getItem("selectedOrgId") ?? localStorage.getItem("organization_id");
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
