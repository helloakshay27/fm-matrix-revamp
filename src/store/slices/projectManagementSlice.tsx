import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import createApiSlice from "../api/apiSlice"

export const fetchProjects = createAsyncThunk(
    'fetchProjects',
    async ({ token, baseUrl }: { token: string, baseUrl: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_managements.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get projects'
            return rejectWithValue(message)
        }
    })

export const createProject = createAsyncThunk(
    'createProject',
    async ({ token, baseUrl, data }: { token: string, baseUrl: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/project_managements.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create project'
            return rejectWithValue(message)
        }
    }
)

export const fetchProjectById = createAsyncThunk(
    'fetchProjectById',
    async ({ token, baseUrl, id }: { token: string, baseUrl: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_managements/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get project'
            return rejectWithValue(message)
        }
    }
)

export const changeProjectStatus = createAsyncThunk(
    'changeProjectStatus',
    async ({ token, baseUrl, id, payload }: { token: string, baseUrl: string, id: string, payload: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/project_managements/${id}.json`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to change project status'
            return rejectWithValue(message)
        }
    }
)

const fetchProjectsSlice = createApiSlice("fetchProjects", fetchProjects);
const createProjectSlice = createApiSlice("createProject", createProject);
const fetchProjectByIdSlice = createApiSlice("fetchProjectById", fetchProjectById);
const changeProjectStatusSlice = createApiSlice("changeProjectStatus", changeProjectStatus);

export const fetchProjectsReducer = fetchProjectsSlice.reducer;
export const createProjectReducer = createProjectSlice.reducer;
export const fetchProjectByIdReducer = fetchProjectByIdSlice.reducer;
export const changeProjectStatusReducer = changeProjectStatusSlice.reducer;