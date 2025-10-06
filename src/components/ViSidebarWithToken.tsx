import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { Users, Car, Download, ChevronDown, ChevronRight, ChevronLeft, FolderTree, Trash, ChartColumnIncreasing } from 'lucide-react';
import { saveToken, saveUser, getToken, isAuthenticated } from '../utils/auth';




// VI-only modules mirroring Sidebar/OmanSidebar design
const modulesByPackage = {
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
            href: '/safety/report',
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


        // { name: 'Msafe User Report', icon: Download, href: '/safety/msafe-report' },
        // { name: 'Msafe Detail Report', icon: Download, href: '/safety/msafe-detail-report' },
        // { name: 'Msafe Dashboard Report', icon: ChartColumnIncreasing, href: 'https://reports.lockated.com/vi-msafe/?token=10b1d3d490656b1e6fdb7932f1a8c125171245bcd90c177d' },

    ],
}

const ViSidebarWithToken: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentSection, setCurrentSection, isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [hasValidToken, setHasValidToken] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const access_token = query.get("access_token");
        const company_id = query.get("company_id");
        const user_id = query.get("user_id");

        console.log('VI Sidebar Token Check:', { access_token: access_token ? 'Present' : 'Missing', company_id, user_id });

        if (access_token) {
            // Store token using auth utility
            saveToken(access_token);

            // Store company and user data
            if (company_id) {
                localStorage.setItem("selectedCompanyId", String(company_id));
            }
            if (user_id) {
                localStorage.setItem("user_id", String(user_id));

                // Create a basic user object for VI with token access
                const viUser = {
                    id: parseInt(user_id),
                    email: '', // VI access might not have email
                    firstname: 'VI',
                    lastname: 'User',
                    access_token: access_token,
                    user_type: 'vi_token_user'
                };
                saveUser(viUser);
            }

            setHasValidToken(true);
        } else {
            // Check if token exists from previous session
            const existingToken = getToken();
            setHasValidToken(!!existingToken);
        }

        setIsLoading(false);
    }, [location.search]);

    // Ensure section shows Safety for VI routes (must be before any returns to keep hook order stable)
    useEffect(() => {
        if (location.pathname.startsWith('/safety')) {
            setCurrentSection('Safety');
        }
    }, [location.pathname, setCurrentSection]);

    // Keep expanded items in sync with collapsed state (also before any returns)
    useEffect(() => {
        if (isSidebarCollapsed) setExpandedItems([]);
    }, [isSidebarCollapsed]);

    // Auto-expand M-Safe on first load only (per browser tab via sessionStorage) when landing under /safety/m-safe
    useEffect(() => {
        if (isLoading || !hasValidToken) return;
        const FLAG_KEY = 'vi_safety_auto_expanded_once';
        if (!sessionStorage.getItem(FLAG_KEY)) {
            const p = location.pathname || '';
            const groupToExpand = p.startsWith('/safety/m-safe') ? 'M-Safe' : null;

            // Ensure the sidebar is open so expansion is visible
            if (isSidebarCollapsed) {
                setIsSidebarCollapsed(false);
            }

        if (groupToExpand) {
                // Slight defer to allow collapse state to update before expanding
                setTimeout(() => {
                    setExpandedItems((prev) => (prev.includes(groupToExpand) ? prev : [...prev, groupToExpand]));
                }, 0);
            }
            sessionStorage.setItem(FLAG_KEY, '1');
        }
    }, [isLoading, hasValidToken, location.pathname, isSidebarCollapsed, setIsSidebarCollapsed]);

    // Don't render sidebar if no valid token
    if (isLoading) {
        return (
            <div className="w-16 bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto transition-all duration-300"
                style={{ top: '4rem', height: '91vh' }}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-sm text-gray-500">Loading...</div>
                </div>
            </div>
        );
    }

    if (!hasValidToken) {
        return (
            <div className="w-16 bg-[#f6f4ee] border-r border-[#D5DbDB] fixed left-0 top-0 overflow-y-auto transition-all duration-300"
                style={{ top: '4rem', height: '91vh' }}>
                <div className="flex items-center justify-center h-full">
                    <div className="text-xs text-red-500 text-center px-2">
                        Access Token Required
                    </div>
                </div>
            </div>
        );
    }
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

    const currentModules = Array.isArray(modulesByPackage['Safety']) ? modulesByPackage['Safety'] : [];

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
        const active = item.href ? isActiveRoute(item.href) : false;

        if (hasSub) {
            return (
                <div key={item.name}>
                    <button
                        onClick={() => toggleExpanded(item.name)}
                        className="flex items-center justify-between !w-full gap-3 px-3 py-2 rounded-lg text-sm font-bold transition-colors text-[#1a1a1a] hover:bg-[#DBC2A9] hover:text-[#1a1a1a] relative"
                    >
                        <div className="flex items-center gap-3">
                            {level === 0 && (
                                <>
                                    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>}
                                    <item.icon className="w-5 h-5" />
                                </>
                            )}
                            {item.name}
                        </div>
                        {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                    {expanded && (
                        <div className="space-y-1">
                            {item.subItems.map((sub: any) => (
                                <div key={sub.name} className={level === 0 ? 'ml-8' : 'ml-4'}>
                                    <button
                                        onClick={() => handleNavigation(sub.href)}
                                        className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${sub.color || 'text-[#1a1a1a]'
                                            }`}
                                    >
                                        {isActiveRoute(sub.href) && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>
                                        )}
                                        {sub.name}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div key={item.name}>
                <button
                    onClick={() => item.href && handleNavigation(item.href)}
                    className={`flex items-center gap-3 !w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${item.color || 'text-[#1a1a1a]'
                        }`}
                >
                    {level === 0 && (
                        <>
                            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#C72030]"></div>}
                            <item.icon className="w-5 h-5" />
                        </>
                    )}
                    {item.name}
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
                        {isSidebarCollapsed ? '' : 'Safety'}
                    </h3>
                </div>

                <nav className="space-y-2">
                    {isSidebarCollapsed ? (
                        <div className="flex flex-col items-center space-y-5 pt-4">
                            {(Array.isArray(currentModules) ? currentModules : []).map((module) => (
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
                        (Array.isArray(currentModules) ? currentModules : []).map((module) => renderItem(module))
                    )}
                </nav>
            </div>
        </div>
    );
};

export default ViSidebarWithToken;
