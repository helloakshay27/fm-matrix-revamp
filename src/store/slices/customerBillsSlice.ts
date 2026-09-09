import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import createApiSlice from "../api/apiSlice"

export const getCustomerBills = createAsyncThunk(
    "getCustomerBills",
    async (
        {
            baseUrl,
            token,
            page,
            search = "",
            billNo = "",
            paymentStatus = "",
        }: {
            baseUrl: string;
            token: string;
            page?: number;
            search?: string;
            billNo?: string;
            paymentStatus?: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const queryParams = new URLSearchParams();
            if (token) queryParams.append("access_token", token);
            if (page) queryParams.append("page", String(page));
            if (search) queryParams.append("q[bill_number_or_customer_cont]", search);
            if (billNo) queryParams.append("q[bill_number_cont]", billNo);
            if (paymentStatus) queryParams.append("q[status_cont]", paymentStatus);

            const response = await axios.get(
                `https://${baseUrl}/lock_account_bills/pms_bills.json?${queryParams.toString()}`,
                // {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // }
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                (error as any).message ||
                "Failed to fetch customer bills";
            return rejectWithValue(message);
        }
    }
);

export const getCustomerBillById = createAsyncThunk(
    "getCustomerBillById",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: string | number },
        { rejectWithValue }
    ) => {
        try {
            const queryParams = new URLSearchParams();
            if (token) queryParams.append("access_token", token);

            const response = await axios.get(
                `https://${baseUrl}/lock_account_bills/${id}.json?${queryParams.toString()}`
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                (error as any).message ||
                "Failed to fetch customer bill details";
            return rejectWithValue(message);
        }
    }
);

export const createCustomerBillPayment = createAsyncThunk(
    "createCustomerBillPayment",
    async (
        { baseUrl, token, id, data }: { baseUrl: string; token: string; id: string | number; data: any },
        { rejectWithValue }
    ) => {
        try {
            const queryParams = new URLSearchParams();
            if (token) queryParams.append("access_token", token);

            const response = await axios.post(
                `https://${baseUrl}/lock_account_bills/${id}/lock_payments.json?${queryParams.toString()}`,
                data
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                (error as any).message ||
                "Failed to record payment";
            return rejectWithValue(message);
        }
    }
);

export const cancelCustomerBill = createAsyncThunk(
    "cancelCustomerBill",
    async (
        { baseUrl, token, id, cancelNote }: { baseUrl: string; token: string; id: string | number; cancelNote: string },
        { rejectWithValue }
    ) => {
        try {
            const queryParams = new URLSearchParams();
            if (token) queryParams.append("access_token", token);

            const response = await axios.post(
                `https://${baseUrl}/lock_accounts/lock_account_bills/${id}/cancel_lock_account_bill.json?${queryParams.toString()}`,
                {
                    lock_account_bill: {
                        cancel_note: cancelNote,
                    },
                }
            );

            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                (error as any).message ||
                "Failed to cancel bill";
            return rejectWithValue(message);
        }
    }
);

const getCustomerBillsSlice = createApiSlice("getCustomerBills", getCustomerBills);
const getCustomerBillByIdSlice = createApiSlice("getCustomerBillById", getCustomerBillById);
const createCustomerBillPaymentSlice = createApiSlice("createCustomerBillPayment", createCustomerBillPayment);
const cancelCustomerBillSlice = createApiSlice("cancelCustomerBill", cancelCustomerBill);
export const getCustomerBillsReducer = getCustomerBillsSlice.reducer;
export const getCustomerBillByIdReducer = getCustomerBillByIdSlice.reducer;
export const createCustomerBillPaymentReducer = createCustomerBillPaymentSlice.reducer;
export const cancelCustomerBillReducer = cancelCustomerBillSlice.reducer;
