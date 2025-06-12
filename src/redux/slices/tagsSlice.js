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

export const fetchTags = createAsyncThunk('fetchTags', async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/company_tags.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
});

export const createTag = createAsyncThunk('createTag', async (payload) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/company_tags.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
});

export const updateTag = createAsyncThunk(
    'tag/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `https://api-tasks.lockated.com/company_tags/${id}.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
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
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`https://api-tasks.lockated.com/company_tags/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            });

            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchTagSlice = createApiSlice('fetchTags', fetchTags);
export const createTagSlice = createApiSlice('createTag', createTag);
export const updateTagSlice = createApiSlice('updateTag', updateTag);
export const deleteTagSlice = createApiSlice('deleteTag', deleteTag);

export const fetchTagsReducer = fetchTagSlice.reducer;
export const createTagReducer = createTagSlice.reducer;
export const updateTagReducer = updateTagSlice.reducer;
export const deleteTagReducer = deleteTagSlice.reducer;

export const { resetSuccess } = createTagSlice.actions;