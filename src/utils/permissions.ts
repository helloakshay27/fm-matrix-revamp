/**
 * Utility functions for handling user permissions and dynamic sidebar filtering
 */

export interface PermissionsHash {
  [moduleKey: string]: {
    [action: string]: string | boolean;
  };
}

/**
 * Parse the permissions_hash from the API into a structured object
 * Format: Can be either a JSON string or direct object with module permissions like:
 * {"module_name": {"all": "true", "create": "true", "show": "true", "update": "true", "destroy": "true"}}
 */
export const parsePermissionsHash = (permissionsHash: string | object): PermissionsHash => {
  if (!permissionsHash) {
    return {};
  }

  try {
    // If it's already an object, return it directly
    if (typeof permissionsHash === 'object') {
      return permissionsHash as PermissionsHash;
    }
    
    // If it's a string, try to parse it as JSON
    if (typeof permissionsHash === 'string' && permissionsHash.trim() !== '') {
      const parsed = JSON.parse(permissionsHash);
      return parsed;
    }
    
    return {};
  } catch (error) {
    console.error('Error parsing permissions hash:', error);
    return {};
  }
};

/**
 * Convert a display name to an API key format
 * Example: "Role Setup" -> "role_setup"
 */
export const convertToApiKey = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters except spaces and underscores
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/_+/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
};

/**
 * Get the module key from a module name
 * Example: "Settings" -> "settings"
 */
export const getModuleKey = (moduleName: string): string => {
  return convertToApiKey(moduleName);
};

/**
 * Check if a user has permission for a specific function
 */
export const hasPermission = (
  permissions: PermissionsHash, 
  moduleKey: string, 
  action: string = 'all'
): boolean => {
  const modulePermissions = permissions[moduleKey];
  if (!modulePermissions) return false;
  
  const permissionValue = modulePermissions[action];
  
  // Handle both string and boolean values
  if (typeof permissionValue === 'string') {
    return permissionValue === 'true';
  }
  if (typeof permissionValue === 'boolean') {
    return permissionValue;
  }
  
  return false;
};

/**
 * Check if a user has any permissions for a module
 */
export const hasModulePermission = (
  permissions: PermissionsHash, 
  moduleKey: string
): boolean => {
  const modulePermissions = permissions[moduleKey];
  if (!modulePermissions) {
    console.log(`❌ No permissions found for module: ${moduleKey}`);
    return false;
  }
  
  // Check for common permission types
  const commonActions = ['all', 'show', 'index', 'read'];
  
  for (const action of commonActions) {
    if (hasPermission(permissions, moduleKey, action)) {
      console.log(`✅ Module ${moduleKey} has ${action} permission`);
      return true;
    }
  }
  
  // If no common actions found, check if any permission is true
  const allActions = Object.keys(modulePermissions);
  for (const action of allActions) {
    if (hasPermission(permissions, moduleKey, action)) {
      console.log(`✅ Module ${moduleKey} has ${action} permission (fallback)`);
      return true;
    }
  }
  
  console.log(`❌ Module ${moduleKey} has no valid permissions:`, modulePermissions);
  return false;
};

/**
 * Filter a sidebar item based on user permissions
 */
export const filterSidebarItem = (item: any, permissions: PermissionsHash): any | null => {
  if (!item) return null;

  // If item has subItems, filter them recursively
  if (item.subItems && Array.isArray(item.subItems)) {
    const filteredSubItems = item.subItems
      .map((subItem: any) => filterSidebarItem(subItem, permissions))
      .filter((subItem: any) => subItem !== null);

    // If no sub-items are visible, hide the parent item
    if (filteredSubItems.length === 0) {
      return null;
    }

    return {
      ...item,
      subItems: filteredSubItems
    };
  }

  // For leaf items (with href), check permission
  if (item.href) {
    const functionKey = convertToApiKey(item.name);
    
    // We need to determine which module this function belongs to
    // This requires context from the parent module
    // For now, we'll return the item and let the parent filter it
    return item;
  }

  // For items without href or subItems, return as-is
  return item;
};

/**
 * Filter sidebar modules based on user permissions
 */
export const filterSidebarModules = (modules: any[], permissions: PermissionsHash, modulePrefix: string): any[] => {
  return modules
    .map(module => {
      // If module has subItems, filter them
      if (module.subItems && Array.isArray(module.subItems)) {
        const filteredSubItems = module.subItems
          .map((subItem: any) => {
            if (subItem.subItems && Array.isArray(subItem.subItems)) {
              // Handle nested subItems
              const filteredNestedItems = subItem.subItems.filter((nestedItem: any) => {
                if (nestedItem.href) {
                  const functionKey = convertToApiKey(nestedItem.name);
                  return hasPermission(permissions, functionKey, 'show');
                }
                return true;
              });

              if (filteredNestedItems.length === 0) {
                return null;
              }

              return {
                ...subItem,
                subItems: filteredNestedItems
              };
            } else if (subItem.href) {
              // Direct href item
              const functionKey = convertToApiKey(subItem.name);
              return hasPermission(permissions, functionKey, 'show') ? subItem : null;
            }
            return subItem;
          })
          .filter(item => item !== null);

        if (filteredSubItems.length === 0) {
          return null;
        }

        return {
          ...module,
          subItems: filteredSubItems
        };
      }

      // For modules without subItems, check module permission
      const moduleKey = getModuleKey(module.name);
      return hasModulePermission(permissions, moduleKey) ? module : null;
    })
    .filter(module => module !== null);
};

/**
 * Filter navigation structure based on permissions
 */
export const filterNavigationStructure = (
  navigationStructure: any, 
  permissions: PermissionsHash
): any => {
  const filtered: any = {};

  Object.keys(navigationStructure).forEach(sectionKey => {
    const section = navigationStructure[sectionKey];
    const sectionModuleKey = getModuleKey(sectionKey);

    if (section.items && Array.isArray(section.items)) {
      const filteredItems = section.items
        .map((item: any) => {
          if (item.subItems && Array.isArray(item.subItems)) {
            const filteredSubItems = item.subItems
              .map((subItem: any) => {
                if (subItem.subItems && Array.isArray(subItem.subItems)) {
                  // Handle nested subItems
                  const filteredNestedItems = subItem.subItems.filter((nestedItem: any) => {
                    if (nestedItem.href) {
                      const functionKey = convertToApiKey(nestedItem.name);
                      return hasPermission(permissions, functionKey, 'show');
                    }
                    return true;
                  });

                  if (filteredNestedItems.length === 0) {
                    return null;
                  }

                  return {
                    ...subItem,
                    subItems: filteredNestedItems
                  };
                } else if (subItem.href) {
                  // Direct href item
                  const functionKey = convertToApiKey(subItem.name);
                  return hasPermission(permissions, functionKey, 'show') ? subItem : null;
                }
                return subItem;
              })
              .filter(subItem => subItem !== null);

            if (filteredSubItems.length === 0) {
              return null;
            }

            return {
              ...item,
              subItems: filteredSubItems
            };
          }

          return item;
        })
        .filter(item => item !== null);

      // Only include section if it has visible items
      if (filteredItems.length > 0) {
        filtered[sectionKey] = {
          ...section,
          items: filteredItems
        };
      }
    } else {
      // Section without items - check if user has module permission
      if (hasModulePermission(permissions, sectionModuleKey)) {
        filtered[sectionKey] = section;
      }
    }
  });

  return filtered;
};
