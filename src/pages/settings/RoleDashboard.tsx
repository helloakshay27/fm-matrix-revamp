import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Shield,
  Check,
  AlertCircle,
  Edit2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  roleService,
  RoleWithModules,
  LockModule,
} from "@/services/roleService";
import { permissionService } from "@/services/permissionService";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchRolesWithModules,
  updateSubFunctionEnabled,
  updateFunctionEnabled,
  updateModuleEnabled,
  setUpdating,
} from "@/store/slices/roleWithModulesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
  const { roles, loading, error, updating } = useAppSelector(
    (state) => state.roleWithModules
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [activeModuleTab, setActiveModuleTab] = useState("");
  const [selectedRole, setSelectedRole] = useState<RoleWithModules | null>(
    null
  );
  const [allModules, setAllModules] = useState<LockModule[]>([]);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch roles with modules from new API
  useEffect(() => {
    console.log("RoleDashboard: Starting to fetch roles with modules...");
    dispatch(fetchRolesWithModules());

    // Fetch all available modules
    const fetchAllModules = async () => {
      setModulesLoading(true);
      try {
        console.log("RoleDashboard: Fetching all modules...");
        const modules = await roleService.fetchModules();
        console.log("RoleDashboard: Fetched modules:", modules);
        setAllModules(modules);
        await permissionService.getUserRole();

        // Set first module as active tab if no tab is set
        if (modules.length > 0 && !activeModuleTab) {
          const moduleId = modules[0].module_id ?? modules[0].id;
          console.log("RoleDashboard: Setting active module tab to:", moduleId);
          if (moduleId != null) {
            setActiveModuleTab(moduleId.toString());
          }
        }
      } catch (error) {
        console.error("RoleDashboard: Error fetching modules:", error);
        toast.error("Failed to load modules");
      } finally {
        setModulesLoading(false);
      }
    };

    fetchAllModules();
  }, [dispatch]);

  // Set default selected role when roles are loaded and update when roles change
  useEffect(() => {
    if (Array.isArray(roles) && roles.length > 0) {
      if (!selectedRole) {
        console.log("Setting default selected role to:", roles[0]);
        setSelectedRole(roles[0]);
      } else {
        // Update the selected role with the latest data from Redux store
        const updatedRole = roles.find(
          (r) => r.role_id === selectedRole.role_id
        );
        if (
          updatedRole &&
          JSON.stringify(updatedRole) !== JSON.stringify(selectedRole)
        ) {
          console.log("Updating selected role with latest data:", {
            oldRole: selectedRole.role_name,
            newRole: updatedRole.role_name,
            oldModulesCount: selectedRole.modules.length,
            newModulesCount: updatedRole.modules.length,
          });
          setSelectedRole(updatedRole);
        }
      }
    }
  }, [roles, selectedRole?.role_id]); // Only depend on role_id to avoid infinite loops

  // Get filtered roles based on search term
  const filteredRoles = Array.isArray(roles)
    ? roles.filter((role) =>
        role.role_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Get current role's modules for tabs - Use all available modules instead of just role's modules
  // Always get the current role from the Redux store to ensure it's up-to-date
  const currentRole = selectedRole
    ? roles.find((r) => r.role_id === selectedRole.role_id) || selectedRole
    : null;
  const tabs = Array.isArray(allModules)
    ? allModules
        .filter((module) => (module.module_id ?? module.id) != null)
        .map((module) => ({
          id: (module.module_id ?? module.id).toString(),
          name: module.name || "Unknown Module",
        }))
    : [];

  // Get current module from the selected role's modules (this contains the actual enabled status)
  const currentRoleModule =
    currentRole?.modules.find((m) => {
      const moduleId = m.module_id ?? m.id;
      return moduleId != null && moduleId.toString() === activeModuleTab;
    }) || null;

  // Get current module info from all modules (for metadata like name)
  const currentModule = Array.isArray(allModules)
    ? allModules.find((m) => {
        const moduleId = m.module_id ?? m.id;
        return moduleId != null && moduleId.toString() === activeModuleTab;
      })
    : null;

  const [functionSearchTerm, setFunctionSearchTerm] = useState("");

  // Use functions from the general module (master list) to ensure all available functions are shown
  // We should NOT use currentRoleModule?.functions here as it may be sparse (only containing enabled functions)
  const rawFunctions = currentModule?.functions || [];

  // Filter functions based on search term
  const currentFunctions = rawFunctions.filter((func) => {
    const searchLower = functionSearchTerm.toLowerCase();
    const functionName = (
      func.function_name ||
      (func as any).name ||
      ""
    ).toLowerCase();

    // Check if function name matches
    if (functionName.includes(searchLower)) return true;

    // Check if any sub-function matches
    return (func.sub_functions || []).some((subFunc) => {
      const subFunctionName = (
        subFunc.sub_function_name ||
        (subFunc as any).name ||
        ""
      ).toLowerCase();
      return subFunctionName.includes(searchLower);
    });
  });

  // Debug logging
  console.log("RoleDashboard Debug:", {
    currentRole: currentRole?.role_name,
    roleId: currentRole?.role_id,
    activeModuleTab,
    currentRoleModule: currentRoleModule?.module_id,
    currentModule: currentModule?.module_id,
    functionsCount: currentFunctions.length,
    currentRoleModuleData: currentRoleModule,
    reduxRolesCount: Array.isArray(roles) ? roles.length : 0,
    functions: currentFunctions.map((f) => ({
      id: f.function_id ?? f.id,
      name: f.function_name,
      enabled: f.enabled,
      subFunctionsCount: f.sub_functions?.length || 0,
    })),
  });

  // Helper function to check if a sub-function is enabled for the current role
  const isSubFunctionEnabled = (
    moduleId: number,
    functionId: number,
    subFunctionId: number
  ): boolean => {
    if (!currentRole) {
      console.log("isSubFunctionEnabled: No current role");
      return false;
    }

    const roleModule = currentRole.modules.find(
      (m) => (m.module_id ?? m.id) === moduleId
    );
    if (!roleModule) {
      console.log("isSubFunctionEnabled: Role module not found:", {
        moduleId,
        availableModules: currentRole.modules.map((m) => m.module_id ?? m.id),
      });
      return false;
    }

    const roleFunction = roleModule.functions.find(
      (f) => (f.function_id ?? f.id) === functionId
    );
    if (!roleFunction) {
      console.log("isSubFunctionEnabled: Role function not found:", {
        functionId,
        availableFunctions: roleModule.functions.map(
          (f) => f.function_id ?? f.id
        ),
      });
      return false;
    }

    const roleSubFunction = roleFunction.sub_functions.find(
      (sf) => (sf.sub_function_id ?? sf.id) === subFunctionId
    );
    const enabled = roleSubFunction?.enabled || false;

    console.log("isSubFunctionEnabled result:", {
      moduleId,
      functionId,
      subFunctionId,
      enabled,
      roleSubFunction: roleSubFunction
        ? {
            id: roleSubFunction.sub_function_id ?? roleSubFunction.id,
            name: roleSubFunction.sub_function_name,
            enabled: roleSubFunction.enabled,
          }
        : null,
    });

    return enabled;
  };

  // Helper function to check if a function is enabled for the current role
  const isFunctionEnabled = (moduleId: number, functionId: number): boolean => {
    if (!currentRole) {
      console.log("isFunctionEnabled: No current role");
      return false;
    }

    const roleModule = currentRole.modules.find(
      (m) => (m.module_id ?? m.id) === moduleId
    );
    if (!roleModule) {
      console.log("isFunctionEnabled: Role module not found:", {
        moduleId,
        availableModules: currentRole.modules.map((m) => m.module_id ?? m.id),
      });
      return false;
    }

    const roleFunction = roleModule.functions.find(
      (f) => (f.function_id ?? f.id) === functionId
    );
    const enabled = roleFunction?.enabled || false;

    console.log("isFunctionEnabled result:", {
      moduleId,
      functionId,
      enabled,
      roleFunction: roleFunction
        ? {
            id: roleFunction.function_id ?? roleFunction.id,
            name: roleFunction.function_name,
            enabled: roleFunction.enabled,
          }
        : null,
    });

    return enabled;
  };

  // Helper function to check if a module is enabled for the current role
  const isModuleEnabled = (moduleId: number): boolean => {
    if (!currentRole) {
      console.log("isModuleEnabled: No current role");
      return false;
    }

    const roleModule = currentRole.modules.find(
      (m) => (m.module_id ?? m.id) === moduleId
    );
    const enabled = roleModule?.enabled || false;

    console.log("isModuleEnabled result:", {
      moduleId,
      enabled,
      roleModule: roleModule
        ? {
            id: roleModule.module_id ?? roleModule.id,
            name: roleModule.name,
            enabled: roleModule.enabled,
          }
        : null,
    });

    return enabled;
  };

  // Helper function to check if ALL functions and sub-functions in a module are enabled
  const areAllFunctionsEnabled = (moduleId: number): boolean => {
    if (!currentRole) return false;

    // Find the master module definition to know all available functions
    const masterModule = allModules.find(
      (m) => (m.module_id ?? m.id) === moduleId
    );

    if (
      !masterModule ||
      !masterModule.functions ||
      masterModule.functions.length === 0
    ) {
      return false;
    }

    const roleModule = currentRole.modules.find(
      (m) => (m.module_id ?? m.id) === moduleId
    );

    // If role doesn't have this module initialized, or it's disabled, then not all are enabled
    if (!roleModule || !roleModule.enabled) {
      return false;
    }

    // Check if every function in the MASTER module is enabled in the ROLE module
    return masterModule.functions.every((masterFunc) => {
      const funcId = masterFunc.function_id ?? masterFunc.id;
      const roleFunc = roleModule.functions.find(
        (f) => (f.function_id ?? f.id) === funcId
      );

      // If function doesn't exist in role or is disabled
      if (!roleFunc || !roleFunc.enabled) return false;

      // Check all sub-functions
      if (masterFunc.sub_functions && masterFunc.sub_functions.length > 0) {
        return masterFunc.sub_functions.every((masterSubFunc) => {
          const subFuncId = masterSubFunc.sub_function_id ?? masterSubFunc.id;
          const roleSubFunc = roleFunc.sub_functions.find(
            (sf) => (sf.sub_function_id ?? sf.id) === subFuncId
          );

          return roleSubFunc && roleSubFunc.enabled;
        });
      }

      return true;
    });
  };

  const handleRoleClick = (role: RoleWithModules) => {
    setSelectedRole(role);
    // Keep the same tab when switching roles, or set first tab if none
    if (
      !activeModuleTab &&
      Array.isArray(allModules) &&
      allModules.length > 0
    ) {
      const moduleId = allModules[0].module_id ?? allModules[0].id;
      if (moduleId != null) {
        setActiveModuleTab(moduleId.toString());
      }
    }
  };

  const handleAddRole = () => {
    console.log("Navigating to Add Role page...");
    navigate("/settings/roles/role/add");
  };

  // Handle sub-function permission change
  const handleSubFunctionToggle = (
    moduleId: number,
    functionId: number,
    subFunctionId: number,
    enabled: boolean
  ) => {
    if (!currentRole) return;

    console.log("Toggling sub-function:", {
      moduleId,
      functionId,
      subFunctionId,
      enabled,
    });

    // Find the sub-function data from currentFunctions to pass complete structure
    const functionData = currentFunctions.find(
      (f) => (f.function_id ?? f.id) === functionId
    );
    const subFunctionData = functionData?.sub_functions?.find(
      (sf) => (sf.sub_function_id ?? sf.id) === subFunctionId
    );

    // Find the module data from allModules
    const moduleData = allModules.find(
      (m) => (m.module_id ?? m.id) === moduleId
    );

    dispatch(
      updateSubFunctionEnabled({
        roleId: currentRole.role_id,
        moduleId,
        functionId,
        subFunctionId,
        enabled,
        moduleData, // Pass complete module structure
        functionData, // Pass complete function structure
        subFunctionData, // Pass the complete sub-function structure
      })
    );
  };

  // Handle function permission change (toggles all sub-functions)
  const handleFunctionToggle = (
    moduleId: number,
    functionId: number,
    enabled: boolean
  ) => {
    if (!currentRole) return;

    console.log("Toggling function:", { moduleId, functionId, enabled });

    // Find the function data from currentFunctions to pass complete structure
    const functionData = currentFunctions.find(
      (f) => (f.function_id ?? f.id) === functionId
    );

    // Find the module data from allModules
    const moduleData = allModules.find(
      (m) => (m.module_id ?? m.id) === moduleId
    );

    dispatch(
      updateFunctionEnabled({
        roleId: currentRole.role_id,
        moduleId,
        functionId,
        enabled,
        moduleData, // Pass complete module structure
        functionData, // Pass the complete function structure
      })
    );
  };

  // Handle module permission change (toggles all functions and sub-functions)
  const handleModuleToggle = (moduleId: number, enabled: boolean) => {
    if (!currentRole) return;

    console.log("Toggling module:", { moduleId, enabled });

    // Find the module data from allModules to pass complete structure
    const moduleData = allModules.find(
      (m) => (m.module_id ?? m.id) === moduleId
    );

    dispatch(
      updateModuleEnabled({
        roleId: currentRole.role_id,
        moduleId,
        enabled,
        moduleData, // Pass the complete module structure
      })
    );
  };

  const handleUpdatePermissions = async () => {
    if (!currentRole) {
      toast.error("Please select a role first");
      return;
    }

    console.log("Updating permissions for role:", {
      role_id: currentRole.role_id,
      role_name: currentRole.role_name,
      modules_count: currentRole.modules.length,
      full_role_data: currentRole,
    });

    dispatch(setUpdating(true));

    try {
      await roleService.updateRoleWithModules(currentRole);
      toast.success(
        `Permissions updated successfully for ${currentRole.role_name}`
      );

      // Refresh roles data to reflect changes
      await dispatch(fetchRolesWithModules());

      // Refresh user role data to update stored display name and role name
      await permissionService.getUserRole();
    } catch (error: any) {
      console.error("Error updating permissions:", error);
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unknown error";
      toast.error(`Failed to update permissions: ${errorMessage}`);
    } finally {
      dispatch(setUpdating(false));
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
            <Shield className="w-6 h-6 text-[#C72030]" />
            Role Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage user roles and their access permissions across modules
          </p>
        </div>
        <Button
          onClick={handleAddRole}
          className="bg-[#C72030] hover:bg-[#A11D2A] text-white shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Role
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Panel - Roles List */}
        <Card className="w-full xl:w-80 h-fit border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-gray-800">
              Roles
            </CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-gray-50 border-gray-200"
              />
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto pr-1 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C72030]"></div>
                </div>
              ) : filteredRoles.length > 0 ? (
                filteredRoles.map((role, index) => (
                  <button
                    key={`${role.role_name}-${index}`}
                    onClick={() => handleRoleClick(role)}
                    className={`w-full text-left px-4 py-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                      currentRole?.role_name === role.role_name
                        ? "bg-[#C72030] text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span>{role.role_name}</span>
                    {currentRole?.role_name === role.role_name && (
                      <Check className="w-4 h-4 text-white/90" />
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8 flex flex-col items-center">
                  <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
                  <span className="text-sm">No roles found</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Panel - Permissions Matrix */}
        <Card className="flex-1 min-w-0 border-gray-200 shadow-sm">
          <CardHeader className="pb-0 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Permissions Configuration
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  Configure access rights for{" "}
                  <span className="font-medium text-[#C72030]">
                    {currentRole?.role_name || "selected role"}
                  </span>
                </p>
              </div>
              <div className="flex gap-2">
                {!isEditMode ? (
                  <Button
                    onClick={() => setIsEditMode(true)}
                    variant="outline"
                    className="border-[#C72030] text-[#C72030] hover:bg-[#C72030]/10"
                    disabled={!currentRole}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Permissions
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={() => setIsEditMode(false)}
                      variant="outline"
                      className="border-gray-300 text-gray-600 hover:bg-gray-100"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        await handleUpdatePermissions();
                        setIsEditMode(false);
                      }}
                      className="bg-[#C72030] hover:bg-[#A11D2A] text-white min-w-[140px]"
                      disabled={updating || !currentRole}
                    >
                      {updating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Module Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-0 scrollbar-hide -mb-px">
              {modulesLoading ? (
                <div className="text-gray-500 text-sm py-2">
                  Loading modules...
                </div>
              ) : tabs.length > 0 ? (
                tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveModuleTab(tab.id);
                      setFunctionSearchTerm(""); // Reset search when switching tabs
                    }}
                    className={`px-4 py-3 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeModuleTab === tab.id
                        ? "border-[#C72030] text-[#C72030] bg-red-50/30"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))
              ) : (
                <div className="text-gray-500 text-sm py-2">
                  No modules available
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div
              className="min-h-[400px]"
              key={`role-${currentRole?.role_id}-module-${activeModuleTab}`}
            >
              {/* Module Toggle and Search */}
              {currentModule && (
                <div className="bg-gray-50/80 p-4 border-b border-gray-100 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-700">
                        {currentModule.name} Module Access
                      </span>
                      <Badge variant="outline" className="text-xs font-normal">
                        {currentFunctions.length} Functions
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Function Search */}
                      <div className="relative w-full sm:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search functions..."
                          value={functionSearchTerm}
                          onChange={(e) =>
                            setFunctionSearchTerm(e.target.value)
                          }
                          className="pl-9 h-9 bg-white border-gray-200 text-sm"
                        />
                      </div>

                      <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-700">
                          Enable All
                        </span>
                        <Checkbox
                          checked={areAllFunctionsEnabled(
                            currentModule.module_id ?? currentModule.id
                          )}
                          onCheckedChange={(checked) => {
                            handleModuleToggle(
                              currentModule.module_id ?? currentModule.id,
                              checked as boolean
                            );
                          }}
                          className="w-5 h-5 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                          disabled={!isEditMode || updating || !currentModule}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <div className="max-h-[calc(100vh-450px)] overflow-y-auto custom-scrollbar">
                  <Table>
                    <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[70%] pl-6">
                          Function / Sub-function
                        </TableHead>
                        <TableHead className="w-[30%] text-center">
                          Enabled
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading || modulesLoading ? (
                        <TableRow>
                          <TableCell colSpan={2} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030] mb-2"></div>
                              <span className="text-gray-500">
                                Loading permissions...
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : currentFunctions.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="text-center py-12 text-gray-500"
                          >
                            {!currentRoleModule && !currentModule
                              ? "Please select a module to view permissions"
                              : functionSearchTerm
                                ? "No matching functions found"
                                : "No functions found for this module"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentFunctions.flatMap((func) => [
                          // Function row
                          <TableRow
                            key={`func-${func.function_id ?? func.id}`}
                            className="bg-gray-50/50 hover:bg-gray-100/50 border-b border-gray-100"
                          >
                            <TableCell className="py-4 pl-6">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                  <Shield className="w-4 h-4" />
                                </div>
                                <span className="font-semibold text-gray-800">
                                  {func.function_name ||
                                    (func as any).name ||
                                    "Unknown Function"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center py-4">
                              <div className="flex justify-center">
                                <Checkbox
                                  checked={
                                    currentModule
                                      ? isFunctionEnabled(
                                          currentModule.module_id ??
                                            currentModule.id,
                                          func.function_id ?? func.id
                                        )
                                      : false
                                  }
                                  onCheckedChange={(checked) => {
                                    if (currentModule) {
                                      handleFunctionToggle(
                                        currentModule.module_id ??
                                          currentModule.id,
                                        func.function_id ?? func.id,
                                        checked as boolean
                                      );
                                    }
                                  }}
                                  className="w-5 h-5 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                  disabled={
                                    !isEditMode || updating || !currentModule
                                  }
                                />
                              </div>
                            </TableCell>
                          </TableRow>,
                          // Sub-function rows
                          ...(func.sub_functions || []).map((subFunc) => (
                            <TableRow
                              key={`subfunc-${
                                subFunc.sub_function_id ?? subFunc.id
                              }`}
                              className="hover:bg-gray-50 border-b border-gray-50 last:border-0"
                            >
                              <TableCell className="py-3 pl-16">
                                <div className="flex items-center gap-2 relative">
                                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300"></div>
                                  <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                  <span className="text-sm text-gray-600">
                                    {subFunc.sub_function_name ||
                                      (subFunc as any).name ||
                                      "Unknown Sub-function"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center py-3">
                                <div className="flex justify-center">
                                  <Checkbox
                                    checked={
                                      currentModule
                                        ? isSubFunctionEnabled(
                                            currentModule.module_id ??
                                              currentModule.id,
                                            func.function_id ?? func.id,
                                            subFunc.sub_function_id ??
                                              subFunc.id
                                          )
                                        : false
                                    }
                                    onCheckedChange={(checked) => {
                                      if (currentModule) {
                                        handleSubFunctionToggle(
                                          currentModule.module_id ??
                                            currentModule.id,
                                          func.function_id ?? func.id,
                                          subFunc.sub_function_id ?? subFunc.id,
                                          checked as boolean
                                        );
                                      }
                                    }}
                                    className="w-4 h-4 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                    disabled={
                                      !isEditMode || updating || !currentModule
                                    }
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          )),
                        ])
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
