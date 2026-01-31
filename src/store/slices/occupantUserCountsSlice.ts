import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'

interface OccupantUserCountsResponse {
  total_users: number
  approved: number
  pending: number
  rejected: number
  app_downloaded_count: number
}

interface OccupantUserCountsState {
  total: number
  approved: number
  pending: number
  rejected: number
  appDownloaded: number
  loading: boolean
  error: string | null
}

const initialState: OccupantUserCountsState = {
  total: 0,
  approved: 0,
  pending: 0,
  rejected: 0,
  appDownloaded: 0,
  loading: false,
  error: null,
}

// Async thunk to fetch occupant user counts
export const fetchOccupantUserCounts = createAsyncThunk(
  'occupantUserCounts/fetchOccupantUserCounts',
  async (userType?: string) => {
    const params = userType ? `?user_type=${userType}` : '?user_type=occupant';
    const response = await apiClient.get<OccupantUserCountsResponse>(`/pms/users/user_counts.json${params}`)
    return response.data
  }
)

const occupantUserCountsSlice = createSlice({
  name: 'occupantUserCounts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOccupantUserCounts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOccupantUserCounts.fulfilled, (state, action) => {
        state.loading = false
        state.total = action.payload.total_users
        state.approved = action.payload.approved
        state.pending = action.payload.pending
        state.rejected = action.payload.rejected
        state.appDownloaded = action.payload.app_downloaded_count
      })
      .addCase(fetchOccupantUserCounts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch occupant user counts'
      })
  },
})

export const occupantUserCountsReducer = occupantUserCountsSlice.reducer
export default occupantUserCountsSlice.reducer