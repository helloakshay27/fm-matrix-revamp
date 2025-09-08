import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const getGRN = createAsyncThunk(
    "getGRN",
    async ({ baseUrl, token, page }: { baseUrl: string, token: string, page: number }, { rejectWithValue }) => {
        console.log(page)
        try {
            const response = await axios.get(`https://${baseUrl}/pms/grns.json?page=${page}`, {
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

export const getPurchaseOrdersList = createAsyncThunk(
    "getPurchaseOrdersList",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/grns/get_po_details.json`, {
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

export const fetchSupplierDetails = createAsyncThunk(
    "fetchSupplierDetails",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/${id}/supplier.json`, {
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

export const fetchItemDetails = createAsyncThunk(
    "fetchItemDetails",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/${id}/pms_po_inventories.json`, {
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

export const createGRN = createAsyncThunk(
    'createGRN',
    async ({ data, baseUrl, token }: { data: any, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/grns.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create GRN'
            return rejectWithValue(message)
        }
    }
)

export const editGRN = createAsyncThunk(
    'editGRN',
    async ({ data, baseUrl, token, id }: { data: any, baseUrl: string, token: string, id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/pms/grns/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create GRN'
            return rejectWithValue(message)
        }
    }
)

// Fetch single GRN by ID
export const fetchSingleGRN = createAsyncThunk(
    'fetchSingleGRN',
    async ({ id, baseUrl, token }: { id: number, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/grns/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch GRN';
            return rejectWithValue(message);
        }
    }
);

// Approve GRN
export const approveGRN = createAsyncThunk(
    'approveGRN',
    async ({ id, baseUrl, token, data }: { id: number, baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/pms/grns/${id}/update_approval.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to approve GRN';
            return rejectWithValue(message);
        }
    }
);

export const rejectGrn = createAsyncThunk(
    'rejectGrn',
    async ({ id, baseUrl, token, data }: { id: number, baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/pms/grns/${id}/update_approval.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to reject GRN';
            return rejectWithValue(message);
        }
    }
);

export const getGRNFeeds = createAsyncThunk(
    'getGRNFeeds',
    async ({ id, baseUrl, token }: { id: number, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/grns/${id}/feeds.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch GRN feeds';
            return rejectWithValue(message);
        }
    }
)

const getGRNSlice = createApiSlice("getGRN", getGRN);
const getPurchaseOrdersListSlice = createApiSlice("getPurchaseOrdersList", getPurchaseOrdersList);
const fetchSupplierDetailsSlice = createApiSlice("fetchSupplierDetails", fetchSupplierDetails);
const fetchItemDetailsSlice = createApiSlice("fetchItemDetails", fetchItemDetails);
const createGRNSlice = createApiSlice("createGRN", createGRN);
const fetchSingleGRNSlice = createApiSlice("fetchSingleGRN", fetchSingleGRN);
const approveGRNSlice = createApiSlice("approveGRN", approveGRN);
const rejectGrnSlice = createApiSlice("rejectGrn", rejectGrn);
const getGRNFeedsSlice = createApiSlice("getGRNFeeds", getGRNFeeds);
const editGRNSlice = createApiSlice("editGRN", editGRN);

export const getGRNReducer = getGRNSlice.reducer
export const getPurchaseOrdersListReducer = getPurchaseOrdersListSlice.reducer
export const fetchSupplierDetailsReducer = fetchSupplierDetailsSlice.reducer
export const fetchItemDetailsReducer = fetchItemDetailsSlice.reducer
export const createGRNReducer = createGRNSlice.reducer
export const fetchSingleGRNReducer = fetchSingleGRNSlice.reducer
export const approveGRNReducer = approveGRNSlice.reducer
export const rejectGrnReducer = rejectGrnSlice.reducer
export const getGRNFeedsReducer = getGRNFeedsSlice.reducer
export const editGRNReducer = editGRNSlice.reducer
