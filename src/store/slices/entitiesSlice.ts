import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// Define the Entity interface based on API response
export interface Entity {
  id: number;
  name: string;
  // Add other fields as needed based on actual API response
}

export interface EntitiesResponse {
  entities?: Entity[];
  // Handle different possible response structures
}

// Async thunk for fetching entities
export const fetchEntities = createAsyncThunk(
  'entities/fetchEntities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.ENTITIES)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch entities')
    }
  }
)

// Create the entities slice
const entitiesSlice = createApiSlice<EntitiesResponse>('entities', fetchEntities)

export default entitiesSlice.reducer