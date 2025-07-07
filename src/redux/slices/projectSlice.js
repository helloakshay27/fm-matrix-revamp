import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseURL } from '../../../apiDomain';

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
        },
        resetProjectSuccess: (state) => {
            state.success = false;
        },
        resetEditSuccess: (state) => {
            state.success = false;
        },
        resetProjectCreateResponse: (state) => {
            state[name] = [];
            state.loading = false;
            state.success = false;
            state.error = null;
        },
        resetTeamCreateSuccess: (state) => {
            state.loading = false;
            state.success = false;
            state.error = null;
        },
        resetTeamUpdateSuccess: (state) => {
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

export const createProject = createAsyncThunk('createProject', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/project_managements.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const fetchProjects = createAsyncThunk('fetchProjects', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/project_managements.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})


export const fetchProjectDetails = createAsyncThunk('fetchProjectDetails', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/project_managements/${id}.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const changeProjectStatus = createAsyncThunk('changeProjectStatus', async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/project_managements/${id}.json`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
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
    async ({ token, id, payload }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${baseURL}/project_managements/${id}.json`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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


export const fetchProjectTypes = createAsyncThunk('fetchProjectTypes', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/project_types.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const fetchActiveProjectTypes = createAsyncThunk('fetchActiveProjectTypes', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/project_types.json?q[active_eq]=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
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
    async ({ token, payload }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${baseURL}/project_types.json`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
    async ({ token, id, data }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(
                `${baseURL}/project_types/${id}.json`,
                data,
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

export const deleteProjectType = createAsyncThunk(
    'deleteProjectType',
    async ({ token, id }, { rejectWithValue }) => {
        try {
            await axios.delete(`${baseURL}/project_types/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
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
    async ({ token, id }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${baseURL}/project_managements/${id}.json`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

export const fetchTemplates = createAsyncThunk('fetchTemplates', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/project_managements.json?q[is_template_eq]=true`, {
            headers: {
                Authorization: `Bearer ${token}`,
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
    async ({ token, filters }, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams(filters).toString();
            console.log(params);
            const response = await axios.get(
                `${baseURL}/project_managements.json?${params}`,
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

export const fetchProjectGroup = createAsyncThunk('fetchProjectGroup', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/project_groups.json`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        return response.data
    } catch (error) {
        console.log(error)
        return error.response.data
    }
})

export const createProjectGroup = createAsyncThunk('createProjectGroup', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/project_groups.json`, { project_group: payload }, {
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

export const updateProjectGroup = createAsyncThunk('updateProjectGroup', async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/project_groups/${id}.json`, { project_group: payload }, {
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

export const deleteProjectGroup = createAsyncThunk('deleteProjectGroup', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/project_groups/${id}.json`, {
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

export const createProjectTeam = createAsyncThunk('createProjectTeam', async ({ token, payload }) => {
    try {
        const response = await axios.post(`${baseURL}/project_teams.json`, payload, {
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

export const fetchProjectTeams = createAsyncThunk('fetchProjectTeams', async ({ token }) => {
    try {
        const response = await axios.get(`${baseURL}/project_teams.json`, {
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

export const fetchProjectTeam = createAsyncThunk('fetchProjectTeam', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/project_teams/${id}.json`, {
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

export const deleteProjectTeam = createAsyncThunk('deleteProjectTeam', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/project_teams/${id}.json`, {
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

export const updateProjectTeam = createAsyncThunk('updateProjectTeam', async ({ token, payload, id }) => {
    try {
        const response = await axios.put(`${baseURL}/project_teams/${id}.json`, payload, {
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

export const removeTagFromProject = createAsyncThunk('removeTagFromProject', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/task_tags/${id}.json`, {
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

export const removeMembersFromTeam = createAsyncThunk('removeMembersFromTeam', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/project_team_members/${id}.json`, {
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

export const removeMembersFromGroup = createAsyncThunk('removeMembersFromGroup', async ({ token, id }) => {
    try {
        const response = await axios.delete(`${baseURL}/project_group_members/${id}.json`, {
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

export const attachFiles = createAsyncThunk('attachFiles', async ({ token, id, payload }) => {
    try {
        const response = await axios.put(`${baseURL}/project_managements/${id}.json`,
            payload, {
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

export const removeAttachment = createAsyncThunk('removeAttachment', async ({ token, id, image_id }) => {
    try {
        const response = await axios.delete(`${baseURL}/project_managements/${id}/remove_attachemnts/${image_id}.json`, {
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

export const fetchProjectTeamMembers = createAsyncThunk('fetchProjectTeamMembers', async ({ token, id }) => {
    try {
        const response = await axios.get(`${baseURL}/project_teams.json?q[project_managements_id_eq]=${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return response.data[0].project_team_members;
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
export const fetchActiveProjectTypesSlice = createApiSlice('fetchActiveProjectTypes', fetchActiveProjectTypes);
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
export const deleteProjectTeamSlice = createApiSlice('deleteProjectTeam', deleteProjectTeam);
export const deleteProjectGroupSlice = createApiSlice('deleteProjectGroup', deleteProjectGroup);
export const removeAttachmentSlice = createApiSlice('removeAttachment', removeAttachment);
export const fetchProjectTeamMembersSlice = createApiSlice('fetchProjectTeamMembers', fetchProjectTeamMembers);


export const createProjectReducer = createProjectSlice.reducer;
export const fetchProjectsReducer = fetchProjectsSlice.reducer;
export const fetchProjectDetailsReducer = fetchProjectDetailsSlice.reducer;
export const changeProjectStatusReducer = changeProjectStatusSlice.reducer;
export const editProjectReducer = editProjectSlice.reducer;
export const fetchProjectTypeReducer = fetchProjectTypesSlice.reducer;
export const fetchActiveProjectTypesReducer = fetchActiveProjectTypesSlice.reducer;
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
export const deleteProjectTeamReducer = deleteProjectTeamSlice.reducer;
export const deleteProjectGroupReducer = deleteProjectGroupSlice.reducer;
export const removeAttachmentReducer = removeAttachmentSlice.reducer;
export const fetchProjectTeamMembersReducer = fetchProjectTeamMembersSlice.reducer;

export const { resetSuccess } = createProjectTeamSlice.actions;
export const { resetProjectSuccess } = createProjectSlice.actions;
export const { resetProjectCreateResponse } = createProjectSlice.actions;
export const { resetEditSuccess } = editProjectSlice.actions;
export const { resetTeamCreateSuccess } = createProjectTeamSlice.actions
export const { resetTeamUpdateSuccess } = updateProjectTeamSlice.actions
