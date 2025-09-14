import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL } from '../../../apiDomain';

// Generic slice factory
const createApiSlice = (name, fetchThunk) => createSlice({
    name,
    initialState: {
        loading: false,
        success: false,
        error: null,
        [name]: [],
    },
    reducers: {},
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

// Fetch users thunk
export const fetchUsers = createAsyncThunk('fetchUsers', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/users.json?q[active_eq]=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error)
    }
});

export const createInternalUser = createAsyncThunk('createInternalUser', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/users.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        return error.response.data
    }
});

export const fetchInternalUser = createAsyncThunk('fetchInternalUser', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/users.json?q[user_type_eq]=internal`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const createExternalUser = createAsyncThunk('createExternalUser', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/users.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const fetchInternalUserDetails = createAsyncThunk('fetchInternalUserDetails', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/user_details/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
})

export const fetchExternalUser = createAsyncThunk('fetchExternalUser', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/users.json?q[user_type_eq]=external`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.log(error);
    }
});

export const fetchUpdateUser = createAsyncThunk(
    'updateUser',
    async ({ token, userId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${baseURL}/users/${userId}.json`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Unknown error');
        }
    }
);

export const LoginUser = createAsyncThunk('LoginUser', async (payload) => {
    try {
        const response = await axios.post('${baseURL}/users/login.json', payload);
        return response.data;
    } catch (error) {
        console.log(error);
    }
})

export const removeUserFromProject = createAsyncThunk('removeUserFromProject', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/task_users/${id}.json`, {
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

export const fetchAssociatedProjects = createAsyncThunk('fetchAssociatedProjects', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/users/${id}/asssoicated_projects.json`, {
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

export const reassignProjects = createAsyncThunk('reassignProjects', async ({ token, payload, id }) => {
    try {
        const response = await axios.put(`${baseURL}/users/${id}/reassign_user_tasks.json`, payload, {
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

export const fetchUserAvailability = createAsyncThunk('fetchUserAvailability', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/users/${id}/daily_task_load_report.json`, {
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

// Create slices
export const userSlice = createApiSlice('fetchUsers', fetchUsers);
export const createInternalUserSlice = createApiSlice('createInternalUser', createInternalUser);
export const fetchInternalUserSlice = createApiSlice('fetchInternalUser', fetchInternalUser);
export const createExternalUserSlice = createApiSlice('createExternalUser', createExternalUser);
export const fetchExternalUserSlice = createApiSlice('fetchExternalUser', fetchExternalUser);
export const fetchUpdateUserSlice = createApiSlice('fetchUpdateUser', fetchUpdateUser);
export const fetchInternalUserDetailsSlice = createApiSlice('fetchInternalUserDetails', fetchInternalUserDetails);
export const removeUserFromProjectSlice = createApiSlice('removeUserFromProject', removeUserFromProject);
export const fetchAssociatedProjectsSlice = createApiSlice('fetchAssociatedProjects', fetchAssociatedProjects);
export const reassignProjectsSlice = createApiSlice('reassignProjects', reassignProjects);
export const fetchUserAvailabilitySlice = createApiSlice('fetchUserAvailability', fetchUserAvailability);

// Export reducers
export const userReducer = userSlice.reducer;
export const createInternalUserReducer = createInternalUserSlice.reducer;
export const fetchInternalUserReducer = fetchInternalUserSlice.reducer;
export const createExternalUserReducer = createExternalUserSlice.reducer;
export const fetchExternalUserReducer = fetchExternalUserSlice.reducer;
export const fetchUpdatelUserReducer = fetchUpdateUserSlice.reducer;
export const fetchInternalUserDetailsReducer = fetchInternalUserDetailsSlice.reducer;
export const removeUserFromProjectReducer = removeUserFromProjectSlice.reducer;
export const fetchAssociatedProjectsReducer = fetchAssociatedProjectsSlice.reducer;
export const reassignProjectsReducer = reassignProjectsSlice.reducer;
export const fetchUserAvailabilityReducer = fetchUserAvailabilitySlice.reducer;
