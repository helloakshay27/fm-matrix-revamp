import { UserRoleResponse, permissionService } from '../services/permissionService';

// Mapping of functions to their corresponding header modules
const FUNCTION_TO_MODULE_MAP: Record<string, string> = {
  // Maintenance functions
  'assets': 'Maintenance',
  'asset': 'Maintenance',
  'pms_assets': 'Maintenance',
  'work_orders': 'Maintenance',
  'preventive_maintenance': 'Maintenance',
  'breakdown_maintenance': 'Maintenance',
  
  // Safety functions  
  'msafe': 'Safety',
  'm-safe': 'Safety',
  'm_safe': 'Safety',
  'safety_incidents': 'Safety',
  'line_manager_check': 'Safety',
  'lmc': 'Safety',
  'senior_management_tour': 'Safety',
  'smt': 'Safety',
  'krcc_list': 'Safety',
  'krcc': 'Safety',
  'training_list': 'Safety',
  'training': 'Safety',
  'non_fte_users': 'Safety',
  
  // CRM functions (commented out problematic ones)
  // 'tickets': 'CRM',
  // 'ticket': 'CRM',
  // 'pms_complaints': 'CRM',
  'customer_management': 'CRM',
  'customer_feedback': 'CRM',
  'escalations': 'CRM',
  
  // Finance functions
  'invoices': 'Finance',
  'payments': 'Finance',
  'budgets': 'Finance',
  'financial_reports': 'Finance',
  
  // Utility functions
  'utility_bills': 'Utility',
  'meter_readings': 'Utility',
  'consumption_reports': 'Utility',
  
  // Security functions
  'access_control': 'Security',
  'visitor_management': 'Security',
  'security_incidents': 'Security',
  'patrol_logs': 'Security',
  
  // Services (commented out problematic ones)
  // 'services': 'Value Added Services',
  // 'service': 'Value Added Services',
  // 'pms_services': 'Value Added Services',
  'service_requests': 'Value Added Services',
  
  // Tasks
  'tasks': 'Maintenance',
  'task': 'Maintenance',
  'pms_tasks': 'Maintenance',
  
  // Broadcast/Notices (commented out problematic ones)
  // 'broadcast': 'CRM',
  // 'pms_notices': 'CRM',
  'announcements': 'CRM',
  
  // Master data
  'users': 'Master',
  'fm_user': 'Master',
  'fm user': 'Master',
  'fm-user': 'Master',
  'fmuser': 'Master',
  'roles': 'Master',
  'categories': 'Master',
  'locations': 'Master',
  'companies': 'Master',
  'company': 'Master',
  'business_units': 'Master',
  'business units': 'Master',
  'business-units': 'Master',
  'cost_centers': 'Master',
  'cost centers': 'Master',
  'cost-centers': 'Master',
  
  // Settings
  'system_settings': 'Settings',
  'user_preferences': 'Settings',
  'configurations': 'Settings',
  'role_config': 'Settings',
  'role config': 'Settings',
  'lock_function': 'Settings',
  'lock function': 'Settings',
  'lock_sub_function': 'Settings',
  'lock sub function': 'Settings',
  'settings': 'Settings',
  'configuration': 'Settings',
  'config': 'Settings'
};

/**
 * Get the module name for a given function
 */
export const getModuleForFunction = (functionName: string): string | null => {
  if (!functionName) return null;
  
  // Generate all possible variants of the function name
  const variants = permissionService.generateFunctionNameVariants(functionName);
  
  // Debug logging
  console.log(`🔍 getModuleForFunction: "${functionName}" → variants:`, variants);
  
  // Find the first matching module
  for (const variant of variants) {
    const module = FUNCTION_TO_MODULE_MAP[variant.toLowerCase()];
    if (module) {
      console.log(`🔍 Found mapping: "${variant}" → "${module}"`);
      return module;
    }
  }
  
  console.log(`🔍 No mapping found for: "${functionName}"`);
  return null;
};

/**
 * Check if user has access to any function in the system
 */
export const hasAnyFunctionAccess = (userRole: UserRoleResponse | null): boolean => {
  if (!userRole || !userRole.lock_modules) {
    console.log('🔍 hasAnyFunctionAccess: No userRole or lock_modules');
    return false;
  }
  
  const hasAccess = userRole.lock_modules.some(module => {
    if (module.module_active !== 1) return false;
    return module.lock_functions.some(func => func.function_active === 1);
  });
  
  console.log('🔍 hasAnyFunctionAccess:', {
    hasAccess,
    totalModules: userRole.lock_modules.length,
    activeModules: userRole.lock_modules.filter(m => m.module_active === 1).length,
    activeFunctions: userRole.lock_modules.reduce((total, m) => 
      total + (m.module_active === 1 ? m.lock_functions.filter(f => f.function_active === 1).length : 0), 0
    )
  });
  
  return hasAccess;
};

/**
 * Get the appropriate module based on user's current function access
 */
export const getActiveModuleForUser = (userRole: UserRoleResponse | null): string | null => {
  if (!userRole || !userRole.lock_modules) return null;
  
  // Get all enabled functions
  const enabledFunctions: string[] = [];
  userRole.lock_modules.forEach(module => {
    if (module.module_active === 1) {
      module.lock_functions.forEach(func => {
        if (func.function_active === 1) {
          enabledFunctions.push(func.function_name);
          // Also add action_name if it exists
          if ((func as any).action_name) {
            enabledFunctions.push((func as any).action_name);
          }
        }
      });
    }
  });
  
  // Find the first function that maps to a module
  for (const functionName of enabledFunctions) {
    const module = getModuleForFunction(functionName);
    if (module) return module;
  }
  
  return null;
};

/**
 * Get all modules that the user has access to
 */
export const getAccessibleModules = (userRole: UserRoleResponse | null): string[] => {
  if (!userRole || !userRole.lock_modules) {
    console.log('🔍 getAccessibleModules: No userRole or lock_modules');
    return [];
  }
  
  const accessibleModules = new Set<string>();
  const debugInfo: any = { 
    checkedFunctions: [], 
    foundMappings: [], 
    allActiveFunctions: [],
    exactMatches: []
  };
  
  // Get all active functions first
  userRole.lock_modules.forEach(module => {
    if (module.module_active === 1) {
      module.lock_functions.forEach(func => {
        if (func.function_active === 1) {
          debugInfo.allActiveFunctions.push({
            functionName: func.function_name,
            actionName: (func as any).action_name
          });
        }
      });
    }
  });
  
  console.log('🔍 All Active Functions:', debugInfo.allActiveFunctions);
  
  userRole.lock_modules.forEach(module => {
    if (module.module_active === 1) {
      module.lock_functions.forEach(func => {
        if (func.function_active === 1) {
          debugInfo.checkedFunctions.push({
            functionName: func.function_name,
            actionName: (func as any).action_name
          });
          
          // Check function_name mapping with enhanced variant matching
          const functionVariants = permissionService.generateFunctionNameVariants(func.function_name);
          let moduleForFunction = null;
          
          // Check for exact matches in the mapping
          for (const variant of functionVariants) {
            if (FUNCTION_TO_MODULE_MAP[variant.toLowerCase()]) {
              moduleForFunction = FUNCTION_TO_MODULE_MAP[variant.toLowerCase()];
              debugInfo.exactMatches.push({
                original: func.function_name,
                variant: variant,
                mappedTo: moduleForFunction
              });
              break;
            }
          }
          
          if (moduleForFunction) {
            accessibleModules.add(moduleForFunction);
            debugInfo.foundMappings.push({
              function: func.function_name,
              mappedTo: moduleForFunction,
              type: 'function_name'
            });
          }
          
          // Also check action_name if it exists
          if ((func as any).action_name) {
            const actionVariants = permissionService.generateFunctionNameVariants((func as any).action_name);
            let moduleForAction = null;
            
            // Check for exact matches in the mapping
            for (const variant of actionVariants) {
              if (FUNCTION_TO_MODULE_MAP[variant.toLowerCase()]) {
                moduleForAction = FUNCTION_TO_MODULE_MAP[variant.toLowerCase()];
                debugInfo.exactMatches.push({
                  original: (func as any).action_name,
                  variant: variant,
                  mappedTo: moduleForAction
                });
                break;
              }
            }
            
            if (moduleForAction) {
              accessibleModules.add(moduleForAction);
              debugInfo.foundMappings.push({
                function: (func as any).action_name,
                mappedTo: moduleForAction,
                type: 'action_name'
              });
            }
          }
        }
      });
    }
  });
  
  const result = Array.from(accessibleModules);
  console.log('🔍 getAccessibleModules FINAL:', {
    result,
    debugInfo,
    totalActiveFunctions: debugInfo.checkedFunctions.length,
    totalMappings: debugInfo.foundMappings.length,
    exactMatches: debugInfo.exactMatches
  });
  
  // Final validation: ensure we only return modules that have actual function mappings
  if (result.length === 0 && debugInfo.checkedFunctions.length > 0) {
    console.warn('🚨 No modules mapped despite having active functions!', {
      activeFunctions: debugInfo.checkedFunctions,
      availableMappings: Object.keys(FUNCTION_TO_MODULE_MAP)
    });
  }
  
  return result;
};
