import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Target,
  User,
  MessageSquare,
  Megaphone,
  Trophy,
  Brain,
  HelpCircle,
  Bug,
  FileText,
} from "lucide-react";

// Module-based navigation structures for Admin Compass
const adminCompassNavigation: Record<string, any> = {
  "My Profile": {
    icon: User,
    href: "/admin-compass/profile",
  },
  Dashboard: {
    icon: User,
    href: "/admin-compass/dashboard",
  },
  "Daily Report": {
    icon: FileText,
    href: "/admin-compass/daily-report",
  },
  "Weekly Report": {
    icon: User,
    href: "/admin-compass/weekly-report",
  },
  "Tasks and Issues": {
    icon: Target,
    href: "/admin-compass/tasks-and-issues",
  },
  "Directory and Chat": {
    icon: User,
    href: "/admin-compass/directory-and-chat",
  },
  Feedback: {
    icon: MessageSquare,
    href: "/admin-compass/feedback",
  },
  Announcements: {
    icon: Megaphone,
    href: "/admin-compass/announcements",
  },
  Leaderboard: {
    icon: Trophy,
    href: "/admin-compass/leaderboard",
  },
  DISC: {
    icon: Brain,
    href: "/admin-compass/disc-personality-assessment",
  },
  "Help Center": {
    icon: HelpCircle,
    href: "/admin-compass/help-center",
  },
  "Bug Reports": {
    icon: Bug,
    href: "/admin-compass/bug-reports",
  },
};

export const AdminCompassSidebar: React.FC = () => {
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

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <aside
      className={`fixed left-0 top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-[#f6f4ee] border-r border-[#D5DbDB] transition-all duration-300 z-40 overflow-y-auto ${isSidebarCollapsed ? "w-12 sm:w-16" : "w-56 sm:w-64"
        }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute right-1 sm:right-2 top-1 sm:top-2 p-0.5 sm:p-1 rounded-md hover:bg-[#DBC2A9] z-10"
        aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        ) : (
          <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        )}
      </button>

      <div className="w-full h-3 sm:h-4 bg-[#f6f4ee] border-[#e5e1d8] mb-1 sm:mb-2"></div>

      {/* Module Title */}
      {!isSidebarCollapsed && (
        <div className="mb-2 sm:mb-4 px-2 sm:px-3">
          <h3 className="text-xs sm:text-sm font-medium text-[#1a1a1a] opacity-70 uppercase tracking-wide">
            Admin Compass
          </h3>
        </div>
      )}

      {/* Sidebar Content */}
      <div className="h-[calc(100%-120px)] py-1 sm:py-2">
        <nav className="space-y-1 sm:space-y-2 px-1 sm:px-2">
          {Object.entries(adminCompassNavigation).map(
            ([key, section]: [string, any]) => {
              const Icon = section.icon;
              const hasItems = section.items && section.items.length > 0;
              const sectionHref = section.href || "";
              const sectionHasActiveItem = hasItems
                ? section.items.some((item: { href: string }) =>
                  isActive(item.href)
                )
                : false;
              const isSectionOpen = openSections[key] ?? sectionHasActiveItem;

              if (!hasItems && sectionHref) {
                return (
                  <button
                    key={key}
                    onClick={() => handleNavigation(sectionHref)}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${isActive(sectionHref)
                      ? "bg-[#DBC2A9] text-[#1a1a1a]"
                      : "text-[#1a1a1a] hover:bg-[#DBC2A9]"
                      }`}
                    title={isSidebarCollapsed ? key : ""}
                  >
                    {isActive(sectionHref) && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-[#C72030]"></div>
                    )}
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <span className="text-xs sm:text-sm font-medium truncate">
                        {key}
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <div key={key} className="space-y-0.5 sm:space-y-1">
                  <button
                    onClick={() => toggleSection(key)}
                    className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-colors relative ${isSectionOpen ? "bg-[#DBC2A9]" : "hover:bg-[#DBC2A9]"
                      } text-[#1a1a1a]`}
                    title={isSidebarCollapsed ? key : ""}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <>
                        <span className="text-xs sm:text-sm font-bold flex-1 text-left truncate">
                          {key}
                        </span>
                        <ChevronDown
                          className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform flex-shrink-0 ${isSectionOpen ? "transform rotate-180" : ""
                            }`}
                        />
                      </>
                    )}
                  </button>

                  {!isSidebarCollapsed && isSectionOpen && hasItems && (
                    <div className="ml-6 sm:ml-8 space-y-0.5 sm:space-y-1">
                      {section.items.map((item: any) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className={`w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors relative ${isActive(item.href)
                            ? "bg-[#DBC2A9] text-[#1a1a1a]"
                            : "text-[#1a1a1a] hover:bg-[#DBC2A9]"
                            }`}
                        >
                          {isActive(item.href) && (
                            <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-[#C72030]"></div>
                          )}
                          <span className="truncate block">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
          )}
        </nav>
      </div>
    </aside>
  );
};
