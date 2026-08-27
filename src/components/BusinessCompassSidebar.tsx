import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { useIsMobile } from "../hooks/use-mobile";
import { isMobileUiSite } from "../utils/mobileUiSites";
import { useActionLayout } from "../contexts/ActionLayoutContext";
import {
  ChevronRight,
  ChevronLeft,
  BarChart3,
  TrendingUp,
  User,
  MessageSquare,
  Megaphone,
  Trophy,
  Gauge,
  HelpCircle,
  Bug,
  FileText,
  ListCheck,
  ListChecks,
  Compass,
} from "lucide-react";

// Icon mapping for Business Compass functions, keyed by action_name — same
// approach as EmployeeSidebar's functionIconMap.
const functionIconMap: Record<string, any> = {
  employee_business_compass_dashboard: User,
  employee_business_compass_profile: BarChart3,
  employee_business_compass_daily_report: FileText,
  employee_business_compass_weekly_report: TrendingUp,
  employee_business_compass_tasks: ListChecks,
  employee_business_compass_issues: Bug,
  employee_business_compass_directory_and_chat: MessageSquare,
  employee_business_compass_announcements: HelpCircle,
  employee_business_compass_leaderboard: Megaphone,
  employee_business_compass_disc: Trophy,
  employee_business_compass_help_center: Gauge,
  employee_business_compass_bug_reports: Bug,
  employee_business_compass_todo: ListCheck,
};

// Fallback icon
const getFunctionIcon = (actionName: string) =>
  functionIconMap[actionName] || Compass;

export const BusinessCompassSidebar: React.FC = () => {
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
  const { getModuleFunctions } = useActionLayout();

  // Build the nav list from the "Employee Business Compass" module — sourced
  // the same dynamic way ActionSidebar/EmployeeSidebar do, via the shared
  // ActionLayoutContext, instead of a hardcoded label/href map. A function
  // shows up if it's active itself, or has an active descendant/sub-function.
  const navItems = useMemo(() => {
    const functions = getModuleFunctions("Employee Business Compass");

    const hasActiveDescendant = (func: any, allFunctions: any[]): boolean => {
      if (func.function_active === 1) return true;
      if (func.sub_functions?.some((sf: any) => sf.sub_function_active === 1)) {
        return true;
      }
      const children = allFunctions.filter(
        (f) => f.parent_function === func.action_name
      );
      return children.some((child) => hasActiveDescendant(child, allFunctions));
    };

    return functions
      .filter((func: any) => hasActiveDescendant(func, functions))
      .map((func: any) => ({
        name: func.function_name,
        href: func.react_link,
        icon: getFunctionIcon(func.action_name),
      }));
  }, [getModuleFunctions]);

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
      className={`fixed left-0 top-14 sm:top-16 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-[#f6f4ee] border-r border-[#D5DbDB] transition-all duration-300 z-40 overflow-y-auto ${
        isSidebarCollapsed ? "w-12 sm:w-16" : "w-56 sm:w-64"
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
            Business Compass
          </h3>
        </div>
      )}

      {/* Sidebar Content */}
      <div className="h-[calc(100%-120px)] py-1 sm:py-2">
        <nav className="space-y-1 sm:space-y-2 px-1 sm:px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className={`w-full flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors relative ${
                  isActive(item.href)
                    ? "bg-[#DBC2A9] text-[#1a1a1a]"
                    : "text-[#1a1a1a] hover:bg-[#DBC2A9]"
                }`}
                title={isSidebarCollapsed ? item.name : ""}
              >
                {isActive(item.href) && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-[#C72030]"></div>
                )}
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                {!isSidebarCollapsed && (
                  <span className="text-xs sm:text-sm font-medium truncate">
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
