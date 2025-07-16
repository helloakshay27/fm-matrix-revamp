import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { roleService, ApiRole } from '@/services/roleService'

interface Permission {
  name: string;
  all: boolean;
  add: boolean;
  view: boolean;
  edit: boolean;
  disable: boolean;
}

interface Role {
  id: number;
  name: string;
  permissions_hash: string;
  permissions: {
    [key: string]: Permission[];
  };
}

interface RoleState {
  roles: Role[]
  loading: boolean
  error: string | null
}

const initialState: RoleState = {
  roles: [],
  loading: false,
  error: null,
}

// Async thunk for fetching roles
export const fetchRoles = createAsyncThunk(
  'role/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      const apiRoles = await roleService.fetchRoles()
      return apiRoles
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch roles'
      return rejectWithValue(message)
    }
  }
)

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    updateRolePermissions: (state, action: PayloadAction<{
      roleId: number;
      tab: string;
      permissions: Permission[];
    }>) => {
      const { roleId, tab, permissions } = action.payload;
      const role = state.roles.find(r => r.id === roleId);
      if (role) {
        role.permissions[tab] = permissions;
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false
        // Convert API roles to internal format with default permissions
        const allFunctionsPermissions: Permission[] = [
          { name: 'Broadcast', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Asset', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Documents', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Tickets', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Supplier', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Tasks', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Service', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Meters', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'AMC', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Schedule', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Materials', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'PO', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'WO', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Report', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Attendance', all: false, add: false, view: false, edit: false, disable: false },
        ];

        const inventoryPermissions: Permission[] = [
          { name: 'Inventory', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'GRN', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'SRNS', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Accounts', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Consumption', all: false, add: false, view: false, edit: false, disable: false },
        ];

        const setupPermissions: Permission[] = [
          { name: 'Account', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'User & Roles', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Meter Types', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Asset Groups', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Ticket', all: false, add: false, view: false, edit: false, disable: false },
        ];

        const quickgatePermissions: Permission[] = [
          { name: 'Visitors', all: true, add: false, view: true, edit: false, disable: false },
          { name: 'R Vehicles', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'G Vehicles', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Staffs', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Goods In Out', all: false, add: false, view: false, edit: false, disable: false },
          { name: 'Patrolling', all: false, add: false, view: false, edit: false, disable: false },
        ];

        state.roles = action.payload.map((apiRole: ApiRole) => ({
          id: apiRole.id,
          name: apiRole.name,
          permissions_hash: apiRole.permissions_hash || '',
          permissions: {
            'All Functions': [...allFunctionsPermissions],
            'Inventory': [...inventoryPermissions],
            'Setup': [...setupPermissions],
            'Quickgate': [...quickgatePermissions]
          }
        }));
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { updateRolePermissions, clearError } = roleSlice.actions
export default roleSlice.reducer