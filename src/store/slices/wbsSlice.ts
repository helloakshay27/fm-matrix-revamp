import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchWBSList = createAsyncThunk(
    "fetchWBSList",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/wbs_costs.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get WBS'
            return rejectWithValue(message)
        }
    }
)

export const createWBSCode = createAsyncThunk(
    "createWBSCode",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/wbs_costs.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get WBS'
            return rejectWithValue(message)
        }
    }
)

export const updateWBSCode = createAsyncThunk(
    "updateWBSCode",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/wbs_costs/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get WBS'
            return rejectWithValue(message)
        }
    }
)

const fetchWBSListSlice = createApiSlice("fetchWBSList", fetchWBSList);
const createWBSCodeSlice = createApiSlice("createWBSCode", createWBSCode);
const updateWBSCodeSlice = createApiSlice("updateWBSCode", updateWBSCode);

export const fetchWBSListReducer = fetchWBSListSlice.reducer;
export const createWBSCodeReducer = createWBSCodeSlice.reducer;
export const updateWBSCodeReducer = updateWBSCodeSlice.reducer;