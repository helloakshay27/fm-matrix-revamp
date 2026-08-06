import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  PackageCheck,
  Briefcase,
  FileText,
  User,
  Receipt,
  FileCheck2,
  LayoutDashboard,
} from "lucide-react";

interface VendorNavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const NAV_ITEMS: VendorNavItem[] = [
  { label: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  { label: "My Profile", href: `/vendor/supplier-details/${localStorage.getItem('vendor_id') || '46204'}`, icon: User },
  { label: "My PO", href: "/vendor/po", icon: ShoppingCart },
  { label: "My GRN", href: "/vendor/grn", icon: PackageCheck },
  { label: "My WO", href: "/vendor/wo", icon: Briefcase },
  { label: "My WO Invoice", href: "/vendor/invoice", icon: FileText },
  { label: "Other Bills", href: "/vendor/other-bills", icon: Receipt },
  { label: "My Permits", href: "/vendor/permits", icon: FileCheck2 },
];

export const VendorSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, setIsSidebarCollapsed, isMobileSidebarOpen } = useLayout();

  const isActiveRoute = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <div
      className={`${isSidebarCollapsed ? "w-16" : "w-64"
        } bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto transition-all duration-300 z-40 ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      style={{
        top: "4rem",
        height: "91vh",
      }}
    >
      <div className={`${isSidebarCollapsed ? "px-2 py-2" : "p-2"}`}>
        {/* Collapse / Expand Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute right-2 top-2 p-1 rounded-md hover:bg-[#DBC2A9] z-10 transition-colors"
        >
          {isSidebarCollapsed ? (
            <div className="flex justify-center items-center w-8 h-8 bg-[#f6f4ee] border border-[#e5e1d8] mx-auto rounded">
              <ChevronRight className="w-4 h-4 text-[#1a1a1a]" />
            </div>
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#1a1a1a]" />
          )}
        </button>

        {/* Spacer below collapse button */}
        <div className="w-full h-4 bg-[#f6f4ee] border-[#e5e1d8] mb-2" />

        {/* Section Title */}
        <div className={`mb-4 ${isSidebarCollapsed ? "text-center" : ""}`}>
          <h3
            className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${isSidebarCollapsed ? "hidden" : "tracking-wide px-2"
              }`}
          >
            Vendor Portal
          </h3>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {NAV_ITEMS.map((item) => {
            const active = isActiveRoute(item.href);
            const Icon = item.icon;

            if (isSidebarCollapsed) {
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  title={item.label}
                  className={`flex items-center justify-center w-full p-2 rounded-lg relative transition-all duration-200 ${active ? "bg-[#f0e8dc] shadow-inner" : "hover:bg-[#DBC2A9]"
                    }`}
                >
                  {active && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#DA7756]" />
                  )}
                  <Icon className={`w-5 h-5 ${active ? "text-[#DA7756]" : "text-[#1a1a1a]"}`} />
                </button>
              );
            }

            return (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium relative transition-colors ${active ? "bg-[#f0e8dc] shadow-inner text-[#DA7756]" : "text-[#1a1a1a] hover:bg-[#DBC2A9]"
                  }`}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#DA7756]" />
                )}

                <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-[#C72030]" : ""}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default VendorSidebar;
