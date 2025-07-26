import { apiClient } from '@/utils/apiClient';
import { API_BASE_URL, API_ENDPOINTS, getHeaders } from '@/config/api';

export interface TaskOccurrence {
  id: number;
  task_status: string;
  start_date: string;
  created_at: string;
  updated_at: string;
  task_details: {
    id: number;
    task_name: string;
    associated_with: string;
    asset_service_name: string;
    asset_service_code: string;
    scheduled_on: string;
    completed_on: string | null;
    assigned_to: string;
    task_duration: string;
    created_on: string;
    created_by: string;
    location: {
      site: string;
      building: string;
      wing: string;
      floor: string;
      area: string;
      room: string;
      full_location: string;
    };
    status: {
      value: string;
      label_class: string;
      display_name: string;
    };
    performed_by: string | null;
    supplier: string;
    start_time: string | null;
  };
  activity: {
    has_response: boolean;
    total_score: number | null;
    checklist_groups: any[];
    ungrouped_content: Array<{
      label: string;
      name: string;
      className: string;
      type: string;
      subtype: string;
      required: string;
      is_reading: string;
      values: Array<{
        label: string;
        value: string;
        type?: string;
      }>;
    }>;
  };
  attachments: {
    main_attachment: any;
    blob_store_files: any[];
  };
  actions: {
    can_reschedule: boolean;
    can_submit_task: boolean;
    can_view_job_sheet: boolean;
    can_edit: boolean;
    can_rate: boolean;
  };
  action_urls: {
    question_form_url: string;
    job_sheet_url: string;
    update_task_date_url: string;
  };
  comments: any[];
}

export interface TaskDetailsResponse {
  task_occurrence: TaskOccurrence;
}

export interface TaskListItem {
  id: number;
  checklist: string;
  asset: string;
  asset_id: number;
  asset_code: string;
  latitude: number;
  longitude: number;
  geofence_range: number;
  task_id: number;
  scan_type: string;
  overdue_task_start_status: boolean;
  start_date: string;
  assigned_to_id: number[];
  assigned_to_name: string;
  grace_time: string;
  company_id: number;
  company: string;
  active: any;
  task_status: string;
  schedule_type: string;
  site_name: string;
  task_approved_at: string | null;
  task_approved_by_id: number | null;
  task_approved_by: string | null;
  task_verified: boolean;
  asset_path: string;
  checklist_responses: any;
  checklist_questions: Array<{
    label: string;
    name: string;
    className: string;
    group_id: string;
    sub_group_id: string;
    type: string;
    subtype: string;
    required: string;
    is_reading: string;
    hint: string;
    values: Array<{
      label: string;
      type: string;
      value: string;
    }>;
    weightage: string;
    rating_enabled: string;
    question_hint_image_ids: any[];
  }>;
  supervisors: any[];
  task_start_time: string | null;
  task_end_time: string | null;
  time_log: any;
  created_at: string;
  updated_at: string;
}

export interface TaskListResponse {
  current_page: string;
  pages: number;
  asset_task_occurrences: TaskListItem[];
}

export const taskService = {
  async getTaskDetails(id: string): Promise<TaskOccurrence> {
    try {
      const response = await apiClient.get<TaskDetailsResponse>(`/pms/asset_task_occurrences/${id}/asset_task_details.json`);
      return response.data.task_occurrence;
    } catch (error) {
      console.error('Error fetching task details:', error);
      throw error;
    }
  },

  async getTaskList(params?: {
    show_all?: boolean;
    page?: number;
  }): Promise<TaskListResponse> {
    try {
      const response = await apiClient.get<TaskListResponse>('/all_tasks_listing.json', {
        params: {
          show_all: true,
          page: 1,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching task list:', error);
      throw error;
    }
  },

  async exportTasks(): Promise<Blob> {
    try {
      const response = await apiClient.get('/pms/users/scheduled_tasks.xlsx', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting tasks:', error);
      throw error;
    }
  },

  async downloadTaskExport(): Promise<void> {
    try {
      const blob = await this.exportTasks();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tasks_export_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading task export:', error);
      throw error;
    }
  },

  rescheduleTask: async (id: string, data: {
    start_date: string;
    user_ids: number[];
    email: boolean;
    sms: boolean;
  }) => {
    try {
      return await apiClient.put(
        `/pms/asset_task_occurrences/${id}/update_task_date.json`,
        data
      );
    } catch (error) {
      console.error('Error rescheduling task:', error);
      throw new Error('Failed to reschedule task');
    }
  },
};