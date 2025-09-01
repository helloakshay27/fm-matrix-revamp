import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// Module interfaces
export interface LockModule {
  id?: number;
  name: string;
  abbreviation: string;
  active: boolean;
  phase_id?: number;
  show_name: string;
  module_type?: string;
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
  lock_functions?: LockFunction[];
}

export interface LockFunction {
  id?: number;
  lock_controller_id?: number;
  name: string;
  action_name: string;
  active: boolean;
  phase_id?: number;
  module_id: number;
  parent_function?: string;
  created_at?: string;
  updated_at?: string;
  url?: string;
  lock_sub_functions?: LockSubFunction[];
}

export interface LockSubFunction {
  id?: number;
  lock_function_id: number;
  name: string;
  sub_function_name: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  url?: string;
}

// Create payloads
export interface CreateModulePayload {
  lock_module: {
    name: string;
    abbreviation: string;
    active: boolean;
    phase_id?: number;
    show_name: string;
    module_type?: string;
    charged_per?: string;
    no_of_licences?: number;
    min_billing?: number;
    rate?: number;
    max_billing?: number;
    total_billing?: number;
    rate_type?: string;
  };
}

export interface CreateFunctionPayload {
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

export interface CreateSubFunctionPayload {
  lock_sub_function: {
    lock_function_id: number;
    name: string;
    sub_function_name: string;
    active: boolean;
  };
}

// Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ModulesResponse {
  data: LockModule[];
}

export const moduleService = {
  // Modules CRUD
  async fetchModules(): Promise<LockModule[]> {
    try {
      const response = await apiClient.get<ModulesResponse | LockModule[]>(ENDPOINTS.MODULES)
      // Handle both response formats - direct array or wrapped in data property
      const modules = Array.isArray(response.data) ? response.data : (response.data as ModulesResponse).data || []
      return modules
    } catch (error) {
      console.error('Error fetching modules:', error)
      throw error
    }
  },

  async createModule(payload: CreateModulePayload): Promise<ApiResponse<LockModule>> {
    try {
      const response = await apiClient.post<ApiResponse<LockModule>>(ENDPOINTS.CREATE_MODULE, payload)
      return response.data
    } catch (error) {
      // console.error('Error creating module:', error)
      throw error
    }
  },

  async updateModule(id: number, payload: Partial<CreateModulePayload>): Promise<ApiResponse<LockModule>> {
    try {
      const response = await apiClient.put<ApiResponse<LockModule>>(`${ENDPOINTS.UPDATE_MODULE}/${id}.json`, payload)
      return response.data
    } catch (error) {
      // console.error('Error updating module:', error)
      throw error
    }
  },

  async deleteModule(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`${ENDPOINTS.DELETE_MODULE}/${id}.json`)
      return response.data
    } catch (error) {
      console.error('Error deleting module:', error)
      throw error
    }
  },

  // Functions CRUD
  async fetchFunctions(): Promise<LockFunction[]> {
    try {
      const response = await apiClient.get<LockFunction[]>(ENDPOINTS.FUNCTIONS)
      return response.data
    } catch (error) {
      console.error('Error fetching functions:', error)
      throw error
    }
  },

  async createFunction(payload: CreateFunctionPayload): Promise<ApiResponse<LockFunction>> {
    try {
      const response = await apiClient.post<ApiResponse<LockFunction>>(ENDPOINTS.CREATE_FUNCTION, payload)
      return response.data
    } catch (error) {
      console.error('Error creating function:', error)
      throw error
    }
  },

  async updateFunction(id: number, payload: Partial<CreateFunctionPayload>): Promise<ApiResponse<LockFunction>> {
    try {
      const response = await apiClient.put<ApiResponse<LockFunction>>(`${ENDPOINTS.UPDATE_FUNCTION}/${id}.json`, payload)
      return response.data
    } catch (error) {
      console.error('Error updating function:', error)
      throw error
    }
  },

  async deleteFunction(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`${ENDPOINTS.DELETE_FUNCTION}/${id}.json`)
      return response.data
    } catch (error) {
      console.error('Error deleting function:', error)
      throw error
    }
  },

  // Sub-Functions CRUD
  async fetchSubFunctions(): Promise<LockSubFunction[]> {
    try {
      const response = await apiClient.get<LockSubFunction[]>(ENDPOINTS.SUB_FUNCTIONS)
      return response.data
    } catch (error) {
      console.error('Error fetching sub functions:', error)
      throw error
    }
  },

  async createSubFunction(payload: CreateSubFunctionPayload): Promise<ApiResponse<LockSubFunction>> {
    try {
      const response = await apiClient.post<ApiResponse<LockSubFunction>>(ENDPOINTS.CREATE_SUB_FUNCTION, payload)
      return response.data
    } catch (error) {
      console.error('Error creating sub function:', error)
      throw error
    }
  },

  async updateSubFunction(id: number, payload: Partial<CreateSubFunctionPayload>): Promise<ApiResponse<LockSubFunction>> {
    try {
      const response = await apiClient.put<ApiResponse<LockSubFunction>>(`${ENDPOINTS.UPDATE_SUB_FUNCTION}/${id}.json`, payload)
      return response.data
    } catch (error) {
      console.error('Error updating sub function:', error)
      throw error
    }
  },

  async deleteSubFunction(id: number): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.delete<ApiResponse<void>>(`${ENDPOINTS.DELETE_SUB_FUNCTION}/${id}.json`)
      return response.data
    } catch (error) {
      console.error('Error deleting sub function:', error)
      throw error
    }
  },
}
