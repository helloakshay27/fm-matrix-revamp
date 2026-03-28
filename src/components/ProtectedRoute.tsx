import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import {
  isAuthenticated,
  getToken,
  saveToken,
  saveUser,
  saveBaseUrl,
} from "@/utils/auth";
import { useToast } from "@/components/ui/use-toast";
import {
  getEmbeddedConfig,
  isEmbeddedMode,
  storeEmbeddedData,
  resolveBaseUrlByOrgId,
  hasEmbeddedSession,
} from "@/utils/embeddedMode";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// PWA routes that should redirect to login-page with fm_admin_login
const PWA_ROUTES = ["/ops-console/settings/account/user-list-otp"];

const isPWARoute = (pathname: string): boolean => {
  return PWA_ROUTES.some((route) => pathname.startsWith(route));
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuthentication = async () => {
      // First, check for embedded mode (org_id + access_token in URL)
      const embeddedConfig = getEmbeddedConfig();

      console.warn("ProtectedRoute Auth Check:", {
        isEmbedded: embeddedConfig.isEmbedded,
        hasOrgId: !!embeddedConfig.orgId,
        hasAccessToken: !!embeddedConfig.accessToken,
        hasUserId: !!embeddedConfig.userId,
        currentPath: location.pathname,
      });

      // Handle embedded mode (e.g., /vas/tasks?embedded=true&org_id=13&access_token=xxx)
      if (embeddedConfig.orgId && embeddedConfig.accessToken) {
        console.warn(
          "🔌 ProtectedRoute: Embedded mode detected, initializing..."
        );

        // Store embedded data
        storeEmbeddedData(embeddedConfig);

        // Save token using auth utility
        saveToken(embeddedConfig.accessToken);

        // Resolve and save base URL based on org_id
        try {
          const resolvedBaseUrl = await resolveBaseUrlByOrgId(
            embeddedConfig.orgId
          );
          saveBaseUrl(resolvedBaseUrl);
          console.warn(
            "✅ ProtectedRoute: Base URL resolved for embedded mode:",
            resolvedBaseUrl
          );
        } catch (error) {
          console.error(
            "❌ ProtectedRoute: Failed to resolve base URL:",
            error
          );
        }

        // Store user data if available
        if (embeddedConfig.userId) {
          localStorage.setItem("user_id", embeddedConfig.userId);

          // Create a user object for embedded access
          const embeddedUser = {
            id: parseInt(embeddedConfig.userId),
            email: "",
            firstname: "Embedded",
            lastname: "User",
            access_token: embeddedConfig.accessToken,
            user_type: "embedded_user",
          };
          saveUser(embeddedUser);
          console.warn("✅ ProtectedRoute: Embedded user created and stored");
        }

        // Embedded mode is authorized
        setIsAuthorized(true);
        return;
      }

      // Check for existing embedded session
      if (hasEmbeddedSession()) {
        console.warn("🔌 ProtectedRoute: Existing embedded session found");
        setIsAuthorized(true);
        return;
      }

      // Legacy: Check for token in URL parameters (VI integration)
      const urlParams = new URLSearchParams(location.search);
      const access_token = urlParams.get("access_token");
      const company_id = urlParams.get("company_id");
      const user_id = urlParams.get("user_id");

      // If token is in URL (legacy VI flow), store it first
      if (access_token && !embeddedConfig.orgId) {
        console.warn(
          "ProtectedRoute: Storing token from URL parameters (legacy VI flow)"
        );

        // Save token using auth utility
        saveToken(access_token);

        // Save base URL for API calls
        const hostname = window.location.hostname;
        if (hostname.includes("vi-web.gophygital.work")) {
          saveBaseUrl("https://live-api.gophygital.work/");
        } else if (hostname.includes("localhost")) {
          saveBaseUrl("https://live-api.gophygital.work/");
        }

        // Store company and user data
        if (company_id) {
          localStorage.setItem("selectedCompanyId", String(company_id));
        }

        if (user_id) {
          localStorage.setItem("user_id", String(user_id));

          // Create a user object for VI token access
          const viUser = {
            id: parseInt(user_id),
            email: "",
            firstname: "VI",
            lastname: "User",
            access_token: access_token,
            user_type: "vi_token_user",
          };
          saveUser(viUser);

          console.warn("ProtectedRoute: VI User created and stored");
        }

        // Token is valid, user is authorized
        setIsAuthorized(true);
        return;
      }

      // Check if user is already authenticated
      const authenticated = isAuthenticated();
      const token = getToken();

      if (!authenticated || !token) {
        console.warn(
          "ProtectedRoute: No authentication found, redirecting to login"
        );
        setIsAuthorized(false);
      } else {
        console.warn("ProtectedRoute: User is authenticated");
        setIsAuthorized(true);
      }
    };

    checkAuthentication();
  }, [location.pathname, location.search]);

  // Show loading or spinner while checking auth
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-[#C72030] border-r-[#C72030] border-b-gray-200 border-l-gray-200"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? (
    <>{children}</>
  ) : (
    <Navigate
      to={
        isPWARoute(location.pathname) ? "/login-page?fm_admin_login" : "/login"
      }
      state={{ from: location }}
      replace
    />
  );
};
