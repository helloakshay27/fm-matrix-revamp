import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchAmenity = createAsyncThunk(
    "fetchAmenity",
    async ({ baseUrl, token, siteId }: { baseUrl: string, token: string, siteId: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/amenities.json?site_id=${siteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get amenity'
            return rejectWithValue(message)
        }
    }
)

export const fetchAmenityById = createAsyncThunk(
    "fetchAmenityById",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/amenities/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get amenity'
            return rejectWithValue(message)
        }
    }
)

export const createAmenity = createAsyncThunk(
    "createAmenity",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/amenities.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create amenity'
            return rejectWithValue(message)
        }
    }
)

export const editAmenity = createAsyncThunk(
    "editAmenity",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/amenities/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create amenity'
            return rejectWithValue(message)
        }
    }
)

const fetchAmenitySlice = createApiSlice("fetchAmenity", fetchAmenity);
const fetchAmenityByIdSlice = createApiSlice("fetchAmenityById", fetchAmenityById);
const createAmenitySlice = createApiSlice("createAmenity", createAmenity);
const editAmenitySlice = createApiSlice("editAmenity", editAmenity);

export const fetchAmenityReducer = fetchAmenitySlice.reducer
export const fetchAmenityByIdReducer = fetchAmenityByIdSlice.reducer
export const createAmenityReducer = createAmenitySlice.reducer
export const editAmenityReducer = editAmenitySlice.reducer