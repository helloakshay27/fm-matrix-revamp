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
import { toast } from 'sonner';
import { roleService, LockModule } from '@/services/roleService';useState, useEffect } from 'react';
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
import { roleService, CreateRolePayload, LockModule, LockFunctionWithSubs, LockSubFunction } from '@/services/roleService';

interface FunctionPermission {
  functionId: number;
  functionName: string;
  enabled: boolean;
  subFunctions: SubFunctionPermission[];
}

interface SubFunctionPermission {
  subFunctionId: number;
  subFunctionName: string;
  enabled: boolean;
}

interface ModulePermission {
  moduleId: number;
  moduleName: string;
  enabled: boolean;
  functions: FunctionPermission[];
}

export const AddRolePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roleTitle, setRoleTitle] = useState('');
  const [activeModuleTab, setActiveModuleTab] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allModules, setAllModules] = useState<LockModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [permissions, setPermissions] = useState<ModulePermission[]>([]);

  // Fetch all available modules
  useEffect(() => {
    const fetchAllModules = async () => {
      setModulesLoading(true);
      try {
        const modules = await roleService.fetchModules();
        setAllModules(modules);
        
        // Initialize permissions structure based on available modules
        const initialPermissions = modules.map(module => ({
          moduleId: module.module_id,
          moduleName: module.module_name,
          enabled: false,
          functions: module.functions.map(func => ({
            functionId: func.function_id,
            functionName: func.function_name,
            enabled: false,
            subFunctions: func.sub_functions.map(subFunc => ({
              subFunctionId: subFunc.sub_function_id,
              subFunctionName: subFunc.sub_function_name,
              enabled: false
            }))
          }))
        }));
        
        setPermissions(initialPermissions);
        
        // Set first module as active tab
        if (modules.length > 0) {
          setActiveModuleTab(modules[0].module_id.toString());
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        toast({
          title: "Error",
          description: "Failed to load modules. Please try again.",
          variant: "destructive",
        });
      } finally {
        setModulesLoading(false);
      }
    };

    fetchAllModules();
  }, [toast]);

  // Get tabs from modules
  const tabs = allModules.map(module => ({
    id: module.module_id.toString(),
    name: module.module_name
  }));

  // Get current module and its functions
  const currentModule = allModules.find(m => m.module_id.toString() === activeModuleTab);
  const currentModulePermissions = permissions.find(p => p.moduleId.toString() === activeModuleTab);

  const handleModuleToggle = (moduleId: number, enabled: boolean) => {
    setPermissions(prev => 
      prev.map(module => 
        module.moduleId === moduleId
          ? {
              ...module,
              enabled,
              functions: module.functions.map(func => ({
                ...func,
                enabled,
                subFunctions: func.subFunctions.map(subFunc => ({
                  ...subFunc,
                  enabled
                }))
              }))
            }
          : module
      )
    );
  };

  const handleFunctionToggle = (moduleId: number, functionId: number, enabled: boolean) => {
    setPermissions(prev => 
      prev.map(module => 
        module.moduleId === moduleId
          ? {
              ...module,
              functions: module.functions.map(func => 
                func.functionId === functionId
                  ? {
                      ...func,
                      enabled,
                      subFunctions: func.subFunctions.map(subFunc => ({
                        ...subFunc,
                        enabled
                      }))
                    }
                  : func
              )
            }
          : module
      )
    );
  };

  const handleSubFunctionToggle = (moduleId: number, functionId: number, subFunctionId: number, enabled: boolean) => {
    setPermissions(prev => 
      prev.map(module => 
        module.moduleId === moduleId
          ? {
              ...module,
              functions: module.functions.map(func => 
                func.functionId === functionId
                  ? {
                      ...func,
                      subFunctions: func.subFunctions.map(subFunc => 
                        subFunc.subFunctionId === subFunctionId
                          ? { ...subFunc, enabled }
                          : subFunc
                      )
                    }
                  : func
              )
            }
          : module
      )
    );
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
      // Build modules structure for API
      const selectedModules = permissions
        .filter(module => module.enabled || module.functions.some(f => f.enabled || f.subFunctions.some(sf => sf.enabled)))
        .map(module => ({
          module_id: module.moduleId,
          enabled: module.enabled,
          functions: module.functions
            .filter(func => func.enabled || func.subFunctions.some(sf => sf.enabled))
            .map(func => ({
              function_id: func.functionId,
              enabled: func.enabled,
              sub_functions: func.subFunctions
                .filter(subFunc => subFunc.enabled)
                .map(subFunc => ({
                  sub_function_id: subFunc.subFunctionId,
                  enabled: subFunc.enabled
                }))
            }))
        }));

      // Create the API payload
      const payload = {
        lock_role: {
          name: roleTitle.trim()
        },
        lock_modules: selectedModules
      };

      console.log('Creating role with payload:', payload);
      
      // Call the API
      const response = await roleService.createRole(payload as any);
      
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
            {/* Left Sidebar with Module Checkboxes */}
            <div className="w-full xl:w-80 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Modules</h3>
              <div className="space-y-3">
                {modulesLoading ? (
                  <div className="text-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
                    <div className="text-sm text-gray-500">Loading modules...</div>
                  </div>
                ) : tabs.length > 0 ? (
                  tabs.map((tab) => (
                    <div key={tab.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`module-${tab.id}`}
                        checked={permissions.find(p => p.moduleId.toString() === tab.id)?.enabled || false}
                        onCheckedChange={(checked) => handleModuleToggle(parseInt(tab.id), checked as boolean)}
                      />
                      <label
                        htmlFor={`module-${tab.id}`}
                        className={`text-sm font-medium cursor-pointer ${
                          activeModuleTab === tab.id ? 'text-[#C72030]' : 'text-gray-700'
                        }`}
                        onClick={() => setActiveModuleTab(tab.id)}
                      >
                        {tab.name}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-4">No modules available</div>
                )}
              </div>
            </div>

            {/* Right Panel - Functions and Sub-functions */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Functions for: {currentModule?.module_name || 'Select a module'}
              </h3>
              
              {/* Module Tabs */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {tabs.map((tab) => (
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
                ))}
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
                        {modulesLoading ? (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center py-4">
                              Loading functions...
                            </TableCell>
                          </TableRow>
                        ) : !currentModule || !currentModulePermissions ? (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center py-4 text-gray-500">
                              Please select a module to view functions
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
                                    onCheckedChange={(checked) => {
                                      handleFunctionToggle(
                                        currentModule.module_id,
                                        func.functionId,
                                        checked as boolean
                                      );
                                    }}
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
                                      onCheckedChange={(checked) => {
                                        handleSubFunctionToggle(
                                          currentModule.module_id,
                                          func.functionId,
                                          subFunc.subFunctionId,
                                          checked as boolean
                                        );
                                      }}
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