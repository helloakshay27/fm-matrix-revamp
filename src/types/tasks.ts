/**
 * Types for Tasks module based on ProjectTasksPage
 */

export interface Task {
  id: number;
  task_code: string;
  title: string;
  status: "open" | "in_progress" | "on_hold" | "completed" | "overdue";
  project_status_id?: number;
  responsible_person_id?: number;
  expected_start_date: string;
  target_date: string;
  started_time?: string;
  estimated_hour?: number;
  total_sub_tasks?: number;
  total_issues?: number;
  priority: "Low" | "Medium" | "High";
  predecessor_task?: string;
  successor_task?: string;
  completion_percent: number;
  responsible_person?: {
    id: number;
    full_name: string;
  };
  project_management?: {
    id: number;
    title: string;
  };
  milestone?: {
    id: number;
    title: string;
  };
  sub_tasks_managements?: Task[];
  created_by_id?: number;
  created_by?: {
    id: number;
    full_name: string;
  };
}

export interface TasksListResponse {
  data?: {
    task_managements: Task[];
    pagination: PaginationData;
  };
  task_managements?: Task[];
  pagination?: PaginationData;
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface CreateTaskPayload {
  task_management: {
    title: string;
    expected_start_date: string;
    target_date: string;
    status?: "open" | "in_progress" | "on_hold" | "completed" | "overdue";
    priority?: "Low" | "Medium" | "High";
    active: boolean;
    responsible_person_id?: number;
    project_management_id?: number;
    milestone_id?: number;
    estimated_hour?: number;
    task_allocation_times_attributes?: Array<{
      allocation_date: string;
      allocated_hour: number;
    }>;
  };
}

export interface UpdateTaskPayload {
  task_management: {
    title?: string;
    expected_start_date?: string;
    target_date?: string;
    status?: "open" | "in_progress" | "on_hold" | "completed" | "overdue";
    priority?: "Low" | "Medium" | "High";
    responsible_person_id?: number;
    completion_percent?: number;
  };
}

export interface ChangeTaskStatusPayload {
  task_management: {
    status: "open" | "in_progress" | "on_hold" | "completed" | "overdue";
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
