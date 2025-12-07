import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, AlertCircle, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { roleService, LockModule } from "@/services/roleService";

// Validation constants
const ROLE_NAME_MAX_LENGTH = 50;
const DISPLAY_NAME_MAX_LENGTH = 50;
// Allow alphanumeric, spaces, hyphens, and underscores only
const VALID_NAME_REGEX = /^[a-zA-Z0-9\s\-_]+$/;

// Validation helper functions
const validateRoleName = (
  name: string
): { isValid: boolean; error: string } => {
  if (!name.trim()) {
    return { isValid: false, error: "Role name is required" };
  }
  if (name.trim().length > ROLE_NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Role name must be ${ROLE_NAME_MAX_LENGTH} characters or less`,
    };
  }
  if (!VALID_NAME_REGEX.test(name.trim())) {
    return {
      isValid: false,
      error:
        "Role name can only contain letters, numbers, spaces, hyphens (-), and underscores (_)",
    };
  }
  return { isValid: true, error: "" };
};

const validateDisplayName = (
  name: string
): { isValid: boolean; error: string } => {
  if (!name.trim()) {
    return { isValid: false, error: "Display name is required" };
  }
  if (name.trim().length > DISPLAY_NAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Display name must be ${DISPLAY_NAME_MAX_LENGTH} characters or less`,
    };
  }
  if (!VALID_NAME_REGEX.test(name.trim())) {
    return {
      isValid: false,
      error:
        "Display name can only contain letters, numbers, spaces, hyphens (-), and underscores (_)",
    };
  }
  return { isValid: true, error: "" };
};
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NewRolePermission {
  moduleId: number;
  moduleName: string;
  enabled: boolean;
  functions: {
    functionId: number;
    functionName: string;
    actionName?: string;
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
  const [roleName, setRoleName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [roleNameError, setRoleNameError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modules, setModules] = useState<LockModule[]>([]);
  const [permissions, setPermissions] = useState<NewRolePermission[]>([]);
  const [activeModuleTab, setActiveModuleTab] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchModules = async () => {
      try {
        setModulesLoading(true);
        const fetchedModules = await roleService.fetchModules();
        setModules(fetchedModules);

        // Initialize permissions for all modules
        const initialPermissions: NewRolePermission[] = fetchedModules.map(
          (module) => ({
            moduleId: module.module_id ?? module.id,
            moduleName: module.name,
            enabled: false,
            functions: (module.functions || []).map((func) => ({
              functionId: func.function_id ?? func.id,
              functionName: func.function_name,
              actionName: func.action_name, // Capture action_name from API
              enabled: false,
              subFunctions: (func.sub_functions || []).map((subFunc) => ({
                subFunctionId: subFunc.sub_function_id ?? subFunc.id,
                subFunctionName: subFunc.sub_function_name,
                enabled: false,
              })),
            })),
          })
        );

        setPermissions(initialPermissions);

        // Set first module as active tab
        if (fetchedModules.length > 0) {
          const moduleId = fetchedModules[0].module_id ?? fetchedModules[0].id;
          if (moduleId != null) {
            setActiveModuleTab(moduleId.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching modules:", error);
        toast.error("Failed to load modules");
      } finally {
        setModulesLoading(false);
      }
    };

    fetchModules();
  }, []);

  const handleBack = () => {
    navigate("/settings/roles/role");
  };

  const handleModuleToggle = (moduleId: number, enabled: boolean) => {
    setPermissions((prev) =>
      prev.map((perm) => {
        if (perm.moduleId === moduleId) {
          return {
            ...perm,
            enabled,
            functions: perm.functions.map((func) => ({
              ...func,
              enabled,
              subFunctions: func.subFunctions.map((subFunc) => ({
                ...subFunc,
                enabled,
              })),
            })),
          };
        }
        return perm;
      })
    );
  };

  const handleFunctionToggle = (
    moduleId: number,
    functionId: number,
    enabled: boolean
  ) => {
    setPermissions((prev) =>
      prev.map((perm) => {
        if (perm.moduleId === moduleId) {
          const updatedFunctions = perm.functions.map((func) => {
            if (func.functionId === functionId) {
              return {
                ...func,
                enabled,
                subFunctions: func.subFunctions.map((subFunc) => ({
                  ...subFunc,
                  enabled,
                })),
              };
            }
            return func;
          });

          // Update module enabled status based on functions
          const moduleEnabled = updatedFunctions.some((func) => func.enabled);

          return {
            ...perm,
            enabled: moduleEnabled,
            functions: updatedFunctions,
          };
        }
        return perm;
      })
    );
  };

  const handleSubFunctionToggle = (
    moduleId: number,
    functionId: number,
    subFunctionId: number,
    enabled: boolean
  ) => {
    setPermissions((prev) =>
      prev.map((perm) => {
        if (perm.moduleId === moduleId) {
          const updatedFunctions = perm.functions.map((func) => {
            if (func.functionId === functionId) {
              const updatedSubFunctions = func.subFunctions.map((subFunc) => {
                if (subFunc.subFunctionId === subFunctionId) {
                  return { ...subFunc, enabled };
                }
                return subFunc;
              });

              // Update function enabled status based on sub-functions
              const functionEnabled = updatedSubFunctions.some(
                (subFunc) => subFunc.enabled
              );

              return {
                ...func,
                enabled: functionEnabled,
                subFunctions: updatedSubFunctions,
              };
            }
            return func;
          });

          // Update module enabled status based on functions
          const moduleEnabled = updatedFunctions.some((func) => func.enabled);

          return {
            ...perm,
            enabled: moduleEnabled,
            functions: updatedFunctions,
          };
        }
        return perm;
      })
    );
  };

  const handleSaveRole = async () => {
    // Validate role name
    const roleNameValidation = validateRoleName(roleName);
    if (!roleNameValidation.isValid) {
      setRoleNameError(roleNameValidation.error);
      toast.error(roleNameValidation.error);
      return;
    }

    // Validate display name
    const displayNameValidation = validateDisplayName(displayName);
    if (!displayNameValidation.isValid) {
      setDisplayNameError(displayNameValidation.error);
      toast.error(displayNameValidation.error);
      return;
    }

    setLoading(true);
    try {
      // Build permissions_hash matching RoleDashboard.tsx/roleService.ts logic
      const permissionsHash: Record<string, Record<string, string>> = {};

      permissions.forEach((modulePermission) => {
        modulePermission.functions.forEach((func) => {
          // Use action_name as key if available (PRIORITY), otherwise fallback to function name
          const functionKey =
            func.actionName ||
            func.functionName.toLowerCase().replace(/\s+/g, "_");

          // Only initialize the function key if we are going to add permissions to it
          // OR if we want to follow the logic of "process all enabled things"

          let hasEnabledPermissions = false;
          const tempPermissions: Record<string, string> = {};

          // Process sub-functions
          func.subFunctions.forEach((subFunc) => {
            if (subFunc.enabled) {
              // Map sub-function names to standard CRUD operations
              let actionKey = subFunc.subFunctionName.toLowerCase();

              // Normalize common action names
              if (actionKey.includes("all") || actionKey.includes("index")) {
                actionKey = "all";
              } else if (
                actionKey.includes("create") ||
                actionKey.includes("new")
              ) {
                actionKey = "create";
              } else if (
                actionKey.includes("show") ||
                actionKey.includes("view") ||
                actionKey.includes("read")
              ) {
                actionKey = "show";
              } else if (
                actionKey.includes("update") ||
                actionKey.includes("edit")
              ) {
                actionKey = "update";
              } else if (
                actionKey.includes("destroy") ||
                actionKey.includes("delete")
              ) {
                actionKey = "destroy";
              }

              // Only include enabled permissions as "true"
              tempPermissions[actionKey] = "true";
              hasEnabledPermissions = true;
            }
          });

          // If no sub-functions exist but function is enabled, add default permissions
          if (func.subFunctions.length === 0 && func.enabled) {
            tempPermissions["all"] = "true";
            tempPermissions["create"] = "true";
            tempPermissions["show"] = "true";
            tempPermissions["update"] = "true";
            tempPermissions["destroy"] = "true";
            hasEnabledPermissions = true;
          }

          // If we have enabled permissions, add them to the hash
          // (RoleDashboard only sends keys for enabled/partially enabled items,
          // empty keys or "false" values are generally not sent for completely disabled things
          // in the update logic, but let's stick to safe-guarding:
          // If the reference implementation adds the key, we add it.)
          if (hasEnabledPermissions) {
            permissionsHash[functionKey] = tempPermissions;
          }
        });
      });

      // Get enabled module IDs
      // We check if the module is internally marked as enabled OR if any of its functions are enabled
      // The state management above updates `enabled` on the module when functions change,
      // so checking `modulePermission.enabled` is sufficient.
      const enabledModuleIds = permissions
        .filter((modulePermission) => modulePermission.enabled)
        .map((modulePermission) => modulePermission.moduleId);

      // Build the payload according to the API structure
      const payload = {
        lock_role: {
          name: roleName.trim(),
          display_name: displayName.trim(),
          access_level: null,
          access_to: null,
          active: 1,
          role_for: "pms",
        },
        permissions_hash: permissionsHash,
        lock_modules: enabledModuleIds,
      };

      console.log("Creating role with payload:", payload);

      await roleService.createRoleWithPayload(payload);
      toast.success("Role created successfully");
      navigate("/settings/roles/role");
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error(
        `Failed to create role: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // Get current module's permissions
  const currentModulePermissions = permissions.find(
    (perm) => perm.moduleId.toString() === activeModuleTab
  );

  // Generate tabs from modules with search filtering
  const tabs = modules
    .filter(
      (module) =>
        !searchTerm ||
        (module.name || "Unknown Module")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .map((module) => ({
      id: (module.module_id ?? module.id).toString(),
      name: module.name || "Unknown Module",
    }));

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack} className="p-2">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl lg:text-2xl font-bold text-[#1a1a1a]">
          Add New Role
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
        {/* Basic Information Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">
                Role Name <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({roleName.length}/{ROLE_NAME_MAX_LENGTH})
                </span>
              </Label>
              <Input
                id="roleName"
                value={roleName}
                onChange={(e) => {
                  const value = e.target.value;
                  // Restrict input length
                  if (value.length <= ROLE_NAME_MAX_LENGTH) {
                    setRoleName(value);
                    // Validate on change and update error state
                    const validation = validateRoleName(value);
                    setRoleNameError(
                      value.trim()
                        ? validation.isValid
                          ? ""
                          : validation.error
                        : ""
                    );
                  }
                }}
                placeholder="Enter role name (letters, numbers, spaces, - and _)"
                className={`w-full ${roleNameError ? "border-red-500 focus:ring-red-500" : ""}`}
                maxLength={ROLE_NAME_MAX_LENGTH}
              />
              {roleNameError && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {roleNameError}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">
                Display Name <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({displayName.length}/{DISPLAY_NAME_MAX_LENGTH})
                </span>
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => {
                  const value = e.target.value;
                  // Restrict input length
                  if (value.length <= DISPLAY_NAME_MAX_LENGTH) {
                    setDisplayName(value);
                    // Validate on change and update error state
                    const validation = validateDisplayName(value);
                    setDisplayNameError(
                      value.trim()
                        ? validation.isValid
                          ? ""
                          : validation.error
                        : ""
                    );
                  }
                }}
                placeholder="Enter display name (letters, numbers, spaces, - and _)"
                className={`w-full ${displayNameError ? "border-red-500 focus:ring-red-500" : ""}`}
                maxLength={DISPLAY_NAME_MAX_LENGTH}
              />
              {displayNameError && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {displayNameError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Module Permissions</h3>

          {modulesLoading ? (
            <div className="text-center py-8">
              <div className="text-gray-500">Loading modules...</div>
            </div>
          ) : (
            <>
              {/* Search Field */}
              <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative w-full sm:max-w-xs">
                  <Input
                    type="text"
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pr-8"
                  />
                  {searchTerm && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Module Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModuleTab(tab.id)}
                    className={`px-4 py-2 rounded border text-sm font-medium transition-colors whitespace-nowrap ${
                      activeModuleTab === tab.id
                        ? "bg-[#C72030] text-white border-[#C72030]"
                        : "bg-white text-[#C72030] border-[#C72030] hover:bg-[#C72030]/10"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>

              {/* Functions and Sub-functions Table */}
              <div className="border rounded-lg overflow-hidden">
                {/* Module Toggle */}
                {currentModulePermissions && (
                  <div className="bg-gray-100 p-3 border-b">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">
                        {currentModulePermissions.moduleName} Module
                      </span>
                      <div className="flex items-center space-x-3 bg-white px-3 py-1.5 rounded-md border border-gray-200 shadow-sm whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-700">
                          Enable All
                        </span>
                        <Checkbox
                          checked={currentModulePermissions.enabled}
                          onCheckedChange={(checked) =>
                            handleModuleToggle(
                              currentModulePermissions.moduleId,
                              checked as boolean
                            )
                          }
                          className="w-5 h-5 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <div className="max-h-64 lg:max-h-96 overflow-y-auto">
                    <Table className="min-w-full">
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
                        {!currentModulePermissions ? (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              className="text-center py-4 text-gray-500"
                            >
                              Please select a module
                            </TableCell>
                          </TableRow>
                        ) : currentModulePermissions.functions.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={2}
                              className="text-center py-4 text-gray-500"
                            >
                              No functions found for this module
                            </TableCell>
                          </TableRow>
                        ) : (
                          currentModulePermissions.functions.flatMap((func) => [
                            // Function row
                            <TableRow
                              key={`func-${func.functionId}`}
                              className="bg-gray-50/50 hover:bg-gray-100/50 border-b border-gray-100"
                            >
                              <TableCell className="py-4 pl-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                                    <Shield className="w-4 h-4" />
                                  </div>
                                  <span className="font-semibold text-gray-800">
                                    {func.functionName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center py-4">
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
                                    className="w-5 h-5 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                                  />
                                </div>
                              </TableCell>
                            </TableRow>,
                            // Sub-function rows
                            ...func.subFunctions.map((subFunc) => (
                              <TableRow
                                key={`subfunc-${subFunc.subFunctionId}`}
                                className="hover:bg-gray-50 border-b border-gray-50 last:border-0"
                              >
                                <TableCell className="py-3 pl-16">
                                  <div className="flex items-center gap-2 relative">
                                    <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300"></div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300"></div>
                                    <span className="text-sm text-gray-600">
                                      {subFunc.subFunctionName}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center py-3">
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
                                      className="w-4 h-4 data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
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
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveRole}
            disabled={loading}
            className="bg-[#C72030] hover:bg-[#A11D2A] text-white w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Creating..." : "Create Role"}
          </Button>
        </div>
      </div>
    </div>
  );
};
