import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import {
  Home,
  Ticket,
  ClipboardList,
  FileText,
  Calendar,
  Bell,
  MessageSquare,
  User,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

// Employee-specific navigation structure (limited modules for pms_occupant users)
const employeeNavigationStructure = {
  Dashboard: {
    icon: Home,
    href: "/",
    items: [],
  },
  Tickets: {
    icon: Ticket,
    items: [
      { name: "My Tickets", href: "/tickets/my-tickets" },
      { name: "Create Ticket", href: "/tickets/create" },
      { name: "Ticket History", href: "/tickets/history" },
    ],
  },
  Requests: {
    icon: ClipboardList,
    items: [
      { name: "My Requests", href: "/requests/my-requests" },
      { name: "New Request", href: "/requests/create" },
    ],
  },
  Reports: {
    icon: FileText,
    items: [
      { name: "My Reports", href: "/reports/my-reports" },
      { name: "View Reports", href: "/reports/view" },
    ],
  },
  Calendar: {
    icon: Calendar,
    href: "/calendar",
    items: [],
  },
  Notifications: {
    icon: Bell,
    href: "/notifications",
    items: [],
  },
  Feedback: {
    icon: MessageSquare,
    items: [
      { name: "Submit Feedback", href: "/feedback/submit" },
      { name: "My Feedback", href: "/feedback/my-feedback" },
    ],
  },
  Profile: {
    icon: User,
    items: [
      { name: "My Profile", href: "/profile" },
      { name: "Settings", href: "/profile/settings" },
    ],
  },
};

export const EmployeeSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isSidebarCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors z-50"
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Sidebar Content */}
      <div className="h-full overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {Object.entries(employeeNavigationStructure).map(([key, section]) => {
            const Icon = section.icon;
            const hasItems = section.items && section.items.length > 0;
            const sectionHref = (section as any).href || "";
            const isSectionOpen = openSections[key];

            // Direct link (no subitems)
            if (!hasItems && sectionHref) {
              return (
                <button
                  key={key}
                  onClick={() => handleNavigation(sectionHref)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(sectionHref)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  title={isSidebarCollapsed ? key : ""}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <span className="text-sm font-medium">{key}</span>
                  )}
                </button>
              );
            }

            // Section with subitems
            return (
              <div key={key} className="space-y-1">
                <button
                  onClick={() => toggleSection(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isSectionOpen ? "bg-gray-50" : "hover:bg-gray-50"
                  } text-gray-700`}
                  title={isSidebarCollapsed ? key : ""}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isSidebarCollapsed && (
                    <>
                      <span className="text-sm font-medium flex-1 text-left">
                        {key}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isSectionOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </>
                  )}
                </button>

                {/* Subitems */}
                {!isSidebarCollapsed && isSectionOpen && hasItems && (
                  <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                    {section.items.map((item: any) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActive(item.href)
                            ? "bg-blue-50 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Employee Badge */}
      {!isSidebarCollapsed && (
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <p className="text-xs font-medium text-blue-700">Employee Portal</p>
            <p className="text-xs text-blue-600 mt-1">Limited Access</p>
          </div>
        </div>
      )}
    </aside>
  );
};
