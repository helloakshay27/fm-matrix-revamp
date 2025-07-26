import { apiClient } from '@/utils/apiClient';

export interface User {
  id: number;
  full_name: string;
}

export interface UsersResponse {
  users: User[];
}

export interface TaskRescheduleData {
  scheduleDate: string;
  time: string;
  userId: number;
  email: boolean;
  sms: boolean;
}

export const userService = {
  async getEscalateToUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get<UsersResponse>('/pms/users/get_escalate_to_users.json');
      return response.data.users;
    } catch (error) {
      console.error('Error fetching escalate to users:', error);
      throw error;
    }
  },

  async searchUsers(searchTerm: string): Promise<User[]> {
    try {
      const users = await this.getEscalateToUsers();
      if (!searchTerm.trim()) {
        return users;
      }
      
      return users.filter(user => 
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  },

  async rescheduleTask(taskId: string, data: TaskRescheduleData): Promise<void> {
    try {
      const payload = {
        task_id: taskId,
        schedule_date: data.scheduleDate,
        schedule_time: data.time,
        assigned_user_id: data.userId,
        notify_email: data.email,
        notify_sms: data.sms
      };
      
      await apiClient.post('/pms/tasks/reschedule.json', payload);
    } catch (error) {
      console.error('Error rescheduling task:', error);
      throw error;
    }
  }
};