import { UserRoleResponse } from "@/services/permissionService";
import {
  modulesByPackage,
  sidebarToApiFunctionMapping,
} from "@/config/navigationConfig";
import { SidebarItem } from "@/utils/sidebarPermissionFilter";

/**
 * Check if a sidebar item is accessible based on user permissions.
 * This only checks the item itself - parent-child visibility logic is handled by Sidebar's filterSubItemsRecursively.
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
  // STRICT EXACT MATCH ONLY - no fuzzy matching, no word matching
  const checkDirectMatch = (item: any): boolean => {
    const itemNameLower = item.name.toLowerCase().trim();

    // Normalize spaces and dashes to underscores for comparison
    const itemNormalized = itemNameLower.replace(/[\s-]+/g, "_");

    // Check if this sidebar item EXACTLY matches any active function
    const directMatch = activeFunctions.find((activeFunc) => {
      const funcNameLower = activeFunc.functionName.toLowerCase().trim();
      const actionNameLower = activeFunc.actionName
        ? activeFunc.actionName.toLowerCase().trim()
        : "";

      // Normalize function name for comparison
      const funcNormalized = funcNameLower.replace(/[\s-]+/g, "_");

      // STRICT EXACT MATCH ONLY - no removing all separators
      // The sidebar item name must exactly equal the function name
      const isExactFunctionMatch =
        itemNameLower === funcNameLower || itemNormalized === funcNormalized;

      // EXACT MATCH for action name - sidebar item normalized must exactly equal action name
      const isExactActionMatch =
        actionNameLower && itemNormalized === actionNameLower;

      return isExactFunctionMatch || isExactActionMatch;
    });

    if (directMatch) {
      console.log("Smart Permission Check:", {
        item: item.name,
        matchType: "DIRECT_MATCH",
        matchedFunction: directMatch,
      });
      return true;
    }

    // Fallback to sidebarToApiFunctionMapping for special cases
    // (e.g., sidebar name differs from API function name)
    const potentialMatches =
      sidebarToApiFunctionMapping[
        itemNameLower as keyof typeof sidebarToApiFunctionMapping
      ] || [];

    if (potentialMatches.length === 0) {
      return false;
    }

    const mappingMatch = activeFunctions.find((activeFunc) => {
      return potentialMatches.some((match) => {
        const matchLower = match.toLowerCase().trim();
        // Normalize spaces and dashes to underscores for comparison
        const matchNormalized = matchLower.replace(/[\s-]+/g, "_");

        const funcNameLower = activeFunc.functionName.toLowerCase().trim();
        const funcNormalized = funcNameLower.replace(/[\s-]+/g, "_");

        const actionNameLower = activeFunc.actionName
          ? activeFunc.actionName.toLowerCase().trim()
          : "";

        // STRICT EXACT MATCH ONLY - no removing underscores
        // This prevents "msafe" from matching "m_safe"
        const isFunctionMatch =
          matchLower === funcNameLower || matchNormalized === funcNormalized;

        const isActionMatch =
          actionNameLower && matchNormalized === actionNameLower;

        return isFunctionMatch || isActionMatch;
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
  // Note: Parent-child recursive checking is now handled by Sidebar's filterSubItemsRecursively
  if (checkDirectMatch(checkItem)) {
    return true;
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
