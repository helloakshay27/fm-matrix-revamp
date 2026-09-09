import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types for inventory consumption details
export interface ConsumptionDetail {
  id: number
  date: string
  opening: number
  add_or_consume: number
  closing: number
  consumption_type: string
  comments: string
  consumed_by: string
  // Handover Details captured on Add/Consume. Confirmed shape: building/wing/
  // floor/area nested under `location` as { id, name } (id/name null when
  // not set), `handover_to` as a top-level { id, name }.
  location?: {
    building?: { id: number | null; name: string | null }
    wing?: { id: number | null; name: string | null }
    floor?: { id: number | null; name: string | null }
    area?: { id: number | null; name: string | null }
  }
  handover_to?: { id: number | null; name: string | null }
}

export interface InventoryDetails {
  id: number
  name: string
  quantity: number
}

interface InventoryConsumptionDetailsState {
  inventory: InventoryDetails | null
  consumptions: ConsumptionDetail[]
  loading: boolean
  error: string | null
}

const initialState: InventoryConsumptionDetailsState = {
  inventory: null,
  consumptions: [],
  loading: false,
  error: null
}

// Async thunk for fetching inventory consumption details
export const fetchInventoryConsumptionDetails = createAsyncThunk(
  'inventoryConsumptionDetails/fetch',
  async ({ id, start_date, end_date }: { id: string; start_date: string; end_date: string }) => {
    const baseUrl = localStorage.getItem('baseUrl')
    const token = localStorage.getItem('token')
    if (!baseUrl || !token) throw new Error('Missing baseUrl/token')

    const url = `https://${baseUrl}/pms/inventories/inventory_assets_consumption_details.json?resource_id=${id}&q[start_date]=${start_date}&q[end_date]=${end_date}`
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }
    return await response.json()
  }
)

const inventoryConsumptionDetailsSlice = createSlice({
  name: 'inventoryConsumptionDetails',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearDetails: (state) => {
      state.inventory = null
      state.consumptions = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoryConsumptionDetails.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchInventoryConsumptionDetails.fulfilled, (state, action) => {
        state.loading = false
        state.inventory = action.payload.inventory || null
        state.consumptions = action.payload.consumptions || []
      })
      .addCase(fetchInventoryConsumptionDetails.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch inventory consumption details'
      })
  }
})

export const { clearError, clearDetails } = inventoryConsumptionDetailsSlice.actions
export const inventoryConsumptionDetailsReducer = inventoryConsumptionDetailsSlice.reducer