import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'

// Types for inventory consumption data
export interface InventoryConsumptionItem {
  id: number
  name: string
  quantity: number
  unit: string | null
  min_stock_level: string
  group: string | null
  sub_group: string | null
  criticality: number
}

interface InventoryConsumptionState {
  inventories: InventoryConsumptionItem[]
  loading: boolean
  error: string | null
}

const initialState: InventoryConsumptionState = {
  inventories: [],
  loading: false,
  error: null
}

// Async thunk for fetching inventory consumption history data
export const fetchInventoryConsumptionHistory = createAsyncThunk(
  'inventoryConsumption/fetchHistory',
  async () => {
    const response = await apiClient.get('/pms/inventories/inventory_consumption_history.json')
    return response.data
  }
)

const inventoryConsumptionSlice = createSlice({
  name: 'inventoryConsumption',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryConsumptionHistory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInventoryConsumptionHistory.fulfilled, (state, action) => {
        state.loading = false
        state.inventories = action.payload.inventories || []
      })
      .addCase(fetchInventoryConsumptionHistory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch inventory consumption history'
      })
  }
})

export const { clearError } = inventoryConsumptionSlice.actions
export const inventoryConsumptionReducer = inventoryConsumptionSlice.reducer