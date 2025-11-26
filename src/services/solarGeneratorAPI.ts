import { apiClient } from '@/utils/apiClient';

export interface SolarGenerator {
  id: number;
  transaction_date: string;
  site_id: number;
  unit_consumed: number;
  created_at: string;
  updated_at: string;
  created_by_id: number | null;
  tower_name: string;
  plant_day_generation: number | null;
}

export interface SolarGeneratorFilters {
  date_range?: string;
  from_date?: string;
  to_date?: string;
  site_id?: number;
  tower_name?: string;
}

class SolarGeneratorAPI {
  /**
   * Fetch solar generator data
   */
  async getSolarGenerators(filters?: SolarGeneratorFilters): Promise<SolarGenerator[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.date_range) {
        // Convert DD/MM/YYYY - DD/MM/YYYY to MM/DD/YYYY - MM/DD/YYYY
        const [fromDateStr, toDateStr] = filters.date_range.split(' - ');
        if (fromDateStr && toDateStr) {
          const [fromDay, fromMonth, fromYear] = fromDateStr.trim().split('/');
          const [toDay, toMonth, toYear] = toDateStr.trim().split('/');
          const dateRangeQuery = `${fromMonth}/${fromDay}/${fromYear} - ${toMonth}/${toDay}/${toYear}`;
          params.append('q[date_range]', dateRangeQuery);
        }
      }
      if (filters?.from_date) {
        params.append('from_date', filters.from_date);
      }
      if (filters?.to_date) {
        params.append('to_date', filters.to_date);
      }
      if (filters?.site_id) {
        params.append('site_id', filters.site_id.toString());
      }
      if (filters?.tower_name) {
        params.append('tower_name', filters.tower_name);
      }

      const queryString = params.toString();
      const endpoint = queryString 
        ? `/solar_generators.json?${queryString}`
        : '/solar_generators.json';

      const response = await apiClient.get<SolarGenerator[]>(endpoint);
      return response.data;
    } catch (error) {
      console.error('Error fetching solar generators:', error);
      throw error;
    }
  }

  /**
   * Download solar generator data
   */
  async downloadSolarGenerators(filters?: SolarGeneratorFilters): Promise<void> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.date_range) {
        // Convert DD/MM/YYYY - DD/MM/YYYY to MM/DD/YYYY - MM/DD/YYYY
        const [fromDateStr, toDateStr] = filters.date_range.split(' - ');
        if (fromDateStr && toDateStr) {
          const [fromDay, fromMonth, fromYear] = fromDateStr.trim().split('/');
          const [toDay, toMonth, toYear] = toDateStr.trim().split('/');
          const dateRangeQuery = `${fromMonth}/${fromDay}/${fromYear} - ${toMonth}/${toDay}/${toYear}`;
          params.append('q[date_range]', dateRangeQuery);
        }
      }
      if (filters?.from_date) {
        params.append('from_date', filters.from_date);
      }
      if (filters?.to_date) {
        params.append('to_date', filters.to_date);
      }
      if (filters?.site_id) {
        params.append('site_id', filters.site_id.toString());
      }
      if (filters?.tower_name) {
        params.append('tower_name', filters.tower_name);
      }

      const queryString = params.toString();
      const endpoint = queryString 
        ? `/solar_generators/export.xlsx?${queryString}`
        : '/solar_generators/export.xlsx';

      const response = await apiClient.get(endpoint, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `solar_generators_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading solar generators:', error);
      throw error;
    }
  }
}

export const solarGeneratorAPI = new SolarGeneratorAPI();
