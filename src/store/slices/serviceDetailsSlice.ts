import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// Service Details API call
export const fetchServiceDetails = createAsyncThunk(
  'serviceDetails/fetchServiceDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.SERVICE_DETAILS}/${id}.json`)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch service details'
      return rejectWithValue(message)
    }
  }
)

// Create slice using the createApiSlice utility
export const serviceDetailsSlice = createApiSlice('serviceDetails', fetchServiceDetails)

// Export reducer
export const serviceDetailsReducer = serviceDetailsSlice.reducer

// Export the default reducer
export default serviceDetailsReducer