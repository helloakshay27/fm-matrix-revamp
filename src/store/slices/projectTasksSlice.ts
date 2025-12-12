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
            return rejectWithValue(error)
        }
    }
)

export const editProjectTask = createAsyncThunk(
    "editProjectTask",
    async ({ token, baseUrl, id, data }: { token: string, baseUrl: string, id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/task_managements/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error
            return rejectWithValue(message)
        }
    }
)

export const updateTaskStatus = createAsyncThunk(
    "updateTaskStatus",
    async ({ token, baseUrl, id, data }: { token: string, baseUrl: string, id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/task_managements/${id}/update_status.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error
            return rejectWithValue(message)
        }
    }
)

export const fetchProjectTasksById = createAsyncThunk('fetchProjectTasksById', async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`https://${baseUrl}/task_managements/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error);
    }
})

export const filterTasks = createAsyncThunk(
    "filterTasks",
    async ({ token, baseUrl, params }: { token: string, baseUrl: string, params: any }, { rejectWithValue }) => {
        console.log(params)
        try {
            const response = await axios.get(`https://${baseUrl}/task_managements.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to filter tasks'
            return rejectWithValue(message)
        }
    }
)

export const fetchUserAvailability = createAsyncThunk('fetchUserAvailability', async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`https://${baseUrl}/users/${id}/daily_task_load_report.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        const message = error.response?.data?.error || error.error || 'Failed to fetch user availability'
        return rejectWithValue(message)
    }
})

export const fetchTargetDateTasks = createAsyncThunk('fetchTargetDateTasks', async ({ baseUrl, token, id, date }: { baseUrl: string, token: string, id: string, date: string }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`https://${baseUrl}/task_managements/filtered_tasks.json?allocation_date=${date}&responsible_person_id=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

const fetchProjectTasksSlice = createApiSlice("fetchProjectTasks", fetchProjectTasks)
const createProjectTaskSlice = createApiSlice("createProjectTask", createProjectTask)
const fetchProjectTasksByIdSlice = createApiSlice("fetchProjectTasksById", fetchProjectTasksById)
const fetchUserAvailabilitySlice = createApiSlice("fetchUserAvailability", fetchUserAvailability)
const fetchTargetDateTasksSlice = createApiSlice("fetchTargetDateTasks", fetchTargetDateTasks)
const editProjectTaskSlice = createApiSlice("editProjectTask", editProjectTask)
const filterTasksSlice = createApiSlice("filterTasks", filterTasks)
const updateTaskStatusSlice = createApiSlice("updateTaskStatus", updateTaskStatus)

export const fetchProjectTasksReducer = fetchProjectTasksSlice.reducer
export const createProjectTaskReducer = createProjectTaskSlice.reducer
export const fetchProjectTasksByIdReducer = fetchProjectTasksByIdSlice.reducer
export const fetchUserAvailabilityReducer = fetchUserAvailabilitySlice.reducer
export const fetchTargetDateTasksReducer = fetchTargetDateTasksSlice.reducer
export const editProjectTaskReducer = editProjectTaskSlice.reducer
export const filterTasksReducer = filterTasksSlice.reducer
export const updateTaskStatusReducer = updateTaskStatusSlice.reducer
