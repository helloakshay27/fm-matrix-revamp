import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { useIsMobile } from "../hooks/use-mobile";
import { isMobileUiSite } from "../utils/mobileUiSites";
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
  LineChart,
  BarChart3,
  Users,
  Briefcase,
  Workflow,
} from "lucide-react";

// Module-based navigation structures for Admin Compass
const adminCompassNavigation: Record<string, any> = {
  "Business Plan & Goals": {
    icon: User,
    href: "/admin-compass/business-plan-goals",
  },
  "Daily Meeting": {
    icon: MessageSquare,
    href: "/admin-compass/daily-meeting",
  },
  // KPI module hidden
  // KPI: {
  //   icon: BarChart3,
  //   href: "/admin-compass/kpi",
  // },
  "Weekly Meetings": {
    icon: Trophy,
    href: "/admin-compass/weekly-meetings",
  },
  "Team Dashboard": {
    icon: MessageSquare,
    href: "/admin-compass/team-dashboard",
  },
  "FB Dashboard": {
    icon: LineChart,
    href: "/admin-compass/feedback-dashboard",
  },
  "DISC Report": {
    icon: Brain,
    href: "/admin-compass/disc-report",
  },
  "Systems & SOPs": {
    icon: FileText,
    href: "/admin-compass/systems-sops",
  },
  "Team Setup": {
    icon: Users,
    href: "/admin-compass/team-setup",
  },
  Jobs: {
    icon: Briefcase,
    href: "/admin-compass/jobs",
  },
  // Collapsible section: giving it "items" (instead of a bare "href") routes it
  // through the expandable branch below, same as any other grouped module.
  "Rule Engine": {
    icon: Workflow,
    items: [
      {
        name: "Data Source",
        href: "/admin-compass/rule-engine/data-source",
      },
      {
        name: "Rule",
        href: "/admin-compass/rule-engine/rule",
      },
    ],
  },
};

// Sirf sidebar se chhupaya hai — routes aur pages waise ke waise hain.
// Wapas dikhane ke liye is list se naam hata dein (ya array khaali kar dein).
const HIDDEN_NAV_ITEMS: string[] = ["Rule Engine"];

export const AdminCompassSidebarStatic: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isSidebarCollapsed: isSidebarCollapsedSetting,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
  } = useLayout();
  // Mobile par sidebar ek drawer hai — wahan collapse ka koi matlab nahi
  // (collapse toggle bhi max-md:hidden hai). Isliye <768px par hamesha expanded
  // render karte hain, chahe desktop par collapsed chhoda gaya ho — warna
  // drawer sirf icons dikhata tha, labels ke bina.
  const isMobile = useIsMobile();
  // Ye behaviour sirf goPhygital site par — baaki tenants par sidebar mobile
  // par bhi pehle ki tarah collapsible rehta hai.
  const isGoPhygital = isMobileUiSite();
  const isSidebarCollapsed =
    isSidebarCollapsedSetting && !(isMobile && isGoPhygital);
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
        } ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`${isGoPhygital ? "max-md:hidden " : ""}absolute right-1 sm:right-2 top-1 sm:top-2 p-0.5 sm:p-1 rounded-md hover:bg-[#DBC2A9] z-10`}
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
          {Object.entries(adminCompassNavigation)
            .filter(([key]) => !HIDDEN_NAV_ITEMS.includes(key))
            .map(
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
                    className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${isSectionOpen ? "bg-[#DBC2A9]" : "hover:bg-[#DBC2A9]"
                      } text-[#1a1a1a]`}
                    title={isSidebarCollapsed ? key : ""}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    {!isSidebarCollapsed && (
                      <>
                        <span className="text-xs sm:text-sm font-medium flex-1 text-left truncate">
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
