import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePostHog } from "@posthog/react";

export function PostHogPageView() {
  const location = useLocation();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog) {
      const organization_name = localStorage.getItem("selectedOrg") ?? undefined;
      const company_name = localStorage.getItem("selectedCompany") ?? undefined;
      const site_name = localStorage.getItem("selectedSiteName") ?? undefined;

      posthog.capture("$pageview", {
        $current_url: window.location.href,
        organization_name,
        company_name,
        site_name,
        // Also attach to the person profile so these show on all events
        $set: { organization_name, company_name, site_name },
      });
    }
  }, [location, posthog]);

  return null;
}
