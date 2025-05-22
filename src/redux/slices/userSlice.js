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

        return response.data.users;
    } catch (error) {
        console.log(error)
    }
});


// Create slices
export const userSlice = createApiSlice('users', fetchUsers);

// Export reducers
export const userReducer = userSlice.reducer;