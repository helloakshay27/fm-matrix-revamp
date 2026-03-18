import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BackendSidebar } from "./BackendSidebar";
import { Header } from "./Header";
import { useLayout } from "../contexts/LayoutContext";

export const BackendLayout: React.FC = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <Header />

      {/* Sidebar */}
      <BackendSidebar />

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
