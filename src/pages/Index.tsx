import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/contexts/PermissionsContext";
import { findFirstAccessibleRoute } from "@/utils/dynamicNavigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Index = () => {
  const navigate = useNavigate();
  const { userRole, loading } = usePermissions();
  const { selectedCompany } = useSelector((state: RootState) => state.project);

  useEffect(() => {
    // Wait for permissions to load
    if (loading) return;

    const hostname = window.location.hostname;
    const isViSite = hostname.includes("vi-web.gophygital.work");
    const userType = localStorage.getItem("userType");
    const isLocalhost =
      hostname.includes("localhost") ||
      hostname.includes("lockated.gophygital.work") ||
      hostname.includes("fm-matrix.lockated.com");
    const isPulseSite =
      hostname.includes("pulse.lockated.com") ||
      hostname.includes("pulse.gophygital.work");

    // PRIORITY 1: Dynamic route from userRole permissions (highest priority)
    if (userRole) {
      const firstRoute = findFirstAccessibleRoute(userRole);

      if (firstRoute) {
        navigate(firstRoute, { replace: true });
        return;
      }
    }

    // PRIORITY 2: Localhost with userType-based routing
    if (userType && isLocalhost) {
      // Navigate based on userType
      if (userType === "pms_organization_admin") {
        navigate("/admin/dashboard", { replace: true });
        return;
      } else if (userType === "pms_occupant") {
        navigate("/vas/projects", { replace: true });
        return;
      }
    }

    // PRIORITY 3: Company ID-based routing for specific companies
    if (
      selectedCompany?.id === 300 ||
      selectedCompany?.id === 295 ||
      selectedCompany?.id === 298 ||
      selectedCompany?.id === 199
    ) {
      // For these companies, use dynamic routing from permissions
      if (userRole) {
        const firstRoute = findFirstAccessibleRoute(userRole);
        if (firstRoute) {
          navigate(firstRoute, { replace: true });
          return;
        }
      }
      // Fallback to default admin route for these companies
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    // PRIORITY 4: Domain-specific fallback routing
    if (isViSite) {
      navigate("/safety/m-safe/internal", { replace: true });
    } else if (isPulseSite) {
      navigate("/maintenance/ticket", { replace: true });
    } else {
      navigate("/maintenance/asset", { replace: true });
    }
  }, [navigate, userRole, loading, selectedCompany]);

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
