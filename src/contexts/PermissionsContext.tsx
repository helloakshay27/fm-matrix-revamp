import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { UserRoleResponse, permissionService } from '@/services/permissionService';
import { isAuthenticated } from '@/utils/auth';

interface PermissionsContextType {
  userRole: UserRoleResponse | null;
  loading: boolean;
  error: string | null;
  refreshPermissions: () => Promise<void>;
  isModuleEnabled: (moduleName: string) => boolean;
  isFunctionEnabled: (moduleName: string, functionName: string) => boolean;
  isSubFunctionEnabled: (moduleName: string, functionName: string, subFunctionName: string) => boolean;
  hasPermissionForPath: (path: string) => boolean;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ children }) => {
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
      setUserRole(role);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user permissions';
      setError(errorMessage);
      console.error('Error fetching user permissions:', err);
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

  const isModuleEnabled = useCallback((moduleName: string): boolean => {
    return permissionService.isModuleEnabled(userRole, moduleName);
  }, [userRole]);

  const isFunctionEnabled = useCallback((moduleName: string, functionName: string): boolean => {
    return permissionService.isFunctionEnabled(userRole, moduleName, functionName);
  }, [userRole]);

  const isSubFunctionEnabled = useCallback((moduleName: string, functionName: string, subFunctionName: string): boolean => {
    return permissionService.isSubFunctionEnabled(userRole, moduleName, functionName, subFunctionName);
  }, [userRole]);

  const hasPermissionForPath = useCallback((path: string): boolean => {
    return permissionService.hasPermissionForPath(userRole, path);
  }, [userRole]);

  return (
    <PermissionsContext.Provider value={{
      userRole,
      loading,
      error,
      refreshPermissions,
      isModuleEnabled,
      isFunctionEnabled,
      isSubFunctionEnabled,
      hasPermissionForPath
    }}>
      {children}
    </PermissionsContext.Provider>
  );
};
