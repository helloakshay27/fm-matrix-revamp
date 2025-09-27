import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchProjectUsers = createAsyncThunk(
    "fetchProjectUsers",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/users.json?q[active_eq]=true`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get users'
            return rejectWithValue(message)
        }
    }
)

export const fetchProjectInternalUsers = createAsyncThunk(
    "fetchProjectInternalUsers",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/users.json?q[user_type_eq]=internal`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get internal users'
            return rejectWithValue(message)
        }
    }
)

export const createProjectUsers = createAsyncThunk(
    "createProjectUsers",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/users.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create internal users'
            return rejectWithValue(message)
        }
    }
)

export const fetchProjectExternalUsers = createAsyncThunk(
    "fetchProjectExternalUsers",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/users.json?q[user_type_eq]=external`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get internal users'
            return rejectWithValue(message)
        }
    }
)

const fetchProjectUsersSlice = createApiSlice("fetchProjectUsers", fetchProjectUsers)
const fetchProjectInternalUsersSlice = createApiSlice("fetchProjectInternalUsers", fetchProjectInternalUsers)
const createProjectUsersSlice = createApiSlice("createProjectUsers", createProjectUsers)
const fetchProjectExternalUsersSlice = createApiSlice("fetchProjectExternalUsers", fetchProjectExternalUsers)

export const fetchProjectUsersReducer = fetchProjectUsersSlice.reducer
export const fetchProjectInternalUsersReducer = fetchProjectInternalUsersSlice.reducer
export const createProjectUsersReducer = createProjectUsersSlice.reducer
export const fetchProjectExternalUsersReducer = fetchProjectExternalUsersSlice.reducer