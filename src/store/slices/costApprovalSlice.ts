import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'
import { CostApprovalPayload } from '@/types/costApproval'

export interface CostApprovalResponse {
  id: number;
  society_id: number;
  issue_type_id: number | null;
  category_id: number | null;
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

// Async thunk for creating cost approval
export const createCostApproval = createAsyncThunk(
  'costApproval/create',
  async (payload: CostApprovalPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(ENDPOINTS.COST_APPROVALS, payload)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create cost approval')
    }
  }
)

// Create the cost approval slice
const costApprovalSlice = createApiSlice<CostApprovalResponse>('costApproval', createCostApproval)

export default costApprovalSlice.reducer