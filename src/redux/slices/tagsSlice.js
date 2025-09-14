import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL } from '../../../apiDomain';

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
        resetSuccess: (state) => {
            state.success = false;
        }
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

export const fetchTags = createAsyncThunk('fetchTags', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/company_tags.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
});

export const fetchActiveTags = createAsyncThunk('fetchActiveTags', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/company_tags.json?q[active_eq]=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
});

export const createTag = createAsyncThunk('createTag', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/company_tags.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
});

export const updateTag = createAsyncThunk(
    'tag/update',
    async ({ token, id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${baseURL}/company_tags/${id}.json`,
                data,
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

export const deleteTag = createAsyncThunk(
    'deleteTag',
    async ({ token, id }, { rejectWithValue }) => {
        try {
            await axios.delete(`${baseURL}/company_tags/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchTagSlice = createApiSlice('fetchTags', fetchTags);
export const fetchActiveTagsSlice = createApiSlice('fetchActiveTags', fetchActiveTags);
export const createTagSlice = createApiSlice('createTag', createTag);
export const updateTagSlice = createApiSlice('updateTag', updateTag);
export const deleteTagSlice = createApiSlice('deleteTag', deleteTag);

export const fetchTagsReducer = fetchTagSlice.reducer;
export const fetchActiveTagsReducer = fetchActiveTagsSlice.reducer;
export const createTagReducer = createTagSlice.reducer;
export const updateTagReducer = updateTagSlice.reducer;
export const deleteTagReducer = deleteTagSlice.reducer;

export const { resetSuccess } = createTagSlice.actions;