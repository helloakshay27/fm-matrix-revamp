import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const getCustomerList = createAsyncThunk(
    "getCustomerList",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/entities.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get suppliers'
            return rejectWithValue(message)
        }
    }
)

const getCustomerListSlice = createApiSlice("getCustomerList", getCustomerList);

export const getCustomerListReducer = getCustomerListSlice.reducer