import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import {
  Settings,
  Users,
  Shield,
  Lock,
  Key,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Building,
  UserCheck,
  Database,
} from "lucide-react";

const adminNavigationStructure = {
  "Admin Console": {
    icon: Settings,
    items: [
      {
        name: "Account Management",
        icon: Building,
        subItems: [
          { name: "Private Setup", href: "/ops-console/master/location/account" },
        ],
      },
      {
        name: "User Management",
        icon: Users,
        subItems: [
          { name: "FM Users", href: "/ops-console/master/user/fm-users" },
          { name: "Admin Users", href: "/ops-console/admin/users" },
          { name: "Create Admin User", href: "/ops-console/admin/create-admin-user" },
          { name: "Roles", href: "/ops-console/settings/roles/role" },
        ],
      },
      {
        name: "Access Control",
        icon: Lock,
        subItems: [
          { name: "Lock Module", href: "/ops-console/settings/account/lock-module" },
          { name: "Lock Function", href: "/ops-console/settings/account/lock-function" },
          { name: "Lock Sub Function", href: "/ops-console/settings/account/lock-sub-function" },
        ],
      },
    ],
  },
};

export const AdminSidebar = () => {
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const isActiveRoute = (href?: string) => {
    if (!href) return false;
    return location.pathname === href;
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderMenuItem = (module: any) => {
    const hasSubItems = module.subItems && module.subItems.length > 0;
    const isExpanded = expandedItems.includes(module.name);

    return (
      <div key={module.name} className="mb-2">
        <div
          className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
            isActiveRoute(module.href)
              ? "bg-[#f0e8dc] shadow-inner"
              : "hover:bg-[#DBC2A9]"
          }`}
          onClick={() => {
            if (hasSubItems) {
              toggleExpanded(module.name);
            } else if (module.href) {
              handleNavigation(module.href);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            {isActiveRoute(module.href) && (
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
            )}
            <module.icon
              className={`w-5 h-5 ${
                isActiveRoute(module.href) ? "text-[#C72030]" : "text-[#1a1a1a]"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                isActiveRoute(module.href) ? "text-[#C72030]" : "text-[#1a1a1a]"
              }`}
            >
              {module.name}
            </span>
          </div>
          {hasSubItems && (
            <div
              className={`transition-transform duration-200 ${
                isExpanded ? "rotate-90" : ""
              }`}
            >
              <ChevronRight className="w-4 h-4 text-[#1a1a1a] opacity-70" />
            </div>
          )}
        </div>

        {hasSubItems && isExpanded && (
          <div className="mt-2 ml-4 space-y-1">
            {module.subItems.map((subItem: any) => (
              <div
                key={subItem.name}
                className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-200 ${
                  isActiveRoute(subItem.href)
                    ? "bg-[#f0e8dc] shadow-inner"
                    : "hover:bg-[#DBC2A9]"
                }`}
                onClick={() => handleNavigation(subItem.href)}
              >
                {isActiveRoute(subItem.href) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
                )}
                <span
                  className={`text-sm ${
                    isActiveRoute(subItem.href)
                      ? "text-[#C72030] font-medium"
                      : "text-[#1a1a1a] opacity-80"
                  }`}
                >
                  {subItem.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const CollapsedMenuItem = ({ module }: { module: any }) => (
    <button
      onClick={() => {
        if (module.subItems && module.subItems.length > 0) {
          const firstSubItem = module.subItems[0];
          if (firstSubItem.href) {
            handleNavigation(firstSubItem.href);
          }
        } else if (module.href) {
          handleNavigation(module.href);
        }
      }}
      className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${
        isActiveRoute(module.href)
          ? "bg-[#f0e8dc] shadow-inner"
          : "hover:bg-[#DBC2A9]"
      }`}
      title={module.name}
    >
      {isActiveRoute(module.href) && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
      )}
      <module.icon
        className={`w-5 h-5 ${
          isActiveRoute(module.href) ? "text-[#C72030]" : "text-[#1a1a1a]"
        }`}
      />
    </button>
  );

  const currentSection = "Admin Console";
  const currentModules = adminNavigationStructure[currentSection]?.items || [];

  return (
    <div
      className={`${
        isSidebarCollapsed ? "w-16" : "w-64"
      } bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto transition-all duration-300`}
      style={{ top: "4rem", height: "91vh" }}
    >
      <div className={`${isSidebarCollapsed ? "px-2 py-2" : "p-2"}`}>
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute right-2 top-2 p-1 rounded-md hover:bg-[#DBC2A9] z-10"
        >
          {isSidebarCollapsed ? (
            <div className="flex justify-center items-center w-8 h-8 bg-[#f6f4ee] border border-[#e5e1d8] mx-auto">
              <ChevronRight className="w-4 h-4" />
            </div>
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
        
        <div className="w-full h-4 bg-[#f6f4ee] border-[#e5e1d8] mb-2"></div>

        <div className={`mb-4 ${isSidebarCollapsed ? "text-center" : ""}`}>
          <h3
            className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${
              isSidebarCollapsed ? "text-center" : "tracking-wide"
            }`}
          >
            {isSidebarCollapsed ? "" : currentSection}
          </h3>
        </div>

        <nav className="space-y-2">
          {isSidebarCollapsed ? (
            <div className="flex flex-col items-center space-y-3 pt-4">
              {currentModules.map((module) => (
                <CollapsedMenuItem key={module.name} module={module} />
              ))}
            </div>
          ) : (
            currentModules.map((module) => renderMenuItem(module))
          )}
        </nav>
      </div>
    </div>
  );
};
