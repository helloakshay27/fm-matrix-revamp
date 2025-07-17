import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// Define the FM User interface based on API response
export interface FMUser {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  mobile: string;
  email: string;
  company_name: string | null;
  entity_id: number;
  unit_id: number;
  designation: string;
  employee_id: string;
  created_by_id: number;
  lock_user_permission: {
    access_level: string;
  };
  user_type: string;
  lock_user_permission_status: string;
  face_added: boolean;
  app_downloaded: string;
}

export interface FMUserResponse {
  fm_users: FMUser[];
}

// Async thunk for fetching FM users
export const fetchFMUsers = createAsyncThunk(
  'fmUsers/fetchFMUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.FM_USERS)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch FM users')
    }
  }
)

// Create the FM users slice
const fmUserSlice = createApiSlice<FMUserResponse>('fmUsers', fetchFMUsers)

export default fmUserSlice.reducer