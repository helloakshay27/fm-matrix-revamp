import React from "react";
import { useLayout } from "../contexts/LayoutContext";

const sections = ["Maintenance", "Safety", "Security", "Value Added Services", "Settings"];

// Same markup as DynamicHeader — the global theme (theme.css) styles this header's tabs through
// the `fixed top-16 h-12` container and the `flex-shrink-0` buttons, so the structure and classes
// must match for the tabs to get the standard spacing and active-tab look.
export const ViDynamicHeader: React.FC = () => {
  const { currentSection, setCurrentSection, isSidebarCollapsed } = useLayout();

  // Note: Section is automatically detected by LayoutProvider based on route

  return (
    <div
      className={`h-12 border-b border-[#D5DbDB] fixed top-16 right-0 ${isSidebarCollapsed ? "left-0 md:left-16" : "left-0 md:left-64"} z-10 transition-all duration-300`}
      style={{ backgroundColor: "#f6f4ee" }}
    >
      <div className="flex items-center h-full px-4 overflow-x-auto no-scrollbar">
        <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar">
          {/* Mobile & Tablet: scroll + spacing; Desktop: full width and justify-between */}
          <div className="flex w-max lg:w-full space-x-4 md:space-x-6 lg:space-x-0 md:justify-start lg:justify-between whitespace-nowrap">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setCurrentSection(section)}
                className={`pb-3 text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  currentSection === section
                    ? "text-[#C72030] border-b-2 border-[#C72030] font-medium"
                    : "text-[#1a1a1a] opacity-70 hover:opacity-100"
                }`}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViDynamicHeader;
