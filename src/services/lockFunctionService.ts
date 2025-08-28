import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig';

// Type definitions for Lock Function API
export interface LockFunctionItem {
  id: number;
  functionName: string;
  description: string;
  lockType: 'SYSTEM' | 'USER' | 'ADMIN' | 'TEMPORARY';
  duration: string;
  createdOn: string;
  createdBy: string;
  active: boolean;
  // API response fields
  function_name?: string;
  action_name?: string;
  module_name?: string;
}

export interface CreateLockFunctionPayload {
  lock_function: {
    function_name: string;
    description: string;
    lock_type: string;
    duration: string;
    active: boolean;
  };
}

export interface UpdateLockFunctionPayload {
  lock_function: {
    function_name: string;
    description: string;
    lock_type: string;
    duration: string;
    active: boolean;
  };
}

export const lockFunctionService = {
  // Fetch all lock functions
  async fetchLockFunctions(): Promise<LockFunctionItem[]> {
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
      const functions = data.lock_functions || data || [];
      
      // Transform API response to match UI interface
      return functions.map((func: any) => ({
        id: func.id,
        functionName: func.function_name || func.functionName || '',
        description: func.description || '',
        lockType: func.lock_type || func.lockType || 'SYSTEM',
        duration: func.duration || 'Permanent',
        createdOn: func.created_on || func.createdOn || new Date().toLocaleDateString(),
        createdBy: func.created_by || func.createdBy || 'System',
        active: func.active !== undefined ? func.active : true,
        // Keep original fields for API operations
        function_name: func.function_name,
        action_name: func.action_name,
        module_name: func.module_name,
      }));
    } catch (error) {
      console.error('Error fetching lock functions:', error);
      throw error;
    }
  },

  // Fetch single lock function
  async fetchLockFunction(id: number): Promise<LockFunctionItem> {
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
      const func = data.lock_function || data;
      
      return {
        id: func.id,
        functionName: func.function_name || func.functionName || '',
        description: func.description || '',
        lockType: func.lock_type || func.lockType || 'SYSTEM',
        duration: func.duration || 'Permanent',
        createdOn: func.created_on || func.createdOn || new Date().toLocaleDateString(),
        createdBy: func.created_by || func.createdBy || 'System',
        active: func.active !== undefined ? func.active : true,
        function_name: func.function_name,
        action_name: func.action_name,
        module_name: func.module_name,
      };
    } catch (error) {
      console.error('Error fetching lock function:', error);
      throw error;
    }
  },

  // Create new lock function
  async createLockFunction(payload: CreateLockFunctionPayload): Promise<LockFunctionItem> {
    try {
      const response = await fetch(
        getFullUrl(API_CONFIG.ENDPOINTS.FUNCTIONS.replace('.json', '.json')),
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
      const func = data.lock_function || data;
      
      return {
        id: func.id,
        functionName: func.function_name || '',
        description: func.description || '',
        lockType: func.lock_type || 'SYSTEM',
        duration: func.duration || 'Permanent',
        createdOn: func.created_on || new Date().toLocaleDateString(),
        createdBy: func.created_by || 'Current User',
        active: func.active !== undefined ? func.active : true,
        function_name: func.function_name,
        action_name: func.action_name,
        module_name: func.module_name,
      };
    } catch (error) {
      console.error('Error creating lock function:', error);
      throw error;
    }
  },

  // Update existing lock function
  async updateLockFunction(id: number, payload: UpdateLockFunctionPayload): Promise<LockFunctionItem> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.FUNCTIONS.replace('.json', '')}/${id}.json`),
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
      const func = data.lock_function || data;
      
      return {
        id: func.id,
        functionName: func.function_name || '',
        description: func.description || '',
        lockType: func.lock_type || 'SYSTEM',
        duration: func.duration || 'Permanent',
        createdOn: func.created_on || new Date().toLocaleDateString(),
        createdBy: func.created_by || 'Current User',
        active: func.active !== undefined ? func.active : true,
        function_name: func.function_name,
        action_name: func.action_name,
        module_name: func.module_name,
      };
    } catch (error) {
      console.error('Error updating lock function:', error);
      throw error;
    }
  },

  // Delete lock function
  async deleteLockFunction(id: number): Promise<void> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.FUNCTIONS.replace('.json', '')}/${id}.json`),
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
