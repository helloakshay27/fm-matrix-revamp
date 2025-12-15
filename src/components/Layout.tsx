import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Sidebar } from "./Sidebar";
import { DynamicHeader } from "./DynamicHeader";
import { Header } from "./Header";
import { useLayout } from "../contexts/LayoutContext";
import { OmanSidebar } from "./OmanSidebar";
import { OmanDynamicHeader } from "./OmanDynamicHeader";
import ViSidebar from "./ViSidebar";
import ViDynamicHeader from "./ViDynamicHeader";
import { StaticDynamicHeader } from "./StaticDynamicHeader";
import { StacticSidebar } from "./StacticSidebar";
import ViSidebarWithToken from "./ViSidebarWithToken";
import { ZxSidebar } from "./ZxSidebar";
import { ZxDynamicHeader } from "./ZxDynamicHeader";
import { saveToken, saveUser, saveBaseUrl, getUser } from "../utils/auth";
import { ProtectionLayer } from "./ProtectionLayer";
import { PrimeSupportSidebar } from "./PrimeSupportSidebar";
import { PrimeSupportDynamicHeader } from "./PrimeSupportDynamicHeader";
import { EmployeeSidebar } from "./EmployeeSidebar";
import { EmployeeDynamicHeader } from "./EmployeeDynamicHeader";
import { EmployeeHeader } from "./EmployeeHeader";
import { ViewSelectionModal } from "./ViewSelectionModal";

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    isSidebarCollapsed,
    getLayoutByCompanyId,
    currentSection,
    setCurrentSection,
  } = useLayout();
  const { selectedCompany } = useSelector((state: RootState) => state.project);
  const { selectedSite } = useSelector((state: RootState) => state.site);
  const location = useLocation();

  /**
   * EMPLOYEE VIEW DETECTION
   *
   * Determine if user is in Employee View based on:
   * 1. Route pattern: /employee/* routes trigger employee layout
   * 2. localStorage fallback: userType === "pms_occupant"
   *
   * Employee routes: /employee/portal, /vas/projects, etc.
   * Admin routes: /admin/*, / (root), and all other routes
   */
  const isEmployeeRoute = location.pathname.startsWith("/employee");
  const userType = localStorage.getItem("userType");
  const isEmployeeUser = isEmployeeRoute || userType === "pms_occupant";

  // Check if user needs to select a view (Admin or Employee)
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    // Check if user has already selected a view
    const selectedView = localStorage.getItem("selectedView");
    const storedUserType = localStorage.getItem("userType");

    // If no view is selected, show the view selection modal
    if (!selectedView || !storedUserType) {
      setShowViewModal(true);
    } else {
      setShowViewModal(false);
    }
  }, []);

  // Check if non-employee user needs to select project/site
  const hostname = window.location.hostname;
  const isViSite =
    hostname.includes("vi-web.gophygital.work") ||
    hostname.includes("localhost:5174");

  // Removed project selection modal logic - now handled by view selection

  // Handle token-based authentication from URL parameters
  // Get current domain for backward compatibility
  const isOmanSite = hostname.includes("oig.gophygital.work");

  const isLockatedSite =
    hostname.includes("lockated.gophygital.work") ||
    hostname.includes("localhost:5174");

  // Get layout configuration based on company ID
  const layoutConfig = getLayoutByCompanyId(
    selectedCompany?.id === 295 || selectedCompany?.id === 199
      ? selectedCompany.id
      : null
  );

  const isLocalhost =
    hostname.includes("lockated.gophygital.work");

  // Layout behavior:
  // - Company ID 189 (Lockated HO): Default layout (Sidebar + DynamicHeader)
  // - Company ID 199 (Customer Support): Default layout (Sidebar + DynamicHeader)
  // - Other companies (193, 204): Static layout (Sidebar + StaticDynamicHeader)
  // - No company selected: Static layout (fallback)

  // Render sidebar component based on configuration
  const renderSidebar = () => {
    // Check if user is employee (pms_occupant) - Employee layout takes priority
    // Only show sidebar for "Project Task" module, hide for other modules
    if (isEmployeeUser && isLocalhost) {
      // Only render sidebar for Project Task module
      if (currentSection === "Project Task") {
        return <EmployeeSidebar />;
      }
      // For other modules (Ticket, MOM, Visitors), don't render sidebar
      return null;
    }

    // Check for token-based VI access first
    const urlParams = new URLSearchParams(window.location.search);
    const hasTokenParam = urlParams.has("access_token");
    const storedToken = localStorage.getItem("token");
    const hasToken = hasTokenParam || storedToken;

    // Domain-based logic takes precedence for backward compatibility
    if (isOmanSite) {
      return <OmanSidebar />;
    }

    // Check for VI site with token parameter or stored token
    if (isViSite && hasToken) {
      return <ViSidebarWithToken />;
    }

    if (isViSite) {
      return <ViSidebar />;
    }

    // Company-specific logic (Admin layout)
    if (selectedCompany?.id === 189) {
      return <ZxSidebar />;
    }

    if (selectedCompany?.id === 304) {
      return <PrimeSupportSidebar />;
    }

    if (
      selectedCompany?.id === 300 ||
      selectedCompany?.id === 295 ||
      selectedCompany?.id === 298 ||
      selectedCompany?.id === 199 ||
      selectedCompany?.id === 298
    ) {
      return <Sidebar />;
    }

    // Use company ID-based layout
    switch (layoutConfig.sidebarComponent) {
      case "oman":
        return <OmanSidebar />;
      case "vi":
        return <ViSidebar />;
      case "static":
        return <StacticSidebar />;
      case "default":
      default:
        return <Sidebar />;
    }
  };

  // Render header component based on configuration
  const renderDynamicHeader = () => {
    // Check if user is employee (pms_occupant) - Employee layout takes priority
    // Employees don't need dynamic header, they use EmployeeHeader instead
    if (isEmployeeUser && isLocalhost) {
      return null; // No dynamic header for employees
    }

    // Domain-based logic takes precedence for backward compatibility
    if (isOmanSite) {
      return <OmanDynamicHeader />;
    }
    if (isViSite) {
      return <ViDynamicHeader />;
    }

    // Company-specific logic (Admin layout)
    if (selectedCompany?.id === 189) {
      return <ZxDynamicHeader />;
    }
    if (selectedCompany?.id === 304) {
      return <PrimeSupportDynamicHeader />;
    }
    if (
      selectedCompany?.id === 300 ||
      selectedCompany?.id === 295 ||
      selectedCompany?.id === 298 ||
      selectedCompany?.id === 199 ||
      selectedCompany?.id === 298
    ) {
      return <DynamicHeader />;
    }

    // Use company ID-based layout
    switch (layoutConfig.headerComponent) {
      case "oman":
        return <OmanDynamicHeader />;
      case "vi":
        return <ViDynamicHeader />;
      case "static":
        return <StaticDynamicHeader />;
      case "default":
      default:
        return <DynamicHeader />;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const access_token = urlParams.get("access_token");
    const company_id = urlParams.get("company_id");
    const user_id = urlParams.get("user_id");

    console.log("Layout Token Check:", {
      access_token: access_token ? "Present" : "Missing",
      company_id,
      user_id,
      currentPath: location.pathname,
    });

    // If token is present in URL, store it immediately for authentication
    if (access_token) {
      console.log("Storing token from URL parameters");

      // Save token using auth utility
      saveToken(access_token);

      // Save base URL for API calls (detect from current hostname)
      const hostname = window.location.hostname;
      if (hostname.includes("vi-web.gophygital.work")) {
        saveBaseUrl("live-api.gophygital.work/");
      } else if (hostname.includes("localhost")) {
        saveBaseUrl("live-api.gophygital.work/"); // Default for local development
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
          email: "", // VI access might not have email
          firstname: "VI",
          lastname: "User",
          access_token: access_token,
          user_type: "vi_token_user",
        };
        saveUser(viUser);

        console.log("VI User created and stored:", viUser);
      }
    }
  }, [location.search]);

  return (
    <div
      className="min-h-screen bg-[#fafafa]"
      style={{ backgroundColor: layoutConfig.theme?.backgroundColor }}
    >
      {/* Content protection for specified domains */}
      <ProtectionLayer
        enabled={true}
        allowedDomains={["vi-web.gophygital.work"]}
      />

      {/* View Selection Modal - Choose Admin or Employee View */}

      <ViewSelectionModal
        isOpen={!isEmployeeUser && isLocalhost ? showViewModal : false}
        onComplete={() => setShowViewModal(false)}
      />

      {/* Conditional Header - Use EmployeeHeader for employee users */}
      {isEmployeeUser && isLocalhost ? <EmployeeHeader /> : <Header />}

      {renderSidebar()}
      {renderDynamicHeader()}

      <main
        className={`${
          // For employee users, only add left margin if on Project Task module
          isEmployeeUser && isLocalhost
            ? currentSection === "Project Task"
              ? isSidebarCollapsed
                ? "ml-16"
                : "ml-64"
              : "ml-0" // No margin for other modules
            : isSidebarCollapsed
              ? "ml-16"
              : "ml-64"
          } ${isEmployeeUser ? "pt-16" : "pt-28"} transition-all duration-300`}
      >
        <Outlet />
      </main>
    </div>
  );
};
