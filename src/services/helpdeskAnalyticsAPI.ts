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
  },

  async downloadTicketAgingClosureEfficiency(fromDate: Date, toDate: Date): Promise<void> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/ticket_aging_closure_efficiency/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    
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

  async downloadTicketPerformanceMetrics(fromDate: Date, toDate: Date): Promise<void> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/ticket_performance_metrics/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    
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

  async downloadCustomerExperienceFeedback(fromDate: Date, toDate: Date): Promise<void> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/customer_experience_feedback/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    
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

  async downloadTATPerformanceQuarterly(fromDate: Date, toDate: Date): Promise<void> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const url = `/tat-performance-quarterly/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    
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
