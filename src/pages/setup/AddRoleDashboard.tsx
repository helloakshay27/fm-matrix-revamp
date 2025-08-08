
import React, { useState } from 'react';
import { SetupLayout } from '@/components/SetupLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
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

export const AddRoleDashboard = () => {
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
      
      // Reset form after successful creation
      setRoleTitle('');
      setPermissions(createInitialPermissions());
      setActiveTab('All');
      
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

  return (
    <SetupLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600">
          Account &gt; Role &gt; Add New Role
        </div>
        
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Add New Role</h1>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Role Title Input */}
          <div className="mb-6">
            <Label htmlFor="roleTitle" className="text-sm font-medium mb-2 block">
              Role Title
            </Label>
            <Input
              id="roleTitle"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              placeholder="Enter role title"
              className="max-w-md"
            />
          </div>

          {/* Module Tabs */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {moduleNames.map((moduleName) => (
                <button
                  key={moduleName}
                  onClick={() => setActiveTab(moduleName)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === moduleName
                      ? 'bg-[#C72030] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {moduleName}
                  {moduleName !== 'All' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({permissions.filter(p => p.module === moduleName).length})
                    </span>
                  )}
                  {moduleName === 'All' && (
                    <span className="ml-2 text-xs opacity-75">
                      ({permissions.length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Permissions Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Function</TableHead>
                  {activeTab === 'All' && (
                    <TableHead className="font-semibold text-gray-700 text-sm">Module</TableHead>
                  )}
                  <TableHead className="font-semibold text-gray-700 text-center">All</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Add</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">View</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Edit</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Disable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((permission, index) => (
                  <TableRow key={`${permission.module}-${permission.function}-${index}`} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div>
                        <div>{permission.function}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          API Key: {convertToApiKey(permission.function)}
                        </div>
                      </div>
                    </TableCell>
                    {activeTab === 'All' && (
                      <TableCell className="text-sm text-gray-600">{permission.module}</TableCell>
                    )}
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.all}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.function, 'all', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.add}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.function, 'add', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.view}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.function, 'view', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.edit}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.function, 'edit', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.disable}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.function, 'disable', checked as boolean)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
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
    </SetupLayout>
  );
};
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold text-gray-700">Function</TableHead>
                  {activeTab === 'All' && (
                    <TableHead className="font-semibold text-gray-700 text-sm">Module</TableHead>
                  )}
                  <TableHead className="font-semibold text-gray-700 text-center">All</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Add</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">View</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Edit</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-center">Disable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPermissions.map((permission, index) => (
                  <TableRow key={`${permission.module}-${permission.function}-${index}`} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div>
                        <div>{permission.function}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          API Key: {convertToApiKey(permission.function)}
                        </div>
                      </div>
                    </TableCell>
                    {activeTab === 'All' && (
                      <TableCell className="text-sm text-gray-600">{permission.module}</TableCell>
                    )}
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.all}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.function, 'all', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.add}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.function, 'add', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.view}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.function, 'view', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.edit}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.function, 'edit', checked as boolean)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox
                        checked={permission.disable}
                        onCheckedChange={(checked) => 
                          handlePermissionChange(permission.function, 'disable', checked as boolean)
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8"
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
    </SetupLayout>
  );
};
