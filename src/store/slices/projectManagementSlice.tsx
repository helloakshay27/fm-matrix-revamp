import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import createApiSlice from "../api/apiSlice"

export const fetchProjects = createAsyncThunk(
    'fetchProjects',
    async ({ token, baseUrl }: { token: string, baseUrl: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_managements.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get projects'
            return rejectWithValue(message)
        }
    })

export const createProject = createAsyncThunk(
    'createProject',
    async ({ token, baseUrl, data }: { token: string, baseUrl: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/project_managements.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create project'
            return rejectWithValue(message)
        }
    }
)

export const fetchProjectById = createAsyncThunk(
    'fetchProjectById',
    async ({ token, baseUrl, id }: { token: string, baseUrl: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_managements/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get project'
            return rejectWithValue(message)
        }
    }
)

export const changeProjectStatus = createAsyncThunk(
    'changeProjectStatus',
    async ({ token, baseUrl, id, payload }: { token: string, baseUrl: string, id: string, payload: any }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/project_managements/${id}.json`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to change project status'
            return rejectWithValue(message)
        }
    }
)

export const removeTagFromProject = createAsyncThunk('removeTagFromProject', async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`https://${baseUrl}/task_tags/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error);
    }
})

export const removeUserFromProject = createAsyncThunk('removeUserFromProject', async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }) => {
    try {
        const response = await axios.delete(`https://${baseUrl}/task_users/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const filterProjects = createAsyncThunk(
    'filterProjects',
    async ({ baseUrl, token, filters }: { baseUrl: string, token: string, filters: any }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filters).toString();
            const response = await axios.get(
                `https://${baseUrl}/project_managements.json?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const attachFiles = createAsyncThunk(
    'attachFiles',
    async ({ token, baseUrl, id, payload }: { token: string, baseUrl: string, id: string, payload: FormData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`https://${baseUrl}/project_managements/${id}.json`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to upload files'
            return rejectWithValue(message);
        }
    }
);

export const removeAttachment = createAsyncThunk(
    'removeAttachment',
    async ({ token, baseUrl, id, image_id }: { token: string, baseUrl: string, id: string, image_id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `https://${baseUrl}/project_managements/${id}/remove_attachemnts/${image_id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to remove attachment'
            return rejectWithValue(message);
        }
    }
);

const fetchProjectsSlice = createApiSlice("fetchProjects", fetchProjects);
const createProjectSlice = createApiSlice("createProject", createProject);
const fetchProjectByIdSlice = createApiSlice("fetchProjectById", fetchProjectById);
const changeProjectStatusSlice = createApiSlice("changeProjectStatus", changeProjectStatus);
const removeTagFromProjectSlice = createApiSlice("removeTagFromProject", removeTagFromProject);
const filterProjectsSlice = createApiSlice("filterProjects", filterProjects);
const attachFilesSlice = createApiSlice("attachFiles", attachFiles);
const removeAttachmentSlice = createApiSlice("removeAttachment", removeAttachment);

export const fetchProjectsReducer = fetchProjectsSlice.reducer;
export const createProjectReducer = createProjectSlice.reducer;
export const fetchProjectByIdReducer = fetchProjectByIdSlice.reducer;
export const changeProjectStatusReducer = changeProjectStatusSlice.reducer;
export const removeTagFromProjectReducer = removeTagFromProjectSlice.reducer;
export const filterProjectsReducer = filterProjectsSlice.reducer;
export const attachFilesReducer = attachFilesSlice.reducer;
export const removeAttachmentReducer = removeAttachmentSlice.reducer;