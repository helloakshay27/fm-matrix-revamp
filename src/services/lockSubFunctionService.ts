import { API_CONFIG, getAuthHeader, getFullUrl } from '@/config/apiConfig';

// Type definitions for Lock Sub Function API
export interface LockSubFunctionItem {
  id: number;
  subFunctionName: string;
  parentFunction: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'CRITICAL';
  conditions: string[];
  createdOn: string;
  createdBy: string;
  active: boolean;
  // API response fields
  sub_function_name?: string;
  parent_function_id?: number;
  parent_function_name?: string;
}

export interface CreateLockSubFunctionPayload {
  lock_sub_function: {
    sub_function_name: string;
    parent_function_id: number;
    description: string;
    priority: string;
    conditions: string[];
    active: boolean;
  };
}

export interface UpdateLockSubFunctionPayload {
  lock_sub_function: {
    sub_function_name: string;
    parent_function_id: number;
    description: string;
    priority: string;
    conditions: string[];
    active: boolean;
  };
}

export const lockSubFunctionService = {
  // Fetch all lock sub functions
  async fetchLockSubFunctions(): Promise<LockSubFunctionItem[]> {
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
      const subFunctions = data.lock_sub_functions || data || [];
      
      // Transform API response to match UI interface
      return subFunctions.map((subFunc: any) => ({
        id: subFunc.id,
        subFunctionName: subFunc.sub_function_name || subFunc.subFunctionName || '',
        parentFunction: subFunc.parent_function_name || subFunc.parentFunction || 'Unknown',
        description: subFunc.description || '',
        priority: subFunc.priority || 'MEDIUM',
        conditions: subFunc.conditions || [],
        createdOn: subFunc.created_on || subFunc.createdOn || new Date().toLocaleDateString(),
        createdBy: subFunc.created_by || subFunc.createdBy || 'System',
        active: subFunc.active !== undefined ? subFunc.active : true,
        // Keep original fields for API operations
        sub_function_name: subFunc.sub_function_name,
        parent_function_id: subFunc.parent_function_id,
        parent_function_name: subFunc.parent_function_name,
      }));
    } catch (error) {
      console.error('Error fetching lock sub functions:', error);
      throw error;
    }
  },

  // Fetch single lock sub function
  async fetchLockSubFunction(id: number): Promise<LockSubFunctionItem> {
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
      const subFunc = data.lock_sub_function || data;
      
      return {
        id: subFunc.id,
        subFunctionName: subFunc.sub_function_name || subFunc.subFunctionName || '',
        parentFunction: subFunc.parent_function_name || subFunc.parentFunction || 'Unknown',
        description: subFunc.description || '',
        priority: subFunc.priority || 'MEDIUM',
        conditions: subFunc.conditions || [],
        createdOn: subFunc.created_on || subFunc.createdOn || new Date().toLocaleDateString(),
        createdBy: subFunc.created_by || subFunc.createdBy || 'System',
        active: subFunc.active !== undefined ? subFunc.active : true,
        sub_function_name: subFunc.sub_function_name,
        parent_function_id: subFunc.parent_function_id,
        parent_function_name: subFunc.parent_function_name,
      };
    } catch (error) {
      console.error('Error fetching lock sub function:', error);
      throw error;
    }
  },

  // Create new lock sub function
  async createLockSubFunction(payload: CreateLockSubFunctionPayload): Promise<LockSubFunctionItem> {
    try {
      const response = await fetch(
        getFullUrl(API_CONFIG.ENDPOINTS.SUB_FUNCTIONS.replace('.json', '.json')),
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
      const subFunc = data.lock_sub_function || data;
      
      return {
        id: subFunc.id,
        subFunctionName: subFunc.sub_function_name || '',
        parentFunction: subFunc.parent_function_name || 'Unknown',
        description: subFunc.description || '',
        priority: subFunc.priority || 'MEDIUM',
        conditions: subFunc.conditions || [],
        createdOn: subFunc.created_on || new Date().toLocaleDateString(),
        createdBy: subFunc.created_by || 'Current User',
        active: subFunc.active !== undefined ? subFunc.active : true,
        sub_function_name: subFunc.sub_function_name,
        parent_function_id: subFunc.parent_function_id,
        parent_function_name: subFunc.parent_function_name,
      };
    } catch (error) {
      console.error('Error creating lock sub function:', error);
      throw error;
    }
  },

  // Update existing lock sub function
  async updateLockSubFunction(id: number, payload: UpdateLockSubFunctionPayload): Promise<LockSubFunctionItem> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.SUB_FUNCTIONS.replace('.json', '')}/${id}.json`),
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
      const subFunc = data.lock_sub_function || data;
      
      return {
        id: subFunc.id,
        subFunctionName: subFunc.sub_function_name || '',
        parentFunction: subFunc.parent_function_name || 'Unknown',
        description: subFunc.description || '',
        priority: subFunc.priority || 'MEDIUM',
        conditions: subFunc.conditions || [],
        createdOn: subFunc.created_on || new Date().toLocaleDateString(),
        createdBy: subFunc.created_by || 'Current User',
        active: subFunc.active !== undefined ? subFunc.active : true,
        sub_function_name: subFunc.sub_function_name,
        parent_function_id: subFunc.parent_function_id,
        parent_function_name: subFunc.parent_function_name,
      };
    } catch (error) {
      console.error('Error updating lock sub function:', error);
      throw error;
    }
  },

  // Delete lock sub function
  async deleteLockSubFunction(id: number): Promise<void> {
    try {
      const response = await fetch(
        getFullUrl(`${API_CONFIG.ENDPOINTS.SUB_FUNCTIONS.replace('.json', '')}/${id}.json`),
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
