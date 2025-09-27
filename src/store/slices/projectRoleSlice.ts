import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchProjectRoles = createAsyncThunk(
    "fetchProjectRoles",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/lock_roles.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get roles'
            return rejectWithValue(message)
        }
    }
)

export const createProjectRole = createAsyncThunk(
    "createProjectRole",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/lock_roles.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create role'
            return rejectWithValue(message)
        }
    }
)

export const updateProjectRole = createAsyncThunk(
    "updateProjectRole",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/lock_roles/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create role'
            return rejectWithValue(message)
        }
    }
)

export const deleteProjectRole = createAsyncThunk(
    "deleteProjectRole",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`https://${baseUrl}/lock_roles/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create role'
            return rejectWithValue(message)
        }
    }
)

const fetchProjectRolesSlice = createApiSlice("fetchProjectRoles", fetchProjectRoles)
const createProjectRoleSlice = createApiSlice("createProjectRole", createProjectRole)
const updateProjectRoleSlice = createApiSlice("updateProjectRole", updateProjectRole)
const deleteProjectRoleSlice = createApiSlice("deleteProjectRole", deleteProjectRole)

export const fetchProjectRolesReducer = fetchProjectRolesSlice.reducer
export const createProjectRoleReducer = createProjectRoleSlice.reducer
export const updateProjectRoleReducer = updateProjectRoleSlice.reducer
export const deleteProjectRoleReducer = deleteProjectRoleSlice.reducer