import { apiClient } from '@/utils/apiClient';

const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export type ChecklistProgressDetailRow = {
  site_name: string;
  current_period?: {
    Open?: number;
    "Work In Progress"?: number;
    Overdue?: number;
    "Partially Closed"?: number;
    Closed?: number;
  };
  previous_period?: {
    Open?: number;
    "Work In Progress"?: number;
    Overdue?: number;
    "Partially Closed"?: number;
    Closed?: number;
  };
  difference?: {
    Open?: number;
    "Work In Progress"?: number;
    Overdue?: number;
    "Partially Closed"?: number;
    Closed?: number;
  };
};

export type TopOverdueChecklistMatrix = {
  categories: string[];
  siteRows: Array<{
    site_name: string;
    categories: Array<{ category: string; overdue_percentage: number }>
  }>;
};

const checklistManagementAnalyticsAPI = {
  async getSiteWiseChecklist(fromDate: Date, toDate: Date): Promise<any> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/api/pms/reports/site_wise_checklist?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getChecklistProgressRows(fromDate: Date, toDate: Date): Promise<ChecklistProgressDetailRow[]> {
    const data = await this.getSiteWiseChecklist(fromDate, toDate);
    const root = data?.data ?? data ?? {};
    
    // The API now returns checklist_progress array directly with current_period, previous_period, and difference
    const rows: ChecklistProgressDetailRow[] = Array.isArray(root?.checklist_progress)
      ? root.checklist_progress
      : Array.isArray(root?.site_wise_breakdown)
        ? root.site_wise_breakdown
        : [];

    // Return the rows as-is - the component will handle the data structure
    return rows;
  },

  async getTopOverdueChecklistMatrix(fromDate: Date, toDate: Date): Promise<TopOverdueChecklistMatrix> {
    const data = await this.getSiteWiseChecklist(fromDate, toDate);
    const root = data?.data ?? data ?? {};
    const top10 = root?.top_10_overdue_checklists ?? {};
    const categories: string[] = Array.isArray(top10?.categories) ? top10.categories : [];
    const siteRowsRaw: any[] = Array.isArray(top10?.site_wise) ? top10.site_wise : [];
    const siteRows = siteRowsRaw.map((s: any) => ({
      site_name: s?.site_name || s?.center_name || s?.site || '-',
      categories: (Array.isArray(s?.categories) ? s.categories : []).map((c: any) => ({
        category: String(c?.category ?? ''),
        overdue_percentage: Number(c?.overdue_percentage ?? 0) || 0,
      })),
    }));
    return { categories, siteRows };
  },

  async downloadSiteWiseChecklist(fromDate: Date, toDate: Date): Promise<void> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/export_site_wise_checklist/export.xlsx?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    
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
    link.download = `site_wise_checklist_${start}_to_${end}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};

export default checklistManagementAnalyticsAPI;
