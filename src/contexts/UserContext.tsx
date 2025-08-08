import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { userService, UserRoleResponse } from '../services/userService';
import { parsePermissionsHash, PermissionsHash } from '../utils/permissions';

interface UserContextType {
  permissions: PermissionsHash;
  roleName: string | null;
  isLoading: boolean;
  error: string | null;
  refreshPermissions: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [permissions, setPermissions] = useState<PermissionsHash>({});
  const [roleName, setRoleName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🚀 Fetching user permissions from API...');
      
      // Make the actual API call
      const response = await userService.getUserRole();
      console.log('📡 Raw API response:', response);
      
      // Handle different response structures
      let parsedPermissions: PermissionsHash = {};
      let userRoleName: string = 'User';
      
      if (response.user_role) {
        // Standard response structure
        const { role_name, permissions_hash } = response.user_role;
        userRoleName = role_name;
        parsedPermissions = parsePermissionsHash(permissions_hash);
        
        console.log('✅ User role structure detected:', {
          roleName: role_name,
          permissionsHash: permissions_hash,
          parsedPermissions: parsedPermissions
        });
      } else if (response.permissions_hash) {
        // Direct permissions_hash response
        parsedPermissions = parsePermissionsHash(response.permissions_hash);
        userRoleName = 'User'; // Default role name
        
        console.log('✅ Direct permissions_hash structure detected:', {
          permissionsHash: response.permissions_hash,
          parsedPermissions: parsedPermissions
        });
      } else {
        console.error('❌ Unexpected API response structure:', response);
        throw new Error('Unexpected API response format');
      }
      
      // Set the permissions and role
      setRoleName(userRoleName);
      setPermissions(parsedPermissions);
      
      console.log('🎯 Final permissions set:', {
        roleName: userRoleName,
        totalPermissions: Object.keys(parsedPermissions).length,
        permissions: parsedPermissions
      });
      
      // Debug: Check specific module permissions
      console.log('🔍 Module permission checks:');
      const testModules = ['master', 'maintenance', 'settings', 'security', 'finance'];
      testModules.forEach(module => {
        const hasAccess = parsedPermissions[module];
        console.log(`  ${module}: ${hasAccess ? '✅ Allowed' : '❌ Denied'}`);
      });
      
    } catch (err) {
      console.error('Error fetching user role:', err);
      setError('Failed to load user permissions');
      setPermissions({});
      setRoleName(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load permissions on mount
    refreshPermissions();
  }, []);

  const value: UserContextType = {
    permissions,
    roleName,
    isLoading,
    error,
    refreshPermissions
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
