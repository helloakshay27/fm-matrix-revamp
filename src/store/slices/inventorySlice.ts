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
  async (params: { page?: number; filters?: Record<string, any> } = {}) => {
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
    
    // Since API doesn't provide pagination metadata, we'll estimate it
    const inventories = response.data.inventories || []
    const pageSize = 15 // Typical page size based on the response
    
    // If we get a full page, assume there might be more pages
    const hasMorePages = inventories.length >= pageSize
    
    // Estimate total pages (we'll use a reasonable default)
    const estimatedTotalPages = hasMorePages ? Math.max(page + 1, 10) : page
    
    return {
      ...response.data,
      pagination: {
        total_count: hasMorePages ? pageSize * estimatedTotalPages : inventories.length,
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