import { UserRoleResponse } from "@/services/permissionService";
import {
  modulesByPackage,
  sidebarToApiFunctionMapping,
} from "@/config/navigationConfig";
import { SidebarItem } from "@/utils/sidebarPermissionFilter";

/**
 * Check if a sidebar item is accessible based on user permissions
 * If an item has sub-items, it will be shown if ANY of its sub-items have permission
 */
export const checkPermission = (
  checkItem: any,
  userRole: UserRoleResponse | null
): boolean => {
  // If no user role data, show all items (or hide depending on security policy)
  if (!userRole) {
    console.log("checkPermission: No user role, showing all items");
    return true;
  }

  // Extract active functions from the API response (only from active modules)
  const activeFunctions: {
    functionName: string;
    actionName?: string;
    moduleName: string;
  }[] = [];

  // Process lock_modules structure - IGNORE module_active, only check function_active
  if (userRole.lock_modules && Array.isArray(userRole.lock_modules)) {
    userRole.lock_modules.forEach((module) => {
      // Process ALL modules regardless of module_active status
      if (module.lock_functions && Array.isArray(module.lock_functions)) {
        module.lock_functions.forEach((func) => {
          // Only check if the individual function is active
          if (func.function_active === 1) {
            activeFunctions.push({
              functionName: func.function_name,
              actionName: func.action_name,
              moduleName: module.module_name,
            });
          }
        });
      }
    });
  }

  // If no active functions found, hide all items
  if (activeFunctions.length === 0) {
    return false;
  }

  // Function to create search variants for matching
  const createSearchVariants = (name: string): string[] => {
    const variants = new Set([name]);
    const normalized = name.toLowerCase();

    variants.add(normalized);
    variants.add(normalized.replace(/\s+/g, "_"));
    variants.add(normalized.replace(/\s+/g, "-"));
    variants.add(normalized.replace(/\s+/g, ""));
    variants.add(normalized.replace(/_/g, " "));
    variants.add(normalized.replace(/_/g, "-"));
    variants.add(normalized.replace(/-/g, " "));
    variants.add(normalized.replace(/-/g, "_"));

    return Array.from(variants);
  };

  // Helper function to check if item directly matches permissions
  const checkDirectMatch = (item: any): boolean => {
    const itemNameLower = item.name.toLowerCase();
    const itemVariants = createSearchVariants(item.name);

    // Check if this sidebar item matches any active function
    const directMatch = activeFunctions.find((activeFunc) => {
      const funcNameLower = activeFunc.functionName.toLowerCase();
      const actionNameLower = activeFunc.actionName
        ? activeFunc.actionName.toLowerCase()
        : "";

      // Direct function name match
      const functionNameMatch = itemVariants.some(
        (variant) =>
          variant === funcNameLower ||
          funcNameLower.includes(variant) ||
          variant.includes(funcNameLower)
      );

      // Direct action name match
      const actionNameMatch =
        actionNameLower &&
        itemVariants.some(
          (variant) =>
            variant === actionNameLower ||
            actionNameLower.includes(variant) ||
            variant.includes(actionNameLower)
        );

      return functionNameMatch || actionNameMatch;
    });

    if (directMatch) {
      console.log("Smart Permission Check:", {
        item: item.name,
        matchType: "DIRECT_MATCH",
        matchedFunction: directMatch,
      });
      return true;
    }

    // Fallback to mapping-based check
    const potentialMatches =
      sidebarToApiFunctionMapping[
        itemNameLower as keyof typeof sidebarToApiFunctionMapping
      ] || [];

    const mappingMatch = activeFunctions.find((activeFunc) => {
      return potentialMatches.some((match) => {
        const matchLower = match.toLowerCase();
        const funcNameLower = activeFunc.functionName.toLowerCase();
        const actionNameLower = activeFunc.actionName
          ? activeFunc.actionName.toLowerCase()
          : "";

        // For short mapping keys (likely abbreviations like "po", "wo"), require strict equality
        if (matchLower.length < 4) {
          const isStrictMatch =
            funcNameLower === matchLower ||
            actionNameLower === matchLower ||
            funcNameLower.split(/[\s-_]+/).includes(matchLower) ||
            actionNameLower.split(/[\s-_]+/).includes(matchLower);
          return isStrictMatch;
        }

        // For longer keys, allow substring matching
        return (
          funcNameLower.includes(matchLower) ||
          actionNameLower.includes(matchLower) ||
          matchLower.includes(funcNameLower) ||
          matchLower.includes(actionNameLower)
        );
      });
    });

    if (mappingMatch) {
      console.log("Smart Permission Check:", {
        item: item.name,
        matchType: "MAPPING_MATCH",
        matchedFunction: mappingMatch,
        mappingMatches: potentialMatches,
      });
      return true;
    }

    return false;
  };

  // Check if current item has direct permission
  if (checkDirectMatch(checkItem)) {
    return true;
  }

  // IMPORTANT: If item has sub-items, check if ANY sub-item has permission
  // This ensures parent items (like M-Safe) show when children (like Training List) have permission
  if (checkItem.subItems && checkItem.subItems.length > 0) {
    const hasAccessibleSubItem = checkItem.subItems.some((subItem: any) => {
      // Check if sub-item has direct permission
      if (checkDirectMatch(subItem)) {
        console.log(
          `✅ Parent "${checkItem.name}" shown because child "${subItem.name}" has permission`
        );
        return true;
      }
      // Recursively check nested sub-items
      if (subItem.subItems && subItem.subItems.length > 0) {
        return subItem.subItems.some((nestedItem: any) => {
          if (checkDirectMatch(nestedItem)) {
            console.log(
              `✅ Parent "${checkItem.name}" shown because nested child "${nestedItem.name}" has permission`
            );
            return true;
          }
          return false;
        });
      }
      return false;
    });

    if (hasAccessibleSubItem) {
      return true;
    }
  }

  console.log("Smart Permission Check: Not Found", {
    item: checkItem.name,
  });
  return false;
};

/**
 * Find the first accessible route for the user
 */
export const findFirstAccessibleRoute = (
  userRole: UserRoleResponse | null
): string | null => {
  if (!userRole) return null;

  // Iterate through all packages and their items
  for (const packageName of Object.keys(modulesByPackage)) {
    const items = modulesByPackage[
      packageName as keyof typeof modulesByPackage
    ] as SidebarItem[];

    for (const item of items) {
      // Check if the item itself is accessible
      if (checkPermission(item, userRole)) {
        // If it has sub-items, check them recursively
        if (item.subItems && item.subItems.length > 0) {
          for (const subItem of item.subItems) {
            if (checkPermission(subItem, userRole)) {
              if (subItem.href) return subItem.href;

              // Check deeper nesting if needed (though usually 2 levels is max)
              if (subItem.subItems && subItem.subItems.length > 0) {
                for (const deepSubItem of subItem.subItems) {
                  if (deepSubItem.href) return deepSubItem.href;
                }
              }
            }
          }
        }

        // If no sub-items or none accessible, but parent is accessible and has href
        if (item.href) {
          return item.href;
        }
      }
    }
  }

  return null;
};
