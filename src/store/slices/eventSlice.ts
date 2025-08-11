import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchEvents = createAsyncThunk(
    "fetchEvents",
    async (
        { baseUrl, token, params, per_page, page }: { baseUrl: string; token: string; params?: string; per_page: number; page: number },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/pms/admin/events.json?per_page=${per_page}&page=${page}&${params}`,
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

export const createEvent = createAsyncThunk(
    'createEvent',
    async ({ data, baseUrl, token }: { data: any, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/admin/events.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create event'
            return rejectWithValue(message)
        }
    }
)

export const fetchEventById = createAsyncThunk(
    'fetchEventById',
    async ({ id, baseUrl, token }: { id: string, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/admin/events/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create event'
            return rejectWithValue(message)
        }
    }
)

const fetchEventsSlice = createApiSlice("fetchEvents", fetchEvents);
const createEventSlice = createApiSlice("createEvent", createEvent);
const fetchEventByIdSlice = createApiSlice("fetchEventById", fetchEventById);

export const fetchEventsReducer = fetchEventsSlice.reducer
export const createEventReducer = createEventSlice.reducer
export const fetchEventByIdReducer = fetchEventByIdSlice.reducer