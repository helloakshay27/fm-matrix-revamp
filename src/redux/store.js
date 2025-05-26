import { configureStore } from '@reduxjs/toolkit'
import { changeProjectStatusReducer, createProjectReducer, fetchProjectDetailsReducer, fetchProjectsReducer } from './slices/projectSlice'
import { createExternalUserReducer, createInternalUserReducer, fetchInternalUserReducer, userReducer } from './slices/userSlice'
import { createTagReducer, fetchTagsReducer } from './slices/tagsSlice'
import { createRoleReducer, editRoleReducer, fetchRolesReducer } from './slices/roleSlice'
import { createTaskCommentReducer, createTaskReducer, editTaskCommentReducer, fetchTasksCommentsReducer, fetchTasksReducer, taskDetailsReducer } from './slices/taskSlice'

export const store = configureStore({
  reducer: {
    //projects
    createProject: createProjectReducer,
    fetchProjects: fetchProjectsReducer,
    fetchProjectDetails: fetchProjectDetailsReducer,
    changeProjectStatus: changeProjectStatusReducer,

    //tasks
    createTask: createTaskReducer,
    fetchTasks: fetchTasksReducer,
    taskDetails: taskDetailsReducer,
    fetchTasksComments: fetchTasksCommentsReducer,
    createTaskComment: createTaskCommentReducer,
    editTaskComment: editTaskCommentReducer,

    //roles
    createRole: createRoleReducer,
    fetchRoles: fetchRolesReducer,
    editRole: editRoleReducer,

    //users
    user: userReducer,
    createInternalUser: createInternalUserReducer,
    fetchInternalUser: fetchInternalUserReducer,
    createExternalUser: createExternalUserReducer,

    //tags
    fetchTags: fetchTagsReducer,
    createTag: createTagReducer
  },
})