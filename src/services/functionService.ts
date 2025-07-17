import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

export interface FunctionData {
  name: string
  parent_function: string
}

export const functionService = {
  getFunctions: async (): Promise<FunctionData[]> => {
    const response = await apiClient.get(ENDPOINTS.FUNCTIONS)
    return response.data
  }
}