import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const getPurchaseOrders = createAsyncThunk(
    "getPurchaseOrders",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders.json`, {
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

const getPurchaseOrdersSlice = createApiSlice("getPurchaseOrders", getPurchaseOrders);

export const getPurchaseOrdersReducer = getPurchaseOrdersSlice.reducer