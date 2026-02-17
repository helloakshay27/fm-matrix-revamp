import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ViewOccupantUserPage } from "@/pages/master/ViewOccupantUserPage";
import { OccupantUserMobileDetail } from "@/components/mobile/OccupantUserMobileDetail";
import { registerServiceWorker } from "@/utils/pwa";

export const OccupantUserDetailWrapper = () => {
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

    // Register service worker only for ops-console routes
    if (isOpsConsole) {
      registerServiceWorker();
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [isOpsConsole]);

  // Show mobile version if on ops-console route or mobile device
  return isMobile || isOpsConsole ? (
    <OccupantUserMobileDetail />
  ) : (
    <ViewOccupantUserPage />
  );
};
