import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const createCompanyPartner = createAsyncThunk(
    "createCompanyPartner",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/generic_tags/create_custom.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create company partner'
            return rejectWithValue(message)
        }
    }
)

export const fetchCompanyPartners = createAsyncThunk(
    "fetchCompanyPartners",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/pms/generic_tags/custom_index.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch company partners'
            return rejectWithValue(message)
        }
    }
)

export const editCompanyPartner = createAsyncThunk(
    "editCompanyPartner",
    async ({ baseUrl, token, id, data }: { baseUrl: string, token: string, id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`https://${baseUrl}/pms/generic_tags/update_custom/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to update company partner'
            return rejectWithValue(message)
        }
    }
)

const createCompanyPartnerSlice = createApiSlice("createCompanyPartner", createCompanyPartner);
const fetchCompanyPartnersSlice = createApiSlice("fetchCompanyPartners", fetchCompanyPartners);
const editCompanyPartnerSlice = createApiSlice("editCompanyPartner", editCompanyPartner);

export const createCompanyPartnerReducers = createCompanyPartnerSlice.reducer
export const fetchCompanyPartnersReducer = fetchCompanyPartnersSlice.reducer
export const editCompanyPartnerReducer = editCompanyPartnerSlice.reducer