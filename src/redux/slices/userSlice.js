import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const access_token = 'bTcVnWgQrF6QCdNbMiPXzCZNAqsN9qoEfFWdFQ1Auk4';

// Generic slice factory
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

// Fetch users thunk
export const fetchUsers = createAsyncThunk('fetchUsers', async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/users.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error)
    }
});

export const createInternalUser = createAsyncThunk('createInternalUser', async (payload) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/users.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return response.data.users;
    } catch (error) {
        console.log(error);
    }
});

export const fetchInternalUser = createAsyncThunk('fetchInternalUser', async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/users.json?q[user_type_eq]=internal`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const createExternalUser = createAsyncThunk('createExternalUser', async (payload) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/users.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const fetchExternalUser = createAsyncThunk('fetchExternalUser', async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/users.json?q[user_type_eq]=external`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
});

// Create slices
export const userSlice = createApiSlice('fetchUsers', fetchUsers);
export const createInternalUserSlice = createApiSlice('createInternalUser', createInternalUser);
export const fetchInternalUserSlice = createApiSlice('fetchInternalUser', fetchInternalUser);
export const createExternalUserSlice = createApiSlice('createExternalUser', createExternalUser);
export const fetchExternalUserSlice = createApiSlice('fetchExternalUser', fetchExternalUser);

// Export reducers
export const userReducer = userSlice.reducer;
export const createInternalUserReducer = createInternalUserSlice.reducer;
export const fetchInternalUserReducer = fetchInternalUserSlice.reducer;
export const createExternalUserReducer = createExternalUserSlice.reducer;
export const fetchExternalUserReducer = fetchExternalUserSlice.reducer;