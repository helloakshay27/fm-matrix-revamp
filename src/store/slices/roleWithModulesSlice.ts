import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { roleService, RoleWithModules } from '@/services/roleService';

interface RoleWithModulesState {
  roles: RoleWithModules[];
  loading: boolean;
  error: string | null;
  updating: boolean;
}

const initialState: RoleWithModulesState = {
  roles: [],
  loading: false,
  error: null,
  updating: false,
};

// Async thunk for fetching roles with modules
export const fetchRolesWithModules = createAsyncThunk(
  'roleWithModules/fetchRolesWithModules',
  async (_, { rejectWithValue }) => {
    try {
      const rolesWithModules = await roleService.fetchRolesWithModules();
      return rolesWithModules;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch roles with modules');
    }
  }
);

const roleWithModulesSlice = createSlice({
  name: 'roleWithModules',
  initialState,
  reducers: {
    setUpdating: (state, action: PayloadAction<boolean>) => {
      state.updating = action.payload;
    },
    updateModuleEnabled: (state, action: PayloadAction<{
      roleId: number;
      moduleId: number;
      enabled: boolean;
    }>) => {
      const { roleId, moduleId, enabled } = action.payload;
      const role = state.roles.find(r => r.role_id === roleId);
      if (role) {
        const module = role.modules.find(m => m.module_id === moduleId);
        if (module) {
          module.enabled = enabled;
        }
      }
    },
    updateFunctionEnabled: (state, action: PayloadAction<{
      roleId: number;
      moduleId: number;
      functionId: number;
      enabled: boolean;
    }>) => {
      const { roleId, moduleId, functionId, enabled } = action.payload;
      const role = state.roles.find(r => r.role_id === roleId);
      if (role) {
        const module = role.modules.find(m => m.module_id === moduleId);
        if (module) {
          const func = module.functions.find(f => f.function_id === functionId);
          if (func) {
            func.enabled = enabled;
          }
        }
      }
    },
    updateSubFunctionEnabled: (state, action: PayloadAction<{
      roleId: number;
      moduleId: number;
      functionId: number;
      subFunctionId: number;
      enabled: boolean;
    }>) => {
      const { roleId, moduleId, functionId, subFunctionId, enabled } = action.payload;
      const role = state.roles.find(r => r.role_id === roleId);
      if (role) {
        const module = role.modules.find(m => m.module_id === moduleId);
        if (module) {
          const func = module.functions.find(f => f.function_id === functionId);
          if (func) {
            const subFunc = func.sub_functions.find(sf => sf.sub_function_id === subFunctionId);
            if (subFunc) {
              subFunc.enabled = enabled;
            }
          }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRolesWithModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolesWithModules.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
        state.error = null;
      })
      .addCase(fetchRolesWithModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setUpdating, 
  updateModuleEnabled, 
  updateFunctionEnabled, 
  updateSubFunctionEnabled 
} = roleWithModulesSlice.actions;

export default roleWithModulesSlice.reducer;
