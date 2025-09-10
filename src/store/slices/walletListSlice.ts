import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchCardCount = createAsyncThunk(
    "fetchCardCount",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/admin_wallet_counts.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch card count'
            return rejectWithValue(message)
        }
    }
)

export const fetchWalletList = createAsyncThunk(
    "fetchWalletList",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/admin_wallet_list.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch wallet list'
            return rejectWithValue(message)
        }
    }
)

export const fetchTransactionHistory = createAsyncThunk(
    "fetchTransactionHistory",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/admin_wallet_transactions.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch transaction history'
            return rejectWithValue(message)
        }
    }
)

export const fetchWalletDetails = createAsyncThunk(
    "fetchWalletDetails",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/get_admin_wallet_detail.json?id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to fetch wallet details'
            return rejectWithValue(message)
        }
    }
)

const fetchCardCountSlice = createApiSlice("fetchCardCount", fetchCardCount)
const fetchWalletListSlice = createApiSlice("fetchWalletList", fetchWalletList)
const fetchTransactionHistorySlice = createApiSlice("fetchTransactionHistory", fetchTransactionHistory)
const fetchWalletDetailsSlice = createApiSlice("fetchWalletDetails", fetchWalletDetails)

export const fetchCardCountReducer = fetchCardCountSlice.reducer
export const fetchWalletListReducer = fetchWalletListSlice.reducer
export const fetchTransactionHistoryReducer = fetchTransactionHistorySlice.reducer
export const fetchWalletDetailsReducer = fetchWalletDetailsSlice.reducer
