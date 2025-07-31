import { createAsyncThunk } from '@reduxjs/toolkit'
import createApiSlice from '../api/apiSlice'
import { apiClient } from '@/utils/apiClient'
import { ENDPOINTS } from '@/config/apiConfig'
import axios from 'axios';

// Define the FM User interface based on API response
export interface FMUser {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  mobile: string;
  email: string;
  company_name: string | null;
  entity_id: number;
  unit_id: number;
  designation: string;
  employee_id: string;
  created_by_id: number;
  lock_user_permission: {
    access_level: string;
  };
  user_type: string;
  lock_user_permission_status: string;
  face_added: boolean;
  app_downloaded: string;
}

export interface FMUserResponse {
  fm_users: FMUser[];
}

// Async thunk for fetching FM users
export const fetchFMUsers = createAsyncThunk(
  'fmUsers/fetchFMUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(ENDPOINTS.FM_USERS)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch FM users')
    }
  }
)

export const getFMUsers = createAsyncThunk("getFMUsers", async ({ baseUrl, token, perPage, currentPage }: { baseUrl: string, token: string, perPage: number, currentPage: number }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://${baseUrl}/pms/account_setups/fm_users.json?per_page=${perPage}&page=${currentPage}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch fm users'
    return rejectWithValue(message)
  }
})

export const fetchSuppliers = createAsyncThunk("fetchSuppliers", async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://${baseUrl}/pms/suppliers/get_suppliers.json`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch suppliers'
    return rejectWithValue(message)
  }
})

export const fetchUnits = createAsyncThunk("fetchUnits", async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://${baseUrl}/pms/units.json`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch units'
    return rejectWithValue(message)
  }
})

export const fetchRoles = createAsyncThunk("fetchRoles", async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`https://${baseUrl}/lock_roles.json`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch roles'
    return rejectWithValue(message)
  }
})

export const createFmUser = createAsyncThunk(
  'createFmUser',
  async ({ data, baseUrl, token }: { data: any, baseUrl: string, token: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`https://${baseUrl}/pms/users.json`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create FM user'
      return rejectWithValue(message)
    }
  }
)

// Create the FM users slice
const fmUserSlice = createApiSlice<FMUserResponse>('fmUsers', fetchFMUsers)
const fetchSuppliersSlice = createApiSlice('fetchSuppliers', fetchSuppliers)
const fetchUnitsSlice = createApiSlice('fetchUnits', fetchUnits)
const fetchRolesSlice = createApiSlice('fetchRoles', fetchRoles)
const createFmUserSlice = createApiSlice('createFmUser', createFmUser)
const getFMUsersSlice = createApiSlice('getFMUsers', getFMUsers)

export const fetchSuppliersReducer = fetchSuppliersSlice.reducer
export const fetchUnitsReducer = fetchUnitsSlice.reducer
export const fetchRolesReducer = fetchRolesSlice.reducer
export const createFmUserReducer = createFmUserSlice.reducer
export const getFMUsersReducer = getFMUsersSlice.reducer

export default fmUserSlice.reducer

