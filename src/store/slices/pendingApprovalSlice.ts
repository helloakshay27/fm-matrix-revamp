import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchPendingApprovals = createAsyncThunk(
    "fetchPendingApprovals",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/purchase_orders/pending_approvals.json`, {
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

const fetchPendingApprovalsSlice = createApiSlice("fetchPendingApprovals", fetchPendingApprovals);

export const fetchPendingApprovalsReducer = fetchPendingApprovalsSlice.reducer