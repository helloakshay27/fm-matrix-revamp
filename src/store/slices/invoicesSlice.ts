import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const getInvoinces = createAsyncThunk(
    "getInvoinces",
    async ({ baseUrl, token, page }: { baseUrl: string, token: string, page?: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_order_invoices.json?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get invoices'
            return rejectWithValue(message)
        }
    }
)

export const getInvoiceById = createAsyncThunk(
    "getInvoiceById",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_order_invoices/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get invoice by id'
            return rejectWithValue(message)
        }
    }
)

export const approveInvoice = createAsyncThunk(
    "approveInvoice",
    async ({ baseUrl, token, id, data }: { baseUrl: string, token: string, id: number, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_order_invoices/${id}/status_confirmation.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: data
            })
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to approve invoice'
            return rejectWithValue(message)
        }
    }
)

export const getInvoiceFeeds = createAsyncThunk(
    "getInvoiceFeeds",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_order_invoices/${id}/feeds.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get invoice feeds'
            return rejectWithValue(message)
        }
    }
)

const getInvoincesSlice = createApiSlice("getInvoinces", getInvoinces)
const getInvoiceByIdSlice = createApiSlice("getInvoiceById", getInvoiceById);
const approveInvoiceSlice = createApiSlice("approveInvoice", approveInvoice);
const getInvoiceFeedsSlice = createApiSlice("getInvoiceFeeds", getInvoiceFeeds);

export const getInvoincesReducer = getInvoincesSlice.reducer
export const getInvoiceByIdReducer = getInvoiceByIdSlice.reducer
export const approveInvoiceReducer = approveInvoiceSlice.reducer
export const getInvoiceFeedsReducer = getInvoiceFeedsSlice.reducer
