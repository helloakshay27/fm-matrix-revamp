import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { ticketManagementAPI } from '@/services/ticketManagementAPI'

export interface Building {
  id: number;
  name: string;
  site_id: string;
}

export interface BuildingsResponse {
  buildings: Building[];
}

// Async thunk for fetching buildings
export const fetchBuildings = createAsyncThunk(
  'buildings/fetchBuildings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketManagementAPI.getBuildings()
      // Handle both array and single building response
      const buildings = Array.isArray(response) ? response : response ? [response] : [];
      return { buildings }
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch buildings')
    }
  }
)

// Create the buildings slice
const buildingsSlice = createApiSlice<BuildingsResponse>('buildings', fetchBuildings)

export default buildingsSlice.reducer