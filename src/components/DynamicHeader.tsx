
import React, { useEffect, useMemo } from 'react';
import { useLayout } from '../contexts/LayoutContext';
import { useUser } from '../contexts/UserContext';
import { filterNavigationStructure } from '../utils/permissions';
import sidebarConfig from '../config/sidebarConfig.json';

export const DynamicHeader = () => {
  const { currentSection, setCurrentSection, isSidebarCollapsed } = useLayout();
  const { permissions, isLoading, error } = useUser();

  // Get available modules based on user permissions
  const availableModules = useMemo(() => {
    if (isLoading || Object.keys(permissions).length === 0) {
      return [];
    }
    
    try {
      const filteredModules = filterNavigationStructure(sidebarConfig.navigationStructure, permissions);
      const moduleNames = Object.keys(filteredModules);
      
      console.log('[DynamicHeader] Available modules:', moduleNames);
      return moduleNames;
    } catch (error) {
      console.error('[DynamicHeader] Error filtering modules:', error);
      return [];
    }
  }, [permissions, isLoading]);

  // Set first available module as default when modules are loaded
  useEffect(() => {
    if (availableModules.length > 0 && !currentSection) {
      const defaultModule = availableModules[0];
      console.log('[DynamicHeader] Setting default module:', defaultModule);
      setCurrentSection(defaultModule);
    }
  }, [availableModules, currentSection, setCurrentSection]);

  // Show loading state
  if (isLoading) {
    return (
      <div
        className={`h-12 border-b border-[#D5DbDB] fixed top-16 right-0 ${isSidebarCollapsed ? 'left-16' : 'left-64'} z-10 transition-all duration-300`}
        style={{ backgroundColor: '#f6f4ee' }}
      >
        <div className="flex items-center h-full px-4">
          <div className="text-sm text-gray-500">Loading navigation...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className={`h-12 border-b border-[#D5DbDB] fixed top-16 right-0 ${isSidebarCollapsed ? 'left-16' : 'left-64'} z-10 transition-all duration-300`}
        style={{ backgroundColor: '#f6f4ee' }}
      >
        <div className="flex items-center h-full px-4">
          <div className="text-sm text-red-500">Error loading navigation: {error}</div>
        </div>
      </div>
    );
  }

  // Show no modules state
  if (availableModules.length === 0) {
    return (
      <div
        className={`h-12 border-b border-[#D5DbDB] fixed top-16 right-0 ${isSidebarCollapsed ? 'left-16' : 'left-64'} z-10 transition-all duration-300`}
        style={{ backgroundColor: '#f6f4ee' }}
      >
        <div className="flex items-center h-full px-4">
          <div className="text-sm text-gray-500">No modules available</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-12 border-b border-[#D5DbDB] fixed top-16 right-0 ${isSidebarCollapsed ? 'left-16' : 'left-64'} z-10 transition-all duration-300`}
      style={{ backgroundColor: '#f6f4ee' }}
    >
      <div className="flex items-center h-full px-4 overflow-x-auto">
        <div className="w-full overflow-x-auto md:overflow-visible no-scrollbar">
          {/* Mobile & Tablet: scroll + spacing; Desktop: full width and justify-between */}
          <div className="flex w-max lg:w-full space-x-4 md:space-x-6 lg:space-x-0 md:justify-start lg:justify-between whitespace-nowrap">
            {availableModules.map((moduleName) => (
              <button
                key={moduleName}
                onClick={() => setCurrentSection(moduleName)}
                className={`pb-3 text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  currentSection === moduleName
                    ? 'text-[#C72030] border-b-2 border-[#C72030] font-medium'
                    : 'text-[#1a1a1a] opacity-70 hover:opacity-100'
                }`}
              >
                {moduleName}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
