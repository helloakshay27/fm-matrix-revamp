import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import {
  UserRoleResponse,
  permissionService,
} from "@/services/permissionService";
import { permissionCache } from "@/services/simplePermissionCache";
import { isAuthenticated } from "@/utils/auth";

interface PermissionsContextType {
  userRole: UserRoleResponse | null;
  loading: boolean;
  error: string | null;
  refreshPermissions: () => Promise<void>;
  isModuleEnabled: (moduleName: string) => boolean;
  isFunctionEnabled: (moduleName: string, functionName: string) => boolean;
  isSubFunctionEnabled: (
    moduleName: string,
    functionName: string,
    subFunctionName: string
  ) => boolean;
  hasPermissionForPath: (path: string) => boolean;
  // NEW: Function-only methods (ignoring module)
  isFunctionEnabledAnywhere: (functionName: string) => boolean;
  isSubFunctionEnabledAnywhere: (
    functionName: string,
    subFunctionName: string
  ) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error("usePermissions must be used within a PermissionsProvider");
  }
  return context;
};

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  children,
}) => {
  const [userRole, setUserRole] = useState<UserRoleResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  const fetchUserPermissions = useCallback(async () => {
    // Don't fetch permissions if user is not authenticated
    if (!isAuthenticated()) {
      setUserRole(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const role = await permissionService.getUserRole();
      if (role) {
        setUserRole(role);
        // Store in cache for fast access
        permissionCache.store(role);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch user permissions";
      setError(errorMessage);
      console.error("Error fetching user permissions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh permissions on every route change (page navigation)
  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserPermissions();
    }
  }, [location.pathname, fetchUserPermissions]);

  // Initial load of permissions
  useEffect(() => {
    fetchUserPermissions();
  }, [fetchUserPermissions]);

  const refreshPermissions = useCallback(async () => {
    await fetchUserPermissions();
  }, [fetchUserPermissions]);

  const isModuleEnabled = useCallback(
    (moduleName: string): boolean => {
      // Try cache first for better performance
      const cached = permissionCache.isModuleEnabled(moduleName);
      if (cached !== false || !userRole) return cached;

      // Fallback to service
      return permissionService.isModuleEnabled(userRole, moduleName);
    },
    [userRole]
  );

  const isFunctionEnabled = useCallback(
    (moduleName: string, functionName: string): boolean => {
      // Try cache first for better performance
      const cached = permissionCache.isFunctionEnabled(
        moduleName,
        functionName
      );
      if (cached !== false || !userRole) return cached;

      // Fallback to service
      return permissionService.isFunctionEnabled(
        userRole,
        moduleName,
        functionName
      );
    },
    [userRole]
  );

  const isSubFunctionEnabled = useCallback(
    (
      moduleName: string,
      functionName: string,
      subFunctionName: string
    ): boolean => {
      // Try cache first for better performance
      const cached = permissionCache.isSubFunctionEnabled(
        moduleName,
        functionName,
        subFunctionName
      );
      if (cached !== false || !userRole) return cached;

      // Fallback to service
      return permissionService.isSubFunctionEnabled(
        userRole,
        moduleName,
        functionName,
        subFunctionName
      );
    },
    [userRole]
  );

  const isFunctionEnabledAnywhere = useCallback(
    (functionName: string): boolean => {
      // Try cache first for better performance
      // TODO: Add cache support for function-only checks
      if (!userRole) return false;

      // Use new service method
      return permissionService.isFunctionEnabledAnywhere(
        userRole,
        functionName
      );
    },
    [userRole]
  );

  const isSubFunctionEnabledAnywhere = useCallback(
    (functionName: string, subFunctionName: string): boolean => {
      // Try cache first for better performance
      // TODO: Add cache support for sub-function-only checks
      if (!userRole) return true; // Fallback when no role data

      // Use new service method
      return permissionService.isSubFunctionEnabledAnywhere(
        userRole,
        functionName,
        subFunctionName
      );
    },
    [userRole]
  );

  const hasPermissionForPath = useCallback(
    (path: string): boolean => {
      return permissionService.hasPermissionForPath(userRole, path);
    },
    [userRole]
  );

  return (
    <PermissionsContext.Provider
      value={{
        userRole,
        loading,
        error,
        refreshPermissions,
        isModuleEnabled,
        isFunctionEnabled,
        isSubFunctionEnabled,
        hasPermissionForPath,
        isFunctionEnabledAnywhere,
        isSubFunctionEnabledAnywhere,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};
