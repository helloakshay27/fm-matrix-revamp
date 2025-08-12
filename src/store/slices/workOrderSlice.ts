import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchWorkOrders = createAsyncThunk(
    "fetchWorkOrders",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_orders.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch work orders'
            return rejectWithValue(message)
        }
    }
)

const fetchWorkOrdersSlice = createApiSlice("fetchWorkOrders", fetchWorkOrders);

export const fetchWorkOrdersReducer = fetchWorkOrdersSlice.reducer