import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Template {
    id: string;
    title: string;
    description?: string;
    status?: string;
    created_at?: string;
}

interface TemplateResponse {
    project_managements: Template[];
    total_count?: number;
    current_page?: number;
    total_pages?: number;
}

interface TemplateState {
    data: TemplateResponse;
    loading: boolean;
    error: string | null;
}

const initialState: TemplateState = {
    data: { project_managements: [] },
    loading: false,
    error: null,
};

export const fetchTemplates = createAsyncThunk(
    "projectTemplate/fetchTemplates",
    async (
        { token, baseUrl }: { token: string; baseUrl: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/project_managements.json?q[is_template_eq]=true`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || error.message || "Failed to fetch templates"
            );
        }
    }
);

export const fetchTemplateById = createAsyncThunk(
    "projectTemplate/fetchTemplateById",
    async (
        { token, baseUrl, id }: { token: string; baseUrl: string; id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/project_managements/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.error || error.message || "Failed to fetch template"
            );
        }
    }
);

const projectTemplateSlice = createSlice({
    name: "projectTemplate",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTemplates.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchTemplateById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTemplateById.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchTemplateById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default projectTemplateSlice.reducer;
