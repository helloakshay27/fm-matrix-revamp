import { apiClient } from '@/utils/apiClient';

// Helpers
const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export interface MeetingRoomRevenueOverview {
  total_revenue?: number | string;
  // keep flexible for any additional fields backend may add
  [key: string]: any;
}

export interface MeetingRoomCenterPerformanceRow {
  site_name?: string;
  site?: string;
  meeting_room?: {
    utilization_rate?: string | number;
    cancellation_rate?: string | number;
    revenue?: string | number;
    utilization_trend?: '↑' | '↓' | '-' | null;
    cancellation_trend?: '↑' | '↓' | '-' | null;
    revenue_trend?: '↑' | '↓' | '-' | null;
  } | Record<string, any>;
  meeting?: Record<string, any>;
  [key: string]: any;
}
const getSelectedSiteId = () => {
  return localStorage.getItem("selectedSiteId") ; // Default to 2189 if not found
};
export const getCurrentSiteId = (): string => {
  // Try to get site_id from localStorage first
  const siteId = localStorage.getItem('selectedSiteId');
  if (siteId) return siteId;

  console.log("siteId default", siteId);

  // Fallback to URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('site_id'); // Default site_id
};
export const meetingRoomAnalyticsAPI = {


  // Single API returns both revenue overview and center performance
  async getMeetingRoomPerformance(fromDate: Date, toDate: Date): Promise<{ revenue_overview: MeetingRoomRevenueOverview | null; center_performance: MeetingRoomCenterPerformanceRow[] }>{
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = getSelectedSiteId();

    const url = `/api/pms/reports/meeting_room_day_pass_performance?site_id=${siteId}&start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    const payload = resp.data;
    const data = payload?.data ?? payload ?? {};
    const revenue_overview: MeetingRoomRevenueOverview | null = data?.revenue_generation_overview ?? null;
    // Normalize center performance rows to array
    const centerSrc = (data?.center_performance?.data ?? data?.center_performance ?? data?.data ?? []) as any;
    const center_performance: MeetingRoomCenterPerformanceRow[] = Array.isArray(centerSrc) ? centerSrc : (centerSrc ? [centerSrc] : []);
    return { revenue_overview, center_performance };
  },

  async getMeetingRoomRevenueOverview(fromDate: Date, toDate: Date): Promise<MeetingRoomRevenueOverview | null> {
    const { revenue_overview } = await this.getMeetingRoomPerformance(fromDate, toDate);
    return revenue_overview;
  },

  async getMeetingRoomCenterPerformance(fromDate: Date, toDate: Date): Promise<MeetingRoomCenterPerformanceRow[]> {
    const { center_performance } = await this.getMeetingRoomPerformance(fromDate, toDate);
    return center_performance;
  },

  async getCenterWiseMeetingRoomUtilization(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = getSelectedSiteId();
    const url = `/api/pms/reports/center_wise_meeting_room_utilization?site_id=${siteId}&start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  // Quarterly TAT performance by center – Response
  async getResponseTATPerformanceQuarterly(): Promise<Array<{ site: string; responseLast: number; responseCurrent: number }>> {
    const siteId = getSelectedSiteId();
    const url = `/api/pms/reports/response_tat_performance_quarterly?site_id=${siteId}`;
    const resp = await apiClient.get(url);
    const payload = resp.data;
    const perf = payload?.data?.performance_data
      ?? payload?.performance_data
      ?? payload?.data?.response_performance_data
      ?? payload?.response_performance_data
      ?? [];
    if (!Array.isArray(perf)) return [];

    return perf.map((row: any) => {
      const site = row.center_name || row.site_name || row.site || '';
      // Updated to use previous_period/current_period (fallback to last_quarter/current_quarter for backward compatibility)
      const lastNested = row.previous_period?.response_tat?.achieved_percentage
        ?? row.last_quarter?.response_tat?.achieved_percentage;
      const currentNested = row.current_period?.response_tat?.achieved_percentage
        ?? row.current_quarter?.response_tat?.achieved_percentage;
      const responseLast = Number(
        lastNested
        ?? row.previous_period?.response_achieved_percentage
        ?? row.last_quarter?.response_achieved_percentage
        ?? 0
      );
      const responseCurrent = Number(
        currentNested
        ?? row.current_period?.response_achieved_percentage
        ?? row.current_quarter?.response_achieved_percentage
        ?? 0
      );
      return { site, responseLast, responseCurrent };
    });
  },

  // Quarterly TAT performance by center – Resolution
  async getResolutionTATPerformanceQuarterly(): Promise<Array<{ site: string; resolutionLast: number; resolutionCurrent: number }>> {
    const siteId = getSelectedSiteId();
    const url = `/api/pms/reports/resolution_tat_performance_quarterly?site_id=${siteId}`;
    const resp = await apiClient.get(url);
    const payload = resp.data;
    const perf = payload?.data?.performance_data
      ?? payload?.performance_data
      ?? payload?.data?.resolution_performance_data
      ?? payload?.resolution_performance_data
      ?? [];
    if (!Array.isArray(perf)) return [];

    return perf.map((row: any) => {
      const site = row.center_name || row.site_name || row.site || '';
      // Updated to use previous_period/current_period (fallback to last_quarter/current_quarter for backward compatibility)
      const lastNested = row.previous_period?.resolution_tat?.achieved_percentage
        ?? row.last_quarter?.resolution_tat?.achieved_percentage;
      const currentNested = row.current_period?.resolution_tat?.achieved_percentage
        ?? row.current_quarter?.resolution_tat?.achieved_percentage;
      const resolutionLast = Number(
        lastNested
        ?? row.previous_period?.resolution_achieved_percentage
        ?? row.last_quarter?.resolution_achieved_percentage
        ?? 0
      );
      const resolutionCurrent = Number(
        currentNested
        ?? row.current_period?.resolution_achieved_percentage
        ?? row.current_quarter?.resolution_achieved_percentage
        ?? 0
      );
      return { site, resolutionLast, resolutionCurrent };
    });
  },
};

export default meetingRoomAnalyticsAPI;
