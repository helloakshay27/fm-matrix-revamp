import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface MobileLayoutWrapperProps {
  children: React.ReactNode;
}

// Routes that should have mobile layout (no sidebar, no header)
const MOBILE_ONLY_ROUTES = [
  "/login-page",
  "/ops-console/settings/account/user-list-otp",
];

export const MobileLayoutWrapper: React.FC<MobileLayoutWrapperProps> = ({
  children,
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
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

  // Check if current route should have mobile-only layout
  const isMobileOnlyRoute = MOBILE_ONLY_ROUTES.some(
    (route) =>
      location.pathname.includes(route) ||
      location.search.includes("fm_admin_login")
  );

  // If it's a mobile-only route or mobile device, apply mobile layout
  if (isMobileOnlyRoute || isMobile) {
    return (
      <div className="mobile-layout-wrapper min-h-screen bg-gray-50">
        <div className="w-full max-w-full">{children}</div>
      </div>
    );
  }

  return <>{children}</>;
};
