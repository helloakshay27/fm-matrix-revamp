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

      if (filters.criticality) {
        const critValues = filters.criticality.split(',').map(c => c.trim()).filter(Boolean);
        critValues.forEach(val => params.append('q[criticality_in][]', val));
      }

      if (filters.group) {
        params.append('q[asset_group_id_eq]', filters.group);
      }

      if (filters.subGroup) {
        params.append('q[asset_sub_group_id_eq]', filters.subGroup);
      }

      if (filters.name) {
        const trimmedName = filters.name.trim();
        if (trimmedName) {
          params.append('q[name_cont]', trimmedName);
        }
      }

      const response = await apiClient.get(
        `/pms/inventories/inventory_consumption_history.json?${params.toString()}`
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
      // Use direct JSON endpoint to avoid 302 redirect that triggers unwanted GET without .json
      const response = await axios.post(
        `https://${baseUrl}/pms/inventories/new_inventory_consumption_addition.json`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json'
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

export const createInventoryConsumptionSlice = createApiSlice("createInventoryConsumption", createInventoryConsumption)
export const createInventoryConsumptionReducer = createInventoryConsumptionSlice.reducer;

