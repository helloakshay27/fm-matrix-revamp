import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig';

// Type definitions for Lock Function API (matching actual backend structure)
export interface LockFunction {
  id: number;
  lock_controller_id?: number;
  name: string;
  action_name: string;
  active: number;
  phase_id?: number;
  module_id: string;
  parent_function?: string;
  created_at: string;
  updated_at: string;
  url: string;
  lock_sub_functions?: LockSubFunction[];
}

export interface LockSubFunction {
  id: number;
  lock_function_id: number;
  name: string;
  sub_function_name: string;
  active: number;
  created_at: string;
  updated_at: string;
  url: string;
}

export interface CreateLockFunctionPayload {
  lock_function: {
    lock_controller_id?: number;
    name: string;
    action_name: string;
    active: boolean;
    phase_id?: number;
    module_id: number;
    parent_function?: string;
  };
}

export interface UpdateLockFunctionPayload {
  lock_function: {
    lock_controller_id?: number;
    name: string;
    action_name: string;
    active: boolean;
    phase_id?: number;
    module_id: number;
    parent_function?: string;
  };
}

// LockFunctionItem type alias for frontend use
export interface LockFunctionItem extends LockFunction {
  // Frontend display type (alias for better naming in components)
}

export const lockFunctionService = {
  // Fetch all lock functions
  async fetchLockFunctions(): Promise<LockFunction[]> {
    try {
      const response = await fetch(
        getFullUrl(API_CONFIG.ENDPOINTS.FUNCTIONS),
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
      return data.lock_functions || data || [];
    } catch (error) {
      console.error('Error fetching lock functions:', error);
      throw error;
    }
  },

  // Fetch single lock function
  async fetchLockFunction(id: number): Promise<LockFunction> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.FUNCTIONS}/${id}.json`),
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
      return data.lock_function || data;
    } catch (error) {
      console.error('Error fetching lock function:', error);
      throw error;
    }
  },

  // Create new lock function
  async createLockFunction(payload: CreateLockFunctionPayload): Promise<LockFunction> {
    try {
      const response = await fetch(
        getFullUrl(API_CONFIG.ENDPOINTS.CREATE_FUNCTION),
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
        throw new Error(errorData.message || 'Failed to create lock function');
      }

      const data = await response.json();
      return data.lock_function || data;
    } catch (error) {
      console.error('Error creating lock function:', error);
      throw error;
    }
  },

  // Update existing lock function
  async updateLockFunction(id: number, payload: UpdateLockFunctionPayload): Promise<LockFunction> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.UPDATE_FUNCTION}/${id}.json`),
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
        throw new Error(errorData.message || 'Failed to update lock function');
      }

      const data = await response.json();
      return data.lock_function || data;
    } catch (error) {
      console.error('Error updating lock function:', error);
      throw error;
    }
  },

  // Delete lock function
  async deleteLockFunction(id: number): Promise<void> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.DELETE_FUNCTION}/${id}.json`),
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
        throw new Error(errorData.message || 'Failed to delete lock function');
      }
    } catch (error) {
      console.error('Error deleting lock function:', error);
      throw error;
    }
  }
};
