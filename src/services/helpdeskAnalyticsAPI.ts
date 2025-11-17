import { apiClient } from '@/utils/apiClient';

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export const helpdeskAnalyticsAPI = {
  async getHelpdeskSnapshot(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/api/pms/reports/helpdesk_management_snapshot?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getTicketAgingClosureEfficiency(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/api/pms/reports/ticket_aging_closure_efficiency?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getCustomerExperienceFeedback(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/api/pms/reports/customer_experience_feedback?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getTicketPerformanceMetrics(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/api/pms/reports/ticket_performance_metrics?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  // Convenience wrapper to return both datasets together
  async getAgingClosureFeedbackOverview(fromDate: Date, toDate: Date): Promise<{ agingClosure: any; feedback: any; }>{
    const [agingClosure, feedback] = await Promise.all([
      this.getTicketAgingClosureEfficiency(fromDate, toDate),
      this.getCustomerExperienceFeedback(fromDate, toDate),
    ]);
    return { agingClosure, feedback };
  },

  async getResponseTATQuarterly(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/api/pms/reports/response_tat_performance_quarterly?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getResolutionTATQuarterly(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/api/pms/reports/resolution_tat_performance_quarterly?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  }
};

export default helpdeskAnalyticsAPI;
