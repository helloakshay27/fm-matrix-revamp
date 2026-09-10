import { useMemo } from "react";
import { capturePostHogEvent } from "@/utils/posthogHelpers";

export function usePATMEvents() {
  return useMemo(
    () => ({
      // Projects
      onProjectListViewed: () => capturePostHogEvent("PATM Project List Viewed"),
      onProjectViewed: (projectId: string | number) => capturePostHogEvent("PATM Project Viewed", { project_id: projectId }),
      onProjectCreated: (projectId: string | number, name: string) => capturePostHogEvent("PATM Project Created", { project_id: projectId, project_name: name }),
      onProjectUpdated: (projectId: string | number) => capturePostHogEvent("PATM Project Updated", { project_id: projectId }),
      onProjectDeleted: (projectId: string | number) => capturePostHogEvent("PATM Project Deleted", { project_id: projectId }),

      // Tasks
      onTaskListViewed: (projectId?: string | number) => capturePostHogEvent("PATM Task List Viewed", { project_id: projectId }),
      onTaskViewed: (taskId: string | number) => capturePostHogEvent("PATM Task Viewed", { task_id: taskId }),
      onTaskCreated: (taskId: string | number, name: string, projectId?: string | number) => capturePostHogEvent("PATM Task Created", { task_id: taskId, task_name: name, project_id: projectId }),
      onTaskUpdated: (taskId: string | number) => capturePostHogEvent("PATM Task Updated", { task_id: taskId }),
      onTaskDeleted: (taskId: string | number) => capturePostHogEvent("PATM Task Deleted", { task_id: taskId }),
      onTaskStatusChanged: (taskId: string | number, newStatus: string) => capturePostHogEvent("PATM Task Status Changed", { task_id: taskId, status: newStatus }),

      // Issues
      onIssueListViewed: (projectId?: string | number) => capturePostHogEvent("PATM Issue List Viewed", { project_id: projectId }),
      onIssueViewed: (issueId: string | number) => capturePostHogEvent("PATM Issue Viewed", { issue_id: issueId }),
      onIssueCreated: (issueId: string | number, title: string) => capturePostHogEvent("PATM Issue Created", { issue_id: issueId, issue_title: title }),
      onIssueUpdated: (issueId: string | number) => capturePostHogEvent("PATM Issue Updated", { issue_id: issueId }),
      onIssueDeleted: (issueId: string | number) => capturePostHogEvent("PATM Issue Deleted", { issue_id: issueId }),

      // Sprints
      onSprintListViewed: () => capturePostHogEvent("PATM Sprint List Viewed"),
      onSprintViewed: (sprintId: string | number) => capturePostHogEvent("PATM Sprint Viewed", { sprint_id: sprintId }),
      onSprintCreated: (sprintId: string | number, name: string) => capturePostHogEvent("PATM Sprint Created", { sprint_id: sprintId, sprint_name: name }),
      onSprintUpdated: (sprintId: string | number) => capturePostHogEvent("PATM Sprint Updated", { sprint_id: sprintId }),
      onSprintDeleted: (sprintId: string | number) => capturePostHogEvent("PATM Sprint Deleted", { sprint_id: sprintId }),

      // Opportunity Register
      onOpportunityListViewed: () => capturePostHogEvent("PATM Opportunity List Viewed"),
      onOpportunityViewed: (opportunityId: string | number) => capturePostHogEvent("PATM Opportunity Viewed", { opportunity_id: opportunityId }),
      onOpportunityCreated: (opportunityId: string | number, title: string) => capturePostHogEvent("PATM Opportunity Created", { opportunity_id: opportunityId, opportunity_title: title }),
      onOpportunityUpdated: (opportunityId: string | number) => capturePostHogEvent("PATM Opportunity Updated", { opportunity_id: opportunityId }),
      onOpportunityDeleted: (opportunityId: string | number) => capturePostHogEvent("PATM Opportunity Deleted", { opportunity_id: opportunityId }),

      // Minutes of Meeting (MoM)
      onMoMListViewed: () => capturePostHogEvent("PATM MoM List Viewed"),
      onMoMViewed: (momId: string | number) => capturePostHogEvent("PATM MoM Viewed", { mom_id: momId }),
      onMoMCreated: (momId: string | number, title: string) => capturePostHogEvent("PATM MoM Created", { mom_id: momId, mom_title: title }),
      onMoMUpdated: (momId: string | number) => capturePostHogEvent("PATM MoM Updated", { mom_id: momId }),
      onMoMDeleted: (momId: string | number) => capturePostHogEvent("PATM MoM Deleted", { mom_id: momId }),

      // Documents
      onDocumentListViewed: () => capturePostHogEvent("PATM Document List Viewed"),
      onDocumentUploaded: (documentId: string | number, name: string) => capturePostHogEvent("PATM Document Uploaded", { document_id: documentId, document_name: name }),
      onDocumentDeleted: (documentId: string | number) => capturePostHogEvent("PATM Document Deleted", { document_id: documentId }),

      // Todo
      onTodoListViewed: () => capturePostHogEvent("PATM Todo List Viewed"),
      onTodoCreated: (todoId: string | number, title: string) => capturePostHogEvent("PATM Todo Created", { todo_id: todoId, todo_title: title }),
      onTodoUpdated: (todoId: string | number) => capturePostHogEvent("PATM Todo Updated", { todo_id: todoId }),
      onTodoDeleted: (todoId: string | number) => capturePostHogEvent("PATM Todo Deleted", { todo_id: todoId }),
      onTodoStatusChanged: (todoId: string | number, newStatus: string) => capturePostHogEvent("PATM Todo Status Changed", { todo_id: todoId, status: newStatus }),
      
      // Milestones
      onMilestoneListViewed: (projectId: string | number) => capturePostHogEvent("PATM Milestone List Viewed", { project_id: projectId }),
      onMilestoneViewed: (milestoneId: string | number) => capturePostHogEvent("PATM Milestone Viewed", { milestone_id: milestoneId }),
      onMilestoneCreated: (milestoneId: string | number, title: string, projectId: string | number) => capturePostHogEvent("PATM Milestone Created", { milestone_id: milestoneId, milestone_title: title, project_id: projectId }),
      onMilestoneUpdated: (milestoneId: string | number) => capturePostHogEvent("PATM Milestone Updated", { milestone_id: milestoneId }),
      onMilestoneDeleted: (milestoneId: string | number) => capturePostHogEvent("PATM Milestone Deleted", { milestone_id: milestoneId }),
    }),
    []
  );
}
