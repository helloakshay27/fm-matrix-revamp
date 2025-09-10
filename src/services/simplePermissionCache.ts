import { UserRoleResponse, LockModule, LockFunction, SubFunction } from './permissionService';

// Simple interface for cached function data
interface CachedFunction {
  function_name: string;
  action_name?: string;
  enabled: boolean;
  sub_functions: {
    name: string;
    display_name: string;
    enabled: boolean;
  }[];
}

interface CachedModule {
  module_name: string;
  enabled: boolean;
  functions: CachedFunction[];
}

interface PermissionCache {
  modules: CachedModule[];
  timestamp: number;
  expires: number;
}

class SimplePermissionCache {
  private static readonly CACHE_KEY = 'permission_cache';
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  // Store permissions in localStorage
  store(userRole: UserRoleResponse): void {
    if (!userRole.lock_modules) return;

    const cached: PermissionCache = {
      modules: userRole.lock_modules.map(module => ({
        module_name: module.module_name,
        enabled: module.module_active === 1,
        functions: module.lock_functions.map(func => ({
          function_name: func.function_name,
          action_name: func.action_name,
          enabled: func.function_active === 1,
          sub_functions: func.sub_functions.map(sub => ({
            name: sub.sub_function_name,
            display_name: sub.sub_function_display_name,
            enabled: sub.enabled && sub.sub_function_active === 1
          }))
        }))
      })),
      timestamp: Date.now(),
      expires: Date.now() + SimplePermissionCache.CACHE_DURATION
    };

    localStorage.setItem(SimplePermissionCache.CACHE_KEY, JSON.stringify(cached));
  }

  // Get cached permissions
  get(): PermissionCache | null {
    try {
      const cached = localStorage.getItem(SimplePermissionCache.CACHE_KEY);
      if (!cached) return null;

      const data: PermissionCache = JSON.parse(cached);
      
      // Check if expired
      if (Date.now() > data.expires) {
        this.clear();
        return null;
      }

      return data;
    } catch {
      this.clear();
      return null;
    }
  }

  // Clear cache
  clear(): void {
    localStorage.removeItem(SimplePermissionCache.CACHE_KEY);
  }

  // Check if module is enabled
  isModuleEnabled(moduleName: string): boolean {
    const cache = this.get();
    if (!cache) return false;
    
    const module = cache.modules.find(m => m.module_name.toLowerCase() === moduleName.toLowerCase());
    return module?.enabled || false;
  }

  // Check if function is enabled
  isFunctionEnabled(moduleName: string, functionName: string): boolean {
    const cache = this.get();
    if (!cache) return false;

    const module = cache.modules.find(m => m.module_name.toLowerCase() === moduleName.toLowerCase());
    if (!module?.enabled) return false;

    const func = module.functions.find(f => 
      f.function_name.toLowerCase() === functionName.toLowerCase() ||
      f.action_name?.toLowerCase() === functionName.toLowerCase()
    );
    return func?.enabled || false;
  }

  // Check if sub-function is enabled
  isSubFunctionEnabled(moduleName: string, functionName: string, subFunctionName: string): boolean {
    const cache = this.get();
    if (!cache) return false;

    const module = cache.modules.find(m => m.module_name.toLowerCase() === moduleName.toLowerCase());
    if (!module?.enabled) return false;

    const func = module.functions.find(f => 
      f.function_name.toLowerCase() === functionName.toLowerCase() ||
      f.action_name?.toLowerCase() === functionName.toLowerCase()
    );
    if (!func?.enabled) return false;

    const subFunc = func.sub_functions.find(sf => sf.name.toLowerCase() === subFunctionName.toLowerCase());
    return subFunc?.enabled || false;
  }

  // Get all enabled sub-functions for a function
  getEnabledSubFunctions(moduleName: string, functionName: string): { name: string; display_name: string }[] {
    const cache = this.get();
    if (!cache) return [];

    const module = cache.modules.find(m => m.module_name.toLowerCase() === moduleName.toLowerCase());
    if (!module?.enabled) return [];

    const func = module.functions.find(f => 
      f.function_name.toLowerCase() === functionName.toLowerCase() ||
      f.action_name?.toLowerCase() === functionName.toLowerCase()
    );
    if (!func?.enabled) return [];

    return func.sub_functions.filter(sf => sf.enabled);
  }

  // Get all enabled functions for a module
  getEnabledFunctions(moduleName: string): CachedFunction[] {
    const cache = this.get();
    if (!cache) return [];

    const module = cache.modules.find(m => m.module_name.toLowerCase() === moduleName.toLowerCase());
    if (!module?.enabled) return [];

    return module.functions.filter(f => f.enabled);
  }

  // Get all enabled modules
  getEnabledModules(): CachedModule[] {
    const cache = this.get();
    if (!cache) return [];

    return cache.modules.filter(m => m.enabled);
  }
}

// Export singleton instance
export const permissionCache = new SimplePermissionCache();

// React hook for easy usage
export const usePermissionCache = () => {
  return {
    // Module checks
    canViewModule: (module: string) => permissionCache.isModuleEnabled(module),
    
    // Function checks  
    canUseFunction: (module: string, func: string) => permissionCache.isFunctionEnabled(module, func),
    
    // Sub-function checks
    canExecute: (module: string, func: string, action: string) => permissionCache.isSubFunctionEnabled(module, func, action),
    
    // Get data
    getModuleFunctions: (module: string) => permissionCache.getEnabledFunctions(module),
    getFunctionActions: (module: string, func: string) => permissionCache.getEnabledSubFunctions(module, func),
    getAllModules: () => permissionCache.getEnabledModules(),
    
    // Show/hide helpers
    shouldShow: (module: string, func?: string, action?: string) => {
      if (!permissionCache.isModuleEnabled(module)) return false;
      if (func && !permissionCache.isFunctionEnabled(module, func)) return false;
      if (action && func && !permissionCache.isSubFunctionEnabled(module, func, action)) return false;
      return true;
    }
  };
};
