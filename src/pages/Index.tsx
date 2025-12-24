import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePermissions } from "@/contexts/PermissionsContext";
import { findFirstAccessibleRoute } from "@/utils/dynamicNavigation";

const Index = () => {
  const navigate = useNavigate();
  const { userRole, loading } = usePermissions();

  useEffect(() => {
    // Wait for permissions to load
    if (loading) return;

    if (userRole) {
      const firstRoute = findFirstAccessibleRoute(userRole);

      if (firstRoute) {
        navigate(firstRoute, { replace: true });
        return;
      }
    }

    // Fallback logic if no specific route found or no user role
    const hostname = window.location.hostname;
    const isViSite = hostname.includes('vi-web.gophygital.work');
    const userType = localStorage.getItem("userType");
    const isLocalhost = hostname.includes('localhost') || hostname.includes('lockated.gophygital.work');

    if (userType && isLocalhost) {
      // Navigate based on userType
      if (userType === "pms_organization_admin") {
        navigate("/admin/dashboard", { replace: true });
      } else if (userType === "pms_occupant") {
        navigate("/vas/projects", { replace: true });
      }
    }

    if (isViSite) {
      navigate('/safety/m-safe/internal', { replace: true });
    } else {
      navigate('/maintenance/asset', { replace: true });
    }
  }, [navigate, userRole, loading]);

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
