import { configureStore } from '@reduxjs/toolkit'
import { changeProjectStatusReducer, deleteProjectGroupReducer, deleteProjectTeamReducer, createProject, createProjectReducer, createProjectTypesReducer, deleteProjectReducer, editProjectReducer, fetchProjectDetailsReducer, fetchProjectsReducer, fetchProjectTypeReducer, fetchTemplatesReducer, filterProjectsReducer, updateProjectTypeReducer, fetchProjectGroupReducer, createProjectGroupReducer, updateProjectGroupReducer, createProjectTeamReducer, fetchProjectTeamsReducer, fetchProjectTeamReducer, updateProjectTeamReducer, removeTagFromProjectReducer, removeMembersFromTeamReducer, deleteProject, fetchActiveProjectTypesReducer, removeAttachmentReducer, fetchProjectTeamMembersReducer } from './slices/projectSlice'
import { createExternalUserReducer, createInternalUserReducer, fetchAssociatedProjectsReducer, fetchExternalUserReducer, fetchInternalUserDetailsReducer, fetchInternalUserReducer, fetchUpdatelUserReducer, fetchUserAvailabilityReducer, reassignProjectsReducer, removeUserFromProjectReducer, userReducer } from './slices/userSlice'
import { createTagReducer, deleteTagReducer, fetchActiveTagsReducer, fetchTagsReducer, updateTagReducer } from './slices/tagsSlice'
import { createRoleReducer, deleteRoleReducer, editRoleReducer, fetchActiveRolesReducer, fetchRolesReducer } from './slices/roleSlice'
import { changeTaskStatusReducer, createDependancyReducer, createTaskCommentReducer, fetchMyTasksReducer, createTaskReducer, editTaskCommentReducer, editTaskReducer, fetchTasksOfProjectReducer, fetchTasksReducer, filterTaskReducer, taskDetailsReducer, updateDependancyReducer, deleteTaskCommentReducer, fetchTasksOfMilestoneReducer, removeTaskAttachmentReducer } from './slices/taskSlice'
import { createOrganizationReducer, editOrganizationReducer, fetchOrganizationsReducer } from './slices/organizationSlice'
import { createMilestoneReducer, fetchMilestoneByIdReducer, fetchMilestoneReducer } from './slices/milestoneSlice'
import { fetchSpirintByIdReducer, fetchSpirintsReducer, postSprintReducer, putSprintReducer } from './slices/spirintSlice'
import { createIssueReducer, fetchIssueReducer, updateIssueReducer, fetchIssueTypeReducer, filterIssueReducer, createIssueTypeReducer, updateIssueTypeReducer, deleteIssueTypeReducer, removeIssueAttachmentReducer } from './slices/IssueSlice'
import { fetchStatusReducer, createStatusReducer, deleteStatusReducer, updateStatusReducer } from './slices/statusSlice'
import { createMoMReducer, fetchMomDetailsReducer, fetchMoMReducer, removeMomAttachmentReducer } from './slices/momSlice'
import { createMessageReducer, fetchChannelByIdReducer, fetchChannelsReducer, fetchConversationsReducer, fetchMessagesOfConversationReducer, startConversationReducer } from './slices/channelSlice'
import { createCompanyReducer, editCompanyReducer, fetchCompanyReducer } from './slices/companySlice'
import { createRegionReducer, updateRegionReducer, fetchRegionReducer, deleteRegionReducer } from './slices/regionSlice'
import { createZoneReducer, updateZoneReducer, fetchZoneReducer, deleteZoneReducer } from './slices/zoneSlice'
import { createCountryReducer, updateCountryReducer, fetchCountryReducer, deleteCountryReducer } from './slices/countrySlice'

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
    removeAttachment: removeAttachmentReducer,
    fetchProjectTeamMembers: fetchProjectTeamMembersReducer,

    //tasks
    createTask: createTaskReducer,
    fetchTasks: fetchTasksReducer,
    editTask: editTaskReducer,
    taskDetails: taskDetailsReducer,
    changeTaskStatus: changeTaskStatusReducer,
    filterTask: filterTaskReducer,
    createDependancy: createDependancyReducer,
    updateDependancy: updateDependancyReducer,
    fetchMyTasks: fetchMyTasksReducer,
    fetchTasksOfMilestone: fetchTasksOfMilestoneReducer,
    removeTaskAttachment: removeTaskAttachmentReducer,

    //issues
    createIssue: createIssueReducer,
    fetchIssues: fetchIssueReducer,
    updateIssues: updateIssueReducer,
    fetchIssueType: fetchIssueTypeReducer,
    createIssueType: createIssueTypeReducer,
    updateIssueType: updateIssueTypeReducer,
    deleteIssueType: deleteIssueTypeReducer,
    filterIssue: filterIssueReducer,
    removeIssueAttachment: removeIssueAttachmentReducer,

    // fetchTasksComments: fetchTasksCommentsReducer,
    createTaskComment: createTaskCommentReducer,
    editTaskComment: editTaskCommentReducer,
    deleteTaskComment: deleteTaskCommentReducer,
    fetchTasksOfProject: fetchTasksOfProjectReducer,

    //Milestone
    createMilestone: createMilestoneReducer,
    fetchMilestone: fetchMilestoneReducer,
    fetchMilestoneById: fetchMilestoneByIdReducer,

    //region
    createRegion: createRegionReducer,
    fetchRegion: fetchRegionReducer,
    updateRegion: updateRegionReducer,
    deleteRegion: deleteRegionReducer,

    //zones
    createZone: createZoneReducer,
    fetchZone: fetchZoneReducer,
    updateZone: updateZoneReducer,
    deleteZone: deleteZoneReducer,

    //roles
    createRole: createRoleReducer,
    fetchRoles: fetchRolesReducer,
    fetchActiveRoles: fetchActiveRolesReducer,
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
    fetchAssociatedProjects: fetchAssociatedProjectsReducer,
    reassignProjects: reassignProjectsReducer,
    fetchUserAvailability: fetchUserAvailabilityReducer,

    //tags
    fetchTags: fetchTagsReducer,
    fetchActiveTags: fetchActiveTagsReducer,
    createTag: createTagReducer,
    updateTag: updateTagReducer,
    deleteTag: deleteTagReducer,

    //organizations
    fetchOrganizations: fetchOrganizationsReducer,
    createOrganization: createOrganizationReducer,
    editOrganization: editOrganizationReducer,

    //Company
    createCompany: createCompanyReducer,
    fetchCompany: fetchCompanyReducer,
    editCompany: editCompanyReducer,

    //Country
    fetchCountry: fetchCountryReducer,
    createCountry: createCountryReducer,
    updateCountry: updateCountryReducer,
    deleteCountry: deleteCountryReducer,

    //Spirints
    fetchSpirints: fetchSpirintsReducer,
    postSprint: postSprintReducer,
    putSprint: putSprintReducer,
    fetchSpirintById: fetchSpirintByIdReducer,

    //MoM
    fetchMoM: fetchMoMReducer,
    createMoM: createMoMReducer,
    fetchMomDetails: fetchMomDetailsReducer,
    removeMomAttachment: removeMomAttachmentReducer,

    //Channels
    fetchChannels: fetchChannelsReducer,
    fetchConversations: fetchConversationsReducer,
    fetchChannelById: fetchChannelByIdReducer,
    createMessage: createMessageReducer,
    startConversation: startConversationReducer,
    fetchMessagesOfConversation: fetchMessagesOfConversationReducer,
  },
})