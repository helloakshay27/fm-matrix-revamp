import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchBanners = createAsyncThunk(
    "fetchBanners",
    async ({ baseUrl, token, siteId }: { baseUrl: string, token: string, siteId: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/society_banners.json?site_id=${siteId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get banners'
            return rejectWithValue(message)
        }
    }
)

export const fetchBannersById = createAsyncThunk(
    "fetchBannersById",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/society_banners/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || `Failed to get banner with id: ${id}`
            return rejectWithValue(message)
        }
    }
)

export const createBanner = createAsyncThunk(
    "createBanner",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/society_banners.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create banner'
            return rejectWithValue(message)
        }
    }
)

export const editBanner = createAsyncThunk(
    "editBanner",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/pms/society_banners/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create banner'
            return rejectWithValue(message)
        }
    }
)

const fetchBannersSlice = createApiSlice("fetchBanners", fetchBanners)
const fetchBannersByIdSlice = createApiSlice("fetchBannersById", fetchBannersById)
const createBannerSlice = createApiSlice("createBanner", createBanner)
const editBannerSlice = createApiSlice("editBanner", editBanner)

export const fetchBannersReducers = fetchBannersSlice.reducer
export const fetchBannersByIdReducers = fetchBannersByIdSlice.reducer
export const createBannerReducers = createBannerSlice.reducer
export const editBannerReducers = editBannerSlice.reducer