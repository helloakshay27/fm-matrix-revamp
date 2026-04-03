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

export interface ProfileAccountResponse {
  id?: number;
  firstname?: string;
  lastname?: string;
  email?: string;
  mobile?: string;
  role_name?: string;
  alternate_address?: string;
  designation?: string;
  profile_type?: string;
  birth_date?: string;
  image?: string;
  avatar?: string;
  profile_photo?: string;
  profile_icon_url?: string;
  extra_fields?: {
    anniversary_date?: string;
    date_of_joining?: string;
    emergency_contact_name?: string;
    emergency_contact_number?: string;
    city?: string;
    state?: string;
    pin_code?: string;
    pincode?: string;
    zip_code?: string;
  };
}

export interface ProfileUpdateResponse {
  firstname?: string;
  lastname?: string;
  email?: string;
  mobile?: string;
  user?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    mobile?: string;
    alternate_address?: string;
    user_title?: string;
    birth_date?: string;
    alternate_mobile?: string;
  };
}

export const userService = {
  async getAccountDetails(): Promise<ProfileAccountResponse> {
    try {
      const response = await apiClient.get<ProfileAccountResponse>('/api/users/account.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching account details:', error);
      throw error;
    }
  },

  async updateProfile(data: FormData | any): Promise<ProfileUpdateResponse> {
    try {
      const response = await apiClient.put<ProfileUpdateResponse>('/users/profile_update', data);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },

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