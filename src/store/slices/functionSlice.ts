import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { functionService, FunctionData } from '@/services/functionService'

interface FunctionState {
  functions: FunctionData[]
  loading: boolean
  error: string | null
}

const initialState: FunctionState = {
  functions: [],
  loading: false,
  error: null,
}

export const fetchFunctions = createAsyncThunk(
  'function/fetchFunctions',
  async (_, { rejectWithValue }) => {
    try {
      const functions = await functionService.getFunctions()
      return functions
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch functions')
    }
  }
)

const functionSlice = createSlice({
  name: 'function',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFunctions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchFunctions.fulfilled, (state, action) => {
        state.loading = false
        state.functions = action.payload
      })
      .addCase(fetchFunctions.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const functionReducer = functionSlice.reducer