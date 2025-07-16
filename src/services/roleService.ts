import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

export interface ApiRole {
  id: number;
  name: string;
  permissions_hash: string;
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
  }
}