
import React, { useEffect, useState } from 'react';
import { useLayout } from '../contexts/LayoutContext';
import { usePermissions } from '../contexts/PermissionsContext';
import { getActiveModuleForUser, hasAnyFunctionAccess, getAccessibleModules, getModuleForFunction } from '../utils/moduleDetection';

const packages = [
  'Transitioning',
  'Maintenance',
  'Safety',
  'Finance',
  'CRM',
  'Utility',
  'Security',
  'Value Added Services',
  'Market Place',
  'Master',
  'Settings'
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

    // Check if user has access to any functions
    const hasAccess = hasAnyFunctionAccess(userRole);
    setShouldShowHeader(hasAccess);

    if (hasAccess) {
      // Get modules user has access to
      const userAccessibleModules = getAccessibleModules(userRole);
      
      // Add default modules if not already included
      const modulesWithDefaults = [...userAccessibleModules];
      const defaultModules = ['Master', 'Settings'];
      
      defaultModules.forEach(defaultModule => {
        if (!modulesWithDefaults.includes(defaultModule)) {
          modulesWithDefaults.push(defaultModule);
        }
      });
      
      setAccessibleModules(modulesWithDefaults);

      // Debug logging
      console.log('🔍 Dynamic Header Debug:', {
        hasAccess,
        originalModules: userAccessibleModules,
        modulesWithDefaults: modulesWithDefaults,
        addedDefaults: modulesWithDefaults.filter(m => !userAccessibleModules.includes(m)),
        totalModules: userRole.lock_modules?.length,
        activeFunctions: userRole.lock_modules?.flatMap(m => 
          m.module_active === 1 ? m.lock_functions.filter(f => f.function_active === 1) : []
        ).map(f => ({ name: f.function_name, action_name: (f as any).action_name }))
      });

      // Additional debugging: Check what each function maps to
      userRole.lock_modules?.forEach(module => {
        if (module.module_active === 1) {
          module.lock_functions.forEach(func => {
            if (func.function_active === 1) {
              const mappedModule = getModuleForFunction(func.function_name);
              const mappedModuleAction = (func as any).action_name ? getModuleForFunction((func as any).action_name) : null;
              console.log(`🔍 Function Mapping: "${func.function_name}" (action: "${(func as any).action_name}") → Module: "${mappedModule}" / Action Module: "${mappedModuleAction}"`);
            }
          });
        }
      });

      // Set the active module based on user's first accessible function
      const activeModule = getActiveModuleForUser(userRole);
      if (activeModule && modulesWithDefaults.includes(activeModule)) {
        setCurrentSection(activeModule);
      } else if (modulesWithDefaults.length > 0) {
        // Fallback to first accessible module
        setCurrentSection(modulesWithDefaults[0]);
      }
      // Removed the fallback to 'Maintenance' as it was causing issues
    }
  }, [userRole, setCurrentSection]);

  // Don't render header if user has no function access or no accessible modules
  if (!shouldShowHeader || accessibleModules.length === 0) {
    console.log('🔍 Header Hidden - shouldShowHeader:', shouldShowHeader, 'accessibleModules.length:', accessibleModules.length);
    return null;
  }

  // Filter packages to only show accessible ones - STRICT filtering
  const visiblePackages = accessibleModules.length > 0 ? 
    packages.filter(pkg => {
      const isIncluded = accessibleModules.includes(pkg);
      console.log(`🔍 Package "${pkg}" - included:`, isIncluded);
      return isIncluded;
    }) : 
    []; // Show empty array if no accessible modules found

  console.log('🔍 Visible Packages Final:', visiblePackages);

  // Don't render anything if no visible packages
  if (visiblePackages.length === 0) {
    console.log('🔍 Header Hidden - No visible packages');
    return null;
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
            {visiblePackages.map((packageName) => (
              <button
                key={packageName}
                onClick={() => setCurrentSection(packageName)}
                className={`pb-3 text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  currentSection === packageName
                    ? 'text-[#C72030] border-b-2 border-[#C72030] font-medium'
                    : 'text-[#1a1a1a] opacity-70 hover:opacity-100'
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
