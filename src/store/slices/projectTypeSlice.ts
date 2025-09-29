import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchProjectTypes = createAsyncThunk(
    "fetchProjectTypes",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_types.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get project types'
            return rejectWithValue(message)
        }
    }
)

export const createProjectTypes = createAsyncThunk(
    "createProjectTypes",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/project_types.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create project types'
            return rejectWithValue(message)
        }
    }
)

export const updateProjectTypes = createAsyncThunk(
    "updateProjectTypes",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/project_types/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to update project types'
            return rejectWithValue(message)
        }
    }
)

const fetchProjectTypesSlice = createApiSlice("fetchProjectTypes", fetchProjectTypes)
const createProjectTypesSlice = createApiSlice("createProjectTypes", createProjectTypes)
const updateProjectTypesSlice = createApiSlice("updateProjectTypes", updateProjectTypes)

export const fetchProjectTypesReducer = fetchProjectTypesSlice.reducer
export const createProjectTypesReducer = createProjectTypesSlice.reducer
export const updateProjectTypesReducer = updateProjectTypesSlice.reducer