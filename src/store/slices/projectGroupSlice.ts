import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchProjectGroups = createAsyncThunk(
    "fetchProjectGroups",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_groups.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get groups'
            return rejectWithValue(message)
        }
    }
)

export const createProjectGroups = createAsyncThunk(
    "createProjectGroups",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/project_groups.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create group'
            return rejectWithValue(message)
        }
    }
)
export const updateProjectGroups = createAsyncThunk(
    "updateProjectGroups",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/project_groups/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get groups'
            return rejectWithValue(message)
        }
    }
)

const fetchProjectGroupsSlice = createApiSlice("fetchProjectGroups", fetchProjectGroups);
const createProjectGroupsSlice = createApiSlice("createProjectGroups", createProjectGroups);
const updateProjectGroupsSlice = createApiSlice("updateProjectGroups", updateProjectGroups);

export const fetchProjectGroupsReducer = fetchProjectGroupsSlice.reducer
export const createProjectGroupsReducer = createProjectGroupsSlice.reducer
export const updateProjectGroupsReducer = updateProjectGroupsSlice.reducer