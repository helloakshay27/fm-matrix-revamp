import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchCompanies = createAsyncThunk(
    "fetchCompanies",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/company_setups.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get companies'
            return rejectWithValue(message)
        }
    }
)

const fetchCompaniesSlice = createApiSlice("fetchCompanies", fetchCompanies)

export const fetchCompaniesReducer = fetchCompaniesSlice.reducer