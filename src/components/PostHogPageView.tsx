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
        company_name: localStorage.getItem("selectedCompany") ?? undefined,
        site_name: localStorage.getItem("selectedSiteName") ?? undefined,
        organization_name: localStorage.getItem("selectedOrg") ?? undefined,
      });
    }
  }, [location, posthog]);

  return null;
}
