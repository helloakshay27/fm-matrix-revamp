import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchMasterUnits = createAsyncThunk(
    "fetchMasterUnits",
    async (
        { baseUrl, token }: { baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/meter_types.json`,
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
                "Failed to fetch master units";
            return rejectWithValue(message);
        }
    }
);

export const createMasterUnit = createAsyncThunk(
    "createMasterUnit",
    async (
        { baseUrl, token, data }: { baseUrl: string; token: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/pms/meter_types.json`,
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
                "Failed to create master unit";
            return rejectWithValue(message);
        }
    }
);

export const fetchMasterUnitsSlice = createApiSlice(
    "fetchMasterUnits",
    fetchMasterUnits
);
export const createMasterUnitSlice = createApiSlice(
    "createMasterUnit",
    createMasterUnit
);

export const fetchMasterUnitsReducer = fetchMasterUnitsSlice.reducer;
export const createMasterUnitReducer = createMasterUnitSlice.reducer;
