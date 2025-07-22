import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import axios from 'axios'
import createApiSlice from '../api/apiSlice'

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

interface InventoryFilterPayload {
  group?: string;
  subGroup?: string;
  criticality?: string;
  name?: string;
}


// Async thunk for fetching inventory consumption history data
export const fetchInventoryConsumptionHistory = createAsyncThunk(
  'inventoryConsumption/fetchHistory',
  async () => {
    const response = await apiClient.get('/pms/inventories/inventory_consumption_history.json')
    return response.data
  }
)

export const fetchInventoryConsumptionHistoryFilter = createAsyncThunk(
  'inventoryConsumption/fetchHistory',
  async (filters: InventoryFilterPayload = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();

      if (filters.group) params.append('group_id', filters.group);
      if (filters.subGroup) params.append('sub_group_id', filters.subGroup);
      if (filters.criticality) params.append('criticality', filters.criticality);
      if (filters.name) params.append('name', filters.name); // only if supported

      const response = await apiClient.get(
        `/pms/inventories/inventory_assets_consumption_details.json?${params.toString()}`
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const createInventoryConsumption = createAsyncThunk(
  'createInventoryConsumption',
  async (
    {
      baseUrl,
      token,
      data,
    }: { baseUrl: string; token: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `https://${baseUrl}/pms/inventories/new_inventory_consumption_addition.json`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Failed to create inventory consumption';
      return rejectWithValue(message);
    }
  }
);

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

export const createInventoryConsumptionSlice = createApiSlice("createInventoryConsumption",createInventoryConsumption )
export const createInventoryConsumptionReducer = createInventoryConsumptionSlice.reducer;

