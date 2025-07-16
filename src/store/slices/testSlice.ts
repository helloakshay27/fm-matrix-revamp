import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Dummy API call for testing - NOT integrated in components
export const fetchDummyData = createAsyncThunk(
  'test/fetchDummyData',
  async () => {
    // Simulate API call with delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      id: Math.random().toString(36).substr(2, 9),
      message: 'This is dummy test data',
      timestamp: new Date().toISOString(),
    }
  }
)

interface TestState {
  data: any
  loading: boolean
  error: string | null
}

const initialState: TestState = {
  data: null,
  loading: false,
  error: null,
}

const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    clearTestData: (state) => {
      state.data = null
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDummyData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDummyData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchDummyData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch dummy data'
      })
  },
})

export const { clearTestData } = testSlice.actions
export default testSlice.reducer