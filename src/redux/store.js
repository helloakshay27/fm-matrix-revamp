import { configureStore } from '@reduxjs/toolkit'
import { changeProjectStatusReducer, createProjectReducer, editProjectReducer, fetchProjectDetailsReducer, fetchProjectsReducer } from './slices/projectSlice'
import { createExternalUserReducer, createInternalUserReducer, fetchExternalUserReducer, fetchInternalUserReducer, userReducer } from './slices/userSlice'
import { createTagReducer, fetchTagsReducer } from './slices/tagsSlice'
import { createRoleReducer, editRoleReducer, fetchRolesReducer } from './slices/roleSlice'
import { changeTaskStatusReducer, createTaskCommentReducer, createTaskReducer, editTaskCommentReducer, editTaskReducer, fetchTasksCommentsReducer, fetchTasksReducer, taskDetailsReducer } from './slices/taskSlice'
import { fetchOrganizationsReducer } from './slices/organizationSlice'

export const store = configureStore({
  reducer: {
    //projects
    createProject: createProjectReducer,
    fetchProjects: fetchProjectsReducer,
    fetchProjectDetails: fetchProjectDetailsReducer,
    changeProjectStatus: changeProjectStatusReducer,
    editProject: editProjectReducer,

    //tasks
    createTask: createTaskReducer,
    fetchTasks: fetchTasksReducer,
    editTask: editTaskReducer,
    taskDetails: taskDetailsReducer,
    changeTaskStatus: changeTaskStatusReducer,
    fetchTasksComments: fetchTasksCommentsReducer,
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

    //tags
    fetchTags: fetchTagsReducer,
    createTag: createTagReducer,

    //organizations
    fetchOrganizations: fetchOrganizationsReducer,
  },
})