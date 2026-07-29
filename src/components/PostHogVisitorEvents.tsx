import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

export type VisitorScreen =
  | "visitor_list"
  | "visitor_add"
  | "visitor_analytics"
  | "staff_list"
  | "staff_add";

export type VisitorType = "expected" | "unexpected";
export type VisitorSearchBy = "name" | "mobile" | "host";
export type ExportFormat = "csv" | "xlsx";

/**
 * Event/property contract for the Visitor & Staff module — see
 * "09 Requirements/Visitor and Staff - Product-Flow Analytics Spec.md".
 * Same event names & property domains fire on web and mobile; this hook
 * stamps the web-side properties (platform, release_version) and the shared
 * `screen` key from §2. Server-side lifecycle events (approve/reject,
 * check-in/out) are emitted by the guard app / backend, not here.
 */
export function useVisitorEvents() {
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

  const capture = (
    event: string,
    screen: VisitorScreen,
    props: Record<string, unknown> = {}
  ) => {
    if (!posthog) return;
    posthog.capture(event, {
      platform: "web",
      release_version: RELEASE_VERSION,
      ...getCommonContext(),
      screen,
      ...props,
    });
  };

  return {
    // F1/F2 · Visitor Lifecycle start + Pre-registration
    onVisitorLookupPerformed: (matched: boolean) =>
      capture("Visitor Lookup Performed", "visitor_add", { matched }),

    onVisitorCreated: (props: {
      visitor_type: VisitorType;
      purpose: string | null;
      host_id: string | number | null;
      is_returning: boolean;
    }) => capture("Visitor Created", "visitor_add", props),

    // F3 · Findability & Register Management
    onVisitorListViewed: (pageDepth: number) =>
      capture("Visitor List Viewed", "visitor_list", { page_depth: pageDepth }),

    onVisitorSearchPerformed: (searchBy: VisitorSearchBy, returnedZero: boolean) =>
      capture("Visitor Search Performed", "visitor_list", {
        search_by: searchBy,
        returned_zero: returnedZero,
      }),

    onVisitorFlagToggled: (visitorId: string | number, toState: boolean) =>
      capture("Visitor Flag Toggled", "visitor_list", {
        visitor_id: visitorId,
        to_state: toState,
      }),

    onVisitorRegisterExported: (rowCount: number, format: ExportFormat) =>
      capture("Visitor Register Exported", "visitor_list", {
        row_count: rowCount,
        format,
      }),

    // F4 · Visitor Analytics Consumption
    onVisitorAnalyticsViewed: () =>
      capture("Visitor Analytics Viewed", "visitor_analytics"),

    onVisitorAnalyticsFiltered: (dateRange: string) =>
      capture("Visitor Analytics Filtered", "visitor_analytics", {
        date_range: dateRange,
      }),

    onVisitorAnalyticsExported: (tile: string) =>
      capture("Visitor Analytics Exported", "visitor_analytics", { tile }),

    onVisitorAnalyticsLoadFailed: (errorCode: string | number) =>
      capture("Visitor Analytics Load Failed", "visitor_analytics", {
        error_code: errorCode,
      }),

    // F5 · Staff Onboarding & Registry Health
    onStaffFormOpened: () => capture("Staff Form Opened", "staff_add"),

    onStaffSubmitted: (props: {
      has_photo: boolean;
      has_documents: boolean;
      schedule_days_set: number;
      validity_days: number | null;
    }) => capture("Staff Submitted", "staff_add", props),
  };
}
