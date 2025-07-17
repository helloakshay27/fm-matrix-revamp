import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// AMC API call
export const fetchAMCData = createAsyncThunk(
  'amc/fetchAMCData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.AMC)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch AMC data'
      return rejectWithValue(message)
    }
  }
)

// Create slice using the createApiSlice utility
export const amcSlice = createApiSlice('amc', fetchAMCData)

// Export reducer
export const amcReducer = amcSlice.reducer

// Export the default reducer
export default amcReducer