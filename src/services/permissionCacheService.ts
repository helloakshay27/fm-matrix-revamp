import { UserRoleResponse, LockModule, LockFunction, SubFunction } from './permissionService';

export interface CachedPermissions {
  userRole: UserRoleResponse;
  timestamp: number;
  expiresAt: number;
  functionCache: Map<string, boolean>;
  subFunctionCache: Map<string, boolean>;
  moduleCache: Map<string, boolean>;
}

export interface FunctionInfo {
  function_id: number;
  function_name: string;
  function_active: number;
  action_name?: string;
  enabled: boolean;
  sub_functions: SubFunction[];
}

export interface ModulePermissions {
  module_id: number;
  module_name: string;
  module_active: number;
  enabled: boolean;
  functions: FunctionInfo[];
}

export class PermissionCacheService {
  private static readonly CACHE_KEY = 'user_permissions_cache';
  private static readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  private cachedPermissions: CachedPermissions | null = null;

  /**
   * Cache user permissions and create optimized lookup maps
   */
  cachePermissions(userRole: UserRoleResponse): void {
    const now = Date.now();
    const expiresAt = now + PermissionCacheService.CACHE_DURATION;
    
    const functionCache = new Map<string, boolean>();
    const subFunctionCache = new Map<string, boolean>();
    const moduleCache = new Map<string, boolean>();

    // Cache modules
    if (userRole.lock_modules) {
      userRole.lock_modules.forEach(module => {
        const moduleKey = module.module_name.toLowerCase();
        moduleCache.set(moduleKey, module.module_active === 1);

        // Cache functions
        module.lock_functions.forEach(func => {
          const functionKey = `${moduleKey}:${func.function_name.toLowerCase()}`;
          const actionKey = func.action_name ? `${moduleKey}:${func.action_name.toLowerCase()}` : null;
          
          const isEnabled = func.function_active === 1;
          functionCache.set(functionKey, isEnabled);
          
          if (actionKey) {
            functionCache.set(actionKey, isEnabled);
          }

          // Cache sub-functions
          func.sub_functions.forEach(subFunc => {
            const subFunctionKey = `${moduleKey}:${func.function_name.toLowerCase()}:${subFunc.sub_function_name.toLowerCase()}`;
            const subFunctionActionKey = actionKey ? `${moduleKey}:${func.action_name}:${subFunc.sub_function_name.toLowerCase()}` : null;
            
            subFunctionCache.set(subFunctionKey, subFunc.enabled);
            
            if (subFunctionActionKey) {
              subFunctionCache.set(subFunctionActionKey, subFunc.enabled);
            }
          });
        });
      });
    }

    this.cachedPermissions = {
      userRole,
      timestamp: now,
      expiresAt,
      functionCache,
      subFunctionCache,
      moduleCache
    };

    // Store in localStorage (convert Maps to objects for serialization)
    const cacheData = {
      userRole,
      timestamp: now,
      expiresAt,
      functionCache: Object.fromEntries(functionCache),
      subFunctionCache: Object.fromEntries(subFunctionCache),
      moduleCache: Object.fromEntries(moduleCache)
    };

    try {
      localStorage.setItem(PermissionCacheService.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache permissions in localStorage:', error);
    }
  }

  /**
   * Load cached permissions from localStorage
   */
  loadCachedPermissions(): CachedPermissions | null {
    try {
      const cachedData = localStorage.getItem(PermissionCacheService.CACHE_KEY);
      if (!cachedData) return null;

      const parsed = JSON.parse(cachedData);
      const now = Date.now();

      // Check if cache is expired
      if (now > parsed.expiresAt) {
        this.clearCache();
        return null;
      }

      // Convert objects back to Maps
      this.cachedPermissions = {
        userRole: parsed.userRole,
        timestamp: parsed.timestamp,
        expiresAt: parsed.expiresAt,
        functionCache: new Map(Object.entries(parsed.functionCache)),
        subFunctionCache: new Map(Object.entries(parsed.subFunctionCache)),
        moduleCache: new Map(Object.entries(parsed.moduleCache))
      };

      return this.cachedPermissions;
    } catch (error) {
      console.warn('Failed to load cached permissions:', error);
      this.clearCache();
      return null;
    }
  }

  /**
   * Clear cached permissions
   */
  clearCache(): void {
    this.cachedPermissions = null;
    try {
      localStorage.removeItem(PermissionCacheService.CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear permissions cache:', error);
    }
  }

  /**
   * Check if cache is valid and not expired
   */
  isCacheValid(): boolean {
    if (!this.cachedPermissions) {
      this.loadCachedPermissions();
    }
    
    if (!this.cachedPermissions) return false;
    
    const now = Date.now();
    return now <= this.cachedPermissions.expiresAt;
  }

  /**
   * Get cached user role
   */
  getCachedUserRole(): UserRoleResponse | null {
    if (!this.isCacheValid()) return null;
    return this.cachedPermissions?.userRole || null;
  }

  /**
   * Fast module permission check using cache
   */
  isModuleEnabled(moduleName: string): boolean {
    if (!this.isCacheValid()) return false;
    
    const key = moduleName.toLowerCase();
    return this.cachedPermissions?.moduleCache.get(key) || false;
  }

  /**
   * Fast function permission check using cache
   */
  isFunctionEnabled(moduleName: string, functionName: string): boolean {
    if (!this.isCacheValid()) return false;
    
    const moduleKey = moduleName.toLowerCase();
    const functionKey = `${moduleKey}:${functionName.toLowerCase()}`;
    
    return this.cachedPermissions?.functionCache.get(functionKey) || false;
  }

  /**
   * Fast sub-function permission check using cache
   */
  isSubFunctionEnabled(moduleName: string, functionName: string, subFunctionName: string): boolean {
    if (!this.isCacheValid()) return false;
    
    const moduleKey = moduleName.toLowerCase();
    const functionKey = functionName.toLowerCase();
    const subFunctionKey = `${moduleKey}:${functionKey}:${subFunctionName.toLowerCase()}`;
    
    return this.cachedPermissions?.subFunctionCache.get(subFunctionKey) || false;
  }

  /**
   * Get all enabled modules with their functions and sub-functions
   */
  getModulePermissions(): ModulePermissions[] {
    const userRole = this.getCachedUserRole();
    if (!userRole?.lock_modules) return [];

    return userRole.lock_modules
      .filter(module => module.module_active === 1)
      .map(module => ({
        module_id: module.module_id,
        module_name: module.module_name,
        module_active: module.module_active,
        enabled: this.isModuleEnabled(module.module_name),
        functions: module.lock_functions
          .filter(func => func.function_active === 1)
          .map(func => ({
            function_id: func.function_id,
            function_name: func.function_name,
            function_active: func.function_active,
            action_name: func.action_name,
            enabled: this.isFunctionEnabled(module.module_name, func.function_name),
            sub_functions: func.sub_functions.filter(subFunc => 
              subFunc.sub_function_active === 1 && 
              this.isSubFunctionEnabled(module.module_name, func.function_name, subFunc.sub_function_name)
            )
          }))
      }));
  }

  /**
   * Get all enabled functions for a specific module
   */
  getModuleFunctions(moduleName: string): FunctionInfo[] {
    const userRole = this.getCachedUserRole();
    if (!userRole?.lock_modules) return [];

    const module = userRole.lock_modules.find(m => 
      m.module_name.toLowerCase() === moduleName.toLowerCase()
    );

    if (!module || !this.isModuleEnabled(moduleName)) return [];

    return module.lock_functions
      .filter(func => func.function_active === 1 && this.isFunctionEnabled(moduleName, func.function_name))
      .map(func => ({
        function_id: func.function_id,
        function_name: func.function_name,
        function_active: func.function_active,
        action_name: func.action_name,
        enabled: true,
        sub_functions: func.sub_functions.filter(subFunc => 
          subFunc.sub_function_active === 1 && 
          this.isSubFunctionEnabled(moduleName, func.function_name, subFunc.sub_function_name)
        )
      }));
  }

  /**
   * Get enabled sub-functions for a specific function
   */
  getFunctionSubFunctions(moduleName: string, functionName: string): SubFunction[] {
    const userRole = this.getCachedUserRole();
    if (!userRole?.lock_modules) return [];

    const module = userRole.lock_modules.find(m => 
      m.module_name.toLowerCase() === moduleName.toLowerCase()
    );

    if (!module || !this.isModuleEnabled(moduleName)) return [];

    const func = module.lock_functions.find(f => 
      f.function_name.toLowerCase() === functionName.toLowerCase() || 
      f.action_name?.toLowerCase() === functionName.toLowerCase()
    );

    if (!func || !this.isFunctionEnabled(moduleName, functionName)) return [];

    return func.sub_functions.filter(subFunc => 
      subFunc.sub_function_active === 1 && 
      this.isSubFunctionEnabled(moduleName, functionName, subFunc.sub_function_name)
    );
  }

  /**
   * Check if a specific permission exists
   */
  hasPermission(moduleName: string, functionName?: string, subFunctionName?: string): boolean {
    if (!this.isModuleEnabled(moduleName)) return false;
    
    if (!functionName) return true;
    
    if (!this.isFunctionEnabled(moduleName, functionName)) return false;
    
    if (!subFunctionName) return true;
    
    return this.isSubFunctionEnabled(moduleName, functionName, subFunctionName);
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): {
    isValid: boolean;
    timestamp: number | null;
    expiresAt: number | null;
    moduleCount: number;
    functionCount: number;
    subFunctionCount: number;
  } {
    const cache = this.cachedPermissions;
    
    return {
      isValid: this.isCacheValid(),
      timestamp: cache?.timestamp || null,
      expiresAt: cache?.expiresAt || null,
      moduleCount: cache?.moduleCache.size || 0,
      functionCount: cache?.functionCache.size || 0,
      subFunctionCount: cache?.subFunctionCache.size || 0
    };
  }
}

// Export singleton instance
export const permissionCache = new PermissionCacheService();
