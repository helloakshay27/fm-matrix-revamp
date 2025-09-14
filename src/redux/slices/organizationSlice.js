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

export const fetchOrganizations = createAsyncThunk('fetchOrganizations', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/organizations.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data.organizations
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const createOrganization = createAsyncThunk('createOrganization', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/organizations.json`, payload, {
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

export const editOrganization = createAsyncThunk('editOrganization', async ({ token, payload, id }) => {
    try {
        const response = await axios.put(`${baseURL}/organizations/${id}.json`, payload, {
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

export const fetchOrganizationsSlice = createApiSlice('fetchOrganizations', fetchOrganizations);
export const createOrganizationSlice = createApiSlice('createOrganization', createOrganization);
export const editOrganizationSlice = createApiSlice('editOrganization', editOrganization);

export const fetchOrganizationsReducer = fetchOrganizationsSlice.reducer;
export const createOrganizationReducer = createOrganizationSlice.reducer;
export const editOrganizationReducer = editOrganizationSlice.reducer;

export const { resetCreateSuccess } = createOrganizationSlice.actions
export const { resetEditSuccess } = editOrganizationSlice.actions