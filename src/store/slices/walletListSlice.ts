import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchCardCount = createAsyncThunk(
    "fetchCardCount",
    async (
        { baseUrl, token }: { baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/admin_wallet_counts.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch card count";
            return rejectWithValue(message);
        }
    }
);

export const fetchWalletList = createAsyncThunk(
    "fetchWalletList",
    async (
        { baseUrl, token }: { baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/admin_wallet_list.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch wallet list";
            return rejectWithValue(message);
        }
    }
);

export const fetchTransactionHistory = createAsyncThunk(
    "fetchTransactionHistory",
    async (
        { baseUrl, token }: { baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/admin_wallet_transactions.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch transaction history";
            return rejectWithValue(message);
        }
    }
);

export const fetchWalletDetails = createAsyncThunk(
    "fetchWalletDetails",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/get_admin_wallet_detail.json?id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch wallet details";
            return rejectWithValue(message);
        }
    }
);

export const fetchRecurringRules = createAsyncThunk(
    "fetchRecurringRules",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/get_wallet_recurring_rules.json?entity_id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch recurring rules";
            return rejectWithValue(message);
        }
    }
);

export const fetchCustomers = createAsyncThunk(
    "fetchCustomers",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/entities_by_site/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch customers";
            return rejectWithValue(message);
        }
    }
);

export const createRule = createAsyncThunk(
    "createRule",
    async (
        {
            baseUrl,
            token,
            data,
            id,
        }: { baseUrl: string; token: string; data: any; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/create_recurring_rule.json?entity_id=${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to create rule";
            return rejectWithValue(message);
        }
    }
);

export const fetchWalletDetailsTransactionHistory = createAsyncThunk(
    "fetchWalletDetailsTransactionHistory",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/get_entity_wise_wallet_transaction.json?entity_id=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch wallet details transaction history";
            return rejectWithValue(message);
        }
    }
);

export const topupWallet = createAsyncThunk(
    "topupWallet",
    async (
        { baseUrl, token, data }: { baseUrl: string; token: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/add_admin_complimentary_points.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to topup wallet";
            return rejectWithValue(message);
        }
    }
);

const fetchCardCountSlice = createApiSlice("fetchCardCount", fetchCardCount);
const fetchWalletListSlice = createApiSlice("fetchWalletList", fetchWalletList);
const fetchTransactionHistorySlice = createApiSlice(
    "fetchTransactionHistory",
    fetchTransactionHistory
);
const fetchWalletDetailsSlice = createApiSlice(
    "fetchWalletDetails",
    fetchWalletDetails
);
const fetchRecurringRulesSlice = createApiSlice(
    "fetchRecurringRules",
    fetchRecurringRules
);
const fetchCustomersSlice = createApiSlice("fetchCustomers", fetchCustomers);
const createRuleSlice = createApiSlice("createRule", createRule);
const fetchWalletDetailsTransactionHistorySlice = createApiSlice(
    "fetchWalletDetailsTransactionHistory",
    fetchWalletDetailsTransactionHistory
);
const topupWalletSlice = createApiSlice("topupWallet", topupWallet);

export const fetchCardCountReducer = fetchCardCountSlice.reducer;
export const fetchWalletListReducer = fetchWalletListSlice.reducer;
export const fetchTransactionHistoryReducer =
    fetchTransactionHistorySlice.reducer;
export const fetchWalletDetailsReducer = fetchWalletDetailsSlice.reducer;
export const fetchRecurringRulesReducer = fetchRecurringRulesSlice.reducer;
export const fetchCustomersReducer = fetchCustomersSlice.reducer;
export const createRuleReducer = createRuleSlice.reducer;
export const fetchWalletDetailsTransactionHistoryReducer =
    fetchWalletDetailsTransactionHistorySlice.reducer;
export const topupWalletReducer = topupWalletSlice.reducer;
