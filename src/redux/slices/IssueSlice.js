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
    reducers: {
        resetIssueSuccess: (state) => {
            state.success = false;
        },
    },
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

export const createIssue = createAsyncThunk("createIssue", async ({ token, payload }) => {
    try {
        const response = await axios.post("https://api-tasks.lockated.com/issues.json", { issue: payload }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
})

export const fetchIssue = createAsyncThunk("fetchIssue", async ({ token }) => {
    try {
        const response = await axios.get("https://api-tasks.lockated.com/issues.json", {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
})

export const updateIssue = createAsyncThunk("updateIssue", async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/issues/${id}.json`, {
            issue: payload
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
})

export const fetchIssueType = createAsyncThunk("fetchIssueType", async ({ token }) => {
    try {
        const response = await axios.get("https://api-tasks.lockated.com/issue_types.json", {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
});

export const createIssueType = createAsyncThunk("createIssueType", async ({ token, payload }) => {
    try {
        const response = await axios.post("https://api-tasks.lockated.com/issue_types.json", {
            issue_type: payload
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
})

export const updateIssueType= createAsyncThunk("updateIssueType", async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/issue_types/${id}.json`, {
            issue_type: payload
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },

        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
})

export const deleteIssueType = createAsyncThunk("deleteIssueType", async ({ token, id }) => {
    try {
        const response = await axios.delete(`https://api-tasks.lockated.com/issue_types/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const filterIssue = createAsyncThunk('filterIssue',
    async ({ token, filter }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filter).toString();
            console.log(params);
            const response = await axios.get(
                `https://api-tasks.lockated.com/issues.json?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createIssueSlice = createApiSlice('createIssue', createIssue);
export const fetchIssueSlice = createApiSlice('fetchIssue', fetchIssue);
export const updateIssueSlice = createApiSlice('updateIssue', updateIssue);
export const fetchIssueTypeSlice = createApiSlice('fetchIssueType', fetchIssueType);
export const createIssueTypeSlice = createApiSlice('createIssueType', createIssueType);
export const updateIssueTypeSlice = createApiSlice('updateIssueType', updateIssueType);
export const deleteIssueTypeSlice = createApiSlice('deleteIssueType', deleteIssueType);
export const filterIssueSlice = createApiSlice('filterIssue', filterIssue);

export const createIssueReducer = createIssueSlice.reducer;
export const fetchIssueReducer = fetchIssueSlice.reducer;
export const updateIssueReducer = updateIssueSlice.reducer;
export const fetchIssueTypeReducer = fetchIssueTypeSlice.reducer;
export const createIssueTypeReducer = createIssueTypeSlice.reducer;
export const updateIssueTypeReducer = updateIssueTypeSlice.reducer;
export const deleteIssueTypeReducer = deleteIssueTypeSlice.reducer;
export const filterIssueReducer = filterIssueSlice.reducer;

export const { resetIssueSuccess } = createIssueSlice.actions;
