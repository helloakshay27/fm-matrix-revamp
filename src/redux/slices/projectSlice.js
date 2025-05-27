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

export const createProject = createAsyncThunk('createProject', async (paylode) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/project_managements.json`, paylode, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const fetchProjects = createAsyncThunk('fetchProjects', async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/project_managements.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const fetchProjectDetails = createAsyncThunk('fetchProjectDetails', async (id) => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/project_managements/${id}.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const changeProjectStatus = createAsyncThunk('changeProjectStatus', async ({ id, payload }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/project_managements/${id}.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const editProject = createAsyncThunk(
    'editProject',
    async ({ id, payload }, { rejectWithValue }) => {
      try {
        const response = await axios.put(
          `https://api-tasks.lockated.com/project_managements/${id}.json`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        return response.data
      } catch (error) {
        console.error('Error updating project:', error)
        return rejectWithValue(error.response?.data || { message: 'Unknown error' })
      }
    }
  )



export const createProjectSlice = createApiSlice('createProject', createProject);
export const fetchProjectsSlice = createApiSlice('fetchProjects', fetchProjects);
export const fetchProjectDetailsSlice = createApiSlice('fetchProjectDetails', fetchProjectDetails);
export const changeProjectStatusSlice = createApiSlice('changeProjectStatus', changeProjectStatus);
export const editProjectSlice = createApiSlice('editProject', editProject);


export const createProjectReducer = createProjectSlice.reducer;
export const fetchProjectsReducer = fetchProjectsSlice.reducer;
export const fetchProjectDetailsReducer = fetchProjectDetailsSlice.reducer;
export const changeProjectStatusReducer = changeProjectStatusSlice.reducer;
export const editProjectReducer = editProjectSlice.reducer;