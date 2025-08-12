import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import createApiSlice from "../api/apiSlice"

export const getSuppliers = createAsyncThunk(
    'getSuppliers',
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/get_suppliers.json`, {
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

export const getPlantDetails = createAsyncThunk(
    'getPlantDetails',
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/get_plant_detail.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get plants'
            return rejectWithValue(message)
        }
    }
)

export const getAddresses = createAsyncThunk(
    'getAddresses',
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/get_admin_invoice_addresses.json`, {
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

export const getInventories = createAsyncThunk(
    'getInventories',
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/inventories/get_inventories_for_purchase_order.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get inventories'
            return rejectWithValue(message)
        }
    }
)

export const createMaterialPR = createAsyncThunk(
    'createMaterialPR',
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/purchase_orders.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create material PR'
            return rejectWithValue(message)
        }
    }
)

const getSuppliersSlice = createApiSlice("getSuppliers", getSuppliers);
const getPlantDetailsSlice = createApiSlice("getPlantDetails", getPlantDetails);
const getAddressesSlice = createApiSlice("getAddresses", getAddresses);
const getInventoriesSlice = createApiSlice("getInventories", getInventories);
const createMaterialPRSlice = createApiSlice("createMaterialPR", createMaterialPR);

export const getSuppliersReducer = getSuppliersSlice.reducer
export const getPlantDetailsReducer = getPlantDetailsSlice.reducer
export const getAddressesReducer = getAddressesSlice.reducer
export const getInventoriesReducer = getInventoriesSlice.reducer
export const createMaterialPRReducer = createMaterialPRSlice.reducer