import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'
import { ResolutionEscalationMatrixPayload, ResolutionEscalationGetResponse, UpdateResolutionEscalationPayload, DeleteComplaintWorkerPayload } from '@/types/escalationMatrix'

interface ResolutionEscalationState {
  loading: boolean
  error: string | null
  success: boolean
  data: ResolutionEscalationGetResponse[]
  fetchLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
}

const initialState: ResolutionEscalationState = {
  loading: false,
  error: null,
  success: false,
  data: [],
  fetchLoading: false,
  updateLoading: false,
  deleteLoading: false,
}

// Async thunk for creating resolution escalation
export const createResolutionEscalation = createAsyncThunk(
  'resolutionEscalation/create',
  async (payload: ResolutionEscalationMatrixPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.CREATE_COMPLAINT_WORKER, payload)
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to create resolution escalation'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for fetching resolution escalation rules
export const fetchResolutionEscalations = createAsyncThunk(
  'resolutionEscalation/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.RESOLUTION_ESCALATION)
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to fetch resolution escalation rules'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for updating resolution escalation rule
export const updateResolutionEscalation = createAsyncThunk(
  'resolutionEscalation/update',
  async (payload: UpdateResolutionEscalationPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.UPDATE_COMPLAINT_WORKER, payload)
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to update resolution escalation rule'
      return rejectWithValue(errorMessage)
    }
  }
)

// Async thunk for deleting resolution escalation rule
export const deleteResolutionEscalation = createAsyncThunk(
  'resolutionEscalation/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const payload: DeleteComplaintWorkerPayload = {
        id,
        complaint_worker: {
          assign: 0
        }
      }
      const response = await apiClient.post(ENDPOINTS.DELETE_COMPLAINT_WORKER, payload)
      return { id, ...response.data }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to delete resolution escalation rule'
      return rejectWithValue(errorMessage)
    }
  }
)

// Create the resolution escalation slice
const resolutionEscalationSlice = createSlice({
  name: 'resolutionEscalation',
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
      .addCase(createResolutionEscalation.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createResolutionEscalation.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(createResolutionEscalation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchResolutionEscalations.pending, (state) => {
        state.fetchLoading = true
        state.error = null
      })
      .addCase(fetchResolutionEscalations.fulfilled, (state, action) => {
        state.fetchLoading = false
        state.data = action.payload
      })
      .addCase(fetchResolutionEscalations.rejected, (state, action) => {
        state.fetchLoading = false
        state.error = action.payload as string
      })
      .addCase(updateResolutionEscalation.pending, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateResolutionEscalation.fulfilled, (state, action) => {
        state.updateLoading = false
        state.success = true
      })
      .addCase(updateResolutionEscalation.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteResolutionEscalation.pending, (state) => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteResolutionEscalation.fulfilled, (state, action) => {
        state.deleteLoading = false
        state.data = state.data.filter(item => item.id !== action.payload.id)
      })
      .addCase(deleteResolutionEscalation.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearState } = resolutionEscalationSlice.actions
export default resolutionEscalationSlice.reducer