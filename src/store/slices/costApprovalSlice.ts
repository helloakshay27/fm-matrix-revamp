import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'
import { CostApprovalPayload, CostApprovalGetResponse } from '@/types/costApproval'

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

// Async thunk for fetching cost approvals
export const fetchCostApprovals = createAsyncThunk(
  'costApproval/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.COST_APPROVALS)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch cost approvals')
    }
  }
)

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

// Async thunk for deleting cost approval (set active to false)
export const deleteCostApproval = createAsyncThunk(
  'costApproval/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiClient.patch(`/pms/admin/cost_approvals/${id}.json`, {
        cost_approval: { active: false }
      })
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to delete cost approval')
    }
  }
)

interface CostApprovalState {
  rules: CostApprovalGetResponse[];
  createLoading: boolean;
  fetchLoading: boolean;
  deleteLoading: boolean;
  error: string | null;
}

const initialState: CostApprovalState = {
  rules: [],
  createLoading: false,
  fetchLoading: false,
  deleteLoading: false,
  error: null,
}

// Create the cost approval slice
const costApprovalSlice = createSlice({
  name: 'costApproval',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch cost approvals
      .addCase(fetchCostApprovals.pending, (state) => {
        state.fetchLoading = true
        state.error = null
      })
      .addCase(fetchCostApprovals.fulfilled, (state, action) => {
        state.fetchLoading = false
        state.rules = action.payload
      })
      .addCase(fetchCostApprovals.rejected, (state, action) => {
        state.fetchLoading = false
        state.error = action.payload as string
      })
      // Create cost approval
      .addCase(createCostApproval.pending, (state) => {
        state.createLoading = true
        state.error = null
      })
      .addCase(createCostApproval.fulfilled, (state, action) => {
        state.createLoading = false
        // Add the new rule to the existing rules
        state.rules.push(action.payload)
      })
      .addCase(createCostApproval.rejected, (state, action) => {
        state.createLoading = false
        state.error = action.payload as string
      })
      // Delete cost approval
      .addCase(deleteCostApproval.pending, (state) => {
        state.deleteLoading = true
        state.error = null
      })
      .addCase(deleteCostApproval.fulfilled, (state, action) => {
        state.deleteLoading = false
        // Remove the deleted rule from the state
        state.rules = state.rules.filter(rule => rule.id !== action.payload)
      })
      .addCase(deleteCostApproval.rejected, (state, action) => {
        state.deleteLoading = false
        state.error = action.payload as string
      })
  },
})

export default costApprovalSlice.reducer