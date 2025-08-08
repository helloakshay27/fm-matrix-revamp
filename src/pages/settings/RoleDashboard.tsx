import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { roleService, ApiRole } from '@/services/roleService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRoles, updateRolePermissions } from '@/store/slices/roleSlice';
import { getAuthHeader } from '@/config/apiConfig';
import sidebarConfig from '@/config/sidebarConfig.json';

interface Permission {
  name: string;
  module: string;
  all: boolean;
  add: boolean;
  view: boolean;
  edit: boolean;
  disable: boolean;
}

// Function to extract all module names and their items from sidebar config
const extractModulesAndFunctions = () => {
  const modules: { [key: string]: string[] } = {};
  
  // Extract from modulesByPackage
  Object.keys(sidebarConfig.modulesByPackage).forEach(packageName => {
    const packageModules = sidebarConfig.modulesByPackage[packageName];
    
    packageModules.forEach((module: any) => {
      if (!modules[packageName]) {
        modules[packageName] = [];
      }
      
      // Add main module
      modules[packageName].push(module.name);
      
      // Add sub-items if they exist
      if (module.subItems) {
        module.subItems.forEach((subItem: any) => {
          modules[packageName].push(subItem.name);
          
          // Add nested sub-items if they exist
          if (subItem.subItems) {
            subItem.subItems.forEach((nestedItem: any) => {
              modules[packageName].push(nestedItem.name);
            });
          }
        });
      }
    });
  });
  
  return modules;
};

// Function to convert function name to API key
const convertToApiKey = (functionName: string): string => {
  return functionName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters except spaces
    .trim()
    .replace(/\s+/g, '_'); // Replace spaces with underscores
};


export const RoleDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { roles, loading, error } = useAppSelector((state) => state.role);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Master');
  const [selectedRole, setSelectedRole] = useState<ApiRole | null>(null);
  const [rolePermissions, setRolePermissions] = useState<{ [roleId: number]: { [tab: string]: Permission[] } }>({});
  const [isUpdating, setIsUpdating] = useState(false);

  // Get modules and functions from static config
  const modulesAndFunctions = extractModulesAndFunctions();
  const moduleNames = Object.keys(modulesAndFunctions);

  // Fetch roles from API
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // Initialize permissions for roles when they are loaded
  useEffect(() => {
    if (roles.length > 0 && !isUpdating) {
      const initialPermissions: { [roleId: number]: { [tab: string]: Permission[] } } = {};
      
      roles.forEach(role => {
        // Only reinitialize if this role doesn't have permissions yet
        if (!rolePermissions[role.id]) {
          initialPermissions[role.id] = {};
          
          // Parse permissions_hash from API
          let rolePermissionsData: any = {};
          try {
            const permissionsHashValue = role.permissions_hash || '{}';
            console.log(`Loading permissions for role ${role.name}:`, permissionsHashValue);
            const parsedData = JSON.parse(permissionsHashValue);
            // Handle case where JSON.parse returns null (when permissions_hash is "null" string)
            rolePermissionsData = parsedData && typeof parsedData === 'object' ? parsedData : {};
            console.log('Parsed permissions data:', rolePermissionsData);
          } catch (error) {
            console.error('Error parsing permissions_hash for role:', role.name, error);
            rolePermissionsData = {};
          }
          
          // Initialize permissions for each module
          moduleNames.forEach(moduleName => {
            const functionsInModule = modulesAndFunctions[moduleName];
            
            initialPermissions[role.id][moduleName] = functionsInModule.map(functionName => {
              // Convert function name to API key to look up permissions
              const apiKey = convertToApiKey(functionName);
              let apiPermissions: any = {};
              
              // Look for permissions using the API key
              if (rolePermissionsData[apiKey]) {
                apiPermissions = rolePermissionsData[apiKey];
              }
              
              return {
                name: functionName,
                module: moduleName,
                all: apiPermissions.all === "true",
                add: apiPermissions.create === "true", 
                view: apiPermissions.show === "true",
                edit: apiPermissions.update === "true",
                disable: apiPermissions.destroy === "true"
              };
            });
          });
        }
      });
      
      // Only update if we have new permissions to add
      if (Object.keys(initialPermissions).length > 0) {
        setRolePermissions(prev => ({
          ...prev,
          ...initialPermissions
        }));
      }
    }
  }, [roles, isUpdating, moduleNames, modulesAndFunctions, rolePermissions]);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get permissions for the selected role, default to first role if none selected
  const currentRole = selectedRole || roles[0];
  const currentPermissions = currentRole && rolePermissions[currentRole.id] 
    ? rolePermissions[currentRole.id][activeTab] || []
    : [];

  const handleRoleClick = (role: ApiRole) => {
    setSelectedRole(role);
  };

  const handleAddRole = () => {
    console.log('Navigating to Add Role page...');
    navigate('/settings/roles/role/add');
  };

  const handleSearchRole = () => {
    console.log('Searching roles with term:', searchTerm);
    // Search functionality is already handled by filteredRoles
  };

  const handlePermissionChange = (roleId: number, permissionName: string, field: keyof Permission, value: boolean) => {
    if (!rolePermissions[roleId] || !rolePermissions[roleId][activeTab]) return;

    const updatedPermissions = rolePermissions[roleId][activeTab].map(permission => {
      if (permission.name === permissionName) {
        const updatedPermission = { ...permission, [field]: value };
        
        // If "All" is checked, check all other permissions
        if (field === 'all' && value) {
          updatedPermission.add = true;
          updatedPermission.view = true;
          updatedPermission.edit = true;
          updatedPermission.disable = true;
        }
        // If "All" is unchecked, uncheck all other permissions
        else if (field === 'all' && !value) {
          updatedPermission.add = false;
          updatedPermission.view = false;
          updatedPermission.edit = false;
          updatedPermission.disable = false;
        }
        // If any individual permission is unchecked, uncheck "All"
        else if (!value && field !== 'all') {
          updatedPermission.all = false;
        }
        // If all individual permissions are checked, check "All"
        else if (value && field !== 'all') {
          const allIndividualChecked = updatedPermission.add && updatedPermission.view && updatedPermission.edit && updatedPermission.disable;
          if (allIndividualChecked) {
            updatedPermission.all = true;
          }
        }
        
        return updatedPermission;
      }
      return permission;
    });

    // Update local state
    setRolePermissions(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        [activeTab]: updatedPermissions
      }
    }));
  };

  const handleUpdatePermissions = async () => {
    if (!currentRole) {
      toast.error("Please select a role first");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Get current role's existing permissions from API
      const existingPermissionsHash = currentRole.permissions_hash ? JSON.parse(currentRole.permissions_hash) : {};
      
      // Get current tab permissions from state
      const currentTabPermissions = rolePermissions[currentRole.id]?.[activeTab] || [];
      
      // Build permissions hash for current tab
      const currentTabPermissionsHash: any = {};
      currentTabPermissions.forEach(permission => {
        // Convert function name to API key
        const apiKey = convertToApiKey(permission.name);
        currentTabPermissionsHash[apiKey] = {
          all: permission.all ? "true" : "false",
          create: permission.add ? "true" : "false", 
          show: permission.view ? "true" : "false",
          update: permission.edit ? "true" : "false",
          destroy: permission.disable ? "true" : "false"
        };
      });
      
      // Merge with existing permissions (preserve other tabs' permissions)
      const mergedPermissionsHash = {
        ...existingPermissionsHash,
        ...currentTabPermissionsHash
      };
      
      // Prepare payload
      const payload = {
        lock_role: {
          name: currentRole.name,
        },
        permissions_hash: mergedPermissionsHash,
        lock_modules: null
      };

      console.log('Updating permissions with payload:', JSON.stringify(payload, null, 2));

      // Make PATCH request
      const response = await fetch(`https://fm-uat-api.lockated.com/lock_roles/${currentRole.id}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getAuthHeader()
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(`Permissions updated successfully for ${currentRole.name}`);
        
        // Refresh roles data to reflect changes
        await dispatch(fetchRoles());
        
        // Clear the local permissions for this role to force re-initialization with fresh API data
        setRolePermissions(prev => {
          const updated = { ...prev };
          delete updated[currentRole.id];
          return updated;
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update permissions');
      }
      
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error(`Failed to update permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a]">ROLE</h1>
      
      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
        {/* Header with Add Role button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <Button 
            onClick={handleAddRole}
            className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Role
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <Input
            placeholder="Search Role"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:max-w-xs"
          />
          <Button 
            onClick={handleSearchRole}
            className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Role
          </Button>
        </div>

        {/* Responsive Layout: Stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left Panel - Roles List */}
          <div className="w-full xl:w-80 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Roles List</h3>
            <div className="space-y-2 max-h-64 xl:max-h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-4">
                  <div className="text-gray-500">Loading roles...</div>
                </div>
              ) : filteredRoles.length > 0 ? (
                filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => handleRoleClick(role)}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      currentRole?.id === role.id 
                        ? 'bg-[#C72030] text-white border-[#C72030]' 
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {role.id} - {role.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">No roles found</div>
              )}
            </div>
          </div>

          {/* Right Panel - Permissions Matrix */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Permissions for: {currentRole?.name}
            </h3>
            
            {/* Tabs - Responsive scrolling */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {moduleNames.map((moduleName) => (
                <button
                  key={moduleName}
                  onClick={() => setActiveTab(moduleName)}
                  className={`px-3 lg:px-4 py-2 rounded border text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === moduleName
                      ? 'bg-[#C72030] text-white border-[#C72030]'
                      : 'bg-white text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10'
                  }`}
                >
                  {moduleName}
                </button>
              ))}
            </div>

            {/* Permissions Table - Responsive with horizontal scroll */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <div className="max-h-64 lg:max-h-96 overflow-y-auto">
                  <Table className="min-w-full">
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 min-w-[200px] lg:w-48 text-xs lg:text-sm">
                          Permission
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[60px] text-xs lg:text-sm">
                          All
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[60px] text-xs lg:text-sm">
                          Add
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[60px] text-xs lg:text-sm">
                          View
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[60px] text-xs lg:text-sm">
                          Edit
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[70px] text-xs lg:text-sm">
                          Disable
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentPermissions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                            No functions found for this module
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentPermissions.map((permission, index) => (
                        <TableRow key={`${currentRole?.id}-${activeTab}-${permission.name}-${index}`} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-xs lg:text-sm py-2 lg:py-3">
                            {permission.name}
                            <div className="text-xs text-gray-500 mt-1">
                              API Key: {convertToApiKey(permission.name)}
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                               <Checkbox
                                checked={permission.all}
                                onCheckedChange={(checked) => {
                                  if (currentRole) {
                                    handlePermissionChange(currentRole.id, permission.name, 'all', checked as boolean);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.add}
                                onCheckedChange={(checked) => {
                                  if (currentRole) {
                                    handlePermissionChange(currentRole.id, permission.name, 'add', checked as boolean);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.view}
                                onCheckedChange={(checked) => {
                                  if (currentRole) {
                                    handlePermissionChange(currentRole.id, permission.name, 'view', checked as boolean);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.edit}
                                onCheckedChange={(checked) => {
                                  if (currentRole) {
                                    handlePermissionChange(currentRole.id, permission.name, 'edit', checked as boolean);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.disable}
                                onCheckedChange={(checked) => {
                                  if (currentRole) {
                                    handlePermissionChange(currentRole.id, permission.name, 'disable', checked as boolean);
                                  }
                                }}
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Update Button */}
            <div className="mt-4 flex flex-col sm:flex-row justify-end">
              <Button 
                onClick={handleUpdatePermissions}
                className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
              >
                Update Permissions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
