import { getFullUrl } from '@/config/apiConfig';
import { getToken } from '@/utils/auth';

export interface BulkRescheduleRequest {
  task_occurrence_ids: number[];
  start_date: string; // ISO format: "2025-10-10T09:30:00Z"
  email: boolean;
}

export interface BulkReassignRequest {
  task_occurrence_ids: number[];
  backup_assigned_to_id: number;
}

export interface EscalateUser {
  id: number;
  full_name: string;
  email?: string;
}

class BulkTaskService {
  async bulkReschedule(data: BulkRescheduleRequest): Promise<any> {
    const token = getToken();
    
    const response = await fetch(
      getFullUrl('/pms/asset_task_occurrences/bulk_update_task_date.json'),
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async bulkReassign(data: BulkReassignRequest): Promise<any> {
    const token = getToken();
    
    const response = await fetch(
      getFullUrl('/pms/asset_task_occurrences/bulk_update_assignee.json'),
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getEscalateUsers(): Promise<EscalateUser[]> {
    const token = getToken();
    
    const response = await fetch(
      getFullUrl('/pms/users/get_escalate_to_users.json'),
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.users || data || [];
  }
}

export const bulkTaskService = new BulkTaskService();
