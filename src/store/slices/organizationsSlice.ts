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

const organizationsSlice = createApiSlice("fetchOrganizations", fetchOrganizations)

export const organizationsReducer = organizationsSlice.reducer