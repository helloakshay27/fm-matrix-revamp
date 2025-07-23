import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { ticketManagementAPI } from '@/services/ticketManagementAPI'

export interface Floor {
  id: number;
  name: string;
}

export interface FloorsResponse {
  floors: Floor[];
}

// Async thunk for fetching floors
export const fetchFloors = createAsyncThunk(
  'floors/fetchFloors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketManagementAPI.getFloors()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch floors')
    }
  }
)

// Create the floors slice
const floorsSlice = createApiSlice<FloorsResponse>('floors', fetchFloors)

export default floorsSlice.reducer