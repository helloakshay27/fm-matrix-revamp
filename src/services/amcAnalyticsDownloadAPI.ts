import { API_CONFIG } from '@/config/apiConfig';

// Format date for API (YYYY-MM-DD)
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current site ID dynamically from localStorage
const getCurrentSiteId = (): string => {
  const siteId = localStorage.getItem('currentSiteId') ||
    localStorage.getItem('site_id') ||
    localStorage.getItem('siteId') ||
    localStorage.getItem('selectedSiteId');

  if (!siteId) {
    const urlParams = new URLSearchParams(window.location.search);
    const urlSiteId = urlParams.get('site_id');
    if (urlSiteId) return urlSiteId;

    console.warn('Site ID not found in localStorage or URL, using default: 7');
    return '7';
  }

  return siteId;
};

// Get dynamic base URL from localStorage
const getBaseUrl = (): string => {
  return localStorage.getItem('baseUrl');
};

// Download helper function
const downloadFile = async (url: string, filename: string): Promise<void> => {
  const fullUrl = `${API_CONFIG.BASE_URL}${url}`;

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};

export const amcAnalyticsDownloadAPI = {
  // Download AMC status overview data
  async downloadAMCStatusData(fromDate: Date, toDate: Date): Promise<void> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    const url = `/pms/asset_amcs/amc_statistics.json?amcs_stats=true&export=amcs_stats&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    const filename = `amc_status_report_${fromDateStr}_to_${toDateStr}.xlsx`;

    await downloadFile(url, filename);
  },

  // Download AMC type distribution data
  async downloadAMCTypeDistribution(fromDate: Date, toDate: Date): Promise<void> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    const url = `/pms/asset_amcs/amc_statistics.json?breakdown_vs_preventive=true&export=breakdown_vs_preventive_visits&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    const filename = `amc_type_distribution_${fromDateStr}_to_${toDateStr}.xlsx`;

    await downloadFile(url, filename);
  },

  // Download AMC expiry analysis data
  async downloadAMCExpiryAnalysis(fromDate: Date, toDate: Date): Promise<void> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    const url = `/pms/asset_amcs/amc_statistics.json?amcs_expiry_stats=true&export=amcs_expiry_stats&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    const filename = `amc_expiry_analysis_${fromDateStr}_to_${toDateStr}.xlsx`;

    await downloadFile(url, filename);
  },

  // Download AMC service tracking data
  async downloadAMCServiceTracking(fromDate: Date, toDate: Date): Promise<void> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    const url = `/pms/asset_amcs/amc_statistics.json?service_tracking=true&export=service_tracking&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    const filename = `amc_service_tracking_${fromDateStr}_to_${toDateStr}.xlsx`;

    await downloadFile(url, filename);
  },

  // Download AMC vendor performance data
  async downloadAMCVendorPerformance(fromDate: Date, toDate: Date): Promise<void> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    const url = `/pms/asset_amcs/download_vendor_performance.xlsx?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    const filename = `amc_vendor_performance_${fromDateStr}_to_${toDateStr}.xlsx`;

    await downloadFile(url, filename);
  },

  // Download AMC compliance report data
  async downloadAMCComplianceReport(fromDate: Date, toDate: Date): Promise<void> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    const url = `/pms/asset_amcs/download_compliance_report.xlsx?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    const filename = `amc_compliance_report_${fromDateStr}_to_${toDateStr}.xlsx`;

    await downloadFile(url, filename);
  },

  // Download AMC unit resource wise data
  async downloadAMCUnitResourceWise(fromDate: Date, toDate: Date): Promise<void> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    const url = `/pms/asset_amcs/amc_statistics.json?amcs_unit_resource_wise=true&export=amcs_unit_resource_wise&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    const filename = `amc_unit_resource_wise_${fromDateStr}_to_${toDateStr}.xlsx`;

    await downloadFile(url, filename);
  },

  // Download AMC service stats data
  async downloadAMCServiceStats(fromDate: Date, toDate: Date): Promise<void> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    const url = `/pms/asset_amcs/amc_statistics.json?service_stats=true&export=service_stats&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    const filename = `amc_service_stats_${fromDateStr}_to_${toDateStr}.xlsx`;

    await downloadFile(url, filename);
  },

  // Download AMC coverage by location data
  async downloadAMCCoverageByLocation(fromDate: Date, toDate: Date): Promise<void> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);

    const url = `/pms/asset_amcs/amc_statistics.json?coverage_by_location=true&export=coverage_by_location&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    const filename = `amc_coverage_by_location_${fromDateStr}_to_${toDateStr}.xlsx`;

    await downloadFile(url, filename);
  },
};
