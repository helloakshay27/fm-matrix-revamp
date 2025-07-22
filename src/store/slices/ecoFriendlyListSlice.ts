import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'

// Types for eco-friendly inventory data
export interface EcoFriendlyInventoryItem {
  id: number
  asset_id: number | null
  name: string
  code: string
  serial_number: string
  quantity: number
  active: boolean
  created_at: string
  updated_at: string
  min_stock_level: string
  reference_number: string | null
  inventory_type: number
  category: string | null
  manufacturer: string | null
  criticality: number
  unit: string | null
  cost: number | null
  max_stock_level: number | null
  min_order_level: string
  hsc_hsn_code: string
}

interface EcoFriendlyListState {
  inventories: EcoFriendlyInventoryItem[]
  loading: boolean
  error: string | null
}

const initialState: EcoFriendlyListState = {
  inventories: [],
  loading: false,
  error: null
}

// Async thunk for fetching eco-friendly list data
export const fetchEcoFriendlyList = createAsyncThunk(
  'ecoFriendlyList/fetchList',
  async () => {
    const response = await apiClient.get('/pms/inventories/ecofriendly_list.json')
    return response.data
  }
)

const ecoFriendlyListSlice = createSlice({
  name: 'ecoFriendlyList',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEcoFriendlyList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchEcoFriendlyList.fulfilled, (state, action) => {
        state.loading = false
        state.inventories = action.payload.inventories || []
      })
      .addCase(fetchEcoFriendlyList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch eco-friendly list'
      })
  }
})

export const { clearError } = ecoFriendlyListSlice.actions
export const ecoFriendlyListReducer = ecoFriendlyListSlice.reducer