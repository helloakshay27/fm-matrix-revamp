import React from 'react';
import { usePermissions } from '../contexts/PermissionsContext';
import { Card } from '@/components/ui/card';

const PermissionTester: React.FC = () => {
  const { userRole } = usePermissions();

  // Test function to check permissions manually
  const testPermission = (moduleName: string, functionName: string, subFunctionName?: string) => {
    if (!userRole || !userRole.lock_modules) {
      return { result: 'NO_DATA', message: 'No user role data available' };
    }

    // Function to normalize function names and handle special mappings
    const normalizeFunctionName = (functionName: string): string[] => {
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
        
        // Replace spaces with underscores and hyphens
        if (name.includes(' ')) {
          const withUnderscore = name.replace(/ /g, '_');
          const withHyphen = name.replace(/ /g, '-');
          const withoutSpaces = name.replace(/ /g, '');  // Remove spaces entirely
          variants.push(withUnderscore, withHyphen, withoutSpaces);
          
          // Add case variations for each separator variant
          variants.push(
            withUnderscore.toLowerCase(), withUnderscore.toUpperCase(), withUnderscore.replace(/\b\w/g, l => l.toUpperCase()),
            withHyphen.toLowerCase(), withHyphen.toUpperCase(), withHyphen.replace(/\b\w/g, l => l.toUpperCase()),
            withoutSpaces.toLowerCase(), withoutSpaces.toUpperCase(), withoutSpaces.replace(/\b\w/g, l => l.toUpperCase())
          );
        }
        
        // Replace underscores with spaces and hyphens
        if (name.includes('_')) {
          const withSpaces = name.replace(/_/g, ' ');
          const withHyphens = name.replace(/_/g, '-');
          const withoutUnderscores = name.replace(/_/g, '');   // Remove underscores entirely
          variants.push(withSpaces, withHyphens, withoutUnderscores);
          
          // Add case variations for each separator variant
          variants.push(
            withSpaces.toLowerCase(), withSpaces.toUpperCase(), withSpaces.replace(/\b\w/g, l => l.toUpperCase()),
            withHyphens.toLowerCase(), withHyphens.toUpperCase(), withHyphens.replace(/\b\w/g, l => l.toUpperCase()),
            withoutUnderscores.toLowerCase(), withoutUnderscores.toUpperCase(), withoutUnderscores.replace(/\b\w/g, l => l.toUpperCase())
          );
        }
        
        // Replace hyphens with spaces and underscores
        if (name.includes('-')) {
          const withSpaces = name.replace(/-/g, ' ');
          const withUnderscores = name.replace(/-/g, '_');
          const withoutHyphens = name.replace(/-/g, '');   // Remove hyphens entirely
          variants.push(withSpaces, withUnderscores, withoutHyphens);
          
          // Add case variations for each separator variant
          variants.push(
            withSpaces.toLowerCase(), withSpaces.toUpperCase(), withSpaces.replace(/\b\w/g, l => l.toUpperCase()),
            withUnderscores.toLowerCase(), withUnderscores.toUpperCase(), withUnderscores.replace(/\b\w/g, l => l.toUpperCase()),
            withoutHyphens.toLowerCase(), withoutHyphens.toUpperCase(), withoutHyphens.replace(/\b\w/g, l => l.toUpperCase())
          );
        }
        
        // Remove duplicates
        return [...new Set(variants)];
      };

      // Add separator variants for the original and normalized names
      variants.push(...generateSeparatorVariants(functionName));
      variants.push(...generateSeparatorVariants(normalized));
      
      // Special mappings with separator variations
      if (normalized === 'assets' || normalized === 'asset') {
        const assetVariants = ['pms_assets', 'assets', 'asset', 'pms-assets', 'pms assets'];
        variants.push(...assetVariants);
        assetVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
      }
      if (normalized === 'tickets' || normalized === 'ticket') {
        const ticketVariants = ['pms_complaints', 'tickets', 'ticket', 'pms-complaints', 'pms complaints'];
        variants.push(...ticketVariants);
        ticketVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
      }
      if (normalized === 'services' || normalized === 'service') {
        const serviceVariants = ['pms_services', 'services', 'service', 'pms-services', 'pms services'];
        variants.push(...serviceVariants);
        serviceVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
      }
      if (normalized === 'tasks' || normalized === 'task') {
        const taskVariants = ['pms_tasks', 'tasks', 'task', 'pms-tasks', 'pms tasks'];
        variants.push(...taskVariants);
        taskVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
      }
      if (normalized === 'broadcast') {
        const broadcastVariants = ['pms_notices', 'broadcast', 'pms-notices', 'pms notices'];
        variants.push(...broadcastVariants);
        broadcastVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
      }
      
      // M-Safe related mappings with separator variations
      const normalizedLower = normalized.replace(/[-_\s]/g, '');
      if (normalizedLower === 'msafe' || normalizedLower === 'msafe' || normalized.includes('m') && (normalized.includes('safe'))) {
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
          'non fte', 'Non Fte', 'NON FTE', 'Non FTE',
          'pms_non_fte_users', 'PMS_NON_FTE_USERS', 'pms-non-fte-users', 'PMS-NON-FTE-USERS', 'pms non fte users', 'PMS NON FTE USERS'
        ];
        variants.push(...nonFteVariants);
        nonFteVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
      }
      if (normalizedLower.includes('line') && normalizedLower.includes('manager')) {
        const lmcVariants = [
          'line manager check', 'Line Manager Check', 'LINE MANAGER CHECK', 'Line manager Check',
          'line_manager_check', 'Line_Manager_Check', 'LINE_MANAGER_CHECK', 'Line_manager_Check',
          'line-manager-check', 'Line-Manager-Check', 'LINE-MANAGER-CHECK', 'Line-manager-Check',
          'linemanagercheck', 'LineManagerCheck', 'LINEMANAGERCHECK', 'LinemanagerCheck',
          'lmc', 'LMC', 'Lmc',
          'pms_line_manager_check', 'PMS_LINE_MANAGER_CHECK', 'pms-line-manager-check', 'PMS-LINE-MANAGER-CHECK', 'pms line manager check', 'PMS LINE MANAGER CHECK'
        ];
        variants.push(...lmcVariants);
        lmcVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
      }
      if (normalizedLower.includes('senior') && normalizedLower.includes('management')) {
        const smtVariants = [
          'senior management tour', 'Senior Management Tour', 'SENIOR MANAGEMENT TOUR', 'Senior management Tour',
          'senior_management_tour', 'Senior_Management_Tour', 'SENIOR_MANAGEMENT_TOUR', 'Senior_management_Tour',
          'senior-management-tour', 'Senior-Management-Tour', 'SENIOR-MANAGEMENT-TOUR', 'Senior-management-Tour',
          'seniormanagementtour', 'SeniorManagementTour', 'SENIORMANAGEMENTTOUR', 'SeniormanagementTour',
          'smt', 'SMT', 'Smt',
          'pms_senior_management_tour', 'PMS_SENIOR_MANAGEMENT_TOUR', 'pms-senior-management-tour', 'PMS-SENIOR-MANAGEMENT-TOUR', 'pms senior management tour', 'PMS SENIOR MANAGEMENT TOUR'
        ];
        variants.push(...smtVariants);
        smtVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
      }
      if (normalizedLower.includes('krcc')) {
        const krccVariants = [
          'krcc list', 'Krcc List', 'KRCC LIST', 'KRCC List', 'Krcc list',
          'krcc_list', 'Krcc_List', 'KRCC_LIST', 'KRCC_List', 'Krcc_list',
          'krcc-list', 'Krcc-List', 'KRCC-LIST', 'KRCC-List', 'Krcc-list',
          'krcclist', 'KrccList', 'KRCCLIST', 'KRCCList', 'Krcclist',
          'krcc', 'KRCC', 'Krcc',
          'pms_krcc_list', 'PMS_KRCC_LIST', 'pms-krcc-list', 'PMS-KRCC-LIST', 'pms krcc list', 'PMS KRCC LIST'
        ];
        variants.push(...krccVariants);
        krccVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
      }
      if (normalizedLower.includes('training')) {
        const trainingVariants = [
          'training_list', 'Training_List', 'TRAINING_LIST', 'Training_list',
          'training list', 'Training List', 'TRAINING LIST', 'Training list',
          'training-list', 'Training-List', 'TRAINING-LIST', 'Training-list',
          'traininglist', 'TrainingList', 'TRAININGLIST', 'Traininglist',
          'training', 'Training', 'TRAINING',
          'pms_training_list', 'PMS_TRAINING_LIST', 'pms-training-list', 'PMS-TRAINING-LIST', 'pms training list', 'PMS TRAINING LIST',
          'pms_training', 'PMS_TRAINING', 'pms-training', 'PMS-TRAINING', 'pms training', 'PMS TRAINING'
        ];
        variants.push(...trainingVariants);
        trainingVariants.forEach(variant => variants.push(...generateSeparatorVariants(variant)));
      }
      
      // Remove duplicates and return unique variants
      return [...new Set(variants)];
    };

    // Find module
    const module = userRole.lock_modules.find(m => 
      m.module_name.toLowerCase() === moduleName.toLowerCase() ||
      m.module_name.toLowerCase() === 'pms'
    );
    
    if (!module || !module.module_active) {
      return { 
        result: 'DENIED', 
        message: `Module "${moduleName}" not found or not active`,
        details: { module_found: !!module, module_active: module?.module_active }
      };
    }

    if (functionName) {
      const functionVariants = normalizeFunctionName(functionName);
      
      // Find function by function_name or action_name with enhanced matching
      const func = module.lock_functions.find(f => {
        const functionNameVariants = normalizeFunctionName(f.function_name);
        const actionNameVariants = (f as any).action_name ? normalizeFunctionName((f as any).action_name) : [];
        
        // Check if any search variant matches any function name variant
        const functionNameMatch = functionVariants.some(searchVariant => 
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
          functionVariants.some(searchVariant => {
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
      
      if (!func || !func.function_active) {
        return { 
          result: 'DENIED', 
          message: `Function "${functionName}" not found or not active`,
          details: { 
            function_found: !!func, 
            function_active: func?.function_active,
            searched_variants: functionVariants,
            available_functions: module.lock_functions.map(f => ({
              name: f.function_name,
              action_name: (f as any).action_name,
              active: f.function_active
            }))
          }
        };
      }

      if (subFunctionName) {
        const subFunc = func.sub_functions.find(sf => 
          sf.sub_function_name === subFunctionName ||
          sf.sub_function_name.toLowerCase() === subFunctionName.toLowerCase()
        );
        
        if (!subFunc || !subFunc.enabled || !subFunc.sub_function_active) {
          return { 
            result: 'DENIED', 
            message: `Sub-function "${subFunctionName}" not found, not enabled, or not active`,
            details: {
              subfunction_found: !!subFunc,
              subfunction_enabled: subFunc?.enabled,
              subfunction_active: subFunc?.sub_function_active
            }
          };
        }
      }
    }

    return { result: 'GRANTED', message: 'Permission granted' };
  };

  // Test cases
  const testCases = [
    // Basic function tests
    { moduleName: 'PMS', functionName: 'assets', label: 'Assets (using "assets")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'Asset', label: 'Assets (using "Asset")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms_assets', label: 'Assets (using "pms_assets")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms-assets', label: 'Assets (using "pms-assets")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms assets', label: 'Assets (using "pms assets")', subFunctionName: undefined },
    
    // Ticket variations
    { moduleName: 'PMS', functionName: 'tickets', label: 'Tickets (using "tickets")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms_complaints', label: 'Tickets (using "pms_complaints")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms-complaints', label: 'Tickets (using "pms-complaints")', subFunctionName: undefined },
    
    // Service variations
    { moduleName: 'PMS', functionName: 'services', label: 'Services (using "services")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms_services', label: 'Services (using "pms_services")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms-services', label: 'Services (using "pms-services")', subFunctionName: undefined },
    
    // Task variations
    { moduleName: 'PMS', functionName: 'tasks', label: 'Tasks (using "tasks")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms_tasks', label: 'Tasks (using "pms_tasks")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms-tasks', label: 'Tasks (using "pms-tasks")', subFunctionName: undefined },
    
    // M-Safe variations
    { moduleName: 'PMS', functionName: 'Msafe', label: 'M-Safe (using "Msafe")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'm-safe', label: 'M-Safe (using "m-safe")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'm_safe', label: 'M-Safe (using "m_safe")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'm safe', label: 'M-Safe (using "m safe")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms_msafe', label: 'M-Safe (using "pms_msafe")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms-msafe', label: 'M-Safe (using "pms-msafe")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'pms msafe', label: 'M-Safe (using "pms msafe")', subFunctionName: undefined },
    
    // M-Safe sub-function variations
    { moduleName: 'PMS', functionName: 'Non Fte Users', label: 'Non FTE Users (using "Non Fte Users")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'non_fte_users', label: 'Non FTE Users (using "non_fte_users")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'non-fte-users', label: 'Non FTE Users (using "non-fte-users")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'Line Manager Check', label: 'LMC (using "Line Manager Check")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'line_manager_check', label: 'LMC (using "line_manager_check")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'line-manager-check', label: 'LMC (using "line-manager-check")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'Senior Management Tour', label: 'SMT (using "Senior Management Tour")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'senior_management_tour', label: 'SMT (using "senior_management_tour")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'senior-management-tour', label: 'SMT (using "senior-management-tour")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'Krcc List', label: 'KRCC List (using "Krcc List")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'krcc_list', label: 'KRCC List (using "krcc_list")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'krcc-list', label: 'KRCC List (using "krcc-list")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'training_list', label: 'Training List (using "training_list")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'training-list', label: 'Training List (using "training-list")', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'training list', label: 'Training List (using "training list")', subFunctionName: undefined },
    
    // Additional keystroke variations
    { moduleName: 'PMS', functionName: 'asset management', label: 'Asset Management (space)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'asset_management', label: 'Asset Management (underscore)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'asset-management', label: 'Asset Management (hyphen)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'assetmanagement', label: 'Asset Management (no separator)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'ticket management', label: 'Ticket Management (space)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'ticket_management', label: 'Ticket Management (underscore)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'ticket-management', label: 'Ticket Management (hyphen)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'service requests', label: 'Service Requests (space)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'service_requests', label: 'Service Requests (underscore)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'service-requests', label: 'Service Requests (hyphen)', subFunctionName: undefined },
    
    // Edge cases for M-Safe variations
    { moduleName: 'PMS', functionName: 'MSafe', label: 'M-Safe (CamelCase)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'MSAFE', label: 'M-Safe (uppercase)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'msafe', label: 'M-Safe (lowercase)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'M Safe', label: 'M-Safe (capital with space)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'M-Safe', label: 'M-Safe (capital with hyphen)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'M_Safe', label: 'M-Safe (capital with underscore)', subFunctionName: undefined },
    
    // More sub-function variations with different casings
    { moduleName: 'PMS', functionName: 'NonFTEUsers', label: 'Non FTE Users (CamelCase)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'NONFTEUSERS', label: 'Non FTE Users (uppercase)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'LineManagerCheck', label: 'LMC (CamelCase)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'LINEMANAGERCHECK', label: 'LMC (uppercase)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'SeniorManagementTour', label: 'SMT (CamelCase)', subFunctionName: undefined },
    { moduleName: 'PMS', functionName: 'SENIORMANAGEMENTTOUR', label: 'SMT (uppercase)', subFunctionName: undefined },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Permission Testing Tool</h3>
      
      <div className="space-y-4">
        {testCases.map((testCase, index) => {
          const result = testPermission(testCase.moduleName, testCase.functionName, testCase.subFunctionName);
          
          return (
            <div key={index} className="border rounded p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{testCase.label}</span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${
                  result.result === 'GRANTED' 
                    ? 'bg-green-100 text-green-800' 
                    : result.result === 'DENIED'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {result.result}
                </span>
              </div>
              <div className="text-sm text-gray-600 mb-2">
                Module: {testCase.moduleName}, Function: {testCase.functionName}
                {testCase.subFunctionName && `, Sub-function: ${testCase.subFunctionName}`}
              </div>
              <div className="text-sm text-gray-700">{result.message}</div>
              {result.details && (
                <details className="mt-2">
                  <summary className="text-xs cursor-pointer text-blue-600">View Details</summary>
                  <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          );
        })}
      </div>

      {userRole && (
        <div className="mt-6">
          <h4 className="font-medium mb-2">Current User Role Data:</h4>
          <details>
            <summary className="text-sm cursor-pointer text-blue-600">View Raw API Response</summary>
            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto max-h-64">
              {JSON.stringify(userRole, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </Card>
  );
};

export default PermissionTester;
