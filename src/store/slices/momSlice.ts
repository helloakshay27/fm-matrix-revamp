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

export const updateMoM = createAsyncThunk(
    'mom/updateMoM',
    async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = localStorage.getItem('baseUrl');
            const response = await axios.patch(`https://${baseUrl}/mom_details/${id}.json`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.error || error.message || 'Failed to update MoM';
            return rejectWithValue(message);
        }
    }
);

const updateMoMSlice = createApiSlice('updateMoM', updateMoM);
export const updateMoMReducer = updateMoMSlice.reducer;

export const fetchMoMs = createAsyncThunk(
    'mom/fetchMoMs',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = localStorage.getItem('baseUrl');
            const response = await axios.get(`https://${baseUrl}/mom_details.json?q[mom_attendees_attendees_id_or_created_by_id_eq]=${JSON.parse(localStorage.getItem('user')).id}`, {
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

export const fetchMoMDetail = createAsyncThunk(
    'mom/fetchMoMDetail',
    async (id: string, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('token');
            const baseUrl = localStorage.getItem('baseUrl');
            const response = await axios.get(`https://${baseUrl}/mom_details/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error: any) {
            const message = error.response?.data?.error || error.message || 'Failed to fetch MoM detail';
            return rejectWithValue(message);
        }
    }
);

const fetchMoMDetailSlice = createApiSlice('fetchMoMDetail', fetchMoMDetail);
export const fetchMoMDetailReducer = fetchMoMDetailSlice.reducer;
