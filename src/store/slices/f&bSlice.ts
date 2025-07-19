import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchRestaurants = createAsyncThunk(
    "fetchRestaurants",
    async (
        { baseUrl, token }: { baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data.restaurants;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch restaurants";
            return rejectWithValue(message);
        }
    }
);

export const createRestaurant = createAsyncThunk(
    "createRestaurant",
    async (
        { baseUrl, token, data }: { baseUrl: string; token: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/pms/admin/restaurants.json`,
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
                "Failed to create restaurant";
            return rejectWithValue(message);
        }
    }
);

export const fetchRestaurantDetails = createAsyncThunk(
    "fetchRestaurantDetails",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/restaurants/${id}.json`,
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
                "Failed to fetch restaurant details";
            return rejectWithValue(message);
        }
    }
);

export const editRestaurant = createAsyncThunk(
    "editRestaurant",
    async (
        {
            baseUrl,
            token,
            id,
            data,
        }: { baseUrl: string; token: string; id: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/pms/admin/restaurants/${id}.json`,
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
                "Failed to edit restaurant";
            return rejectWithValue(message);
        }
    }
);

export const createRestaurantStatus = createAsyncThunk(
    "createRestaurantStatus",
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
                `https://${baseUrl}/pms/admin/restaurants/${id}/restaurant_statuses.json`,
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
                "Failed to create restaurant status";
            return rejectWithValue(message);
        }
    }
);

export const fetchRestaurantsSlice = createApiSlice(
    "fetchRestaurants",
    fetchRestaurants
);
export const createRestaurantSlice = createApiSlice(
    "createRestaurant",
    createRestaurant
);
export const fetchRestaurantDetailsSlice = createApiSlice(
    "fetchRestaurantDetails",
    fetchRestaurantDetails
);
export const editRestaurantSlice = createApiSlice(
    "editRestaurant",
    editRestaurant
);
export const createRestaurantStatusSlice = createApiSlice(
    "createRestaurantStatus",
    createRestaurantStatus
);

export const fetchRestaurantsReducer = fetchRestaurantsSlice.reducer;
export const createRestaurantReducer = createRestaurantSlice.reducer;
export const fetchRestaurantDetailsReducer =
    fetchRestaurantDetailsSlice.reducer;
export const editRestaurantReducer = editRestaurantSlice.reducer;
export const createRestaurantStatusReducer =
    createRestaurantStatusSlice.reducer;
