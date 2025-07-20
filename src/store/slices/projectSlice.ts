
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'
import { saveSelectedCompany, getSelectedCompany } from '@/utils/auth'

export interface Company {
  id: number
  name: string
}

export interface ProjectState {
  companies: Company[]
  selectedCompany: Company | null
  loading: boolean
  error: string | null
}

const initialState: ProjectState = {
  companies: [],
  selectedCompany: getSelectedCompany(), // Load from localStorage on initialization
  loading: false,
  error: null,
}

// Async thunks
export const fetchAllowedCompanies = createAsyncThunk(
  'project/fetchAllowedCompanies',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.ALLOWED_COMPANIES)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch companies')
    }
  }
)

export const changeCompany = createAsyncThunk(
  'project/changeCompany',
  async (companyId: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.CHANGE_COMPANY}?company_id=${companyId}`)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to change company')
    }
  }
)

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSelectedCompany: (state, action: PayloadAction<Company>) => {
      state.selectedCompany = action.payload
      // Save to localStorage whenever company is selected
      saveSelectedCompany(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch allowed companies
      .addCase(fetchAllowedCompanies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllowedCompanies.fulfilled, (state, action) => {
        state.loading = false
        state.companies = action.payload.companies || []
        const selectedCompany = action.payload.selected_company || null
        state.selectedCompany = selectedCompany
        // Save to localStorage
        if (selectedCompany) {
          saveSelectedCompany(selectedCompany)
        }
      })
      .addCase(fetchAllowedCompanies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // Change company
      .addCase(changeCompany.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(changeCompany.fulfilled, (state, action) => {
        state.loading = false
        // Update selected company from the response
        if (action.payload.user?.company_id) {
          const selectedId = action.payload.user.company_id
          const selectedCompany = state.companies.find(c => c.id === selectedId)
          if (selectedCompany) {
            state.selectedCompany = selectedCompany
            // Save to localStorage
            saveSelectedCompany(selectedCompany)
          }
        }
      })
      .addCase(changeCompany.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setSelectedCompany } = projectSlice.actions
export const projectReducer = projectSlice.reducer
export default projectSlice.reducer
