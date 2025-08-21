import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "@/utils/apiClient";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

// API type for a single occupant user item from backend
export interface OccupantUserApiResponse {
  id: number;
  company: string;
  firstname: string;
  lastname: string;
  country_code: string;
  mobile: string;
  email: string;
  gender?: string;
  department?: string;
  user_type: string;
  status: string;
  active: boolean;
  employee_id?: string;
  access_level?: string;
  face_added: boolean;
  app_downloaded: string;
  lock_user_permission: {
    status: string;
    employee_id?: string;
    access_level?: string;
  };
}

// API response shape
export interface OccupantUsersResponse {
  occupant_users: OccupantUserApiResponse[];
  current_page: number;
  total_pages: number;
  total_count: number;
}

// Shape after transforming for frontend
export interface OccupantUser {
  id: number;
  company: string;
  name: string;
  mobile: string;
  email: string;
  gender?: string;
  department?: string;
  status: string;
  employeeId?: string;
  accessLevel?: string;
  type: string;
  active: boolean;
  faceRecognition: boolean;
  appDownloaded: string;
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_count: number;
}

interface OccupantUsersState {
  users: OccupantUser[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: OccupantUsersState = {
  users: [],
  pagination: null,
  loading: false,
  error: null,
};

// Async thunk to fetch occupant users
export const fetchOccupantUsers = createAsyncThunk(
  "occupantUsers/fetchOccupantUsers",
  async ({ page, perPage }: { page: number; perPage: number }) => {
    const response = await apiClient.get<OccupantUsersResponse>(
      `/pms/account_setups/occupant_users.json?page=${page}&per_page=${perPage}`
    );

    const transformedUsers: OccupantUser[] =
      response.data.occupant_users.map((user) => ({
        id: user.id,
        company: user.company,
        name: `${user.firstname} ${user.lastname}`,
        mobile: `${user.country_code} ${user.mobile}`,
        email: user.email,
        gender: user.gender,
        department: user.department?.department_name,
        status: user.lock_user_permission.status,
        employeeId: user.lock_user_permission?.employee_id,
        accessLevel: user.lock_user_permission?.access_level,
        type: user.user_type === "pms_occupant_admin" ? "Admin" : "Member",
        active: user.active ? "Yes" : "No",
        faceRecognition: user.face_added ? "Yes" : "No",
        appDownloaded: user.app_downloaded
      }));

    const pagination: Pagination = {
      current_page: response.data.current_page,
      total_pages: response.data.total_pages,
      total_count: response.data.total_count,
    };

    console.log(transformedUsers)

    return { transformedUsers, pagination };
  }
);

export const exportOccupantUsers = createAsyncThunk(
  "exportOccupantUsers",
  async ({ token, baseUrl }: { token: string, baseUrl: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://${baseUrl}/pms/account_setups/export_occupant_users.xlsx`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      })

      return response.data
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to export occupant users";
      return rejectWithValue(message);
    }
  }
)

const occupantUsersSlice = createSlice({
  name: "occupantUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOccupantUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOccupantUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOccupantUsers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch occupant users";
      });
  },
});

const exportOccupantUsersSlice = createApiSlice("exportOccupantUsers", exportOccupantUsers);
export const exportOccupantUsersReducer = exportOccupantUsersSlice.reducer

export const occupantUsersReducer = occupantUsersSlice.reducer;
export default occupantUsersSlice.reducer;
