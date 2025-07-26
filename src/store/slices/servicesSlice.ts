import { createAsyncThunk } from '@reduxjs/toolkit';
import createApiSlice from '../api/apiSlice';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';

// Services API call
export const fetchServicesData = createAsyncThunk(
  'services/fetchServicesData',
  async ({ active, page }: { active?: boolean; page: number }, { rejectWithValue }) => {
    try {
      const params = { page: page.toString() }
      if (active !== undefined) {
        params.active = active.toString();
      }
      console.log('fetchServicesData params:', params);
      const response = await apiClient.get(ENDPOINTS.SERVICES, { params });
      console.log('API response:', response.data); 
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch services data';
      console.error('API error:', error.response?.data || error.message);
      return rejectWithValue(message);
    }
  }
);

// Create slice using the createApiSlice utility
export const servicesSlice = createApiSlice('services', fetchServicesData);

// Export reducer
export const servicesReducer = servicesSlice.reducer;

// Export the default reducer
export default servicesReducer;