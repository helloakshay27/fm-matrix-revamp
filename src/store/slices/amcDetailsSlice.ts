import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// AMC Details API call
export const fetchAMCDetails = createAsyncThunk(
  'amcDetails/fetchAMCDetails',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.AMC_DETAILS}/${id}.json`)
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch AMC details'
      return rejectWithValue(message)
    }
  }
)

// Create slice using the createApiSlice utility
export const amcDetailsSlice = createApiSlice('amcDetails', fetchAMCDetails)

// Export reducer
export const amcDetailsReducer = amcDetailsSlice.reducer

// Export the default reducer
export default amcDetailsReducer