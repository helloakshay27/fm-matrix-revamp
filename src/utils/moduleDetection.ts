import { UserRoleResponse, permissionService } from '../services/permissionService';

// Mapping of functions to their corresponding header modules
const FUNCTION_TO_MODULE_MAP: Record<string, string> = {
  // Maintenance functions
  'assets': 'Maintenance',
  'asset': 'Maintenance',
  'pms_assets': 'Maintenance',
  'tickets': 'Maintenance',
  'ticket': 'Maintenance',
  'pms_complaints': 'Maintenance',
  'pms_helpdesk_categories': 'Maintenance',
  'work_orders': 'Maintenance',
  'preventive_maintenance': 'Maintenance',
  'breakdown_maintenance': 'Maintenance',
  'schedule': 'Maintenance',
  'pms_schedule': 'Maintenance',
  'amc': 'Maintenance',
  'pms_asset_amcs': 'Maintenance',
  'inventory': 'Maintenance',
  'inventories': 'Maintenance',
  'pms_inventories': 'Maintenance',
  'inventory_consumption': 'Maintenance',
  'inventory consumption': 'Maintenance',
  'inventory-consumption': 'Maintenance',
  'attendance': 'Maintenance',
  'pms_attendances': 'Maintenance',
  'supplier': 'Maintenance',
  'pms_supplier': 'Maintenance',
  'vendor': 'Maintenance',
  'vendors': 'Maintenance',
  'vendor_audit': 'Maintenance',
  'audit': 'Maintenance',
  'audits': 'Maintenance',
  'operational': 'Maintenance',
  'waste': 'Maintenance',
  'waste_generation': 'Maintenance',
  'waste generation': 'Maintenance',
  'waste-generation': 'Maintenance',
  'survey': 'Maintenance',
  'surveys': 'Maintenance',
  'survey_list': 'Maintenance',
  'survey list': 'Maintenance',
  'survey-list': 'Maintenance',
  'survey_mapping': 'Maintenance',
  'survey mapping': 'Maintenance',
  'survey-mapping': 'Maintenance',
  'response': 'Maintenance',
  'responses': 'Maintenance',
  'vi_miles': 'Maintenance',
  'vi miles': 'Maintenance',
  'vi-miles': 'Maintenance',
  'vehicle_details': 'Maintenance',
  'vehicle details': 'Maintenance',
  'vehicle-details': 'Maintenance',
  'vehicle_check_in': 'Maintenance',
  'vehicle check in': 'Maintenance',
  'vehicle-check-in': 'Maintenance',
  'msafe_report': 'Maintenance',
  'msafe report': 'Maintenance',
  'msafe-report': 'Maintenance',
  'msafe_detail_report': 'Maintenance',
  'msafe detail report': 'Maintenance',
  'msafe-detail-report': 'Maintenance',
  
  // Transitioning functions
  'hoto': 'Transitioning',
  'snagging': 'Transitioning',
  'user_snag': 'Transitioning',
  'user snag': 'Transitioning',
  'user-snag': 'Transitioning',
  'my_snags': 'Transitioning',
  'my snags': 'Transitioning',
  'my-snags': 'Transitioning',
  'design_insight': 'Transitioning',
  'design insight': 'Transitioning',
  'design-insight': 'Transitioning',
  'fitout': 'Transitioning',
  'fitout_setup': 'Transitioning',
  'fitout setup': 'Transitioning',
  'fitout-setup': 'Transitioning',
  'fitout_request': 'Transitioning',
  'fitout request': 'Transitioning',
  'fitout-request': 'Transitioning',
  'fitout_checklist': 'Transitioning',
  'fitout checklist': 'Transitioning',
  'fitout-checklist': 'Transitioning',
  'fitout_violation': 'Transitioning',
  'fitout violation': 'Transitioning',
  'fitout-violation': 'Transitioning',
  
  // Safety functions  
  'msafe': 'Safety',
  'm-safe': 'Safety',
  'm_safe': 'Safety',
  'safety_incidents': 'Safety',
  'incidents': 'Safety',
  'incident': 'Safety',
  'permit': 'Safety',
  'permits': 'Safety',
  'pending_approvals': 'Safety',
  'pending approvals': 'Safety',
  'pending-approvals': 'Safety',
  'line_manager_check': 'Safety',
  'lmc': 'Safety',
  'senior_management_tour': 'Safety',
  'smt': 'Safety',
  'krcc_list': 'Safety',
  'krcc': 'Safety',
  'training_list': 'Safety',
  'training': 'Safety',
  'non_fte_users': 'Safety',
  'internal': 'Safety',
  'external': 'Safety',
  'reportees_reassign': 'Safety',
  'reportees reassign': 'Safety',
  'reportees-reassign': 'Safety',
  
  // Market Place functions
  'market_place': 'Market Place',
  'market place': 'Market Place',
  'market-place': 'Market Place',
  'marketplace': 'Market Place',
  'all': 'Market Place',
  'installed': 'Market Place',
  'updates': 'Market Place',
  
  // CRM functions 
  'customer_management': 'CRM',
  'customers': 'CRM',
  'customer_feedback': 'CRM',
  'escalations': 'CRM',
  'events': 'CRM',
  'pms_events': 'CRM',
  'broadcast': 'CRM',
  'pms_notices': 'CRM',
  'notices': 'CRM',
  'groups': 'CRM',
  'polls': 'CRM',
  'campaign': 'CRM',
  'lead': 'CRM',
  'opportunity': 'CRM',
  'announcements': 'CRM',
  
  // Finance functions
  'invoices': 'Finance',
  'payments': 'Finance',
  'budgets': 'Finance',
  'financial_reports': 'Finance',
  'procurement': 'Finance',
  'po': 'Finance',
  'pms_purchase_orders': 'Finance',
  'wo': 'Finance',
  'pms_work_orders': 'Finance',
  'grn': 'Finance',
  'pms_grns': 'Finance',
  'srns': 'Finance',
  'pms_srns': 'Finance',
  'bill': 'Finance',
  'bills': 'Finance',
  'pms_bills': 'Finance',
  'bill_booking': 'Finance',
  'bill booking': 'Finance',
  'bill-booking': 'Finance',
  'accounting': 'Finance',
  'cost_center': 'Finance',
  'budgeting': 'Finance',
  'wbs': 'Finance',
  'pr': 'Finance',
  'sr': 'Finance',
  'material_pr': 'Finance',
  'material pr': 'Finance',
  'material-pr': 'Finance',
  'service_pr': 'Finance',
  'service pr': 'Finance',
  'service-pr': 'Finance',
  'auto_saved_pr': 'Finance',
  'auto saved pr': 'Finance',
  'auto-saved-pr': 'Finance',
  'wallet_setup': 'Finance',
  'wallet setup': 'Finance',
  'wallet-setup': 'Finance',
  
  // Utility functions
  'utility_bills': 'Utility',
  'meter_readings': 'Utility',
  'consumption_reports': 'Utility',
  'energy': 'Utility',
  'pms_energy': 'Utility',
  'water': 'Utility',
  'pms_water': 'Utility',
  'stp': 'Utility',
  'pms_stp': 'Utility',
  'daily_readings': 'Utility',
  'utility_consumption': 'Utility',
  'utility_request': 'Utility',
  'ev_consumption': 'Utility',
  'solar_generator': 'Utility',
  'solar_generators': 'Utility',
  
  // Security functions
  'access_control': 'Security',
  'visitor_management': 'Security',
  'visitors': 'Security',
  'visitor': 'Security',
  'pms_visitors': 'Security',
  'staff': 'Security',
  'staffs': 'Security',
  'pms_staffs': 'Security',
  'r_vehicles': 'Security',
  'pms_rvehicles': 'Security',
  'g_vehicles': 'Security',
  'pms_gvehicles': 'Security',
  'vehicle': 'Security',
  'vehicles': 'Security',
  'patrolling': 'Security',
  'pms_patrolling': 'Security',
  'gate_pass': 'Security',
  'gatepass': 'Security',
  'inwards': 'Security',
  'outwards': 'Security',
  'security_incidents': 'Security',
  'patrol_logs': 'Security',
  'history': 'Security',
  
  // Value Added Services
  'services': 'Value Added Services',
  'service': 'Value Added Services',
  'pms_services': 'Value Added Services',
  'service_requests': 'Value Added Services',
  'parking': 'Value Added Services',
  'cus_parkings': 'Value Added Services',
  'space_management': 'Value Added Services',
  'space': 'Value Added Services',
  'fnb': 'Value Added Services',
  'f&b': 'Value Added Services',
  'food & beverage': 'Value Added Services',
  'booking': 'Value Added Services',
  'bookings': 'Value Added Services',
  'redemption_marketplace': 'Value Added Services',
  'osr': 'Value Added Services',
  'seat_requests': 'Value Added Services',
  'seat requests': 'Value Added Services',
  'seat-requests': 'Value Added Services',
  
  // Tasks
  'tasks': 'Maintenance',
  'task': 'Maintenance',
  'pms_tasks': 'Maintenance',
  
  // Master data
  'users': 'Master',
  'user': 'Master',
  'fm_user': 'Master',
  'fm user': 'Master',
  'fm-user': 'Master',
  'fmuser': 'Master',
  'pms_user_roles': 'Master',
  'user_roles': 'Master',
  'user & roles': 'Master',
  'occupant_users': 'Master',
  'occupant users': 'Master',
  'pms_occupant_users': 'Master',
  'roles': 'Master',
  'categories': 'Master',
  'locations': 'Master',
  'location_master': 'Master',
  'location master': 'Master',
  'location-master': 'Master',
  'companies': 'Master',
  'company': 'Master',
  'business_units': 'Master',
  'business units': 'Master',
  'business-units': 'Master',
  'cost_centers': 'Master',
  'cost centers': 'Master',
  'cost-centers': 'Master',
  'user_master': 'Master',
  'user master': 'Master',
  'user-master': 'Master',
  'checklist_master': 'Master',
  'checklist master': 'Master',
  'checklist-master': 'Master',
  'address_master': 'Master',
  'address master': 'Master',
  'address-master': 'Master',
  'unit_master': 'Master',
  'unit master': 'Master',
  'unit-master': 'Master',
  'material_master': 'Master',
  'material master': 'Master',
  'material-master': 'Master',
  'gate_number': 'Master',
  'gate number': 'Master',
  'gate-number': 'Master',
  'account': 'Master',
  'building': 'Master',
  'wing': 'Master',
  'area': 'Master',
  'floor': 'Master',
  'unit': 'Master',
  'room': 'Master',
  
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
  'lock_module': 'Settings',
  'lock module': 'Settings',
  'settings': 'Settings',
  'configuration': 'Settings',
  'config': 'Settings',
  'pms_setup': 'Settings',
  'accounts': 'Settings',
  'account_setup': 'Settings',
  'account setup': 'Settings',
  'general': 'Settings',
  'holiday_calendar': 'Settings',
  'holiday calendar': 'Settings',
  'holiday-calendar': 'Settings',
  'about': 'Settings',
  'language': 'Settings',
  'company_logo_upload': 'Settings',
  'company logo upload': 'Settings',
  'company-logo-upload': 'Settings',
  'report_setup': 'Settings',
  'report setup': 'Settings',
  'report-setup': 'Settings',
  'notification_setup': 'Settings',
  'notification setup': 'Settings',
  'notification-setup': 'Settings',
  'shift': 'Settings',
  'shifts': 'Settings',
  'roster': 'Settings',
  'rosters': 'Settings',
  'department': 'Settings',
  'departments': 'Settings',
  'approval_matrix': 'Settings',
  'approval matrix': 'Settings',
  'approval-matrix': 'Settings',
  'setup': 'Settings',
  'setups': 'Settings',
  
  // Additional comprehensive mappings for complete sidebar coverage
  
  // VAS specific functions
  'mom': 'Value Added Services',
  'client_tag_setup': 'Value Added Services',
  'client tag setup': 'Value Added Services',
  'client-tag-setup': 'Value Added Services',
  'product_tag_setup': 'Value Added Services',
  'product tag setup': 'Value Added Services',
  'product-tag-setup': 'Value Added Services',
  'seat_setup': 'Value Added Services',
  'seat setup': 'Value Added Services',
  'seat-setup': 'Value Added Services',
  'seat_type': 'Value Added Services',
  'seat type': 'Value Added Services',
  'seat-type': 'Value Added Services',
  'parking_category': 'Value Added Services',
  'parking category': 'Value Added Services',
  'parking-category': 'Value Added Services',
  'slot_configuration': 'Value Added Services',
  'slot configuration': 'Value Added Services',
  'slot-configuration': 'Value Added Services',
  'time_slot_setup': 'Value Added Services',
  'time slot setup': 'Value Added Services',
  'time-slot-setup': 'Value Added Services',
  'employees': 'Value Added Services',
  'check_in_margin': 'Value Added Services',
  'check in margin': 'Value Added Services',
  'check-in-margin': 'Value Added Services',
  'roster_calendar': 'Value Added Services',
  'roster calendar': 'Value Added Services',
  'roster-calendar': 'Value Added Services',
  'export': 'Value Added Services',
  'exports': 'Value Added Services',
  
  // Security specific functions
  'materials_type': 'Security',
  'materials type': 'Security',
  'materials-type': 'Security',
  'items_name': 'Security',
  'items name': 'Security',
  'items-name': 'Security',
  'visiting_purpose': 'Security',
  'visiting purpose': 'Security',
  'visiting-purpose': 'Security',
  'support_staff': 'Security',
  'support staff': 'Security',
  'support-staff': 'Security',
  
  // Finance specific functions
  'grn_srn': 'Finance',
  'grn srn': 'Finance',
  'grn-srn': 'Finance',
  'po_wo': 'Finance',
  'po wo': 'Finance',
  'po-wo': 'Finance',
  'pr_sr': 'Finance',
  'pr sr': 'Finance',
  'pr-sr': 'Finance',
  
  // Maintenance specific functions
  'asset_setup': 'Settings',
  'asset setup': 'Settings',
  'asset-setup': 'Settings',
  'asset_group': 'Settings',
  'asset group': 'Settings',
  'asset-group': 'Settings',
  'asset_groups': 'Settings',
  'asset groups': 'Settings',
  'asset-groups': 'Settings',
  'checklist_setup': 'Settings',
  'checklist setup': 'Settings',
  'checklist-setup': 'Settings',
  'checklist_group': 'Settings',
  'checklist group': 'Settings',
  'checklist-group': 'Settings',
  'checklist_groups': 'Settings',
  'checklist groups': 'Settings',
  'checklist-groups': 'Settings',
  'email_rule': 'Settings',
  'email rule': 'Settings',
  'email-rule': 'Settings',
  'task_escalation': 'Settings',
  'task escalation': 'Settings',
  'task-escalation': 'Settings',
  'ticket_management': 'Settings',
  'ticket management': 'Settings',
  'ticket-management': 'Settings',
  'escalation_matrix': 'Settings',
  'escalation matrix': 'Settings',
  'escalation-matrix': 'Settings',
  'cost_approval': 'Settings',
  'cost approval': 'Settings',
  'cost-approval': 'Settings',
  'inventory_management': 'Settings',
  'inventory management': 'Settings',
  'inventory-management': 'Settings',
  'sac_hsn_code': 'Settings',
  'sac hsn code': 'Settings',
  'sac-hsn-code': 'Settings',
  'permit_setup': 'Settings',
  'permit setup': 'Settings',
  'permit-setup': 'Settings',
  'incident_setup': 'Settings',
  'incident setup': 'Settings',
  'incident-setup': 'Settings',
  'waste_management': 'Settings',
  'waste management': 'Settings',
  'waste-management': 'Settings',
  'design_insight_setup': 'Settings',
  'design insight setup': 'Settings',
  'design-insight-setup': 'Settings',
  
  // Market Place specific
  'market': 'Market Place',
  'place': 'Market Place',
  
  // Additional master data functions
  'ebom': 'Master',
  'material_ebom': 'Master',
  'material ebom': 'Master',
  'material-ebom': 'Master',
  'unit_default': 'Master',
  'unit default': 'Master',
  'unit-default': 'Master',
  
  // Additional utility functions
  'meters': 'Utility',
  'meter': 'Utility',
  'readings': 'Utility',
  'reading': 'Utility',
  
  // Additional general functions that could appear
  'dashboard': 'Maintenance',
  'reports': 'Maintenance',
  'report': 'Maintenance',
  'analytics': 'Maintenance',
  'analytic': 'Maintenance',
  'notifications': 'CRM',
  'notification': 'CRM',
  'alerts': 'CRM',
  'alert': 'CRM',
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
