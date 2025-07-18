import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// Assets API call
export const fetchAssetsData = createAsyncThunk(
  'assets/fetchAssetsData',
  async (params: { page?: number } = {}, { rejectWithValue }) => {
    try {
      const { page = 1 } = params
      const response = await apiClient.get(`${ENDPOINTS.ASSETS}?page=${page}`)
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch assets data'
      return rejectWithValue(message)
    }
  }
)

// Create slice using the createApiSlice utility
export const assetsSlice = createApiSlice('assets', fetchAssetsData)

// Export reducer
export const assetsReducer = assetsSlice.reducer

// Export the default reducer
export default assetsReducer