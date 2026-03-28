import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AdminViewEmulationState {
  selectedUserType: string;
  selectedUser: string;
}

const initialState: AdminViewEmulationState = {
  selectedUserType: 'Default (Your Role)',
  selectedUser: 'No specific user',
};

const adminViewEmulationSlice = createSlice({
  name: 'adminViewEmulation',
  initialState,
  reducers: {
    setSelectedUserType: (state, action: PayloadAction<string>) => {
      state.selectedUserType = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<string>) => {
      state.selectedUser = action.payload;
    },
    resetEmulation: (state) => {
      state.selectedUserType = initialState.selectedUserType;
      state.selectedUser = initialState.selectedUser;
    },
  },
});

export const { setSelectedUserType, setSelectedUser, resetEmulation } = adminViewEmulationSlice.actions;
export default adminViewEmulationSlice.reducer;
