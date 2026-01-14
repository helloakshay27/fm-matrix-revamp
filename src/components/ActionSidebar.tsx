import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useActionLayout } from "../contexts/ActionLayoutContext";
import { useLayout } from "../contexts/LayoutContext";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const ActionSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        currentModule,
        getModuleFunctions,
        setCurrentFunction,
        isActionSidebarVisible,
    } = useActionLayout();
    const { isSidebarCollapsed, setIsSidebarCollapsed } = useLayout();

    // Don't render if not visible or no module selected
    if (!isActionSidebarVisible || !currentModule) {
        return null;
    }

    const moduleFunctions = getModuleFunctions(currentModule);

    // Don't render if no functions available
    if (moduleFunctions.length === 0) {
        return null;
    }

    const handleNavigation = (link: string, functionName: string) => {
        setCurrentFunction(functionName);
        navigate(link);
    };

    const isActiveRoute = (link: string) => {
        const currentPath = location.pathname;
        return currentPath === link || currentPath.startsWith(link + "/");
    };

    const renderFunctionItem = (func: any) => {
        const isActive = func.react_link ? isActiveRoute(func.react_link) : false;

        return (
            <button
                key={func.function_id}
                onClick={() => {
                    if (func.react_link) {
                        handleNavigation(func.react_link, func.function_name);
                    }
                }}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-[#DBC2A9] relative ${isActive
                        ? "bg-[#f0e8dc] text-[#C72030]"
                        : "text-[#1a1a1a]"
                    }`}
                title={func.function_name}
            >
                {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
                )}
                <span>{func.function_name}</span>
            </button>
        );
    };

    const CollapsedFunctionItem = ({ func }: { func: any }) => {
        const isActive = func.react_link ? isActiveRoute(func.react_link) : false;

        return (
            <button
                onClick={() => {
                    if (func.react_link) {
                        handleNavigation(func.react_link, func.function_name);
                    }
                }}
                className={`flex items-center justify-center p-2 rounded-lg relative transition-all duration-200 ${isActive
                        ? "bg-[#f0e8dc] shadow-inner"
                        : "hover:bg-[#DBC2A9]"
                    }`}
                title={func.function_name}
            >
                {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#C72030]"></div>
                )}
                <div
                    className={`w-2 h-2 rounded-full ${isActive ? "bg-[#C72030]" : "bg-[#1a1a1a]"
                        }`}
                ></div>
            </button>
        );
    };

    return (
        <div
            className={`${isSidebarCollapsed ? "w-16" : "w-64"
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

                {currentModule && (
                    <div className={`mb-4 ${isSidebarCollapsed ? "text-center" : ""}`}>
                        <h3
                            className={`text-sm font-medium text-[#1a1a1a] opacity-70 uppercase ${isSidebarCollapsed ? "text-center" : "tracking-wide"
                                }`}
                        >
                            {isSidebarCollapsed ? "" : currentModule}
                        </h3>
                    </div>
                )}

                <nav className="space-y-2">
                    {isSidebarCollapsed ? (
                        <div className="flex flex-col items-center space-y-5 pt-4">
                            {moduleFunctions.map((func) => (
                                <CollapsedFunctionItem key={func.function_id} func={func} />
                            ))}
                        </div>
                    ) : (
                        moduleFunctions.map((func) => renderFunctionItem(func))
                    )}
                </nav>
            </div>
        </div>
    );
};
