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
    })

const fetchProjectsSlice = createApiSlice("fetchProjects", fetchProjects);
const createProjectSlice = createApiSlice("createProject", createProject);

export const fetchProjectsReducer = fetchProjectsSlice.reducer;
export const createProjectReducer = createProjectSlice.reducer;