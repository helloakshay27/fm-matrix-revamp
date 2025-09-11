import { apiClient } from '@/utils/apiClient';

// Format date as YYYY-MM-DD
const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

export type VisitorTrendRow = {
  site: string;
  last: number;
  current: number;
};

const visitorManagementAnalyticsAPI = {
  async getVisitorTrendAnalysis(fromDate: Date, toDate: Date): Promise<VisitorTrendRow[]> {
    const start = fmt(fromDate);
    const end = fmt(toDate);
    const url = `/api/pms/reports/visitor_trend_analysis?start_date=${encodeURIComponent(start)}&end_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    const payload = resp.data;
    const root = payload?.data ?? payload ?? {};

    // New shape: data.visitor_management.chart_data with x_axis.categories and series
    const vm = root?.visitor_management ?? null;
    if (vm) {
      const categories: any[] = vm?.chart_data?.x_axis?.categories ?? [];
      const series: any[] = vm?.chart_data?.series ?? [];
      if (Array.isArray(categories) && Array.isArray(series) && categories.length) {
        const findSeries = (namePattern: RegExp) => series.find((s: any) => s?.name && namePattern.test(String(s.name)));
        const lastSeries = findSeries(/last/i) || findSeries(/previous/i);
        const currentSeries = findSeries(/current/i) || findSeries(/this/i);
        return categories.map((site: any, idx: number) => ({
          site: String(site ?? '-'),
          last: Number(lastSeries?.data?.[idx] ?? 0),
          current: Number(currentSeries?.data?.[idx] ?? 0),
        }));
      }

      // Alternate new shape: site_wise_analysis array with keys
      const siteWise = vm?.site_wise_analysis;
      if (Array.isArray(siteWise)) {
        return siteWise.map((r: any) => ({
          site: r.site_name || r.site || '-',
          last: Number(r.last_quarter ?? r.last ?? 0),
          current: Number(r.current_quarter ?? r.current ?? 0),
        }));
      }
    }

    // Legacy shape: data.visitor_trend_analysis (array)
    const legacy = root?.visitor_trend_analysis ?? payload?.visitor_trend_analysis ?? [];
    if (Array.isArray(legacy)) {
      return legacy.map((r: any) => ({
        site: r.site_name || r.site || '-',
        last: Number(r.last_quarter ?? r.last_quarter_total ?? r.last ?? 0),
        current: Number(r.current_quarter ?? r.current_quarter_total ?? r.current ?? 0),
      }));
    }

    // Fallback: return empty
    return [];
  },
};

export default visitorManagementAnalyticsAPI;
