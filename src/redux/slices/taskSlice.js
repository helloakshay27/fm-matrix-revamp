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
        resetCommentEdit: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
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

export const createTask = createAsyncThunk('createTask', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/task_managements.json`,
            { task_management: payload },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
});

export const createSubTask = createAsyncThunk('createSubTask', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/task_managements.json`,
            { task_management: payload },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
});


export const fetchTasks = createAsyncThunk('fetchTasks', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/task_managements.json?q[milestone_id_eq]=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });


        return response.data;
    }
    catch (error) {
        console.log(error);
        return error.response.data;
    }
});

export const fetchMyTasks = createAsyncThunk('fetchMyTasks', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/task_managements/my_tasks.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });


        return response.data;
    }
    catch (error) {
        console.log(error);
        return error.response.data;
    }
});


export const updateTask = createAsyncThunk('updateTask', async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/task_managements/${id}.json`,
            { task_management: payload },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const taskDetails = createAsyncThunk('taskDetails', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/task_managements/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const editTask = createAsyncThunk('editTask', async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/task_managements/${id}.json`,
            { task_management: payload },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const deleteTask = createAsyncThunk('deleteTask', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/task_managements/${id}.json`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const createTaskComment = createAsyncThunk('createTaskComment', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/comments.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const editTaskComment = createAsyncThunk('editTaskComment', async ({ token, id, payload }) => {
    console.log(payload)
    try {
        const response = await axios.put(`${baseURL}/comments/${id}.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'Multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const deleteTaskComment = createAsyncThunk('deleteTaskComment', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/comments/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const changeTaskStatus = createAsyncThunk('changeTaskStatus', async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/task_managements/${id}/update_status.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const attachFiles = createAsyncThunk('attachFiles', async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/task_managements/${id}.json`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'Multipart/form-data'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const removeTaskAttachment = createAsyncThunk('removeTaskAttachment', async ({ token, id, image_id }) => {
    try {
        const response = await axios.delete(`${baseURL}/task_managements/${id}/remove_attachemnts/${image_id}.json`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'Multipart/form-data'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const fetchTasksOfProject = createAsyncThunk('fetchTasksOfProject', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/task_managements.json?q[project_management_id_eq]=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
});

export const fetchTasksOfMilestone = createAsyncThunk('fetchTasksOfMilestone', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/task_managements.json?q[milestone_id_eq]=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
});

export const filterTask = createAsyncThunk('filterTask',
    async ({ token, filter }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filter).toString();
            console.log(params);
            const response = await axios.get(
                `${baseURL}/task_managements.json?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createDependancy = createAsyncThunk('createDependancy', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/task_dependencies.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const updateDependancy = createAsyncThunk('updateDependancy', async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/task_dependencies/${id}.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})


export const createTaskSlice = createApiSlice('createTask', createTask);
export const fetchTasksSlice = createApiSlice('fetchTasks', fetchTasks);
export const editTaskSlice = createApiSlice('editTask', editTask);
export const taskDetailsSlice = createApiSlice('taskDetails', taskDetails);
export const createTaskCommentSlice = createApiSlice('createTaskComment', createTaskComment);
export const editTaskCommentSlice = createApiSlice('editTaskComment', editTaskComment);
export const deleteTaskCommentSlice = createApiSlice('deleteTaskComment', deleteTaskComment);
export const changeTaskStatusSlice = createApiSlice('changeTaskStatus', changeTaskStatus);
export const createSubtaskSlice = createApiSlice('createSubTask', createSubTask);
export const deleteTaskSlice = createApiSlice('deleteTask', deleteTask);
export const attachFilesSlice = createApiSlice('attachFiles', attachFiles);
export const fetchTasksOfProjectSlice = createApiSlice('fetchTasksOfProject', fetchTasksOfProject);
export const updateTaskSlice = createApiSlice('updateTask', updateTask);
export const filterTaskSlice = createApiSlice('filterTask', filterTask);
export const createDependancySlice = createApiSlice('createDependancy', createDependancy);
export const updateDependancySlice = createApiSlice('updateDependancy', updateDependancy);
export const fetchMyTasksSlice = createApiSlice('fetchMyTasks', fetchMyTasks);
export const fetchTasksOfMilestoneSlice = createApiSlice('fetchTasksOfMilestone', fetchTasksOfMilestone);
export const removeTaskAttachmentSlice = createApiSlice('removeTaskAttachment', removeTaskAttachment);

export const createTaskReducer = createTaskSlice.reducer;
export const fetchTasksReducer = fetchTasksSlice.reducer;
export const editTaskReducer = editTaskSlice.reducer;
export const taskDetailsReducer = taskDetailsSlice.reducer;
export const createTaskCommentReducer = createTaskCommentSlice.reducer;
export const editTaskCommentReducer = editTaskCommentSlice.reducer;
export const deleteTaskCommentReducer = deleteTaskCommentSlice.reducer;
export const changeTaskStatusReducer = changeTaskStatusSlice.reducer;
export const createSubtaskReducer = createSubtaskSlice.reducer;
export const deleteTaskReducer = deleteTaskSlice.reducer;
export const attachFilesReducer = attachFilesSlice.reducer;
export const fetchTasksOfProjectReducer = fetchTasksOfProjectSlice.reducer;
export const updateTaskReducer = updateTaskSlice.reducer;
export const filterTaskReducer = filterTaskSlice.reducer;
export const createDependancyReducer = createDependancySlice.reducer;
export const updateDependancyReducer = updateDependancySlice.reducer;
export const fetchMyTasksReducer = fetchMyTasksSlice.reducer;
export const fetchTasksOfMilestoneReducer = fetchTasksOfMilestoneSlice.reducer;
export const removeTaskAttachmentReducer = removeTaskAttachmentSlice.reducer;

export const { resetCommentEdit } = editTaskCommentSlice.actions;