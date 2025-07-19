import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// Define types for Complaint Mode
export interface ComplaintMode {
  id: number
  name: string
  [key: string]: any // Add more fields as per your API response
}

export interface Account {
  id: number
  name: string
  [key: string]: any
}

interface ComplaintModeState {
  loading: boolean
  error: string | null
  success: boolean
  data: ComplaintMode[]
  fetchLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
  accounts: Account[] 
}

const initialState: ComplaintModeState = {
  loading: false,
  error: null,
  success: false,
  data: [],
  fetchLoading: false,
  updateLoading: false,
  deleteLoading: false,
  accounts: [],
};

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

// GET all complaint modes
export const fetchComplaintModes = createAsyncThunk(
  'complaintModes/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.COMPLAINT_MODE_LIST);
      console.log('API response:', response.data); // <-- Add this line
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch complaint modes');
    }
  }
);

// CREATE complaint mode
export const createComplaintMode = createAsyncThunk(
  'complaintModes/create',
  async (payload: Partial<ComplaintMode>, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.COMPLAINT_MODES, payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create complaint mode')
    }
  }
)

// UPDATE complaint mode (PUT/PATCH)
export const updateComplaintMode = createAsyncThunk(
  'complaintModes/update',
  async ({ id, ...payload }: ComplaintMode, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`${ENDPOINTS.COMPLAINT_MODES.replace('.json', '')}/${id}.json`, payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update complaint mode')
    }
  }
)

// DELETE complaint mode
export const deleteComplaintMode = createAsyncThunk(
  'complaintModes/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.delete(`${ENDPOINTS.COMPLAINT_MODES.replace('.json', '')}/${id}.json`)
      return { id }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete complaint mode')
    }
  }
)

const complaintModeSlice = createSlice({
  name: 'complaintModes',
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
      .addCase(fetchComplaintModes.pending, (state) => {
        state.fetchLoading = true
        state.error = null
      })
     .addCase(fetchComplaintModes.fulfilled, (state, action) => {
  state.fetchLoading = false
  state.data = action.payload
})
      .addCase(fetchComplaintModes.rejected, (state, action) => {
        state.fetchLoading = false
        state.error = action.payload as string
      })
      .addCase(createComplaintMode.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createComplaintMode.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.data.push(action.payload)
      })
      .addCase(createComplaintMode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(updateComplaintMode.pending, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateComplaintMode.fulfilled, (state, action) => {
        state.updateLoading = false
        state.success = true
        state.data = state.data.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      })
      .addCase(updateComplaintMode.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteComplaintMode.pending, (state) => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteComplaintMode.fulfilled, (state, action) => {
        state.deleteLoading = false
        state.data = state.data.filter(item => item.id !== action.payload.id)
      })
      .addCase(deleteComplaintMode.rejected, (state, action) => {
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

export const { clearState } = complaintModeSlice.actions
export default complaintModeSlice.reducer