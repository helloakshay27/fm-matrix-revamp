import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProjectType {
    id: number;
    name: string;
    active: boolean;
    created_by_id: number;
    created_at?: string;
    // Add other fields as per API response
    created_by?: {
        name: string;
    }
}

interface ProjectTypeState {
    projectTypes: ProjectType[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectTypeState = {
    projectTypes: [],
    loading: false,
    error: null,
};

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

const getBaseUrl = () => localStorage.getItem('baseUrl');

export const fetchProjectTypes = createAsyncThunk(
    "projectTypes/fetchProjectTypes",
    async (_, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`https://${baseUrl}/project_types.json`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to get project types');
        }
    }
);

export const createProjectTypes = createAsyncThunk(
    "projectTypes/createProjectTypes",
    async (data: any, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.post(`https://${baseUrl}/project_types.json`, { project_type: data }, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to create project type');
        }
    }
);

export const updateProjectTypes = createAsyncThunk(
    "projectTypes/updateProjectTypes",
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.put(`https://${baseUrl}/project_types/${id}.json`, { project_type: data }, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to update project type');
        }
    }
);

export const deleteProjectTypes = createAsyncThunk(
    "projectTypes/deleteProjectTypes",
    async (id: number, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            await axios.delete(`https://${baseUrl}/project_types/${id}.json`, {
                headers: getHeaders()
            });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to delete project type');
        }
    }
);

const projectTypeSlice = createSlice({
    name: "projectTypes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectTypes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectTypes.fulfilled, (state, action) => {
                state.loading = false;
                state.projectTypes = action.payload;
            })
            .addCase(fetchProjectTypes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteProjectTypes.fulfilled, (state, action) => {
                state.projectTypes = state.projectTypes.filter(pt => pt.id !== action.payload);
            });
    }
});

export const projectTypeReducer = projectTypeSlice.reducer;