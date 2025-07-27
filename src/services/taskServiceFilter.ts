import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';
import apiClient from '@/utils/apiClient';

export interface Asset {
  id: number;
  name: string;
}

export interface AssetGroup {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  site_id: number | null;
  user_id: number | null;
  company_id: number;
  status: string;
  group_type?: string;
  group_id?: string;
  useful_life?: string | null;
}

export interface AssetGroupResponse {
  asset_groups: AssetGroup[];
}

export interface AssetSubGroup {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  group_id: string;
  status: string;
  useful_life: number | null;
}

export interface EmailRule {
  id: number;
  rule_name: string;
  trigger_type: string;
  trigger_to: string;
  period_type: string;
  period_value: string;
  active: number;
  created_at: string;
  updated_at: string;
  company_id: number;
  created_by: number;
  site_id: number;
  role_ids: string[];
  role_names: string;
  created_by_name: string;
}

export interface User {
  id: number;
  full_name: string;
}

export interface Supplier {
  id: number;
  name: string;
}

export const taskServiceFilter = {
  async getAssets(): Promise<Asset[]> {
    try {
      const response = await apiClient.get<Asset[]>('/pms/assets/get_assets.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching assets:', error);
      // Return mock data for development/testing
      return [
        { id: 28851, name: "Adani Electric Meter" },
        { id: 28852, name: "Laptop Dell Vostro" },
        { id: 28853, name: "Testing Asset 1" },
        { id: 28854, name: "Testing Asset 2" },
      ];
    }
  },

  async getAssetGroups(): Promise<AssetGroup[]> {
    try {
      const response = await apiClient.get<AssetGroupResponse>('/pms/assets/get_asset_group_sub_group.json');
      return response.data.asset_groups;
    } catch (error) {
      console.error('Error fetching asset groups:', error);
      throw error;
    }
  },

  async getAssetSubGroups(groupId: string): Promise<AssetGroup[]> {
    try {
      const response = await apiClient.get<AssetGroupResponse>(`/pms/assets/get_asset_group_sub_group.json?group_id=${groupId}`);
      return response.data.asset_groups;
    } catch (error) {
      console.error('Error fetching asset sub groups:', error);
      throw error;
    }
  },

  async getEmailRules(): Promise<EmailRule[]> {
    try {
      const response = await apiClient.get<EmailRule[]>('/pms/email_rule_setups.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching email rules:', error);
      throw error;
    }
  },

  async getUsers(): Promise<{ users: User[] }> {
    try {
      const response = await apiClient.get<{ users: User[] }>('/pms/users/get_escalate_to_users.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>('/pms/suppliers/get_suppliers.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  }
};