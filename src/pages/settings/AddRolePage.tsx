import React, { useState, useEffect } from 'react';
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
import { roleService, CreateRolePayload, LockFunction } from '@/services/roleService';

interface Permission {
  action_name: string;
  module_name: string;
  function_name: string;
  actions: {
    show: boolean;
    create: boolean;
    update: boolean;
    destroy: boolean;
  };
  all: boolean;
}

export const AddRolePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roleTitle, setRoleTitle] = useState('');
  const [activeTab, setActiveTab] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<{ [key: string]: Permission[] }>({});
  const [lockFunctions, setLockFunctions] = useState<LockFunction[]>([]);
  const [tabs, setTabs] = useState<string[]>([]);

  useEffect(() => {
    const fetchLockFunctions = async () => {
      try {
        setIsLoading(true);
        const functions = await roleService.getLockFunctions();
        setLockFunctions(functions);
        
        // Group functions by module_name
        const groupedPermissions: { [key: string]: Permission[] } = {};
        const moduleNames = new Set<string>();
        
        functions.forEach(func => {
          const moduleName = func.module_name || 'Other';
          moduleNames.add(moduleName);
          
          if (!groupedPermissions[moduleName]) {
            groupedPermissions[moduleName] = [];
          }
          
          groupedPermissions[moduleName].push({
            action_name: func.action_name,
            module_name: func.module_name,
            function_name: func.function_name,
            actions: {
              show: false,
              create: false,
              update: false,
              destroy: false
            },
            all: false
          });
        });
        
        setPermissions(groupedPermissions);
        const tabNames = Array.from(moduleNames);
        setTabs(tabNames);
        if (tabNames.length > 0) {
          setActiveTab(tabNames[0]);
        }
      } catch (error) {
        console.error('Error fetching lock functions:', error);
        toast({
          title: "Error",
          description: "Failed to load permissions. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLockFunctions();
  }, [toast]);

  const handleTabOverallChange = (tab: string, enabled: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [tab]: prev[tab].map(permission => ({
        ...permission,
        all: enabled,
        actions: {
          show: enabled,
          create: enabled,
          update: enabled,
          destroy: enabled,
        }
      }))
    }));
  };

  const handlePermissionChange = (tab: string, actionName: string, field: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [tab]: prev[tab].map(permission => {
        if (permission.action_name === actionName) {
          const updatedPermission = { ...permission };
          
          if (field === 'all') {
            updatedPermission.all = value;
            updatedPermission.actions = {
              show: value,
              create: value,
              update: value,
              destroy: value,
            };
          } else {
            updatedPermission.actions = {
              ...updatedPermission.actions,
              [field]: value
            };
            
            // Check if all actions are selected to update "all"
            const allActionsSelected = Object.values(updatedPermission.actions).every(Boolean);
            updatedPermission.all = allActionsSelected;
          }
          
          return updatedPermission;
        }
        return permission;
      })
    }));
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
      // Transform permissions to API format
      const permissions_hash: Record<string, any> = {};
      let hasAnyPermission = false;
      
      Object.values(permissions).flat().forEach(permission => {
        const selectedActions: Record<string, string> = {};
        let hasPermissionInGroup = false;
        
        Object.entries(permission.actions).forEach(([action, isSelected]) => {
          if (isSelected) {
            selectedActions[action] = "true";
            hasPermissionInGroup = true;
            hasAnyPermission = true;
          }
        });
        
        if (hasPermissionInGroup) {
          permissions_hash[permission.action_name] = selectedActions;
        }
      });
      
      // Create the API payload
      const payload: CreateRolePayload = {
        lock_role: {
          name: roleTitle.trim()
        },
        permissions_hash,
        lock_modules: 1,
        parent_function: hasAnyPermission
      };

      console.log('Creating role with payload:', payload);
      
      // Call the API
      const response = await roleService.createRole(payload);
      
      console.log('Role creation response:', response);
      
      toast({
        title: "Success",
        description: `Role "${roleTitle}" has been successfully created!`,
      });
      
      // Navigate back to roles list
      navigate('/settings/roles/role');
      
    } catch (error: any) {
      console.error('Error creating role:', error);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create role. Please try again.",
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
    if (!permissions[tab]) return false;
    return permissions[tab].some(permission => permission.all);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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
              Role Title
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
                            Create
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 text-center min-w-[60px] text-xs lg:text-sm">
                            Show
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 text-center min-w-[60px] text-xs lg:text-sm">
                            Update
                          </TableHead>
                          <TableHead className="font-semibold text-gray-700 text-center min-w-[70px] text-xs lg:text-sm">
                            Destroy
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {permissions[activeTab]?.map((permission) => (
                          <TableRow key={permission.action_name} className="hover:bg-gray-50">
                            <TableCell className="font-medium text-xs lg:text-sm py-2 lg:py-3">
                              {permission.function_name || permission.action_name}
                            </TableCell>
                            <TableCell className="text-center py-2 lg:py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={permission.all}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(activeTab, permission.action_name, 'all', checked as boolean)
                                  }
                                  className="w-4 h-4"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-2 lg:py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={permission.actions.create}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(activeTab, permission.action_name, 'create', checked as boolean)
                                  }
                                  className="w-4 h-4"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-2 lg:py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={permission.actions.show}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(activeTab, permission.action_name, 'show', checked as boolean)
                                  }
                                  className="w-4 h-4"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-2 lg:py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={permission.actions.update}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(activeTab, permission.action_name, 'update', checked as boolean)
                                  }
                                  className="w-4 h-4"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-2 lg:py-3">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={permission.actions.destroy}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(activeTab, permission.action_name, 'destroy', checked as boolean)
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