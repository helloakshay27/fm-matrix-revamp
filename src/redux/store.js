import { configureStore } from '@reduxjs/toolkit'
import { changeProjectStatusReducer, createProjectReducer, createProjectTypesReducer, editProjectReducer, fetchProjectDetailsReducer, fetchProjectsReducer, fetchProjectTypeReducer, fetchProjectTypes } from './slices/projectSlice'
import { createExternalUserReducer, createInternalUserReducer, fetchExternalUserReducer, fetchInternalUserReducer, fetchUpdatelUserReducer, fetchUpdateUser, userReducer } from './slices/userSlice'
import { createTagReducer, fetchTagsReducer } from './slices/tagsSlice'
import { createRoleReducer, editRoleReducer, fetchRolesReducer } from './slices/roleSlice'
import { changeTaskStatusReducer, createTaskCommentReducer, createTaskReducer, editTaskCommentReducer, editTaskReducer, fetchTasksReducer, taskDetailsReducer } from './slices/taskSlice'
import { fetchOrganizationsReducer } from './slices/organizationSlice'

export const store = configureStore({
  reducer: {
    //projects
    createProject: createProjectReducer,
    fetchProjects: fetchProjectsReducer,
    fetchProjectDetails: fetchProjectDetailsReducer,
    changeProjectStatus: changeProjectStatusReducer,
    editProject: editProjectReducer,
    fetchProjectTypes: fetchProjectTypeReducer, 
    createdProjectTypes: createProjectTypesReducer,
    
    //tasks
    createTask: createTaskReducer,
    fetchTasks: fetchTasksReducer,
    editTask: editTaskReducer,
    taskDetails: taskDetailsReducer,
    changeTaskStatus: changeTaskStatusReducer,
    // fetchTasksComments: fetchTasksCommentsReducer,
    createTaskComment: createTaskCommentReducer,
    editTaskComment: editTaskCommentReducer,

    //roles
    createRole: createRoleReducer,
    fetchRoles: fetchRolesReducer,
    editRole: editRoleReducer,

    //users
    fetchUsers: userReducer,
    createInternalUser: createInternalUserReducer,
    fetchInternalUser: fetchInternalUserReducer,
    createExternalUser: createExternalUserReducer,
    fetchExternalUser: fetchExternalUserReducer,
    fetchUpdateUser: fetchUpdatelUserReducer,

    //tags
    fetchTags: fetchTagsReducer,
    createTag: createTagReducer,

    //organizations
    fetchOrganizations: fetchOrganizationsReducer,
  },
})