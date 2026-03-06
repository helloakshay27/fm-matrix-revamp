/**
 * Milestone Type Definitions
 * Interfaces for type-safe milestone operations with TanStack Query
 */

export interface Milestone {
  id: number;
  milestone_code: string;
  title: string;
  description?: string;
  status: "open" | "in_progress" | "on_hold" | "completed" | "overdue";
  owner_id: number;
  owner_name?: string;
  project_management_id: number;
  start_date: string;
  end_date: string;
  completion_percent: number;
  total_tasks: number;
  completed_tasks: number;
  total_issues: number;
  completed_issues: number;
  created_at?: string;
  updated_at?: string;
}

export interface MilestonesListResponse {
  data?: {
    milestones: Milestone[];
    pagination?: PaginationData;
  };
  milestones?: Milestone[];
  pagination?: PaginationData;
}

export interface CreateMilestonePayload {
  milestone: {
    title: string;
    start_date: string;
    end_date: string;
    status: "open" | "in_progress" | "on_hold" | "completed" | "overdue";
    owner_id: number;
    project_management_id: number;
    description?: string;
  };
}

export interface UpdateMilestonePayload {
  milestone: {
    status?: "open" | "in_progress" | "on_hold" | "completed" | "overdue";
    title?: string;
    start_date?: string;
    end_date?: string;
    owner_id?: number;
    description?: string;
  };
}

export interface PaginationData {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}
