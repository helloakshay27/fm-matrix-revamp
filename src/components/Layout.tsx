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
import { isEmbeddedMode } from "../utils/embeddedMode";
import { ProtectionLayer } from "./ProtectionLayer";
import { PrimeSupportSidebar } from "./PrimeSupportSidebar";
import { PrimeSupportDynamicHeader } from "./PrimeSupportDynamicHeader";
import { EmployeeSidebar } from "./EmployeeSidebar";
import { EmployeeSidebarStatic } from "./EmployeeSidebarStatic";
import { BusinessCompassSidebar } from "./BusinessCompassSidebar";
import { EmployeeDynamicHeader } from "./EmployeeDynamicHeader";
import { EmployeeHeader } from "./EmployeeHeader";
import { EmployeeHeaderStatic } from "./EmployeeHeaderStatic";
import { ViewSelectionModal } from "./ViewSelectionModal";
import { PulseSidebar } from "./PulseSidebar";
import { PulseDynamicHeader } from "./PulseDynamicHeader";
import { ZycusSidebar } from "./ZycusSidebar";
import { ZycusDynamicHeader } from "./ZycusDynamicHeader";
import { ActionSidebar } from "./ActionSidebar";
import { ActionHeader } from "./ActionHeader";
import { useActionLayout } from "../contexts/ActionLayoutContext";
import { ClubSidebar } from "./ClubSidebar";
import ClubDynamicHeader from "./ClubDynamicHeader";
import { AdminCompassSidebar } from "./AdminCompassSidebar";
import { ZycusDynamicHeaderCopy } from "./ZycusDynamicHeaderCopy";
import { ZycusSidebarCopy } from "./ZycusSidebarCopy";
import TopNavigation from "./CompanyHub/TopNavigation";

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    isSidebarCollapsed,
    getLayoutByCompanyId,
    currentSection,
    setCurrentSection,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
  } = useLayout();
  const { isActionSidebarVisible } = useActionLayout();
  const { selectedCompany } = useSelector((state: RootState) => state.project);
  const { selectedSite } = useSelector((state: RootState) => state.site);
  const location = useLocation();
  const currentUser = getUser();
  const userEmail = currentUser?.email || "No email";
  const org_id = localStorage.getItem("org_id");
  const hostname = window.location.hostname;

  // Detect Club Management routes
  const isClubManagementRoute =
    hostname === "club.lockated.com" ||
    hostname === "recess-club.panchshil.com" ||
    location.pathname.startsWith("/club-management");

  // Detect embedded mode - hide sidebar and header when embedded
  const isEmbedded = isEmbeddedMode();

  /**
   * EMPLOYEE VIEW DETECTION
   *
   * Determine if user is in Employee View based on:
   * 1. localStorage: userType === "pms_occupant" (primary check)
   * 2. Route pattern: /employee/* routes (fallback)
   *
   * Employee routes: /employee/portal, /vas/projects (when userType is pms_occupant)
   * Admin routes: /admin/*, / (root), and all other routes
   */
  const userType = localStorage.getItem("userType");
  const isEmployeeUser = userType === "pms_occupant";

  // Check if non-employee user needs to select project/site
  const isViSite = hostname.includes("vi-web.gophygital.work");

  // Removed project selection modal logic - now handled by view selection

  // Handle token-based authentication from URL parameters
  // Get current domain for backward compatibility
  const isOmanSite = hostname.includes("oig.gophygital.work");

  const isFMSite =
    hostname === "fm-matrix.lockated.com" ||
    hostname === "web.gophygital.work" ||
    hostname === "lockated.gophygital.work";

  const isLockatedSite =
    hostname.includes("lockated.gophygital.work") ||
    hostname.includes("localhost:5174");

  // Get layout configuration based on company ID
  const layoutConfig = getLayoutByCompanyId(
    selectedCompany?.id === 295 || selectedCompany?.id === 199
      ? selectedCompany.id
      : null
  );

  // Detect Pulse site - used for fallback when no API role exists
  const isPulseSite =
    hostname.includes("pulse.lockated.com") ||
    hostname.includes("pulse.gophygital.work") ||
    hostname.includes("pulse-uat.panchshil.com") ||
    hostname.includes("pulse.panchshil.com") ||
    location.pathname.startsWith("/pulse");
  const isLocalhost =
    hostname.includes("localhost") ||
    hostname.includes("lockated.gophygital.work") ||
    hostname.includes("fm-matrix.lockated.com") ||
    userEmail === "ubaid.hashmat@lockated.com" ||
    userEmail === "besis69240@azeriom.com" ||
    userEmail === "megipow156@aixind.com" ||
    userEmail === "jevosak839@cimario.com";

  // Layout behavior:
  // - Company ID 189 (Lockated HO): Default layout (Sidebar + DynamicHeader)
  // - Company ID 199 (Customer Support): Default layout (Sidebar + DynamicHeader)
  // - Other companies (193, 204): Static layout (Sidebar + StaticDynamicHeader)
  // - No company selected: Static layout (fallback)
  // - Club Management routes: Separate Club Management layout

  // Render sidebar component based on configuration
  const renderSidebar = () => {
    // Hide sidebar in embedded mode
    if (isEmbedded) {
      console.warn("🔌 Embedded mode - hiding sidebar");
      return null;
    }

    console.warn("🔧 Layout renderSidebar - checking conditions:", {
      isClubManagementRoute,
      isEmployeeUser,
      isLocalhost,
      selectedCompanyId: selectedCompany?.id,
      userEmail,
      isViSite,
      isOmanSite,
    });

    if (isViSite) {
      console.warn("✅ Rendering ViSidebar");
      return <ViSidebar />;
    }

    // Check if user is in Club Management route - render ClubSidebar
    if (isClubManagementRoute) {
      console.warn("✅ Rendering ClubSidebar");
      return <ClubSidebar />;
    }

    if (
      location.pathname.startsWith("/admin-compass") ||
      currentSection === "Admin Compass"
    ) {
      return <AdminCompassSidebar />;
    }

    if (
      currentSection === "Business Compass" ||
      location.pathname.startsWith("/business-compass")
    ) {
      return <BusinessCompassSidebar />;
    }

    // Check if user is employee (pms_occupant) - Employee layout takes priority
    // IMPORTANT: Only show employee sidebar if userType is explicitly pms_occupant
    // This prevents employee sidebar from showing in admin view on /vas/projects
    if (isEmployeeUser && isLocalhost && userType === "pms_occupant") {
      // Only render sidebar for Project Task or Business Compass module
      if (currentSection === "Project Task") {
        // Use EmployeeSidebar for specific companies, otherwise EmployeeSidebarStatic
        if (
          selectedCompany?.id === 300 ||
          selectedCompany?.id === 295 ||
          selectedCompany?.id === 298 ||
          selectedCompany?.id === 199 ||
          org_id === "90" ||
          org_id === "1" ||
          org_id === "84" ||
          org_id === "1" ||
          userEmail === "ubaid.hashmat@lockated.com" ||
          userEmail === "besis69240@azeriom.com" ||
          userEmail === "megipow156@aixind.com" ||
          userEmail === "jevosak839@cimario.com" ||
          userEmail === "deveshjain928@gmail.com" ||
          userEmail === "abdul.ghaffar@lockated.com" ||
          userEmail === "mailroom2@zs.com" ||
          userEmail === "abdul.g@gophygital.work"
        ) {
          return <EmployeeSidebar />;
        }
        return <EmployeeSidebarStatic />;
      }

      // For other modules (Ticket, MOM, Visitors), don't render sidebar
      return null;
    }

    // Check for token-based VI access first
    const urlParams = new URLSearchParams(window.location.search);
    const hasTokenParam = urlParams.has("access_token");
    const storedToken = localStorage.getItem("token");
    const hasToken = hasTokenParam || storedToken;

    if (
      selectedCompany?.id === 300 ||
      selectedCompany?.id === 295 ||
      selectedCompany?.id === 298 ||
      selectedCompany?.id === 199 ||
      selectedCompany?.id === 307 ||
      org_id === "90" ||
      org_id === "1" ||
      org_id === "84" ||
      org_id === "1" ||
      userEmail === "ubaid.hashmat@lockated.com" ||
      userEmail === "besis69240@azeriom.com" ||
      userEmail === "megipow156@aixind.com" ||
      userEmail === "jevosak839@cimario.com" ||
      userEmail === "deveshjain928@gmail.com" ||
      userEmail === "abdul.ghaffar@lockated.com" ||
      userEmail === "mailroom2@zs.com" ||
      userEmail === "tested4@gmail.com" ||
      userEmail === "tested3@gmail.com" ||
      userEmail === "testtwo@gmail.com" ||
      // userEmail === "ps1@gophygital.work" ||
      userEmail === "ps@gophygital.work" ||
      userEmail === "abdul.g@gophygital.work"
    ) {
      console.log("✅ Rendering ActionSidebar (company-specific)");
      return <ActionSidebar />;
    }

    if (selectedCompany?.id === 189) {
      return <ZxSidebar />;
    }

    // Domain-based logic takes precedence for backward compatibility
    if (isOmanSite) {
      console.log("✅ Rendering OmanSidebar");
      return <OmanSidebar />;
    }

    // Check for VI site with token parameter or stored token
    if (isViSite && hasToken) {
      console.log("✅ Rendering ViSidebarWithToken");
      return <ViSidebarWithToken />;
    }

    // Company-specific logic (Admin layout)

    if (selectedCompany?.id === 294) {
      return <ZycusSidebar />;
    }

    if (org_id === "3") {
      return <ZycusSidebarCopy />;
    }

    if (selectedCompany?.id === 304) {
      return <PrimeSupportSidebar />;
    }

    // Pulse Privilege - Company ID 305 OR isPulseSite fallback
    if (selectedCompany?.id === 305 || isPulseSite) {
      return <PulseSidebar />;
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
        return <StacticSidebar />; // Changed from ActionSidebar to StacticSidebar as fallback
    }
  };

  // Render header component based on configuration
  const renderDynamicHeader = () => {
    // Hide dynamic header in embedded mode
    if (isEmbedded) {
      console.warn("🔌 Embedded mode - hiding dynamic header");
      return null;
    }

    if (isViSite) {
      return <ViDynamicHeader />;
    }
    // Check if user is in Club Management route - render StaticDynamicHeader
    if (isClubManagementRoute) {
      return <ClubDynamicHeader />;
    }

    // Check if user is employee (pms_occupant) - Employee layout takes priority
    // Employees don't need dynamic header, they use EmployeeHeader instead
    if (isEmployeeUser && isLocalhost) {
      return null; // No dynamic header for employees
    }

    // Company-specific logic (Admin layout)

    if (
      selectedCompany?.id === 300 ||
      selectedCompany?.id === 295 ||
      selectedCompany?.id === 298 ||
      selectedCompany?.id === 199 ||
      selectedCompany?.id === 307 ||
      org_id === "90" ||
      org_id === "1" ||
      org_id === "84" ||
      org_id === "1" ||
      userEmail === "ubaid.hashmat@lockated.com" ||
      userEmail === "besis69240@azeriom.com" ||
      userEmail === "megipow156@aixind.com" ||
      userEmail === "jevosak839@cimario.com" ||
      userEmail === "deveshjain928@gmail.com" ||
      userEmail === "abdul.ghaffar@lockated.com" ||
      userEmail === "mailroom2@zs.com" ||
      userEmail === "tested4@gmail.com" ||
      userEmail === "tested3@gmail.com" ||
      userEmail === "testtwo@gmail.com" ||
      // userEmail === "ps1@gophygital.work" ||
      userEmail === "ps@gophygital.work" ||
      userEmail === "abdul.g@gophygital.work"
    ) {
      return <ActionHeader />;
    }

    if (selectedCompany?.id === 189) {
      return <ZxDynamicHeader />;
    }
    if (org_id === "3") {
      return <ZycusDynamicHeaderCopy />;
    }

    if (isFMSite) {
      return <StaticDynamicHeader />;
    }

    // Domain-based logic takes precedence for backward compatibility
    if (isOmanSite) {
      return <OmanDynamicHeader />;
    }

    if (selectedCompany?.id === 294) {
      return <ZycusDynamicHeader />;
    }

    if (selectedCompany?.id === 304) {
      return <PrimeSupportDynamicHeader />;
    }

    // Pulse Privilege - Company ID 305 OR isPulseSite fallback
    if (selectedCompany?.id === 305 || isPulseSite) {
      return <PulseDynamicHeader />;
    }

    if (org_id === "3") {
      return <ZycusDynamicHeaderCopy />;
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
        return <StaticDynamicHeader />; // Changed from ActionHeader to StaticDynamicHeader as fallback
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

  // Close mobile sidebar on navigation
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname, setIsMobileSidebarOpen]);

  const [activeNavMenu, setActiveNavMenu] = useState<string | null>(null);
  const isNewEmpHubRoute = location.pathname === "/employee/company-hub-new";

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

      {/* Conditional Header - Hide in embedded mode, Use EmployeeHeader or EmployeeHeaderStatic for employee users */}
      {isEmbedded ? null : isEmployeeUser && isLocalhost ? (
        selectedCompany?.id === 300 ||
        selectedCompany?.id === 295 ||
        selectedCompany?.id === 298 ||
        selectedCompany?.id === 199 ||
        org_id === "90" ||
        org_id === "1" ||
        userEmail === "ubaid.hashmat@lockated.com" ||
        userEmail === "besis69240@azeriom.com" ||
        userEmail === "megipow156@aixind.com" ||
        userEmail === "jevosak839@cimario.com" ? (
          <EmployeeHeader />
        ) : (
          // isNewEmpHubRoute ? (
          //   <TopNavigation
          //     activeNavMenu={activeNavMenu}
          //     setActiveNavMenu={setActiveNavMenu}
          //   /> // 👈 your new header
          // ) : (
          // <EmployeeHeader />
          // )
          // <EmployeeHeaderStatic />
          <TopNavigation
            activeNavMenu={activeNavMenu}
            setActiveNavMenu={setActiveNavMenu}
          />
        )
      ) : (
        <Header />
      )}

      {/* Mobile overlay backdrop - closes sidebar when tapping outside */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {renderSidebar()}
      {renderDynamicHeader()}

      {/* Action-based navigation - only shown when action context is active */}

      <main
        className={`${
          // No margins in embedded mode
          isEmbedded
            ? "ml-0 pt-4"
            : // For employee users, only add left margin if on Project Task module
              isEmployeeUser && isLocalhost
              ? currentSection === "Project Task" ||
                currentSection === "Business Compass" ||
                currentSection === "Admin Compass" ||
                location.pathname.includes("/business-compass") ||
                location.pathname.includes("/admin-compass")
                ? isSidebarCollapsed
                  ? "ml-0 md:ml-16"
                  : "ml-0 md:ml-64"
                : "ml-0" // No margin for other modules
              : // For action sidebar, add extra top padding and adjust left margin
                isActionSidebarVisible
                ? "ml-0 md:ml-64 pt-28"
                : isSidebarCollapsed
                  ? "ml-0 md:ml-16"
                  : "ml-0 md:ml-64"
        } ${isEmbedded ? "" : isEmployeeUser && isLocalhost ? (!isNewEmpHubRoute ? "pt-16" : "pt-6") : isActionSidebarVisible ? "" : "pt-28"} transition-all duration-300`}
      >
        <Outlet />
      </main>
    </div>
  );
};
