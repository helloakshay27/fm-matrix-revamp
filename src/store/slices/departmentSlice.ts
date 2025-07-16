import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

export interface Department {
  department_name: string;
  active: boolean;
}

export interface DepartmentResponse {
  departments: Department[];
}

// Department API call
export const fetchDepartmentData = createAsyncThunk(
  'department/fetchDepartmentData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get<DepartmentResponse>(ENDPOINTS.DEPARTMENTS)
      return response.data.departments || []
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch department data'
      return rejectWithValue(message)
    }
  }
)

// Add department API call
export const addDepartment = createAsyncThunk(
  'department/addDepartment',
  async (department: Omit<Department, 'id'>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post<Department>(ENDPOINTS.DEPARTMENTS, department)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to add department'
      return rejectWithValue(message)
    }
  }
)

// Update department API call
export const updateDepartment = createAsyncThunk(
  'department/updateDepartment',
  async ({ id, department }: { id: number; department: Partial<Department> }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put<Department>(`${ENDPOINTS.DEPARTMENTS}/${id}`, department)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to update department'
      return rejectWithValue(message)
    }
  }
)

// Create slice using the createApiSlice utility
export const departmentSlice = createApiSlice('department', fetchDepartmentData)

// Export reducer
export const departmentReducer = departmentSlice.reducer

// Export the default reducer
export default departmentReducer