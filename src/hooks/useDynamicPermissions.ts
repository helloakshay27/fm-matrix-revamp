import { useMemo } from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';
import { ModulePermissions, FunctionInfo } from '@/services/permissionCacheService';
import { SubFunction } from '@/services/permissionService';

export interface DynamicPermissionHook {
  // Module-level methods
  getEnabledModules: () => ModulePermissions[];
  isModuleAccessible: (moduleName: string) => boolean;
  
  // Function-level methods
  getModuleFunctions: (moduleName: string) => FunctionInfo[];
  isFunctionAccessible: (moduleName: string, functionName: string) => boolean;
  
  // Sub-function level methods
  getFunctionSubFunctions: (moduleName: string, functionName: string) => SubFunction[];
  isSubFunctionAccessible: (moduleName: string, functionName: string, subFunctionName: string) => boolean;
  
  // Utility methods
  hasAnyPermission: (moduleName: string, functionName?: string, subFunctionName?: string) => boolean;
  findModuleByName: (moduleName: string) => ModulePermissions | undefined;
  findFunctionByName: (moduleName: string, functionName: string) => FunctionInfo | undefined;
  
  // Dynamic button/UI helpers
  shouldShowModule: (moduleName: string) => boolean;
  shouldShowFunction: (moduleName: string, functionName: string) => boolean;
  shouldShowSubFunction: (moduleName: string, functionName: string, subFunctionName: string) => boolean;
  
  // Bulk permission checks
  filterEnabledItems: <T extends { name: string; module?: string; function?: string }>(
    items: T[], 
    options?: { module?: string; function?: string }
  ) => T[];
}

/**
 * Hook for dynamic permission management with caching
 * Provides efficient methods to check permissions and manage UI visibility
 */
export const useDynamicPermissions = (): DynamicPermissionHook => {
  const {
    getModulePermissions,
    getModuleFunctions: getModuleFunctionsFromContext,
    getFunctionSubFunctions: getFunctionSubFunctionsFromContext,
    hasPermission,
    isModuleEnabled,
    isFunctionEnabled,
    isSubFunctionEnabled
  } = usePermissions();

  return useMemo(() => {
    const getEnabledModules = (): ModulePermissions[] => {
      return getModulePermissions().filter(module => module.enabled);
    };

    const isModuleAccessible = (moduleName: string): boolean => {
      return isModuleEnabled(moduleName);
    };

    const getModuleFunctions = (moduleName: string): FunctionInfo[] => {
      return getModuleFunctionsFromContext(moduleName);
    };

    const isFunctionAccessible = (moduleName: string, functionName: string): boolean => {
      return isFunctionEnabled(moduleName, functionName);
    };

    const getFunctionSubFunctions = (moduleName: string, functionName: string): SubFunction[] => {
      return getFunctionSubFunctionsFromContext(moduleName, functionName);
    };

    const isSubFunctionAccessible = (moduleName: string, functionName: string, subFunctionName: string): boolean => {
      return isSubFunctionEnabled(moduleName, functionName, subFunctionName);
    };

    const hasAnyPermission = (moduleName: string, functionName?: string, subFunctionName?: string): boolean => {
      return hasPermission(moduleName, functionName, subFunctionName);
    };

    const findModuleByName = (moduleName: string): ModulePermissions | undefined => {
      const modules = getModulePermissions();
      return modules.find(module => 
        module.module_name.toLowerCase() === moduleName.toLowerCase()
      );
    };

    const findFunctionByName = (moduleName: string, functionName: string): FunctionInfo | undefined => {
      const functions = getModuleFunctions(moduleName);
      return functions.find(func => 
        func.function_name.toLowerCase() === functionName.toLowerCase() ||
        func.action_name?.toLowerCase() === functionName.toLowerCase()
      );
    };

    // UI visibility helpers
    const shouldShowModule = (moduleName: string): boolean => {
      return isModuleAccessible(moduleName);
    };

    const shouldShowFunction = (moduleName: string, functionName: string): boolean => {
      return shouldShowModule(moduleName) && isFunctionAccessible(moduleName, functionName);
    };

    const shouldShowSubFunction = (moduleName: string, functionName: string, subFunctionName: string): boolean => {
      return shouldShowFunction(moduleName, functionName) && 
             isSubFunctionAccessible(moduleName, functionName, subFunctionName);
    };

    // Bulk filtering helper
    const filterEnabledItems = <T extends { name: string; module?: string; function?: string }>(
      items: T[], 
      options: { module?: string; function?: string } = {}
    ): T[] => {
      return items.filter(item => {
        const moduleName = options.module || item.module;
        const functionName = options.function || item.function;
        
        if (!moduleName) return true; // No module restriction
        
        if (!shouldShowModule(moduleName)) return false;
        
        if (functionName && !shouldShowFunction(moduleName, functionName)) return false;
        
        return true;
      });
    };

    return {
      getEnabledModules,
      isModuleAccessible,
      getModuleFunctions,
      isFunctionAccessible,
      getFunctionSubFunctions,
      isSubFunctionAccessible,
      hasAnyPermission,
      findModuleByName,
      findFunctionByName,
      shouldShowModule,
      shouldShowFunction,
      shouldShowSubFunction,
      filterEnabledItems
    };
  }, [
    getModulePermissions,
    getModuleFunctionsFromContext,
    getFunctionSubFunctionsFromContext,
    hasPermission,
    isModuleEnabled,
    isFunctionEnabled,
    isSubFunctionEnabled
  ]);
};

/**
 * Hook for permission-based component rendering
 * Provides simple boolean checks for conditional rendering
 */
export const usePermissionGuard = () => {
  const { shouldShowModule, shouldShowFunction, shouldShowSubFunction } = useDynamicPermissions();

  return {
    /**
     * Higher-order component for permission-based rendering
     */
    withPermission: (
      moduleName: string, 
      functionName?: string, 
      subFunctionName?: string
    ) => (component: React.ReactNode) => {
      if (subFunctionName && functionName) {
        return shouldShowSubFunction(moduleName, functionName, subFunctionName) ? component : null;
      }
      if (functionName) {
        return shouldShowFunction(moduleName, functionName) ? component : null;
      }
      return shouldShowModule(moduleName) ? component : null;
    },

    /**
     * Check if user can access a specific permission level
     */
    canAccess: (moduleName: string, functionName?: string, subFunctionName?: string): boolean => {
      if (subFunctionName && functionName) {
        return shouldShowSubFunction(moduleName, functionName, subFunctionName);
      }
      if (functionName) {
        return shouldShowFunction(moduleName, functionName);
      }
      return shouldShowModule(moduleName);
    }
  };
};
