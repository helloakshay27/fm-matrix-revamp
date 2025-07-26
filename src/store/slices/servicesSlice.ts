import { createAsyncThunk } from '@reduxjs/toolkit';
import createApiSlice from '../api/apiSlice';
import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';

// Services API call
export const fetchServicesData = createAsyncThunk(
  'services/fetchServicesData',
  async (
    { active, page, filters = {} }: { active?: boolean; page: number; filters?: any },
    { rejectWithValue }
  ) => {
    try {
      const params: any = { page: page.toString(), 'site_id': localStorage.getItem('siteId') || '2189' };

      if (active !== undefined) {
        params['q[active_eq]'] = active.toString();
      }

      // Add filter parameters
      if (filters.serviceName) {
        params['q[service_name_cont]'] = filters.serviceName;
      }
      if (filters.buildingId) {
        params['q[building_id_eq]'] = filters.buildingId;
      }
      if (filters.areaId) {
        params['q[area_id_eq]'] = filters.areaId;
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