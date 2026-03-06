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

export const getCustomerById = createAsyncThunk(
    "getCustomerById",
    async ({ id, baseUrl, token }: { id: number, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/entities/${id}.json`, {
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

export const createCustomer = createAsyncThunk(
    "createCustomer",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/entities.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const responseData = error.response?.data;
            let message = 'Failed to create customer';
            if (Array.isArray(responseData)) {
                message = responseData.join(', ');
            } else if (typeof responseData === 'string') {
                message = responseData;
            } else if (responseData?.error) {
                message = Array.isArray(responseData.error) ? responseData.error.join(', ') : responseData.error;
            } else if (responseData?.message) {
                message = responseData.message;
            } else if (responseData?.errors) {
                message = Array.isArray(responseData.errors) ? responseData.errors.join(', ') : responseData.errors;
            }
            return rejectWithValue(message);
        }
    }
)

export const editCustomer = createAsyncThunk(
    "editCustomer",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/entities/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create customer'
            return rejectWithValue(message)
        }
    }
)

const getCustomerListSlice = createApiSlice("getCustomerList", getCustomerList);
const getCustomerByIdSlice = createApiSlice("getCustomerById", getCustomerById);
const createCustomerSlice = createApiSlice("createCustomer", createCustomer);
const editCustomerSlice = createApiSlice("editCustomer", editCustomer);

export const getCustomerListReducer = getCustomerListSlice.reducer
export const getCustomerByIdReducer = getCustomerByIdSlice.reducer
export const createCustomerReducer = createCustomerSlice.reducer
export const editCustomerReducer = editCustomerSlice.reducer
