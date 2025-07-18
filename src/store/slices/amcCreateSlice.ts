import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

interface AmcCreateState {
  loading: boolean
  success: boolean
  error: string | null
  data: any
}

const initialState: AmcCreateState = {
  loading: false,
  success: false,
  error: null,
  data: null,
}

// Create AMC async thunk
export const createAMC = createAsyncThunk(
  'amcCreate/createAMC',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.AMC, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to create AMC'
      return rejectWithValue(message)
    }
  }
)

const amcCreateSlice = createSlice({
  name: 'amcCreate',
  initialState,
  reducers: {
    resetAmcCreate: (state) => {
      state.loading = false
      state.success = false
      state.error = null
      state.data = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAMC.pending, (state) => {
        state.loading = true
        state.success = false
        state.error = null
      })
      .addCase(createAMC.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        state.error = null
        state.data = action.payload
      })
      .addCase(createAMC.rejected, (state, action) => {
        state.loading = false
        state.success = false
        state.error = action.payload as string
      })
  },
})

export const { resetAmcCreate } = amcCreateSlice.actions
export const amcCreateReducer = amcCreateSlice.reducer
export default amcCreateReducer