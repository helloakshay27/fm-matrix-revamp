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

export const fetchSpirints = createAsyncThunk('fetchSpirints', async ({ token, filters = {} }) => {
    try {
        // Build query parameters from filters
        const queryParams = new URLSearchParams(filters).toString();
        const url = queryParams ? `${baseURL}/sprints.json?${queryParams}` : `${baseURL}/sprints.json`;
        
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}
);

export const fetchSpirintById = createAsyncThunk('fetchSpirintById', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/sprints/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
}
);


export const postSprint = createAsyncThunk('postSprint', async ({ token, payload }) => {
    try {
        const response = await axios.post(
            `${baseURL}/sprints.json`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
    }
});

export const putSprint = createAsyncThunk('putSprint', async ({ token, id, payload }, { rejectWithValue }) => {
    try {
        const response = await axios.put(
            `${baseURL}/sprints/${id}.json`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
        return rejectWithValue(error.response?.data || error.message);
    }
});

export const fetchSpirintsSlice = createApiSlice('fetchSpirints', fetchSpirints);
export const postSprintSlice = createApiSlice('postSprint', postSprint);
export const putSprintSlice = createApiSlice('putSprint', putSprint);
export const fetchSpirintByIdSlice = createApiSlice('fetchSpirintById', fetchSpirintById);

export const fetchSpirintsReducer = fetchSpirintsSlice.reducer;
export const postSprintReducer = postSprintSlice.reducer;
export const putSprintReducer = putSprintSlice.reducer;
export const fetchSpirintByIdReducer = fetchSpirintByIdSlice.reducer;
