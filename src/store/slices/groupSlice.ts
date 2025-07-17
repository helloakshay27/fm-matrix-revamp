import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/utils/apiClient';

// Types
export interface Group {
  id: number;
  srNo: number;
  groupName: string;
  status: boolean;
}

export interface SubGroup {
  id: number;
  srNo: number;
  groupName: string;
  subGroupName: string;
  status: boolean;
}

interface GroupState {
  groups: Group[];
  subGroups: SubGroup[];
  loading: {
    createGroup: boolean;
    createSubGroup: boolean;
    fetchGroups: boolean;
    fetchSubGroups: boolean;
  };
  error: string | null;
}

const initialState: GroupState = {
  groups: [],
  subGroups: [],
  loading: {
    createGroup: false,
    createSubGroup: false,
    fetchGroups: false,
    fetchSubGroups: false,
  },
  error: null,
};

// Async thunks
export const createGroup = createAsyncThunk(
  'group/createGroup',
  async (groupData: { name: string; group_type: string }) => {
    const payload = {
      pms_asset_group: groupData
    };
    
    const response = await apiClient.post('/pms/asset_groups.json', payload);
    return response.data;
  }
);

export const createSubGroup = createAsyncThunk(
  'group/createSubGroup',
  async (subGroupData: { name: string; group_id: number }) => {
    const params = new URLSearchParams({
      'pms_asset_sub_group[name]': subGroupData.name,
      'pms_asset_sub_group[group_id]': subGroupData.group_id.toString()
    });

    const response = await apiClient.post(`/pms/asset_sub_groups.json?${params.toString()}`);
    return response.data;
  }
);

export const fetchGroups = createAsyncThunk(
  'group/fetchGroups',
  async () => {
    const response = await apiClient.get('/pms/asset_groups.json');
    return response.data;
  }
);

export const fetchSubGroups = createAsyncThunk(
  'group/fetchSubGroups',
  async () => {
    const response = await apiClient.get('/pms/asset_sub_groups.json');
    return response.data;
  }
);

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    toggleGroupStatus: (state, action: PayloadAction<number>) => {
      const group = state.groups.find(g => g.id === action.payload);
      if (group) {
        group.status = !group.status;
      }
    },
    toggleSubGroupStatus: (state, action: PayloadAction<number>) => {
      const subGroup = state.subGroups.find(sg => sg.id === action.payload);
      if (subGroup) {
        subGroup.status = !subGroup.status;
      }
    },
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
    },
    setSubGroups: (state, action: PayloadAction<SubGroup[]>) => {
      state.subGroups = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Group
      .addCase(createGroup.pending, (state) => {
        state.loading.createGroup = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading.createGroup = false;
        const newGroup: Group = {
          id: action.payload.id || state.groups.length + 1,
          srNo: state.groups.length + 1,
          groupName: action.payload.name || action.payload.groupName,
          status: true
        };
        state.groups.push(newGroup);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading.createGroup = false;
        state.error = action.error.message || 'Failed to create group';
      })
      
      // Create Sub Group
      .addCase(createSubGroup.pending, (state) => {
        state.loading.createSubGroup = true;
        state.error = null;
      })
      .addCase(createSubGroup.fulfilled, (state, action) => {
        state.loading.createSubGroup = false;
        const newSubGroup: SubGroup = {
          id: action.payload.id || state.subGroups.length + 1,
          srNo: state.subGroups.length + 1,
          groupName: action.payload.groupName || '',
          subGroupName: action.payload.name || action.payload.subGroupName,
          status: true
        };
        state.subGroups.push(newSubGroup);
      })
      .addCase(createSubGroup.rejected, (state, action) => {
        state.loading.createSubGroup = false;
        state.error = action.error.message || 'Failed to create sub group';
      })
      
      // Fetch Groups
      .addCase(fetchGroups.pending, (state) => {
        state.loading.fetchGroups = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading.fetchGroups = false;
        state.groups = action.payload.map((group: any, index: number) => ({
          id: group.id,
          srNo: index + 1,
          groupName: group.name || group.groupName,
          status: group.status !== false
        }));
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading.fetchGroups = false;
        state.error = action.error.message || 'Failed to fetch groups';
      })
      
      // Fetch Sub Groups
      .addCase(fetchSubGroups.pending, (state) => {
        state.loading.fetchSubGroups = true;
        state.error = null;
      })
      .addCase(fetchSubGroups.fulfilled, (state, action) => {
        state.loading.fetchSubGroups = false;
        state.subGroups = action.payload.map((subGroup: any, index: number) => ({
          id: subGroup.id,
          srNo: index + 1,
          groupName: subGroup.groupName || '',
          subGroupName: subGroup.name || subGroup.subGroupName,
          status: subGroup.status !== false
        }));
      })
      .addCase(fetchSubGroups.rejected, (state, action) => {
        state.loading.fetchSubGroups = false;
        state.error = action.error.message || 'Failed to fetch sub groups';
      });
  },
});

export const { 
  clearError, 
  toggleGroupStatus, 
  toggleSubGroupStatus, 
  setGroups, 
  setSubGroups 
} = groupSlice.actions;

export default groupSlice.reducer;