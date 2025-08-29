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
      
      // Transform the API response to match frontend structure
      return this.transformApiResponseToRoleWithModules(response.data)
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
  transformApiResponseToRoleWithModules(apiResponse: ApiRolesWithModulesResponse): RoleWithModules[] {
    console.log('transformApiResponseToRoleWithModules - Input:', apiResponse)
    
    if (!apiResponse || !apiResponse.success || !Array.isArray(apiResponse.data)) {
      console.warn('Invalid API response structure, returning empty array')
      return []
    }

    const transformedRoles = apiResponse.data.map((apiRole, index) => {
      console.log('Processing role:', apiRole)
      
      return {
        id: index + 1, // Generate ID since the API doesn't provide one
        role_id: index + 1, // Generate role_id
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
      const payload = {
        lock_role: {
          name: roleWithModules.role_name
        },
        lock_modules: roleWithModules.modules
      };
      
      await apiClient.patch(`${ENDPOINTS.ROLES.replace('.json', '')}/${roleWithModules.role_id}.json`, payload);
    } catch (error) {
      console.error('Error updating role with modules:', error);
      throw error;
    }
  }
}