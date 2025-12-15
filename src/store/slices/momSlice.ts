import { createAsyncThunk } from '@reduxjs/toolkit';
import createApiSlice from '../api/apiSlice';
import axios from 'axios';

export const createMoM = createAsyncThunk(
    'mom/createMoM',
    async (formData: FormData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = localStorage.getItem('baseUrl');
            const response = await axios.post(`https://${baseUrl}/mom_details.json`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.error || error.message || 'Failed to create MoM';
            return rejectWithValue(message);
        }
    }
);

const createMoMSlice = createApiSlice('createMoM', createMoM);
export const createMoMReducer = createMoMSlice.reducer;

export const fetchMoMs = createAsyncThunk(
    'mom/fetchMoMs',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = localStorage.getItem('baseUrl');
            const response = await axios.get(`https://${baseUrl}/mom_details.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.error || error.message || 'Failed to fetch MoMs';
            return rejectWithValue(message);
        }
    }
);

const fetchMoMsSlice = createApiSlice('fetchMoMs', fetchMoMs);
export const fetchMoMsReducer = fetchMoMsSlice.reducer;
