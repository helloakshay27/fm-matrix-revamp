import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

// Fetch all sprints with optional filtering
export const fetchSprints = createAsyncThunk(
    "fetchSprints",
    async ({ token, baseUrl, filters }: { token: string; baseUrl: string; filters?: any }, { rejectWithValue }) => {
        try {
            let url = `https://${baseUrl}/sprints.json`;

            // Add filters if provided
            if (filters) {
                const params = new URLSearchParams(filters).toString();
                url += `?${params}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to fetch sprints";
            return rejectWithValue(message);
        }
    }
);

// Fetch single sprint by ID
export const fetchSprintById = createAsyncThunk(
    "fetchSprintById",
    async ({ token, baseUrl, id }: { token: string; baseUrl: string; id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/sprints/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to fetch sprint";
            return rejectWithValue(message);
        }
    }
);

// Create new sprint
export const createSprint = createAsyncThunk(
    "createSprint",
    async (
        { token, baseUrl, data }: { token: string; baseUrl: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/sprints.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to create sprint";
            return rejectWithValue(message);
        }
    }
);

// Update existing sprint
export const updateSprint = createAsyncThunk(
    "updateSprint",
    async (
        { token, baseUrl, id, data }: { token: string; baseUrl: string; id: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/sprints/${id}.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to update sprint";
            return rejectWithValue(message);
        }
    }
);

// Update sprint status
export const updateSprintStatus = createAsyncThunk(
    "updateSprintStatus",
    async (
        { token, baseUrl, id, data }: { token: string; baseUrl: string; id: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/sprints/${id}/update_status.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to update sprint status";
            return rejectWithValue(message);
        }
    }
);

// Delete sprint
export const deleteSprint = createAsyncThunk(
    "deleteSprint",
    async ({ token, baseUrl, id }: { token: string; baseUrl: string; id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `https://${baseUrl}/sprints/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to delete sprint";
            return rejectWithValue(message);
        }
    }
);

// Filter sprints with query parameters
export const filterSprints = createAsyncThunk(
    "filterSprints",
    async (
        { token, baseUrl, filters }: { token: string; baseUrl: string; filters: any },
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await axios.get(
                `https://${baseUrl}/sprints.json?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to filter sprints";
            return rejectWithValue(message);
        }
    }
);

// Create slices using the createApiSlice helper
const fetchSprintsSlice = createApiSlice("fetchSprints", fetchSprints);
const fetchSprintByIdSlice = createApiSlice("fetchSprintById", fetchSprintById);
const createSprintSlice = createApiSlice("createSprint", createSprint);
const updateSprintSlice = createApiSlice("updateSprint", updateSprint);
const updateSprintStatusSlice = createApiSlice("updateSprintStatus", updateSprintStatus);
const deleteSprintSlice = createApiSlice("deleteSprint", deleteSprint);
const filterSprintsSlice = createApiSlice("filterSprints", filterSprints);

// Export reducers
export const fetchSprintsReducer = fetchSprintsSlice.reducer;
export const fetchSprintByIdReducer = fetchSprintByIdSlice.reducer;
export const createSprintReducer = createSprintSlice.reducer;
export const updateSprintReducer = updateSprintSlice.reducer;
export const updateSprintStatusReducer = updateSprintStatusSlice.reducer;
export const deleteSprintReducer = deleteSprintSlice.reducer;
export const filterSprintsReducer = filterSprintsSlice.reducer;
