import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'

// AMC API call
export const fetchAMCData = createAsyncThunk(
  'amc/fetchAMCData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://fm-uat-api.lockated.com/pms/asset_amcs.json', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer BhjBK-S87DQ4GniPUs32IzL1adZU7eImCFB63RDLt9A',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      const message = error?.message || 'Failed to fetch AMC data'
      return rejectWithValue(message)
    }
  }
)

// Create slice using the createApiSlice utility
export const amcSlice = createApiSlice('amc', fetchAMCData)

// Export reducer
export const amcReducer = amcSlice.reducer

// Export the default reducer
export default amcReducer