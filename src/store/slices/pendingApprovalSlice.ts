import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchPendingApprovals = createAsyncThunk(
    "fetchPendingApprovals",
    async ({ baseUrl, token, page, search = "", type = "" }: { baseUrl: string, token: string, page?: number, search?: string, type?: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/pending_approvals.json?page=${page}&pr_no=${search}&type=${type}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get pending approvals'
            return rejectWithValue(message)
        }
    }
)

export const fetchDeletionRequests = createAsyncThunk(
    "fetchDeletionRequests",
    async ({ baseUrl, token, page }: { baseUrl: string, token: string, page?: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/pending_approvals_deletion_requests.json?page=${page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const approveDeletionRequest = createAsyncThunk(
    "approveDeletionRequest",
    async ({ baseUrl, token, id, data }: { baseUrl: string, token: string, id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/deletion_requests/${id}/status_confirmation.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const fetchPendingApprovalsSlice = createApiSlice("fetchPendingApprovals", fetchPendingApprovals);
const fetchDeletionRequestsSlice = createApiSlice("fetchDeletionRequests", fetchDeletionRequests);
const approveDeletionRequestSlice = createApiSlice("approveDeletionRequest", approveDeletionRequest);

export const fetchPendingApprovalsReducer = fetchPendingApprovalsSlice.reducer
export const fetchDeletionRequestsReducer = fetchDeletionRequestsSlice.reducer
export const approveDeletionRequestReducer = approveDeletionRequestSlice.reducer
