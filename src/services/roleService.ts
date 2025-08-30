import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

export interface ApiRole {
  id: number;
  name: string;
  permissions_hash: string;
}

export interface CreateRolePayload {
  lock_role: {
    name: string;
  };
  permissions_hash: Record<string, any>;
  lock_modules: number;
  parent_function?: boolean;
}

export interface UpdateRolePayload {
  lock_role: {
    name: string;
  };
  permissions_hash: Record<string, any>;
  lock_modules?: number;
}

export interface LockFunction {
  id: number;
  action_name: string;
  module_name: string;
  function_name: string;
  description?: string;
}

// Raw API response interfaces for modules API
interface ApiLockSubFunction {
  id: number;
  lock_function_id: number;
  name: string;
  sub_function_name: string;
  active: number;
  created_at?: string;
  updated_at?: string;
  url?: string;
  enabled?: boolean;
}

interface ApiLockFunction {
  id: number;
  lock_controller_id?: number | null;
  name: string;
  action_name: string;
  active: number;
  phase_id?: string | null;
  module_id: string;
  parent_function: string;
  created_at?: string;
  updated_at?: string;
  url?: string;
  enabled?: boolean;
  lock_sub_functions: ApiLockSubFunction[];
}

interface ApiModule {
  id: number;
  name: string;
  abbreviation: string;
  active: number;
  phase_id?: string;
  show_name: string;
  module_type: string;
  charged_per?: string;
  no_of_licences?: number;
  min_billing?: number;
  rate?: number;
  max_billing?: number;
  total_billing?: number;
  rate_type?: string;
  created_at?: string;
  updated_at?: string;
  url?: string;
  enabled?: boolean;
  lock_functions: ApiLockFunction[];
}

// API response interfaces for roles with modules API
interface ApiRoleSubFunction {
  sub_function_id: number;
  sub_function_name: string;
  sub_function_display_name: string;
  sub_function_active: number;
  enabled: boolean;
}

interface ApiRoleFunction {
  function_id: number;
  function_name: string;
  function_active: number;
  sub_functions: ApiRoleSubFunction[];
}

interface ApiRoleModule {
  module_id: number;
  module_name: string;
  module_active: number;
  lock_functions: ApiRoleFunction[];
}

interface ApiRoleWithModules {
  role_id?: number;  // Add role_id field
  role_name: string;
  display_name: string;
  active: number;
  lock_modules: ApiRoleModule[];
}

type ApiRolesWithModulesResponse = {
  success: boolean;
  data: ApiRoleWithModules[];
};

export interface LockSubFunction {
  id: number;
  sub_function_id: number;
  sub_function_name: string;
  enabled: boolean;
}

export interface LockFunctionWithSubs {
  id: number;
  function_id?: number;
  function_name: string;
  enabled: boolean;
  sub_functions: LockSubFunction[];
}

export interface LockModule {
  id: number;
  module_id?: number;
  name: string;
  enabled: boolean;
  functions: LockFunctionWithSubs[];
}

export interface RoleWithModules {
  id: number;
  role_id: number;
  role_name: string;
  modules: LockModule[];
}

export interface ApiModulesResponse {
  modules: LockModule[];
}

export interface CreateRoleResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface CreateRoleWithPayload {
  lock_role: {
    name: string;
    display_name: string;
    access_level: null;
    access_to: null;
    active: number;
    role_for: string;
  };
  permissions_hash: Record<string, Record<string, string>>;
  lock_modules: number[]; // Array of module IDs instead of null
}

export const roleService = {
  // Fetch all roles
  async fetchRoles(): Promise<ApiRole[]> {
    try {
      const response = await apiClient.get<ApiRole[]>(ENDPOINTS.ROLES)
      return response.data
    } catch (error) {
      console.error('Error fetching roles:', error)
      throw error
    }
  },

  // Fetch single role
  async fetchRole(id: number): Promise<ApiRole> {
    try {
      const response = await apiClient.get<ApiRole>(`${ENDPOINTS.ROLES.replace('.json', '')}/${id}.json`)
      return response.data
    } catch (error) {
      console.error('Error fetching role:', error)
      throw error
    }
  },

  // Fetch lock functions
  async getLockFunctions(): Promise<LockFunction[]> {
    try {
      const response = await apiClient.get<LockFunction[]>(ENDPOINTS.FUNCTIONS)
      return response.data
    } catch (error) {
      console.error('Error fetching lock functions:', error)
      throw error
    }
  },

  // Create new role
  async createRole(payload: CreateRolePayload): Promise<CreateRoleResponse> {
    try {
      const response = await apiClient.post<CreateRoleResponse>(ENDPOINTS.ROLES, payload)
      return response.data
    } catch (error) {
      console.error('Error creating role:', error)
      throw error
    }
  },

  // Create new role with modules structure
  async createRoleWithModules(roleData: any): Promise<CreateRoleResponse> {
    try {
      // For now, we'll use the existing createRole endpoint
      // You may need to adjust this based on your API structure
      const payload = {
        lock_role: {
          name: roleData.role_name
        },
        permissions_hash: {}, // You may need to build this from the modules data
        lock_modules: roleData.modules?.length || 0,
        modules: roleData.modules
      };
      
      const response = await apiClient.post<CreateRoleResponse>(ENDPOINTS.ROLES, payload)
      return response.data
    } catch (error) {
      console.error('Error creating role with modules:', error)
      throw error
    }
  },

  // Create new role with payload structure
  async createRoleWithPayload(payload: CreateRoleWithPayload): Promise<CreateRoleResponse> {
    try {
      console.log('Creating role with payload:', payload);
      const response = await apiClient.post<CreateRoleResponse>(ENDPOINTS.ROLES, payload);
      return response.data;
    } catch (error) {
      console.error('Error creating role with payload:', error);
      throw error;
    }
  },

  // Update existing role
  async updateRole(id: number, payload: UpdateRolePayload): Promise<CreateRoleResponse> {
    try {
      const response = await apiClient.patch<CreateRoleResponse>(`${ENDPOINTS.ROLES.replace('.json', '')}/${id}.json`, payload)
      return response.data
    } catch (error) {
      console.error('Error updating role:', error)
      throw error
    }
  },

  // Delete role
  async deleteRole(id: number): Promise<void> {
    try {
      await apiClient.delete(`${ENDPOINTS.ROLES.replace('.json', '')}/${id}.json`)
    } catch (error) {
      console.error('Error deleting role:', error)
      throw error
    }
  },

  // Fetch all modules with functions and sub-functions
  async fetchModules(): Promise<LockModule[]> {
    try {
      console.log('Fetching modules from:', ENDPOINTS.MODULES)
      const response = await apiClient.get<ApiModule[]>(ENDPOINTS.MODULES)
      console.log('Raw modules response:', response.data)
      
      // Transform API response to frontend structure
      if (Array.isArray(response.data)) {
        return response.data.map(apiModule => ({
          id: apiModule.id,
          module_id: apiModule.id,
          name: apiModule.name || apiModule.show_name || 'Unknown Module',
          enabled: apiModule.enabled ?? false,
          functions: (apiModule.lock_functions || []).map(apiFunction => ({
            id: apiFunction.id,
            function_id: apiFunction.id,
            function_name: apiFunction.name,
            enabled: apiFunction.enabled ?? false,
            sub_functions: (apiFunction.lock_sub_functions || []).map(apiSubFunction => ({
              id: apiSubFunction.id,
              sub_function_id: apiSubFunction.id,
              sub_function_name: apiSubFunction.sub_function_name || apiSubFunction.name,
              enabled: apiSubFunction.enabled ?? false
            }))
          }))
        }))
      }
      
      return []
    } catch (error) {
      console.error('Error fetching modules:', error)
      
      // Return mock data for testing
      console.warn('Returning mock modules data for testing...')
      return [
        {
          id: 1,
          module_id: 1,
          name: 'User Management',
          enabled: false,
          functions: [
            {
              id: 1,
              function_id: 1,
              function_name: 'User Operations',
              enabled: false,
              sub_functions: [
                {
                  id: 1,
                  sub_function_id: 1,
                  sub_function_name: 'Create User',
                  enabled: false
                },
                {
                  id: 2,
                  sub_function_id: 2,
                  sub_function_name: 'Edit User',
                  enabled: false
                },
                {
                  id: 3,
                  sub_function_id: 3,
                  sub_function_name: 'Delete User',
                  enabled: false
                }
              ]
            }
          ]
        },
        {
          id: 2,
          module_id: 2,
          name: 'Asset Management',
          enabled: false,
          functions: [
            {
              id: 2,
              function_id: 2,
              function_name: 'Asset Operations',
              enabled: false,
              sub_functions: [
                {
                  id: 4,
                  sub_function_id: 4,
                  sub_function_name: 'Add Asset',
                  enabled: false
                },
                {
                  id: 5,
                  sub_function_id: 5,
                  sub_function_name: 'View Assets',
                  enabled: false
                },
                {
                  id: 6,
                  sub_function_id: 6,
                  sub_function_name: 'Edit Asset',
                  enabled: false
                }
              ]
            }
          ]
        },
        {
          id: 3,
          module_id: 3,
          name: 'Ticket Management',
          enabled: false,
          functions: [
            {
              id: 3,
              function_id: 3,
              function_name: 'Ticket Operations',
              enabled: false,
              sub_functions: [
                {
                  id: 7,
                  sub_function_id: 7,
                  sub_function_name: 'Create Ticket',
                  enabled: false
                },
                {
                  id: 8,
                  sub_function_id: 8,
                  sub_function_name: 'Assign Ticket',
                  enabled: false
                },
                {
                  id: 9,
                  sub_function_id: 9,
                  sub_function_name: 'Close Ticket',
                  enabled: false
                }
              ]
            }
          ]
        }
      ]
    }
  },

  // Fetch roles with their associated modules
  async fetchRolesWithModules(): Promise<RoleWithModules[]> {
    try {
      console.log('Fetching roles with modules from:', ENDPOINTS.ROLES_WITH_MODULES)
      const response = await apiClient.get<ApiRolesWithModulesResponse>(ENDPOINTS.ROLES_WITH_MODULES)
      console.log('Raw roles with modules response:', response.data)
      
      // Also fetch regular roles to get the role IDs
      console.log('Fetching regular roles for ID mapping...')
      const rolesResponse = await apiClient.get<ApiRole[]>(ENDPOINTS.ROLES)
      console.log('Regular roles response:', rolesResponse.data)
      
      // Transform the API response to match frontend structure
      return this.transformApiResponseToRoleWithModules(response.data, rolesResponse.data)
    } catch (error) {
      console.error('Error fetching roles with modules:', error)
      
      // Return mock data for testing
      console.warn('Returning mock roles data for testing...')
      const mockRoles: RoleWithModules[] = [
        {
          id: 1,
          role_id: 1,
          role_name: 'Admin Role',
          modules: [
            {
              id: 1,
              module_id: 1,
              name: 'User Management',
              enabled: true,
              functions: [
                {
                  id: 1,
                  function_id: 1,
                  function_name: 'User Operations',
                  enabled: true,
                  sub_functions: [
                    {
                      id: 1,
                      sub_function_id: 1,
                      sub_function_name: 'Create User',
                      enabled: true
                    },
                    {
                      id: 2,
                      sub_function_id: 2,
                      sub_function_name: 'Edit User',
                      enabled: true
                    },
                    {
                      id: 3,
                      sub_function_id: 3,
                      sub_function_name: 'Delete User',
                      enabled: false
                    }
                  ]
                }
              ]
            },
            {
              id: 2,
              module_id: 2,
              name: 'Asset Management',
              enabled: true,
              functions: [
                {
                  id: 2,
                  function_id: 2,
                  function_name: 'Asset Operations',
                  enabled: false,
                  sub_functions: [
                    {
                      id: 4,
                      sub_function_id: 4,
                      sub_function_name: 'Add Asset',
                      enabled: false
                    },
                    {
                      id: 5,
                      sub_function_id: 5,
                      sub_function_name: 'View Assets',
                      enabled: true
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          id: 2,
          role_id: 2,
          role_name: 'Manager Role',
          modules: [
            {
              id: 1,
              module_id: 1,
              name: 'User Management',
              enabled: false,
              functions: [
                {
                  id: 1,
                  function_id: 1,
                  function_name: 'User Operations',
                  enabled: false,
                  sub_functions: [
                    {
                      id: 1,
                      sub_function_id: 1,
                      sub_function_name: 'Create User',
                      enabled: false
                    },
                    {
                      id: 2,
                      sub_function_id: 2,
                      sub_function_name: 'Edit User',
                      enabled: true
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];
      
      console.log('Mock roles data:', mockRoles);
      return mockRoles;
    }
  },

  // Transform API response to frontend structure
  transformApiResponseToRoleWithModules(apiResponse: ApiRolesWithModulesResponse, regularRoles?: ApiRole[]): RoleWithModules[] {
    console.log('transformApiResponseToRoleWithModules - Input:', apiResponse)
    console.log('Regular roles for ID mapping:', regularRoles)
    
    if (!apiResponse || !apiResponse.success || !Array.isArray(apiResponse.data)) {
      console.warn('Invalid API response structure, returning empty array')
      return []
    }

    const transformedRoles = apiResponse.data.map((apiRole, index) => {
      console.log('Processing role:', apiRole)
      
      // Try to find the role_id from regular roles by matching role name
      let roleId = apiRole.role_id;
      if (!roleId && regularRoles) {
        const matchingRole = regularRoles.find(r => r.name === apiRole.role_name);
        roleId = matchingRole?.id;
        console.log('Found matching role ID from regular roles:', { 
          roleName: apiRole.role_name, 
          matchedId: roleId 
        });
      }
      
      // Fallback to index + 1 if still no role_id
      const finalRoleId = roleId || (index + 1);
      
      console.log('Role ID assignment:', { 
        apiRoleId: apiRole.role_id, 
        matchedFromRegular: roleId,
        fallbackId: index + 1, 
        finalRoleId: finalRoleId,
        roleName: apiRole.role_name 
      });
      
      return {
        id: finalRoleId,
        role_id: finalRoleId,
        role_name: apiRole.role_name,
        modules: (apiRole.lock_modules || []).map(apiModule => {
          console.log('Processing module:', apiModule)
          
          return {
            id: apiModule.module_id,
            module_id: apiModule.module_id,
            name: apiModule.module_name,
            enabled: apiModule.module_active === 1,
            functions: (apiModule.lock_functions || []).map(apiFunction => {
              console.log('Processing function:', apiFunction)
              
              return {
                id: apiFunction.function_id,
                function_id: apiFunction.function_id,
                function_name: apiFunction.function_name,
                enabled: apiFunction.function_active === 1,
                sub_functions: (apiFunction.sub_functions || []).map(apiSubFunction => {
                  console.log('Processing sub-function:', apiSubFunction)
                  
                  return {
                    id: apiSubFunction.sub_function_id,
                    sub_function_id: apiSubFunction.sub_function_id,
                    sub_function_name: apiSubFunction.sub_function_display_name || apiSubFunction.sub_function_name,
                    enabled: apiSubFunction.enabled
                  }
                })
              }
            })
          }
        })
      }
    })
    
    console.log('transformApiResponseToRoleWithModules - Output:', transformedRoles)
    return transformedRoles
  },

  // Update role with modules
  async updateRoleWithModules(roleWithModules: RoleWithModules): Promise<void> {
    try {
      // Build permissions_hash from enabled sub-functions
      const permissionsHash: Record<string, Record<string, string>> = {};
      
      roleWithModules.modules.forEach(module => {
        if (module.enabled) {
          module.functions.forEach(func => {
            if (func.enabled) {
              // Use function name as key (like "notices", "banners")
              const functionKey = func.function_name.toLowerCase().replace(/\s+/g, '_');
              permissionsHash[functionKey] = {};
              
              // Check which sub-functions are enabled
              func.sub_functions.forEach(subFunc => {
                if (subFunc.enabled) {
                  // Map sub-function names to standard CRUD operations
                  let actionKey = subFunc.sub_function_name.toLowerCase();
                  
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
                  
                  permissionsHash[functionKey][actionKey] = "true";
                }
              });
              
              // If no sub-functions enabled but function is enabled, add default permissions
              if (Object.keys(permissionsHash[functionKey]).length === 0) {
                permissionsHash[functionKey] = {
                  "all": "true",
                  "create": "true",
                  "show": "true", 
                  "update": "true",
                  "destroy": "true"
                };
              }
            }
          });
        }
      });

      // Get enabled module IDs
      const enabledModuleIds = roleWithModules.modules
        .filter(module => module.enabled)
        .map(module => module.module_id ?? module.id);

      const payload = {
        lock_role: {
          name: roleWithModules.role_name,
          display_name: roleWithModules.role_name,
          access_level: null,
          access_to: null,
          active: 1,
          role_for: "pms"
        },
        permissions_hash: permissionsHash,
        lock_modules: enabledModuleIds
      };

      console.log('Updating role with payload:', payload);
      console.log('Role ID being used:', roleWithModules.role_id);
      console.log('API endpoint:', `${ENDPOINTS.ROLES.replace('.json', '')}/${roleWithModules.role_id}.json`);
      
      await apiClient.patch(`${ENDPOINTS.ROLES.replace('.json', '')}/${roleWithModules.role_id}.json`, payload);
    } catch (error) {
      console.error('Error updating role with modules:', error);
      throw error;
    }
  }
}