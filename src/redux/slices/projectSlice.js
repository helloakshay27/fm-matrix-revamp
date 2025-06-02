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


export const fetchProjectTypes = createAsyncThunk('fetchProjectTypes', async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/project_types.json`, {
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

export const createProjectType = createAsyncThunk(
    'createProjectTypes',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `https://api-tasks.lockated.com/project_types.json`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProjectType = createAsyncThunk(
    'projectTypesUpdate',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `https://api-tasks.lockated.com/project_types/${id}.json`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteProjectType = createAsyncThunk(
    'deleteProjectType',
    async (id, { rejectWithValue }) => {
      try {
        await axios.delete(`https://api-tasks.lockated.com/project_types/${id}.json`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
  
        return id; 
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );





export const deleteProject = createAsyncThunk(
    'deleteProject',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `https://api-tasks.lockated.com/project_managements/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                }
            )
            return response.data
        } catch (error) {
            console.error('Error deleting project:', error)
            return rejectWithValue(error.response?.data || { message: 'Unknown error' })
        }
    }
)

export const fetchTemplates = createAsyncThunk('fetchTemplates', async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/project_managements.json?q[is_template_eq]=true`, {
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


export const filterProjects = createAsyncThunk(
    'filterProjects',
    async (filters, { rejectWithValue }) => {
      try {
        const params = new URLSearchParams(filters).toString();
        console.log(params);
        const response = await axios.get(
          `https://api-tasks.lockated.com/project_managements.json?${params}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
  
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  

export const createProjectSlice = createApiSlice('createProject', createProject);
export const fetchProjectsSlice = createApiSlice('fetchProjects', fetchProjects);
export const fetchProjectDetailsSlice = createApiSlice('fetchProjectDetails', fetchProjectDetails);
export const changeProjectStatusSlice = createApiSlice('changeProjectStatus', changeProjectStatus);
export const editProjectSlice = createApiSlice('editProject', editProject);
export const fetchProjectTypesSlice = createApiSlice('fetchProjectTypes', fetchProjectTypes);
export const createProjectTypesSlice = createApiSlice('createProjectTypes', createProjectType);
export const fetchTemplatesSlice = createApiSlice('fetchTemplates', fetchTemplates);
export const deleteProjectSlice = createApiSlice('deleteProject', deleteProject);
export const updateProjectTypeSlice = createApiSlice('updateProjectType', updateProjectType);
export const deleteProjectTypeSlice = createApiSlice('deleteProjectType', deleteProjectType);
export const filterProjectsSlice = createApiSlice('filterProjects', filterProjects);


export const createProjectReducer = createProjectSlice.reducer;
export const fetchProjectsReducer = fetchProjectsSlice.reducer;
export const fetchProjectDetailsReducer = fetchProjectDetailsSlice.reducer;
export const changeProjectStatusReducer = changeProjectStatusSlice.reducer;
export const editProjectReducer = editProjectSlice.reducer;
export const fetchProjectTypeReducer = fetchProjectTypesSlice.reducer;
export const createProjectTypesReducer = createProjectTypesSlice.reducer;
export const fetchTemplatesReducer = fetchTemplatesSlice.reducer;
export const deleteProjectReducer = deleteProjectSlice.reducer;
export const updateProjectTypeReducer = updateProjectTypeSlice.reducer;
export const deleteProjectTypeReducer = deleteProjectTypeSlice.reducer;
export const filterProjectsReducer = filterProjectsSlice.reducer;
