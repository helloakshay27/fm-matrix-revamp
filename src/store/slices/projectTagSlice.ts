import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchProjectsTags = createAsyncThunk(
    "fetchProjectsTags",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/company_tags.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get tags'
            return rejectWithValue(message)
        }
    }
)

export const createProjectsTags = createAsyncThunk(
    "createProjectsTags",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/company_tags.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create tags'
            return rejectWithValue(message)
        }
    }
)

export const updateProjectsTags = createAsyncThunk(
    "updateProjectsTags",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/company_tags/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to update tags'
            return rejectWithValue(message)
        }
    }
)

const fetchProjectsTagsSlice = createApiSlice("fetchProjectsTags", fetchProjectsTags)
const createProjectsTagsSlice = createApiSlice("createProjectsTags", createProjectsTags)
const updateProjectsTagsSlice = createApiSlice("updateProjectsTags", updateProjectsTags)

export const fetchProjectsTagsReducer = fetchProjectsTagsSlice.reducer
export const createProjectsTagsReducer = createProjectsTagsSlice.reducer
export const updateProjectsTagsReducer = updateProjectsTagsSlice.reducer