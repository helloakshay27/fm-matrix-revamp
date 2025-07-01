import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL } from '../../../apiDomain';

const createApiSlice = (name, fetchThunk) => createSlice({
    name,
    initialState: {
        loading: false,
        success: false,
        error: null,
        [name]: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchThunk.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(fetchThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state[name] = action.payload;
            })
            .addCase(fetchThunk.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const createRole = createAsyncThunk('createRole', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/lock_roles.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const fetchRoles = createAsyncThunk('fetchRoles', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/lock_roles.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const fetchActiveRoles = createAsyncThunk('fetchActiveRoles', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/lock_roles.json?q[active_eq]=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const editRole = createAsyncThunk('editRole', async ({ token, id, payload }) => {
    console.log(payload)
    try {
        const response = await axios.patch(`${baseURL}/lock_roles/${id}.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const deleteRole = createAsyncThunk('deleteRole', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/lock_roles/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data;
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const createRoleSlice = createApiSlice('createRole', createRole);
export const fetchRoleSlice = createApiSlice('fetchRoles', fetchRoles);
export const fetchActiveRolesSlice = createApiSlice('fetchActiveRoles', fetchActiveRoles);
export const editRoleSlice = createApiSlice('editRole', editRole);
export const deleteRoleSlice = createApiSlice('deleteRole', deleteRole);

export const createRoleReducer = createRoleSlice.reducer;
export const fetchRolesReducer = fetchRoleSlice.reducer;
export const fetchActiveRolesReducer = fetchActiveRolesSlice.reducer;
export const editRoleReducer = editRoleSlice.reducer;
export const deleteRoleReducer = deleteRoleSlice.reducer;