import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const getPurchaseOrders = createAsyncThunk(
    "getPurchaseOrders",
    async (
        {
            baseUrl,
            token,
            page,
            reference_number,
            external_id,
            supplier_name,
        }: {
            baseUrl: string;
            token: string;
            page?: number;
            reference_number?: string;
            external_id?: string;
            supplier_name?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const queryParams = new URLSearchParams();
            if (reference_number) queryParams.append('q[reference_number_eq]', reference_number);
            if (external_id) queryParams.append('q[external_id_eq]', external_id);
            if (supplier_name) queryParams.append('q[pms_supplier_company_name_cont]', supplier_name);

            const response = await axios.get(
                `https://${baseUrl}/pms/purchase_orders.json?page=${page}${queryParams.toString() ? `&${queryParams}` : ''}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch purchase orders';
            return rejectWithValue(message);
        }
    }
);

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

export const approvePO = createAsyncThunk(
    "approvePO",
    async ({ id, baseUrl, token, data }: { id: number, baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/pms/purchase_orders/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to approve work order'
            return rejectWithValue(message)
        }
    }
)

export const rejectPO = createAsyncThunk(
    "rejectPO",
    async ({ id, baseUrl, token, data }: { id: number, baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/${id}/status_confirmation.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: data
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to reject work order'
            return rejectWithValue(message)
        }
    }
)

const getPurchaseOrdersSlice = createApiSlice("getPurchaseOrders", getPurchaseOrders);
const getUnitsSlice = createApiSlice("getUnits", getUnits);
const materialPRChangeSlice = createApiSlice("materialPRChange", materialPRChange);
const createPurchaseOrderSlice = createApiSlice("createPurchaseOrder", createPurchaseOrder);
const approvePOSlice = createApiSlice("approvePO", approvePO);
const rejectPOSlice = createApiSlice("rejectPO", rejectPO);

export const getPurchaseOrdersReducer = getPurchaseOrdersSlice.reducer
export const getUnitsReducer = getUnitsSlice.reducer
export const materialPRChangeReducer = materialPRChangeSlice.reducer
export const createPurchaseOrderReducer = createPurchaseOrderSlice.reducer
export const approvePOReducer = approvePOSlice.reducer
export const rejectPOReducer = rejectPOSlice.reducer