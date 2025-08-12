import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const getServicePr = createAsyncThunk(
    "getServicePr",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const respones = await axios.get(`https://${baseUrl}/pms/work_orders/letter_of_indents_wo.json`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            return respones.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create material PR'
            return rejectWithValue(message)
        }
    }
)

const getServicePrSlice = createApiSlice("getServicePr", getServicePr);

export const getServicePrReducer = getServicePrSlice.reducer