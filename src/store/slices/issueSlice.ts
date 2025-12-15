import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchIssues = createAsyncThunk(
    "fetchIssues",
    async ({ token, baseUrl, id }: { token: string; baseUrl: string; id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/issues.json?q[project_id_eq]=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to fetch issues";
            return rejectWithValue(message);
        }
    }
);

export const fetchIssueById = createAsyncThunk(
    "fetchIssueById",
    async ({ token, baseUrl, id }: { token: string; baseUrl: string; id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/issues/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to fetch issue";
            return rejectWithValue(message);
        }
    }
);

export const createIssue = createAsyncThunk(
    "createIssue",
    async (
        { token, baseUrl, data }: { token: string; baseUrl: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/issues.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to create issue";
            return rejectWithValue(message);
        }
    }
);

export const updateIssue = createAsyncThunk(
    "updateIssue",
    async (
        { token, baseUrl, id, data }: { token: string; baseUrl: string; id: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/issues/${id}.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to update issue";
            return rejectWithValue(message);
        }
    }
);

export const deleteIssue = createAsyncThunk(
    "deleteIssue",
    async ({ token, baseUrl, id }: { token: string; baseUrl: string; id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `https://${baseUrl}/issues/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to delete issue";
            return rejectWithValue(message);
        }
    }
);

export const filterIssues = createAsyncThunk(
    "filterIssues",
    async (
        { token, baseUrl, filters }: { token: string; baseUrl: string; filters: any },
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await axios.get(
                `https://${baseUrl}/issues.json?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error || error.message || "Failed to filter issues";
            return rejectWithValue(message);
        }
    }
);

const fetchIssuesSlice = createApiSlice("fetchIssues", fetchIssues);
const fetchIssueByIdSlice = createApiSlice("fetchIssueById", fetchIssueById);
const createIssueSlice = createApiSlice("createIssue", createIssue);
const updateIssueSlice = createApiSlice("updateIssue", updateIssue);
const deleteIssueSlice = createApiSlice("deleteIssue", deleteIssue);
const filterIssuesSlice = createApiSlice("filterIssues", filterIssues);

export const fetchIssuesReducer = fetchIssuesSlice.reducer;
export const fetchIssueByIdReducer = fetchIssueByIdSlice.reducer;
export const createIssueReducer = createIssueSlice.reducer;
export const updateIssueReducer = updateIssueSlice.reducer;
export const deleteIssueReducer = deleteIssueSlice.reducer;
export const filterIssuesReducer = filterIssuesSlice.reducer;
