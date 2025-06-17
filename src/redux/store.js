import { configureStore } from '@reduxjs/toolkit'
import { changeProjectStatusReducer, deleteProjectGroupReducer, deleteProjectTeamReducer, createProject, createProjectReducer, createProjectTypesReducer, deleteProjectReducer, editProjectReducer, fetchProjectDetailsReducer, fetchProjectsReducer, fetchProjectTypeReducer, fetchTemplatesReducer, filterProjectsReducer, updateProjectTypeReducer, fetchProjectGroupReducer, createProjectGroupReducer, updateProjectGroupReducer, createProjectTeamReducer, fetchProjectTeamsReducer, fetchProjectTeamReducer, updateProjectTeamReducer, removeTagFromProjectReducer, removeMembersFromTeamReducer, deleteProject, fetchActiveProjectTypesReducer } from './slices/projectSlice'
import { createExternalUserReducer, createInternalUserReducer, fetchExternalUserReducer, fetchInternalUserDetailsReducer, fetchInternalUserReducer, fetchUpdatelUserReducer, removeUserFromProjectReducer, userReducer } from './slices/userSlice'
import { createTagReducer, deleteTagReducer, fetchActiveTagsReducer, fetchTagsReducer, updateTagReducer } from './slices/tagsSlice'
import { createRoleReducer, deleteRoleReducer, editRoleReducer, fetchRolesReducer } from './slices/roleSlice'
import { changeTaskStatusReducer, createDependancyReducer, createTaskCommentReducer, createTaskReducer, editTaskCommentReducer, editTaskReducer, fetchTasksOfProjectReducer, fetchTasksReducer, filterTaskReducer, taskDetailsReducer, updateDependancyReducer } from './slices/taskSlice'
import { fetchOrganizationsReducer } from './slices/organizationSlice'
import { createMilestoneReducer, fetchMilestoneByIdReducer, fetchMilestoneReducer } from './slices/milestoneSlice'
import { fetchSpirintByIdReducer, fetchSpirintsReducer, postSprintReducer, putSprintReducer } from './slices/spirintSlice'
import { createIssueReducer, fetchIssueReducer, updateIssueReducer } from './slices/IssueSlice'
import { fetchStatusReducer, createStatusReducer, deleteStatusReducer, updateStatusReducer } from './slices/statusSlice'

export const store = configureStore({
  reducer: {
    //projects
    createProject: createProjectReducer,
    fetchProjects: fetchProjectsReducer,
    fetchProjectDetails: fetchProjectDetailsReducer,
    changeProjectStatus: changeProjectStatusReducer,
    editProject: editProjectReducer,
    fetchProjectTypes: fetchProjectTypeReducer,
    fetchActiveProjectTypes: fetchActiveProjectTypesReducer,
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
    removeTagFromProject: removeTagFromProjectReducer,
    removeMembersFromTeam: removeMembersFromTeamReducer,
    removeMembersFromGroup: removeTagFromProjectReducer,
    deleteProjectTeam: deleteProjectTeamReducer,
    deleteProjectGroup: deleteProjectGroupReducer,

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
    createIssue: createIssueReducer,
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
    deleteRole: deleteRoleReducer,

    //status
    fetchStatus: fetchStatusReducer,
    createStatus: createStatusReducer,
    updateStatus: updateStatusReducer,
    deleteStatus: deleteRoleReducer,

    //users
    fetchUsers: userReducer,
    createInternalUser: createInternalUserReducer,
    fetchInternalUser: fetchInternalUserReducer,
    createExternalUser: createExternalUserReducer,
    fetchExternalUser: fetchExternalUserReducer,
    fetchUpdateUser: fetchUpdatelUserReducer,
    fetchInternalUserDetails: fetchInternalUserDetailsReducer,
    removeUserFromProject: removeUserFromProjectReducer,

    //tags
    fetchTags: fetchTagsReducer,
    fetchActiveTags: fetchActiveTagsReducer,
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