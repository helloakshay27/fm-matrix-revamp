import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Interfaces
interface ProjectTeam {
    id: number;
    name: string;
    lead_id?: number;
    lead: any;
    members: any[];
    member_ids?: number[];
    team_lead_id?: number; // Add support for new payload field if API returns it
    user_ids?: number[];   // Add support for new payload field if API returns it
    description?: string;
    created_at?: string;
}

interface ProjectTeamsState {
    teams: ProjectTeam[];
    loading: boolean;
    error: string | null;
}

const initialState: ProjectTeamsState = {
    teams: [],
    loading: false,
    error: null,
};

// Helper to get headers
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

const getBaseUrl = () => localStorage.getItem('baseUrl');

export const fetchProjectTeams = createAsyncThunk(
    "projectTeams/fetchProjectTeams",
    async (_, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`https://${baseUrl}/project_teams.json`, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to get project teams');
        }
    }
);

export const createProjectTeam = createAsyncThunk(
    "projectTeams/createProjectTeam",
    async (data: any, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            // Wrap in project_team key if API expects it, based on typical Rails patterns
            // The previous code passed 'data' directly, we'll assume the caller formats it or we wrap it.
            const payload = data.project_team ? data : { project_team: data };

            const response = await axios.post(`https://${baseUrl}/project_teams.json`, payload, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to create project team');
        }
    }
);

export const updateProjectTeam = createAsyncThunk(
    "projectTeams/updateProjectTeam",
    async ({ id, data }: { id: number, data: any }, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            const payload = data.project_team ? data : { project_team: data };

            const response = await axios.put(`https://${baseUrl}/project_teams/${id}.json`, payload, {
                headers: getHeaders()
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to update project team');
        }
    }
);

export const deleteProjectTeam = createAsyncThunk(
    "projectTeams/deleteProjectTeam",
    async (id: number, { rejectWithValue }) => {
        try {
            const baseUrl = getBaseUrl();
            await axios.delete(`https://${baseUrl}/project_teams/${id}.json`, {
                headers: getHeaders()
            });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error || error.message || 'Failed to delete project team');
        }
    }
);


const projectTeamsSlice = createSlice({
    name: "projectTeams",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchProjectTeams.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectTeams.fulfilled, (state, action) => {
                state.loading = false;
                state.teams = action.payload;
            })
            .addCase(fetchProjectTeams.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createProjectTeam.fulfilled, (state, action) => {
                // state.teams.push(action.payload); // Or refetch
            })
            // Update
            .addCase(updateProjectTeam.fulfilled, (state, action) => {
                // Update logic
            })
            // Delete
            .addCase(deleteProjectTeam.fulfilled, (state, action) => {
                state.teams = state.teams.filter(t => t.id !== action.payload);
            });
    }
});

export const { clearError } = projectTeamsSlice.actions;
export const projectTeamsReducer = projectTeamsSlice.reducer;