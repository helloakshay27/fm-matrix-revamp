import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'

// Types for asset data
export interface Asset {
  id: number
  name: string
  asset_number: string
  asset_code: string
  serial_number?: string
  pms_asset_group: string
  sub_group: string
  status: string
  site_name: string
  building?: { id: number; name: string }
  wing?: { id: number; name: string }
  area?: { id: number; name: string }
  pms_room?: { id: number; name: string } | null
  asset_type?: boolean
  asset_group?: string; // Ensure this is included
  asset_sub_group?: string;
  purchase_cost?: number;
  current_book_value?: number;
  pms_floor?: { id: number; name: string } | null;
  // Custom fields structure from API
  custom_fields?: Record<string, {
    field_name: string;
    field_value: any;
  }>;
  // Allow any additional custom fields
  [key: string]: any;
}

export interface AssetFilters {
  assetName?: string
  assetId?: string
  extra_fields_field_value_in?: string
  critical_eq?: boolean
  groupId?: string
  subgroupId?: string
  siteId?: string
  buildingId?: string
  wingId?: string
  areaId?: string
  floorId?: string
  roomId?: string
  status_eq?: string
  breakdown_eq?: boolean
  it_asset_eq?: boolean
  allocation_type_eq?: string
  allocation_ids_cont?: string
}

interface AssetsState {
  items: Asset[]
  loading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  filters: AssetFilters
  // Backward compatibility for existing code
  data: Asset[]
  totalValue?: number
  available_custom_fields?: Array<{ key: string; title: string }>
}

const initialState: AssetsState = {
  items: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 0,
  filters: {},
  data: [],
  totalValue: 0,
  available_custom_fields: [],
}

// Async thunk for fetching assets data with filters
export const fetchAssetsData = createAsyncThunk(
  'assets/fetchAssetsData',
  async (params: { page?: number; filters?: AssetFilters } = {}) => {
    const { page = 1, filters = {} } = params

    // Build query parameters for API
    const queryParams = new URLSearchParams({ page: page.toString() })

    // Add filter parameters
    if (filters.assetName) queryParams.append('q[name_cont]', filters.assetName)
    if (filters.assetId) queryParams.append('q[id_eq]', filters.assetId)
    if (filters.extra_fields_field_value_in) {
      const categoryValues = filters.extra_fields_field_value_in.split(',').map(c => c.trim()).filter(Boolean);
      categoryValues.forEach(val => queryParams.append('q[extra_fields_field_value_in][]', val));
    }
    if (filters.critical_eq !== undefined) queryParams.append('q[critical_eq]', filters.critical_eq.toString())
    if (filters.groupId) queryParams.append('q[pms_asset_group_id_eq]', filters.groupId)
    if (filters.subgroupId) queryParams.append('q[pms_asset_sub_group_id_eq]', filters.subgroupId)
    if (filters.siteId) queryParams.append('q[pms_site_id_eq]', filters.siteId)
    if (filters.buildingId) queryParams.append('q[pms_building_id_eq]', filters.buildingId)
    if (filters.wingId) queryParams.append('q[pms_wing_id_eq]', filters.wingId)
    if (filters.areaId) queryParams.append('q[pms_area_id_eq]', filters.areaId)
    if (filters.floorId) queryParams.append('q[pms_floor_id_eq]', filters.floorId)
    if (filters.roomId) queryParams.append('q[pms_room_id_eq]', filters.roomId)
    if (filters.status_eq) queryParams.append('q[status_eq]', filters.status_eq)
    if (filters.breakdown_eq !== undefined) queryParams.append('q[breakdown_eq]', filters.breakdown_eq.toString())
    if (filters.it_asset_eq !== undefined) queryParams.append('q[it_asset_eq]', filters.it_asset_eq.toString())
    if (filters.allocation_type_eq) queryParams.append('q[allocation_type_eq]', filters.allocation_type_eq)
    if (filters.allocation_ids_cont) queryParams.append('q[allocation_ids_cont]', filters.allocation_ids_cont)

    // Use the same endpoint that includes custom fields
    const response = await apiClient.get(`/pms/assets.json/?${queryParams}`)
    console.log('Assets API response:', response.data);
    return { ...response.data, appliedFilters: filters }
  }
)

const assetsSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    },
    setFilters: (state, action: PayloadAction<AssetFilters>) => {
      state.filters = action.payload
    },
    clearFilters: (state) => {
      state.filters = {}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssetsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAssetsData.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload.assets || []
        state.data = action.payload || [] // Backward compatibility
        state.totalCount = action.payload.total_count || 0
        state.currentPage = action.payload.pagination?.current_page || 1
        state.totalPages = action.payload.pagination?.total_pages || 0
        state.totalValue = action.payload.total_value || 0
        state.available_custom_fields = action.payload.available_custom_fields || []
        if (action.payload.appliedFilters) {
          state.filters = action.payload.appliedFilters
        }
      })
      .addCase(fetchAssetsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch assets data'
      })
  }
})

export const { clearError, setCurrentPage, setFilters, clearFilters } = assetsSlice.actions
export const assetsReducer = assetsSlice.reducer
export default assetsReducer