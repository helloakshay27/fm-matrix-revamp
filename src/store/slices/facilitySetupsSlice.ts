import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// Define the Facility interface based on API response
export interface Facility {
  id: number;
  fac_name: string;
  // Add other fields as needed based on actual API response
}

export interface FacilitySetupsResponse {
  facility_setups?: Facility[];
  // Handle different possible response structures
}

// Async thunk for fetching facility setups
export const fetchFacilitySetups = createAsyncThunk(
  'facilitySetups/fetchFacilitySetups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.FACILITY_SETUPS)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch facility setups')
    }
  }
)

// Create the facility setups slice
const facilitySetupsSlice = createApiSlice<FacilitySetupsResponse>('facilitySetups', fetchFacilitySetups)

export default facilitySetupsSlice.reducer