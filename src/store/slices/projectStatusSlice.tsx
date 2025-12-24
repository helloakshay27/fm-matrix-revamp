import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProjectStatus {
    id: number;
    status: string;
    color_code: string;
    active: boolean;
    created_at?: string;
    // Add other fields as per API response
}

interface ProjectStatusState {
    projectStatuses: ProjectStatus[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectStatusState = {
    projectStatuses: [],
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

export const fetchProjectStatuses = createAsyncThunk(
    "projectStatus/fetchProjectStatuses",
    async (_, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`https://${baseUrl}/project_statuses.json`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to get project statuses');
        }
    }
);

export const createProjectStatus = createAsyncThunk(
    "projectStatus/createProjectStatus",
    async (data: any, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.post(`https://${baseUrl}/project_statuses.json`, data, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to create project status');
        }
    }
);

export const updateProjectStatus = createAsyncThunk(
    "projectStatus/updateProjectStatus",
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.put(`https://${baseUrl}/project_statuses/${id}.json`, data, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to update project status');
        }
    }
);

export const deleteProjectStatus = createAsyncThunk(
    "projectStatus/deleteProjectStatus",
    async (id: number, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            await axios.delete(`https://${baseUrl}/project_statuses/${id}.json`, {
                headers: getHeaders()
            });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to delete project status');
        }
    }
);

const projectStatusSlice = createSlice({
    name: "projectStatus",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectStatuses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectStatuses.fulfilled, (state, action) => {
                state.loading = false;
                state.projectStatuses = action.payload;
            })
            .addCase(fetchProjectStatuses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteProjectStatus.fulfilled, (state, action) => {
                state.projectStatuses = state.projectStatuses.filter(status => status.id !== action.payload);
            });
    }
});

export const projectStatusReducer = projectStatusSlice.reducer;
