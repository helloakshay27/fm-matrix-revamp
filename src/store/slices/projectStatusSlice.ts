import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchProjectStatuses = createAsyncThunk(
    "fetchProjectStatuses",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_statuses.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get statuses'
            return rejectWithValue(message)
        }
    }
)

export const createProjectStatuses = createAsyncThunk(
    "fetchProjectStatuses",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/project_statuses.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create statuses'
            return rejectWithValue(message)
        }
    }
)
export const updateProjectStatuses = createAsyncThunk(
    "updateProjectStatuses",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/project_statuses/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get statuses'
            return rejectWithValue(message)
        }
    }
)

const fetchProjectStatusesSlice = createApiSlice("fetchProjectStatuses", fetchProjectStatuses);
const createProjectStatusesSlice = createApiSlice("createProjectStatuses", createProjectStatuses);
const updateProjectStatusesSlice = createApiSlice("updateProjectStatuses", updateProjectStatuses);

export const fetchProjectStatusesReducer = fetchProjectStatusesSlice.reducer
export const createProjectStatusesReducer = createProjectStatusesSlice.reducer
export const updateProjectStatusesReducer = updateProjectStatusesSlice.reducer