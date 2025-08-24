import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const getInvoinces = createAsyncThunk(
    "getInvoinces",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/work_order_invoices.json`, {
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

const getInvoincesSlice = createApiSlice("getInvoinces", getInvoinces)
const getInvoiceByIdSlice = createApiSlice("getInvoiceById", getInvoiceById);

export const getInvoincesReducer = getInvoincesSlice.reducer
export const getInvoiceByIdReducer = getInvoiceByIdSlice.reducer