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

export const fetchProjectTeamById = createAsyncThunk(
    "fetchProjectTeamById",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_teams/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get project team'
            return rejectWithValue(message)
        }
    }
)

export const createProjectTeam = createAsyncThunk(
    "createProjectTeam",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/project_teams.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create project team'
            return rejectWithValue(message)
        }
    }
)

export const updateProjectTeam = createAsyncThunk(
    "updateProjectTeam",
    async ({ baseUrl, token, data, id }: { baseUrl: string, token: string, data: any, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/project_teams/${id}.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to update project team'
            return rejectWithValue(message)
        }
    }
)

export const removeMembersFromTeam = createAsyncThunk(
    'removeMembersFromTeam',
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`https://${baseUrl}/project_team_members/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to remove members from project team'
            return rejectWithValue(message)
        }
    })

const fetchProjectTeamsSlice = createApiSlice("fetchProjectTeams", fetchProjectTeams)
const fetchProjectTeamByIdSlice = createApiSlice("fetchProjectTeamById", fetchProjectTeamById)
const createProjectTeamSlice = createApiSlice("createProjectTeam", createProjectTeam)
const updateProjectTeamSlice = createApiSlice("updateProjectTeam", updateProjectTeam)

export const fetchProjectTeamsReducer = fetchProjectTeamsSlice.reducer
export const fetchProjectTeamByIdReducer = fetchProjectTeamByIdSlice.reducer
export const createProjectTeamReducer = createProjectTeamSlice.reducer
export const updateProjectTeamReducer = updateProjectTeamSlice.reducer