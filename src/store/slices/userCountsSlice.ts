import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

export interface UserCounts {
  total_users: number;
  approved: number;
  pending: number;
  rejected: number;
  app_downloaded_count: number;
}

interface UserCountsState {
  data: UserCounts | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserCountsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchUserCounts = createAsyncThunk(
  'userCounts/fetchUserCounts',
  async () => {
    const response = await axios.get(
      `${API_CONFIG.BASE_URL}/pms/users/user_counts.json?user_type=fm`,
      {
        headers: {
          Authorization: getAuthHeader(),
        },
      }
    );
    return response.data;
  }
);

const userCountsSlice = createSlice({
  name: 'userCounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user counts';
      });
  },
});

export default userCountsSlice.reducer;