import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/apiConfig';

// Types for AMC Analytics API responses
export interface AMCStatusData {
  info_active_inactive: string;
  active_amc: number;
  inactive_amc: number;
  info_resource_wise: string;
  service_total: number;
  assets_total: number;
}

// Extended types for component data
export interface AMCStatusSummary {
  totalAMCs: number;
  activeAMCs: number;
  inactiveAMCs: number;
  underServiceAMCs: number;
  expiredAMCs: number;
  upcomingExpiryAMCs: number;
}

export interface AMCTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface AMCExpiryAnalysis {
  period: string;
  expiringCount: number;
  expiredCount: number;
}

export interface AMCServiceTracking {
  serviceType: string;
  completedServices: number;
  pendingServices: number;
  overdueServices: number;
}

export interface AMCVendorPerformance {
  vendorName: string;
  totalAMCs: number;
  activeAMCs: number;
  completedServices: number;
  pendingServices: number;
  performanceScore: number;
  avgResponseTime: number;
}

export interface AMCComplianceReport {
  overallCompliance: number;
  categoryCompliance: Array<{
    category: string;
    complianceScore: number;
    totalRequirements: number;
    metRequirements: number;
  }>;
  riskAreas: Array<{
    area: string;
    riskLevel: 'High' | 'Medium' | 'Low';
    count: number;
  }>;
}

export interface ServiceLog {
  id: number;
  visit_number: number;
  visit_date: string;
  asset_amc_id: number;
  technician_id: number;
  remarks: string;
}

export interface ServiceTrackingData {
  service_logs: ServiceLog[];
}

export interface UpcomingExpiry {
  id: number;
  asset_id: number | null;
  vendor_name: string | null;
  expires_on: string;
}

export interface ExpiryAnalysisData {
  upcoming_expiries: UpcomingExpiry[];
}

export interface VendorPerformanceData {
  vendor_performance: Array<{
    vendor_name: string;
    total_amcs: number;
    active_amcs: number;
    performance_score: number;
  }>;
}

// Format date for API (YYYY-MM-DD)
const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get current site ID dynamically from localStorage or header
const getCurrentSiteId = (): string => {
  return localStorage.getItem('selectedSiteId') || 
         new URLSearchParams(window.location.search).get('site_id');
};

export const amcAnalyticsAPI = {
  // Get AMC status data (active/inactive and service/asset breakdown)
  async getAMCStatusData(fromDate: Date, toDate: Date): Promise<AMCStatusData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/asset_amcs/status_of_amcs.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Transform AMC status data for the status card component
  async getAMCStatusSummary(fromDate: Date, toDate: Date): Promise<AMCStatusSummary> {
    const statusData = await this.getAMCStatusData(fromDate, toDate);
    // Transform the data to match component expectations
    return {
      totalAMCs: statusData.active_amc + statusData.inactive_amc,
      activeAMCs: statusData.active_amc,
      inactiveAMCs: statusData.inactive_amc,
      underServiceAMCs: Math.floor(statusData.service_total * 0.3), // Mock calculation
      expiredAMCs: Math.floor(statusData.inactive_amc * 0.4), // Mock calculation
      upcomingExpiryAMCs: Math.floor(statusData.active_amc * 0.15) // Mock calculation
    };
  },

  // Get AMC type distribution data
  async getAMCTypeDistribution(fromDate: Date, toDate: Date): Promise<AMCTypeDistribution[]> {
    // Mock data for now - replace with actual API when available
    return [
      { type: 'Electrical', count: 25, percentage: 35.7 },
      { type: 'HVAC', count: 18, percentage: 25.7 },
      { type: 'Plumbing', count: 15, percentage: 21.4 },
      { type: 'Fire Safety', count: 8, percentage: 11.4 },
      { type: 'Security', count: 4, percentage: 5.7 }
    ];
  },

  // Get expiry analysis data
  async getAMCExpiryAnalysis(fromDate: Date, toDate: Date): Promise<AMCExpiryAnalysis[]> {
    const expiryData = await this.getExpiryAnalysisData(fromDate, toDate);
    // Transform upcoming_expiries into analysis format
    const expiryByPeriod: Record<string, { expiring: number; expired: number }> = {};
    
    expiryData.upcoming_expiries.forEach(expiry => {
      const expiryDate = new Date(expiry.expires_on);
      const now = new Date();
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let period: string;
      if (diffDays < 0) {
        period = 'Expired';
      } else if (diffDays <= 30) {
        period = 'Next 30 Days';
      } else if (diffDays <= 90) {
        period = 'Next 90 Days';
      } else {
        period = 'Future';
      }
      
      if (!expiryByPeriod[period]) {
        expiryByPeriod[period] = { expiring: 0, expired: 0 };
      }
      
      if (diffDays < 0) {
        expiryByPeriod[period].expired++;
      } else {
        expiryByPeriod[period].expiring++;
      }
    });
    
    return Object.entries(expiryByPeriod).map(([period, data]) => ({
      period,
      expiringCount: data.expiring,
      expiredCount: data.expired
    }));
  },

  // Get service tracking data
  async getServiceTrackingData(fromDate: Date, toDate: Date): Promise<ServiceTrackingData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/asset_amcs/service_tracking.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Transform service tracking data for the component
  async getAMCServiceTracking(fromDate: Date, toDate: Date): Promise<AMCServiceTracking[]> {
    const serviceData = await this.getServiceTrackingData(fromDate, toDate);
    // Group by service type and calculate metrics
    const serviceTypes = ['Preventive', 'Corrective', 'Emergency', 'Inspection'];
    
    return serviceTypes.map(type => ({
      serviceType: type,
      completedServices: Math.floor(Math.random() * 20) + 5, // Mock data
      pendingServices: Math.floor(Math.random() * 10) + 2,
      overdueServices: Math.floor(Math.random() * 5)
    }));
  },

  // Get expiry analysis data
  async getExpiryAnalysisData(fromDate: Date, toDate: Date): Promise<ExpiryAnalysisData> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/asset_amcs/expiry_analysis.json?site_id=${siteId}&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get(url);
    return response.data;
  },

  // Get vendor performance data (mock for now, add actual endpoint when available)
  async getVendorPerformanceData(fromDate: Date, toDate: Date): Promise<VendorPerformanceData> {
    // This is a mock implementation - replace with actual API when available
    return {
      vendor_performance: []
    };
  },

  // Transform vendor performance data for the component
  async getAMCVendorPerformance(fromDate: Date, toDate: Date): Promise<AMCVendorPerformance[]> {
    // Mock data for now - replace with actual API when available
    return [
      {
        vendorName: 'TechServ Solutions',
        totalAMCs: 25,
        activeAMCs: 23,
        completedServices: 145,
        pendingServices: 8,
        performanceScore: 92,
        avgResponseTime: 2.5
      },
      {
        vendorName: 'Maintenance Pro',
        totalAMCs: 18,
        activeAMCs: 16,
        completedServices: 98,
        pendingServices: 12,
        performanceScore: 78,
        avgResponseTime: 4.2
      },
      {
        vendorName: 'Quick Fix Ltd',
        totalAMCs: 12,
        activeAMCs: 12,
        completedServices: 67,
        pendingServices: 5,
        performanceScore: 85,
        avgResponseTime: 3.1
      }
    ];
  },

  // Get compliance report data (mock for now)
  async getAMCComplianceReport(fromDate: Date, toDate: Date): Promise<AMCComplianceReport> {
    // Mock data for now - replace with actual API when available
    return {
      overallCompliance: 84,
      categoryCompliance: [
        { category: 'Safety', complianceScore: 92, totalRequirements: 15, metRequirements: 14 },
        { category: 'Environmental', complianceScore: 78, totalRequirements: 12, metRequirements: 9 },
        { category: 'Quality', complianceScore: 85, totalRequirements: 20, metRequirements: 17 },
        { category: 'Documentation', complianceScore: 90, totalRequirements: 8, metRequirements: 7 }
      ],
      riskAreas: [
        { area: 'Fire Safety Systems', riskLevel: 'High', count: 3 },
        { area: 'Electrical Compliance', riskLevel: 'Medium', count: 7 },
        { area: 'HVAC Maintenance', riskLevel: 'Low', count: 12 },
        { area: 'Emergency Systems', riskLevel: 'Medium', count: 5 }
      ]
    };
  }
};