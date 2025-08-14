import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'

// Types for different inventory analytics responses
export interface ItemsStatusData {
  info_active_items: string
  count_of_active_items: number
  info_inactive_items: string
  count_of_inactive_items: number
  info_critical_items: string
  count_of_critical_items: number
  info_non_critical_items: string
  count_of_non_critical_items: number
}

export interface CategoryWiseData {
  info_active_items: string
  count_of_active_items: number
  info_inactive_items: string
  count_of_inactive_items: number
  info_critical_items: string
  count_of_critical_items: number
  info_non_critical_items: string
  count_of_non_critical_items: number
}

export interface GreenConsumptionItem {
  date: string
  product: string
  unit: string
  opening: number
  addition: number
  consumption: number
  current_stock: number
  cost_per_unit: number
  cost: number
}

export interface GreenConsumptionData {
  success: number
  message: string
  response: GreenConsumptionItem[]
  info: {
    formula: string
    info: string
  }
}

export interface ConsumptionReportGreenData {
  success: number
  message: string
  response: Record<string, number>
  info: {
    formula: string
    info: string
  }
}

export interface NonGreenConsumptionItem {
  date: string
  product: string
  unit: string
  opening: number
  addition: number
  consumption: number
  current_stock: number
  cost_per_unit: number
  cost: number
}

export interface ConsumptionReportNonGreenData {
  success: number
  message: string
  response: NonGreenConsumptionItem[]
  info: {
    formula: string
    info: string
  }
}

export interface StockData {
  Current_Stock: number
  Minimum_Stock: string
}

export interface MinimumStockData {
  success: number
  message: string
  response: Record<string, StockData>[]
  info: {
    formula?: string
    current_stock_info: string
    minimum_stock_info: string
  }
}

interface InventoryAnalyticsState {
  itemsStatus: ItemsStatusData | null
  categoryWise: CategoryWiseData | null
  greenConsumption: GreenConsumptionData | null
  consumptionReportGreen: ConsumptionReportGreenData | null
  consumptionReportNonGreen: ConsumptionReportNonGreenData | null
  minimumStockNonGreen: MinimumStockData | null
  minimumStockGreen: MinimumStockData | null
  loading: boolean
  error: string | null
}

const initialState: InventoryAnalyticsState = {
  itemsStatus: null,
  categoryWise: null,
  greenConsumption: null,
  consumptionReportGreen: null,
  consumptionReportNonGreen: null,
  minimumStockNonGreen: null,
  minimumStockGreen: null,
  loading: false,
  error: null
}

// Async thunks for fetching different inventory analytics
export const fetchItemsStatus = createAsyncThunk(
  'inventoryAnalytics/fetchItemsStatus',
  async (params: { siteId: number; fromDate: string; toDate: string }) => {
    const response = await apiClient.get(
      `/pms/inventories/items_status.json?site_id=${params.siteId}&from_date=${params.fromDate}&to_date=${params.toDate}`
    )
    return response.data
  }
)

export const fetchCategoryWise = createAsyncThunk(
  'inventoryAnalytics/fetchCategoryWise',
  async (params: { siteId: number; fromDate: string; toDate: string }) => {
    const response = await apiClient.get(
      `/pms/inventories/category_wise_items.json?site_id=${params.siteId}&from_date=${params.fromDate}&to_date=${params.toDate}`
    )
    return response.data
  }
)

export const fetchGreenConsumption = createAsyncThunk(
  'inventoryAnalytics/fetchGreenConsumption',
  async (params: { siteId: number; fromDate: string; toDate: string }) => {
    const response = await apiClient.get(
      `/pms/inventories/inventory_consumption_green.json?site_id=${params.siteId}&from_date=${params.fromDate}&to_date=${params.toDate}`
    )
    return response.data
  }
)

export const fetchConsumptionReportGreen = createAsyncThunk(
  'inventoryAnalytics/fetchConsumptionReportGreen',
  async (params: { siteId: number; fromDate: string; toDate: string }) => {
    const response = await apiClient.get(
      `/pms/inventories/consumption_report_green.json?site_id=${params.siteId}&from_date=${params.fromDate}&to_date=${params.toDate}`
    )
    return response.data
  }
)

export const fetchConsumptionReportNonGreen = createAsyncThunk(
  'inventoryAnalytics/fetchConsumptionReportNonGreen',
  async (params: { siteId: number; fromDate: string; toDate: string }) => {
    const response = await apiClient.get(
      `/pms/inventories/consumption_report_non_green.json?site_id=${params.siteId}&from_date=${params.fromDate}&to_date=${params.toDate}`
    )
    return response.data
  }
)

export const fetchMinimumStockNonGreen = createAsyncThunk(
  'inventoryAnalytics/fetchMinimumStockNonGreen',
  async (params: { siteId: number; fromDate: string; toDate: string }) => {
    const response = await apiClient.get(
      `/pms/inventories/current_minimum_stock_non_green.json?site_id=${params.siteId}&from_date=${params.fromDate}&to_date=${params.toDate}`
    )
    return response.data
  }
)

export const fetchMinimumStockGreen = createAsyncThunk(
  'inventoryAnalytics/fetchMinimumStockGreen',
  async (params: { siteId: number; fromDate: string; toDate: string }) => {
    const response = await apiClient.get(
      `/pms/inventories/current_minimum_stock_green.json?site_id=${params.siteId}&from_date=${params.fromDate}&to_date=${params.toDate}`
    )
    return response.data
  }
)

const inventoryAnalyticsSlice = createSlice({
  name: 'inventoryAnalytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearData: (state) => {
      state.itemsStatus = null
      state.categoryWise = null
      state.greenConsumption = null
      state.consumptionReportGreen = null
      state.consumptionReportNonGreen = null
      state.minimumStockNonGreen = null
      state.minimumStockGreen = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Items Status
      .addCase(fetchItemsStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchItemsStatus.fulfilled, (state, action) => {
        state.loading = false
        state.itemsStatus = action.payload
      })
      .addCase(fetchItemsStatus.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch items status'
      })
      // Category Wise
      .addCase(fetchCategoryWise.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCategoryWise.fulfilled, (state, action) => {
        state.loading = false
        state.categoryWise = action.payload
      })
      .addCase(fetchCategoryWise.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch category wise data'
      })
      // Green Consumption
      .addCase(fetchGreenConsumption.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGreenConsumption.fulfilled, (state, action) => {
        state.loading = false
        state.greenConsumption = action.payload
      })
      .addCase(fetchGreenConsumption.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch green consumption data'
      })
      // Consumption Report Green
      .addCase(fetchConsumptionReportGreen.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConsumptionReportGreen.fulfilled, (state, action) => {
        state.loading = false
        state.consumptionReportGreen = action.payload
      })
      .addCase(fetchConsumptionReportGreen.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch consumption report green'
      })
      // Consumption Report Non Green
      .addCase(fetchConsumptionReportNonGreen.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchConsumptionReportNonGreen.fulfilled, (state, action) => {
        state.loading = false
        state.consumptionReportNonGreen = action.payload
      })
      .addCase(fetchConsumptionReportNonGreen.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch consumption report non green'
      })
      // Minimum Stock Non Green
      .addCase(fetchMinimumStockNonGreen.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMinimumStockNonGreen.fulfilled, (state, action) => {
        state.loading = false
        state.minimumStockNonGreen = action.payload
      })
      .addCase(fetchMinimumStockNonGreen.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch minimum stock non green'
      })
      // Minimum Stock Green
      .addCase(fetchMinimumStockGreen.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMinimumStockGreen.fulfilled, (state, action) => {
        state.loading = false
        state.minimumStockGreen = action.payload
      })
      .addCase(fetchMinimumStockGreen.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch minimum stock green'
      })
  }
})

export const { clearError, clearData } = inventoryAnalyticsSlice.actions
export const inventoryAnalyticsReducer = inventoryAnalyticsSlice.reducer