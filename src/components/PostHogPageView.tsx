import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePostHog } from "@posthog/react";

export function PostHogPageView() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        project_id: "P-223",
        project_code: "FM-01",
        site_id: localStorage.getItem("selectedSiteId") ?? undefined,
        site_name: localStorage.getItem("selectedSiteName") ?? undefined,
        company_id: localStorage.getItem("selectedCompanyId") ?? undefined,
        company_name: localStorage.getItem("selectedCompany") ?? undefined,
        organization_id: localStorage.getItem("selectedOrgId") ?? undefined,
        organization_name: localStorage.getItem("selectedOrg") ?? undefined,
      });
    }
  }, [location, posthog]);

  return null;
}
