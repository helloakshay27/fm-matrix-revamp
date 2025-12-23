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

export const fetchMeterType = createAsyncThunk(
    "fetchMeterType",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/meter_types/${id}.json`,
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
                "Failed to fetch meter type";
            return rejectWithValue(message);
        }
    }
);

export const updateMeterType = createAsyncThunk(
    "updateMeterType",
    async (
        { baseUrl, token, id, data }: { baseUrl: string; token: string; id: number; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.patch(
                `https://${baseUrl}/pms/meter_types/${id}.json`,
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
                "Failed to update meter type";
            return rejectWithValue(message);
        }
    }
);

export const updateMeterUnitType = createAsyncThunk(
    "updateMeterUnitType",
    async (
        { baseUrl, token, unitTypeId, type }: { baseUrl: string; token: string; unitTypeId: number; type: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/meter_types/update_meter_unit_types?meter_unit_type_id=${unitTypeId}&type=${type}`,
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
                "Failed to update meter unit type";
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
export const fetchMeterTypeSlice = createApiSlice(
    "fetchMeterType",
    fetchMeterType
);
export const updateMeterUnitTypeSlice = createApiSlice(
    "updateMeterUnitType",
    updateMeterUnitType
);
export const updateMeterTypeSlice = createApiSlice(
    "updateMeterType",
    updateMeterType
);

export const fetchMasterUnitsReducer = fetchMasterUnitsSlice.reducer;
export const createMasterUnitReducer = createMasterUnitSlice.reducer;
export const fetchMeterTypeReducer = fetchMeterTypeSlice.reducer;
export const updateMeterUnitTypeReducer = updateMeterUnitTypeSlice.reducer;
export const updateMeterTypeReducer = updateMeterTypeSlice.reducer;
