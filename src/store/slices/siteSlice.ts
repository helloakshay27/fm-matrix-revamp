
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'
import { saveSelectedSite, getSelectedSite } from '@/utils/auth'

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
  selectedSite: getSelectedSite(), // Load from localStorage on initialization
  loading: false,
  error: null,
}

// Async thunks
export const fetchSites = createAsyncThunk(
  'site/fetchSites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.SITES)
      return response.data.sites || []
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch sites')
    }
  }
)

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
  async (siteId: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.CHANGE_SITE}?site_id=${siteId}`)
      
      // Call allowed_sites API after changing site
      const userId = 87989; // Mock user ID - in real app, this would come from auth state
      const allowedSitesResponse = await apiClient.get(`${ENDPOINTS.ALLOWED_SITES}?user_id=${userId}`)
      
      return {
        ...response.data,
        allowedSitesData: allowedSitesResponse.data
      }
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
      // Save to localStorage whenever site is selected
      saveSelectedSite(action.payload)
    },
    clearSites: (state) => {
      state.sites = []
      state.selectedSite = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sites
      .addCase(fetchSites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSites.fulfilled, (state, action) => {
        state.loading = false
        state.sites = action.payload
      })
      .addCase(fetchSites.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Fetch allowed sites
      .addCase(fetchAllowedSites.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllowedSites.fulfilled, (state, action) => {
        state.loading = false
        state.sites = action.payload.sites || []
        const selectedSite = action.payload.selected_site || null
        state.selectedSite = selectedSite
        
        // Save to localStorage
        if (selectedSite) {
          saveSelectedSite(selectedSite)
        }
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
        
        // Update sites and selected site from allowed_sites response
        if (action.payload.allowedSitesData) {
          state.sites = action.payload.allowedSitesData.sites || []
          const selectedSite = action.payload.allowedSitesData.selected_site || null
          state.selectedSite = selectedSite
          
          // Save to localStorage
          if (selectedSite) {
            saveSelectedSite(selectedSite)
          }
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
