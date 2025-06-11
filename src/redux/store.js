import { configureStore } from '@reduxjs/toolkit'
import { changeProjectStatusReducer, createProject, createProjectReducer, createProjectTypesReducer, deleteProjectReducer, editProjectReducer, fetchProjectDetailsReducer, fetchProjectsReducer, fetchProjectTypeReducer, fetchTemplatesReducer, filterProjectsReducer, updateProjectTypeReducer, fetchProjectGroupReducer, createProjectGroupReducer, updateProjectGroupReducer, createProjectTeamReducer, fetchProjectTeamsReducer, fetchProjectTeamReducer, updateProjectTeamReducer } from './slices/projectSlice'
import { createExternalUserReducer, createInternalUserReducer, fetchExternalUserReducer, fetchInternalUserReducer, fetchUpdatelUserReducer, userReducer } from './slices/userSlice'
import { createTagReducer, deleteTagReducer, fetchTagsReducer, updateTagReducer } from './slices/tagsSlice'
import { createRoleReducer, editRoleReducer, fetchRolesReducer } from './slices/roleSlice'
import { changeTaskStatusReducer, createDependancyReducer, createTaskCommentReducer, createTaskReducer, editTaskCommentReducer, editTaskReducer, fetchTasksOfProjectReducer, fetchTasksReducer, filterTaskReducer, taskDetailsReducer, updateDependancyReducer } from './slices/taskSlice'
import { fetchOrganizationsReducer } from './slices/organizationSlice'
import { createMilestoneReducer, fetchMilestoneByIdReducer, fetchMilestoneReducer } from './slices/milestoneSlice'
import { fetchSpirintByIdReducer, fetchSpirintsReducer, postSprintReducer, putSprintReducer } from './slices/spirintSlice'
import { createIssueReducer, fetchIssueReducer, updateIssueReducer } from './slices/IssueSlice'
import { fetchStatusReducer, createStatusReducer, updateStatusReducer } from './slices/statusSlice'

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
    updateProjectType: updateProjectTypeReducer,
    deleteProjectType: deleteProjectReducer,
    filterProjects: filterProjectsReducer,
    createProjectGroup: createProjectGroupReducer,
    updateProjectGroup: updateProjectGroupReducer,
    fetchProjectGroup: fetchProjectGroupReducer,
    createProjectTeam: createProjectTeamReducer,
    fetchProjectTeams: fetchProjectTeamsReducer,
    fetchProjectTeam: fetchProjectTeamReducer,
    updateProjectTeam: updateProjectTeamReducer,

    //tasks
    createTask: createTaskReducer,
    fetchTasks: fetchTasksReducer,
    editTask: editTaskReducer,
    taskDetails: taskDetailsReducer,
    changeTaskStatus: changeTaskStatusReducer,
    filterTask: filterTaskReducer,
    createDependancy: createDependancyReducer,
    updateDependancy: updateDependancyReducer,

    //issues
    createIssues: createIssueReducer,
    fetchIssues: fetchIssueReducer,
    updateIssues: updateIssueReducer,

    // fetchTasksComments: fetchTasksCommentsReducer,
    createTaskComment: createTaskCommentReducer,
    editTaskComment: editTaskCommentReducer,
    fetchTasksOfProject: fetchTasksOfProjectReducer,

    //Milestone
    createMilestone: createMilestoneReducer,
    fetchMilestone: fetchMilestoneReducer,
    fetchMilestoneById: fetchMilestoneByIdReducer,

    //roles
    createRole: createRoleReducer,
    fetchRoles: fetchRolesReducer,
    editRole: editRoleReducer,

    //status
    fetchStatus: fetchStatusReducer,
    createStatus: createStatusReducer,
    updateStatus: updateStatusReducer,

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
    updateTag: updateTagReducer,
    deleteTag: deleteTagReducer,

    //organizations
    fetchOrganizations: fetchOrganizationsReducer,

    //Spirints
    fetchSpirints: fetchSpirintsReducer,
    postSprint: postSprintReducer,
    putSprint: putSprintReducer,
    fetchSpirintById: fetchSpirintByIdReducer,
  },
})