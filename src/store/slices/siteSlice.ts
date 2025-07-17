import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

export interface Site {
  id: number
  name: string
  company_id?: number
}

export interface SiteState {
  sites: Site[]
  selectedSite: Site | null
  loading: boolean
  error: string | null
}

const initialState: SiteState = {
  sites: [],
  selectedSite: null,
  loading: false,
  error: null,
}

// Async thunks
export const fetchAllowedSites = createAsyncThunk(
  'site/fetchAllowedSites',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.ALLOWED_SITES}?user_id=${userId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sites')
    }
  }
)

export const changeSite = createAsyncThunk(
  'site/changeSite',
  async (siteId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.CHANGE_SITE}?site_id=${siteId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change site')
    }
  }
)

const siteSlice = createSlice({
  name: 'site',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedSite: (state, action: PayloadAction<Site>) => {
      state.selectedSite = action.payload
    },
    clearSites: (state) => {
      state.sites = []
      state.selectedSite = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch allowed sites
      .addCase(fetchAllowedSites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllowedSites.fulfilled, (state, action) => {
        state.loading = false
        state.sites = action.payload.sites || []
        state.selectedSite = action.payload.selected_site || null
      })
      .addCase(fetchAllowedSites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Change site
      .addCase(changeSite.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changeSite.fulfilled, (state, action) => {
        state.loading = false
        // Update selected site from the response
        const siteData = action.payload
        if (siteData.id && siteData.name) {
          state.selectedSite = { id: siteData.id, name: siteData.name }
        }
      })
      .addCase(changeSite.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setSelectedSite, clearSites } = siteSlice.actions
export const siteReducer = siteSlice.reducer
export default siteSlice.reducer