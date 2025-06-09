import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const access_token = 'bTcVnWgQrF6QCdNbMiPXzCZNAqsN9qoEfFWdFQ1Auk4'

const createApiSlice = (name, fetchThunk) => createSlice({
    name,
    initialState: {
        loading: false,
        success: false,
        error: null,
        [name]: [],
    },
    reducers: {},
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

export const createMilestone = createAsyncThunk('createMilestone', async (payload) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/milestones.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const fetchMilestone = createAsyncThunk("fetchMilestone", async ({ id }) => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/milestones.json?q[project_management_id_eq]=${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})


export const fetchMilestoneSlice = createApiSlice('fetchMilestone', fetchMilestone);
export const createMilestoneSlice = createApiSlice('createMilestone', createMilestone);

export const createMilestoneReducer = createMilestoneSlice.reducer;
export const fetchMilestoneReducer = fetchMilestoneSlice.reducer;