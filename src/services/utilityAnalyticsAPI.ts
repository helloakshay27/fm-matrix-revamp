import { apiClient } from '@/utils/apiClient';

const formatDate = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const utilityAnalyticsAPI = {
  async getEnergyKPIs(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/energy_kpis.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getSubMeterSources(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/energy_kpis.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getSiteWisePower(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/card_site_wise_power_consumption.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getWaterKPIs(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/water_kpis.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getWaterSourceBreakdown(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/water_source.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getSiteWiseWater(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/site_wise_water_consumption.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getCarbonEmissionScopes(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/carbon_emission_scopes.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}&assets_status=true`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getEnergyIntensity(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/card_energy_intensity.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}&assets_status=true`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getSiteWiseEvConsumption(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/site_wise_ev_consumption.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getSiteWiseDryWasteSegregation(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/site_wise_dry_waste_segregation.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },

  async getWaterTimeSeries(fromDate: Date, toDate: Date): Promise<any> {
    const start = formatDate(fromDate);
    const end = formatDate(toDate);
    const siteId = localStorage.getItem('selectedSiteId') || '';
    const url = `/utility_dashboard/water_consumption_time_series.json?site_id=${encodeURIComponent(siteId)}&from_date=${encodeURIComponent(start)}&to_date=${encodeURIComponent(end)}`;
    const resp = await apiClient.get(url);
    return resp.data;
  },
};

export default utilityAnalyticsAPI;
