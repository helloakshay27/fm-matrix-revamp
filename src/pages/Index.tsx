import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/contexts/PermissionsContext";
import { findFirstAccessibleRoute } from "@/utils/dynamicNavigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ViewSelectionModal } from "@/components/ViewSelectionModal";

const Index = () => {
  const navigate = useNavigate();
  const { userRole, loading } = usePermissions();
  const { selectedCompany } = useSelector((state: RootState) => state.project);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isViewCheckComplete, setIsViewCheckComplete] = useState(false);

  // First check if view selection is needed
  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname.includes("localhost") ||
      hostname.includes("lockated.gophygital.work") ||
      hostname.includes("fm-matrix.lockated.com");

    // Only check for view selection on localhost
    if (!isLocalhost) {
      setIsViewCheckComplete(true);
      return;
    }

    const selectedView = localStorage.getItem("selectedView");
    const storedUserType = localStorage.getItem("userType");

    // If no view is selected, show the modal
    if (!selectedView || !storedUserType) {
      setShowViewModal(true);
    } else {
      setIsViewCheckComplete(true);
    }
  }, []);

  // Navigate to appropriate route after view selection is complete
  useEffect(() => {
    // Wait for permissions to load and view check to complete
    if (loading || !isViewCheckComplete) return;

    const hostname = window.location.hostname;
    const isViSite = hostname.includes("vi-web.gophygital.work");
    const userType = localStorage.getItem("userType");
    const isLocalhost =
      hostname.includes("localhost") ||
      hostname.includes("lockated.gophygital.work") ||
      hostname.includes("fm-matrix.lockated.com");

    const isPulseSite =
      hostname.includes("pulse.lockated.com") ||
      hostname.includes("localhost") ||
      hostname.includes("pulse.panchshil.com") ||
      hostname.includes("pulse.gophygital.work") ||
      hostname.includes("pulse-uat.panchshil.com");
    const isClubSite = hostname.includes("club.lockated.com");

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
        navigate("/maintenance/asset", { replace: true });
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
      selectedCompany?.id === 199 ||
      isPulseSite
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
      navigate("/maintenance/asset", { replace: true });
      return;
    }

    // PRIORITY 4: Domain-specific fallback routing
    if (isViSite) {
      navigate("/safety/m-safe/internal", { replace: true });
    } else if (isClubSite) {
      navigate("/club-management/membership", { replace: true });
    } else if (isPulseSite) {
      navigate("/maintenance/ticket", { replace: true });
    } else {
      navigate("/maintenance/asset", { replace: true });
    }
  }, [navigate, userRole, loading, selectedCompany, isViewCheckComplete]);

  const handleViewSelectionComplete = () => {
    setShowViewModal(false);
    setIsViewCheckComplete(true);
  };

  // Show view selection modal if needed
  if (showViewModal) {
    return (
      <ViewSelectionModal
        isOpen={showViewModal}
        onComplete={handleViewSelectionComplete}
      />
    );
  }

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
