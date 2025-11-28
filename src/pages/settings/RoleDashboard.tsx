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
import { Plus } from "lucide-react";
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

  // Use functions from the role's module if available, otherwise from the general module
  const currentFunctions =
    currentRoleModule?.functions || currentModule?.functions || [];

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
          <div className="relative w-full sm:max-w-xs">
            <Input
              placeholder="Search Role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-8"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Responsive Layout: Stack on mobile, side-by-side on desktop */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Left Panel - Roles List */}
          <div className="w-full xl:w-80 bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Roles List
            </h3>
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
                        ? "bg-[#C72030] text-white border-[#C72030]"
                        : "bg-white hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="text-sm font-medium">
                      {role.role_id} - {role.role_name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">
                  No roles found
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Permissions Matrix */}
          <div className="flex-1 min-w-0">
            {/* Debug info */}
            <div className="mb-2 text-xs text-gray-500">
              Debug: Roles loaded: {Array.isArray(roles) ? roles.length : "No"},
              Modules loaded: {allModules.length}, Selected role:{" "}
              {currentRole?.role_name || "None"}, Active tab:{" "}
              {activeModuleTab || "None"}, Loading: {loading ? "Yes" : "No"},
              Error: {error || "None"}
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
                        ? "bg-[#C72030] text-white border-[#C72030]"
                        : "bg-white text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))
              ) : (
                <div className="text-gray-500 text-sm">
                  No modules available
                </div>
              )}
            </div>

            {/* Functions and Sub-functions Table */}
            <div
              className="border rounded-lg overflow-hidden"
              key={`role-${currentRole?.role_id}-module-${activeModuleTab}`}
            >
              {/* Module Toggle */}
              {currentModule && (
                <div className="bg-gray-100 p-3 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      {currentModule.name} Module
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Enable All</span>
                      <Checkbox
                        checked={isModuleEnabled(
                          currentModule.module_id ?? currentModule.id
                        )}
                        onCheckedChange={(checked) => {
                          handleModuleToggle(
                            currentModule.module_id ?? currentModule.id,
                            checked as boolean
                          );
                        }}
                        className="w-4 h-4"
                        disabled={updating || !currentModule}
                      />
                    </div>
                  </div>
                </div>
              )}

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
                          <TableCell
                            colSpan={2}
                            className="text-center py-4 text-gray-500"
                          >
                            {!currentRoleModule && !currentModule
                              ? "Please select a module"
                              : "No functions found for this module"}
                          </TableCell>
                        </TableRow>
                      ) : (
                        currentFunctions.flatMap((func) => [
                          // Function row
                          <TableRow
                            key={`func-${func.function_id ?? func.id}`}
                            className="hover:bg-gray-50 bg-gray-25"
                          >
                            <TableCell className="font-semibold text-sm py-3 pl-4">
                              📁{" "}
                              {func.function_name ||
                                (func as any).name ||
                                "Unknown Function"}
                            </TableCell>
                            <TableCell className="text-center py-3">
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
                                  className="w-4 h-4"
                                  disabled={updating || !currentModule}
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
                              className="hover:bg-gray-50"
                            >
                              <TableCell className="text-sm py-2 pl-8 text-gray-600">
                                ↳{" "}
                                {subFunc.sub_function_name ||
                                  (subFunc as any).name ||
                                  "Unknown Sub-function"}
                              </TableCell>
                              <TableCell className="text-center py-2">
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
                                    className="w-4 h-4"
                                    disabled={updating || !currentModule}
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

            {/* Update Button */}
            <div className="mt-4 flex flex-col sm:flex-row justify-center">
              <Button
                onClick={handleUpdatePermissions}
                className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
                disabled={updating || !currentRole}
              >
                {updating ? "Updating..." : "Update Permissions"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
