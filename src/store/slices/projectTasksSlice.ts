import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseClient } from "@/utils/withoutTokenBase";
import createApiSlice from "../api/apiSlice";

export const fetchProjectTasks = createAsyncThunk(
    "fetchProjectTasks",
    async ({ token, baseUrl, id }: { token: string, baseUrl: string, id: string }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.get(`https://${baseUrl}/task_managements.json?q[milestone_id_eq]=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.get(`/task_managements.json?q[milestone_id_eq]=${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to fetch project tasks'
            return rejectWithValue(message)
        }
    }
)

export const fetchKanbanTasksOfProject = createAsyncThunk(
    'fetchKanbanTasks',
    async (
        { 
            baseUrl, 
            token, 
            id, 
            responsible_person_id,
            selectedFilterOption,
            selectedStatuses,
            selectedWorkflowStatus,
            selectedResponsible,
            selectedCreators,
            selectedProjects,
            dates
        }: { 
            baseUrl: string; 
            token: string; 
            id?: string; 
            responsible_person_id?: string;
            selectedFilterOption?: string;
            selectedStatuses?: string[];
            selectedWorkflowStatus?: string[];
            selectedResponsible?: number[];
            selectedCreators?: number[];
            selectedProjects?: number[];
            dates?: { startDate: string; endDate: string };
        },
        { rejectWithValue }
    ) => {
        try {
            let endpoint = `/task_managements/kanban.json`;
            const params = new URLSearchParams();

            if (id) {
                params.append('q[project_management_id_eq]', id);
            }
            if (responsible_person_id) {
                params.append('q[responsible_person_id_eq]', responsible_person_id);
            }

            // Apply filters
            if (selectedFilterOption && selectedFilterOption !== "all") {
                params.append('q[status_eq]', selectedFilterOption);
            }

            if (selectedStatuses && selectedStatuses.length > 0) {
                selectedStatuses.forEach(status => {
                    params.append('q[status_in][]', status);
                });
            }

            if (selectedWorkflowStatus && selectedWorkflowStatus.length > 0) {
                selectedWorkflowStatus.forEach(status => {
                    params.append('q[project_status_id_in][]', status);
                });
            }

            if (selectedResponsible && selectedResponsible.length > 0) {
                selectedResponsible.forEach(id => {
                    params.append('q[responsible_person_id_in][]', id.toString());
                });
            }

            if (selectedCreators && selectedCreators.length > 0) {
                selectedCreators.forEach(id => {
                    params.append('q[created_by_id_in][]', id.toString());
                });
            }

            if (selectedProjects && selectedProjects.length > 0) {
                selectedProjects.forEach(projectId => {
                    params.append('q[project_management_id_in][]', projectId.toString());
                });
            }

            if (dates?.startDate) {
                params.append('q[start_date_eq]', dates.startDate);
            }

            if (dates?.endDate) {
                params.append('q[end_date_eq]', dates.endDate);
            }

            if (params.toString()) {
                endpoint += `?${params.toString()}`;
            }

            const response = baseUrl
                ? await axios.get(`https://${baseUrl}${endpoint}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                : await baseClient.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

            return response.data;
        } catch (error) {
            console.error(error);
            return rejectWithValue(error);
        }
    }
);


export const createProjectTask = createAsyncThunk(
    "createProjectTask",
    async ({ token, baseUrl, data }: { token: string, baseUrl: string, data: any }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.post(`https://${baseUrl}/task_managements.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.post(`/task_managements.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
            return response.data
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const editProjectTask = createAsyncThunk(
    "editProjectTask",
    async ({ token, baseUrl, id, data }: { token: string, baseUrl: string, id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.put(`https://${baseUrl}/task_managements/${id}.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.put(`/task_managements/${id}.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
            return response.data
        } catch (error) {
            const message = error
            return rejectWithValue(message)
        }
    }
)

export const updateTaskStatus = createAsyncThunk(
    "updateTaskStatus",
    async ({ token, baseUrl, id, data }: { token: string, baseUrl: string, id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.put(`https://${baseUrl}/task_managements/${id}/update_status.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.put(`/task_managements/${id}/update_status.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
            return response.data
        } catch (error) {
            const message = error
            return rejectWithValue(message)
        }
    }
)

export const fetchProjectTasksById = createAsyncThunk('fetchProjectTasksById', async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
    try {
        const response = baseUrl
            ? await axios.get(`https://${baseUrl}/task_managements/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            : await baseClient.get(`/task_managements/${id}.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        return response.data;
    }
    catch (error) {
        return rejectWithValue(error);
    }
})

export const filterTasks = createAsyncThunk(
    "filterTasks",
    async ({ token, baseUrl, params }: { token: string, baseUrl: string, params: any }, { rejectWithValue }) => {
        console.log(params)
        try {
            const response = baseUrl
                ? await axios.get(`https://${baseUrl}/task_managements.json`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params
                })
                : await baseClient.get(`/task_managements.json`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params
                })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to filter tasks'
            return rejectWithValue(message)
        }
    }
)

export const fetchUserAvailability = createAsyncThunk('fetchUserAvailability', async ({ baseUrl, token, id }: { baseUrl: string, token: string, id: string }, { rejectWithValue }) => {
    try {
        const response = baseUrl
            ? await axios.get(`https://${baseUrl}/users/${id}/daily_task_load_report.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            : await baseClient.get(`/users/${id}/daily_task_load_report.json`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        return response.data;
    }
    catch (error) {
        const message = error.response?.data?.error || error.error || 'Failed to fetch user availability'
        return rejectWithValue(message)
    }
})

export const fetchTargetDateTasks = createAsyncThunk('fetchTargetDateTasks', async ({ baseUrl, token, id, date }: { baseUrl: string, token: string, id: string, date: string }, { rejectWithValue }) => {
    try {
        const response = baseUrl
            ? await axios.get(`https://${baseUrl}/task_managements/filtered_tasks.json?allocation_date=${date}&responsible_person_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            : await baseClient.get(`/task_managements/filtered_tasks.json?allocation_date=${date}&responsible_person_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const createTaskDependency = createAsyncThunk(
    'createTaskDependency',
    async ({ token, baseUrl, data }: { token: string, baseUrl: string, data: any }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.post(`https://${baseUrl}/task_dependencies.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.post(`/task_dependencies.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to create dependency'
            return rejectWithValue(message)
        }
    }
)

export const updateTaskDependency = createAsyncThunk(
    'updateTaskDependency',
    async ({ token, baseUrl, id, data }: { token: string, baseUrl: string, id: string, data: any }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.put(`https://${baseUrl}/task_dependencies/${id}.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.put(`/task_dependencies/${id}.json`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to update dependency'
            return rejectWithValue(message)
        }
    }
)

export const deleteTaskDependency = createAsyncThunk(
    'deleteTaskDependency',
    async ({ token, baseUrl, id }: { token: string, baseUrl: string, id: string }, { rejectWithValue }) => {
        try {
            const response = baseUrl
                ? await axios.delete(`https://${baseUrl}/task_dependencies/${id}.json`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                : await baseClient.delete(`/task_dependencies/${id}.json`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
            return response.data
        } catch (error) {
            const message = error.response?.data?.error || error.error || 'Failed to delete dependency'
            return rejectWithValue(message)
        }
    }
)

const fetchProjectTasksSlice = createApiSlice("fetchProjectTasks", fetchProjectTasks)
const createProjectTaskSlice = createApiSlice("createProjectTask", createProjectTask)
const fetchProjectTasksByIdSlice = createApiSlice("fetchProjectTasksById", fetchProjectTasksById)
const fetchUserAvailabilitySlice = createApiSlice("fetchUserAvailability", fetchUserAvailability)
const fetchTargetDateTasksSlice = createApiSlice("fetchTargetDateTasks", fetchTargetDateTasks)
const editProjectTaskSlice = createApiSlice("editProjectTask", editProjectTask)
const filterTasksSlice = createApiSlice("filterTasks", filterTasks)
const updateTaskStatusSlice = createApiSlice("updateTaskStatus", updateTaskStatus)
const createTaskDependencySlice = createApiSlice("createTaskDependency", createTaskDependency)
const updateTaskDependencySlice = createApiSlice("updateTaskDependency", updateTaskDependency)
const deleteTaskDependencySlice = createApiSlice("deleteTaskDependency", deleteTaskDependency)
const fetchKanbanTasksOfProjectSlice = createApiSlice("fetchKanbanTasksOfProject", fetchKanbanTasksOfProject)

export const fetchProjectTasksReducer = fetchProjectTasksSlice.reducer
export const createProjectTaskReducer = createProjectTaskSlice.reducer
export const fetchProjectTasksByIdReducer = fetchProjectTasksByIdSlice.reducer
export const fetchUserAvailabilityReducer = fetchUserAvailabilitySlice.reducer
export const fetchTargetDateTasksReducer = fetchTargetDateTasksSlice.reducer
export const editProjectTaskReducer = editProjectTaskSlice.reducer
export const filterTasksReducer = filterTasksSlice.reducer
export const updateTaskStatusReducer = updateTaskStatusSlice.reducer
export const createTaskDependencyReducer = createTaskDependencySlice.reducer
export const updateTaskDependencyReducer = updateTaskDependencySlice.reducer
export const deleteTaskDependencyReducer = deleteTaskDependencySlice.reducer
export const fetchKanbanTasksOfProjectReducer = fetchKanbanTasksOfProjectSlice.reducer
