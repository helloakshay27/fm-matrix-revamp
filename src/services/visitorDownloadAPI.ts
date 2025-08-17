import { API_CONFIG, getAuthHeader } from '@/config/apiConfig';

export const visitorDownloadAPI = {
  downloadTotalVisitorsData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const endpoint = '/pms/visitors/total_visitors_downloads.json';
    
    // Format dates as DD/MM/YYYY to match API expectation
    const formatDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const params = new URLSearchParams({
      from_date: formatDate(fromDate),
      to_date: formatDate(toDate),
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
    
    // Handle file download
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `total_visitors_${formatDate(fromDate)}_to_${formatDate(toDate)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  downloadExpectedVisitorsData: async (fromDate: Date, toDate: Date): Promise<void> => {
    // Similar endpoint for expected visitors (assuming similar pattern)
    const endpoint = '/pms/visitors/expected_visitors_downloads.json';
    
    const formatDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const params = new URLSearchParams({
      from_date: formatDate(fromDate),
      to_date: formatDate(toDate),
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
    link.download = `expected_visitors_${formatDate(fromDate)}_to_${formatDate(toDate)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  downloadUnexpectedVisitorsData: async (fromDate: Date, toDate: Date): Promise<void> => {
    // Similar endpoint for unexpected visitors (assuming similar pattern)
    const endpoint = '/pms/visitors/unexpected_visitors_downloads.json';
    
    const formatDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const params = new URLSearchParams({
      from_date: formatDate(fromDate),
      to_date: formatDate(toDate),
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
    link.download = `unexpected_visitors_${formatDate(fromDate)}_to_${formatDate(toDate)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },

  downloadComparisonData: async (fromDate: Date, toDate: Date): Promise<void> => {
    const endpoint = '/pms/visitors/comparison_downloads.json';
    
    const formatDate = (date: Date): string => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const params = new URLSearchParams({
      from_date: formatDate(fromDate),
      to_date: formatDate(toDate),
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
    link.download = `visitor_comparison_${formatDate(fromDate)}_to_${formatDate(toDate)}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }
};

export default visitorDownloadAPI;