import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

export interface Department {
  id?: number;
  department_name: string;
  name?: string | null;
  active?: boolean;
}

export interface DepartmentResponse {
  departments: Department[];
}

export const departmentService = {
  // Fetch all departments
  async fetchDepartments(): Promise<Department[]> {
    try {
      const response = await apiClient.get<DepartmentResponse>(ENDPOINTS.BUSINESS_COMPASS_DEPARTMENTS)
      const depts = response.data.departments || []
      // Map 'name' to 'department_name' for backward compatibility
      return depts.map(d => ({
        ...d,
        department_name: d.name || d.department_name || "N/A"
      }))
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

  // Update department (using the correct API payload format)
  async updateDepartment(id: number, departmentName: string): Promise<Department> {
    try {
      const payload = {
        pms_department: {
          department_name: departmentName
        }
      };
      const response = await apiClient.put<Department>(`/pms/departments/${id}.json`, payload)
      return response.data
    } catch (error) {
      console.error('Error updating department:', error)
      throw error
    }
  }
}