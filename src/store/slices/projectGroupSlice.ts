import { createAsyncThunk } from "@reduxjs/toolkit";
import createApiSlice from "../api/apiSlice";
import axios from "axios";

export interface ProjectGroup {
    id: number;
    name: string;
    created_by_id: number;
    user_ids: number[];
    active: boolean;
    created_at?: string;
    updated_at?: string;
    users?: { id: number; name: string }[]; // Assuming the API returns user details or we map them manually
}

export interface ProjectGroupResponse {
    project_groups: ProjectGroup[];
}

// Fetch Project Groups
export const fetchProjectGroups = createAsyncThunk(
    "projectGroups/fetchProjectGroups",
    async (
        { baseUrl, token, page = 1, perPage = 10 }: { baseUrl: string; token: string, page?: number, perPage?: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/project_groups.json?page=${page}&per_page=${perPage}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data || "Failed to fetch project groups"
            );
        }
    }
);

// Create Project Group
export const createProjectGroup = createAsyncThunk(
    "projectGroups/createProjectGroup",
    async (
        { baseUrl, token, payload }: { baseUrl: string; token: string; payload: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/project_groups.json`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create project group";
            return rejectWithValue(message);
        }
    }
);

// Update Project Group
export const updateProjectGroup = createAsyncThunk(
    "projectGroups/updateProjectGroup",
    async (
        { baseUrl, token, id, payload }: { baseUrl: string; token: string; id: number; payload: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/project_groups/${id}.json`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to update project group";
            return rejectWithValue(message);
        }
    }
);

// Delete Project Group
export const deleteProjectGroup = createAsyncThunk(
    "projectGroups/deleteProjectGroup",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.delete(
                `https://${baseUrl}/project_groups/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return { id, ...response.data };
        } catch (error: any) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to delete project group";
            return rejectWithValue(message);
        }
    }
);

const fetchProjectGroupsSlice = createApiSlice("fetchProjectGroups", fetchProjectGroups);
const createProjectGroupSlice = createApiSlice("createProjectGroup", createProjectGroup);
const updateProjectGroupSlice = createApiSlice("updateProjectGroup", updateProjectGroup);
const deleteProjectGroupSlice = createApiSlice("deleteProjectGroup", deleteProjectGroup);

export const fetchProjectGroupsReducer = fetchProjectGroupsSlice.reducer;
export const createProjectGroupReducer = createProjectGroupSlice.reducer;
export const updateProjectGroupReducer = updateProjectGroupSlice.reducer;
export const deleteProjectGroupReducer = deleteProjectGroupSlice.reducer;
