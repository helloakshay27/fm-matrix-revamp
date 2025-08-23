import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchWorkOrders = createAsyncThunk(
    "fetchWorkOrders",
    async (
        {
            baseUrl,
            token,
            reference_number,
            external_id,
            supplier_name,
        }: {
            baseUrl: string;
            token: string;
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
                `https://${baseUrl}/pms/work_orders.json${queryParams.toString() ? `?${queryParams}` : ''}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message || error.message || 'Failed to fetch work orders';
            return rejectWithValue(message);
        }
    }
);

export const getWorkOrderById = createAsyncThunk(
    "getWorkOrderById",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_orders/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to get work order by id'
            return rejectWithValue(message)
        }
    }
)

export const approveRejectWO = createAsyncThunk(
    "approveWO",
    async ({ id, baseUrl, token, data }: { id: number, baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_orders/${id}/status_confirmation.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: data
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to approve work order'
            return rejectWithValue(message)
        }
    }
)

export const fetchBOQ = createAsyncThunk(
    "fetchBOQ",
    async ({ id, baseUrl, token }: { id: number, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_orders/${id}/inventories`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch BOQ'
            return rejectWithValue(message)
        }
    }
)

export const addWOInvoice = createAsyncThunk(
    "addWOInvoice",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/work_order_invoices.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to add work order invoice'
            return rejectWithValue(message)
        }
    }
)

const fetchWorkOrdersSlice = createApiSlice("fetchWorkOrders", fetchWorkOrders);
const getWorkOrderByIdSlice = createApiSlice("getWorkOrderById", getWorkOrderById);
const approveRejectWOSlice = createApiSlice("approveWO", approveRejectWO);
const fetchBOQSlice = createApiSlice("fetchBOQ", fetchBOQ);
const addWOInvoiceSlice = createApiSlice("addWOInvoice", addWOInvoice);

export const fetchWorkOrdersReducer = fetchWorkOrdersSlice.reducer
export const getWorkOrderByIdReducer = getWorkOrderByIdSlice.reducer
export const approveRejectWOReducer = approveRejectWOSlice.reducer
export const fetchBOQReducer = fetchBOQSlice.reducer
export const addWOInvoiceReducer = addWOInvoiceSlice.reducer