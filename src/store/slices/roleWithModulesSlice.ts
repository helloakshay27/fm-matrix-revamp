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
      moduleData?: any; // Pass full module data to ensure proper structure
    }>) => {
      const { roleId, moduleId, enabled, moduleData } = action.payload;
      const role = state.roles.find(r => r.role_id === roleId);
      if (role) {
        let module = role.modules.find(m => (m.module_id ?? m.id) === moduleId);
        
        // If module doesn't exist in role, create it with proper structure
        if (!module) {
          module = {
            module_id: moduleId,
            id: moduleId,
            name: moduleData?.name || 'Unknown Module',
            enabled: false,
            functions: []
          };
          role.modules.push(module);
        }
        
        // If moduleData is provided, ensure all functions and sub-functions exist
        if (moduleData && moduleData.functions) {
          moduleData.functions.forEach((funcData: any) => {
            const funcId = funcData.function_id ?? funcData.id;
            let existingFunc = module.functions.find(f => (f.function_id ?? f.id) === funcId);
            
            if (!existingFunc) {
              existingFunc = {
                function_id: funcId,
                id: funcId,
                function_name: funcData.function_name || funcData.name || 'Unknown Function',
                enabled: false,
                sub_functions: []
              };
              module.functions.push(existingFunc);
            }
            
            // Ensure all sub-functions exist
            if (funcData.sub_functions) {
              funcData.sub_functions.forEach((subFuncData: any) => {
                const subFuncId = subFuncData.sub_function_id ?? subFuncData.id;
                let existingSubFunc = existingFunc.sub_functions.find(sf => (sf.sub_function_id ?? sf.id) === subFuncId);
                
                if (!existingSubFunc) {
                  existingSubFunc = {
                    sub_function_id: subFuncId,
                    id: subFuncId,
                    sub_function_name: subFuncData.sub_function_name || subFuncData.name || 'Unknown Sub-function',
                    enabled: false
                  };
                  existingFunc.sub_functions.push(existingSubFunc);
                }
              });
            }
          });
        }
        
        // Update module and all its functions and sub-functions
        module.enabled = enabled;
        module.functions.forEach(func => {
          func.enabled = enabled;
          func.sub_functions.forEach(subFunc => {
            subFunc.enabled = enabled;
          });
        });
      }
    },
    updateFunctionEnabled: (state, action: PayloadAction<{
      roleId: number;
      moduleId: number;
      functionId: number;
      enabled: boolean;
      functionData?: any; // Pass full function data to ensure proper structure
    }>) => {
      const { roleId, moduleId, functionId, enabled, functionData } = action.payload;
      const role = state.roles.find(r => r.role_id === roleId);
      if (role) {
        let module = role.modules.find(m => (m.module_id ?? m.id) === moduleId);
        
        // If module doesn't exist in role, create it
        if (!module) {
          module = {
            module_id: moduleId,
            id: moduleId,
            name: 'Unknown Module',
            enabled: false,
            functions: []
          };
          role.modules.push(module);
        }
        
        let func = module.functions.find(f => (f.function_id ?? f.id) === functionId);
        
        // If function doesn't exist in module, create it with proper structure
        if (!func) {
          func = {
            function_id: functionId,
            id: functionId,
            function_name: functionData?.function_name || functionData?.name || 'Unknown Function',
            enabled: false,
            sub_functions: []
          };
          module.functions.push(func);
        }
        
        // If functionData is provided, ensure all sub-functions exist
        if (functionData && functionData.sub_functions) {
          functionData.sub_functions.forEach((subFuncData: any) => {
            const subFuncId = subFuncData.sub_function_id ?? subFuncData.id;
            let existingSubFunc = func.sub_functions.find(sf => (sf.sub_function_id ?? sf.id) === subFuncId);
            
            if (!existingSubFunc) {
              existingSubFunc = {
                sub_function_id: subFuncId,
                id: subFuncId,
                sub_function_name: subFuncData.sub_function_name || subFuncData.name || 'Unknown Sub-function',
                enabled: false
              };
              func.sub_functions.push(existingSubFunc);
            }
          });
        }
        
        // Update function and all its sub-functions
        func.enabled = enabled;
        func.sub_functions.forEach(subFunc => {
          subFunc.enabled = enabled;
        });
        
        // Update module enabled status based on functions
        module.enabled = module.functions.some(f => f.enabled);
      }
    },
    updateSubFunctionEnabled: (state, action: PayloadAction<{
      roleId: number;
      moduleId: number;
      functionId: number;
      subFunctionId: number;
      enabled: boolean;
      subFunctionData?: any; // Pass full sub-function data to ensure proper structure
    }>) => {
      const { roleId, moduleId, functionId, subFunctionId, enabled, subFunctionData } = action.payload;
      console.log('Redux: updateSubFunctionEnabled called with:', action.payload);
      
      const role = state.roles.find(r => r.role_id === roleId);
      if (role) {
        console.log('Redux: Found role:', role.role_name);
        let module = role.modules.find(m => (m.module_id ?? m.id) === moduleId);
        
        // If module doesn't exist in role, create it
        if (!module) {
          console.log('Redux: Creating missing module:', moduleId);
          module = {
            module_id: moduleId,
            id: moduleId,
            name: 'Unknown Module',
            enabled: false,
            functions: []
          };
          role.modules.push(module);
        }
        
        let func = module.functions.find(f => (f.function_id ?? f.id) === functionId);
        
        // If function doesn't exist in module, create it
        if (!func) {
          console.log('Redux: Creating missing function:', functionId);
          func = {
            function_id: functionId,
            id: functionId,
            function_name: 'Unknown Function',
            enabled: false,
            sub_functions: []
          };
          module.functions.push(func);
        }
        
        let subFunc = func.sub_functions.find(sf => (sf.sub_function_id ?? sf.id) === subFunctionId);
        
        // If sub-function doesn't exist in function, create it with proper name
        if (!subFunc) {
          console.log('Redux: Creating missing sub-function:', subFunctionId);
          subFunc = {
            sub_function_id: subFunctionId,
            id: subFunctionId,
            sub_function_name: subFunctionData?.sub_function_name || subFunctionData?.name || 'Unknown Sub-function',
            enabled: false
          };
          func.sub_functions.push(subFunc);
        }
        
        // Update the sub-function enabled status
        console.log('Redux: Updating sub-function enabled status:', { subFunctionId, enabled });
        subFunc.enabled = enabled;
        
        // Update function enabled status based on sub-functions
        func.enabled = func.sub_functions.some(sf => sf.enabled);
        console.log('Redux: Function enabled status updated to:', func.enabled);
        
        // Update module enabled status based on functions
        module.enabled = module.functions.some(f => f.enabled);
        console.log('Redux: Module enabled status updated to:', module.enabled);
      } else {
        console.log('Redux: Role not found:', roleId);
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
