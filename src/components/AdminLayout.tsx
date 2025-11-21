import React, { createContext, useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { Header } from "./Header";
import { DynamicHeader } from "./DynamicHeader";
import { useLayout } from "../contexts/LayoutContext";

// Create admin layout context to share sidebar state
interface AdminLayoutContextType {
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const AdminLayoutContext = createContext<AdminLayoutContextType | undefined>(undefined);

export const useAdminLayout = () => {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within AdminLayout");
  }
  return context;
};

export const AdminLayout: React.FC = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Get the current page title based on the route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/account")) return "Account Management";
    if (path.includes("/fm-users")) return "FM Users";
    if (path.includes("/role")) return "Roles";
    if (path.includes("/lock-module")) return "Lock Module";
    if (path.includes("/lock-function")) return "Lock Function";
    if (path.includes("/lock-sub-function")) return "Lock Sub Function";
    return "Admin Console";
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <Header />
      
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Dynamic Header */}
     

      {/* Main content */}
      <main
        className={`${
          isSidebarCollapsed ? "ml-10" : "ml-64"
        } pt-20 transition-all duration-300 min-h-screen`}
        style={{ backgroundColor: "#fafafa" }}
      >
        <div className="">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
