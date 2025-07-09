import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL } from '../../../apiDomain';

const createApiSlice = (name, fetchThunk) => createSlice({
    name,
    initialState: {
        loading: false,
        success: false,
        error: null,
        [name]: [],
    },
    reducers: {
        resetSendMessage: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
        resetstartConversation: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchThunk.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(fetchThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state[name] = action.payload;
            })
            .addCase(fetchThunk.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload || action.error.message;
            });
    },
});

export const fetchChannels = createAsyncThunk('fetchChannels', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/project_spaces.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
})
export const fetchConversations = createAsyncThunk('fetchConversations', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/conversations.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
})

export const fetchChannelById = createAsyncThunk('fetchChannelById', async ({ id, token, type }) => {
    if (type === 'group') {
        try {
            const response = await axios.get(`${baseURL}/project_spaces/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.log(error)
        }
    } else if (type === 'chat') {
        try {
            const response = await axios.get(`${baseURL}/conversations/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }
})

export const createMessage = createAsyncThunk('createMessage', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/messages.json`, { message: payload }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
})

export const startConversation = createAsyncThunk('startConversation', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/conversations.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error)
    }
})

export const fetchMessagesOfConversation = createAsyncThunk(
    'fetchMessagesOfConversation',
    async ({ token, id, page = 1 }) => {
        try {
            const response = await axios.get(`${baseURL}/messages.json`, {
                params: {
                    'q[conversation_id_eq]': id,
                    page,
                    per_page: 50
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return {
                messages: response.data.messages,
                meta: response.data.meta,
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
);


export const fetchChannelsSlice = createApiSlice('fetchChannels', fetchChannels);
export const fetchConversationsSlice = createApiSlice('fetchConversations', fetchConversations);
export const fetchChannelByIdSlice = createApiSlice('fetchChannelById', fetchChannelById);
export const createMessageSlice = createApiSlice('createMessage', createMessage);
export const startConversationSlice = createApiSlice('startConversation', startConversation);
export const fetchMessagesOfConversationSlice = createApiSlice('fetchMessagesOfConversation', fetchMessagesOfConversation);

export const fetchChannelsReducer = fetchChannelsSlice.reducer;
export const fetchConversationsReducer = fetchConversationsSlice.reducer;
export const fetchChannelByIdReducer = fetchChannelByIdSlice.reducer;
export const createMessageReducer = createMessageSlice.reducer;
export const startConversationReducer = startConversationSlice.reducer;
export const fetchMessagesOfConversationReducer = fetchMessagesOfConversationSlice.reducer;

export const { resetSendMessage } = createMessageSlice.actions;
export const { resetstartConversation } = startConversationSlice.actions;