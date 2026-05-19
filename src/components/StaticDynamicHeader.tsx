import React, { useEffect } from "react";
import { useLayout } from "../contexts/LayoutContext";

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
  "Accounting",
];

export const StaticDynamicHeader = () => {
  const { currentSection, setCurrentSection, isSidebarCollapsed } = useLayout();

  // Check if current organization is PANCHSHIL (via hostname or localStorage)
  const hostname = window.location.hostname;
  const isPanchshilOrg =
    hostname.includes("panchshil.com") ||
    (localStorage.getItem("selectedOrg") || "")
      .toUpperCase()
      .includes("PANCHSHIL");

  // Modules to hide for PANCHSHIL organization
  const panchshilHiddenModules = ["Transitioning", "Market Place", "Accounting"];

  const visiblePackages = isPanchshilOrg
    ? packages.filter((p) => !panchshilHiddenModules.includes(p))
    : packages;

  // Note: Section is now automatically detected by LayoutProvider based on route
  // No need to manually set it here

  return (
    <div
      className={`h-12 border-b border-[#D5DbDB] fixed top-16 right-0 ${isSidebarCollapsed ? "left-0 md:left-16" : "left-0 md:left-64"} z-20 transition-all duration-300`}
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
