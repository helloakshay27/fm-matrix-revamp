import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { roleService, LockModule } from '@/services/roleService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface NewRolePermission {
  moduleId: number;
  moduleName: string;
  enabled: boolean;
  functions: {
    functionId: number;
    functionName: string;
    enabled: boolean;
    subFunctions: {
      subFunctionId: number;
      subFunctionName: string;
      enabled: boolean;
    }[];
  }[];
}

export const AddRolePage = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modules, setModules] = useState<LockModule[]>([]);
  const [permissions, setPermissions] = useState<NewRolePermission[]>([]);
  const [activeModuleTab, setActiveModuleTab] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setModulesLoading(true);
        const fetchedModules = await roleService.fetchModules();
        setModules(fetchedModules);
        
        // Initialize permissions for all modules
        const initialPermissions: NewRolePermission[] = fetchedModules.map(module => ({
          moduleId: module.module_id ?? module.id,
          moduleName: module.name,
          enabled: false,
          functions: (module.functions || []).map(func => ({
            functionId: func.function_id ?? func.id,
            functionName: func.function_name,
            enabled: false,
            subFunctions: (func.sub_functions || []).map(subFunc => ({
              subFunctionId: subFunc.sub_function_id ?? subFunc.id,
              subFunctionName: subFunc.sub_function_name,
              enabled: false
            }))
          }))
        }));
        
        setPermissions(initialPermissions);
        
        // Set first module as active tab
        if (fetchedModules.length > 0) {
          const moduleId = fetchedModules[0].module_id ?? fetchedModules[0].id;
          if (moduleId != null) {
            setActiveModuleTab(moduleId.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        toast.error('Failed to load modules');
      } finally {
        setModulesLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleBack = () => {
    navigate('/settings/roles/role');
  };

  const handleModuleToggle = (moduleId: number, enabled: boolean) => {
    setPermissions(prev => prev.map(perm => {
      if (perm.moduleId === moduleId) {
        return {
          ...perm,
          enabled,
          functions: perm.functions.map(func => ({
            ...func,
            enabled,
            subFunctions: func.subFunctions.map(subFunc => ({
              ...subFunc,
              enabled
            }))
          }))
        };
      }
      return perm;
    }));
  };

  const handleFunctionToggle = (moduleId: number, functionId: number, enabled: boolean) => {
    setPermissions(prev => prev.map(perm => {
      if (perm.moduleId === moduleId) {
        const updatedFunctions = perm.functions.map(func => {
          if (func.functionId === functionId) {
            return {
              ...func,
              enabled,
              subFunctions: func.subFunctions.map(subFunc => ({
                ...subFunc,
                enabled
              }))
            };
          }
          return func;
        });
        
        // Update module enabled status based on functions
        const moduleEnabled = updatedFunctions.some(func => func.enabled);
        
        return {
          ...perm,
          enabled: moduleEnabled,
          functions: updatedFunctions
        };
      }
      return perm;
    }));
  };

  const handleSubFunctionToggle = (moduleId: number, functionId: number, subFunctionId: number, enabled: boolean) => {
    setPermissions(prev => prev.map(perm => {
      if (perm.moduleId === moduleId) {
        const updatedFunctions = perm.functions.map(func => {
          if (func.functionId === functionId) {
            const updatedSubFunctions = func.subFunctions.map(subFunc => {
              if (subFunc.subFunctionId === subFunctionId) {
                return { ...subFunc, enabled };
              }
              return subFunc;
            });
            
            // Update function enabled status based on sub-functions
            const functionEnabled = updatedSubFunctions.some(subFunc => subFunc.enabled);
            
            return {
              ...func,
              enabled: functionEnabled,
              subFunctions: updatedSubFunctions
            };
          }
          return func;
        });
        
        // Update module enabled status based on functions
        const moduleEnabled = updatedFunctions.some(func => func.enabled);
        
        return {
          ...perm,
          enabled: moduleEnabled,
          functions: updatedFunctions
        };
      }
      return perm;
    }));
  };

  const handleSaveRole = async () => {
    if (!roleName.trim()) {
      toast.error('Please enter a role name');
      return;
    }

    if (!displayName.trim()) {
      toast.error('Please enter a display name');
      return;
    }

    setLoading(true);
    try {
      // Build permissions_hash from ALL functions and sub-functions (both enabled and disabled)
      const permissionsHash: Record<string, Record<string, string>> = {};
      
      permissions.forEach(modulePermission => {
        modulePermission.functions.forEach(func => {
          // Use function name as key (like "notices", "banners")
          const functionKey = func.functionName.toLowerCase().replace(/\s+/g, '_');
          permissionsHash[functionKey] = {};
          
          // Process ALL sub-functions, both enabled and disabled
          func.subFunctions.forEach(subFunc => {
            // Map sub-function names to standard CRUD operations
            let actionKey = subFunc.subFunctionName.toLowerCase();
            
            // Normalize common action names
            if (actionKey.includes('all') || actionKey.includes('index')) {
              actionKey = 'all';
            } else if (actionKey.includes('create') || actionKey.includes('new')) {
              actionKey = 'create';
            } else if (actionKey.includes('show') || actionKey.includes('view') || actionKey.includes('read')) {
              actionKey = 'show';
            } else if (actionKey.includes('update') || actionKey.includes('edit')) {
              actionKey = 'update';
            } else if (actionKey.includes('destroy') || actionKey.includes('delete')) {
              actionKey = 'destroy';
            }
            
            // Set "true" for enabled, "false" for disabled
            permissionsHash[functionKey][actionKey] = subFunc.enabled ? "true" : "false";
          });
          
          // If no sub-functions exist but function is enabled, add default permissions
          if (func.subFunctions.length === 0 && func.enabled) {
            permissionsHash[functionKey] = {
              "all": "true",
              "create": "true",
              "show": "true", 
              "update": "true",
              "destroy": "true"
            };
          } else if (func.subFunctions.length === 0 && !func.enabled) {
            // If function is disabled and has no sub-functions, set all to false
            permissionsHash[functionKey] = {
              "all": "false",
              "create": "false",
              "show": "false", 
              "update": "false",
              "destroy": "false"
            };
          }
        });
      });

      // Get enabled module IDs
      const enabledModuleIds = permissions
        .filter(modulePermission => modulePermission.enabled)
        .map(modulePermission => modulePermission.moduleId);

      // Build the payload according to the API structure
      const payload = {
        lock_role: {
          name: roleName.trim(),
          display_name: displayName.trim(),
          access_level: null,
          access_to: null,
          active: 1,
          role_for: "pms"
        },
        permissions_hash: permissionsHash,
        lock_modules: enabledModuleIds
      };

      console.log('Creating role with payload:', payload);

      await roleService.createRoleWithPayload(payload);
      toast.success('Role created successfully');
      navigate('/settings/roles/role');
    } catch (error) {
      console.error('Error creating role:', error);
      toast.error(`Failed to create role: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Get current module's permissions
  const currentModulePermissions = permissions.find(perm => perm.moduleId.toString() === activeModuleTab);

  // Generate tabs from modules
  const tabs = modules.map(module => ({
    id: (module.module_id ?? module.id).toString(),
    name: module.name || 'Unknown Module'
  }));

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a]">Add New Role</h1>
      </div>
      
      <div className="grid gap-6">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name *</Label>
                <Input
                  id="roleName"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="Enter role name"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter display name"
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Module Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            {modulesLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500">Loading modules...</div>
              </div>
            ) : (
              <>
                {/* Module Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveModuleTab(tab.id)}
                      className={`px-4 py-2 rounded border text-sm font-medium transition-colors whitespace-nowrap ${
                        activeModuleTab === tab.id
                          ? 'bg-[#C72030] text-white border-[#C72030]'
                          : 'bg-white text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>

                {/* Module Toggle */}
                {currentModulePermissions && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={currentModulePermissions.enabled}
                        onCheckedChange={(checked) => 
                          handleModuleToggle(currentModulePermissions.moduleId, checked as boolean)
                        }
                        className="w-5 h-5"
                      />
                      <Label className="text-lg font-semibold">
                        Enable {currentModulePermissions.moduleName} Module
                      </Label>
                    </div>
                  </div>
                )}

                {/* Functions and Sub-functions Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <div className="max-h-50 overflow-y-auto">
                      <Table className='w-full'>
                        <TableHeader className="sticky top-0 bg-white z-10">
                          <TableRow className="bg-gray-50">
                            <TableHead className="font-semibold text-gray-700 min-w-[300px]">
                              Function / Sub-function
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-center min-w-[100px]">
                              Enabled
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {!currentModulePermissions ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                                Please select a module
                              </TableCell>
                            </TableRow>
                          ) : currentModulePermissions.functions.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                                No functions found for this module
                              </TableCell>
                            </TableRow>
                          ) : (
                            currentModulePermissions.functions.flatMap((func) => [
                              // Function row
                              <TableRow key={`func-${func.functionId}`} className="hover:bg-gray-50 bg-gray-25">
                                <TableCell className="font-semibold text-sm py-3 pl-4">
                                  📁 {func.functionName}
                                </TableCell>
                                <TableCell className="text-center py-3">
                                  <div className="flex justify-center">
                                    <Checkbox
                                      checked={func.enabled}
                                      onCheckedChange={(checked) =>
                                        handleFunctionToggle(
                                          currentModulePermissions.moduleId,
                                          func.functionId,
                                          checked as boolean
                                        )
                                      }
                                      className="w-4 h-4"
                                    />
                                  </div>
                                </TableCell>
                              </TableRow>,
                              // Sub-function rows
                              ...func.subFunctions.map((subFunc) => (
                                <TableRow key={`subfunc-${subFunc.subFunctionId}`} className="hover:bg-gray-50">
                                  <TableCell className="text-sm py-2 pl-8 text-gray-600">
                                    ↳ {subFunc.subFunctionName}
                                  </TableCell>
                                  <TableCell className="text-center py-2">
                                    <div className="flex justify-center">
                                      <Checkbox
                                        checked={subFunc.enabled}
                                        onCheckedChange={(checked) =>
                                          handleSubFunctionToggle(
                                            currentModulePermissions.moduleId,
                                            func.functionId,
                                            subFunc.subFunctionId,
                                            checked as boolean
                                          )
                                        }
                                        className="w-4 h-4"
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
              </>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button 
            onClick={handleSaveRole}
            disabled={loading}
            className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Creating...' : 'Create Role'}
          </Button>
        </div>
      </div>
    </div>
  );
};
