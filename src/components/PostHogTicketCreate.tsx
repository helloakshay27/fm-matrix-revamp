import { usePostHog } from "@posthog/react";

const RELEASE_VERSION = (import.meta.env.VITE_APP_VERSION as string) ?? "dev";

export function useTicketEvents() {
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
    onHelpdeskViewed: (screen: "ticket_list" | "ticket_analytics") =>
      capture("Helpdesk Viewed", { screen }),

    onTicketCreateFormOpened: (entryPoint: string) =>
      capture("Ticket Create Form Opened", {
        screen: "ticket_list",
        entry_point: entryPoint,
      }),

    onTicketDetailOpened: (ticketId: string | number, source: string) =>
      capture("Ticket Detail Opened", {
        screen: "ticket_list",
        open_source: source,
        ticket_id: ticketId,
      }),

    onFilterApplied: (filtersUsed: string[], filterCount: number) =>
      capture("Ticket Filter Applied", {
        screen: "ticket_list",
        filters_used: filtersUsed,
        filter_count: filterCount,
      }),

    onSearchPerformed: (queryLength: number, resultCount: number) =>
      capture("Ticket Search Performed", {
        screen: "ticket_list",
        query_length: queryLength,
        result_count: resultCount,
        returned_zero: resultCount === 0,
      }),
  };
}
