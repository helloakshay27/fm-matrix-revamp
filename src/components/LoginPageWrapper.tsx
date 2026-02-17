import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { registerServiceWorker } from "@/utils/pwa";

interface LoginPageWrapperProps {
  setBaseUrl: (url: string) => void;
  setToken: (token: string) => void;
}

export const LoginPageWrapper: React.FC<LoginPageWrapperProps> = ({
  setBaseUrl,
  setToken,
}) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  // Check if URL has fm_admin_login query parameter
  const isFMAdminLogin =
    location.search.includes("fm_admin_login") ||
    location.pathname.includes("login-page");

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

    // Register service worker only for FM admin login
    if (isFMAdminLogin) {
      registerServiceWorker();
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [isFMAdminLogin]);

  // Apply mobile styling for FM admin login or mobile devices
  if (isMobile || isFMAdminLogin) {
    return (
      <div className="mobile-login-wrapper min-h-screen bg-gray-50">
        <div className="w-full max-w-full">
          <LoginPage setBaseUrl={setBaseUrl} setToken={setToken} />
        </div>
      </div>
    );
  }

  return <LoginPage setBaseUrl={setBaseUrl} setToken={setToken} />;
};
