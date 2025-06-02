import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const access_token = 'bTcVnWgQrF6QCdNbMiPXzCZNAqsN9qoEfFWdFQ1Auk4'

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

export const createTask = createAsyncThunk('createTask', async (payload) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/task_managements.json`,
            { task_management: payload },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
});

export const createSubTask = createAsyncThunk('createSubTask', async (payload) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/task_managements.json`,
            { task_management: payload },
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
});


export const fetchTasks = createAsyncThunk('fetchTasks', async () => {
    try {
         const response = await axios.get(`https://api-tasks.lockated.com/task_managements.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });
    

        return response.data;
    }
     catch (error) {
        console.log(error);
        return error.response.data;
    }
});


export const updateTask= createAsyncThunk('updateTask', async ({ id, payload }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/task_managements/${id}.json`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const taskDetails = createAsyncThunk('taskDetails', async (id) => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/task_managements/${id}.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const editTask = createAsyncThunk('editTask', async ({ id, payload }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/task_managements/${id}.json`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const deleteTask = createAsyncThunk('deleteTask', async (id) => {
    try {
        const response = await axios.delete(`https://api-tasks.lockated.com/task_managements/${id}.json`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

// export const fetchTasksComments = createAsyncThunk('fetchTasksComments', async (id) => {
//     try {
//         const response = await axios.get(`https://api-tasks.lockated.com/comments.json`, {
//             headers: {
//                 Authorization: `Bearer ${access_token}`,
//             }
//         });

//         return response.data;
//     } catch (error) {
//         console.log(error);
//         return error.response.data;
//     }
// })

export const createTaskComment = createAsyncThunk('createTaskComment', async (payload) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/comments.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const editTaskComment = createAsyncThunk('editTaskComment', async ({ id, payload }) => {
    console.log(payload)
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/comments/${id}.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'Multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const changeTaskStatus = createAsyncThunk('changeTaskStatus', async ({ id, payload }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/task_managements/${id}/update_status.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const attachFiles = createAsyncThunk('attachFiles', async ({ id, payload }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/task_managements/${id}.json`,
            payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
                'Content-Type': 'Multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
})

export const fetchTasksOfProject = createAsyncThunk('fetchTasksOfProject', async (id) => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/task_managements.json?q[project_management_id_eq]=${id}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.log(error);
        return error.response.data;
    }
});

export const filterTask = createAsyncThunk('filterTask', async (filter) => {
    try {
         const params=Object.keys(filter).map((key) => `${key}=${filter[key]}`).join('&');
        //  const params = filter.map((f) => `${f.key}=${f.value}`).join('&');
         console.log(params);
         const response = await axios.get(`https://api-tasks.lockated.com/task_managements.json?${params}`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        });
    

        return response.data;
    }
     catch (error) {
        console.log(error);
        return error.response.data;
    }
});

export const createTaskSlice = createApiSlice('createTask', createTask);
export const fetchTasksSlice = createApiSlice('fetchTasks', fetchTasks);
export const editTaskSlice = createApiSlice('editTask', editTask);
export const taskDetailsSlice = createApiSlice('taskDetails', taskDetails);
export const createTaskCommentSlice = createApiSlice('createTaskComment', createTaskComment);
export const editTaskCommentSlice = createApiSlice('editTaskComment', editTaskComment);
export const changeTaskStatusSlice = createApiSlice('changeTaskStatus', changeTaskStatus);
export const createSubtaskSlice = createApiSlice('createSubTask', createSubTask);
export const deleteTaskSlice = createApiSlice('deleteTask', deleteTask);
export const attachFilesSlice = createApiSlice('attachFiles', attachFiles);
export const fetchTasksOfProjectSlice = createApiSlice('fetchTasksOfProject', fetchTasksOfProject);
export const updateTaskSlice = createApiSlice('updateTask', updateTask);
export const filterTaskSlice = createApiSlice('filterTask', filterTask);

export const createTaskReducer = createTaskSlice.reducer;
export const fetchTasksReducer = fetchTasksSlice.reducer;
export const editTaskReducer = editTaskSlice.reducer;
export const taskDetailsReducer = taskDetailsSlice.reducer;
export const createTaskCommentReducer = createTaskCommentSlice.reducer;
export const editTaskCommentReducer = editTaskCommentSlice.reducer;
export const changeTaskStatusReducer = changeTaskStatusSlice.reducer;
export const createSubtaskReducer = createSubtaskSlice.reducer;
export const deleteTaskReducer = deleteTaskSlice.reducer;
export const attachFilesReducer = attachFilesSlice.reducer;
export const fetchTasksOfProjectReducer = fetchTasksOfProjectSlice.reducer;
export const updateTaskReducer = updateTaskSlice.reducer;
export const filterTaskReducer = filterTaskSlice.reducer;