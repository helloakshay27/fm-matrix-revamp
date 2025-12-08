import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import { usePermissions } from "../contexts/PermissionsContext";
import { sidebarPermissionFilter } from "../utils/sidebarPermissionFilter";
import { permissionService } from "../services/permissionService";
import {
  Users,
  Settings,
  FileText,
  Building,
  Car,
  Shield,
  DollarSign,
  Clipboard,
  AlertTriangle,
  Bell,
  Package,
  Wrench,
  BarChart3,
  Calendar,
  Clock,
  CheckSquare,
  MapPin,
  Truck,
  Phone,
  Globe,
  CreditCard,
  Receipt,
  Calculator,
  PieChart,
  UserCheck,
  Database,
  Zap,
  Droplets,
  Trash2,
  Sun,
  Battery,
  Gauge,
  Video,
  Lock,
  Key,
  Eye,
  ShieldCheck,
  Headphones,
  Gift,
  Star,
  MessageSquare,
  Coffee,
  Wifi,
  Home,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Briefcase,
  BookOpen,
  FileSpreadsheet,
  Target,
  Archive,
  TreePine,
  FlaskConical,
  Mail,
  ClipboardList,
  Currency,
  User,
  BarChart,
  UserRoundPen,
  DoorOpen,
  PackagePlus,
  Ticket,
  Trash,
} from "lucide-react";

const navigationStructure = {
  Settings: {
    icon: Settings,
    items: [
      {
        name: "Account",
        icon: Users,
        subItems: [
          { name: "General", href: "/settings/account/general" },
          {
            name: "Holiday Calendar",
            href: "/settings/account/holiday-calendar",
          },
          { name: "About", href: "/settings/account/about", isActive: true },
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
        subItems: [
          { name: "Department", href: "/settings/roles/department" },
          { name: "Role", href: "/settings/roles/role" },
        ],
      },
      {
        name: "Approval Matrix",
        icon: CheckSquare,
        subItems: [{ name: "Setup", href: "/settings/approval-matrix/setup" }],
      },
      {
        name: "Value Added Services",
        icon: Star,
        subItems: [
          {
            name: "MOM",
            subItems: [
              {
                name: "Client Tag Setup",
                href: "/settings/vas/mom/client-tag-setup",
              },
              {
                name: "Product Tag Setup",
                href: "/settings/vas/mom/product-tag-setup",
              },
            ],
          },
          {
            name: "Space Management",
            subItems: [
              {
                name: "Seat Setup",
                href: "/settings/vas/space-management/seat-setup",
              },
            ],
          },
          {
            name: "Booking",
            subItems: [{ name: "Setup", href: "/settings/vas/booking/setup" }],
          },
          {
            name: "Parking Management",
            subItems: [
              {
                name: "Parking Category",
                href: "/settings/vas/parking-management/parking-category",
              },
              {
                name: "Slot Configuration",
                href: "/settings/vas/parking-management/slot-configuration",
              },
              {
                name: "Time Slot Setup",
                href: "/settings/vas/parking-management/time-slot-setup",
              },
            ],
          },
        ],
      },
    ],
  },
  Maintenance: {
    icon: Wrench,
    items: [
      {
        name: "Asset Setup",
        icon: Building,
        subItems: [
          {
            name: "Approval Matrix",
            href: "/settings/asset-setup/approval-matrix",
          },
          {
            name: "Asset Group & Sub Group",
            href: "/settings/asset-setup/asset-groups",
          },
        ],
      },
      {
        name: "Checklist Setup",
        icon: CheckSquare,
        subItems: [
          {
            name: "Checklist Group & Sub Group",
            href: "/settings/checklist-setup/groups",
          },
          { name: "Email Rule", href: "/settings/checklist-setup/email-rule" },
          {
            name: "Task Escalation",
            href: "/settings/checklist-setup/task-escalation",
          },
        ],
      },
      {
        name: "Ticket Management",
        icon: FileText,
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
      {
        name: "Inventory Management",
        icon: Package,
        subItems: [
          {
            name: "SAC/HSN Code",
            href: "/settings/inventory-management/sac-hsn-code",
          },
        ],
      },
      {
        name: "Safety",
        icon: Shield,
        href: "/maintenance/safety",
      },
      {
        name: "Permit",
        icon: FileText,
        subItems: [
          { name: "Permit Setup", href: "/settings/safety/permit-setup" },
        ],
      },
      {
        name: "Incident",
        icon: AlertTriangle,
        subItems: [{ name: "Setup", href: "/settings/safety/incident" }],
      },
      {
        name: "Waste Management",
        icon: Trash2,
        subItems: [{ name: "Setup", href: "/settings/waste-management/setup" }],
      },
    ],
  },
  Finance: {
    icon: DollarSign,
    items: [
      {
        name: "Wallet Setup",
        icon: CreditCard,
        href: "/finance/wallet-setup",
      },
    ],
  },
  Security: {
    icon: Shield,
    items: [
      {
        name: "Visitor Management",
        icon: Users,
        subItems: [
          { name: "Setup", href: "/settings/visitor-management/setup" },
          {
            name: "Visiting Purpose",
            href: "/settings/visitor-management/visiting-purpose",
          },
          {
            name: "Support Staff",
            href: "/settings/visitor-management/support-staff",
          },
          {
            name: "Icons",
            href: "/settings/visitor-management/icons",
          },
        ],
      },
      {
        name: "Gate Pass",
        icon: Car,
        subItems: [
          {
            name: "Materials Type",
            href: "/security/gate-pass/materials-type",
          },
          { name: "Items Name", href: "/security/gate-pass/items-name" },
        ],
      },
    ],
  },
};

import { modulesByPackage } from "@/config/navigationConfig";
import { checkPermission } from "@/utils/dynamicNavigation";

export const Sidebar = () => {
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
  const [selectedDepartment, setSelectedRole] = useState("");
  const [selectedRole, setSelectedDepartment] = useState("");

  // Helper function to find the deepest navigable sub-item
  const findDeepestNavigableItem = (item: any): string | null => {
    if (!item.subItems || item.subItems.length === 0) {
      return item.href || null;
    }

    // Check if any sub-item has further sub-items
    for (const subItem of item.subItems) {
      if (subItem.subItems && subItem.subItems.length > 0) {
        // Recursively find the deepest item
        const deepest = findDeepestNavigableItem(subItem);
        if (deepest) return deepest;
      }
    }

    // If no deeper items, return the first sub-item's href
    return item.subItems[0]?.href || null;
  };

  // Memoize the permission check function to pass to filter
  const checkItemPermission = React.useCallback(
    (item: any) => checkPermission(item, userRole),
    [userRole]
  );

  // Filter modules based on user permissions
  const filteredModulesByPackage = React.useMemo(() => {
    if (!userRole) {
      console.log("📊 Available sidebar sections: ALL (no user role)");
      return modulesByPackage;
    }

    // Convert object to format that can be filtered
    const filtered = {};

    // Recursive function to filter subItems at ALL levels
    const filterSubItemsRecursively = (items: any[]): any[] => {
      return (
        items
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
          // After filtering children, keep item if:
          // 1. It has direct permission, OR
          // 2. It has any accessible subItems remaining (so users can navigate to them)
          .filter((item) => {
            const hasDirectPermission = checkItemPermission(item);
            const hasAccessibleSubItems =
              item.subItems && item.subItems.length > 0;

            // Detailed logging for debugging
            console.log(`🔍 Checking "${item.name}":`, {
              hasDirectPermission,
              hasAccessibleSubItems,
              subItemsCount: item.subItems?.length || 0,
              kept: hasDirectPermission || hasAccessibleSubItems,
            });

            return hasDirectPermission || hasAccessibleSubItems;
          })
      );
    };

    Object.entries(modulesByPackage).forEach(([sectionName, items]) => {
      const filteredItems = filterSubItemsRecursively(items);

      if (filteredItems.length > 0) {
        filtered[sectionName] = filteredItems;
      }
    });

    // Debug output for filtered results
    console.log("🎯 Sidebar Filtering Results:");
    Object.entries(filtered).forEach(
      ([sectionName, items]: [string, any[]]) => {
        console.log(`📦 ${sectionName}: ${items.length} items`);
        items.forEach((item) => {
          console.log(
            `  ✅ ${item.name}${item.subItems && item.subItems.length > 0 ? ` (${item.subItems.length} sub-items)` : ""}`
          );
        });
      }
    );

    return filtered;
  }, [modulesByPackage, userRole, checkItemPermission]);

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

  React.useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/settings")) {
      setCurrentSection("Settings");
    } else if (path.startsWith("/utility")) {
      setCurrentSection("Utility");
    } else if (path.startsWith("/transitioning")) {
      setCurrentSection("Transitioning");
    } else if (path.startsWith("/security")) {
      setCurrentSection("Security");
    } else if (path.startsWith("/vas")) {
      setCurrentSection("Value Added Services");
    } else if (path.startsWith("/finance")) {
      setCurrentSection("Finance");
    } else if (path.startsWith("/maintenance")) {
      setCurrentSection("Maintenance");
    } else if (path.startsWith("/safety")) {
      setCurrentSection("Safety");
    } else if (path.startsWith("/crm")) {
      setCurrentSection("CRM");
    } else if (path.startsWith("/market-place")) {
      setCurrentSection("Market Place");
    } else if (path.startsWith("/master")) {
      setCurrentSection("Master");
    }
  }, [location.pathname, setCurrentSection]);

  const currentModules = filteredModulesByPackage[currentSection] || [];

  const isActiveRoute = (href: string) => {
    const currentPath = location.pathname;
    const isActive = currentPath === href || currentPath.startsWith(href + "/");

    // Debug logging for Services
    if (href === "/maintenance/service") {
      console.log("Services route check:", {
        currentPath,
        href,
        exactMatch: currentPath === href,
        prefixMatch: currentPath.startsWith(href + "/"),
        isActive,
      });
    }

    return isActive;
  };

  // Auto-expand functionality for all sections
  React.useEffect(() => {
    // Determine which items to expand based on current route
    const path = location.pathname;
    const currentSectionItems = filteredModulesByPackage[currentSection];
    const itemsToExpand = [];

    if (currentSectionItems) {
      // Find the active item and its parent
      currentSectionItems.forEach((item) => {
        if (item.href && path.startsWith(item.href)) {
          itemsToExpand.push(item.name);
        }
        if (item.subItems) {
          item.subItems.forEach((subItem) => {
            if (subItem.href && path.startsWith(subItem.href)) {
              itemsToExpand.push(item.name); // Add parent
              itemsToExpand.push(subItem.name);

              // If there are nested items
              if ((subItem as any).subItems) {
                (subItem as any).subItems.forEach((nestedItem: any) => {
                  if (nestedItem.href && path.startsWith(nestedItem.href)) {
                    itemsToExpand.push(subItem.name);
                  }
                });
              }
            } else if ((subItem as any).subItems) {
              // Check nested items for parking management and other nested structures
              (subItem as any).subItems.forEach((nestedItem: any) => {
                if (nestedItem.href && path.startsWith(nestedItem.href)) {
                  itemsToExpand.push(item.name); // Add top parent (Value Added Services)
                  itemsToExpand.push(subItem.name); // Add middle parent (Parking Management)
                }
              });
            }
          });
        }
      });

      // Update expanded items state with only the active path
      setExpandedItems(itemsToExpand);
    }

    // Debug logging for API response structure
    if (userRole) {
      console.log("🔍 User Role API Response Structure:");

      // Check for new flat structure
      if (userRole.activeFunctions) {
        console.log(
          "📋 Active Functions (new structure):",
          userRole.activeFunctions.slice(0, 5),
          userRole.activeFunctions.length > 5
            ? `... and ${userRole.activeFunctions.length - 5} more`
            : ""
        );
      }

      // Check for old lock_modules structure
      if (userRole.lock_modules) {
        console.log(
          "📦 Lock Modules (processing ALL modules, ignoring module_active):"
        );
        userRole.lock_modules.forEach((module, idx) => {
          if (idx < 3) {
            // Show first 3 modules
            console.log(
              `  - ${module.module_name} (module_active: ${module.module_active} - IGNORED)`
            );
            if (module.lock_functions && module.lock_functions.length > 0) {
              module.lock_functions.slice(0, 2).forEach((func) => {
                console.log(
                  `    - ${func.function_name} (function_active: ${func.function_active}) ${func.function_active === 1 ? "✅ INCLUDED" : "❌ EXCLUDED"}`
                );
              });
            }
          }
        });
        if (userRole.lock_modules.length > 3) {
          console.log(
            `  ... and ${userRole.lock_modules.length - 3} more modules`
          );
        }
      }
    }

    // Debug logs (commented out to reduce console noise)
    // console.log("currentSection:", JSON.stringify({ currentSection }, null, 2));
    // console.log("itemsToExpand:", JSON.stringify({ itemsToExpand }, null, 2));
    // console.log("path:", JSON.stringify({ path }, null, 2));
    // console.log("expandedItems:", JSON.stringify({ expandedItems }, null, 2));
    // console.log("currentSectionItems:", JSON.stringify({ currentSectionItems }, null, 2));
    // console.log("locationPathname:", JSON.stringify({ locationPathname: location.pathname }, null, 2));
    console.log(
      "🔍 Debug - Safety section after filtering:",
      JSON.stringify(filteredModulesByPackage["Safety"], null, 2)
    );
    // console.log("modulesByPackage:", JSON.stringify({ modulesByPackage }, null, 2));
    // console.log("userRole:", JSON.stringify({ userRole }, null, 2));
    // console.log("hasPermissionForPath:", JSON.stringify({ hasPermissionForPath }, null, 2));
    // console.log("permissionsLoading:", JSON.stringify({ permissionsLoading }, null, 2));
  }, [currentSection, location.pathname]);

  const renderMenuItem = (item: any, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const showDropdowns =
      item.hasDropdowns && item.href && location.pathname === item.href;
    const isActive = item.href ? isActiveRoute(item.href) : false;

    // NOTE: Permission check is already done by filteredModulesByPackage
    // Items here are either: 1) have direct permission, or 2) have accessible children

    if (hasSubItems) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleExpanded(item.name)}
            className="flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative"
          >
            <div className="flex items-center gap-3">
              {level === 0 && (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                  )}
                  <item.icon className="w-5 h-5" />
                </>
              )}
              {item.name}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          {isExpanded && (
            <div className="space-y-1">
              {item.subItems.map((subItem: any) => {
                // Check permission for sub-item
                if (!checkPermission(subItem)) {
                  return null; // Don't render if no permission
                }

                return (
                  <div
                    key={subItem.name}
                    className={level === 0 ? "ml-8" : "ml-4"}
                  >
                    {subItem.subItems && subItem.subItems.length > 0 ? (
                      <div>
                        <button
                          onClick={() => toggleExpanded(subItem.name)}
                          className="flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative"
                        >
                          {subItem.href && isActiveRoute(subItem.href) && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                          )}
                          <span>{subItem.name}</span>
                          {expandedItems.includes(subItem.name) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        {expandedItems.includes(subItem.name) && (
                          <div className="ml-4 mt-1 space-y-1">
                            {subItem.subItems.map((nestedItem: any) => {
                              // Check permission for nested item
                              if (!checkPermission(nestedItem)) {
                                return null; // Don't render if no permission
                              }

                              return (
                                <button
                                  key={nestedItem.name}
                                  onClick={() =>
                                    handleNavigation(nestedItem.href)
                                  }
                                  className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-[#DBC2A9] relative ${
                                    nestedItem.color || "text-[#1a1a1a]"
                                  }`}
                                >
                                  {isActiveRoute(nestedItem.href) && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                                  )}
                                  {nestedItem.name}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          handleNavigation(subItem.href, currentSection)
                        }
                        className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${
                          subItem.color || "text-[#1a1a1a]"
                        }`}
                      >
                        {isActiveRoute(subItem.href) && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                        )}
                        {subItem.name}
                      </button>
                    )}
                  </div>
                );
              })}
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
            item.color || "text-[#1a1a1a]"
          }`}
        >
          {level === 0 && (
            <>
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
              )}
              <item.icon className="w-5 h-5" />
            </>
          )}
          {item.name}
        </button>

        {/* Show dropdowns for Roles (RACI) when on that page */}
        {showDropdowns && (
          <div className="mt-4 space-y-3 px-3">
            <div>
              <label className="text-xs font-medium text-[#1a1a1a] mb-1 block">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="!w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#C72030]"
              >
                <option value="">Select Department</option>
                <option value="engineering">Engineering</option>
                <option value="facilities">Facilities</option>
                <option value="security">Security</option>
                <option value="finance">Finance</option>
                <option value="hr">Human Resources</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#1a1a1a] mb-1 block">
                Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="!w-full px-2 py-1 text-xs border border-gray-300 rounded-md bg-white text-[#1a1a1a] focus:outline-none focus:ring-1 focus:ring-[#C72030]"
              >
                <option value="">Select Role</option>
                <option value="manager">Manager</option>
                <option value="supervisor">Supervisor</option>
                <option value="technician">Technician</option>
                <option value="coordinator">Coordinator</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };

  const CollapsedMenuItem = ({ module, level = 0 }) => {
    const hasSubItems = module.subItems && module.subItems.length > 0;
    const isExpanded = expandedItems.includes(module.name);
    const active = module.href ? isActiveRoute(module.href) : false;

    return (
      <>
        <button
          key={module.name}
          onClick={() => {
            if (hasSubItems) {
              // Navigate to the deepest navigable sub-item's href if it exists
              const deepestHref = findDeepestNavigableItem(module);
              if (deepestHref) {
                handleNavigation(deepestHref, currentSection);
              } else {
                toggleExpanded(module.name);
              }
            } else if (module.href) {
              handleNavigation(module.href, currentSection);
            }
          }}
          className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${
            active || isExpanded
              ? "bg-[#f0e8dc] shadow-inner"
              : "hover:bg-[#DBC2A9]"
          }`}
          title={module.name}
        >
          {(active || isExpanded) && (
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
          )}
          {level === 0 ? (
            <module.icon
              className={`w-5 h-5 ${
                active || isExpanded ? "text-[#C72030]" : "text-[#1a1a1a]"
              }`}
            />
          ) : (
            <div
              className={`w-${3 - level} h-${
                3 - level
              } rounded-full bg-[#1a1a1a]`}
            ></div>
          )}
        </button>
        {isExpanded &&
          hasSubItems &&
          module.subItems.map((subItem) => (
            <CollapsedMenuItem
              key={`${module.name}-${subItem.name}`}
              module={subItem}
              level={level + 1}
            />
          ))}
      </>
    );
  };

  return (
    <div
      className={`${
        isSidebarCollapsed ? "w-16" : "w-64"
      } bg-[#f6f4ee] border-r border-[#D5DbDB]  fixed left-0 top-0 overflow-y-auto transition-all duration-300`}
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
        <div className="w-full h-4 bg-[#f6f4ee]  border-[#e5e1d8] mb-2"></div>

        {currentSection && (
          <div className={`mb-4 ${isSidebarCollapsed ? "text-center" : ""}`}>
            <h3
              className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${
                isSidebarCollapsed ? "text-center" : "tracking-wide"
              }`}
            >
              {isSidebarCollapsed ? "" : currentSection}
            </h3>
          </div>
        )}

        <nav className="space-y-2">
          {permissionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-sm text-[#1a1a1a] opacity-70">
                Loading permissions...
              </div>
            </div>
          ) : currentSection === "Settings" ? (
            isSidebarCollapsed ? (
              <div className="flex flex-col items-center space-y-3 pt-4">
                {currentModules.map((module) => (
                  <CollapsedMenuItem key={module.name} module={module} />
                ))}
              </div>
            ) : (
              currentModules.map((module) => renderMenuItem(module))
            )
          ) : isSidebarCollapsed ? (
            <div className="flex flex-col items-center space-y-5 pt-4">
              {currentModules.map((module) => (
                <button
                  key={module.name}
                  onClick={() => {
                    if (module.subItems && module.subItems.length > 0) {
                      // Navigate to the deepest navigable sub-item's href if it exists
                      const deepestHref = findDeepestNavigableItem(module);
                      if (deepestHref) {
                        handleNavigation(deepestHref, currentSection);
                      } else if (module.href) {
                        handleNavigation(module.href, currentSection);
                      }
                    } else if (module.href) {
                      handleNavigation(module.href, currentSection);
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
                      isActiveRoute(module.href)
                        ? "text-[#C72030]"
                        : "text-[#1a1a1a]"
                    }`}
                  />
                </button>
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
