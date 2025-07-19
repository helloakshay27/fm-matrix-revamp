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
    
    // Extract pagination from headers (common API pattern)
    const totalCount = parseInt(response.headers['x-total-count'] || response.headers['total-count'] || '0')
    const totalPages = parseInt(response.headers['x-total-pages'] || response.headers['total-pages'] || '0')
    const currentPage = parseInt(response.headers['x-current-page'] || response.headers['current-page'] || page.toString())
    
    console.log('Response headers:', response.headers)
    console.log('Extracted from headers:', { totalCount, totalPages, currentPage })
    
    return {
      ...response.data,
      pagination: {
        total_count: totalCount,
        total_pages: totalPages,
        current_page: currentPage
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
        
        // Try different possible pagination structures
        const pagination = action.payload.pagination || action.payload.meta || action.payload
        
        state.totalCount = action.payload.total_count || 
                          action.payload.total || 
                          pagination?.total_count || 
                          pagination?.total || 0
                          
        state.currentPage = action.payload.current_page || 
                           action.payload.page || 
                           pagination?.current_page || 
                           pagination?.page || 1
                           
        state.totalPages = action.payload.total_pages || 
                          action.payload.last_page || 
                          pagination?.total_pages || 
                          pagination?.last_page || 
                          Math.ceil(state.totalCount / 10) || 0 // fallback calculation
                          
        console.log('Pagination extracted:', {
          totalCount: state.totalCount,
          currentPage: state.currentPage,
          totalPages: state.totalPages,
          itemsLength: state.items.length,
          rawPagination: pagination
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