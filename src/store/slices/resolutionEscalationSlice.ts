import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'
import { ResolutionEscalationMatrixPayload } from '@/types/escalationMatrix'

export interface ResolutionEscalationResponse {
  id: number;
  society_id: number;
  issue_type_id: number | null;
  category_id: number;
  assign_to: number | null;
  created_at: string;
  updated_at: string;
  assign: any | null;
  esc_type: string;
  of_phase: string;
  of_atype: string;
  cloned_by_id: number | null;
  cloned_at: string | null;
  site_id: number | null;
  issue_related_to: string | null;
}

// Async thunk for creating resolution escalation
export const createResolutionEscalation = createAsyncThunk(
  'resolutionEscalation/createResolutionEscalation',
  async (payload: ResolutionEscalationMatrixPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.CREATE_COMPLAINT_WORKER, payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create resolution escalation')
    }
  }
)

// Create the resolution escalation slice
const resolutionEscalationSlice = createApiSlice<ResolutionEscalationResponse>('resolutionEscalation', createResolutionEscalation)

export default resolutionEscalationSlice.reducer