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
    "Project Task": {
        Dashboard: {
            icon: Home,
            href: "/",
            items: [],
        },
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
        "Opportunity Register": {
            icon: Target,
            href: "/vas/opportunity",
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
            href: "/maintenance/ticket",
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
            href: "/security/visitor",
            items: [],
        },
        "Visitor Setup": {
            icon: Settings,
            items: [
                { name: "Setup", href: "/settings/visitor-management/setup" },
                { name: "Visiting Purpose", href: "/settings/visitor-management/visiting-purpose" },
                { name: "Support Staff", href: "/settings/visitor-management/support-staff" },
                { name: "Icons", href: "/settings/visitor-management/icons" },
            ],
        },
    },
};

export const EmployeeSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarCollapsed, setIsSidebarCollapsed, currentSection } = useLayout();
    const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

    // Get navigation structure based on current module
    const navigationStructure = employeeNavigationByModule[currentSection] || employeeNavigationByModule["Project Task"];

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
            className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 z-40 ${isSidebarCollapsed ? "w-16" : "w-64"
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
            <div className="h-[calc(100%-80px)] overflow-y-auto py-4">{/* Adjusted for badge space */}
                <nav className="space-y-1 px-2">
                    {Object.entries(navigationStructure).map(([key, section]: [string, any]) => {
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
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isActive(sectionHref)
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
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isSectionOpen ? "bg-gray-50" : "hover:bg-gray-50"
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
                                                className={`w-4 h-4 transition-transform ${isSectionOpen ? "transform rotate-180" : ""
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
                                                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${isActive(item.href)
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

            {/* Module Badge */}
            {!isSidebarCollapsed && (
                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                        <p className="text-xs font-medium text-blue-700">{currentSection || "Employee Portal"}</p>
                        <p className="text-xs text-blue-600 mt-1">Limited Access</p>
                    </div>
                </div>
            )}
        </aside>
    );
};
