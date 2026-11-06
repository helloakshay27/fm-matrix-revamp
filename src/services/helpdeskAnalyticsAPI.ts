import { apiClient } from '@/utils/apiClient';

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/**
 * Ticket-type filter from the Ticket Type Wise card ("technical", "non-technical", ...). Different
 * endpoints name the same filter differently — `category_type_type_eq` for most, `type_eq` for
 * ticket_performance_metrics — so callers pass the param name. Omitted for "all"/empty.
 */
const typeParam = (name: 'category_type_type_eq' | 'type_eq', categoryType?: string) =>
  categoryType && categoryType !== 'all' ? `&${name}=${encodeURIComponent(categoryType)}` : '';

const getSiteId = () => localStorage.getItem('selectedSiteId') || '';

/**
 * GET /pms/admin/complaints/chart_ticket_type_wise.json — parallel arrays, one entry per ticket type
 * (e.g. "technical", "non-technical"): `types[i]` pairs with `open_tickets[i]`, `closed_tickets[i]`
 * and `total_tickets[i]`.
 */
export interface TicketTypeWiseData {
  type_options?: string[];
  types?: string[];
  open_tickets?: number[];
  closed_tickets?: number[];
  total_tickets?: number[];
  info?: string;
}

export const helpdeskAnalyticsAPI = {
  async getTicketTypeWise(fromDate: Date, toDate: Date, siteId?: string): Promise<TicketTypeWiseData> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/pms/admin/complaints/chart_ticket_type_wise.json?site_id=${encodeURIComponent(resolvedSiteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getHelpdeskSnapshot(fromDate: Date, toDate: Date, siteId?: string): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/api/pms/reports/helpdesk_management_snapshot.json?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&site_id=${resolvedSiteId}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getTicketAgingClosureEfficiency(fromDate: Date, toDate: Date, siteId?: string): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/api/pms/reports/ticket_aging_closure_efficiency.json?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&site_id=${resolvedSiteId}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getCustomerExperienceFeedback(fromDate: Date, toDate: Date, siteId?: string, categoryType?: string): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/api/pms/reports/customer_experience_feedback.json?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&site_id=${resolvedSiteId}${typeParam('category_type_type_eq', categoryType)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getTicketPerformanceMetrics(fromDate: Date, toDate: Date, siteId?: string, categoryType?: string): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/api/pms/reports/ticket_performance_metrics.json?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&site_id=${resolvedSiteId}${typeParam('type_eq', categoryType)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  // Convenience wrapper to return both datasets together
  async getAgingClosureFeedbackOverview(fromDate: Date, toDate: Date, siteId?: string, categoryType?: string): Promise<{ agingClosure: any; feedback: any; }> {
    const [agingClosure, feedback] = await Promise.all([
      this.getTicketAgingClosureEfficiency(fromDate, toDate, siteId),
      this.getCustomerExperienceFeedback(fromDate, toDate, siteId, categoryType),
    ]);
    return { agingClosure, feedback };
  },

  async getResponseTATQuarterly(fromDate: Date, toDate: Date, siteId?: string, categoryType?: string): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/api/pms/reports/response_tat_performance_quarterly.json?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&site_id=${resolvedSiteId}${typeParam('category_type_type_eq', categoryType)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getResolutionTATQuarterly(fromDate: Date, toDate: Date, siteId?: string, categoryType?: string): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/api/pms/reports/resolution_tat_performance_quarterly.json?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&site_id=${resolvedSiteId}${typeParam('category_type_type_eq', categoryType)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async downloadTicketAgingClosureEfficiency(fromDate: Date, toDate: Date, siteId?: string): Promise<void> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/ticket_aging_closure_efficiency/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&site_id=${resolvedSiteId}`;

    const response = await apiClient.get(url, {
      responseType: 'blob',
    });

    // Create a blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Create a download link and trigger it
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `ticket_aging_closure_efficiency_${start}_to_${end}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  async downloadTicketPerformanceMetrics(fromDate: Date, toDate: Date, siteId?: string): Promise<void> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/ticket_performance_metrics/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&site_id=${resolvedSiteId}`;

    const response = await apiClient.get(url, {
      responseType: 'blob',
    });

    // Create a blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Create a download link and trigger it
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `ticket_performance_metrics_${start}_to_${end}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  async downloadCustomerExperienceFeedback(fromDate: Date, toDate: Date, siteId?: string): Promise<void> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/customer_experience_feedback/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&site_id=${resolvedSiteId}`;

    const response = await apiClient.get(url, {
      responseType: 'blob',
    });

    // Create a blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Create a download link and trigger it
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `customer_experience_feedback_${start}_to_${end}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  async downloadTATPerformanceQuarterly(fromDate: Date, toDate: Date, siteId?: string): Promise<void> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const resolvedSiteId = siteId ?? getSiteId();
    const url = `/tat-performance-quarterly/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}&site_id=${resolvedSiteId}`;

    const response = await apiClient.get(url, {
      responseType: 'blob',
    });

    // Create a blob from the response
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    // Create a download link and trigger it
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `tat_performance_quarterly_${start}_to_${end}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
};

export default helpdeskAnalyticsAPI;
