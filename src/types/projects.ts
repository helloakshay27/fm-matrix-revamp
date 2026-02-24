/**
 * Types for Projects module based on ProjectsDashboard
 */

export interface Project {
  id: number;
  project_code: string;
  title: string;
  status: "active" | "in_progress" | "on_hold" | "completed" | "overdue";
  project_type_name: string;
  project_owner_name: string;
  completion_percent: number;
  avg_milestone_completion_percent: number;
  avg_task_management_completion_percent: number;
  avg_sub_task_management_completion_percent: number;
  total_milestone_count: number;
  total_task_management_count: number;
  total_sub_task_management_count: number;
  total_issues_count: number;
  completed_milestone_count: number;
  completed_task_management_count: number;
  completed_sub_task_management_count: number;
  completed_issues_count: number;
  start_date: string;
  end_date: string;
  priority: "low" | "medium" | "high";
}

export interface TransformedProject {
  id: number;
  project_code: string;
  title: string;
  status: "active" | "in_progress" | "on_hold" | "completed" | "overdue";
  type: string;
  completion_percent: number;
  manager: string;
  milestones: number;
  milestonesCompleted: number;
  milestoneCompletionPercent: number;
  tasks: number;
  tasksCompleted: number;
  taskCompletionPercent: number;
  subtasks: number;
  subtasksCompleted: number;
  subtaskCompletionPercent: number;
  issues: number;
  resolvedIssues: number;
  start_date: string;
  end_date: string;
  priority: string;
}

export interface ProjectsListResponse {
  data?: {
    project_managements: Project[];
    pagination: PaginationData;
  };
  project_managements?: Project[];
  pagination?: PaginationData;
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface CreateProjectPayload {
  project_management: {
    title: string;
    start_date: string;
    end_date: string;
    status: "active" | "in_progress" | "on_hold" | "completed" | "overdue";
    owner_id: number;
    priority: "low" | "medium" | "high";
    active: boolean;
    project_type_id: number;
  };
}

export interface UpdateProjectPayload {
  project_management: {
    status?: "active" | "in_progress" | "on_hold" | "completed" | "overdue";
    title?: string;
    start_date?: string;
    end_date?: string;
    priority?: "low" | "medium" | "high";
  };
}

/**
 * API Error response structure
 */
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
