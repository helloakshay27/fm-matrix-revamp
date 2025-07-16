import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

export interface Department {
  id?: number;
  department_name: string;
  active: boolean;
}

export interface DepartmentResponse {
  departments: Department[];
}

export const departmentService = {
  // Fetch all departments
  async fetchDepartments(): Promise<Department[]> {
    try {
      const response = await apiClient.get<DepartmentResponse>(ENDPOINTS.DEPARTMENTS)
      return response.data.departments || []
    } catch (error) {
      console.error('Error fetching departments:', error)
      throw error
    }
  },

  // Add new department (using the correct API payload format)
  async addDepartment(departmentName: string): Promise<Department> {
    try {
      const payload = {
        pms_department: {
          department_name: departmentName
        }
      };
      const response = await apiClient.post<Department>(ENDPOINTS.DEPARTMENTS, payload)
      return response.data
    } catch (error) {
      console.error('Error adding department:', error)
      throw error
    }
  },

  // Update department (you can implement this when needed)
  async updateDepartment(id: number, department: Partial<Department>): Promise<Department> {
    try {
      // Implementation will depend on your API
      const response = await apiClient.put<Department>(`${ENDPOINTS.DEPARTMENTS}/${id}`, department)
      return response.data
    } catch (error) {
      console.error('Error updating department:', error)
      throw error
    }
  }
}