import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

export type SetupTab = "visit_purpose" | "work_type" | "move_in_out";

/**
 * Event/property contract for the Visitor Setup module (Visiting Purpose,
 * Work Type, Move In/Out master-data lists) — src/pages/VisitingPurposePage.tsx.
 * Only the "add" sub-flow is instrumented per tab; the parallel "update" flow
 * (edit modals) uses an identical shape against an existing row and is not
 * separately tracked, matching how the other two tabs' add-only flows work.
 */
export function useVisitorSetupEvents() {
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
    };
  };

  const capture = (event: string, props: Record<string, unknown> = {}) => {
    if (!posthog) return;
    posthog.capture(event, {
      platform: "web",
      release_version: RELEASE_VERSION,
      ...getCommonContext(),
      ...props,
    });
  };

  return {
    onSetupTabViewed: (tab: SetupTab) =>
      capture("Setup Tab Viewed", { tab }),

    onSetupFormOpened: (tab: SetupTab) =>
      capture("Setup Form Opened", { tab }),

    onVisitPurposeAdded: (props: { purpose_count: number; active: boolean }) =>
      capture("Setup Visit Purpose Added", { tab: "visit_purpose", ...props }),

    onWorkTypeAdded: (props: { work_type_count: number; staff_type: string; active: boolean }) =>
      capture("Setup Work Type Added", { tab: "work_type", ...props }),

    onMoveInOutPurposeAdded: (props: { purpose_count: number; active: boolean }) =>
      capture("Setup Move In/Out Purpose Added", { tab: "move_in_out", ...props }),
  };
}
