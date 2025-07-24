import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { ticketManagementAPI } from '@/services/ticketManagementAPI'

export interface Wing {
  id: number;
  name: string;
}

export interface WingsResponse {
  wings: Wing[];
}

// Async thunk for fetching wings
export const fetchWings = createAsyncThunk(
  'wings/fetchWings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketManagementAPI.getWings()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch wings')
    }
  }
)

// Create the wings slice
const wingsSlice = createApiSlice<WingsResponse>('wings', fetchWings)

export default wingsSlice.reducer