import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/contexts/PermissionsContext";
import { findFirstAccessibleRoute } from "@/utils/dynamicNavigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ViewSelectionModal } from "@/components/ViewSelectionModal";
import { getUser } from "@/utils/auth";

const Index = () => {
  const navigate = useNavigate();
  const { userRole, loading } = usePermissions();
  const { selectedCompany } = useSelector((state: RootState) => state.project);
  const [showViewModal, setShowViewModal] = useState(false);
  const [isViewCheckComplete, setIsViewCheckComplete] = useState(false);

  // Helper function to get first available employee link
  const getFirstEmployeeLink = useCallback((): string => {
    if (!userRole || !userRole.lock_modules) {
      return "/vas/projects"; // Fallback
    }

    // Find first module from Employee modules (Employee Sidebar or Employee Projects Sidebar)
    for (const module of userRole.lock_modules) {
      // Only look for Employee-specific modules
      if (
        module.module_name === "Employee Sidebar" ||
        module.module_name === "Employee Projects Sidebar"
      ) {
        // Find first active function with a react_link
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstActiveFunction = (module.lock_functions as any[]).find(
          (func) =>
            func.function_active === 1 &&
            func.react_link &&
            !func.parent_function
        );

        if (firstActiveFunction && firstActiveFunction.react_link) {
          return firstActiveFunction.react_link;
        }
      }
    }

    return "/vas/projects"; // Fallback to projects
  }, [userRole]);

  // Helper function to get first available admin link
  const getFirstAdminLink = useCallback((): string => {
    if (!userRole || !userRole.lock_modules) {
      return "/maintenance/asset"; // Fallback to asset management
    }

    // Find first module with active functions (excluding Employee modules)
    for (const module of userRole.lock_modules) {
      // Skip Employee Sidebar and Employee Projects Sidebar modules
      if (
        module.module_name === "Employee Sidebar" ||
        module.module_name === "Employee Projects Sidebar"
      ) {
        continue;
      }

      // Find first active function with a react_link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const firstActiveFunction = (module.lock_functions as any[]).find(
        (func) =>
          func.function_active === 1 && func.react_link && !func.parent_function
      );

      if (firstActiveFunction && firstActiveFunction.react_link) {
        return firstActiveFunction.react_link;
      }
    }

    return "/maintenance/asset"; // Fallback to asset management
  }, [userRole]);

  // First check if view selection is needed
  useEffect(() => {
    const hostname = window.location.hostname;
    const isLocalhost =
      hostname.includes("lockated.gophygital.work") ||
      hostname.includes("fm-matrix.lockated.com");

    // Only check for view selection on localhost
    if (!isLocalhost) {
      setIsViewCheckComplete(true);
      return;
    }

    const selectedView = localStorage.getItem("selectedView");
    const storedUserType = localStorage.getItem("userType");

    // If user is already pms_occupant (employee), skip view selection modal
    if (storedUserType === "pms_occupant") {
      setIsViewCheckComplete(true);
      return;
    }

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
    const isViSite = hostname === "vi-web.gophygital.work";
    const isWebSite =
      hostname === "web.gophygital.work" || hostname.includes("localhost");
    const userType = localStorage.getItem("userType");
    const currentUser = getUser();
    const userEmail = currentUser?.email || "No email";
    const isLocalhost =
      hostname.includes("lockated.gophygital.work") ||
      hostname.includes("fm-matrix.lockated.com") ||
      userEmail === "deveshjain928@gmail.com" ||
      userEmail === "abdul.ghaffar@lockated.com" ||
      userEmail === "mailroom2@zs.com" ||
      userEmail === "abdul.g@gophygital.work";

    const isPulseSite =
      hostname.includes("pulse.lockated.com") ||
      hostname.includes("pulse.panchshil.com") ||
      hostname.includes("pulse.gophygital.work") ||
      hostname.includes("pulse-uat.panchshil.com");
    const isClubSite = hostname.includes("club.lockated.com");

    // PRIORITY 1: Localhost with userType-based routing (highest priority for localhost)
    if (userType && isLocalhost) {
      // Navigate based on userType using dynamic links
      if (userType === "pms_organization_admin") {
        const adminLink = getFirstAdminLink();
        navigate(adminLink, { replace: true });
        return;
      } else if (userType === "pms_occupant") {
        const employeeLink = getFirstEmployeeLink();
        navigate(employeeLink, { replace: true });
        return;
      }
    }

    // PRIORITY 2: Dynamic route from userRole permissions
    if (userRole) {
      const firstRoute = findFirstAccessibleRoute(userRole);

      if (firstRoute) {
        navigate(firstRoute, { replace: true });
        return;
      }
    }

    // PRIORITY 3: Company ID-based routing for specific companies and domains
    if (
      selectedCompany?.id === 300 ||
      selectedCompany?.id === 295 ||
      selectedCompany?.id === 298 ||
      selectedCompany?.id === 199 ||
      isPulseSite ||
      (isWebSite && userEmail === "deveshjain928@gmail.com") ||
      userEmail === "abdul.ghaffar@lockated.com" ||
      userEmail === "mailroom2@zs.com" ||
      userEmail === "abdul.g@gophygital.work"
    ) {
      // For these companies and domains, use dynamic routing from permissions
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
    } else {
      navigate("/maintenance/asset", { replace: true });
    }
  }, [
    navigate,
    userRole,
    loading,
    selectedCompany,
    isViewCheckComplete,
    getFirstAdminLink,
    getFirstEmployeeLink,
  ]);

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
