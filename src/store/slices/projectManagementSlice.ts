import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import createApiSlice from "../api/apiSlice"

export const fetchProjects = createAsyncThunk('fetchProjects', async ({ token, baseUrl }: { token: string, baseUrl: string }) => {
    try {
        const response = await axios.get(`https://${baseUrl}/project_managements.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

const fetchProjectsSlice = createApiSlice("fetchProjects", fetchProjects);

export const fetchProjectsReducer = fetchProjectsSlice.reducer;