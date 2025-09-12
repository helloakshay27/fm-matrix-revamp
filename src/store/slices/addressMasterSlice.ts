import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchAddresses = createAsyncThunk(
    "fetchAddresses",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/billing_addresses.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get addresses'
            return rejectWithValue(message)
        }
    }
)

export const createAddress = createAsyncThunk(
    "createAddress",
    async ({ data, baseUrl, token }: { data: any, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/billing_addresses/add_address.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create address'
            return rejectWithValue(message)
        }
    }
)

export const getAddressById = createAsyncThunk(
    "getAddressById",
    async ({ id, baseUrl, token }: { id: string, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/billing_addresses/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get address'
            return rejectWithValue(message)
        }
    }
)

const fetchAddressesSlice = createApiSlice("fetchAddresses", fetchAddresses);
const createAddressSlice = createApiSlice("createAddress", createAddress);

export const fetchAddressesReducer = fetchAddressesSlice.reducer
export const createAddressReducer = createAddressSlice.reducer