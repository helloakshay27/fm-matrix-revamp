import React from "react";
import { useActionLayout } from "../contexts/ActionLayoutContext";
import { useLayout } from "../contexts/LayoutContext";

export const ActionHeader = () => {
  const {
    currentModule,
    availableModules,
    setCurrentModule,
    isActionSidebarVisible,
  } = useActionLayout();
  const { isSidebarCollapsed } = useLayout();

  // Filter out employee-specific modules
  const filteredModules = availableModules.filter(
    (module) =>
      module.module_name !== "Employee Sidebar" &&
      module.module_name !== "Employee Projects Sidebar"
  );

  // Sort modules to ensure Master is second-to-last and Settings is last
  const sortedModules = React.useMemo(() => {
    const modules = [...filteredModules];

    // Find Master and Settings modules
    const masterIndex = modules.findIndex(
      (m) =>
        m.module_name.toLowerCase() === "master" ||
        m.module_name.toLowerCase() === "masters"
    );
    const settingsIndex = modules.findIndex(
      (m) => m.module_name.toLowerCase() === "settings"
    );

    // Remove Master and Settings from their current positions
    let masterModule = null;
    let settingsModule = null;

    if (masterIndex !== -1) {
      masterModule = modules.splice(masterIndex, 1)[0];
    }

    // Adjust settingsIndex if master was before it
    const adjustedSettingsIndex =
      settingsIndex > masterIndex && masterIndex !== -1
        ? settingsIndex - 1
        : settingsIndex;

    if (adjustedSettingsIndex !== -1) {
      settingsModule = modules.splice(adjustedSettingsIndex, 1)[0];
    }

    // Add Master second-to-last, then Settings last
    if (masterModule) {
      modules.push(masterModule);
    }
    if (settingsModule) {
      modules.push(settingsModule);
    }

    return modules;
  }, [filteredModules]);

  // Don't render if action sidebar is not visible
  if (!isActionSidebarVisible || sortedModules.length === 0) {
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
            {sortedModules.map((module) => (
              <button
                key={module.module_id}
                onClick={() => setCurrentModule(module.module_name)}
                className={`pb-3 text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  currentModule === module.module_name
                    ? "text-[#C72030] border-b-2 border-[#C72030] font-medium"
                    : "text-[#1a1a1a] opacity-70 hover:opacity-100"
                }`}
              >
                {module.module_name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
