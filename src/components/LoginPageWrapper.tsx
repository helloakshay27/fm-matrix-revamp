import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { LoginPage } from "@/pages/LoginPage";
import { registerServiceWorker, isPWARoute } from "@/utils/pwa";

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

    // Register service worker only for PWA routes (login with fm_admin_login param)
    if (isPWARoute(location.pathname, location.search)) {
      registerServiceWorker();
    }

    return () => window.removeEventListener("resize", checkMobile);
  }, [location.pathname, location.search]);

  // Apply mobile styling for PWA routes or mobile devices
  const isPWA = isPWARoute(location.pathname, location.search);
  if (isMobile || isPWA) {
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
