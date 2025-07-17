import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'
import { EscalationMatrixPayload } from '@/types/escalationMatrix'

interface ResponseEscalationState {
  loading: boolean
  error: string | null
  success: boolean
}

const initialState: ResponseEscalationState = {
  loading: false,
  error: null,
  success: false,
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
  },
})

export const { clearState } = responseEscalationSlice.actions
export default responseEscalationSlice.reducer