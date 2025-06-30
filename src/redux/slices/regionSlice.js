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
    reducers: {
        resetCreateSuccess: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
        resetEditSuccess: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
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

export const fetchRegion = createAsyncThunk('fetchRegion', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/regions.json`, {
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

export const createRegion = createAsyncThunk('createRegion', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/regions.json`, payload, {
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

export const updateRegion = createAsyncThunk('updateRegion', async ({ token, payload, id }) => {
    try {
        const response = await axios.put(`${baseURL}/regions/${id}.json`, payload , {
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

export const deleteRegion = createAsyncThunk('deleteRegion', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/regions/${id}.json`, {
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

export const fetchRegionSlice = createApiSlice('fetchRegion', fetchRegion);
export const createRegionlice = createApiSlice('createRegion', createRegion);
export const updateRegionlice = createApiSlice('updateRegion', updateRegion);
export const deleteRegionlice = createApiSlice('deleteRegion', deleteRegion);

export const fetchRegionReducer = fetchRegionSlice.reducer;
export const createRegionReducer = createRegionlice.reducer;
export const updateRegionReducer = updateRegionlice.reducer;
export const deleteRegionReducer = deleteRegionlice.reducer;

export const { resetCreateSuccess } = createRegionlice.actions
export const { resetEditSuccess } = updateRegionlice.actions