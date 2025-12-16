import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { usePermissions } from "../contexts/PermissionsContext";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Circle,
  IndianRupee,
  Settings,
  Star,
  DollarSign,
  Target,
  Wrench,
  UserCheck,
  Package,
  FileSpreadsheet,
  CheckSquare,
  DoorOpen,
  Ticket,
} from "lucide-react";
import {
  MapPin,
  Users,
  Image as ImageIcon,
  Footprints,
  UtensilsCrossed,
  UsersRound,
  Flower2,
  UserRoundSearch,
  Calendar,
  Gift,
  Shield,
  FileText,
  HelpCircle,
  Bell,
  MapPinned,
  Wallet,
  Heart,
} from "lucide-react";

// Pulse-specific module configuration
const modulesByPackage = {
  "Pulse Privilege": [
    {
      name: "Banners",
      icon: ImageIcon,
      href: "/pulse/banners",
    },
    {
      name: "Stepathon",
      icon: Footprints,
      href: "/pulse/stepathon",
    },
    {
      name: "Food Court",
      icon: UtensilsCrossed,
      href: "/pulse/food-court",
    },
    {
      name: "Community",
      icon: UsersRound,
      href: "/pulse/community",
    },
    {
      name: "Amenity",
      icon: Flower2,
      href: "/pulse/amenity",
    },
    {
      name: "Visitors",
      icon: UserRoundSearch,
      href: "/pulse/visitors",
    },
    {
      name: "Events",
      icon: Calendar,
      href: "/pulse/events",
    },
    {
      name: "Curated Services",
      icon: Gift,
      href: "/pulse/curated-services",
    },
    {
      name: "Pulse Privilege",
      icon: Shield,
      href: "/pulse/pulse-privilege",
    },
    {
      name: "Documents",
      icon: FileText,
      href: "/pulse/documents",
    },
    {
      name: "Helpdesk",
      icon: HelpCircle,
      href: "/maintenance/ticket",
    },
    {
      name: "Notices",
      icon: Bell,
      href: "/pulse/notices",
    },
    {
      name: "SOS Directory",
      icon: MapPinned,
      href: "/pulse/sos-directory",
    },
    {
      name: "Wallet",
      icon: Wallet,
      href: "/pulse/wallet",
    },
    {
      name: "ESR/CSR",
      icon: Heart,
      href: "/pulse/esr-csr",
    },
  ],

  Master: [
    {
      name: "Location Master",
      icon: MapPin,
      href: "/master/location",
      subItems: [
        {
          name: "Account",
          href: "/master/location/account",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Building",
          href: "/master/location/building",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Wing",
          href: "/master/location/wing",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Area",
          href: "/master/location/area",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Floor",
          href: "/master/location/floor",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Unit",
          href: "/master/location/unit",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Room",
          href: "/master/location/room",
          color: "text-[#1a1a1a]",
        },
      ],
    },
    {
      name: "User Master",
      icon: Users,
      href: "/master/user",
      subItems: [
        {
          name: "FM Users",
          href: "/master/user/fm-users",
          color: "text-[#1a1a1a]",
        },
        {
          name: "Occupant Users",
          href: "/master/user/occupant-users",
          color: "text-[#1a1a1a]",
        },
      ],
    },

    // {
    //   name: 'Inventory Sub Type',
    //   icon: PackagePlus,
    //   href: '/master/inventory-sub-type'
    // },
  ],

  Settings: [
    {
      name: "Account",
      icon: Users,
      href: "/settings/account",
      subItems: [
        { name: "General", href: "/settings/account/general" },
        {
          name: "Holiday Calendar",
          href: "/settings/account/holiday-calendar",
        },
        { name: "About", href: "/settings/account/about" },
        { name: "Language", href: "/settings/account/language" },
        {
          name: "Company Logo Upload",
          href: "/settings/account/company-logo-upload",
        },
        { name: "Report Setup", href: "/settings/account/report-setup" },
        {
          name: "Notification Setup",
          href: "/settings/account/notification-setup",
        },
        { name: "Shift", href: "/settings/account/shift" },
        { name: "Roster", href: "/settings/account/roster" },
        { name: "Lock Module", href: "/settings/account/lock-module" },
        { name: "Lock Function", href: "/settings/account/lock-function" },
        {
          name: "Lock Sub Function",
          href: "/settings/account/lock-sub-function",
        },
      ],
    },
    {
      name: "Roles (RACI)",
      icon: UserCheck,
      href: "/settings/roles",
      subItems: [
        { name: "Department", href: "/settings/roles/department" },
        { name: "Role", href: "/settings/roles/role" },
        { name: "Approval Matrix", href: "/settings/approval-matrix/setup" },
      ],
    },
    {
      name: "Maintenance",
      icon: Wrench,
      href: "/settings/maintenance",
      subItems: [
        {
          name: "Ticket Management",
          href: "/settings/ticket-management",
          subItems: [
            { name: "Setup", href: "/settings/ticket-management/setup" },
            {
              name: "Escalation Matrix",
              href: "/settings/ticket-management/escalation-matrix",
            },
            {
              name: "Cost Approval",
              href: "/settings/ticket-management/cost-approval",
            },
          ],
        },
      ],
    },

    { name: "FM Groups", icon: Users, href: "/settings/groups" },
    // {
    //   name: 'Currency',
    //   icon: Currency,
    //   href: '/settings/currency',
    // }
  ],
};

// Permission check helper function
const checkPermission = (item: any, userRole: any = null) => {
  // If no userRole provided, allow access (for testing/development)
  if (!userRole) {
    return true;
  }

  // If userRole exists but has no lock_modules, deny access
  if (!userRole.lock_modules || !Array.isArray(userRole.lock_modules)) {
    return false;
  }

  // Extract active functions from API (IGNORING module_active)
  const activeFunctions: string[] = [];
  userRole.lock_modules.forEach((module: any) => {
    if (module.lock_functions && Array.isArray(module.lock_functions)) {
      module.lock_functions.forEach((func: any) => {
        if (func.function_active === 1) {
          activeFunctions.push(func.function_name?.toLowerCase() || "");
        }
      });
    }
  });

  // Check if item name matches any active function
  const itemName = item.name?.toLowerCase() || "";
  return activeFunctions.includes(itemName);
};

export const PulseSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentSection,
    setCurrentSection,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
  } = useLayout();
  const {
    userRole,
    loading: permissionsLoading,
    hasPermissionForPath,
  } = usePermissions();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Detect if user is on Pulse site - FALLBACK for when no API role exists
  const hostname = window.location.hostname;
  const isPulseSite =
    hostname.includes("pulse.lockated.com") ||
    hostname.includes("localhost") || // Update port if different
    location.pathname.startsWith("/pulse");

  // Filter modules based on user permissions
  const filteredModulesByPackage = React.useMemo(() => {
    // FALLBACK: If no userRole but on Pulse site, show all modules
    if (!userRole && isPulseSite) {
      console.log(
        "📊 Pulse Sidebar: ALL modules (no user role, but isPulseSite detected)"
      );
      return modulesByPackage;
    }

    if (!userRole) {
      console.log(
        "📊 Pulse Sidebar: No modules (no user role, not Pulse site)"
      );
      return {};
    }

    const filtered: any = {};

    // Recursive function to filter subItems at ALL levels
    const filterSubItemsRecursively = (items: any[]): any[] => {
      return items
        .map((item) => {
          // First, recursively filter any nested subItems
          const filteredSubItems = item.subItems
            ? filterSubItemsRecursively(item.subItems)
            : [];

          return {
            ...item,
            subItems: filteredSubItems,
          };
        })
        .filter((item) => {
          const hasDirectPermission = checkPermission(item, userRole);
          const hasAccessibleSubItems =
            item.subItems && item.subItems.length > 0;

          return hasDirectPermission || hasAccessibleSubItems;
        });
    };

    Object.entries(modulesByPackage).forEach(([sectionName, items]) => {
      const filteredItems = filterSubItemsRecursively(items);

      if (filteredItems.length > 0) {
        filtered[sectionName] = filteredItems;
      }
    });

    console.log("🎯 Pulse Sidebar Filtering Results:", filtered);

    return filtered;
  }, [userRole, isPulseSite]);

  // Reset expanded items on page load/refresh
  React.useEffect(() => {
    setExpandedItems([]);
  }, []);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((name) => name !== itemName)
        : [...prev, itemName]
    );
  };

  // Close all expanded items when sidebar is collapsed
  React.useEffect(() => {
    if (isSidebarCollapsed) {
      setExpandedItems([]);
    }
  }, [isSidebarCollapsed]);

  const handleNavigation = (href: string, section?: string) => {
    if (section && section !== currentSection) {
      setCurrentSection(section);
    }
    navigate(href);
  };

  // Set current section based on route
  React.useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/master")) {
      setCurrentSection("Master");
    } else if (path.startsWith("/settings")) {
      setCurrentSection("Settings");
    } else if (path.startsWith("/pulse") || !currentSection) {
      setCurrentSection("Pulse Privilege");
    }
  }, [location.pathname, setCurrentSection]);

  const currentModules = filteredModulesByPackage[currentSection] || [];

  const isActiveRoute = (href: string) => {
    const currentPath = location.pathname;
    return currentPath === href || currentPath.startsWith(href + "/");
  };

  // Auto-expand functionality
  React.useEffect(() => {
    const path = location.pathname;
    const currentSectionItems = filteredModulesByPackage[currentSection];
    const itemsToExpand: string[] = [];

    if (currentSectionItems) {
      currentSectionItems.forEach((item: any) => {
        if (item.href && path.startsWith(item.href)) {
          itemsToExpand.push(item.name);
        }
        if (item.subItems) {
          item.subItems.forEach((subItem: any) => {
            if (subItem.href && path.startsWith(subItem.href)) {
              itemsToExpand.push(item.name);
              itemsToExpand.push(subItem.name);
            }
          });
        }
      });

      setExpandedItems(itemsToExpand);
    }
  }, [currentSection, location.pathname, filteredModulesByPackage]);

  const renderMenuItem = (item: any, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isActive = item.href ? isActiveRoute(item.href) : false;

    if (hasSubItems) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className="flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative"
          >
            <div className="flex items-center gap-3">
              {level === 0 && <item.icon className="w-5 h-5" />}
              {item.name}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div className="ml-4 space-y-1">
              {item.subItems.map((subItem: any) =>
                renderMenuItem(subItem, level + 1)
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={item.name}>
        <button
          onClick={() =>
            item.href && handleNavigation(item.href, currentSection)
          }
          className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${
            isActive ? "bg-[#f0e8dc] shadow-inner" : ""
          } ${item.color || "text-[#1a1a1a]"}`}
        >
          {isActive && (
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
          )}
          {level === 0 && <item.icon className="w-5 h-5" />}
          {item.name}
        </button>
      </div>
    );
  };

  const CollapsedMenuItem = ({ module, level = 0 }: any) => {
    const active = module.href ? isActiveRoute(module.href) : false;

    return (
      <button
        key={module.name}
        onClick={() => {
          if (module.href) {
            handleNavigation(module.href, currentSection);
          }
        }}
        className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${
          active ? "bg-[#f0e8dc] shadow-inner" : "hover:bg-[#DBC2A9]"
        }`}
        title={module.name}
      >
        {active && (
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
        )}
        <module.icon
          className={`w-5 h-5 ${active ? "text-[#C72030]" : "text-[#1a1a1a]"}`}
        />
      </button>
    );
  };

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
        {/* Add background and border below the collapse button */}
        <div className="w-full h-4 bg-[#f6f4ee] border-[#e5e1d8] mb-2"></div>

        {currentSection && (
          <div className={`mb-4 ${isSidebarCollapsed ? "text-center" : ""}`}>
            <h3
              className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${
                isSidebarCollapsed ? "text-center" : "tracking-wide"
              }`}
            >
              {isSidebarCollapsed ? currentSection.slice(0, 1) : currentSection}
            </h3>
          </div>
        )}

        <nav className="space-y-2">
          {permissionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
            </div>
          ) : isSidebarCollapsed ? (
            <div className="flex flex-col items-center space-y-3 pt-4">
              {currentModules.map((module: any) => (
                <CollapsedMenuItem key={module.name} module={module} />
              ))}
            </div>
          ) : (
            currentModules.map((module: any) => renderMenuItem(module))
          )}
        </nav>
      </div>
    </div>
  );
};
