import { apiClient } from '@/utils/apiClient';

export interface User {
  id: number;
  full_name: string;
}

export interface UsersResponse {
  users: User[];
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
  }
};