import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'

interface ExportParams {
  site_id: string;
  from_date: string;
  to_date: string;
  access_token: string;
}

// AMC Export API call
export const exportAMCData = createAsyncThunk(
  'amcExport/exportAMCData',
  async (params: ExportParams, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/pms/asset_amcs/status_of_amcs.json', {
        params: {
          site_id: params.site_id,
          from_date: params.from_date,
          to_date: params.to_date,
          access_token: params.access_token
        },
        responseType: 'blob' // For downloading Excel file
      });
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to export AMC data'
      return rejectWithValue(message)
    }
  }
)

// Create slice using the createApiSlice utility
export const amcExportSlice = createApiSlice('amcExport', exportAMCData)

// Export reducer
export const amcExportReducer = amcExportSlice.reducer

// Export the default reducer
export default amcExportReducer