import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'

// Suppliers API call
export const fetchSuppliersData = createAsyncThunk(
  'suppliers/fetchSuppliersData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/pms/suppliers.json')
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch suppliers data'
      return rejectWithValue(message)
    }
  }
)

// Create slice using the createApiSlice utility
export const suppliersSlice = createApiSlice('suppliers', fetchSuppliersData)

// Export reducer
export const suppliersReducer = suppliersSlice.reducer

// Export the default reducer
export default suppliersReducer