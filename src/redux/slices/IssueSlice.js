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

export const createIssue = createAsyncThunk("createIssue", async (data) => {
    try {
        const response = await axios.post("https://api-tasks.lockated.com/issues.json", { issue: data }, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },

        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
})

export const fetchIssue = createAsyncThunk("fetchIssue", async () => {
    try {
        const response = await axios.get("https://api-tasks.lockated.com/issues.json", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },

        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
})

export const updateIssue = createAsyncThunk("updateIssue", async ({ id, payload }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/issues/${id}.json`, {
            issue: payload
        }, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },

        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
})

export const createIssueSlice = createApiSlice('createIssue', createIssue);
export const fetchIssueSlice = createApiSlice('fetchIssue', fetchIssue);
export const updateIssueSlice = createApiSlice('updateIssue', updateIssue);

export const createIssueReducer = createIssueSlice.reducer;
export const fetchIssueReducer = fetchIssueSlice.reducer;
export const updateIssueReducer = updateIssueSlice.reducer;
