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

export const materialPRChange = createAsyncThunk(
    "materialPRChange",
    async ({ id, baseUrl, token }: { id: number, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/${id}/pms_po_inventories.json`, {
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

export const getUnits = createAsyncThunk(
    "getUnits",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/get_details.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch units'
            return rejectWithValue(message)
        }
    }
)

export const createPurchaseOrder = createAsyncThunk(
    "createPurchaseOrder",
    async ({ data, baseUrl, token }: { data: any, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/purchase_orders.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to create work order'
            return rejectWithValue(message)
        }
    }
)

const getPurchaseOrdersSlice = createApiSlice("getPurchaseOrders", getPurchaseOrders);
const getUnitsSlice = createApiSlice("getUnits", getUnits);
const materialPRChangeSlice = createApiSlice("materialPRChange", materialPRChange);
const createPurchaseOrderSlice = createApiSlice("createPurchaseOrder", createPurchaseOrder);

export const getPurchaseOrdersReducer = getPurchaseOrdersSlice.reducer
export const getUnitsReducer = getUnitsSlice.reducer
export const materialPRChangeReducer = materialPRChangeSlice.reducer
export const createPurchaseOrderReducer = createPurchaseOrderSlice.reducer