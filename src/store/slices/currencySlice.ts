import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const addCurrency = createAsyncThunk(
    "addCurrency",
    async (
        { data, baseUrl, token }: { data: any; baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/currencies.json`,
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
                "Failed to add currency";
            return rejectWithValue(message);
        }
    }
);

export const getCurrency = createAsyncThunk(
    "getCurrency",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/currencies.json?q[pms_site_id_eq]=${id}`,
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
                "Failed to get currency";
            return rejectWithValue(message);
        }
    }
);

export const addCurrencySlice = createApiSlice("addCurrency", addCurrency);
export const getCurrencySlice = createApiSlice("getCurrency", getCurrency);

export const addCurrencyReducer = addCurrencySlice.reducer;
export const getCurrencyReducer = getCurrencySlice.reducer;
