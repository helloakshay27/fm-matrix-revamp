import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

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
  selectedCompany: null,
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
        state.selectedCompany = action.payload.selected_company || null
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