import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { OccupantUserMasterDashboard } from "@/pages/master/OccupantUserMasterDashboard";
import { OccupantUserMobileList } from "@/components/mobile/OccupantUserMobileList";
import { registerServiceWorker, isPWARoute } from "@/utils/pwa";

export const OccupantUserListWrapper = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const isOpsConsole = location.pathname.includes("/ops-console/");

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
    const isPWA = isPWARoute(location.pathname, location.search);
    console.log("[OccupantUserListWrapper] Checking PWA route:", {
      pathname: location.pathname,
      search: location.search,
      isPWA,
    });

    if (isPWA) {
      console.log("[OccupantUserListWrapper] Registering service worker...");
      registerServiceWorker();
    } else {
      console.log(
        "[OccupantUserListWrapper] Not a PWA route, skipping service worker registration"
      );
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [location.pathname, location.search]);

  // Show mobile version if on ops-console route or mobile device
  return isMobile || isOpsConsole ? (
    <OccupantUserMobileList />
  ) : (
    <OccupantUserMasterDashboard />
  );
};
