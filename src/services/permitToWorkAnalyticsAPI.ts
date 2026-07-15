import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

const fmt = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getSiteId = () =>
  localStorage.getItem('selectedSiteId') ||
  new URLSearchParams(window.location.search).get('site_id') || '';

const permitToWorkAnalyticsAPI = {
  async getSiteWisePermitsReport(fromDate: Date, toDate: Date) {
    const siteId = getSiteId();
    const from = fmt(fromDate);
    const to = fmt(toDate);
    const url = `${API_CONFIG.BASE_URL}/pms/permits/site_wise_permits_report.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${API_CONFIG.TOKEN}`;
    const resp = await fetch(url, { method: 'GET', headers: { Authorization: getAuthHeader() } });
    if (!resp.ok) throw new Error('Failed to fetch site-wise permits report');
    return resp.json();
  },

  async getPermitsStatusData(fromDate: Date, toDate: Date) {
    const siteId = getSiteId();
    const from = fmt(fromDate);
    const to = fmt(toDate);
    const url = `${API_CONFIG.BASE_URL}/pms/permits/permits_status_data.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${API_CONFIG.TOKEN}`;
    const resp = await fetch(url, { method: 'GET', headers: { Authorization: getAuthHeader() } });
    if (!resp.ok) throw new Error('Failed to fetch permits status data');
    return resp.json();
  },

  async downloadSiteWisePermits(fromDate: Date, toDate: Date) {
    const siteId = getSiteId();
    const from = fmt(fromDate);
    const to = fmt(toDate);
    const url = `${API_CONFIG.BASE_URL}/pms/permits/site_wise_permits_download.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${API_CONFIG.TOKEN}`;
    const resp = await fetch(url, { method: 'GET', headers: { Authorization: getAuthHeader() } });
    if (!resp.ok) throw new Error('Download failed');
    const blob = await resp.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `site-wise-permits-${from}-to-${to}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  },

  async downloadPermitsStatus(fromDate: Date, toDate: Date) {
    const siteId = getSiteId();
    const from = fmt(fromDate);
    const to = fmt(toDate);
    const url = `${API_CONFIG.BASE_URL}/pms/permits/permits_status_download.json?site_id=${siteId}&from_date=${from}&to_date=${to}&access_token=${API_CONFIG.TOKEN}`;
    const resp = await fetch(url, { method: 'GET', headers: { Authorization: getAuthHeader() } });
    if (!resp.ok) throw new Error('Download failed');
    const blob = await resp.blob();
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `permits-status-${from}-to-${to}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  },
};

export default permitToWorkAnalyticsAPI;
