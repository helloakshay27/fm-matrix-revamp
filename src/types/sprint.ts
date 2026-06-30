export interface SprintDetails {
  id?: string | number;
  title?: string;
  created_by_name?: string;
  created_at?: string;
  status?: string;
  responsible_person?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  total_tasks?: number;
  total_issues?: number;
  total_effective_minutes?: number;
  total_actual_minutes?: number;
}

export interface Task {
  id?: string | number;
  task_title?: string;
  status?: string;
  responsible_person?: string;
  target_date?: string;
  priority?: string;
  estimated_hour?: number;
}

export interface TaskManagement {
  id: number;
  title?: string;
  status?: string;
  priority?: string;
  target_date?: string;
  started_at?: string;
  completed_at?: string;
  responsible_person_id?: number;
  responsible_person_name?: string;
  milestone_id?: number;
  estimated_hour?: number;
  [key: string]: any;
}

export interface ApiSprintTask {
  id: number;
  is_started?: boolean;
  sprint_id?: number;
  task_id?: number;
  created_at?: string;
  title?: string;
  task_code?: string;
  responsible_person_name?: string;
  responsible_person_id?: number;
  created_by_name?: string;
  status?: string;
  priority?: string;
  target_date?: string;
  expected_start_date?: string;
  estimated_hour?: number;
  active_time_till_now?: string;
  total_allocated_hours?: string | number;
  started_at?: string;
  completed_at?: string;
  milestone_id?: number;
  milestone_title?: string;
  completed_issues?: number;
  project_management_title?: string;
  project_status_id?: number;
  predecessor_task?: string | any[];
  successor_task?: string | any[];
  completed_sub_tasks?: number;
  total_sub_tasks?: number;
  total_issues?: number;
}

export interface ApiSprint {
  id: number;
  name?: string;
  title?: string;
  description?: string | null;
  project_id?: number;
  duration?: string | null;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  owner_id?: number | null;
  sprint_owner_name?: string | null;
  status?: string;
  priority?: string | null;
  created_at?: string;
  updated_at?: string;
  associated_projects_count?: number;
  sprint_task_managements?: ApiSprintTask[];
  total_tasks?: number;
  total_issues?: number;
  sprint_issues?: any[];
  total_members?: number;
  total_effective_minutes?: number;
  total_actual_minutes?: number;
  created_by_name?: string;
}

export interface SprintMember {
  id: number | string;
  name: string;
  role: "owner" | "assignee";
}
