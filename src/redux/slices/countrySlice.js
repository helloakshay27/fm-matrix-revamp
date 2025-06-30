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

export const fetchCountry = createAsyncThunk('fetchCountry', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/countries.json`, {
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

export const createCountry = createAsyncThunk('createCountry', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/countries.json`, payload, {
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

export const updateCountry = createAsyncThunk('updateCountry', async ({ token, payload, id }) => {
    try {
        const response = await axios.put(`${baseURL}/countries/${id}.json`, payload , {
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

export const deleteCountry = createAsyncThunk('deleteCountry', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/countries/${id}.json`, {
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

export const fetchCountrySlice = createApiSlice('fetchCountry', fetchCountry);
export const createCountrylice = createApiSlice('createCountry', createCountry);
export const updateCountrylice = createApiSlice('updateCountry', updateCountry);
export const deleteCountrylice = createApiSlice('deleteCountry', deleteCountry);

export const fetchCountryReducer = fetchCountrySlice.reducer;
export const createCountryReducer = createCountrylice.reducer;
export const updateCountryReducer = updateCountrylice.reducer;
export const deleteCountryReducer = deleteCountrylice.reducer;

export const { resetCreateSuccess } = createCountrylice.actions
export const { resetEditSuccess } = updateCountrylice.actions