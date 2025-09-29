import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const fetchProjectTeams = createAsyncThunk(
    "fetchProjectTeams",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_teams.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get project teams'
            return rejectWithValue(message)
        }
    }
)

const fetchProjectTeamsSlice = createApiSlice("fetchProjectTeams", fetchProjectTeams)

export const fetchProjectTeamsReducer = fetchProjectTeamsSlice.reducer