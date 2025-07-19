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
}

interface InventoryState {
  items: InventoryItem[]
  loading: boolean
  error: string | null
  totalCount: number
  currentPage: number
  totalPages: number
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
export const fetchInventoryData = createAsyncThunk(
  'inventory/fetchInventoryData',
  async (params: { page?: number; filters?: Record<string, any> } = {}, { getState }) => {
    const { page = 1, filters = {} } = params
    
    // Build query parameters
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
    
    // Get current state to check if we know the total pages
    const state = getState() as any
    const currentTotalPages = state.inventory.totalPages
    
    let totalPages = currentTotalPages
    
    if (inventories.length === 0 && page > 1) {
      // If we get no data on a page > 1, the previous page was the last one
      totalPages = page - 1
    } else if (inventories.length < pageSize) {
      // If we get less than a full page, this is the last page
      totalPages = page
    } else if (inventories.length === pageSize) {
      // If we get a full page, there might be more pages
      totalPages = Math.max(currentTotalPages, page + 1)
    }
    
    return {
      ...response.data,
      pagination: {
        total_count: totalPages * pageSize, // Estimate total count
        total_pages: totalPages,
        current_page: page,
        has_data: inventories.length > 0
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
        console.log('API Response:', action.payload)
        
        // Extract inventory data
        state.items = action.payload.inventories || []
        
        // Use the pagination data we generated in the thunk
        const pagination = action.payload.pagination
        
        state.totalCount = pagination?.total_count || 0
        state.currentPage = pagination?.current_page || 1
        state.totalPages = pagination?.total_pages || 0
                           
        console.log('Pagination extracted:', {
          totalCount: state.totalCount,
          currentPage: state.currentPage,
          totalPages: state.totalPages,
          itemsLength: state.items.length,
          hasMore: pagination?.has_more
        })
      })
      .addCase(fetchInventoryData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch inventory data'
      })
  }
})

export const { clearError, setCurrentPage } = inventorySlice.actions
export const inventoryReducer = inventorySlice.reducer