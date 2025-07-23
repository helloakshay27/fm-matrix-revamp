import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { ticketManagementAPI } from '@/services/ticketManagementAPI'

export interface Zone {
  id: number;
  name: string;
}

export interface ZonesResponse {
  zones: Zone[];
}

// Async thunk for fetching zones
export const fetchZones = createAsyncThunk(
  'zones/fetchZones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ticketManagementAPI.getZones()
      return response
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch zones')
    }
  }
)

// Create the zones slice
const zonesSlice = createApiSlice<ZonesResponse>('zones', fetchZones)

export default zonesSlice.reducer