import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const createConversation = createAsyncThunk(
    "createConversation",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/conversations.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create conversation'
            return rejectWithValue(message)
        }
    }
)

export const fetchConversations = createAsyncThunk(
    "fetchConversations",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/conversations.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get conversations'
            return rejectWithValue(message)
        }
    }
)

export const fetchConversation = createAsyncThunk(
    "fetchConversation",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/conversations/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get conversation'
            return rejectWithValue(message)
        }
    }
)

export const fetchConversationMessages = createAsyncThunk(
    "fetchConversationMessages",
    async ({ baseUrl, token, id, per_page, page }: { baseUrl: string, token: string, id: string, per_page: number, page: number }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/messages.json?q[conversation_id_eq]=${id}&page=${page}&per_page=${per_page}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get conversation messages'
            return rejectWithValue(message)
        }
    }
)

export const sendMessage = createAsyncThunk(
    "sendMessage",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/messages.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to send message'
            return rejectWithValue(message)
        }
    }
)

export const fetchGroups = createAsyncThunk(
    "fetchGroups",
    async ({ baseUrl, token }: { baseUrl: string, token: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_spaces.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get groups'
            return rejectWithValue(message)
        }
    }
)

export const createGroup = createAsyncThunk(
    "createGroup",
    async ({ baseUrl, token, data }: { baseUrl: string, token: string, data: any }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`https://${baseUrl}/project_spaces.json`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create group'
            return rejectWithValue(message)
        }
    }
)

export const fetchGroupConversation = createAsyncThunk(
    "fetchGroupConversation",
    async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`https://${baseUrl}/project_spaces/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to get group conversation'
            return rejectWithValue(message)
        }
    }
)

const fetchConversationSlice = createApiSlice("fetchConversation", fetchConversation)
const createConversationSlice = createApiSlice("createConversation", createConversation)
const fetchConversationsSlice = createApiSlice("fetchConversations", fetchConversations)
const fetchConversationMessagesSlice = createApiSlice("fetchConversationMessages", fetchConversationMessages)
const sendMessageSlice = createApiSlice("sendMessage", sendMessage)
const fetchGroupsSlice = createApiSlice("fetchGroups", fetchGroups)
const createGroupSlice = createApiSlice("createGroup", createGroup)
const fetchGroupConversationSlice = createApiSlice("fetchGroupConversation", fetchGroupConversation)

export const fetchConversationReducer = fetchConversationSlice.reducer
export const createConversationReducer = createConversationSlice.reducer
export const fetchConversationsReducer = fetchConversationsSlice.reducer
export const fetchConversationMessagesReducer = fetchConversationMessagesSlice.reducer
export const sendMessageReducer = sendMessageSlice.reducer
export const fetchGroupsReducer = fetchGroupsSlice.reducer
export const createGroupReducer = createGroupSlice.reducer
export const fetchGroupConversationReducer = fetchGroupConversationSlice.reducer
