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
        
        // Helper function to map API keys to function names
        const mapApiKeyToFunctionName = (apiKey: string): string => {
          const mapping: { [key: string]: string } = {
            'pms_notices': 'Broadcast',
            'pms_assets': 'Asset', 
            'pms_services': 'Service',
            'pms_tasks': 'Tasks',
            'pms_complaints': 'Tickets',
            'pms_helpdesk_categories': 'Ticket'
          };
          return mapping[apiKey] || apiKey;
        };

        // Helper function to create permissions from API data
        const createPermissionsFromAPI = (functionNames: string[], apiPermissionsData: any) => {
          return functionNames.map(funcName => {
            let apiPermissions = { all: "false", create: "false", show: "false", update: "false", destroy: "false" };
            
            // First try direct match with function name
            if (apiPermissionsData[funcName]) {
              apiPermissions = apiPermissionsData[funcName];
            } else {
              // Try to find by reverse mapping - look for API key that maps to this function name
              const apiKey = Object.keys(apiPermissionsData).find(key => 
                mapApiKeyToFunctionName(key) === funcName
              );
              if (apiKey) {
                apiPermissions = apiPermissionsData[apiKey];
              }
            }
            
            return {
              name: funcName,
              all: apiPermissions.all === "true",
              add: apiPermissions.create === "true", 
              view: apiPermissions.show === "true",
              edit: apiPermissions.update === "true",
              disable: apiPermissions.destroy === "true"
            };
          });
        };

        // Define function groups
        const allFunctionsNames = ['Broadcast', 'Asset', 'Documents', 'Tickets', 'Supplier', 'Tasks', 'Service', 'Meters', 'AMC', 'Schedule', 'Materials', 'PO', 'WO', 'Report', 'Attendance'];
        const inventoryNames = ['Inventory', 'GRN', 'SRNS', 'Accounts', 'Consumption'];
        const setupNames = ['Account', 'User & Roles', 'Meter Types', 'Asset Groups', 'Ticket'];
        const quickgateNames = ['Visitors', 'R Vehicles', 'G Vehicles', 'Staffs', 'Goods In Out', 'Patrolling'];

        state.roles = action.payload.map((apiRole: ApiRole) => {
          // Parse permissions_hash from API
          let rolePermissionsData = {};
          try {
            const permissionsHashValue = apiRole.permissions_hash;
            const parsedData = JSON.parse(permissionsHashValue);
            rolePermissionsData = parsedData && typeof parsedData === 'object' ? parsedData : {};
          } catch (error) {
            console.error('Error parsing permissions_hash for role:', apiRole.name, error);
            rolePermissionsData = {};
          }

          return {
            id: apiRole.id,
            name: apiRole.name,
            permissions_hash: apiRole.permissions_hash || '',
            permissions: {
              'All Functions': createPermissionsFromAPI(allFunctionsNames, rolePermissionsData),
              'Inventory': createPermissionsFromAPI(inventoryNames, rolePermissionsData),
              'Setup': createPermissionsFromAPI(setupNames, rolePermissionsData),
              'Quickgate': createPermissionsFromAPI(quickgateNames, rolePermissionsData)
            }
          };
        });
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { updateRolePermissions, clearError } = roleSlice.actions
export default roleSlice.reducer