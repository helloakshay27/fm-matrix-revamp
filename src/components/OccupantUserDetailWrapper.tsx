import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ViewOccupantUserPage } from "@/pages/master/ViewOccupantUserPage";
import { OccupantUserMobileDetail } from "@/components/mobile/OccupantUserMobileDetail";
import { registerServiceWorker, isPWARoute } from "@/utils/pwa";

export const OccupantUserDetailWrapper = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check if device is mobile or window width is small
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Register service worker only for PWA routes
    if (isPWARoute(location.pathname, location.search)) {
      registerServiceWorker();
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [location.pathname, location.search]);

  // Show mobile version if on ops-console route or mobile device
  const isOpsConsole = location.pathname.includes("/ops-console/");
  return isMobile || isOpsConsole ? (
    <OccupantUserMobileDetail />
  ) : (
    <ViewOccupantUserPage />
  );
};
