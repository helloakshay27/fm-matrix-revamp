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

// Per the "New FM Dashboard Collection" Bruno/Postman collection at the repo
// root — its `/escalation/*` requests hit these `/escalation_dashboard/*`
// routes with an (optionally multi-value, comma-joined) `site_id` param, so
// it's read here the same opt-in way Quick Gate/Incident cards already read
// the selected site (falls back to none — every-site scope — when nothing is
// selected yet).
const siteIdExtra = (): Record<string, string> => {
  const siteId = localStorage.getItem('selectedSiteId') || '';
  return siteId ? { site_id: siteId } : {};
};

const escalationAnalyticsAPI = {
  // The collection's capture for this one also pins `type=pie_chart`.
  async getEscalationKpis(fromDate: Date, toDate: Date, siteId?: string) {
    return get(
      buildUrl('/escalation_dashboard/escalation_kpis.json', fromDate, toDate, {
        type: 'pie_chart',
        ...(siteId ? { site_id: siteId } : siteIdExtra()),
      })
    );
  },

  async getZoneWise(fromDate: Date, toDate: Date, siteId?: string) {
    return get(
      buildUrl('/escalation_dashboard/zone_wise.json', fromDate, toDate, siteId ? { site_id: siteId } : siteIdExtra())
    );
  },

  async getCategoryWise(fromDate: Date, toDate: Date, siteId?: string) {
    return get(
      buildUrl('/escalation_dashboard/category_wise.json', fromDate, toDate, siteId ? { site_id: siteId } : siteIdExtra())
    );
  },

  async getServicePartnerEvaluation(fromDate: Date, toDate: Date, siteId?: string) {
    return get(
      buildUrl('/escalation_dashboard/service_partner_evaluation.json', fromDate, toDate, siteId ? { site_id: siteId } : siteIdExtra())
    );
  },

  async downloadZoneWise(fromDate: Date, toDate: Date, siteId?: string) {
    return download(
      buildUrl('/escalation_dashboard/zone_wise.json', fromDate, toDate, {
        export: 'true',
        ...(siteId ? { site_id: siteId } : siteIdExtra()),
      }),
      `escalation-zone-wise-${fmt(fromDate)}-to-${fmt(toDate)}.xlsx`
    );
  },

  async downloadCategoryWise(fromDate: Date, toDate: Date, siteId?: string) {
    return download(
      buildUrl('/escalation_dashboard/category_wise.json', fromDate, toDate, {
        export: 'true',
        ...(siteId ? { site_id: siteId } : siteIdExtra()),
      }),
      `escalation-category-wise-${fmt(fromDate)}-to-${fmt(toDate)}.xlsx`
    );
  },
};

export default escalationAnalyticsAPI;
