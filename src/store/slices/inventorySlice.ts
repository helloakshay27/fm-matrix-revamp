import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'

// Types for inventory data
export interface InventoryItem {
  id: number
  name: string
  reference_number: string
  code: string
  serial_number: string
  inventory_type: string
  pms_asset_group: string
  sub_group: string
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
  green_product?: boolean
}

interface InventoryState {
  items: InventoryItem[]
  loading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
  activeCount?: number
  inactiveCount?: number
  greenInventories?: number
  totalInventories?: number
}


const initialState: InventoryState = {
  items: [],
  loading: false,
  error: null,
  totalCount: 0,
  currentPage: 1,
  totalPages: 0
}

// Async thunk for fetching inventory data
// export const fetchInventoryData = createAsyncThunk(
//   'inventory/fetchInventoryData',
//   async (params: { page?: number; filters?: Record<string, any> } = {}) => {
//     const { page = 1, filters = {} } = params

//     // Build query parameters
//     const queryParams = new URLSearchParams({
//       page: page.toString(),
//       ...Object.entries(filters).reduce((acc, [key, value]) => {
//         if (value !== undefined && value !== null && value !== '') {
//           acc[key] = String(value)
//         }
//         return acc
//       }, {} as Record<string, string>)
//     })

//     const response = await apiClient.get(`/pms/inventories.json?${queryParams}`)

//     const inventories = response.data.inventories || []
//     const pageSize = 15
//     const hasMorePages = inventories.length === pageSize

//     // Maintain a dynamic minimum page assumption
//     const estimatedTotalPages = hasMorePages ? page + 1 : page

//     return {
//       ...response.data,
//       pagination: {
//         total_count: hasMorePages ? pageSize * estimatedTotalPages : inventories.length,
//         total_pages: estimatedTotalPages,
//         current_page: page,
//         has_more: hasMorePages
//       }
//     }
//   }
// )

export const fetchInventoryData = createAsyncThunk(
  'inventory/fetchInventoryData',
  async (params: { page?: number; filters?: Record<string, any> } = {}) => {
    const { page = 1, filters = {} } = params

    const queryParams = new URLSearchParams({
      page: page.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value)
        }
        return acc
      }, {} as Record<string, string>)
    })

    const response = await apiClient.get(`/pms/inventories.json?${queryParams}`)

    const inventories = response.data.inventories || []
    const pageSize = 15
    const hasMorePages = inventories.length === pageSize

    const estimatedTotalPages = hasMorePages ? page + 1 : page

    return {
      ...response.data, // include full API response: inventories, counts, etc.
      pagination: {
        total_count: hasMorePages ? pageSize * estimatedTotalPages : response.data.total || inventories.length,
        total_pages: estimatedTotalPages,
        current_page: page,
        has_more: hasMorePages
      }
    }
  }
)


const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInventoryData.fulfilled, (state, action) => {
        state.loading = false

        state.items = action.payload.inventories || []

        const pagination = action.payload.pagination

        state.totalCount = pagination?.total_count || 0
        state.currentPage = pagination?.current_page || 1
        state.totalPages = pagination?.total_pages || 0

        // ✅ Add these:
        state.activeCount = action.payload.active_count
        state.inactiveCount = action.payload.inactive_count
        state.greenInventories = action.payload.green_product_count
        state.totalInventories = action.payload.total_count
      })
      .addCase(fetchInventoryData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch inventory data'
      })
  }
})

export const { clearError, setCurrentPage } = inventorySlice.actions
export const inventoryReducer = inventorySlice.reducer