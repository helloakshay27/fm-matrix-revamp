import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'

// Dummy API call for testing - NOT integrated in components
export const fetchDummyData = createAsyncThunk(
  'test/fetchDummyData',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return {
        id: Math.random().toString(36).substr(2, 9),
        message: 'This is dummy test data',
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      const message = error?.message || 'Failed to fetch dummy data'
      return rejectWithValue(message)
    }
  }
)

// Another dummy API call for testing login pattern
export const login = createAsyncThunk(
  'login',
  async (
    {
      baseUrl,
      email,
      password,
    }: { baseUrl: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      if (email === 'test@example.com' && password === 'password') {
        return {
          user: { id: 1, email, name: 'Test User' },
          token: 'dummy-jwt-token',
          message: 'Login successful'
        }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      const message = error?.message || 'Failed to Login'
      return rejectWithValue(message)
    }
  }
)

// Create slices using the createApiSlice utility
export const testSlice = createApiSlice('test', fetchDummyData)
export const loginSlice = createApiSlice('login', login)

// Export reducers
export const testReducer = testSlice.reducer
export const loginReducer = loginSlice.reducer

// Export the default reducer (for the store)
export default testReducer