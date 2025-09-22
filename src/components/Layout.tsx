import React, { useEffect } from "react";
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
import { saveToken, saveUser, saveBaseUrl } from "../utils/auth";

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSidebarCollapsed, getLayoutByCompanyId } = useLayout();
  const { selectedCompany } = useSelector((state: RootState) => state.project);
  const location = useLocation();

  // Handle token-based authentication from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const access_token = urlParams.get("access_token");
    const company_id = urlParams.get("company_id");
    const user_id = urlParams.get("user_id");

    console.log('Layout Token Check:', { 
      access_token: access_token ? 'Present' : 'Missing', 
      company_id, 
      user_id,
      currentPath: location.pathname 
    });

    // If token is present in URL, store it immediately for authentication
    if (access_token) {
      console.log('Storing token from URL parameters');
      
      // Save token using auth utility
      saveToken(access_token);
      
      // Save base URL for API calls (detect from current hostname)
      const hostname = window.location.hostname;
      if (hostname.includes("vi-web.gophygital.work")) {
        saveBaseUrl("https://live-api.gophygital.work/");
      } else if (hostname.includes("localhost")) {
        saveBaseUrl("https://live-api.gophygital.work/"); // Default for local development
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
          email: '', // VI access might not have email
          firstname: 'VI',
          lastname: 'User',
          access_token: access_token,
          user_type: 'vi_token_user'
        };
        saveUser(viUser);
        
        console.log('VI User created and stored:', viUser);
      }
    }
  }, [location.search]);

  // Get current domain for backward compatibility
  const hostname = window.location.hostname;
  const isOmanSite = hostname.includes("oig.gophygital.work");
  const isViSite = hostname.includes("vi-web.gophygital.work") || hostname.includes("localhost:5174");

  // Get layout configuration based on company ID
  const layoutConfig = getLayoutByCompanyId(
    selectedCompany?.id === 199 ? selectedCompany.id : null
  );

  // Layout behavior:
  // - Company ID 111 (Lockated HO): Default layout (Sidebar + DynamicHeader)
  // - Company ID 199 (Customer Support): Default layout (Sidebar + DynamicHeader)
  // - Other companies (193, 204): Static layout (Sidebar + StaticDynamicHeader)
  // - No company selected: Static layout (fallback)

  // Render sidebar component based on configuration
  const renderSidebar = () => {
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
    // Domain-based logic takes precedence for backward compatibility
    if (isOmanSite) {
      return <OmanDynamicHeader />;
    }
    if (isViSite) {
      return <ViDynamicHeader />;
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

  return (
    <div
      className="min-h-screen bg-[#fafafa]"
      style={{ backgroundColor: layoutConfig.theme?.backgroundColor }}
    >
      <Header />
      {renderSidebar()}
      {renderDynamicHeader()}

      <main
        className={`${
          isSidebarCollapsed ? "ml-16" : "ml-64"
        } pt-28 transition-all duration-300`}
      >
        <Outlet />
      </main>
    </div>
  );
};
