import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'

// Types for inventory edit data
export interface InventoryEditData {
  id: number
  name: string
  reference_number: string
  code: string
  serial_number: string
  inventory_type: string
  pms_asset_group: string
  pms_asset_group_id: number | null
  sub_group: string
  pms_asset_sub_group_id: number | null
  category: string
  manufacturer: string
  criticality: string
  quantity: number
  active: boolean
  unit: string
  cost: number
  hsc_hsn_code: string
  max_stock_level: number
  min_stock_level: number
  min_order_level: number
  expiry_date?: string
  vendor?: string
  vendor_id?: number | null
  sgst_rate?: number
  cgst_rate?: number
  igst_rate?: number
  tax_applicable?: boolean
  eco_friendly?: boolean
  asset_id?: number | null
}

interface InventoryEditState {
  loading: boolean
  error: string | null
  fetchedInventory: InventoryEditData | null
  updatedInventory: InventoryEditData | null
}

const initialState: InventoryEditState = {
  loading: false,
  error: null,
  fetchedInventory: null,
  updatedInventory: null
}

// Async thunk for fetching single inventory item
export const fetchInventory = createAsyncThunk(
  'inventoryEdit/fetchInventory',
  async (id: string) => {
    const response = await apiClient.get(`/pms/inventories/${id}.json`)
    return response.data
  }
)

// Async thunk for updating inventory item
export const updateInventory = createAsyncThunk(
  'inventoryEdit/updateInventory',
  async ({ id, inventoryData }: { id: string; inventoryData: any }) => {
    const baseUrl = localStorage.getItem('baseUrl');
    const response = await apiClient.put(`https://${baseUrl}/pms/inventories/${id}.json`, {
      pms_inventory: inventoryData
    })
    return response.data
  }
)

const inventoryEditSlice = createSlice({
  name: 'inventoryEdit',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetInventoryState: (state) => {
      state.fetchedInventory = null
      state.updatedInventory = null
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory cases
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false
        state.fetchedInventory = action.payload
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch inventory'
      })
      // Update inventory cases
      .addCase(updateInventory.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateInventory.fulfilled, (state, action) => {
        state.loading = false
        state.updatedInventory = action.payload
      })
      .addCase(updateInventory.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update inventory'
      })
  }
})

export const { clearError, resetInventoryState } = inventoryEditSlice.actions
export const inventoryEditReducer = inventoryEditSlice.reducer
export default inventoryEditReducer