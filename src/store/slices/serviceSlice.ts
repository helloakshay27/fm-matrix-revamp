import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/utils/apiClient';

interface ServiceData {
  service_name: string;
  site_id: number | null;
  building_id: number | null;
  wing_id: number | null;
  floor_id: number | null;
  area_id: number | null;
  room_id: number | null;
  active: boolean;
  description: string;
  service_category: string;
  service_group: string;
  service_code: string;
  ext_code: string;
  rate_contract_vendor_code: string;
  pms_asset_sub_group_id: number | null;
  pms_asset_group_id: number | null;
}

interface UpdateServicePayload {
  id: string;
  serviceData: ServiceData | FormData;
}


interface ServiceState {
  loading: boolean;
  error: string | null;
  updatedService: any;
  fetchedService: any;
}

const initialState: ServiceState = {
  loading: false,
  error: null,
  updatedService: null,
  fetchedService: null,
};

// Async thunk for fetching service data
export const fetchService = createAsyncThunk(
  'service/fetchService',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/pms/services/${id}.json`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch service');
    }
  }
);

// Async thunk for updating service data
export const updateService = createAsyncThunk(
  'service/updateService',
  async ({ id, serviceData }: UpdateServicePayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/pms/services/${id}.json`, serviceData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update service');
    }
  }
);


const serviceSlice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetServiceState: (state) => {
      state.updatedService = null;
      state.fetchedService = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch service cases
      .addCase(fetchService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchService.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchedService = action.payload;
        state.error = null;
      })
      .addCase(fetchService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update service cases
      .addCase(updateService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.loading = false;
        state.updatedService = action.payload;
        state.error = null;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, resetServiceState } = serviceSlice.actions;
export default serviceSlice.reducer;