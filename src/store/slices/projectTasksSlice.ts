import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchProjectTasks = createAsyncThunk(
    "fetchProjectTasks",
    async ({ token, baseUrl, id }: { token: string, baseUrl: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/task_managements.json?q[milestone_id_eq]=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch project tasks'
            return rejectWithValue(message)
        }
    }
)

export const createProjectTask = createAsyncThunk(
    "createProjectTask",
    async ({ token, baseUrl, data }: { token: string, baseUrl: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/task_managements.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create project task'
            return rejectWithValue(message)
        }
    }
)

const fetchProjectTasksSlice = createApiSlice("fetchProjectTasks", fetchProjectTasks)
const createProjectTaskSlice = createApiSlice("createProjectTask", createProjectTask)

export const fetchProjectTasksReducer = fetchProjectTasksSlice.reducer
export const createProjectTaskReducer = createProjectTaskSlice.reducer