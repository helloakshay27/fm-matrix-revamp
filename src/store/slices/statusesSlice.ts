import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

export interface Account {
  id: number
  name: string
  [key: string]: any
}

// Define types for Status
export interface Status {
  id: number
  name: string
  [key: string]: any // Add more fields as per your API response
}

interface StatusState {
  loading: boolean
  error: string | null
  success: boolean
  data: Status[]
  fetchLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  accounts: Account[] 
}

const initialState: StatusState = {
  loading: false,
  error: null,
  success: false,
  data: [],
  fetchLoading: false,
  updateLoading: false,
  deleteLoading: false,
  accounts: [],
}

export const fetchAccounts = createAsyncThunk(
  'complaintModes/fetchAccounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.ACCOUNTS)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch accounts')
    }
  }
)

// GET all statuses
export const fetchStatuses = createAsyncThunk(
  'statuses/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.STATUSES_LIST)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch statuses')
    }
  }
)

// CREATE status
export const createStatus = createAsyncThunk(
  'statuses/create',
  async (payload: Partial<Status>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.STATUSES, payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create status')
    }
  }
)

// UPDATE status
export const updateStatus = createAsyncThunk(
  'statuses/update',
  async ({ id, ...payload }: Status, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${ENDPOINTS.STATUSES_UPDATE.replace('.json', '')}/${id}.json`, payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update status')
    }
  }
)

// DELETE status (assuming delete endpoint is similar to update, adjust if needed)
export const deleteStatus = createAsyncThunk(
  'statuses/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`${ENDPOINTS.STATUSES_LIST.replace('.json', '')}/${id}.json`)
      return { id }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete status')
    }
  }
)

const statusSlice = createSlice({
  name: 'statuses',
  initialState,
  reducers: {
    clearState: (state) => {
      state.loading = false
      state.error = null
      state.success = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatuses.pending, (state) => {
        state.fetchLoading = true
        state.error = null
      })
      .addCase(fetchStatuses.fulfilled, (state, action) => {
        state.fetchLoading = false
        state.data = action.payload
      })
      .addCase(fetchStatuses.rejected, (state, action) => {
        state.fetchLoading = false
        state.error = action.payload as string
      })
      .addCase(createStatus.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createStatus.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.data.push(action.payload)
      })
      .addCase(createStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateStatus.pending, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.updateLoading = false
        state.success = true
        state.data = state.data.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteStatus.pending, (state) => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteStatus.fulfilled, (state, action) => {
        state.deleteLoading = false
        state.data = state.data.filter(item => item.id !== action.payload.id)
      })
      .addCase(deleteStatus.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
              state.accounts = action.payload
            })
            .addCase(fetchAccounts.rejected, (state, action) => {
              state.error = action.payload as string
            })
  },
})

export const { clearState } = statusSlice.actions
export default statusSlice.reducer