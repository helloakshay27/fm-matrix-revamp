import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// Services API call
export const fetchServicesData = createAsyncThunk(
  'services/fetchServicesData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.SERVICES)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch services data'
      return rejectWithValue(message)
    }
  }
)

// Create slice using the createApiSlice utility
export const servicesSlice = createApiSlice('services', fetchServicesData)

// Export reducer
export const servicesReducer = servicesSlice.reducer

// Export the default reducer
export default servicesReducer