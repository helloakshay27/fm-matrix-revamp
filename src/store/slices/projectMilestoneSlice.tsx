import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const createMilestone = createAsyncThunk(
    "createMilestone",
    async ({ token, baseUrl, data }: { token: string, baseUrl: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/milestones.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create milestone'
            return rejectWithValue(message)
        }
    }
)

export const fetchMilestones = createAsyncThunk(
    "fetchMilestones",
    async ({ token, baseUrl, id }: { token: string, baseUrl: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/milestones.json?q[project_management_id_eq]=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
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
            const response = await axios.get(`https://${baseUrl}/milestones/${id}.json`, {
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

const createMilestoneSlice = createApiSlice("createMilestone", createMilestone);
const fetchMilestonesSlice = createApiSlice("fetchMilestones", fetchMilestones);
const fetchMilestoneByIdSlice = createApiSlice("fetchMilestoneById", fetchMilestoneById);

export const createMilestoneReducer = createMilestoneSlice.reducer;
export const fetchMilestonesReducer = fetchMilestonesSlice.reducer;
export const fetchMilestoneByIdReducer = fetchMilestoneByIdSlice.reducer;