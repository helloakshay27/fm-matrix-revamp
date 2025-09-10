import { useDynamicPermissions } from '@/hooks/useDynamicPermissions';

/**
 * Utility functions for easy integration with existing components
 */

// Example sidebar item interface
export interface SidebarItem {
  id: string;
  name: string;
  icon?: string;
  path?: string;
  module: string;
  function?: string;
  subFunction?: string;
  children?: SidebarItem[];
}

// Example button config interface  
export interface ButtonConfig {
  id: string;
  label: string;
  action: string;
  variant?: 'default' | 'outline' | 'destructive' | 'secondary';
  module: string;
  function: string;
  subFunction: string;
}

/**
 * Helper functions to use in your existing components
 */

// Filter sidebar items based on permissions
export const useFilteredSidebar = (sidebarItems: SidebarItem[]): SidebarItem[] => {
  const { shouldShowModule, shouldShowFunction, shouldShowSubFunction } = useDynamicPermissions();

  const filterItems = (items: SidebarItem[]): SidebarItem[] => {
    return items
      .filter(item => {
        // Check module permission
        if (!shouldShowModule(item.module)) return false;
        
        // Check function permission if specified
        if (item.function && !shouldShowFunction(item.module, item.function)) return false;
        
        // Check sub-function permission if specified
        if (item.subFunction && item.function && !shouldShowSubFunction(item.module, item.function, item.subFunction)) return false;
        
        return true;
      })
      .map(item => ({
        ...item,
        children: item.children ? filterItems(item.children) : undefined
      }))
      .filter(item => !item.children || item.children.length > 0); // Remove parent items with no visible children
  };

  return filterItems(sidebarItems);
};

// Generate dynamic buttons based on sub-functions
export const useDynamicButtons = (moduleName: string, functionName: string): ButtonConfig[] => {
  const { getFunctionSubFunctions } = useDynamicPermissions();
  
  const subFunctions = getFunctionSubFunctions(moduleName, functionName);
  
  return subFunctions.map(subFunc => ({
    id: `${moduleName}_${functionName}_${subFunc.sub_function_name}`,
    label: subFunc.sub_function_display_name,
    action: subFunc.sub_function_name,
    variant: getButtonVariant(subFunc.sub_function_name),
    module: moduleName,
    function: functionName,
    subFunction: subFunc.sub_function_name
  }));
};

// Helper to determine button variant based on action
const getButtonVariant = (action: string): 'default' | 'outline' | 'destructive' | 'secondary' => {
  const actionLower = action.toLowerCase();
  
  if (actionLower.includes('destroy') || actionLower.includes('delete')) return 'destructive';
  if (actionLower.includes('create') || actionLower.includes('add')) return 'default';
  if (actionLower.includes('edit') || actionLower.includes('update')) return 'outline';
  if (actionLower.includes('export') || actionLower.includes('download')) return 'secondary';
  
  return 'outline';
};

// Quick permission checker for inline use
export const useQuickPermissions = () => {
  const { shouldShowModule, shouldShowFunction, shouldShowSubFunction } = useDynamicPermissions();

  return {
    // Simple boolean checks
    canViewModule: (module: string) => shouldShowModule(module),
    canUseFunction: (module: string, func: string) => shouldShowFunction(module, func),
    canExecuteAction: (module: string, func: string, action: string) => shouldShowSubFunction(module, func, action),
    
    // Conditional class names for styling
    getVisibilityClass: (module: string, func?: string, action?: string) => {
      if (action && func && !shouldShowSubFunction(module, func, action)) return 'hidden';
      if (func && !shouldShowFunction(module, func)) return 'hidden';
      if (!shouldShowModule(module)) return 'hidden';
      return 'visible';
    },
    
    // Conditional props for components
    getConditionalProps: (module: string, func?: string, action?: string) => {
      if (action && func) {
        return { disabled: !shouldShowSubFunction(module, func, action) };
      }
      if (func) {
        return { disabled: !shouldShowFunction(module, func) };
      }
      return { disabled: !shouldShowModule(module) };
    }
  };
};
