import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';

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

export interface UserInvitationPayload {
  email: string;
  display_name: string;
  mobile: string;
  designation: string;
  department_id: number | string;
  role_id?: string | number;
}

export interface UserInvitationResponse {
  success: boolean;
  message: string;
  invitation?: any;
}

export interface BulkInvitePayload {
  emails: string[];
}

export interface BulkInviteResponse {
  success: boolean;
  sent: number;
  skipped: number;
  skipped_emails: string[];
  invitations: any[];
}

export interface Invitation {
  id: number;
  email: string;
  display_name: string | null;
  mobile: string | null;
  designation: string | null;
  department_id: number | null;
  department: string | null;
  status: string;
  invited_at: string;
  invited_by: string;
}

export interface InvitationsResponse {
  success: boolean;
  total: number;
  invitations: Invitation[];
}

export interface EmailLog {
  id: number;
  email: string;
  display_name: string | null;
  status: string;
  sent_at: string;
  resent_at: string | null;
}

export interface EmailLogsResponse {
  success: boolean;
  total: number;
  logs: EmailLog[];
}

export interface CommonResponse {
  success: boolean;
  message: string;
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
  },

  async inviteUser(payload: UserInvitationPayload): Promise<UserInvitationResponse> {
    try {
      const response = await apiClient.post<UserInvitationResponse>(ENDPOINTS.INVITE_USER, payload);
      return response.data;
    } catch (error) {
      console.error('Error inviting user:', error);
      throw error;
    }
  },

  async bulkInvite(payload: BulkInvitePayload): Promise<BulkInviteResponse> {
    try {
      const response = await apiClient.post<BulkInviteResponse>(ENDPOINTS.BULK_INVITE, payload);
      return response.data;
    } catch (error) {
      console.error('Error in bulk invite:', error);
      throw error;
    }
  },

  async fetchPendingInvitations(params?: any): Promise<InvitationsResponse> {
    try {
      const response = await apiClient.get<InvitationsResponse>(ENDPOINTS.PENDING_INVITATIONS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending invitations:', error);
      throw error;
    }
  },

  async fetchInvitationHistory(params?: any): Promise<InvitationsResponse> {
    try {
      const response = await apiClient.get<InvitationsResponse>(ENDPOINTS.INVITATION_HISTORY, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching invitation history:', error);
      throw error;
    }
  },

  async resendInvitation(id: number | string): Promise<UserInvitationResponse> {
    try {
      const response = await apiClient.post<UserInvitationResponse>(`${ENDPOINTS.RESEND_INVITATION}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error resending invitation:', error);
      throw error;
    }
  },

  async fetchEmailLogs(params?: any): Promise<EmailLogsResponse> {
    try {
      const response = await apiClient.get<EmailLogsResponse>(ENDPOINTS.EMAIL_LOGS, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching email logs:', error);
      throw error;
    }
  },

  async withdrawInvitation(id: number | string): Promise<CommonResponse> {
    try {
      const response = await apiClient.delete<CommonResponse>(`${ENDPOINTS.WITHDRAW_INVITATION}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error withdrawing invitation:', error);
      throw error;
    }
  }
};