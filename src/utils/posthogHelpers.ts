import posthog from "posthog-js";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

/**
 * Fire a generic PostHog event with standard platform/release context.
 */
export const capturePostHogEvent = (
  event: string,
  props: Record<string, unknown> = {}
) => {
  const _siteId = localStorage.getItem("selectedSiteId") ?? localStorage.getItem("site_id");
  const _companyId = localStorage.getItem("selectedCompanyId") ?? localStorage.getItem("company_id");
  const siteIdNum = _siteId && !isNaN(Number(_siteId)) ? Number(_siteId) : undefined;
  const companyIdNum = _companyId && !isNaN(Number(_companyId)) ? Number(_companyId) : undefined;
  const _userId = localStorage.getItem("userId") ?? localStorage.getItem("user_id");
  const userIdNum = _userId && !isNaN(Number(_userId)) ? Number(_userId) : undefined;
  const _orgId = localStorage.getItem("selectedOrgId") ?? localStorage.getItem("organization_id");
  const orgIdNum = _orgId && !isNaN(Number(_orgId)) ? Number(_orgId) : undefined;

  posthog.capture(event, {
    platform: "web",
    release_version: RELEASE_VERSION,
    project_id: "P-223",
    project_code: "FM-01",
    site_id: siteIdNum,
    site_name: localStorage.getItem("selectedSiteName") ?? undefined,
    company_id: companyIdNum,
    company_name: localStorage.getItem("selectedCompany") ?? undefined,
    organization_id: orgIdNum,
    organization_name: localStorage.getItem("selectedOrg") ?? undefined,
    user_id: userIdNum,
    ...props,
  });
};

/**
 * Fire a Helpdesk product-analytics event with standard platform/release context.
 * Use this for all custom events defined in the Helpdesk Product Analytics Catalogue.
 */
export const captureHelpdeskEvent = (
  event: string,
  props: Record<string, unknown> = {}
) => {
  capturePostHogEvent(event, props);
};
