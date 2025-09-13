import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLayout } from '../contexts/LayoutContext';
import { Users, Car, Download, ChevronDown, ChevronRight, ChevronLeft, FolderTree, Trash, ChartColumnIncreasing } from 'lucide-react';

// VI-only modules mirroring Sidebar/OmanSidebar design
const modulesByPackage = {
    Maintenance: [
        {
            name: 'M-Safe',
            icon: Users,
            href: '/maintenance/m-safe',
            subItems: [
                { name: 'Internal User (FTE)', href: '/maintenance/m-safe/internal', color: 'text-[#1a1a1a]' },
                { name: 'External User (NON FTE)', href: '/maintenance/m-safe/external', color: 'text-[#1a1a1a]' },
                { name: 'LMC', href: '/maintenance/m-safe/lmc', color: 'text-[#1a1a1a]' },
                { name: 'SMT', href: '/maintenance/m-safe/smt', color: 'text-[#1a1a1a]' },
                { name: 'Krcc List', href: '/maintenance/m-safe/krcc-list', color: 'text-[#1a1a1a]' },
                { name: 'Training List', href: '/maintenance/m-safe/training-list', color: 'text-[#1a1a1a]' },
                { name: 'External Reportee Reassign', href: '/maintenance/m-safe/reportees-reassign', color: 'text-[#1a1a1a]' },
            ],
        },
        // {
        //     name: 'Vi Miles',
        //     icon: Car,
        //     href: '/maintenance/vi-miles',
        //     subItems: [
        //         { name: 'Vehicle Details', href: '/maintenance/vi-miles/vehicle-details', color: 'text-[#1a1a1a]' },
        //         { name: 'Vehicle Check In', href: '/maintenance/vi-miles/vehicle-check-in', color: 'text-[#1a1a1a]' },
        //     ],
        // },
        { name: 'Check Hierarchy Levels', icon: FolderTree, href: '/maintenance/check-hierarchy-levels' },
        { name: 'Employee Deletion History', icon: Trash, href: '/maintenance/employee-deletion-history' },


        { name: 'Msafe User Report', icon: Download, href: '/maintenance/msafe-report' },
        { name: 'Msafe Detail Report', icon: Download, href: '/maintenance/msafe-detail-report' },
        { name: 'Msafe Dashboard Report', icon: ChartColumnIncreasing, href: 'https://reports.lockated.com/vi-msafe/?token=10b1d3d490656b1e6fdb7932f1a8c125171245bcd90c177d' },

    ],
}

const ViSidebar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentSection, setCurrentSection, isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    useEffect(() => {
        // Ensure section shows Maintenance for VI routes
        if (location.pathname.startsWith('/maintenance')) {
            setCurrentSection('Maintenance');
        }
    }, [location.pathname, setCurrentSection]);

    useEffect(() => {
        if (isSidebarCollapsed) setExpandedItems([]);
    }, [isSidebarCollapsed]);

    const currentModules = modulesByPackage['Maintenance'];

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
                        {isSidebarCollapsed ? '' : 'Maintenance'}
                    </h3>
                </div>

                <nav className="space-y-2">
                    {isSidebarCollapsed ? (
                        <div className="flex flex-col items-center space-y-5 pt-4">
                            {currentModules.map((module) => (
                                <button
                                    key={module.name}
                                    onClick={() => module.href && handleNavigation(module.href)}
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
