import { apiClient } from '@/utils/apiClient';
import { ENDPOINTS } from '@/config/apiConfig';

export interface RecentAssetTAT {
  last_breakdown_tat_days: number | null;
  current_breakdown_tat_days: number | null;
  average_tat_days: number | null;
  breakdown_count: number;
  tat_status: 'no_breakdown' | 'normal' | 'warning' | 'critical';
  last_breakdown_date: string | null;
}

export interface RecentAsset {
  id: number;
  name: string;
  asset_code: string;
  status: string;
  critical: 'Yes' | 'No';
  criticality_level: 'normal' | 'warning' | 'critical';
  created_at: string;
  updated_at: string;
  tat: RecentAssetTAT;
}

export interface RecentAssetsResponse {
  recent_assets: RecentAsset[];
}

export const recentAssetsService = {
  // Fetch recent assets
  async getRecentAssets(): Promise<RecentAssetsResponse> {
    try {
      const response = await apiClient.get<RecentAssetsResponse>(ENDPOINTS.RECENT_ASSETS);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching recent assets:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch recent assets');
    }
  }
};
