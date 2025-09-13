import { apiClient } from '@/utils/apiClient';
import { getUser, getToken } from '@/utils/auth';

export interface SubFunction {
  sub_function_id: number;
  sub_function_name: string;
  sub_function_display_name: string;
  sub_function_active: number;
  enabled: boolean;
}

export interface LockFunction {
  function_id: number;
  function_name: string;
  action_name?: string; // Optional action_name field
  function_active: number;
  sub_functions: SubFunction[];
}

export interface LockModule {
  module_id: number;
  module_name: string;
  module_active: number;
  lock_functions: LockFunction[];
}

export interface ActiveFunction {
  functionName: string;
  actionName: string;
}

export interface UserRoleResponse {
  success: boolean;
  role_name: string;
  role_id: number;
  display_name: string;
  active: number;
  lock_modules?: LockModule[];
  activeFunctions?: ActiveFunction[]; // Add support for the actual API response
}

export const permissionService = {
  /**
   * Fetch user role and permissions from the API
   */
  async getUserRole(): Promise<UserRoleResponse | null> {
    try {
      const user = getUser();
      const token = getToken();
      
      if (!user || !token) {
        console.warn('User or token not found, cannot fetch user role');
        return null;
      }

      const response = await apiClient.get<UserRoleResponse>('/pms/users/get_user_role.json');
      
      if (response.data.success) {
        // Store display name and role name in local storage
        if (response.data.display_name) {
          localStorage.setItem('user_display_name', response.data.display_name);
        }
        if (response.data.role_name) {
          localStorage.setItem('user_role_name', response.data.role_name);
        }
        return response.data;
      } else {
        console.error('Failed to fetch user role');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      return null;
    }
  },

  /**
   * Get the stored display name from local storage
   */
  getDisplayName(): string | null {
    return localStorage.getItem('user_display_name');
  },

  /**
   * Get the stored role name from local storage
   */
  getRoleName(): string | null {
    return localStorage.getItem('user_role_name');
  },

  /**
   * Clear the stored display name from local storage
   */
  clearDisplayName(): void {
    localStorage.removeItem('user_display_name');
  },

  /**
   * Clear the stored role name from local storage
   */
  clearRoleName(): void {
    localStorage.removeItem('user_role_name');
  },

  /**
   * Clear all stored user data from local storage
   */
  clearUserData(): void {
    localStorage.removeItem('user_display_name');
    localStorage.removeItem('user_role_name');
  },

  /**
   * Check if a module is enabled for the current user
   */
  isModuleEnabled(userRole: UserRoleResponse | null, moduleName: string): boolean {
    if (!userRole || !userRole.lock_modules) return false;
    
    const module = userRole.lock_modules.find(m => 
      m.module_name.toLowerCase() === moduleName.toLowerCase()
    );
    
    return module ? module.module_active === 1 : false;
  },

  /**
   * Generate function name variations with different separators and cases
   */
  generateFunctionNameVariants(functionName: string): string[] {
    const normalized = functionName.toLowerCase();
    const variants = [functionName, normalized];
    
    // Generate variations with different separators (space, underscore, hyphen)
    const generateSeparatorVariants = (name: string): string[] => {
      const variants = [name];
      const lowerName = name.toLowerCase();
      const upperName = name.toUpperCase();
      const titleName = name.replace(/\b\w/g, l => l.toUpperCase());
      
      // Add case variations
      variants.push(lowerName, upperName, titleName);
      
      // Replace separators and add case variations
      ['_', '-', ' '].forEach(separator => {
        const regex = new RegExp(separator === ' ' ? / /g : separator === '_' ? /_/g : /-/g);
        if (name.includes(separator)) {
          const replacements = separator === ' ' ? ['_', '-', ''] : separator === '_' ? [' ', '-', ''] : [' ', '_', ''];
          replacements.forEach(replacement => {
            const variant = name.replace(regex, replacement);
            variants.push(variant, variant.toLowerCase(), variant.toUpperCase(), variant.replace(/\b\w/g, l => l.toUpperCase()));
          });
        }
      });
      
      return [...new Set(variants)];
    };

    // Add separator variants for the original and normalized names
    variants.push(...generateSeparatorVariants(functionName));
    variants.push(...generateSeparatorVariants(normalized));
    
    // Special mappings with separator variations
    const normalizedLower = normalized.replace(/[-_\s]/g, '');
    
    if (normalizedLower === 'assets' || normalizedLower === 'asset') {
      const assetVariants = ['pms_assets', 'assets', 'asset', 'pms-assets', 'pms assets'];
      variants.push(...assetVariants);
      assetVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    if (normalizedLower === 'tickets' || normalizedLower === 'ticket') {
      const ticketVariants = ['pms_complaints', 'tickets', 'ticket', 'pms-complaints', 'pms complaints'];
      variants.push(...ticketVariants);
      ticketVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    if (normalizedLower === 'services' || normalizedLower === 'service') {
      const serviceVariants = ['pms_services', 'services', 'service', 'pms-services', 'pms services'];
      variants.push(...serviceVariants);
      serviceVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    if (normalizedLower === 'tasks' || normalizedLower === 'task') {
      const taskVariants = ['pms_tasks', 'tasks', 'task', 'pms-tasks', 'pms tasks'];
      variants.push(...taskVariants);
      taskVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    if (normalizedLower === 'broadcast') {
      const broadcastVariants = ['pms_notices', 'broadcast', 'pms-notices', 'pms notices'];
      variants.push(...broadcastVariants);
      broadcastVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    
    // M-Safe related mappings
    if (normalizedLower === 'msafe' || normalizedLower.includes('msafe') || (normalized.includes('m') && normalized.includes('safe'))) {
      const msafeVariants = [
        'msafe', 'Msafe', 'MSAFE', 'MSafe',
        'm-safe', 'm_safe', 'm safe', 'M-Safe', 'M_Safe', 'M Safe', 'M-SAFE', 'M_SAFE', 'M SAFE',
        'pms_msafe', 'pms-msafe', 'pms msafe', 'PMS_MSAFE', 'PMS-MSAFE', 'PMS MSAFE',
        'pms_m_safe', 'pms-m-safe', 'pms m safe', 'PMS_M_SAFE', 'PMS-M-SAFE', 'PMS M SAFE'
      ];
      variants.push(...msafeVariants);
      msafeVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    if (normalizedLower.includes('non') && (normalizedLower.includes('fte') || normalizedLower.includes('user'))) {
      const nonFteVariants = [
        'non fte users', 'Non Fte Users', 'NON FTE USERS', 'Non FTE Users',
        'non_fte_users', 'Non_Fte_Users', 'NON_FTE_USERS', 'Non_FTE_Users',
        'non-fte-users', 'Non-Fte-Users', 'NON-FTE-USERS', 'Non-FTE-Users',
        'nonfte users', 'NonFte Users', 'NONFTE USERS', 'NonFTE Users',
        'nonfteusers', 'NonFteUsers', 'NONFTEUSERS', 'NonFTEUsers',
        'non fte', 'Non Fte', 'NON FTE', 'Non FTE'
      ];
      variants.push(...nonFteVariants);
      nonFteVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    if (normalizedLower.includes('line') && normalizedLower.includes('manager')) {
      const lmcVariants = [
        'line manager check', 'Line Manager Check', 'LINE MANAGER CHECK',
        'line_manager_check', 'Line_Manager_Check', 'LINE_MANAGER_CHECK',
        'line-manager-check', 'Line-Manager-Check', 'LINE-MANAGER-CHECK',
        'linemanagercheck', 'LineManagerCheck', 'LINEMANAGERCHECK',
        'lmc', 'LMC', 'Lmc'
      ];
      variants.push(...lmcVariants);
      lmcVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    if (normalizedLower.includes('senior') && normalizedLower.includes('management')) {
      const smtVariants = [
        'senior management tour', 'Senior Management Tour', 'SENIOR MANAGEMENT TOUR',
        'senior_management_tour', 'Senior_Management_Tour', 'SENIOR_MANAGEMENT_TOUR',
        'senior-management-tour', 'Senior-Management-Tour', 'SENIOR-MANAGEMENT-TOUR',
        'seniormanagementtour', 'SeniorManagementTour', 'SENIORMANAGEMENTTOUR',
        'smt', 'SMT', 'Smt'
      ];
      variants.push(...smtVariants);
      smtVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    if (normalizedLower.includes('krcc')) {
      const krccVariants = [
        'krcc list', 'Krcc List', 'KRCC LIST', 'KRCC List',
        'krcc_list', 'Krcc_List', 'KRCC_LIST', 'KRCC_List',
        'krcc-list', 'Krcc-List', 'KRCC-LIST', 'KRCC-List',
        'krcclist', 'KrccList', 'KRCCLIST', 'KRCCList',
        'krcc', 'KRCC', 'Krcc'
      ];
      variants.push(...krccVariants);
      krccVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    if (normalizedLower.includes('training')) {
      const trainingVariants = [
        'training_list', 'Training_List', 'TRAINING_LIST',
        'training list', 'Training List', 'TRAINING LIST',
        'training-list', 'Training-List', 'TRAINING-LIST',
        'traininglist', 'TrainingList', 'TRAININGLIST',
        'training', 'Training', 'TRAINING'
      ];
      variants.push(...trainingVariants);
      trainingVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
    }
    
    // Remove duplicates and return unique variants
    return [...new Set(variants)];
  },

  /**
   * Enhanced function matching with fuzzy logic
   */
  findMatchingFunction(lockFunctions: LockFunction[], searchFunctionName: string): LockFunction | undefined {
    const searchVariants = this.generateFunctionNameVariants(searchFunctionName);
    
    return lockFunctions.find(f => {
      const functionNameVariants = this.generateFunctionNameVariants(f.function_name);
      const actionNameVariants = (f as any).action_name ? this.generateFunctionNameVariants((f as any).action_name) : [];
      
      // Check if any search variant matches any function name variant
      const functionNameMatch = searchVariants.some(searchVariant => 
        functionNameVariants.some(fnVariant => {
          const normalizedSearchVariant = searchVariant.toLowerCase().replace(/[-_\s]/g, '');
          const normalizedFnVariant = fnVariant.toLowerCase().replace(/[-_\s]/g, '');
          
          // Exact match, contains match, or partial match
          return normalizedSearchVariant === normalizedFnVariant ||
                 normalizedSearchVariant.includes(normalizedFnVariant) ||
                 normalizedFnVariant.includes(normalizedSearchVariant) ||
                 // Fuzzy match for short abbreviations
                 (normalizedSearchVariant.length <= 3 && normalizedFnVariant.includes(normalizedSearchVariant)) ||
                 (normalizedFnVariant.length <= 3 && normalizedSearchVariant.includes(normalizedFnVariant));
        })
      );
      
      // Check if any search variant matches any action name variant
      const actionNameMatch = actionNameVariants.some(actionVariant =>
        searchVariants.some(searchVariant => {
          const normalizedSearchVariant = searchVariant.toLowerCase().replace(/[-_\s]/g, '');
          const normalizedActionVariant = actionVariant.toLowerCase().replace(/[-_\s]/g, '');
          
          // Exact match, contains match, or partial match
          return normalizedSearchVariant === normalizedActionVariant ||
                 normalizedSearchVariant.includes(normalizedActionVariant) ||
                 normalizedActionVariant.includes(normalizedSearchVariant) ||
                 // Fuzzy match for short abbreviations
                 (normalizedSearchVariant.length <= 3 && normalizedActionVariant.includes(normalizedSearchVariant)) ||
                 (normalizedActionVariant.length <= 3 && normalizedSearchVariant.includes(normalizedActionVariant));
        })
      );
      
      return functionNameMatch || actionNameMatch;
    });
  },

  /**
   * Check if a function is enabled for the current user within a module
   */
  isFunctionEnabled(userRole: UserRoleResponse | null, moduleName: string, functionName: string): boolean {
    if (!userRole || !userRole.lock_modules) return false;
    
    const module = userRole.lock_modules.find(m => 
      m.module_name.toLowerCase() === moduleName.toLowerCase()
    );
    
    if (!module || module.module_active !== 1) return false;
    
    const func = this.findMatchingFunction(module.lock_functions, functionName);
    
    return func ? func.function_active === 1 : false;
  },

  /**
   * Check if a sub-function is enabled for the current user
   */
  isSubFunctionEnabled(userRole: UserRoleResponse | null, moduleName: string, functionName: string, subFunctionName: string): boolean {
    if (!userRole || !userRole.lock_modules) return false;
    
    const module = userRole.lock_modules.find(m => 
      m.module_name.toLowerCase() === moduleName.toLowerCase()
    );
    
    if (!module || module.module_active !== 1) return false;
    
    const func = this.findMatchingFunction(module.lock_functions, functionName);
    
    if (!func || func.function_active !== 1) return false;
    
    // Enhanced sub-function matching with separator variations
    const subFunctionVariants = this.generateFunctionNameVariants(subFunctionName);
    const subFunc = func.sub_functions.find(sf => {
      const subFunctionNameVariants = this.generateFunctionNameVariants(sf.sub_function_name);
      
      return subFunctionVariants.some(searchVariant => 
        subFunctionNameVariants.some(sfVariant => {
          const normalizedSearchVariant = searchVariant.toLowerCase().replace(/[-_\s]/g, '');
          const normalizedSfVariant = sfVariant.toLowerCase().replace(/[-_\s]/g, '');
          
          return normalizedSearchVariant === normalizedSfVariant ||
                 normalizedSearchVariant.includes(normalizedSfVariant) ||
                 normalizedSfVariant.includes(normalizedSearchVariant);
        })
      );
    });
    
    return subFunc ? subFunc.enabled : false;
  },

  /**
   * Get all enabled modules for the current user
   */
  getEnabledModules(userRole: UserRoleResponse | null): LockModule[] {
    if (!userRole || !userRole.lock_modules) return [];
    
    return userRole.lock_modules.filter(module => module.module_active === 1);
  },

  /**
   * Get all enabled functions for a module
   */
  getEnabledFunctions(userRole: UserRoleResponse | null, moduleName: string): LockFunction[] {
    if (!userRole || !userRole.lock_modules) return [];
    
    const module = userRole.lock_modules.find(m => 
      m.module_name.toLowerCase() === moduleName.toLowerCase()
    );
    
    if (!module || module.module_active !== 1) return [];
    
    return module.lock_functions.filter(func => func.function_active === 1);
  },

  /**
   * Get all enabled sub-functions for a function
   */
  getEnabledSubFunctions(userRole: UserRoleResponse | null, moduleName: string, functionName: string): SubFunction[] {
    if (!userRole || !userRole.lock_modules) return [];
    
    const module = userRole.lock_modules.find(m => 
      m.module_name.toLowerCase() === moduleName.toLowerCase()
    );
    
    if (!module || module.module_active !== 1) return [];
    
    const func = this.findMatchingFunction(module.lock_functions, functionName);
    
    if (!func || func.function_active !== 1) return [];
    
    return func.sub_functions.filter(subFunc => subFunc.enabled);
  },

  /**
   * Check if user has any permissions for a given navigation path
   * This method can be used to map sidebar items to user permissions
   */
  hasPermissionForPath(userRole: UserRoleResponse | null, path: string): boolean {
    if (!userRole || !userRole.lock_modules) return false;

    // Map common path patterns to module names
    const pathModuleMap: { [key: string]: string[] } = {
      'safety': ['safety'],
      'maintenance': ['maintenance'],
      'security': ['security'],
      'finance': ['finance'],
      'utility': ['utility'],
      'crm': ['crm'],
      // Add more mappings as needed
    };

    const pathSegments = path.toLowerCase().split('/').filter(Boolean);
    
    if (pathSegments.length === 0) return true; // Allow access to root

    const mainSegment = pathSegments[0];
    const possibleModules = pathModuleMap[mainSegment] || [mainSegment];

    // Check if user has access to any of the possible modules
    return possibleModules.some(moduleName => 
      this.isModuleEnabled(userRole, moduleName)
    );
  },

  /**
   * Set role name in local storage and headers
   * This is useful for manual role name setting
   */
  setRoleName(roleName: string): void {
    localStorage.setItem('user_role_name', roleName);
  },

  /**
   * Get user role information including role name for headers
   */
  getUserRoleInfo(): { displayName: string | null; roleName: string | null } {
    return {
      displayName: this.getDisplayName(),
      roleName: this.getRoleName()
    };
  },
};
