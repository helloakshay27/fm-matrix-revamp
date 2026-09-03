import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePostHog } from "@posthog/react";
import { getPostHogSuperProperties, normalizeRoute } from "@/utils/posthogContext";

export function PostHogPageView() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    if (!posthog) return;

    // Re-register the super-properties on every navigation, for two reasons:
    //
    // `screen` is the dimension §6.1 groups every module breakdown by. Registering it here
    // means all ~20 event modules inherit the right value without each one remembering to
    // set it; a module that stamps its own more specific `screen` still wins, because an
    // event property beats a super-property.
    //
    // `client_company` is unknown at init — the user has not picked a company yet — so it
    // has to be refreshed once they have. Navigation is the cheapest reliable hook for that.
    posthog.register({
      ...getPostHogSuperProperties(),
      screen: normalizeRoute(location.pathname),
    });

    const _siteId = localStorage.getItem("selectedSiteId") ?? localStorage.getItem("site_id");
    const _companyId = localStorage.getItem("selectedCompanyId") ?? localStorage.getItem("company_id");
    const siteIdNum = _siteId && !isNaN(Number(_siteId)) ? Number(_siteId) : undefined;
    const companyIdNum = _companyId && !isNaN(Number(_companyId)) ? Number(_companyId) : undefined;
    const _userId = localStorage.getItem("userId") ?? localStorage.getItem("user_id");
    const userIdNum = _userId && !isNaN(Number(_userId)) ? Number(_userId) : undefined;

    posthog.capture("$pageview", {
      $current_url: window.location.href,
      project_id: "P-223",
      project_code: "FM-01",
      site_id: siteIdNum,
      site_name: localStorage.getItem("selectedSiteName") ?? undefined,
      company_id: companyIdNum,
      company_name: localStorage.getItem("selectedCompany") ?? undefined,
      organization_id: (() => { const v = localStorage.getItem("selectedOrgId") ?? localStorage.getItem("organization_id") ?? localStorage.getItem("org_id"); return v && !isNaN(Number(v)) ? Number(v) : undefined; })(),
      organization_name: localStorage.getItem("selectedOrg") ?? undefined,
      user_id: userIdNum,
    });
  }, [location, posthog]);

  return null;
}
