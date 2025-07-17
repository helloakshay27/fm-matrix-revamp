import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'

// Define the occupant user type
export interface OccupantUser {
  id: number
  srNo: number
  company: string
  name: string
  mobile: string
  email: string
  status: string
}

// Define the API response type
interface OccupantUserApiResponse {
  company: string
  firstname: string
  lastname: string
  country_code: string
  mobile: string
  email: string
  lock_user_permission: {
    status: string
  }
}

interface OccupantUsersResponse {
  occupant_users: OccupantUserApiResponse[]
}

interface OccupantUsersState {
  users: OccupantUser[]
  loading: boolean
  error: string | null
}

const initialState: OccupantUsersState = {
  users: [],
  loading: false,
  error: null,
}

// Async thunk to fetch occupant users
export const fetchOccupantUsers = createAsyncThunk(
  'occupantUsers/fetchOccupantUsers',
  async () => {
    const response = await apiClient.get<OccupantUsersResponse>('/pms/account_setups/occupant_users.json')
    
    // Transform the API response to match our UI format
    const transformedUsers: OccupantUser[] = response.data.occupant_users.map((user, index) => ({
      id: index + 1,
      srNo: index + 1,
      company: user.company,
      name: `${user.firstname} ${user.lastname}`,
      mobile: `+${user.country_code} ${user.mobile}`,
      email: user.email,
      status: user.lock_user_permission.status,
    }))
    
    return transformedUsers
  }
)

const occupantUsersSlice = createSlice({
  name: 'occupantUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOccupantUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchOccupantUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchOccupantUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch occupant users'
      })
  },
})

export const occupantUsersReducer = occupantUsersSlice.reducer
export default occupantUsersSlice.reducer