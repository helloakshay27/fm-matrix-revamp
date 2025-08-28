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
  }
}