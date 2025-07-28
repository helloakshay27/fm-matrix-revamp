import { getFullUrl, getAuthHeader } from '@/config/apiConfig';
import { getCurrentSiteId, formatDateForAPI } from './taskAnalyticsAPI';

interface DownloadParams {
  fromDate: Date;
  toDate: Date;
  siteId?: string;
}

const downloadTypes = {
  technical: 'chart_technical_checklist_download.json',
  nonTechnical: 'chart_non_technical_checklist_download.json',
  topTen: 'top_ten_checklist_download.json',
  siteWise: 'chart_checklist_download.json'
} as const;

export type DownloadType = keyof typeof downloadTypes;

export const taskAnalyticsDownloadAPI = {
  async downloadAnalyticsData(
    type: DownloadType,
    { fromDate, toDate, siteId }: DownloadParams
  ): Promise<void> {
    try {
      const site_id = siteId || getCurrentSiteId();
      const from_date = formatDateForAPI(fromDate);
      const to_date = formatDateForAPI(toDate);
      
      const endpoint = `pms/custom_forms/${downloadTypes[type]}`;
      const url = `${getFullUrl(endpoint)}?site_id=${site_id}&from_date=${from_date}&to_date=${to_date}&access_token=${getAuthHeader().replace('Bearer ', '')}`;

      // Create a temporary link to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_analytics_${from_date}_to_${to_date}.json`;
      link.target = '_blank';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Download failed:', error);
      throw new Error('Failed to download analytics data');
    }
  },

  // Helper method for batch downloads
  async downloadMultipleAnalytics(
    types: DownloadType[],
    params: DownloadParams
  ): Promise<void> {
    try {
      const downloadPromises = types.map(type => 
        this.downloadAnalyticsData(type, params)
      );
      
      await Promise.all(downloadPromises);
    } catch (error) {
      console.error('Batch download failed:', error);
      throw new Error('Failed to download multiple analytics data');
    }
  }
};