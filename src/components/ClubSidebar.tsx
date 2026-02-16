import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLayout } from "../contexts/LayoutContext";
import {
    Star,
    Users,
    FileText,
    Calendar,
    Bell,
    Package,
    Calculator,
    ChevronDown,
    ChevronRight,
    ChevronLeft,
    Settings,
    Lock,
    Mail,
    DollarSign,
    Shield,
    FileSpreadsheet,
} from "lucide-react";

const modulesByPackage = {
    "Club Management": [
        {
            name: "Club Membership",
            icon: Star,
            href: "/club-management/membership",
            subItems: [
                {
                    name: "Group Memberships",
                    href: "/club-management/membership/groups",
                    color: "text-[#1a1a1a]",
                },
            ],
        },
        {
            name: "User Management",
            icon: Users,
            href: "/club-management/users",
            subItems: [
                {
                    name: "Staff",
                    href: "/club-management/users/fm-users",
                    color: "text-[#1a1a1a]",
                },
                {
                    name: "Members",
                    href: "/club-management/membership",
                    color: "text-[#1a1a1a]",
                },
                {
                    name: "Guest",
                    href: "/club-management/users/guest",
                    color: "text-[#1a1a1a]",
                },
            ],
        },
        {
            name: "Ticket",
            icon: FileText,
            href: "/club-management/helpdesk",
        },
        {
            name: "Amenities Booking",
            icon: Calendar,
            href: "/club-management/amenities-booking-club",
        },
        {
            name: "Broadcast",
            icon: Bell,
            href: "/club-management/broadcast",
        },
        {
            name: "Event",
            icon: Calendar,
            href: "/club-management/events",
        },
        {
            name: "Payments",
            icon: Package,
            href: "/club-management/accounting",
        },
        // {
        //     name: "Accounting",
        //     icon: Calculator,
        //     subItems: [
        //         {
        //             name: "Accountants",
        //             icon: Users,
        //             subItems: [
        //                 { name: "Manual Journals", href: "/settings/manual-journal" },
        //                 { name: "Transactions", href: "/settings/transactions" },
        //                 { name: "Chart Of Accounts", href: "/settings/chart-journal" },
        //                 { name: "Opening Balance", href: "/settings/opening-balance" },
        //                 { name: "Budget", href: "/settings/budget" },
        //                 { name: "Tax Setup", href: "/settings/tax-setup" },
        //             ],
        //         },
        //     ],
        // },
    ],
  
    Settings: [
        {
            name: "Amenities Setup",
            icon: Calculator,
            href: "/settings/vas/booking-club/setup",
        },
        {
            name: "Membership Plan Setup",
            icon: Calculator,
            href: "/settings/vas/membership-plan/setup",
        },
        {
            name: "Accessories Setup",
            icon: Calculator,
            href: "/settings/accessories",
        },
        {
            name: "Payment Plan Setup",
            icon: Calculator,
            href: "/settings/payment-plan/setup",
        },
        {
            name: "Templates",
            icon: FileSpreadsheet,
            href: "/master/communication-template",
            subItems: [
                {
                    name: "Communication Template",
                    href: "/master/communication-template",
                    color: "text-[#1a1a1a]",
                },
                {
                    name: "Root Cause Analysis",
                    href: "/master/template/root-cause-analysis",
                    color: "text-[#1a1a1a]",
                },
                {
                    name: "Preventive Action",
                    href: "/master/template/preventive-action",
                    color: "text-[#1a1a1a]",
                },
                {
                    name: "Short-term Impact",
                    href: "/master/template/short-term-impact",
                    color: "text-[#1a1a1a]",
                },
                {
                    name: "Long-term Impact",
                    href: "/master/template/long-term-impact",
                    color: "text-[#1a1a1a]",
                },
                {
                    name: "Corrective Action",
                    href: "/master/template/corrective-action",
                    color: "text-[#1a1a1a]",
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
        { name: "FM Groups", icon: Users, href: "/settings/groups" },

        // {
        //     name: "Accountants",
        //     icon: Users,
        //     subItems: [
        //         { name: "Manual Journals ", href: "/settings/manual-journal" },
        //         { name: "Transactions ", href: "/settings/transactions" },
        //         // { name: "Recurring Journals ", href: "/settings/recurring-journal" },
        //         { name: "Chart Of Accounts ", href: "/settings/chart-journal" },
        //         { name: "Opening Balance", href: "/settings/opening-balance" },
        //         { name: "Budget", href: "/settings/budget" },
        //         { name: "Tax Setup ", href: "/settings/tax-setup" },
        //     ],
        // },

        
    ],

  Accounting: [
            {
            name: "Items",
            icon: FileText,
            subItems: [
                { name: "Items", href: "/accounting/items" },
                // { name: "Transactions ", href: "/settings/transactions" },
                // // { name: "Recurring Journals ", href: "/settings/recurring-journal" },
                // { name: "Chart Of Accounts ", href: "/settings/chart-journal" },
                // { name: "Opening Balance", href: "/settings/opening-balance" },
                // { name: "Budget", href: "/settings/budget" },
                // { name: "Tax Setup ", href: "/settings/tax-setup" },
            ],
        },

        {
            name: "Sales",
            icon: FileText,
            subItems: [
                { name: "Customers", href: "/accounting/customers" },
                { name: "Sales Order", href: "/accounting/sales-order" },
                // { name: "Transactions ", href: "/settings/transactions" },
                // // { name: "Recurring Journals ", href: "/settings/recurring-journal" },
                // { name: "Chart Of Accounts ", href: "/settings/chart-journal" },
                // { name: "Opening Balance", href: "/settings/opening-balance" },
                // { name: "Budget", href: "/settings/budget" },
                // { name: "Tax Setup ", href: "/settings/tax-setup" },
            ],
        },

         {
              name: "Purchase Orders",
              icon: FileText,
              subItems: [
                { name: "Purchase Order", href: "/accounting/purchase-order" },
                { name: "Bills", href: "/accounting/bills" },
                { name: "Recurring Bills", href: "/accounting/recurring-bills" },
                { name: "Vendor", href: "/maintenance/vendor" },
                { name: "Expense", href: "/accounting/expense" },
                { name: "Recurring Bill", href: "/accounting/recurring-bills/create" },
                { name: "Payments Made", href: "/accounting/recurring-journal" },
                // { name: "Chart Of Accounts ", href: "/settings/chart-journal" },
                // { name: "Opening Balance", href: "/settings/opening-balance" },
                // { name: "Budget", href: "/settings/budget" },
                // { name: "Tax Setup ", href: "/settings/tax-setup" },
              ],
            },
        
        {
            name: "Accountants",
            icon: Users,
            subItems: [
                { name: "Manual Journals", href: "/accounting/manual-journal" },
                { name: "Transactions", href: "/accounting/transactions" },
                { name: "Chart Of Accounts", href: "/accounting/chart-journal" },
                { name: "Opening Balance", href: "/accounting/opening-balance" },
                { name: "Budget", href: "/accounting/budget" },
                { name: "Tax Setup", href: "/accounting/tax-setup" },
            ],
        },

        {
            name: "Configuration",
            icon: Settings,
            subItems: [
                { name: "Charges ", href: "/accounting/charge-setup" },
                { name: "Bill Cycles ", href: "/accounting/bill-cycles" },
            ],
        },

        {
            name: "Reports",
            icon: FileText,
            subItems: [
                { name: "Balance Sheet", href: "/accounting/reports/balance-sheet" },
                {
                    name: "Profit & Loss",
                    href: "/accounting/reports/profit-and-loss",
                },
                {
                    name: "GST Payable",
                    href: "/accounting/reports/gst-payable",
                },
                {
                    name: "GST Receivable",
                    href: "/accounting/reports/gst-receivable",
                },
                {
                    name: "Tax Summary",
                    href: "/accounting/reports/tax-summary",
                },
            ],
        },
    ],
};

export const ClubSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isSidebarCollapsed, setIsSidebarCollapsed, currentSection, setCurrentSection } = useLayout();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpand = (name: string) => {
        setExpandedItems((prev) =>
            prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]
        );
    };

    // // Detect section based on route if not set
    // React.useEffect(() => {
    //     const path = location.pathname;
    //     if (path.startsWith("/accounting")) {
    //         setCurrentSection && setCurrentSection("Accounting");
    //     } else if (path.startsWith("/settings")) {
    //         setCurrentSection && setCurrentSection("Settings");
    //     } else {
    //         setCurrentSection && setCurrentSection("Club Management");
    //     }
    // }, [location.pathname, setCurrentSection]);


    // Get current section modules
    const currentModules = modulesByPackage[currentSection as keyof typeof modulesByPackage] || modulesByPackage["Club Management"] || [];

    const isActiveRoute = (href: string, mode: "exact" | "prefix" = "exact") => {
        const currentPath = location.pathname;
        const exactMatch = currentPath === href;
        const prefixMatch = currentPath.startsWith(href + "/");
        return mode === "prefix" ? exactMatch || prefixMatch : exactMatch;
    };

    const handleNavigation = (href: string, blank?: boolean) => {
        if (blank) {
            window.open(href, "_blank");
        } else {
            navigate(href);
        }
    };

    const renderMenuItem = (item: any) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedItems.includes(item.name);
        const isActive = item.href ? isActiveRoute(item.href, "prefix") : false;

        if (hasSubItems) {
            return (
                <div key={item.name}>
                    <button
                        onClick={() => toggleExpand(item.name)}
                        className="flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative"
                    >
                        <div className="flex items-center gap-3">
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                            )}
                            <item.icon className="w-5 h-5" />
                            <span>{item.name}</span>
                        </div>
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                            <ChevronRight className="w-4 h-4" />
                        )}
                    </button>
                    {isExpanded && (
                        <div className="ml-8 space-y-1">
                            {item.subItems.map((subItem: any) => (
                                <button
                                    key={subItem.name}
                                    onClick={() => handleNavigation(subItem.href)}
                                    className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${subItem.color || "text-[#1a1a1a]"
                                        }`}
                                >
                                    {isActiveRoute(subItem.href, "exact") && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                                    )}
                                    {subItem.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div key={item.name}>
                <button
                    onClick={() => handleNavigation(item.href, item.blank)}
                    className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${item.color || "text-[#1a1a1a]"
                        }`}
                >
                    {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                    )}
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                </button>
            </div>
        );
    };

    const CollapsedMenuItem = ({ item, level = 0 }) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedItems.includes(item.name);
        const active = item.href ? isActiveRoute(item.href, "prefix") : false;

        return (
            <>
                <button
                    key={item.name}
                    onClick={() => {
                        if (hasSubItems) {
                            toggleExpand(item.name);
                        } else if (item.href) {
                            handleNavigation(item.href, item.blank);
                        }
                    }}
                    className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${active || isExpanded ? "bg-[#f0e8dc] shadow-inner" : "hover:bg-[#DBC2A9]"
                        }`}
                    title={item.name}
                >
                    {(active || isExpanded) && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
                    )}
                    {level === 0 ? (
                        <item.icon
                            className={`w-5 h-5 ${active || isExpanded ? "text-[#C72030]" : "text-[#1a1a1a]"}`}
                        />
                    ) : (
                        <div className="w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
                    )}
                </button>
                {isExpanded &&
                    hasSubItems &&
                    item.subItems.map((subItem: any) => (
                        <CollapsedMenuItem
                            key={`${item.name}-${subItem.name}`}
                            item={subItem}
                            level={level + 1}
                        />
                    ))}
            </>
        );
    };

    return (
        <div
            className={`${isSidebarCollapsed ? "w-16" : "w-64"
                } bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto transition-all duration-300`}
            style={{ top: "4rem", height: "calc(100vh - 65px)" }}
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

                {/* Section Switcher
                {!isSidebarCollapsed && (
                    <div className="flex gap-2 mb-4">
                        <button
                            className={`text-sm font-medium px-3 py-1 rounded ${currentSection === "Club Management" ? "bg-[#DBC2A9] text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a] hover:bg-[#f0e8dc]"}`}
                            onClick={() => setCurrentSection("Club Management")}
                        >
                            Club Management
                        </button>
                        <button
                            className={`text-sm font-medium px-3 py-1 rounded ${currentSection === "Accounting" ? "bg-[#DBC2A9] text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a] hover:bg-[#f0e8dc]"}`}
                            onClick={() => setCurrentSection("Accounting")}
                        >
                            Accounting
                        </button>
                        <button
                            className={`text-sm font-medium px-3 py-1 rounded ${currentSection === "Settings" ? "bg-[#DBC2A9] text-[#1a1a1a]" : "bg-transparent text-[#1a1a1a] hover:bg-[#f0e8dc]"}`}
                            onClick={() => setCurrentSection("Settings")}
                        >
                            Settings
                        </button>
                    </div>
                )} */}

                <div className={`mb-4 ${isSidebarCollapsed ? "text-center" : ""}`}>
                    <h3
                        className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${isSidebarCollapsed ? "text-center" : "tracking-wide"}`}
                    >
                        {isSidebarCollapsed ? "" : currentSection || "Club Management"}
                    </h3>
                </div>

                <nav className="space-y-2">
                    {isSidebarCollapsed ? (
                        currentModules.map((item) => (
                            <CollapsedMenuItem key={item.name} item={item} level={0} />
                        ))
                    ) : (
                        currentModules.map((item) => renderMenuItem(item))
                    )}
                </nav>
            </div>
        </div>
    );
};

export default ClubSidebar;
