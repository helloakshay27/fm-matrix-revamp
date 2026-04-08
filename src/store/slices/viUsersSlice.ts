import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Types for API response
export interface ViUserLockPermission {
  id: number;
  assignor_id: number | null;
  lock_role_id: number;
  permissions_hash: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  access_level: string;
  access_to: (string | number)[];
  phases: string | null;
  modules: string[] | null;
  account_id: number;
  user_society_id: number | null;
  user_id: number;
  role_for: string;
  user_type: string;
  status: string;
  deactivated_at: string | null;
  urgency_email_enabled: number;
  daily_pms_report: boolean;
  unit_id: number | null;
  department_id: number;
  status_submitted_by_id: number | null;
  status_submitted_at: string | null;
  employee_id: string | null;
  last_working_date: string | null;
  ownership: string | null;
  source_type: string | null;
  designation: string | null;
  seat_category: number[];
  user_roaster_id: number | null;
  user_shift_id: number | null;
  building_id: string[] | null;
  floor_id: string[] | null;
  shift_margin_applicable: boolean;
  work_type: string | null;
  seat_category_id: number | null;
  seat_detail_id: number | null;
  registration_source: string;
  joining_date: string;
  user_role_id: number | null;
  circle_id: number;
  sap_entity_name: string | null;
  sites_with_entities: string | null;
  web_enabled: boolean;
  department_name: string;
  role_name: string;
  circle_name: string;
}

export interface ViUserLockRole {
  id: number;
  name: string;
  display_name: string | null;
  access_level: string | null;
  access_to: string | null;
  company_id: number;
  active: number;
  created_at: string;
  updated_at: string;
  permissions_hash: string;
  user_id: number | null;
  phases: string | null;
  modules: string[] | null;
  role_for: string;
}

export interface ViUserReportTo {
  id: number | null;
  name: string | null;
  email: string | null;
  mobile: string | null;
}

// VI Role interface
export interface ViRole {
  id: number;
  name: string;
  title: string;
  description: string;
  the_role: Record<string, Record<string, string>>;
  created_at: string;
  updated_at: string;
  resource_type: string;
  resource_id: number;
  active: boolean;
  user_id: number;
  modules: number[];
  create_by: string;
}

export interface ViRolesResponse {
  success: boolean;
  roles: ViRole[];
}

export interface ViUserApiResponse {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  mobile: string | null;
  country_code: string;
  is_admin: boolean;
  company_id: number;
  organization_id: number;
  user_type: string;
  site_id: number;
  role_id: number;
  active: boolean;
  alternate_email1: string | null;
  alternate_email2: string | null;
  alternate_address: string | null;
  department_id: number;
  supplier_id: number | null;
  latitude: number;
  longitude: number;
  is_busy_on_call: boolean;
  is_online: boolean;
  is_available: boolean;
  employee_type: string;
  profile_type: string | null;
  consent_provided: boolean;
  consented_on: string | null;
  kyc_status: string;
  user_title: string | null;
  gender: string | null;
  birth_date: string | null;
  company_cluster_id: number;
  entity_id: number | null;
  blood_group: string | null;
  vendor_code: string | null;
  company_name: string | null;
  created_by_id: number | null;
  ext_company_name: string | null;
  work_location: string;
  created_at: string;
  updated_at: string;
  report_to_id: number | null;
  org_user_id: string;
  spree_api_key: string;
  otp: string | null;
  fullname: string;
  site_name: string;
  user_company_name: string;
  user_organization_name: string;
  organization_list: string;
  cluster_name: string;
  total_milestones_count: number | null;
  completed_milestones_count: number | null;
  open_milestones_count: number | null;
  total_tasks_count: number | null;
  completed_tasks_count: number | null;
  open_tasks_count: number | null;
  lock_role: ViUserLockRole;
  user_other_detail: string | null;
  avatar_url: string | null;
  profile_icon_url: string;
  business_card_url: string;
  lock_user_permission: ViUserLockPermission;
  report_to: ViUserReportTo;
  created_by: ViUserReportTo;
  lmc_manager: ViUserReportTo;
}

export interface ViUsersListResponse {
  users: ViUserApiResponse[];
  pagination: {
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}

// Transformed user for frontend
export interface ViUser {
  id: number;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string | null;
  gender: string | null;
  employeeType: string;
  siteName: string;
  clusterName: string;
  departmentName: string;
  roleName: string;
  circleName: string;
  designation: string | null;
  workLocation: string;
  active: boolean;
  status: string;
  webEnabled: boolean;
  registrationSource: string;
  joiningDate: string;
  createdAt: string;
  updatedAt: string;
  reportTo: ViUserReportTo;
  createdBy: ViUserReportTo;
  lockUserPermissionId: number | null;
  accessLevel: string;
  avatarUrl: string | null;
}

interface ViUsersState {
  users: ViUser[];
  selectedUser: ViUserApiResponse | null;
  pagination: {
    current_page: number;
    total_count: number;
    total_pages: number;
  } | null;
  viRoles: ViRole[];
  rolesLoading: boolean;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
}

const initialState: ViUsersState = {
  users: [],
  selectedUser: null,
  pagination: null,
  viRoles: [],
  rolesLoading: false,
  loading: false,
  detailLoading: false,
  error: null,
};

// Async thunk to fetch Vi Users list
export const fetchViUsers = createAsyncThunk(
  "viUsers/fetchViUsers",
  async (
    {
      page = 1,
      perPage = 10,
      employee_type_cont = "internal",
      web_enabled_eq = true,
      search = "",
    }: {
      page?: number;
      perPage?: number;
      employee_type_cont?: string;
      web_enabled_eq?: boolean;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    if (!baseUrl || !token) {
      return rejectWithValue("Missing authentication credentials");
    }

    try {
      const params = new URLSearchParams();
      params.append("q[employee_type_cont]", employee_type_cont);
      if (web_enabled_eq === true) {
        params.append("q[lock_user_permissions_web_enabled_eq]", "true");
      }

      if (search) {
        params.append("q[email_cont]", search);
      }

      const response = await axios.get<ViUsersListResponse>(
        `https://${baseUrl}/pms/users/company_wise_users.json?page=${page}&per_page=${perPage}&${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Transform the users for frontend
      const transformedUsers: ViUser[] = response.data.users.map((user) => ({
        id: user.id,
        name: user.fullname,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        mobile: user.mobile,
        gender: user.gender,
        employeeType: user.employee_type,
        siteName: user.site_name,
        clusterName: user.cluster_name,
        departmentName: user.lock_user_permission?.department_name || "",
        roleName:
          user.lock_user_permission?.role_name || user.lock_role?.name || "",
        circleName: user.lock_user_permission?.circle_name || "",
        designation: user.lock_user_permission?.designation,
        workLocation: user.work_location,
        active: user.active,
        status: user.lock_user_permission?.status || "pending",
        webEnabled: user.lock_user_permission?.web_enabled || false,
        registrationSource:
          user.lock_user_permission?.registration_source || "",
        joiningDate: user.lock_user_permission?.joining_date || "",
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        reportTo: user.report_to,
        createdBy: user.created_by,
        lockUserPermissionId: user.lock_user_permission?.id || null,
        accessLevel: user.lock_user_permission?.access_level || "",
        avatarUrl: user.avatar_url,
      }));

      return {
        users: transformedUsers,
        pagination: response.data.pagination,
      };
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch Vi Users"
        );
      }
      return rejectWithValue("Failed to fetch Vi Users");
    }
  }
);

// Async thunk to fetch Vi Roles
export const fetchViRoles = createAsyncThunk(
  "viUsers/fetchViRoles",
  async (_, { rejectWithValue }) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    if (!baseUrl || !token) {
      return rejectWithValue("Missing authentication credentials");
    }

    try {
      // Always use /lock_roles.json for role dropdown
      const response = await axios.get(`https://${baseUrl}/lock_roles.json`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Handle different API response structures
      // /roles.json returns { roles: [...] } or array directly
      // /lock_roles.json returns { roles: [...] }
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      return data.roles || data.lock_roles || [];
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch Vi Roles"
        );
      }
      return rejectWithValue("Failed to fetch Vi Roles");
    }
  }
);

// Async thunk to fetch Vi User details
export const fetchViUserDetail = createAsyncThunk(
  "viUsers/fetchViUserDetail",
  async (userId: number, { rejectWithValue }) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    if (!baseUrl || !token) {
      return rejectWithValue("Missing authentication credentials");
    }

    try {
      const response = await axios.get<ViUserApiResponse>(
        `https://${baseUrl}/pms/users/${userId}/user_show.json`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch user details"
        );
      }
      return rejectWithValue("Failed to fetch user details");
    }
  }
);

// Async thunk to update Vi User
export const updateViUser = createAsyncThunk(
  "viUsers/updateViUser",
  async (
    {
      userId,
      roleId,
      lockUserPermissionId,
      password,
      webEnabled,
    }: {
      userId: number;
      roleId?: string;
      lockUserPermissionId?: number;
      password?: string;
      webEnabled?: boolean;
    },
    { rejectWithValue }
  ) => {
    const baseUrl = localStorage.getItem("baseUrl");
    const token = localStorage.getItem("token");

    if (!baseUrl || !token) {
      return rejectWithValue("Missing authentication credentials");
    }

    try {
      const formData = new FormData();

      if (roleId) {
        formData.append("user[role_id]", roleId);
      }

      if (lockUserPermissionId) {
        formData.append(
          "user[lock_user_permissions_attributes][0][id]",
          String(lockUserPermissionId)
        );
      }

      if (password) {
        formData.append("user[password]", password);
      }

      if (webEnabled !== undefined && lockUserPermissionId) {
        formData.append(
          "user[lock_user_permissions_attributes][0][web_enabled]",
          String(webEnabled)
        );
      }

      const response = await axios.put(
        `https://${baseUrl}/pms/users/${userId}/update_vi_user`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to update user"
        );
      }
      return rejectWithValue("Failed to update user");
    }
  }
);

const viUsersSlice = createSlice({
  name: "viUsers",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Vi Users list
      .addCase(fetchViUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchViUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchViUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Vi User detail
      .addCase(fetchViUserDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchViUserDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchViUserDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      })
      // Update Vi User
      .addCase(updateViUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateViUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateViUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Vi Roles
      .addCase(fetchViRoles.pending, (state) => {
        state.rolesLoading = true;
      })
      .addCase(fetchViRoles.fulfilled, (state, action) => {
        state.rolesLoading = false;
        state.viRoles = action.payload;
      })
      .addCase(fetchViRoles.rejected, (state, action) => {
        state.rolesLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedUser, clearError } = viUsersSlice.actions;
export default viUsersSlice.reducer;
