import { configureStore } from '@reduxjs/toolkit'
import { changeProjectStatusReducer, createProjectReducer, createProjectTypesReducer, deleteProjectReducer, editProjectReducer, fetchProjectDetailsReducer, fetchProjectsReducer, fetchProjectTypeReducer, fetchProjectTypes, fetchTemplatesReducer } from './slices/projectSlice'
import { changeProjectStatusReducer, createProjectReducer, deleteProjectReducer, editProjectReducer, fetchProjectDetailsReducer, fetchProjectsReducer, fetchTemplatesReducer } from './slices/projectSlice'
import { createExternalUserReducer, createInternalUserReducer, fetchExternalUserReducer, fetchInternalUserReducer, fetchUpdatelUserReducer, fetchUpdateUser, userReducer } from './slices/userSlice'
import { createTagReducer, fetchTagsReducer } from './slices/tagsSlice'
import { createRoleReducer, editRoleReducer, fetchRolesReducer } from './slices/roleSlice'
import { changeTaskStatusReducer, createTaskCommentReducer, createTaskReducer, editTaskCommentReducer, editTaskReducer, fetchTasksReducer, taskDetailsReducer } from './slices/taskSlice'
import { fetchOrganizationsReducer } from './slices/organizationSlice'
import { createMilestoneReducer } from './slices/milestoneSlice'

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
    fetchTemplates: fetchTemplatesReducer,
    deleteProject: deleteProjectReducer,

    //tasks
    createTask: createTaskReducer,
    fetchTasks: fetchTasksReducer,
    editTask: editTaskReducer,
    taskDetails: taskDetailsReducer,
    changeTaskStatus: changeTaskStatusReducer,
    // fetchTasksComments: fetchTasksCommentsReducer,
    createTaskComment: createTaskCommentReducer,
    editTaskComment: editTaskCommentReducer,

    //Milestone
    createMilestone: createMilestoneReducer,

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