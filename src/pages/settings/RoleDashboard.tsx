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
import { roleService, RoleWithModules, LockModule } from '@/services/roleService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { 
  fetchRolesWithModules, 
  updateSubFunctionEnabled, 
  updateFunctionEnabled,
  updateModuleEnabled,
  setUpdating 
} from '@/store/slices/roleWithModulesSlice';

interface Permission {
  name: string;
  all: boolean;
  add: boolean;
  view: boolean;
  edit: boolean;
  disable: boolean;
}

interface Role {
  id: number;
  name: string;
  permissions: {
    [key: string]: Permission[];
  };
}


export const RoleDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { roles, loading, error, updating } = useAppSelector((state) => state.roleWithModules);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModuleTab, setActiveModuleTab] = useState('');
  const [selectedRole, setSelectedRole] = useState<RoleWithModules | null>(null);
  const [allModules, setAllModules] = useState<LockModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);

  // Fetch roles with modules from new API
  useEffect(() => {
    console.log('RoleDashboard: Starting to fetch roles with modules...');
    dispatch(fetchRolesWithModules());
    
    // Fetch all available modules
    const fetchAllModules = async () => {
      setModulesLoading(true);
      try {
        console.log('RoleDashboard: Fetching all modules...');
        const modules = await roleService.fetchModules();
        console.log('RoleDashboard: Fetched modules:', modules);
        setAllModules(modules);
        // Set first module as active tab if no tab is set
        if (modules.length > 0 && !activeModuleTab) {
          const moduleId = modules[0].module_id ?? modules[0].id;
          console.log('RoleDashboard: Setting active module tab to:', moduleId);
          if (moduleId != null) {
            setActiveModuleTab(moduleId.toString());
          }
        }
      } catch (error) {
        console.error('RoleDashboard: Error fetching modules:', error);
        toast.error('Failed to load modules');
      } finally {
        setModulesLoading(false);
      }
    };
    
    fetchAllModules();
  }, [dispatch]);

  // Set default selected role when roles are loaded
  useEffect(() => {
    if (Array.isArray(roles) && roles.length > 0) {
      if (!selectedRole) {
        setSelectedRole(roles[0]);
      }
    }
  }, [roles, selectedRole]);

  // Get filtered roles based on search term
  const filteredRoles = Array.isArray(roles) ? roles.filter(role =>
    role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Get current role's modules for tabs - Use all available modules instead of just role's modules
  const currentRole = selectedRole;
  const tabs = Array.isArray(allModules) ? allModules
    .filter(module => (module.module_id ?? module.id) != null)
    .map(module => ({
      id: (module.module_id ?? module.id).toString(),
      name: module.name || 'Unknown Module'
    })) : [];

  // Get current module from the selected role's modules (this contains the actual enabled status)
  const currentRoleModule = currentRole?.modules.find(m => {
    const moduleId = m.module_id ?? m.id;
    return moduleId != null && moduleId.toString() === activeModuleTab;
  }) || null;
  
  // Get current module info from all modules (for metadata like name)
  const currentModule = Array.isArray(allModules) ? allModules.find(m => {
    const moduleId = m.module_id ?? m.id;
    return moduleId != null && moduleId.toString() === activeModuleTab;
  }) : null;
  
  // Use functions from the role's module if available, otherwise from the general module
  const currentFunctions = currentRoleModule?.functions || currentModule?.functions || [];
  
  // Helper function to check if a sub-function is enabled for the current role
  const isSubFunctionEnabled = (moduleId: number, functionId: number, subFunctionId: number): boolean => {
    if (!currentRole) return false;
    const roleModule = currentRole.modules.find(m => m.module_id === moduleId);
    if (!roleModule) return false;
    const roleFunction = roleModule.functions.find(f => f.function_id === functionId);
    if (!roleFunction) return false;
    const roleSubFunction = roleFunction.sub_functions.find(sf => sf.sub_function_id === subFunctionId);
    return roleSubFunction?.enabled || false;
  };
  
  // Helper function to check if a function is enabled for the current role
  const isFunctionEnabled = (moduleId: number, functionId: number): boolean => {
    if (!currentRole) return false;
    const roleModule = currentRole.modules.find(m => (m.module_id ?? m.id) === moduleId);
    if (!roleModule) return false;
    const roleFunction = roleModule.functions.find(f => (f.function_id ?? f.id) === functionId);
    return roleFunction?.enabled || false;
  };

  // Helper function to check if a module is enabled for the current role
  const isModuleEnabled = (moduleId: number): boolean => {
    if (!currentRole) return false;
    const roleModule = currentRole.modules.find(m => (m.module_id ?? m.id) === moduleId);
    return roleModule?.enabled || false;
  };

  const handleRoleClick = (role: RoleWithModules) => {
    setSelectedRole(role);
    // Keep the same tab when switching roles, or set first tab if none
    if (!activeModuleTab && Array.isArray(allModules) && allModules.length > 0) {
      const moduleId = allModules[0].module_id ?? allModules[0].id;
      if (moduleId != null) {
        setActiveModuleTab(moduleId.toString());
      }
    }
  };

  const handleAddRole = () => {
    console.log('Navigating to Add Role page...');
    navigate('/settings/roles/role/add');
  };

  const handleSearchRole = () => {
    console.log('Searching roles with term:', searchTerm);
    // Search functionality is already handled by filteredRoles
  };

  // Handle sub-function permission change
  const handleSubFunctionToggle = (
    moduleId: number,
    functionId: number,
    subFunctionId: number,
    enabled: boolean
  ) => {
    if (!currentRole) return;
    
    dispatch(updateSubFunctionEnabled({
      roleId: currentRole.role_id,
      moduleId,
      functionId,
      subFunctionId,
      enabled
    }));
  };

  // Handle function permission change (toggles all sub-functions)
  const handleFunctionToggle = (
    moduleId: number,
    functionId: number,
    enabled: boolean
  ) => {
    if (!currentRole) return;
    
    dispatch(updateFunctionEnabled({
      roleId: currentRole.role_id,
      moduleId,
      functionId,
      enabled
    }));
  };

  // Handle module permission change (toggles all functions and sub-functions)
  const handleModuleToggle = (
    moduleId: number,
    enabled: boolean
  ) => {
    if (!currentRole) return;
    
    dispatch(updateModuleEnabled({
      roleId: currentRole.role_id,
      moduleId,
      enabled
    }));
  };

  const handleUpdatePermissions = async () => {
    if (!currentRole) {
      toast.error("Please select a role first");
      return;
    }
    
    dispatch(setUpdating(true));
    
    try {
      await roleService.updateRoleWithModules(currentRole);
      toast.success(`Permissions updated successfully for ${currentRole.role_name}`);
      
      // Refresh roles data to reflect changes
      await dispatch(fetchRolesWithModules());
      
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error(`Failed to update permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      dispatch(setUpdating(false));
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
                filteredRoles.map((role, index) => (
                  <div
                    key={`${role.role_name}-${index}`}
                    onClick={() => handleRoleClick(role)}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      currentRole?.role_name === role.role_name 
                        ? 'bg-[#C72030] text-white border-[#C72030]' 
                        : 'bg-white hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {role.role_id} - {role.role_name}
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
            {/* Debug info */}
            <div className="mb-2 text-xs text-gray-500">
              Debug: Roles loaded: {Array.isArray(roles) ? roles.length : 'No'}, 
              Modules loaded: {allModules.length}, 
              Selected role: {currentRole?.role_name || 'None'}, 
              Active tab: {activeModuleTab || 'None'},
              Loading: {loading ? 'Yes' : 'No'},
              Error: {error || 'None'}
            </div>
            
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Permissions for: {currentRole?.role_name}
            </h3>
            
            {/* Module Tabs */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {modulesLoading ? (
                <div className="text-gray-500 text-sm">Loading modules...</div>
              ) : tabs.length > 0 ? (
                tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModuleTab(tab.id)}
                    className={`px-3 lg:px-4 py-2 rounded border text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                      activeModuleTab === tab.id
                        ? 'bg-[#C72030] text-white border-[#C72030]'
                        : 'bg-white text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))
              ) : (
                <div className="text-gray-500 text-sm">No modules available</div>
              )}
            </div>

            {/* Functions and Sub-functions Table */}
            <div className="border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <div className="max-h-64 lg:max-h-96 overflow-y-auto">
                  <Table className="min-w-full">
                    <TableHeader className="sticky top-0 bg-white z-10">
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700 min-w-[200px] lg:w-48 text-xs lg:text-sm">
                          Function / Sub-function
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 text-center min-w-[80px] text-xs lg:text-sm">
                          Enabled
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading || modulesLoading ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-4">
                            Loading functions...
                          </TableCell>
                        </TableRow>
                      ) : currentFunctions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                            {!currentRoleModule && !currentModule ? 'Please select a module' : 'No functions found for this module'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentFunctions.flatMap((func) => [
                          // Function row
                          <TableRow key={`func-${func.function_id || func.id}`} className="hover:bg-gray-50 bg-gray-25">
                            <TableCell className="font-semibold text-sm py-3 pl-4">
                              📁 {func.function_name}
                            </TableCell>
                            <TableCell className="text-center py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={currentRoleModule ? isFunctionEnabled(currentRoleModule.module_id || currentRoleModule.id, func.function_id || func.id) : false}
                                  onCheckedChange={(checked) => {
                                    if (currentRoleModule) {
                                      handleFunctionToggle(
                                        currentRoleModule.module_id || currentRoleModule.id,
                                        func.function_id || func.id,
                                        checked as boolean
                                      );
                                    }
                                  }}
                                  className="w-4 h-4"
                                  disabled={!currentRoleModule}
                                />
                              </div>
                            </TableCell>
                          </TableRow>,
                          // Sub-function rows
                          ...(func.sub_functions || []).map((subFunc) => (
                            <TableRow key={`subfunc-${subFunc.sub_function_id || subFunc.id}`} className="hover:bg-gray-50">
                              <TableCell className="text-sm py-2 pl-8 text-gray-600">
                                ↳ {subFunc.sub_function_name}
                              </TableCell>
                              <TableCell className="text-center py-2">
                                <div className="flex justify-center">
                                  <Checkbox
                                    checked={currentRoleModule ? isSubFunctionEnabled(currentRoleModule.module_id || currentRoleModule.id, func.function_id || func.id, subFunc.sub_function_id || subFunc.id) : false}
                                    onCheckedChange={(checked) => {
                                      if (currentRoleModule) {
                                        handleSubFunctionToggle(
                                          currentRoleModule.module_id || currentRoleModule.id,
                                          func.function_id || func.id,
                                          subFunc.sub_function_id || subFunc.id,
                                          checked as boolean
                                        );
                                      }
                                    }}
                                    className="w-4 h-4"
                                    disabled={!currentRoleModule}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ])
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
