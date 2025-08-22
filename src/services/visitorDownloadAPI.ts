
export const visitorDownloadAPI = {
  downloadTotalVisitorsData: async (fromDate: string, toDate: string): Promise<void> => {
    const endpoint = '/pms/visitors/total_visitors_downloads.json';
    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
      access_token: API_CONFIG.TOKEN,
    });
    const url = `${API_CONFIG.BASE_URL}${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
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
    link.download = `total_visitors_${fromDate}_to_${toDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
  downloadExpectedVisitorsData: async (fromDate: string, toDate: string): Promise<void> => {
    const endpoint = '/pms/visitors/expected_visitors_downloads.json';
    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
      access_token: API_CONFIG.TOKEN,
    });
    const url = `${API_CONFIG.BASE_URL}${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
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
    link.download = `expected_visitors_${fromDate}_to_${toDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
  downloadUnexpectedVisitorsData: async (fromDate: string, toDate: string): Promise<void> => {
    const endpoint = '/pms/visitors/unexpected_visitors_downloads.json';
    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
      access_token: API_CONFIG.TOKEN,
    });
    const url = `${API_CONFIG.BASE_URL}${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
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
    link.download = `unexpected_visitors_${fromDate}_to_${toDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
  downloadComparisonData: async (fromDate: Date, toDate: Date): Promise<void> => {
    // Host Wise Visitors Download (legacy, D/M/YYYY)
    const endpoint = '/pms/visitors/host_wise_visitors_downloads.json';
    const formatDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
    const params = new URLSearchParams({
      from_date: formatDate(fromDate),
      to_date: formatDate(toDate),
      access_token: API_CONFIG.TOKEN,
    });
    const url = `${API_CONFIG.BASE_URL}${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
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
    link.download = `host_wise_visitors_${formatDate(fromDate)}_to_${formatDate(toDate)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  downloadTypeDistributionData: async (fromDate: string, toDate: string): Promise<void> => {
    // Visitor Type Distribution Download (comparison_downloads.json, YYYY-MM-DD)
    const endpoint = '/pms/visitors/comparison_downloads.json';
    const params = new URLSearchParams({
      from_date: fromDate,
      to_date: toDate,
      access_token: API_CONFIG.TOKEN,
    });
    const url = `${API_CONFIG.BASE_URL}${endpoint}?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
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
    link.download = `visitor_type_distribution_${fromDate}_to_${toDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
};
import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

export default visitorDownloadAPI;