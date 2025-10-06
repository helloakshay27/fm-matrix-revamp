import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import createApiSlice from "../api/apiSlice";

export const createConversation = createAsyncThunk(
    "createConversation",
    async (
        { baseUrl, token, data }: { baseUrl: string; token: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/conversations.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                error.error ||
                "Failed to create conversation";
            return rejectWithValue(message);
        }
    }
);

export const fetchConversations = createAsyncThunk(
    "fetchConversations",
    async (
        { baseUrl, token }: { baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/conversations.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                error.error ||
                "Failed to get conversations";
            return rejectWithValue(message);
        }
    }
);

export const fetchConversation = createAsyncThunk(
    "fetchConversation",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/conversations/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                error.error ||
                "Failed to get conversation";
            return rejectWithValue(message);
        }
    }
);

export const fetchConversationMessages = createAsyncThunk(
    "fetchConversationMessages",
    async (
        {
            baseUrl,
            token,
            id,
            per_page,
            page,
            param,
            attachments_id_null,
        }: {
            baseUrl: string;
            token: string;
            id: string;
            per_page?: number;
            page?: number;
            param?: string;
            attachments_id_null?: boolean;
        },
        { rejectWithValue }
    ) => {
        try {
            const params = new URLSearchParams();

            if (attachments_id_null) {
                params.append("q[attachments_id_null]", "0");
            }
            if (param) {
                params.append(`q[${param}]`, id);
            }
            const response = await axios.get(
                `https://${baseUrl}/messages.json?page=${page}&per_page=${per_page}&${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                error.error ||
                "Failed to get conversation messages";
            return rejectWithValue(message);
        }
    }
);

export const sendMessage = createAsyncThunk(
    "sendMessage",
    async (
        { baseUrl, token, data }: { baseUrl: string; token: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/messages.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error || error.error || "Failed to send message";
            return rejectWithValue(message);
        }
    }
);

export const fetchGroups = createAsyncThunk(
    "fetchGroups",
    async (
        { baseUrl, token }: { baseUrl: string; token: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/project_spaces.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error || error.error || "Failed to get groups";
            return rejectWithValue(message);
        }
    }
);

export const createGroup = createAsyncThunk(
    "createGroup",
    async (
        { baseUrl, token, data }: { baseUrl: string; token: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/project_spaces.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error || error.error || "Failed to create group";
            return rejectWithValue(message);
        }
    }
);

export const fetchGroupConversation = createAsyncThunk(
    "fetchGroupConversation",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/project_spaces/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                error.error ||
                "Failed to get group conversation";
            return rejectWithValue(message);
        }
    }
);

export const createChatTask = createAsyncThunk(
    "createChatTask",
    async (
        { baseUrl, token, data }: { baseUrl: string; token: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.post(
                `https://${baseUrl}/task_managements.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            const message =
                error.response?.data?.error ||
                error.error ||
                "Failed to create chat task";
            return rejectWithValue(message);
        }
    }
);

export const fetchIndividualChatTasks = createAsyncThunk(
    "fetchIndividualChatTasks",
    async (
        {
            baseUrl,
            token,
            id,
            param,
            page,
        }: {
            baseUrl: string;
            token: string;
            id?: string;
            param?: string;
            page?: number;
        },
        { rejectWithValue }
    ) => {
        try {
            let url = `https://${baseUrl}/task_managements.json`;

            // Collect query parameters properly
            const queryParams: string[] = [];

            if (id && param) {
                queryParams.push(`q[${param}]=${id}`);
            }
            if (page) {
                queryParams.push(`page=${page}`);
            }

            if (queryParams.length > 0) {
                url += `?${queryParams.join("&")}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                error.message ||
                "Failed to get individual chat tasks";
            return rejectWithValue(message);
        }
    }
);

export const removeUserFromGroup = createAsyncThunk(
    "removeUserFromGroup",
    async ({ baseUrl, token, userId }: { baseUrl: string; token: string; userId: string }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `https://${baseUrl}/project_space_users/${userId}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                error.message ||
                "Failed to remove user from group";
            return rejectWithValue(message);
        }
    }
);

export const fetchChannelTaskDetails = createAsyncThunk(
    "fetchChannelTaskDetails",
    async (
        { baseUrl, token, id }: { baseUrl: string; token: string; id: string },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.get(
                `https://${baseUrl}/task_managements/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                error.message ||
                "Failed to get channel task details";
            return rejectWithValue(message);
        }
    }
);

export const updateChatTask = createAsyncThunk(
    "updateChatTask",
    async (
        { baseUrl, token, id, data }: { baseUrl: string; token: string; id: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/task_managements/${id}.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                error.message ||
                "Failed to update chat task";
            return rejectWithValue(message);
        }
    }
);

export const deleteChatTask = createAsyncThunk(
    "deleteChatTask",
    async ({ baseUrl, token, id }: { baseUrl: string; token: string; id: string }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `https://${baseUrl}/task_managements/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                error.message ||
                "Failed to delete chat task";
            return rejectWithValue(message);
        }
    }
);

export const updateMessage = createAsyncThunk(
    "updateMessage",
    async (
        { baseUrl, token, id, data }: { baseUrl: string; token: string; id: string; data: any },
        { rejectWithValue }
    ) => {
        try {
            const response = await axios.put(
                `https://${baseUrl}/messages/${id}.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            const message =
                error.response?.data?.error ||
                error.message ||
                "Failed to update message";
            return rejectWithValue(message);
        }
    }
)

const fetchConversationSlice = createApiSlice(
    "fetchConversation",
    fetchConversation
);
const createConversationSlice = createApiSlice(
    "createConversation",
    createConversation
);
const fetchConversationsSlice = createApiSlice(
    "fetchConversations",
    fetchConversations
);
const fetchConversationMessagesSlice = createApiSlice(
    "fetchConversationMessages",
    fetchConversationMessages
);
const sendMessageSlice = createApiSlice("sendMessage", sendMessage);
const fetchGroupsSlice = createApiSlice("fetchGroups", fetchGroups);
const createGroupSlice = createApiSlice("createGroup", createGroup);
const fetchGroupConversationSlice = createApiSlice(
    "fetchGroupConversation",
    fetchGroupConversation
);
const createChatTaskSlice = createApiSlice("createChatTask", createChatTask);
const removeUserFromGroupSlice = createApiSlice("removeUserFromGroup", removeUserFromGroup);
const fetchChannelTaskDetailsSlice = createApiSlice("fetchChannelTaskDetails", fetchChannelTaskDetails);
const updateChatTaskSlice = createApiSlice("updateChatTask", updateChatTask);
const deleteChatTaskSlice = createApiSlice("deleteChatTask", deleteChatTask);
const updateMessageSlice = createApiSlice("updateMessage", updateMessage);



export const fetchConversationReducer = fetchConversationSlice.reducer;
export const createConversationReducer = createConversationSlice.reducer;
export const fetchConversationsReducer = fetchConversationsSlice.reducer;
export const fetchConversationMessagesReducer =
    fetchConversationMessagesSlice.reducer;
export const sendMessageReducer = sendMessageSlice.reducer;
export const fetchGroupsReducer = fetchGroupsSlice.reducer;
export const createGroupReducer = createGroupSlice.reducer;
export const fetchGroupConversationReducer =
    fetchGroupConversationSlice.reducer;
export const createChatTaskReducer = createChatTaskSlice.reducer;
export const removeUserFromGroupReducer = removeUserFromGroupSlice.reducer;
export const fetchChannelTaskDetailsReducer = fetchChannelTaskDetailsSlice.reducer;
export const updateChatTaskReducer = updateChatTaskSlice.reducer;
export const deleteChatTaskReducer = deleteChatTaskSlice.reducer;
export const updateMessageReducer = updateMessageSlice.reducer;