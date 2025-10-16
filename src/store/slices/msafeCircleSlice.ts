import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchCircleList = createAsyncThunk(
    "fetchCircleList",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/circles.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const createCircle = createAsyncThunk(
    "createCircle",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/circles.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateCircle = createAsyncThunk(
    "updateCircle",
    async ({ baseUrl, token, id, data }: { baseUrl: string, token: string, id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/circles/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

const fetchCircleListSlice = createApiSlice("fetchCircleList", fetchCircleList);
const createCircleSlice = createApiSlice("createCircle", createCircle);
const updateCircleSlice = createApiSlice("updateCircle", updateCircle);

export const fetchCircleListReducer = fetchCircleListSlice.reducer
export const createCircleReducer = createCircleSlice.reducer
export const updateCircleReducer = updateCircleSlice.reducer