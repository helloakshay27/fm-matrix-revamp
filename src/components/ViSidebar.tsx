import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { Users, Car, Download, ChevronDown, ChevronRight, ChevronLeft, FolderTree, Trash, ChartColumnIncreasing, FileText, Calendar, User, Target, Wrench, UserCheck, Shield, Star, Circle } from 'lucide-react';

interface ModuleItem {
    name: string;
    icon?: any;
    href?: string;
    subItems?: ModuleItem[];
    color?: string;
}

// VI-only modules mirroring Sidebar/OmanSidebar design
const modulesByPackage: Record<string, ModuleItem[]> = {
    Maintenance: [
        { name: "Ticket", icon: FileText, href: "/maintenance/ticket" },
    ],
    "Value Added Services": [
        {
            name: "Booking",
            icon: Calendar,
            href: "/vas/booking/list",
        },
        {
            name: "Vi Miles",
            icon: User,
            href: "/safety/vi-miles",
            subItems: [
                {
                    name: "Vehicle Details",
                    href: "/safety/vi-miles/vehicle-details",
                    color: "text-[#1a1a1a]",
                },
                {
                    name: "Vehicle Check In",
                    href: "/safety/vi-miles/vehicle-check-in",
                    color: "text-[#1a1a1a]",
                },
            ],
        },
    ],
    Security: [
        { name: "Visitor", icon: Users, href: "/security/visitor" },
    ],
    Safety: [
        {
            name: 'M-Safe',
            icon: Users,
            href: '/safety/m-safe',
            subItems: [
                { name: 'Internal User (FTE)', href: '/safety/m-safe/internal', color: 'text-[#1a1a1a]' },
                { name: 'External User (NON FTE)', href: '/safety/m-safe/external', color: 'text-[#1a1a1a]' },
                { name: 'LMC', href: '/safety/m-safe/lmc', color: 'text-[#1a1a1a]' },
                { name: 'SMT', href: '/safety/m-safe/smt', color: 'text-[#1a1a1a]' },
                { name: 'Krcc List', href: '/safety/m-safe/krcc-list', color: 'text-[#1a1a1a]' },
                { name: 'Training List', href: '/safety/m-safe/training-list', color: 'text-[#1a1a1a]' },
                { name: 'External Reportee Reassign', href: '/safety/m-safe/reportees-reassign', color: 'text-[#1a1a1a]' },
            ],
        },
        {
            name: 'Report',
            icon: Download,
            href: '/safety',
            subItems: [
                { name: 'Msafe User Report', icon: Download, href: '/safety/report/msafe-report' },
                { name: 'Msafe Detail Report', icon: Download, href: '/safety/report/msafe-detail-report' },
            ],
        },
        // {
        //     name: 'Vi Miles',
        //     icon: Car,
        //     href: '/safety/vi-miles',
        //     subItems: [
        //         { name: 'Vehicle Details', href: '/safety/vi-miles/vehicle-details', color: 'text-[#1a1a1a]' },
        //         { name: 'Vehicle Check In', href: '/safety/vi-miles/vehicle-check-in', color: 'text-[#1a1a1a]' },
        //     ],
        // },
        { name: 'Check Hierarchy Levels', icon: FolderTree, href: '/safety/check-hierarchy-levels' },
        { name: 'Employee Deletion History', icon: Trash, href: '/safety/employee-deletion-history' },
        // { name: 'Msafe Dashboard Report', icon: ChartColumnIncreasing, href: 'https://reports.lockated.com/vi-msafe/?token=10b1d3d490656b1e6fdb7932f1a8c125171245bcd90c177d' },

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
                {
                    name: "Safety",
                    href: "/settings/safety",
                    subItems: [
                        { name: "Permit Setup", href: "/settings/safety/permit-setup" },
                        { name: "Incident Setup", href: "/settings/safety/incident" },
                    ],
                },
            ],
        },
        {
            name: "Security",
            icon: Shield,
            href: "/settings/security",
            subItems: [
                {
                    name: "Visitor Management",
                    href: "/settings/visitor-management/setup",
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
                        { name: "Icons", href: "/settings/visitor-management/icons" },
                    ],
                },
                {
                    name: "Gate Pass",
                    href: "/security/gate-pass",
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
        {
            name: "Value Added Services",
            icon: Star,
            href: "/settings/vas",
            subItems: [
                {
                    name: "Booking",
                    href: "/settings/vas/booking/setup",
                },
            ],
        },
        {
            icon: Circle,
            name: "Circle",
            href: "/safety/m-safe/circle",
        },
    ]
}

const ViSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentSection, setCurrentSection, isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

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

    useEffect(() => {
        // Ensure section shows Safety for VI routes
        if (location.pathname.startsWith('/safety')) {
            setCurrentSection('Safety');
        }
    }, [location.pathname, setCurrentSection]);

    useEffect(() => {
        if (isSidebarCollapsed) setExpandedItems([]);
    }, [isSidebarCollapsed]);

    // Get modules based on current section
    const currentModules = modulesByPackage[currentSection as keyof typeof modulesByPackage] || modulesByPackage['Safety'];

    const toggleExpanded = (name: string) =>
        setExpandedItems((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));

    const isActiveRoute = (href: string) => {
        const p = location.pathname;
        return p === href || p.startsWith(href + '/');
    };

    const handleNavigation = (href: string) => {
        if (!href) return;
        if (/^https?:\/\//i.test(href)) {
            window.open(href, '_blank', 'noopener,noreferrer');
        } else {
            navigate(href);
        }
    };

    const renderItem = (item: any, level = 0) => {
        const hasSub = Array.isArray(item.subItems) && item.subItems.length > 0;
        const expanded = expandedItems.includes(item.name);

        const isActiveRoute = (href: string) => {
            const p = location.pathname;
            return p === href || p.startsWith(href + '/');
        };

        // Check active status recursively for parents or if this item is active
        const isActive = item.href ? isActiveRoute(item.href) : false;

        // Check if any descendant is active
        const isChildActive = (items: any[]): boolean => {
            return items.some(sub =>
                (sub.href && isActiveRoute(sub.href)) ||
                (sub.subItems && isChildActive(sub.subItems))
            );
        };
        const hasActiveChild = hasSub && isChildActive(item.subItems);

        if (hasSub) {
            return (
                <div key={item.name} className="w-full">
                    <button
                        onClick={() => toggleExpanded(item.name)}
                        className={`flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative
                            ${level === 0 ? 'font-bold' : 'font-medium'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            {/* Level 0 Active Indicator */}
                            {level === 0 && (isActive || hasActiveChild) && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                            )}

                            {/* Level 0 Icon */}
                            {level === 0 && item.icon && (
                                <item.icon className={`w-5 h-5 ${(isActive || hasActiveChild) ? 'text-[#C72030]' : ''}`} />
                            )}

                            <span className={`${(level === 0 && (isActive || hasActiveChild)) ? 'text-[#C72030]' : ''}`}>
                                {item.name}
                            </span>
                        </div>
                        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {expanded && (
                        <div className="space-y-1 mt-1">
                            {item.subItems.map((sub: any) => (
                                <div key={sub.name} className={level < 1 ? 'ml-4' : 'ml-4'}>
                                    {renderItem(sub, level + 1)}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div key={item.name} className="w-full">
                <button
                    onClick={() => item.href && handleNavigation(item.href)}
                    className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${item.color || 'text-[#1a1a1a]'}
                        ${isActive ? 'bg-[#f0e8dc] shadow-inner' : ''}
                    `}
                >
                    {level === 0 && (
                        <>
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>}
                            {item.icon && <item.icon className={`w-5 h-5 ${isActive ? 'text-[#C72030]' : ''}`} />}
                        </>
                    )}

                    {/* Nested Active Indicator */}
                    {level > 0 && isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                    )}

                    <span className={`${isActive ? 'text-[#C72030]' : ''}`}>
                        {item.name}
                    </span>
                </button>
            </div>
        );
    };

    return (
        <div
            className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-[#f6f4ee] border-r border-\[\#D5DbDB\]  fixed left-0 top-0 overflow-y-auto transition-all duration-300`}
            style={{ top: '4rem', height: '91vh' }}
        >
            <div className={`${isSidebarCollapsed ? 'px-2 py-2' : 'p-2'}`}>
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
                <div className="w-full h-4 bg-[#f6f4ee]  border-[#e5e1d8] mb-2"></div>

                <div className={`mb-4 ${isSidebarCollapsed ? 'text-center' : ''}`}>
                    <h3
                        className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${isSidebarCollapsed ? 'text-center' : 'tracking-wide'
                            }`}
                    >
                        {isSidebarCollapsed ? '' : currentSection}
                    </h3>
                </div>

                <nav className="space-y-2">
                    {isSidebarCollapsed ? (
                        <div className="flex flex-col items-center space-y-5 pt-4">
                            {currentModules.map((module) => (
                                <button
                                    key={module.name}
                                    onClick={() => {
                                        if (module.subItems && module.subItems.length > 0) {
                                            // Navigate to the deepest navigable sub-item's href if it exists
                                            const deepestHref = findDeepestNavigableItem(module);
                                            if (deepestHref) {
                                                handleNavigation(deepestHref);
                                            } else if (module.href) {
                                                handleNavigation(module.href);
                                            }
                                        } else if (module.href) {
                                            handleNavigation(module.href);
                                        }
                                    }}
                                    className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${isActiveRoute(module.href)
                                        ? 'bg-[#f0e8dc] shadow-inner'
                                        : 'hover:bg-[#DBC2A9]'
                                        }`}
                                    title={module.name}
                                >
                                    {isActiveRoute(module.href) && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
                                    )}
                                    <module.icon
                                        className={`w-5 h-5 ${isActiveRoute(module.href) ? 'text-[#C72030]' : 'text-[#1a1a1a]'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    ) : (
                        currentModules.map((module) => renderItem(module))
                    )}
                </nav>
            </div>
        </div>
    );
};

export default ViSidebar;
