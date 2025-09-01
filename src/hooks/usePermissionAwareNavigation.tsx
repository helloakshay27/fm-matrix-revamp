import React from 'react';
import { usePermissions } from '@/contexts/PermissionsContext';

/**
 * Hook to get permission-aware navigation items
 * Use this in any component that needs to show/hide items based on permissions
 */
export const usePermissionAwareNavigation = () => {
  const { userRole, isModuleEnabled, isFunctionEnabled, isSubFunctionEnabled, hasPermissionForPath } = usePermissions();

  const checkItemPermission = (item: {
    moduleName?: string;
    functionName?: string;
    subFunctionName?: string;
    href?: string;
  }): boolean => {
    if (!userRole) {
      // If no user role loaded yet, show items (you can change this behavior)
      return true;
    }

    // Check specific permission levels if defined
    if (item.moduleName) {
      if (!isModuleEnabled(item.moduleName)) return false;
      
      if (item.functionName) {
        if (!isFunctionEnabled(item.moduleName, item.functionName)) return false;
        
        if (item.subFunctionName) {
          if (!isSubFunctionEnabled(item.moduleName, item.functionName, item.subFunctionName)) return false;
        }
      }
    }
    
    // Check path-based permissions as fallback
    if (item.href && !item.moduleName) {
      return hasPermissionForPath(item.href);
    }

    return true;
  };

  return {
    userRole,
    checkItemPermission,
    isModuleEnabled,
    isFunctionEnabled,
    isSubFunctionEnabled,
    hasPermissionForPath
  };
};

/**
 * Component wrapper that only renders children if user has required permissions
 */
interface PermissionGateProps {
  children: React.ReactNode;
  moduleName?: string;
  functionName?: string;
  subFunctionName?: string;
  href?: string;
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({
  children,
  moduleName,
  functionName,
  subFunctionName,
  href,
  fallback = null
}) => {
  const { checkItemPermission } = usePermissionAwareNavigation();

  const hasPermission = checkItemPermission({
    moduleName,
    functionName,
    subFunctionName,
    href
  });

  return hasPermission ? <>{children}</> : <>{fallback}</>;
};

/**
 * Example usage in components:
 * 
 * // Basic module check
 * <PermissionGate moduleName="safety">
 *   <Button>Safety Module Button</Button>
 * </PermissionGate>
 * 
 * // Function level check
 * <PermissionGate moduleName="safety" functionName="M Safe">
 *   <MSafeComponent />
 * </PermissionGate>
 * 
 * // Sub-function level check  
 * <PermissionGate 
 *   moduleName="safety" 
 *   functionName="M Safe" 
 *   subFunctionName="m_safe_all"
 * >
 *   <ViewAllButton />
 * </PermissionGate>
 * 
 * // Path-based check
 * <PermissionGate href="/custom-page">
 *   <CustomPageLink />
 * </PermissionGate>
 * 
 * // With fallback
 * <PermissionGate 
 *   moduleName="safety" 
 *   fallback={<div>Access denied</div>}
 * >
 *   <SafetyContent />
 * </PermissionGate>
 */
