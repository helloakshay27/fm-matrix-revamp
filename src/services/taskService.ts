import { apiClient } from '@/utils/apiClient';

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
  scheduled_count: number;
  open_count: number;
  wip_count: number;
  closed_count: number;
  overdue_count: number;
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
    status?: string;
    [key: string]: any;
  }): Promise<TaskListResponse> {
    try {
      const queryParams: any = {
        show_all: true,
        page: 1,
        ...params
      };

      // Handle status filtering
      if (params?.status) {
        queryParams['q[task_status_eq]'] = params.status;
        delete queryParams.status; // Remove the status key to avoid duplication
      }
      queryParams.append('type', status);


      const response = await apiClient.get<TaskListResponse>('/pms/users/scheduled_tasks.json', {
        params: queryParams
      });
      console.log('Fetched task list:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching task list:', error);
      throw error;
    }
  },

  async exportTasks(params?: { status?: string,[key: string]: any; }): Promise<Blob> {
    try {
      const queryParams: any = {};

      // Handle status filtering
      if (params?.status) {
        queryParams['task_status_eq'] = params.status;
        
      }
      console.log('Params for export:', params);
      queryParams['type'] =  params.status.toLocaleLowerCase() || 'Open';
      console.log('Export query params:', queryParams);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (key === 'status' && value) {
            queryParams['task_status_eq'] = value;
          } else if (value !== undefined && value !== null && value !== '') {
            queryParams[key] = value;
          }
        });
      }

      const response = await apiClient.get('/pms/users/scheduled_tasks.xlsx', {
        responseType: 'blob',
        params: queryParams
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting tasks:', error);
      throw error;
    }
  },

  async downloadTaskExport(params?: { status?: string,[key: string]: any; }): Promise<void> {
    try {
      const blob = await this.exportTasks(params);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const statusSuffix = params?.status ? `_${params.status.toLowerCase().replace(/\s+/g, '_')}` : '';
      a.download = `tasks_export${statusSuffix}_${new Date().toISOString().split('T')[0]}.xlsx`;
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

  getJobSheet: async (id: string) => {
    try {
      const response = await apiClient.get(`/pms/asset_task_occurrences/${id}/job_sheet.json`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job sheet:', error);
      throw new Error('Failed to fetch job sheet');
    }
  },

updateTaskComments: async (id: string, comments: string) => {
  try {
    const response = await apiClient.patch(`/pms/asset_task_occurrences/${id}.json`, {
      pms_asset_task_occurrence: {
        task_comments: comments
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating task comments:', error);
    throw new Error('Failed to update task comments');
  }
},

};