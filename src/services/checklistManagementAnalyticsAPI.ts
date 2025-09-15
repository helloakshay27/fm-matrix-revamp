import { apiClient } from '@/utils/apiClient';

const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export type ChecklistProgressDetailRow = {
  site_name: string;
  current: {
    open: number;
    in_progress: number;
    overdue: number;
    partially_closed: number;
    closed: number;
  };
  difference: {
    open: number;
    in_progress: number;
    overdue: number;
    partially_closed: number;
    closed: number;
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
    // Support multiple possible shapes from API
    const rows: any[] = Array.isArray(root?.site_wise_breakdown)
      ? root.site_wise_breakdown
      : Array.isArray(root?.checklist_progress)
        ? root.checklist_progress
        : [];

    if (!rows.length) return [];

    const num = (v: any) => Number(v ?? 0) || 0;

    return rows.map((row: any) => {
      const site = row?.site_name ?? row?.center_name ?? row?.site ?? '-';
      // Some payloads use current_quarter/last_quarter; others use current/last_quarter
      const currentRaw = row?.current_quarter ?? row?.current ?? {};
      const lastRaw = row?.last_quarter ?? {};

      const cur = {
        open: num(currentRaw?.not_completed ?? currentRaw?.open),
        in_progress: num(currentRaw?.in_progress),
        overdue: num(currentRaw?.delayed ?? currentRaw?.overdue),
        partially_closed: num(currentRaw?.partial ?? currentRaw?.partially_closed),
        closed: num(currentRaw?.completed ?? currentRaw?.closed),
      };

      const prev = {
        open: num(lastRaw?.not_completed ?? lastRaw?.open),
        in_progress: num(lastRaw?.in_progress),
        overdue: num(lastRaw?.delayed ?? lastRaw?.overdue),
        partially_closed: num(lastRaw?.partial ?? lastRaw?.partially_closed),
        closed: num(lastRaw?.completed ?? lastRaw?.closed),
      };

      // Prefer API-provided difference if available, else compute
      const diffRaw = row?.difference;
      const difference = diffRaw && typeof diffRaw === 'object'
        ? {
            open: num(diffRaw.open),
            in_progress: num(diffRaw.in_progress),
            overdue: num(diffRaw.overdue),
            partially_closed: num(diffRaw.partially_closed),
            closed: num(diffRaw.closed),
          }
        : {
            open: cur.open - prev.open,
            in_progress: cur.in_progress - prev.in_progress,
            overdue: cur.overdue - prev.overdue,
            partially_closed: cur.partially_closed - prev.partially_closed,
            closed: cur.closed - prev.closed,
          };

      return {
        site_name: site,
        current: cur,
        difference,
      };
    });
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
};

export default checklistManagementAnalyticsAPI;
