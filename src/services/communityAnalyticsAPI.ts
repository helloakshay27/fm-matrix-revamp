import { apiClient } from '@/utils/apiClient';

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export interface CommunityEngagementMetrics {
  data?: {
    summary?: {
      total_active_users?: number;
      platform_breakdown?: { android?: number; ios?: number };
      new_users?: number;
    };
    total_active_users?: number;
    android?: number;
    ios?: number;
    new_users?: number;
    [k: string]: any;
  };
  [k: string]: any;
}

export interface SiteAdoptionRateResponse {
  data?: {
    adoption_rates?: any[];
  } | any[];
  [k: string]: any;
}

export const communityAnalyticsAPI = {
  async getCommunityEngagementMetrics(): Promise<CommunityEngagementMetrics | null> {
    const url = `/api/pms/reports/device_platform_statistics`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getSiteWiseAdoptionRate(fromDate: Date, toDate: Date): Promise<SiteAdoptionRateResponse | null> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/api/pms/reports/site_wise_adoption_rate?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },
};

export default communityAnalyticsAPI;
