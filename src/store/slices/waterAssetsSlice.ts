import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'

// Types for water asset data
export interface WaterAsset {
  id: number
  name: string
  asset_number: string
  asset_code?: string
  status: string
  equipment_id?: string
  site_name?: string
  building?: string
  wing?: string
  floor?: string
  area?: string
  room?: string
  meter_type?: string
  asset_type?: string
  serial_number?: string
  model_number?: string
  manufacturer?: string
  purchase_cost?: number
  current_book_value?: number
  critical?: boolean
  pms_site_id?: number
  pms_building_id?: number
  pms_wing_id?: number
  pms_area_id?: number
  pms_floor_id?: number
  pms_room_id?: number
  pms_asset_group_id?: number
  pms_asset_sub_group_id?: number
  commisioning_date?: string
  purchased_on?: string
  warranty_expiry?: string
}

export interface WaterAssetFilters {
  assetName?: string
  assetId?: string
  status?: string
  meterType?: string
  assetType?: string
  site?: string
  building?: string
  wing?: string
  area?: string
  floor?: string
  room?: string
}

interface WaterAssetsState {
  items: WaterAsset[]
  loading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  filters: WaterAssetFilters
  stats: {
    total: number
    inUse: number
    breakdown: number
    totalValue: number
  }
}

const initialState: WaterAssetsState = {
  items: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  filters: {},
  stats: {
    total: 0,
    inUse: 0,
    breakdown: 0,
    totalValue: 0,
  }
}

// Async thunk for fetching water assets data with filters
export const fetchWaterAssetsData = createAsyncThunk(
  'waterAssets/fetchWaterAssetsData',
  async (params: { page?: number; filters?: WaterAssetFilters } = {}) => {
    const { page = 1, filters = {} } = params
    
    // Build query parameters for API
    const queryParams = new URLSearchParams({ page: page.toString() })
    
    // Add filter parameters for water assets
    if (filters.assetName) queryParams.append('q[name_cont]', filters.assetName)
    if (filters.assetId) queryParams.append('q[asset_number_cont]', filters.assetId)
    if (filters.status) queryParams.append('q[status_eq]', filters.status)
    if (filters.meterType) queryParams.append('q[meter_type_cont]', filters.meterType)
    if (filters.assetType) queryParams.append('q[asset_type_cont]', filters.assetType)
    if (filters.site) queryParams.append('q[pms_site_id_eq]', filters.site)
    if (filters.building) queryParams.append('q[pms_building_id_eq]', filters.building)
    if (filters.wing) queryParams.append('q[pms_wing_id_eq]', filters.wing)
    if (filters.area) queryParams.append('q[pms_area_id_eq]', filters.area)
    if (filters.floor) queryParams.append('q[pms_floor_id_eq]', filters.floor)
    if (filters.room) queryParams.append('q[pms_room_id_eq]', filters.room)

    // Fetch water assets (filter by water-related meter types or asset types)
    // You can adjust this filter based on your actual data structure
    // Common water asset indicators: meter type contains 'water', 'fresh', 'distribution', etc.
    const waterKeywords = ['water', 'fresh', 'borewell', 'tanker', 'municipal', 'rainwater'];
    const hasWaterFilter = waterKeywords.some(keyword => 
      JSON.stringify(filters).toLowerCase().includes(keyword.toLowerCase())
    );
    
    // Add water-specific filter if no other water-related filter is already applied
    if (!hasWaterFilter) {
      queryParams.append('q[meter_type_or_asset_type_or_name_cont]', 'water');
    }
    
    const response = await apiClient.get(`/pms/assets.json?${queryParams}`)
    
    // Calculate stats from the response
    const assets = response.data.assets || []
    const stats = {
      total: assets.length,
      inUse: assets.filter((asset: WaterAsset) => asset.status?.toLowerCase() === 'in_use' || asset.status?.toLowerCase() === 'in use').length,
      breakdown: assets.filter((asset: WaterAsset) => asset.status?.toLowerCase() === 'breakdown').length,
      totalValue: assets.reduce((sum: number, asset: WaterAsset) => sum + (asset.current_book_value || 0), 0)
    }
    
    return { 
      ...response.data, 
      appliedFilters: filters,
      stats 
    }
  }
)

const waterAssetsSlice = createSlice({
  name: 'waterAssets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setFilters: (state, action: PayloadAction<WaterAssetFilters>) => {
      state.filters = action.payload
    },
    clearFilters: (state) => {
      state.filters = {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWaterAssetsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWaterAssetsData.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.assets || []
        state.totalCount = action.payload.total_count || 0
        state.currentPage = action.payload.pagination?.current_page || 1
        state.totalPages = action.payload.pagination?.total_pages || 0
        state.stats = action.payload.stats || state.stats
        if (action.payload.appliedFilters) {
          state.filters = action.payload.appliedFilters
        }
      })
      .addCase(fetchWaterAssetsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch water assets data'
      })
  }
})

export const { clearError, setCurrentPage, setFilters, clearFilters } = waterAssetsSlice.actions
export const waterAssetsReducer = waterAssetsSlice.reducer
export default waterAssetsReducer
