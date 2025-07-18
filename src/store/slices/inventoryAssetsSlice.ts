import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'

// Types for inventory asset data
export interface InventoryAsset {
  id: number
  name: string
  asset_number?: string
  asset_code?: string
  serial_number?: string
  status?: string
  // Add other properties as needed based on API response
}

interface InventoryAssetsState {
  assets: InventoryAsset[]
  loading: boolean
  error: string | null
}

const initialState: InventoryAssetsState = {
  assets: [],
  loading: false,
  error: null
}

// Async thunk for fetching inventory assets
export const fetchInventoryAssets = createAsyncThunk(
  'inventoryAssets/fetchInventoryAssets',
  async () => {
    const response = await apiClient.get('/pms/assets/get_assets.json')
    console.log('API Response:', response.data)
    return response.data
  }
)

const inventoryAssetsSlice = createSlice({
  name: 'inventoryAssets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryAssets.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInventoryAssets.fulfilled, (state, action) => {
        state.loading = false
        // API returns array directly, not wrapped in assets property
        state.assets = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchInventoryAssets.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch inventory assets'
      })
  }
})

export const { clearError } = inventoryAssetsSlice.actions
export const inventoryAssetsReducer = inventoryAssetsSlice.reducer
export default inventoryAssetsReducer