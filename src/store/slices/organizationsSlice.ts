import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchOrganizations = createAsyncThunk(
    "fetchOrganizations",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/organizations.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get organizations'
            return rejectWithValue(message)
        }
    }
)

export const createOrganization = createAsyncThunk(
    "createOrganization",
    async ({ data, baseUrl, token }: { data: any, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/organizations.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create organization'
            return rejectWithValue(message)
        }
    }
)

export const updateOrganization = createAsyncThunk(
    "updateOrganization",
    async ({ data, baseUrl, token, id }: { data: any, baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/organizations/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to update organization'
            return rejectWithValue(message)
        }
    }
)

const organizationsSlice = createApiSlice("fetchOrganizations", fetchOrganizations)
const createOrganizationSlice = createApiSlice("createOrganization", createOrganization)
const updateOrganizationSlice = createApiSlice("updateOrganization", updateOrganization)

export const organizationsReducer = organizationsSlice.reducer
export const createOrganizationReducer = createOrganizationSlice.reducer
export const updateOrganizationReducer = updateOrganizationSlice.reducer