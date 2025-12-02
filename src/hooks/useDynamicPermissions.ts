import { useMemo } from "react";
import { usePermissions } from "@/contexts/PermissionsContext";
import {
  ModulePermissions,
  FunctionInfo,
} from "@/services/permissionCacheService";
import { SubFunction } from "@/services/permissionService";

export interface DynamicPermissionHook {
  // Module-level methods
  getEnabledModules: () => ModulePermissions[];
  isModuleAccessible: (moduleName: string) => boolean;

  // Function-level methods (updated for new logic)
  getModuleFunctions: (moduleName: string) => FunctionInfo[];
  isFunctionAccessible: (moduleName: string, functionName: string) => boolean;

  // Sub-function level methods (updated for new logic)
  getFunctionSubFunctions: (
    moduleName: string,
    functionName: string
  ) => SubFunction[];
  isSubFunctionAccessible: (
    moduleName: string,
    functionName: string,
    subFunctionName: string
  ) => boolean;

  // NEW: Function-only methods (ignoring module)
  isFunctionAccessibleByName: (functionName: string) => boolean;
  isSubFunctionAccessibleByName: (
    functionName: string,
    subFunctionName: string
  ) => boolean;

  // Utility methods
  hasAnyPermission: (
    moduleName: string,
    functionName?: string,
    subFunctionName?: string
  ) => boolean;
  findModuleByName: (moduleName: string) => ModulePermissions | undefined;
  findFunctionByName: (
    moduleName: string,
    functionName: string
  ) => FunctionInfo | undefined;

  // Dynamic button/UI helpers (updated for new logic)
  shouldShowModule: (moduleName: string) => boolean;
  shouldShowFunction: (moduleName: string, functionName: string) => boolean;
  shouldShowSubFunction: (
    moduleName: string,
    functionName: string,
    subFunctionName: string
  ) => boolean;

  // NEW: Simple function-based helpers (no module required)
  shouldShow: (functionName: string, subFunctionName?: string) => boolean;

  // Bulk permission checks
  filterEnabledItems: <
    T extends { name: string; module?: string; function?: string },
  >(
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
    userRole,
    isModuleEnabled,
    isFunctionEnabled,
    isSubFunctionEnabled,
    isFunctionEnabledAnywhere,
    isSubFunctionEnabledAnywhere,
    hasPermissionForPath,
  } = usePermissions();

  return useMemo(() => {
    const getEnabledModules = (): ModulePermissions[] => {
      // For backward compatibility, return empty array - this needs userRole.lock_modules
      return [];
    };

    const isModuleAccessible = (moduleName: string): boolean => {
      return isModuleEnabled(moduleName);
    };

    const getModuleFunctions = (moduleName: string): FunctionInfo[] => {
      // For backward compatibility, return empty array - this needs userRole.lock_modules
      return [];
    };

    const isFunctionAccessible = (
      moduleName: string,
      functionName: string
    ): boolean => {
      return isFunctionEnabled(moduleName, functionName);
    };

    const getFunctionSubFunctions = (
      moduleName: string,
      functionName: string
    ): SubFunction[] => {
      // For backward compatibility, return empty array - this needs userRole.lock_modules
      return [];
    };

    const isSubFunctionAccessible = (
      moduleName: string,
      functionName: string,
      subFunctionName: string
    ): boolean => {
      return isSubFunctionEnabled(moduleName, functionName, subFunctionName);
    };

    // NEW: Function-only methods (ignoring module)
    const isFunctionAccessibleByName = (functionName: string): boolean => {
      return isFunctionEnabledAnywhere(functionName);
    };

    const isSubFunctionAccessibleByName = (
      functionName: string,
      subFunctionName: string
    ): boolean => {
      return isSubFunctionEnabledAnywhere(functionName, subFunctionName);
    };

    const hasAnyPermission = (
      moduleName: string,
      functionName?: string,
      subFunctionName?: string
    ): boolean => {
      return hasPermissionForPath(
        `/${moduleName}${functionName ? `/${functionName}` : ""}${subFunctionName ? `/${subFunctionName}` : ""}`
      );
    };

    const findModuleByName = (
      moduleName: string
    ): ModulePermissions | undefined => {
      // For backward compatibility - would need userRole.lock_modules access
      return undefined;
    };

    const findFunctionByName = (
      moduleName: string,
      functionName: string
    ): FunctionInfo | undefined => {
      // For backward compatibility - would need userRole.lock_modules access
      return undefined;
    };

    // UI visibility helpers (original logic)
    const shouldShowModule = (moduleName: string): boolean => {
      return isModuleAccessible(moduleName);
    };

    const shouldShowFunction = (
      moduleName: string,
      functionName: string
    ): boolean => {
      return (
        shouldShowModule(moduleName) &&
        isFunctionAccessible(moduleName, functionName)
      );
    };

    const shouldShowSubFunction = (
      moduleName: string,
      functionName: string,
      subFunctionName: string
    ): boolean => {
      return (
        shouldShowFunction(moduleName, functionName) &&
        isSubFunctionAccessible(moduleName, functionName, subFunctionName)
      );
    };

    // NEW: Simple function-based helper (no module required)
    const shouldShow = (
      functionName: string,
      subFunctionName?: string
    ): boolean => {
      if (subFunctionName) {
        // Check sub-function: if exists, check if active; if not exists, show as fallback
        return isSubFunctionAccessibleByName(functionName, subFunctionName);
      } else {
        // Check function only
        return isFunctionAccessibleByName(functionName);
      }
    };

    // Bulk filtering helper
    const filterEnabledItems = <
      T extends { name: string; module?: string; function?: string },
    >(
      items: T[],
      options: { module?: string; function?: string } = {}
    ): T[] => {
      return items.filter((item) => {
        const moduleName = options.module || item.module;
        const functionName = options.function || item.function;

        if (!moduleName) return true; // No module restriction

        if (!shouldShowModule(moduleName)) return false;

        if (functionName && !shouldShowFunction(moduleName, functionName))
          return false;

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
      isFunctionAccessibleByName,
      isSubFunctionAccessibleByName,
      hasAnyPermission,
      findModuleByName,
      findFunctionByName,
      shouldShowModule,
      shouldShowFunction,
      shouldShowSubFunction,
      shouldShow,
      filterEnabledItems,
    };
  }, [
    userRole,
    isModuleEnabled,
    isFunctionEnabled,
    isSubFunctionEnabled,
    isFunctionEnabledAnywhere,
    isSubFunctionEnabledAnywhere,
    hasPermissionForPath,
  ]);
};

/**
 * Hook for permission-based component rendering
 * Provides simple boolean checks for conditional rendering
 */
export const usePermissionGuard = () => {
  const {
    shouldShowModule,
    shouldShowFunction,
    shouldShowSubFunction,
    shouldShow,
  } = useDynamicPermissions();

  return {
    /**
     * NEW: Simple shouldShow method (no module required)
     * Usage: shouldShow('asset', 'add') or shouldShow('asset')
     */
    shouldShow,

    /**
     * Higher-order component for permission-based rendering (legacy)
     */
    withPermission:
      (moduleName: string, functionName?: string, subFunctionName?: string) =>
      (component: React.ReactNode) => {
        if (subFunctionName && functionName) {
          return shouldShowSubFunction(
            moduleName,
            functionName,
            subFunctionName
          )
            ? component
            : null;
        }
        if (functionName) {
          return shouldShowFunction(moduleName, functionName)
            ? component
            : null;
        }
        return shouldShowModule(moduleName) ? component : null;
      },

    /**
     * NEW: Higher-order component for function-only permission checks
     * Usage: withFunctionPermission('asset', 'add')(component) or withFunctionPermission('asset')(component)
     */
    withFunctionPermission:
      (functionName: string, subFunctionName?: string) =>
      (component: React.ReactNode) => {
        return shouldShow(functionName, subFunctionName) ? component : null;
      },

    /**
     * Check if user can access a specific permission level (legacy)
     */
    canAccess: (
      moduleName: string,
      functionName?: string,
      subFunctionName?: string
    ): boolean => {
      if (subFunctionName && functionName) {
        return shouldShowSubFunction(moduleName, functionName, subFunctionName);
      }
      if (functionName) {
        return shouldShowFunction(moduleName, functionName);
      }
      return shouldShowModule(moduleName);
    },

    /**
     * NEW: Check function-only access (no module required)
     * Usage: canAccessFunction('asset', 'add') or canAccessFunction('asset')
     */
    canAccessFunction: (
      functionName: string,
      subFunctionName?: string
    ): boolean => {
      return shouldShow(functionName, subFunctionName);
    },
  };
};
