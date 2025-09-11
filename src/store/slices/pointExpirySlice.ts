import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchWalletRule = createAsyncThunk(
    "fetchWalletRule",
    async (
        { baseUrl, token }: { baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/show_wallet_rule_condition.json`,
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
                "Failed to fetch wallet rule";
            return rejectWithValue(message);
        }
    }
);

export const createExpiryRule = createAsyncThunk(
    "createExpiryRule",
    async (
        { baseUrl, token, data }: { baseUrl: string; token: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/add_wallet_rule_condition.json`,
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
                "Failed to create wallet rule";
            return rejectWithValue(message);
        }
    }
);

export const editExpiryRule = createAsyncThunk(
    "editExpiryRule",
    async (
        { baseUrl, token, ruleData, formData }: { baseUrl: string; token: string; ruleData: any; formData: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/update_wallet_rule_condition.json?rule_id=${ruleData.id}&rule_name=${formData.rule_name}&complementary_condition=${formData.complementary_condition}&purchase_condition=${formData.purchase_condition}`,
                {},
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
                "Failed to edit wallet rule";
            return rejectWithValue(message);
        }
    }
)

export const fetchLogs = createAsyncThunk(
    "fetchLogs",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/wallet_rule_log.json?rule_id=${id}`,
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
                "Failed to fetch logs";
            return rejectWithValue(message);
        }
    }
);

const fetchWalletRuleSlice = createApiSlice("fetchWalletRule", fetchWalletRule);
const createExpiryRuleSlice = createApiSlice("createExpiryRule", createExpiryRule);
const editExpiryRuleSlice = createApiSlice("editExpiryRule", editExpiryRule);
const fetchLogsSlice = createApiSlice("fetchLogs", fetchLogs);


export const fetchWalletRuleReducer = fetchWalletRuleSlice.reducer;
export const createExpiryRuleReducer = createExpiryRuleSlice.reducer;
export const editExpiryRuleReducer = editExpiryRuleSlice.reducer;
export const fetchLogsReducer = fetchLogsSlice.reducer;
