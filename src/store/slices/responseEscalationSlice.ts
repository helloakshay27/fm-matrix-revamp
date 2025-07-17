import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'
import { EscalationMatrixPayload, ResponseEscalationGetResponse, UpdateResponseEscalationPayload } from '@/types/escalationMatrix'

interface ResponseEscalationState {
  loading: boolean
  error: string | null
  success: boolean
  data: ResponseEscalationGetResponse[]
  fetchLoading: boolean
  updateLoading: boolean
  deleteLoading: boolean
}

const initialState: ResponseEscalationState = {
  loading: false,
  error: null,
  success: false,
  data: [],
  fetchLoading: false,
  updateLoading: false,
  deleteLoading: false,
}

// Async thunk for creating response escalation rule
export const createResponseEscalation = createAsyncThunk(
  'responseEscalation/create',
  async (payload: EscalationMatrixPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.CREATE_COMPLAINT_WORKER, payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create response escalation rule')
    }
  }
)

// Async thunk for fetching response escalation rules
export const fetchResponseEscalations = createAsyncThunk(
  'responseEscalation/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.RESPONSE_ESCALATION)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch response escalation rules')
    }
  }
)

// Async thunk for updating response escalation rule
export const updateResponseEscalation = createAsyncThunk(
  'responseEscalation/update',
  async (payload: UpdateResponseEscalationPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.UPDATE_COMPLAINT_WORKER, payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update response escalation rule')
    }
  }
)

// Async thunk for deleting response escalation rule
export const deleteResponseEscalation = createAsyncThunk(
  'responseEscalation/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/pms/admin/delete_complaint_worker/${id}.json`)
      return { id, ...response.data }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete response escalation rule')
    }
  }
)

const responseEscalationSlice = createSlice({
  name: 'responseEscalation',
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
      .addCase(createResponseEscalation.pending, (state) => {
        state.loading = true
        state.error = null
        state.success = false
      })
      .addCase(createResponseEscalation.fulfilled, (state) => {
        state.loading = false
        state.success = true
      })
      .addCase(createResponseEscalation.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchResponseEscalations.pending, (state) => {
        state.fetchLoading = true
        state.error = null
      })
      .addCase(fetchResponseEscalations.fulfilled, (state, action) => {
        state.fetchLoading = false
        state.data = action.payload
      })
      .addCase(fetchResponseEscalations.rejected, (state, action) => {
        state.fetchLoading = false
        state.error = action.payload as string
      })
      .addCase(updateResponseEscalation.pending, (state) => {
        state.updateLoading = true
        state.error = null
      })
      .addCase(updateResponseEscalation.fulfilled, (state, action) => {
        state.updateLoading = false
        state.success = true
      })
      .addCase(updateResponseEscalation.rejected, (state, action) => {
        state.updateLoading = false
        state.error = action.payload as string
      })
      .addCase(deleteResponseEscalation.pending, (state) => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteResponseEscalation.fulfilled, (state, action) => {
        state.deleteLoading = false
        state.data = state.data.filter(item => item.id !== action.payload.id)
      })
      .addCase(deleteResponseEscalation.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearState } = responseEscalationSlice.actions
export default responseEscalationSlice.reducer