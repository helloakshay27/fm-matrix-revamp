import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const access_token = localStorage.getItem("token");

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

export const fetchStatus = createAsyncThunk("fetchStatus", async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/project_statuses.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
    }
})

export const createStatus = createAsyncThunk("createStatus", async (payload) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/project_statuses.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
    }
})

export const updateStatus = createAsyncThunk("updateStatus", async ({ id, payload }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/project_statuses/${id}.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
    }
})

export const deleteStatus = createAsyncThunk("deleteStatus", async ({ id }) => {
    try {
        const response = await axios.delete(`https://api-tasks.lockated.com/project_statuses/${id}.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
    }
})

const fetchStatusSlice = createApiSlice("fetchStatus", fetchStatus);
const createStatusSlice = createApiSlice("createStatus", createStatus);
const updateStatusSlice = createApiSlice("updateStatus", updateStatus);
const deleteStatusSlice = createApiSlice("deleteStatus", deleteStatus);

export const fetchStatusReducer = fetchStatusSlice.reducer;
export const createStatusReducer = createStatusSlice.reducer;
export const updateStatusReducer = updateStatusSlice.reducer;
export const deleteStatusReducer = deleteStatusSlice.reducer;

