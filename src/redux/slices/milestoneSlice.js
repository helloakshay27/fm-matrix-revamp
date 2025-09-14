import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL } from '../../../apiDomain';

export const createMilestone = createAsyncThunk('createMilestone', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/milestones.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
});

export const fetchMilestone = createAsyncThunk("fetchMilestone", async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/milestones.json?q[project_management_id_eq]=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
});

export const fetchMilestoneById = createAsyncThunk("fetchMilestoneById", async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/milestones/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
});

// ✅ Enhanced API slice factory
const createApiSlice = (name, fetchThunk, extraInitial = {}, extraReducers = {}) =>
    createSlice({
        name,
        initialState: {
            loading: false,
            success: false,
            error: null,
            [name]: [],
            ...extraInitial,
        },
        reducers: {
            ...extraReducers,
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

// ✅ fetchMilestone slice — with savedMilestones global state
export const fetchMilestoneSlice = createApiSlice(
    'fetchMilestone',
    fetchMilestone,
    {
        savedMilestones: [], // ← NEW global state
    },
    {
        // Reducers for saved milestone handling
        addSavedMilestone: (state, action) => {
            state.savedMilestones.push(action.payload);
        },
        setSavedMilestones: (state, action) => {
            state.savedMilestones = action.payload;
        },
        clearSavedMilestones: (state) => {
            state.savedMilestones = [];
        },
    }
);

// ✅ Other slices remain the same
export const createMilestoneSlice = createApiSlice('createMilestone', createMilestone);
export const fetchMilestoneByIdSlice = createApiSlice('fetchMilestoneById', fetchMilestoneById);

// ✅ Export reducers
export const createMilestoneReducer = createMilestoneSlice.reducer;
export const fetchMilestoneReducer = fetchMilestoneSlice.reducer;
export const fetchMilestoneByIdReducer = fetchMilestoneByIdSlice.reducer;

// ✅ Export saved milestone actions
export const {
    addSavedMilestone,
    setSavedMilestones,
    clearSavedMilestones,
} = fetchMilestoneSlice.actions;
