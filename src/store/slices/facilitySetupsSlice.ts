import { createAsyncThunk } from "@reduxjs/toolkit";
import createApiSlice from "../api/apiSlice";
import { apiClient } from "@/utils/apiClient";
import { ENDPOINTS } from "@/config/apiConfig";
import axios from "axios";

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
  "facilitySetups/fetchFacilitySetups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.FACILITY_SETUPS);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch facility setups"
      );
    }
  }
);

export const fetchFacilitySetup = createAsyncThunk("fetchFacilitySetup", async ({ baseUrl, token, id }: { baseUrl: string; token: string; id: number }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://${baseUrl}/pms/admin/facility_setups/${id}.json`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.facility_setup;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch facility setup';
    return rejectWithValue(message);
  }
})

export const fetchActiveFacilities = createAsyncThunk("fetchActiveFacilities", async ({ baseUrl, token }: { baseUrl: string; token: string }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://${baseUrl}/pms/admin/facility_setups.json?q[active_eq]=1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch active facilities';
    return rejectWithValue(message);
  }
})

// Create the facility setups slice
const facilitySetupsSlice = createApiSlice<FacilitySetupsResponse>(
  "facilitySetups",
  fetchFacilitySetups
);
const fetchFacilitySetupSlice = createApiSlice<FacilitySetupsResponse>(
  "fetchFacilitySetup",
  fetchFacilitySetup
);
const fetchActiveFacilitiesSlice = createApiSlice<FacilitySetupsResponse>(
  "fetchActiveFacilities",
  fetchActiveFacilities
);

export default facilitySetupsSlice.reducer;
export const fetchFacilitySetupReducer = fetchFacilitySetupSlice.reducer;
export const fetchActiveFacilitiesReducer = fetchActiveFacilitiesSlice.reducer;
