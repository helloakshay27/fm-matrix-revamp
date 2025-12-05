import React, { useEffect, useState } from "react";
import { useLayout } from "../contexts/LayoutContext";
import { usePermissions } from "../contexts/PermissionsContext";

const packages = [
  "Transitioning",
  "Maintenance",
  "Safety",
  "Finance",
  "CRM",
  "Utility",
  "Security",
  "Value Added Services",
  "Market Place",
  "Master",
  "Settings",
];

export const DynamicHeader = () => {
  const { currentSection, setCurrentSection, isSidebarCollapsed } = useLayout();
  const { userRole } = usePermissions();
  const [shouldShowHeader, setShouldShowHeader] = useState<boolean>(false);
  const [accessibleModules, setAccessibleModules] = useState<string[]>([]);

  // Check if user has function access and determine which modules to show
  useEffect(() => {
    if (!userRole) {
      setShouldShowHeader(false);
      setAccessibleModules([]);
      return;
    }

    // Extract active functions from the API response (IGNORING module_active, only function_active)
    const activeFunctions = [];

    if (userRole.lock_modules && Array.isArray(userRole.lock_modules)) {
      userRole.lock_modules.forEach((module) => {
        // Process ALL modules regardless of module_active status
        if (module.lock_functions && Array.isArray(module.lock_functions)) {
          module.lock_functions.forEach((func) => {
            // Only check if the individual function is active
            if (func.function_active === 1) {
              activeFunctions.push({
                functionName: func.function_name,
                actionName: func.action_name,
                moduleName: module.module_name,
              });
            }
          });
        }
      });
    }

    console.log(
      "🔍 Dynamic Header - Active Functions (IGNORING module_active):",
      activeFunctions
    );

    // If no active functions, don't show header
    if (activeFunctions.length === 0) {
      setShouldShowHeader(false);
      setAccessibleModules([]);
      return;
    }

    setShouldShowHeader(true);

    // Determine which header sections should be shown - STRICT DIRECT MATCH ONLY
    // Only use the module_name from the API response, no fallback keyword matching
    const enabledSections = new Set<string>();

    activeFunctions.forEach((activeFunc) => {
      // ONLY use API module name - DIRECT MATCH approach
      // No fallback logic - if moduleName matches a package, show it
      if (activeFunc.moduleName) {
        const apiModule = activeFunc.moduleName;
        // Check exact match or case-insensitive match against packages
        const matchedPackage = packages.find(
          (pkg) => pkg.toLowerCase() === apiModule.toLowerCase()
        );
        if (matchedPackage) {
          enabledSections.add(matchedPackage);
          console.log(
            `✅ DIRECT_MATCH: Module "${matchedPackage}" enabled via function "${activeFunc.functionName}"`
          );
        }
      }
    });

    const userAccessibleModules = Array.from(enabledSections);
    setAccessibleModules(userAccessibleModules);

    console.log("🎯 Dynamic Header Final Results:", {
      totalActiveFunctions: activeFunctions.length,
      enabledSections: userAccessibleModules,
      activeFunctionNames: activeFunctions.map((f) => f.functionName),
      activeFunctionActions: activeFunctions
        .map((f) => f.actionName)
        .filter(Boolean),
    });
  }, [userRole]);

  // Don't render header if user has no function access or no accessible modules
  if (!shouldShowHeader || accessibleModules.length === 0) {
    console.log(
      "🔍 Header Hidden - shouldShowHeader:",
      shouldShowHeader,
      "accessibleModules.length:",
      accessibleModules.length
    );
    return null;
  }

  // Filter packages to only show accessible ones - STRICT filtering
  const visiblePackages =
    accessibleModules.length > 0
      ? packages.filter((pkg) => {
          const isIncluded = accessibleModules.includes(pkg);
          console.log(`🔍 Package "${pkg}" - included:`, isIncluded);
          return isIncluded;
        })
      : []; // Show empty array if no accessible modules found

  console.log("🔍 Visible Packages Final:", visiblePackages);

  // Don't render anything if no visible packages
  if (visiblePackages.length === 0) {
    console.log("🔍 Header Hidden - No visible packages");
    return null;
  }

  return (
    <div
      className={`h-12 border-b border-[#D5DbDB] fixed top-16 right-0 ${isSidebarCollapsed ? "left-16" : "left-64"} z-10 transition-all duration-300`}
      style={{ backgroundColor: "#f6f4ee" }}
    >
      <div className="flex items-center h-full px-4 overflow-x-auto">
        <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar">
          {/* Mobile & Tablet: scroll + spacing; Desktop: full width and justify-between */}
          <div className="flex w-max lg:w-full space-x-4 md:space-x-6 lg:space-x-0 md:justify-start lg:justify-between whitespace-nowrap">
            {visiblePackages.map((packageName) => (
              <button
                key={packageName}
                onClick={() => setCurrentSection(packageName)}
                className={`pb-3 text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  currentSection === packageName
                    ? "text-[#C72030] border-b-2 border-[#C72030] font-medium"
                    : "text-[#1a1a1a] opacity-70 hover:opacity-100"
                }`}
              >
                {packageName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
