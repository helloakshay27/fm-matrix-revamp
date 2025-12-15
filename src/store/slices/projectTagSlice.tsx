import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ProjectTag {
    id: number;
    name: string;
    tag_type: string;
    active: boolean;
    created_at?: string;
    // Add other fields as per API response
}

interface ProjectTagState {
    projectTags: ProjectTag[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectTagState = {
    projectTags: [],
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

export const fetchProjectsTags = createAsyncThunk(
    "projectTags/fetchProjectsTags",
    async (_, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`https://${baseUrl}/company_tags.json`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to get tags');
        }
    }
);

export const createProjectsTags = createAsyncThunk(
    "projectTags/createProjectsTags",
    async (data: any, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const payload = data.company_tag ? data : { company_tag: data };
            const response = await axios.post(`https://${baseUrl}/company_tags.json`, payload, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to create tags');
        }
    }
);

export const updateProjectsTags = createAsyncThunk(
    "projectTags/updateProjectsTags",
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const payload = data.company_tag ? data : { company_tag: data };
            const response = await axios.put(`https://${baseUrl}/company_tags/${id}.json`, payload, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to update tags');
        }
    }
);

export const deleteProjectsTags = createAsyncThunk(
    "projectTags/deleteProjectsTags",
    async (id: number, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            await axios.delete(`https://${baseUrl}/company_tags/${id}.json`, {
                headers: getHeaders()
            });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to delete tags');
        }
    }
);

const projectTagSlice = createSlice({
    name: "projectTags",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectsTags.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectsTags.fulfilled, (state, action) => {
                state.loading = false;
                state.projectTags = action.payload;
            })
            .addCase(fetchProjectsTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteProjectsTags.fulfilled, (state, action) => {
                state.projectTags = state.projectTags.filter(tag => tag.id !== action.payload);
            });
    }
});

export const projectTagReducer = projectTagSlice.reducer;