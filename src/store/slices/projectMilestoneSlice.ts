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

const createMilestoneSlice = createApiSlice("createMilestone", createMilestone);

export const createMilestoneReducer = createMilestoneSlice.reducer;