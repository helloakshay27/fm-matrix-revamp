import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig';

// Type definitions for Role Config API
export interface RoleConfigItem {
  id: number;
  roleName: string;
  description: string;
  permissions: string[];
  createdOn: string;
  createdBy: string;
  active: boolean;
}

export interface CreateRoleConfigPayload {
  role_config: {
    name: string;
    description: string;
    permissions: string[];
    active: boolean;
  };
}

export interface UpdateRoleConfigPayload {
  role_config: {
    name: string;
    description: string;
    permissions: string[];
    active: boolean;
  };
}

export const roleConfigService = {
  // Fetch all role configurations
  async fetchRoleConfigs(): Promise<RoleConfigItem[]> {
    try {
      const response = await fetch(
        getFullUrl(API_CONFIG.ENDPOINTS.ROLE_CONFIGS),
        {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.role_configs || data || [];
    } catch (error) {
      console.error('Error fetching role configs:', error);
      throw error;
    }
  },

  // Fetch single role configuration
  async fetchRoleConfig(id: number): Promise<RoleConfigItem> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.ROLE_CONFIG_DETAILS}/${id}.json`),
        {
          method: 'GET',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.role_config || data;
    } catch (error) {
      console.error('Error fetching role config:', error);
      throw error;
    }
  },

  // Create new role configuration
  async createRoleConfig(payload: CreateRoleConfigPayload): Promise<RoleConfigItem> {
    try {
      const response = await fetch(
        getFullUrl(API_CONFIG.ENDPOINTS.CREATE_ROLE_CONFIG),
        {
          method: 'POST',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create role configuration');
      }

      const data = await response.json();
      return data.role_config || data;
    } catch (error) {
      console.error('Error creating role config:', error);
      throw error;
    }
  },

  // Update existing role configuration
  async updateRoleConfig(id: number, payload: UpdateRoleConfigPayload): Promise<RoleConfigItem> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.UPDATE_ROLE_CONFIG}/${id}.json`),
        {
          method: 'PATCH',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update role configuration');
      }

      const data = await response.json();
      return data.role_config || data;
    } catch (error) {
      console.error('Error updating role config:', error);
      throw error;
    }
  },

  // Delete role configuration
  async deleteRoleConfig(id: number): Promise<void> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.DELETE_ROLE_CONFIG}/${id}.json`),
        {
          method: 'DELETE',
          headers: {
            'Authorization': getAuthHeader(),
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete role configuration');
      }
    } catch (error) {
      console.error('Error deleting role config:', error);
      throw error;
    }
  }
};
