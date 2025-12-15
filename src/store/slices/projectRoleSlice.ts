import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface ProjectRole {
    id: number;
    name: string;
    active: boolean;
    created_at: string;
    permissions_hash?: string;
}

interface ProjectRoleState {
    roles: ProjectRole[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectRoleState = {
    roles: [],
    loading: false,
    error: null,
};

// Helper to get headers
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

const getBaseUrl = () => localStorage.getItem('baseUrl');

export const fetchProjectRoles = createAsyncThunk(
    'projectRole/fetchProjectRoles',
    async (_, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`https://${baseUrl}/lock_roles.json?q[active_eq]=true`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch roles');
        }
    }
);

export const createProjectRole = createAsyncThunk(
    'projectRole/createProjectRole',
    async (roleData: any, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.post(`https://${baseUrl}/lock_roles.json`, { lock_role: roleData }, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to create role');
        }
    }
);

export const updateProjectRole = createAsyncThunk(
    'projectRole/updateProjectRole',
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.put(`https://${baseUrl}/lock_roles/${id}.json`, { lock_role: data }, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to update role');
        }
    }
);

export const deleteProjectRole = createAsyncThunk(
    'projectRole/deleteProjectRole',
    async (id: number, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            await axios.delete(`https://${baseUrl}/lock_roles/${id}.json`, {
                headers: getHeaders()
            });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || 'Failed to delete role');
        }
    }
);

const projectRoleSlice = createSlice({
    name: 'projectRole',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProjectRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload;
            })
            .addCase(fetchProjectRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createProjectRole.fulfilled, (state, action) => {
                // Optimistic update or wait for re-fetch. Re-fetch is safer for getting server-generated fields.
            })
            // Update
            .addCase(updateProjectRole.fulfilled, (state, action) => {
                // Logic to update state if needed without re-fetch
            })
            // Delete
            .addCase(deleteProjectRole.fulfilled, (state, action) => {
                state.roles = state.roles.filter(r => r.id !== action.payload);
            });
    },
});

export const { clearError } = projectRoleSlice.actions;
export const projectRoleReducer = projectRoleSlice.reducer;
