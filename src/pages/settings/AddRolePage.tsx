import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import sidebarConfig from '@/config/sidebarConfig.json';
import { roleService, CreateRolePayload } from '@/services/roleService';

interface Permission {
  function: string;
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

// Function to convert function name to API key format (spaces to underscores, lowercase)
const convertToApiKey = (functionName: string): string => {
  return functionName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\w_]/g, '') // Remove special characters except underscore
    .replace(/_+/g, '_')     // Replace multiple underscores with single
    .replace(/^_|_$/g, '');  // Remove leading/trailing underscores
};

// Create initial permissions from sidebar config
const createInitialPermissions = (): Permission[] => {
  const modules = extractModulesAndFunctions();
  const permissions: Permission[] = [];
  
  Object.keys(modules).forEach(moduleName => {
    modules[moduleName].forEach(functionName => {
      permissions.push({
        function: functionName,
        module: moduleName,
        all: false,
        add: false,
        view: false,
        edit: false,
        disable: false
      });
    });
  });
  
  return permissions;
};

export const AddRolePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roleTitle, setRoleTitle] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>(createInitialPermissions());
  
  // Get unique module names for tabs
  const moduleNames = ['All', ...Object.keys(extractModulesAndFunctions())];
  
  // Filter permissions based on active tab
  const filteredPermissions = activeTab === 'All' 
    ? permissions 
    : permissions.filter(p => p.module === activeTab);

  const tabs = moduleNames;

  const handleTabOverallChange = (tab: string, enabled: boolean) => {
    setPermissions(prev => 
      prev.map(permission => 
        permission.module === tab || tab === 'All'
          ? {
              ...permission,
              all: enabled,
              add: enabled,
              view: enabled,
              edit: enabled,
              disable: enabled,
            }
          : permission
      )
    );
  };

  const handlePermissionChange = (functionName: string, field: keyof Omit<Permission, 'function' | 'module'>, checked: boolean) => {
    const newPermissions = [...permissions];
    const index = newPermissions.findIndex(p => p.function === functionName);
    
    if (index === -1) return;
    
    if (field === 'all') {
      // If "All" is checked/unchecked, update all other permissions for this row
      newPermissions[index] = {
        ...newPermissions[index],
        all: checked,
        add: checked,
        view: checked,
        edit: checked,
        disable: checked,
      };
    } else {
      // Update specific permission
      newPermissions[index] = {
        ...newPermissions[index],
        [field]: checked,
      };
      
      // Update "All" checkbox based on other permissions
      const otherPerms = ['add', 'view', 'edit', 'disable'] as const;
      const allChecked = otherPerms.every(perm => 
        perm === field ? checked : newPermissions[index][perm]
      );
      newPermissions[index].all = allChecked;
    }
    
    setPermissions(newPermissions);
  };

  const handleSubmit = async () => {
    if (!roleTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a role title.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Role Title:', roleTitle);
      console.log('Permissions:', permissions);
      
      // Create payload in the format expected by API
      const permissionsHash: { [key: string]: any } = {};
      
      permissions.forEach(permission => {
        // Only include permissions that have at least one action selected
        if (permission.add || permission.view || permission.edit || permission.disable) {
          const apiKey = convertToApiKey(permission.function);
          permissionsHash[apiKey] = {
            all: permission.all ? "true" : "false",
            create: permission.add ? "true" : "false",
            show: permission.view ? "true" : "false", 
            update: permission.edit ? "true" : "false",
            destroy: permission.disable ? "true" : "false"
          };
        }
      });

      const payload: CreateRolePayload = {
        lock_role: {
          name: roleTitle.trim(),
        },
        permissions_hash: permissionsHash,
        lock_modules: 1
      };

      console.log('API Payload:', JSON.stringify(payload, null, 2));
      console.log('Permissions Hash Keys:', Object.keys(permissionsHash));
      
      // Example of how individual function keys look:
      console.log('Function Key Examples:');
      permissions.slice(0, 5).forEach(permission => {
        console.log(`"${permission.function}" -> "${convertToApiKey(permission.function)}"`);
      });

      // Call the API to create the role
      const response = await roleService.createRole(payload);
      
      console.log('Role creation response:', response);

      toast({
        title: "Success",
        description: `Role "${roleTitle}" has been created successfully!`,
      });
      
      // Navigate back to roles list
      navigate('/settings/roles/role');
      
    } catch (error: any) {
      console.error('Error creating role:', error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to create role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/settings/roles/role');
  };

  const getTabEnabled = (tab: string) => {
    if (tab === 'All') {
      return permissions.every(p => p.all);
    }
    return permissions.filter(p => p.module === tab).every(p => p.all);
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a]">Add New Role</h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
        <div className="flex flex-col gap-6">
          {/* Role Title Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="roleTitle" className="text-sm font-medium">
              Role Titles
            </label>
            <Input
              id="roleTitle"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="Enter role title"
              className="max-w-md"
            />
          </div>

          {/* Content Layout with Sidebar and Main Content */}
          <div className="flex flex-col xl:flex-row gap-6">
            {/* Left Sidebar with Tab Checkboxes */}
            <div className="w-full xl:w-80 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Permission Categories</h3>
              <div className="space-y-3">
                {tabs.map((tab) => (
                  <div key={tab} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tab-${tab}`}
                      checked={getTabEnabled(tab)}
                      onCheckedChange={(checked) => handleTabOverallChange(tab, checked as boolean)}
                    />
                    <label
                      htmlFor={`tab-${tab}`}
                      className={`text-sm font-medium cursor-pointer ${
                        activeTab === tab ? 'text-[#C72030]' : 'text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                      {tab !== 'All' && (
                        <span className="ml-2 text-xs opacity-75">
                          ({permissions.filter(p => p.module === tab).length})
                        </span>
                      )}
                      {tab === 'All' && (
                        <span className="ml-2 text-xs opacity-75">
                          ({permissions.length})
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Permissions Table */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Permissions for: {activeTab}
              </h3>
              
              {/* Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 lg:px-4 py-2 rounded border text-xs lg:text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'bg-[#C72030] text-white border-[#C72030]'
                        : 'bg-white text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Permissions Table */}
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
                      <TableBody>                      {filteredPermissions.map((permission, index) => (
                        <TableRow key={`${permission.module}-${permission.function}-${index}`} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-xs lg:text-sm py-2 lg:py-3">
                            <div>
                              <div>{permission.function}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                API Key: {convertToApiKey(permission.function)}
                              </div>
                              {activeTab === 'All' && (
                                <div className="text-xs text-blue-600 mt-1">
                                  Module: {permission.module}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.all}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permission.function, 'all', checked as boolean)
                                }
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.add}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permission.function, 'add', checked as boolean)
                                }
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.view}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permission.function, 'view', checked as boolean)
                                }
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.edit}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permission.function, 'edit', checked as boolean)
                                }
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-center py-2 lg:py-3">
                            <div className="flex justify-center">
                              <Checkbox
                                checked={permission.disable}
                                onCheckedChange={(checked) => 
                                  handlePermissionChange(permission.function, 'disable', checked as boolean)
                                }
                                className="w-4 h-4"
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Role'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};