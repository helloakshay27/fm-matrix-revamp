import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const getServicePr = createAsyncThunk(
    "getServicePr",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const respones = await axios.get(`https://${baseUrl}/pms/work_orders/letter_of_indents_wo.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return respones.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create material PR'
            return rejectWithValue(message)
        }
    }
)

export const createServicePR = createAsyncThunk(
    'createServicePR',
    async ({ data, baseUrl, token }: { data: any, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/work_orders.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create material PR'
            return rejectWithValue(message)
        }
    }
)

export const getServices = createAsyncThunk("getServices", async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`https://${baseUrl}/pms/services/get_services.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch services'
        return rejectWithValue(message)
    }
})

const getServicePrSlice = createApiSlice("getServicePr", getServicePr);
const createServicePRSlice = createApiSlice("createServicePR", createServicePR);
const getServicesSlice = createApiSlice("getServices", getServices);

export const getServicePrReducer = getServicePrSlice.reducer
export const createServicePRReducer = createServicePRSlice.reducer
export const getServicesReducer = getServicesSlice.reducer