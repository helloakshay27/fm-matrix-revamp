import { apiClient } from '@/utils/apiClient';

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

export interface Supplier {
  id: number;
  name: string;
}

export const assetService = {
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

  async getSuppliers(): Promise<Supplier[]> {
    try {
      const response = await apiClient.get<Supplier[]>('/pms/suppliers/get_suppliers.json');
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  },
};