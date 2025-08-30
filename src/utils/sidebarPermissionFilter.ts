import { UserRoleResponse, permissionService } from '@/services/permissionService';

export interface SidebarItem {
  name: string;
  icon?: any;
  href?: string;
  color?: string;
  subItems?: SidebarItem[];
  moduleName?: string;
  functionName?: string;
  subFunctionName?: string;
}

export interface SidebarSection {
  [key: string]: {
    icon?: any;
    items: SidebarItem[];
  };
}

export const sidebarPermissionFilter = {
  /**
   * Filter a single sidebar item based on user permissions
   */
  filterSidebarItem(item: SidebarItem, userRole: UserRoleResponse | null): SidebarItem | null {
    // If no permissions context, show all items (fallback)
    if (!userRole) return item;

    // Check if item has permission requirements
    if (item.moduleName) {
      const hasModuleAccess = permissionService.isModuleEnabled(userRole, item.moduleName);
      if (!hasModuleAccess) return null;

      // Check function level permissions
      if (item.functionName) {
        const hasFunctionAccess = permissionService.isFunctionEnabled(userRole, item.moduleName, item.functionName);
        if (!hasFunctionAccess) return null;

        // Check sub-function level permissions
        if (item.subFunctionName) {
          const hasSubFunctionAccess = permissionService.isSubFunctionEnabled(
            userRole, 
            item.moduleName, 
            item.functionName, 
            item.subFunctionName
          );
          if (!hasSubFunctionAccess) return null;
        }
      }
    }

    // Check path-based permissions if no specific module/function is defined
    if (!item.moduleName && item.href) {
      const hasPathAccess = permissionService.hasPermissionForPath(userRole, item.href);
      if (!hasPathAccess) return null;
    }

    // Filter sub-items recursively
    const filteredItem = { ...item };
    if (item.subItems) {
      const filteredSubItems = item.subItems
        .map(subItem => this.filterSidebarItem(subItem, userRole))
        .filter(Boolean) as SidebarItem[];
      
      // If item has sub-items but all are filtered out, hide the parent too
      if (item.subItems.length > 0 && filteredSubItems.length === 0) {
        return null;
      }
      
      filteredItem.subItems = filteredSubItems;
    }

    return filteredItem;
  },

  /**
   * Filter an array of sidebar items based on user permissions
   */
  filterSidebarItems(items: SidebarItem[], userRole: UserRoleResponse | null): SidebarItem[] {
    return items
      .map(item => this.filterSidebarItem(item, userRole))
      .filter(Boolean) as SidebarItem[];
  },

  /**
   * Filter sidebar modules by package based on user permissions
   */
  filterModulesByPackage(modulesByPackage: { [key: string]: SidebarItem[] }, userRole: UserRoleResponse | null): { [key: string]: SidebarItem[] } {
    const filtered: { [key: string]: SidebarItem[] } = {};
    
    for (const [packageName, items] of Object.entries(modulesByPackage)) {
      const filteredItems = this.filterSidebarItems(items, userRole);
      
      // Only include the package if it has accessible items
      if (filteredItems.length > 0) {
        filtered[packageName] = filteredItems;
      }
    }
    
    return filtered;
  },

  /**
   * Filter navigation structure based on user permissions
   */
  filterNavigationStructure(navigationStructure: SidebarSection, userRole: UserRoleResponse | null): SidebarSection {
    const filtered: SidebarSection = {};
    
    for (const [sectionName, section] of Object.entries(navigationStructure)) {
      const filteredItems = this.filterSidebarItems(section.items, userRole);
      
      // Only include the section if it has accessible items
      if (filteredItems.length > 0) {
        filtered[sectionName] = {
          ...section,
          items: filteredItems
        };
      }
    }
    
    return filtered;
  }
};

/**
 * Helper function to add permission metadata to sidebar items
 * This makes it easier to configure permissions for specific items
 */
export const addPermissionMetadata = (item: SidebarItem, moduleName?: string, functionName?: string, subFunctionName?: string): SidebarItem => {
  return {
    ...item,
    moduleName,
    functionName,
    subFunctionName
  };
};

/**
 * Helper function to create sidebar items with permission metadata
 */
export const createSidebarItem = (
  name: string,
  options: {
    icon?: any;
    href?: string;
    color?: string;
    subItems?: SidebarItem[];
    moduleName?: string;
    functionName?: string;
    subFunctionName?: string;
  } = {}
): SidebarItem => {
  return {
    name,
    ...options
  };
};
