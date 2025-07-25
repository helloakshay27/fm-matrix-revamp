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
  // Fetch calendar events
  async fetchCalendarEvents(params?: {
    start_date?: string;
    end_date?: string;
    amc?: string;
    service?: string;
  }): Promise<CalendarEvent[]> {
    try {
      const response = await apiClient.get<CalendarResponse>('/pms/users/tasks_calender.json');
      return response.data.calendar_events || [];
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  }
};