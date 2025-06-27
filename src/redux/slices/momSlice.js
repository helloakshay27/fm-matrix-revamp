import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const createApiSlice = (name, fetchThunk) => createSlice({
    name,
    initialState: {
        loading: false,
        success: false,
        error: null,
        [name]: [],
    },
    reducers: {
        resetMomCreateSuccess: (state) => {
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

export const fetchMoM = createAsyncThunk('fetchMoM', async ({ token }) => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/mom_details.json`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error) {
        console.log(error);
    }
})

export const createMoM = createAsyncThunk('createMoM', async ({ token, payload }) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/mom_details.json`, {
            mom_detail: payload
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error) {
        console.log(error);
    }
})

export const fetchMomDetails = createAsyncThunk('fetchMomDetails', async ({ token, id }) => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/mom_details/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error) {
        console.log(error);
    }
})

export const fetchMoMSlice = createApiSlice('fetchMoM', fetchMoM);
export const createMoMSlice = createApiSlice('createMoM', createMoM);
export const fetchMomDetailsSlice = createApiSlice('fetchMomDetails', fetchMomDetails);

export const fetchMoMReducer = fetchMoMSlice.reducer;
export const createMoMReducer = createMoMSlice.reducer;
export const fetchMomDetailsReducer = fetchMomDetailsSlice.reducer;

export const { resetMomCreateSuccess } = createMoMSlice.actions;