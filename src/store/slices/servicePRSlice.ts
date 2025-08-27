import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const getServicePr = createAsyncThunk(
    "getServicePr",
    async (
        {
            baseUrl,
            token,
            page,
            reference_number,
            external_id,
            supplier_name,
            approval_status,
        }: {
            baseUrl: string;
            token: string;
            page?: number;
            reference_number?: string;
            external_id?: string;
            supplier_name?: string;
            approval_status?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const queryParams = new URLSearchParams();

            if (reference_number) {
                queryParams.append("q[reference_number_eq]", reference_number);
            }
            if (external_id) {
                queryParams.append("q[external_id_eq]", external_id);
            }
            if (supplier_name) {
                queryParams.append("q[pms_supplier_company_name_cont]", supplier_name);
            }

            if (approval_status !== undefined && approval_status !== null) {
                queryParams.append("q[all_level_approved_eq]", approval_status);
            }

            const response = await axios.get(
                `https://${baseUrl}/pms/work_orders/letter_of_indents_wo.json?page=${page}${queryParams.toString() ? `&${queryParams}` : ''}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error || error.message || 'Failed to fetch service PR';
            return rejectWithValue(message);
        }
    }
);

export const createServicePR = createAsyncThunk(
    'createServicePR',
    async ({ data, baseUrl, token }: { data: any, baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/pms/work_orders.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create material PR'
            return rejectWithValue(message)
        }
    }
)

export const getServices = createAsyncThunk("getServices", async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`https://${baseUrl}/pms/services/get_services.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch services'
        return rejectWithValue(message)
    }
})

export const getServiceFeeds = createAsyncThunk("getServiceFeeds", async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`https://${baseUrl}/pms/work_orders/${id}/feeds.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch feeds'
        return rejectWithValue(message)
    }
})

const getServicePrSlice = createApiSlice("getServicePr", getServicePr);
const createServicePRSlice = createApiSlice("createServicePR", createServicePR);
const getServicesSlice = createApiSlice("getServices", getServices);
const getServiceFeedsSlice = createApiSlice("getServiceFeeds", getServiceFeeds);

export const getServicePrReducer = getServicePrSlice.reducer
export const createServicePRReducer = createServicePRSlice.reducer
export const getServicesReducer = getServicesSlice.reducer
export const getServiceFeedsReducer = getServiceFeedsSlice.reducer