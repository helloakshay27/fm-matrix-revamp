import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const access_token = localStorage.getItem("token");

const createApiSlice = (name, fetchThunk) => createSlice({
    name,
    initialState: {
        loading: false,
        success: false,
        error: null,
        [name]: [],
    },
    reducers: {
        resetSuccess: (state) => {
            state.success = false;
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

export const createProject = createAsyncThunk('createProject', async (payload) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/project_managements.json`, payload, {
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

export const fetchProjectDetails = createAsyncThunk('fetchProjectDetails', async ({ id }) => {
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

export const fetchProjectGroup = createAsyncThunk('fetchProjectGroup', async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/project_groups.json`, {
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

export const createProjectGroup = createAsyncThunk('createProjectGroup', async (payload) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/project_groups.json`, { project_group: payload }, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const updateProjectGroup = createAsyncThunk('updateProjectGroup', async ({ id, payload }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/project_groups/${id}.json`, { project_group: payload }, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const createProjectTeam = createAsyncThunk('createProjectTeam', async ({ payload }) => {
    try {
        const response = await axios.post(`https://api-tasks.lockated.com/project_teams.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const fetchProjectTeams = createAsyncThunk('fetchProjectTeams', async () => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/project_teams.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const fetchProjectTeam = createAsyncThunk('fetchProjectTeam', async ({ id }) => {
    try {
        const response = await axios.get(`https://api-tasks.lockated.com/project_teams/${id}.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const updateProjectTeam = createAsyncThunk('updateProjectTeam', async ({ payload, id }) => {
    try {
        const response = await axios.put(`https://api-tasks.lockated.com/project_teams/${id}.json`, payload, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const removeTagFromProject = createAsyncThunk('removeTagFromProject', async ({ id }) => {
    try {
        const response = await axios.delete(`https://api-tasks.lockated.com/task_tags/${id}.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const removeMembersFromTeam = createAsyncThunk('removeMembersFromTeam', async ({ id }) => {
    try {
        const response = await axios.delete(`https://api-tasks.lockated.com/project_team_members/${id}.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const removeMembersFromGroup = createAsyncThunk('removeMembersFromGroup', async ({ id }) => {
    try {
        const response = await axios.delete(`https://api-tasks.lockated.com/project_group_members/${id}.json`, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })
        return response.data;
    }
    catch (error) {
        console.log(error)
        return error.response.data
    }
})

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
export const fetchProjectGroupSlice = createApiSlice('fetchProjectGroup', fetchProjectGroup);
export const createProjectGroupSlice = createApiSlice('createProjectGroup', createProjectGroup);
export const updateProjectGroupSlice = createApiSlice('updateProjectGroup', updateProjectGroup);
export const createProjectTeamSlice = createApiSlice('createProjectTeam', createProjectTeam);
export const fetchProjectTeamsSlice = createApiSlice('fetchProjectTeams', fetchProjectTeams);
export const fetchProjectTeamSlice = createApiSlice('fetchProjectTeam', fetchProjectTeam);
export const updateProjectTeamSlice = createApiSlice('updateProjectTeam', updateProjectTeam);
export const removeTagFromProjectSlice = createApiSlice('removeTagFromProject', removeTagFromProject);
export const removeMembersFromTeamSlice = createApiSlice('removeMembersFromTeam', removeMembersFromTeam);
export const removeMembersFromGroupSlice = createApiSlice('removeMembersFromGroup', removeMembersFromGroup);


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
export const fetchProjectGroupReducer = fetchProjectGroupSlice.reducer;
export const createProjectGroupReducer = createProjectGroupSlice.reducer;
export const updateProjectGroupReducer = updateProjectGroupSlice.reducer;
export const createProjectTeamReducer = createProjectTeamSlice.reducer;
export const fetchProjectTeamsReducer = fetchProjectTeamsSlice.reducer;
export const fetchProjectTeamReducer = fetchProjectTeamSlice.reducer;
export const updateProjectTeamReducer = updateProjectTeamSlice.reducer;
export const removeTagFromProjectReducer = removeTagFromProjectSlice.reducer;
export const removeMembersFromTeamReducer = removeMembersFromTeamSlice.reducer;
export const removeMembersFromGroupReducer = removeMembersFromGroupSlice.reducer;

export const { resetSuccess } = createProjectTeamSlice.actions;