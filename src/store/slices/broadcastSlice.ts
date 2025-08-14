import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchBroadcasts = createAsyncThunk(
    "fetchBroadcasts",
    async (
        { baseUrl, token, params, per_page, page }: { baseUrl: string; token: string; params?: string; per_page: number; page: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/noticeboards.json?per_page=${per_page}&page=${page}&${params}`,
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
                "Failed to create subcategory";
            return rejectWithValue(message);
        }
    }
)

export const createBroadcast = createAsyncThunk(
    "createBroadcast",
    async ({ data, baseUrl, token }: { data: any, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/admin/noticeboards.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create broadcast'
            return rejectWithValue(message)
        }
    }
)

export const fetchBroadcastById = createAsyncThunk(
    "fetchBroadcastById",
    async ({ id, baseUrl, token }: { id: string, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/admin/noticeboards/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch broadcast by id'
            return rejectWithValue(message)
        }
    }
)

const fetchBroadcastsSlice = createApiSlice("fetchBroadcasts", fetchBroadcasts);
const createBroadcastSlice = createApiSlice("createBroadcast", createBroadcast)
const fetchBroadcastByIdSlice = createApiSlice("fetchBroadcastById", fetchBroadcastById)

export const fetchBroadcastsReducer = fetchBroadcastsSlice.reducer
export const createBroadcastReducer = createBroadcastSlice.reducer
export const fetchBroadcastByIdReducer = fetchBroadcastByIdSlice.reducer