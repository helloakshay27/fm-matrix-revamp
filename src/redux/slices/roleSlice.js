import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const access_token = 'bTcVnWgQrF6QCdNbMiPXzCZNAqsN9qoEfFWdFQ1Auk4';

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

export const createRole = createAsyncThunk('createRole', async (paylode) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/lock_roles.json`, paylode, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const fetchRoles = createAsyncThunk('fetchRoles', async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/lock_roles.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const editRole = createAsyncThunk('editRole', async ({ id, payload }) => {
    console.log(payload)
    try {
        const response = await axios.patch(`https://api-tasks.lockated.com/lock_roles/${id}.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
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
export const editRoleSlice = createApiSlice('editRole', editRole);

export const createRoleReducer = createRoleSlice.reducer;
export const fetchRolesReducer = fetchRoleSlice.reducer;
export const editRoleReducer = editRoleSlice.reducer;