import { useState, useEffect } from "react";
import { OccupantUserMasterDashboard } from "@/pages/master/OccupantUserMasterDashboard";
import { OccupantUserMobileList } from "@/components/mobile/OccupantUserMobileList";

export const OccupantUserListWrapper = () => {
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

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Render mobile version for mobile devices, desktop for others
  return isMobile ? (
    <OccupantUserMasterDashboard />
  ) : (
    <OccupantUserMasterDashboard />
  );
};
