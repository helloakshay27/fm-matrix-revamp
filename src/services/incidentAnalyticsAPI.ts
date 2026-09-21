import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const buildUrl = (path: string, fromDate: Date, toDate: Date, extra: Record<string, string> = {}) => {
  const params = new URLSearchParams({
    from_date: fmt(fromDate),
    to_date: fmt(toDate),
    access_token: API_CONFIG.TOKEN || '',
    ...extra,
  });
  return `${API_CONFIG.BASE_URL}${path}?${params}`;
};

const get = async (url: string) => {
  const resp = await fetch(url, { method: 'GET', headers: { Authorization: getAuthHeader() } });
  if (!resp.ok) throw new Error(`Request failed: ${resp.status}`);
  return resp.json();
};

const download = async (url: string, filename: string) => {
  const resp = await fetch(url, { method: 'GET', headers: { Authorization: getAuthHeader() } });
  if (!resp.ok) throw new Error('Download failed');
  const blob = await resp.blob();
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
};

const incidentAnalyticsAPI = {
  async getStatusSummary(fromDate: Date, toDate: Date) {
    return get(buildUrl('/incident_dashboard/status_summary.json', fromDate, toDate));
  },

  async getLevelWise(fromDate: Date, toDate: Date) {
    return get(buildUrl('/incident_dashboard/level_wise.json', fromDate, toDate));
  },

  async getTopCategories(fromDate: Date, toDate: Date) {
    return get(buildUrl('/incident_dashboard/top_categories.json', fromDate, toDate));
  },

  async getRcaData(fromDate: Date, toDate: Date, page = 1) {
    return get(buildUrl('/incident_dashboard/rca_data.json', fromDate, toDate, { page: String(page) }));
  },

  async getBodyInjuryChart(fromDate: Date, toDate: Date) {
    return get(buildUrl('/incident_dashboard/body_injury_chart.json', fromDate, toDate));
  },

  async downloadStatusSummary(fromDate: Date, toDate: Date) {
    return download(
      buildUrl('/incident_dashboard/status_summary.json', fromDate, toDate, { export: 'true' }),
      `incident-status-${fmt(fromDate)}-to-${fmt(toDate)}.xlsx`
    );
  },

  async downloadLevelWise(fromDate: Date, toDate: Date) {
    return download(
      buildUrl('/incident_dashboard/level_wise.json', fromDate, toDate, { export: 'true' }),
      `incident-level-wise-${fmt(fromDate)}-to-${fmt(toDate)}.xlsx`
    );
  },

  async downloadTopCategories(fromDate: Date, toDate: Date) {
    return download(
      buildUrl('/incident_dashboard/top_categories.json', fromDate, toDate, { export: 'true' }),
      `incident-top-categories-${fmt(fromDate)}-to-${fmt(toDate)}.xlsx`
    );
  },

  async downloadRcaData(fromDate: Date, toDate: Date) {
    return download(
      buildUrl('/incident_dashboard/rca_data.json', fromDate, toDate, { export: 'true' }),
      `incident-rca-${fmt(fromDate)}-to-${fmt(toDate)}.xlsx`
    );
  },

  // Per the "New FM Dashboard Collection" Bruno/Postman collection at the repo
  // root — its `/incident/safety_metrics` and `/incident/Primary Root Cause
  // Category` requests hit these same `/incident_dashboard/*` routes with a
  // `site_id` param, so it's added here the same opt-in way Quick Gate's
  // cards already read the selected site (falls back to none — every-site
  // scope — when nothing is selected yet).
  async getSafetyMetrics(fromDate: Date, toDate: Date) {
    const siteId = localStorage.getItem('selectedSiteId') || '';
    return get(
      buildUrl('/incident_dashboard/safety_metrics.json', fromDate, toDate, siteId ? { site_id: siteId } : {})
    );
  },

  async getCauseWiseIncidents(fromDate: Date, toDate: Date) {
    const siteId = localStorage.getItem('selectedSiteId') || '';
    return get(
      buildUrl('/incident_dashboard/cause_wise_incidents.json', fromDate, toDate, siteId ? { site_id: siteId } : {})
    );
  },

  async downloadCauseWiseIncidents(fromDate: Date, toDate: Date) {
    const siteId = localStorage.getItem('selectedSiteId') || '';
    return download(
      buildUrl('/incident_dashboard/cause_wise_incidents.json', fromDate, toDate, {
        export: 'true',
        ...(siteId ? { site_id: siteId } : {}),
      }),
      `incident-primary-root-cause-${fmt(fromDate)}-to-${fmt(toDate)}.xlsx`
    );
  },
};

export default incidentAnalyticsAPI;
