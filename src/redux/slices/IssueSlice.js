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
        pagination: {
            current_page: 1,
            total_pages: 1,
            total_count: 0,
        },
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
                const payload = action.payload;
                const issues = payload?.issues ?? payload ?? []; // fallback to raw payload
                const pagination = payload?.pagination || {
                    current_page: 1,
                    total_pages: 1,
                    total_count: Array.isArray(issues) ? issues.length : 0,
                };

                state.loading = false;
                state.success = true;
                state.error = null;
                state[name] = issues;
                state.pagination = pagination;
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
        const response = await axios.post(`${baseURL}/issues.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "Multipart/form-data"
            },

        });

        return response.data;
    }
    catch (error) {
        console.log(error);
    }
})

export const fetchIssue = createAsyncThunk("fetchIssue", async ({ token, page = 1, per_page = 10 }) => {
    try {
        const response = await axios.get(`${baseURL}/issues.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page,
                per_page,
            },
        });

        return {
            issues: response.data.issues,
            pagination: {
                current_page: response.data.meta.current_page || page,
                total_pages: response.data.meta.total_pages || 1,
                total_count: response.data.meta.total_count,
            },
        };
    }
    catch (error) {
        console.log(error);
    }
})

export const updateIssue = createAsyncThunk("updateIssue", async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/issues/${id}.json`,
            { issue: payload }, {
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

export const attachFile = createAsyncThunk("updateIssue", async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/issues/${id}.json`,
            payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "Multipart/form-data"
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
        const response = await axios.get(`${baseURL}/issue_types.json`, {
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
        const response = await axios.post(`${baseURL}/issue_types.json`, {
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

export const updateIssueType = createAsyncThunk("updateIssueType", async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/issue_types/${id}.json`, {
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
        const response = await axios.delete(`${baseURL}/issue_types/${id}.json`, {
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
                `${baseURL}/issues.json?${params}`,
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

export const removeIssueAttachment = createAsyncThunk("removeIssueAttachment", async ({ token, id, image_id }) => {
    try {
        const response = await axios.delete(`${baseURL}/issues/${id}/remove_attachemnts/${image_id}.json`, {
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

export const createIssueSlice = createApiSlice('createIssue', createIssue);
export const fetchIssueSlice = createApiSlice('fetchIssue', fetchIssue);
export const updateIssueSlice = createApiSlice('updateIssue', updateIssue);
export const fetchIssueTypeSlice = createApiSlice('fetchIssueType', fetchIssueType);
export const createIssueTypeSlice = createApiSlice('createIssueType', createIssueType);
export const updateIssueTypeSlice = createApiSlice('updateIssueType', updateIssueType);
export const deleteIssueTypeSlice = createApiSlice('deleteIssueType', deleteIssueType);
export const filterIssueSlice = createApiSlice('filterIssue', filterIssue);
export const removeIssueAttachmentSlice = createApiSlice('removeIssueAttachment', removeIssueAttachment);

export const createIssueReducer = createIssueSlice.reducer;
export const fetchIssueReducer = fetchIssueSlice.reducer;
export const updateIssueReducer = updateIssueSlice.reducer;
export const fetchIssueTypeReducer = fetchIssueTypeSlice.reducer;
export const createIssueTypeReducer = createIssueTypeSlice.reducer;
export const updateIssueTypeReducer = updateIssueTypeSlice.reducer;
export const deleteIssueTypeReducer = deleteIssueTypeSlice.reducer;
export const filterIssueReducer = filterIssueSlice.reducer;
export const removeIssueAttachmentReducer = removeIssueAttachmentSlice.reducer;

export const { resetIssueSuccess } = createIssueSlice.actions;
