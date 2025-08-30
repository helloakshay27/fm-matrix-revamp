import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig';

// Type definitions for Lock Sub Function API (matching actual backend structure)
export interface LockSubFunction {
  id: number;
  lock_function_id: number;
  name: string;
  sub_function_name: string;
  active: number;
  created_at: string;
  updated_at: string;
  url: string;
  lock_function?: {
    id: number;
    name: string;
    action_name: string;
  };
}

export interface CreateLockSubFunctionPayload {
  lock_sub_function: {
    lock_function_id: number;
    name: string;
    sub_function_name: string;
    active: boolean;
  };
}

export interface UpdateLockSubFunctionPayload {
  lock_sub_function: {
    lock_function_id: number;
    name: string;
    sub_function_name: string;
    active: boolean;
  };
}

// LockSubFunctionItem type alias for frontend use
export interface LockSubFunctionItem extends LockSubFunction {
  // Frontend display type (alias for better naming in components)
}

export const lockSubFunctionService = {
  // Fetch all lock sub functions
  async fetchLockSubFunctions(): Promise<LockSubFunction[]> {
    try {
      const response = await fetch(
        getFullUrl(API_CONFIG.ENDPOINTS.SUB_FUNCTIONS),
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
      return data.lock_sub_functions || data || [];
    } catch (error) {
      console.error('Error fetching lock sub functions:', error);
      throw error;
    }
  },

  // Fetch single lock sub function
  async fetchLockSubFunction(id: number): Promise<LockSubFunction> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.SUB_FUNCTIONS}/${id}.json`),
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
      return data.lock_sub_function || data;
    } catch (error) {
      console.error('Error fetching lock sub function:', error);
      throw error;
    }
  },

  // Create new lock sub function
  async createLockSubFunction(payload: CreateLockSubFunctionPayload): Promise<LockSubFunction> {
    try {
      const response = await fetch(
        getFullUrl(API_CONFIG.ENDPOINTS.CREATE_SUB_FUNCTION),
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
        throw new Error(errorData.message || 'Failed to create lock sub function');
      }

      const data = await response.json();
      return data.lock_sub_function || data;
    } catch (error) {
      console.error('Error creating lock sub function:', error);
      throw error;
    }
  },

  // Update existing lock sub function
  async updateLockSubFunction(id: number, payload: UpdateLockSubFunctionPayload): Promise<LockSubFunction> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.UPDATE_SUB_FUNCTION}/${id}.json`),
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
        throw new Error(errorData.message || 'Failed to update lock sub function');
      }

      const data = await response.json();
      return data.lock_sub_function || data;
    } catch (error) {
      console.error('Error updating lock sub function:', error);
      throw error;
    }
  },

  // Delete lock sub function
  async deleteLockSubFunction(id: number): Promise<void> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.DELETE_SUB_FUNCTION}/${id}.json`),
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
        throw new Error(errorData.message || 'Failed to delete lock sub function');
      }
    } catch (error) {
      console.error('Error deleting lock sub function:', error);
      throw error;
    }
  }
};