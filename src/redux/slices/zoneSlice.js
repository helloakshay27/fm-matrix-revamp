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

export const fetchZone = createAsyncThunk('fetchZone', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/zones.json`, {
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

export const createZone = createAsyncThunk('createZone', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/zones.json`, payload, {
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

export const updateZone = createAsyncThunk('updateZone', async ({ token, payload, id }) => {
    try {
        const response = await axios.put(`${baseURL}/zones/${id}.json`, payload , {
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

export const deleteZone = createAsyncThunk('deleteZone', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/zones/${id}.json`, {
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

export const fetchZoneSlice = createApiSlice('fetchZone', fetchZone);
export const createZonelice = createApiSlice('createZone', createZone);
export const updateZonelice = createApiSlice('updateZone', updateZone);
export const deleteZonelice = createApiSlice('deleteZone', deleteZone);

export const fetchZoneReducer = fetchZoneSlice.reducer;
export const createZoneReducer = createZonelice.reducer;
export const updateZoneReducer = updateZonelice.reducer;
export const deleteZoneReducer = deleteZonelice.reducer;

export const { resetCreateSuccess } = createZonelice.actions
export const { resetEditSuccess } = updateZonelice.actions