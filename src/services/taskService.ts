import { apiClient } from '@/utils/apiClient';

export interface TaskOccurrence {
  id: number;
  task_status: string;
  start_date: string;
  created_at: string;
  updated_at: string;
  steps?: number; // Number of steps for the task workflow
  checklist?: string; // Task checklist name
  asset?: string; // Asset code
  asset_id?: number; // Asset ID
  asset_code?: string; // Asset code
  assigned_to_name?: string; // Assigned user names
  asset_path?: string; // Asset location path
  checklist_questions?: any[]; // Direct checklist questions from API
  grouped_questions?: any[]; // Grouped questions from API
  bef_sub_attachment?: string | null; // Before submission attachment
  aft_sub_attachment?: string | null; // After submission attachment
  before_after_enabled?: string; // Before/After photo enabled status
  backup_assigned_user?: string; // Backup assigned user name
  checklist_responses?: any[]; // Checklist responses from API
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
    backup_assigned_user?: string; // Add backup assigned user here too
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
    resp?: Array<{
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
      userData: string[];
      comment: string;
      rating: string;
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
      // Use the direct API endpoint that returns the flat structure
      const response = await apiClient.get(`/pms/asset_task_occurrences/${id}.json`);
      const data = response.data;
      
      // Map the flat API response to our TaskOccurrence interface
      const mappedData: TaskOccurrence = {
        id: data.id,
        task_status: data.task_status,
        start_date: data.start_date,
        created_at: data.created_at,
        updated_at: data.updated_at,
        steps: data.steps,
        checklist: data.checklist,
        asset: data.asset,
        asset_id: data.asset_id,
        asset_code: data.asset_code,
        assigned_to_name: data.assigned_to_name,
        backup_assigned_user: data.backup_assigned_user || data.performed_by,
        asset_path: data.asset_path,
        checklist_questions: data.checklist_questions,
        checklist_responses: data.checklist_responses,
        bef_sub_attachment: data.bef_sub_attachment,
        aft_sub_attachment: data.aft_sub_attachment,
        before_after_enabled: data.steps === 3 ? "Yes" : "No",
        task_details: {
          id: data.id,
          task_name: data.checklist || "N/A",
          associated_with: "Asset",
          asset_service_name: data.asset || "N/A",
          asset_service_code: data.asset_code || "N/A",
          scheduled_on: data.start_date || "N/A",
          completed_on: data.task_end_time || null,
          assigned_to: data.assigned_to_name || "N/A",
          task_duration: data.time_log || "N/A",
          created_on: data.created_at || "N/A",
          created_by: data.assigned_to_name?.split(',')[0]?.trim() || "N/A",
          backup_assigned_user: data.backup_assigned_user || data.performed_by,
          location: {
            site: data.location?.site || data.site_name || "NA",
            building: data.location?.building || "NA",
            wing: data.location?.wing || "NA",
            floor: data.location?.floor || "NA",
            area: data.location?.area || "NA",
            room: data.location?.room || "NA",
            full_location: data.asset_path || "N/A"
          },
          status: {
            value: data.task_status || "Unknown",
            label_class: data.task_status?.toLowerCase() || "unknown",
            display_name: data.task_status || "Unknown"
          },
          performed_by: data.performed_by || null,
          supplier: "N/A",
          start_time: data.task_start_time || null
        },
        activity: {
          has_response: data.checklist_responses?.length > 0,
          total_score: null,
          checklist_groups: [],
          ungrouped_content: data.checklist_questions || [],
          resp: data.checklist_responses?.map((item: any) => ({
            label: item.label,
            name: item.name,
            className: item.className,
            group_id: item.group_id || "",
            sub_group_id: item.sub_group_id || "",
            type: item.type,
            subtype: item.subtype,
            required: item.required,
            is_reading: item.is_reading,
            hint: item.hint || "",
            values: item.values || [],
            weightage: item.weightage || "",
            rating_enabled: item.rating_enabled || "false",
            question_hint_image_ids: item.question_hint_image_ids || [],
            userData: item.userData || [],
            comment: item.comment || "",
            rating: item.rating || "",
            attachments: item.attachments || [] // Map attachments
          })) || []
        },
        attachments: {
          main_attachment: data.response_attachments,
          blob_store_files: []
        },
        actions: {
          can_reschedule: data.task_status !== "Closed" && data.task_status !== "Completed",
          can_submit_task: data.task_status !== "Closed" && data.task_status !== "Completed",
          can_view_job_sheet: data.task_status === "Closed" || data.task_status === "Completed",
          can_edit: data.task_status !== "Closed" && data.task_status !== "Completed",
          can_rate: false
        },
        action_urls: {
          question_form_url: `/pms/asset_task_occurrences/${data.id}.json`,
          job_sheet_url: `/pms/asset_task_occurrences/${data.id}/job_sheet.json`,
          update_task_date_url: `/pms/asset_task_occurrences/${data.id}/update_task_date.json`
        },
        comments: []
      };
      
      console.log('📋 Mapped Task Details:', mappedData);
      return mappedData;
    } catch (error) {
      console.error('Error fetching task details:', error);
      throw error;
    }
  },

  async getTaskSubmissionDetails(id: string): Promise<any> {
    try {
      const response = await apiClient.get(`/pms/asset_task_occurrences/${id}.json?require_grouping=true`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task submission details:', error);
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

// Submit task with checklist responses
submitTaskResponse: async (submissionData: {
  response_of_id: string;
  response_of: string;
  occurrence_of: string;
  occurrence_of_id: string;
  offlinemobile: string;
  first_name: string;
  asset_quest_response: {
    occurrence_of: string;
    occurrence_of_id: string;
    response_of: string;
    response_of_id: string;
    first_name: string;
  };
  data: Array<{
    qname: string;
    comment: string;
    value: string[];
    rating: string;
    attachments: string[];
  }>;
  attachments: string[];
  bef_sub_attachment: string;
  aft_sub_attachment: string;
  mobile_submit: string;
  token: string;
}) => {
  try {
    // The payload is already formatted correctly by TaskSubmissionPage
    console.log('Submitting task response:', submissionData);

    const response = await apiClient.post('/pms/asset_quest_responses.json', submissionData);
    return response.data;
  } catch (error) {
    console.error('Error submitting task response:', error);
    throw new Error('Failed to submit task response');
  }
},
};