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

export const createCompany = createAsyncThunk('createCompany', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/company_setups.json`, { company_setup: payload }, {
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

export const fetchCompany = createAsyncThunk('fetchCompany', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/company_setups.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data.company_setups
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const editCompany = createAsyncThunk('editCompany', async ({ token, payload, id }) => {
    try {
        const response = await axios.put(`${baseURL}/company_setups/${id}.json`, { company_setup: payload }, {
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

export const createCompanySlice = createApiSlice('createCompany', createCompany);
export const fetchCompanySlice = createApiSlice('fetchCompany', fetchCompany);
export const editCompanySlice = createApiSlice('editCompany', editCompany);

export const createCompanyReducer = createCompanySlice.reducer
export const fetchCompanyReducer = fetchCompanySlice.reducer
export const editCompanyReducer = editCompanySlice.reducer

export const { resetCreateSuccess } = createCompanySlice.actions
export const { resetEditSuccess } = editCompanySlice.actions