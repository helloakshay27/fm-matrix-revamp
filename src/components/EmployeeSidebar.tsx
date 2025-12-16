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
  FolderKanban,
  ListChecks,
  Plus,
  Clock,
  CheckCircle,
  Users,
  UserPlus,
  UserCheck,
  ClipboardCheck,
  FileSpreadsheet,
  Settings,
  Briefcase,
  AlertTriangle,
  Target,
  CheckSquare,
  CircleCheckBig,
  FileCheck2Icon,
  File,
  Package,
} from "lucide-react";

/**
 * EMPLOYEE SIDEBAR - MODULE-BASED NAVIGATION
 *
 * This sidebar is specifically designed for employee users (userType === "pms_occupant")
 * and provides simplified, module-based navigation compared to the full admin sidebar.
 *
 * NAVIGATION STRUCTURE:
 * Each module (Project Task, Ticket, MOM, Visitors) has its own navigation structure
 * defined in `employeeNavigationByModule`. The active module is determined by
 * `currentSection` from LayoutContext.
 *
 * KEY FEATURES:
 * - Module switching via EmployeeHeader
 * - Collapsible sidebar with toggle button
 * - Active route highlighting
 * - Module badge showing current access level
 * - Limited access compared to admin view
 *
 * VISUAL INDICATORS:
 * - Blue highlight for active routes
 * - Module badge at bottom (blue background, "Limited Access" text)
 * - Collapsible sections for items with subitems
 *
 * USER SWITCHING:
 * Users with admin access can switch to Admin View via the profile dropdown
 * in EmployeeHeader, which will reload the page with full admin layout.
 */

// Module-based navigation structures for employees
const employeeNavigationByModule: Record<string, any> = {
  "Dashboard": {
    Overview: {
      icon: Home,
      href: "/dashboard",
      items: [],
    },
    Analytics: {
      icon: Target,
      href: "/dashboard/analytics",
      items: [],
    },
  },
  "Project Task": {
    Projects: {
      icon: Briefcase,
      href: "/vas/projects",
      items: [],
    },
    "My Tasks": {
      icon: ListChecks,
      href: "/vas/tasks",
      items: [],
    },
    Issues: {
      icon: AlertTriangle,
      href: "/vas/issues",
      items: [],
    },
    Sprint: {
      icon: AlertTriangle,
      href: "/vas/sprint",
      items: [],
    },
    Channels: {
      icon: MessageSquare,
      href: "/vas/channels",
      items: [],
    },
    "Minutes of Meeting": {
      icon: FileCheck2Icon,
      href: "/vas/mom",
      items: [],
    },
    "Opportunity Register": {
      icon: Target,
      href: "/vas/opportunity",
      items: [],
    },
    "To Do": {
      icon: CircleCheckBig,
      href: "/vas/todo",
      items: [],
    },
    "Documents": {
      icon: File,
      href: "/vas/documents",
      items: [],
    },
  },
  "Book Seats": {
    "My Bookings": {
      icon: Calendar,
      href: "/vas/space-management/bookings",
      items: [],
    },
    "Seat Requests": {
      icon: UserPlus,
      href: "/vas/space-management/seat-requests",
      items: [],
    },
    "Available Spaces": {
      icon: CheckSquare,
      href: "/vas/space-management/available",
      items: [],
    },
  },
  "Parking": {
    "My Parking": {
      icon: Package,
      href: "/parking/employee/my-parking",
      items: [],
    },
    "Book Parking": {
      icon: Plus,
      href: "/parking/employee/book",
      items: [],
    },
    "Parking History": {
      icon: Clock,
      href: "/parking/employee/history",
      items: [],
    },
  },
  "Calendar": {
    "My Calendar": {
      icon: Calendar,
      href: "/calendar",
      items: [],
    },
    Events: {
      icon: Target,
      href: "/calendar/events",
      items: [],
    },
    Meetings: {
      icon: Users,
      href: "/calendar/meetings",
      items: [],
    },
  },
  Ticket: {
    Dashboard: {
      icon: Home,
      href: "/",
      items: [],
    },
    "My Tickets": {
      icon: Ticket,
      href: "/tickets",
      items: [],
    },
    Tasks: {
      icon: CheckSquare,
      href: "/maintenance/task",
      items: [],
    },
    Schedule: {
      icon: Calendar,
      href: "/maintenance/schedule",
      items: [],
    },
  },
  MOM: {
    Dashboard: {
      icon: Home,
      href: "/",
      items: [],
    },
    "MOM List": {
      icon: FileText,
      href: "/settings/vas/mom",
      items: [],
    },
    "Client Tag Setup": {
      icon: Settings,
      href: "/settings/vas/mom/client-tag-setup",
      items: [],
    },
    "Product Tag Setup": {
      icon: Settings,
      href: "/settings/vas/mom/product-tag-setup",
      items: [],
    },
  },
  Visitors: {
    Dashboard: {
      icon: Home,
      href: "/",
      items: [],
    },
    "Visitor Management": {
      icon: Users,
      href: "/visitors",
      items: [],
    },
    "Visitor Setup": {
      icon: Settings,
      items: [
        { name: "Setup", href: "/settings/visitor-management/setup" },
        {
          name: "Visiting Purpose",
          href: "/settings/visitor-management/visiting-purpose",
        },
        {
          name: "Support Staff",
          href: "/settings/visitor-management/support-staff",
        },
        { name: "Icons", href: "/settings/visitor-management/icons" },
      ],
    },
  },
  Booking: {
    Dashboard: {
      icon: Home,
      href: "/",
      items: [],
    },
    "Booking List": {
      icon: Calendar,
      href: "/bookings",
      items: [],
    },
    "My Bookings": {
      icon: CheckSquare,
      href: "/bookings",
      items: [],
    },
  },
  "Meeting Room": {
    Dashboard: {
      icon: Home,
      href: "/",
      items: [],
    },
    "Space Bookings": {
      icon: Calendar,
      href: "/vas/space-management/bookings",
      items: [],
    },
    "Seat Requests": {
      icon: UserPlus,
      href: "/vas/space-management/seat-requests",
      items: [],
    },
  },
  "F&B": {
    Dashboard: {
      icon: Home,
      href: "/",
      items: [],
    },
    "F&B Services": {
      icon: Target,
      href: "/vas/fnb",
      items: [],
    },
  },
  Documents: {
    Dashboard: {
      icon: Home,
      href: "/",
      items: [],
    },
    "Communication Templates": {
      icon: FileText,
      href: "/master/communication-template",
      items: [],
    },
  },
  "ID Card": {
    Dashboard: {
      icon: Home,
      href: "/",
      items: [],
    },
    "Occupant Users": {
      icon: Users,
      href: "/master/user/occupant-users",
      items: [],
    },
    "FM Users": {
      icon: UserCheck,
      href: "/master/user/fm-users",
      items: [],
    },
  },
  "Notes": {
    Channels: {
      icon: MessageSquare,
      href: "/vas/channels",
      items: [],
    },
    Tasks: {
      icon: ListChecks,
      href: "/vas/channels/tasks",
      items: [],
    },
  },
  "Ask AI": {
    "AI Assistant": {
      icon: Target,
      href: "/ask-ai",
      items: [],
    },
    "Chat History": {
      icon: MessageSquare,
      href: "/ask-ai/history",
      items: [],
    },
  },
};

export const EmployeeSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSidebarCollapsed, setIsSidebarCollapsed, currentSection } =
    useLayout();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  // Get navigation structure based on current module
  const navigationStructure =
    employeeNavigationByModule[currentSection] ||
    employeeNavigationByModule["Project Task"];

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  /**
   * Handle navigation within the sidebar
   *
   * IMPORTANT: This function does NOT change currentSection
   * This means:
   * - Clicking "Projects" or "My Tasks" keeps sidebar open (stays in "Project Task" module)
   * - Sidebar only closes when user clicks a different MODULE button in EmployeeHeader
   * - Example: Clicking "Ticket" module button in header changes currentSection to "Ticket"
   *           which causes Layout.tsx to hide the sidebar (since only "Project Task" shows sidebar)
   */
  const handleNavigation = (
    href: string,
    shouldKeepSidebarOpen: boolean = false
  ) => {
    // Navigate to the route
    navigate(href);

    // Don't change currentSection - keep sidebar visible for Project Task items
    // The sidebar visibility is controlled by Layout.tsx based on currentSection
    // Since we're staying within the "Project Task" module, sidebar stays open
  };

  const isActive = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
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

      {/* Add background and border below the collapse button */}
      <div className="w-full h-3 sm:h-4 bg-[#f6f4ee] border-[#e5e1d8] mb-1 sm:mb-2"></div>

      {/* Module Title */}
      {!isSidebarCollapsed && currentSection && (
        <div className="mb-2 sm:mb-4 px-2 sm:px-3">
          <h3 className="text-xs sm:text-sm font-medium text-[#1a1a1a] opacity-70 uppercase tracking-wide">
            {currentSection}
          </h3>
        </div>
      )}

      {/* Sidebar Content */}
      <div className="h-[calc(100%-120px)] py-1 sm:py-2">
        {/* Adjusted for badge space */}
        <nav className="space-y-1 sm:space-y-2 px-1 sm:px-2">
          {Object.entries(navigationStructure).map(
            ([key, section]: [string, any]) => {
              const Icon = section.icon;
              const hasItems = section.items && section.items.length > 0;
              const sectionHref = section.href || "";
              const isSectionOpen = openSections[key];

              // Direct link (no subitems)
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
                      <span className="text-xs sm:text-sm font-medium truncate">{key}</span>
                    )}
                  </button>
                );
              }

              // Section with subitems
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

                  {/* Subitems */}
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

      {/* Module Badge */}

    </aside>
  );
};
