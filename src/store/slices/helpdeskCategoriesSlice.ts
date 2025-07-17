import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'
import { HelpdeskCategory } from '@/types/escalationMatrix'

export interface HelpdeskCategoriesResponse {
  categories: HelpdeskCategory[];
}

// Async thunk for fetching helpdesk categories
export const fetchHelpdeskCategories = createAsyncThunk(
  'helpdeskCategories/fetchHelpdeskCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.HELPDESK_CATEGORIES)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch helpdesk categories')
    }
  }
)

// Create the helpdesk categories slice
const helpdeskCategoriesSlice = createApiSlice<HelpdeskCategoriesResponse>('helpdeskCategories', fetchHelpdeskCategories)

export default helpdeskCategoriesSlice.reducer