import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseClient } from "@/utils/withoutTokenBase";
import createApiSlice from "../api/apiSlice";

export const createMilestone = createAsyncThunk(
    "createMilestone",
    async ({ token, baseUrl, data }: { token: string, baseUrl: string, data: any }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.post(`https://${baseUrl}/milestones.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.post(`/milestones.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create milestone'
            return rejectWithValue(message)
        }
    }
)

export const fetchMilestones = createAsyncThunk(
    "fetchMilestones",
    async ({ token, baseUrl, id, orderBy, orderDirection }: { token: string, baseUrl: string, id: string, orderBy?: string, orderDirection?: string }, { rejectWithValue }) => {
        try {
            let url = `https://${baseUrl || ''}/milestones.json?q[project_management_id_eq]=${id}`;

            // Add sorting parameters if provided
            if (orderBy && orderDirection) {
                url += `&order_by=${orderBy}&order_direction=${orderDirection}`;
            }

            const response = baseUrl
                ? await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.get(`/milestones.json?q[project_management_id_eq]=${id}${orderBy && orderDirection ? `&order_by=${orderBy}&order_direction=${orderDirection}` : ''}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch milestones'
            return rejectWithValue(message)
        }
    }
)

export const fetchMilestoneById = createAsyncThunk(
    "fetchMilestoneById",
    async ({ token, baseUrl, id }: { token: string, baseUrl: string, id: string }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.get(`https://${baseUrl}/milestones/${id}.json`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.get(`/milestones/${id}.json`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const updateMilestoneStatus = createAsyncThunk(
    "updateMilestoneStatus",
    async ({ token, baseUrl, id, payload }: { token: string, baseUrl: string, id: string, payload: any }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.put(`https://${baseUrl}/milestones/${id}.json`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.put(`/milestones/${id}.json`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to update milestone status'
            return rejectWithValue(message)
        }
    }
)

export const fetchDependentMilestones = createAsyncThunk(
    "fetchDependentMilestones",
    async ({ token, baseUrl, id }: { token: string, baseUrl: string, id: string }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.get(`https://${baseUrl}/milestones/${id}/dependent_milestones.json`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.get(`/milestones/${id}/dependent_milestones.json`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch dependent milestones'
            return rejectWithValue(message)
        }
    }
)

const createMilestoneSlice = createApiSlice("createMilestone", createMilestone);
const fetchMilestonesSlice = createApiSlice("fetchMilestones", fetchMilestones);
const fetchMilestoneByIdSlice = createApiSlice("fetchMilestoneById", fetchMilestoneById);
const updateMilestoneStatusSlice = createApiSlice("updateMilestoneStatus", updateMilestoneStatus);
const fetchDependentMilestonesSlice = createApiSlice("fetchDependentMilestones", fetchDependentMilestones);

export const createMilestoneReducer = createMilestoneSlice.reducer;
export const fetchMilestonesReducer = fetchMilestonesSlice.reducer;
export const fetchMilestoneByIdReducer = fetchMilestoneByIdSlice.reducer;
export const updateMilestoneStatusReducer = updateMilestoneStatusSlice.reducer;
export const fetchDependentMilestonesReducer = fetchDependentMilestonesSlice.reducer;