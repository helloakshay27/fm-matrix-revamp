import { apiClient } from '@/utils/apiClient';

export interface CalendarEvent {
  id: number;
  title: string;
  start: string;
  details_url: string;
  color: string;
  status: string;
  custom_form: {
    name: string;
    schedule_type: string;
  };
  task: {
    id: number;
    task_type: string | null;
  };
  schedule_task: {
    building: string;
    wing: string | null;
    floor: string | null;
    area: string | null;
    room: string | null;
  };
}

export interface CalendarResponse {
  calendar_events: CalendarEvent[];
}

export const calendarService = {
  // Fetch calendar events with improved parameter handling
  async fetchCalendarEvents(params?: {
    'q[start_date_gteq]'?: string;
    'q[start_date_lteq]'?: string;
    's[task_custom_form_schedule_type_eq]'?: string;
    's[task_task_of_eq]'?: string;
    's[custom_form_form_name_eq]'?: string;
  }): Promise<CalendarEvent[]> {
    try {
      // Always include ALL possible parameters - start with defaults
      const defaultFilters = this.getDefaultFilters();
      const cleanParams: Record<string, string> = { ...defaultFilters };
      
      // Override with provided parameters
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          cleanParams[key] = value || '';
        });
      }

      console.log('API Request Parameters (with all defaults):', cleanParams); // Debug log

      const response = await apiClient.get<CalendarResponse>('/pms/users/tasks_calender.json', {
        params: cleanParams
      });
      return response.data.calendar_events || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  },

  // Get default empty filters - includes all possible parameters
  getDefaultFilters(): Record<string, string> {
    return {
      'q[start_date_gteq]': '',
      'q[start_date_lteq]': '',
      's[task_custom_form_schedule_type_eq]': '',
      's[task_task_of_eq]': '',
      's[custom_form_form_name_eq]': ''
    };
  }
};