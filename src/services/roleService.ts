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
    display_name: string;
    access_level: null;
    access_to: null;
    active: number;
    role_for: string;
  };
  permissions_hash: Record<string, any>;
  lock_modules: null;
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

  // Create new role
  async createRole(payload: CreateRolePayload): Promise<CreateRoleResponse> {
    try {
      const response = await apiClient.post<CreateRoleResponse>(ENDPOINTS.ROLES, payload)
      return response.data
    } catch (error) {
      console.error('Error creating role:', error)
      throw error
    }
  }
}