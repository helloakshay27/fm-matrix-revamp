import { apiClient } from '@/utils/apiClient';
import { API_CONFIG } from '@/config/apiConfig';

// Types for AMC Analytics API responses
export interface AMCStatusData {
  active_amcs: number;
  inactive_amcs: number;
  total_count: number;
  critical_assets_under_amc: number;
  missing_amc: number;
  comprehensive_amcs: number;
  non_comprehensive_amcs: number;
}

export interface AMCStatisticsResponse {
  amcs_statistics: {
    amcs_stats: AMCStatusData;
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
}

// Extended types for component data
export interface AMCStatusSummary {
  totalAMCs: number;
  activeAMCs: number;
  inactiveAMCs: number;
  criticalAssetsUnderAMC: number;
  missingAMC: number;
  comprehensiveAMCs: number;
  nonComprehensiveAMCs: number;
}

export interface AMCTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface AMCBreakdownVsPreventiveResponse {
  amcs_statistics: {
    breakdown_vs_preventive_visits: {
      breakdown_count: number;
      preventive_count: number;
    };
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
}

export interface AMCUnitResourceWiseResponse {
  amcs_statistics: {
    amcs_unit_resource_wise: {
      service_count: number;
      asset_count: number;
    };
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
}

export interface AMCUnitResourceData {
  type: string;
  count: number;
  percentage: number;
}

export interface AMCExpiryStatsResponse {
  amcs_statistics: {
    amcs_expiry_stats: {
      expired_count: number;
      expiry_forecast: {
        days_30: number;
        days_60: number;
        days_90: number;
      };
    };
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
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

export interface AMCServiceTrackingLog {
  asset_amc_id: number;
  asset_amc_name: string;
  type: string;
  first_service_date: string | null;
  amc_start_date: string;
  amc_end_date: string;
  active: boolean;
  visit_id: number;
  visit_number: number;
  visit_date: string;
  technician_name: string;
}

export interface AMCServiceTrackingResponse {
  amcs_statistics: {
    service_tracking: {
      logs: AMCServiceTrackingLog[];
    };
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
}

export interface AMCServiceStatsResponse {
  amcs_statistics: {
    service_stats: {
      overall: {
        completed_services: number;
        pending_services: number;
        overdue_services: number;
      };
    };
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
}

export interface AMCServiceStatsData {
  type: string;
  count: number;
  percentage: number;
}

export interface AMCCoverageByLocationResponse {
  coverage_by_location: {
    [siteName: string]: {
      [buildingName: string]: {
        [wingName: string]: {
          [floorName: string]: {
            [areaName: string]: {
              [roomName: string]: {
                total: number;
                covered: number;
                percent: number;
              };
            };
          };
        };
      };
    };
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
}

export interface AMCLocationCoverageNode {
  name: string;
  level: 'site' | 'building' | 'wing' | 'floor' | 'area' | 'room';
  total: number;
  covered: number;
  percent: number;
  children?: AMCLocationCoverageNode[];
}

export interface AMCCoverageStats {
  totalAssets: number;
  coveredAssets: number;
  uncoveredAssets: number;
  overallCoveragePercent: number;
  locationCount: number;
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

// Coverage by Location types
export interface AMCCoverageStats {
  total: number;
  covered: number;
  percent: number;
}

export interface AMCCoverageSummary {
  totalAssets: number;
  coveredAssets: number;
  uncoveredAssets: number;
  overallCoveragePercent: number;
  locationCount: number;
}

export interface AMCCoverageRoom {
  [roomName: string]: AMCCoverageStats;
}

export interface AMCCoverageArea {
  [areaName: string]: AMCCoverageRoom;
}

export interface AMCCoverageFloor {
  [floorName: string]: AMCCoverageArea;
}

export interface AMCCoverageWing {
  [wingName: string]: AMCCoverageFloor;
}

export interface AMCCoverageBuilding {
  [buildingName: string]: AMCCoverageWing;
}

export interface AMCCoverageSite {
  [siteName: string]: AMCCoverageBuilding;
}

export interface AMCCoverageByLocationResponse {
  coverage_by_location: {
    [siteName: string]: {
      [buildingName: string]: {
        [wingName: string]: {
          [floorName: string]: {
            [areaName: string]: {
              [roomName: string]: {
                total: number;
                covered: number;
                percent: number;
              };
            };
          };
        };
      };
    };
  };
  filters: {
    site_ids: number[];
    site_names: string[];
    from_date: string;
    to_date: string;
  };
}

// Transformed data structure for component rendering
export interface AMCCoverageLocationNode {
  id: string;
  name: string;
  type: 'site' | 'building' | 'wing' | 'floor' | 'area' | 'room';
  total: number;
  covered: number;
  percent: number;
  children?: AMCCoverageLocationNode[];
  level: number;
  parentId?: string;
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
    
    const url = `/pms/asset_amcs/amc_statistics.json?site_id=${siteId}&amcs_stats=true&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get<AMCStatisticsResponse>(url);
    return response.data.amcs_statistics.amcs_stats;
  },

  // Transform AMC status data for the status card component
  async getAMCStatusSummary(fromDate: Date, toDate: Date): Promise<AMCStatusSummary> {
    const statusData = await this.getAMCStatusData(fromDate, toDate);
    // Transform the data to match component expectations
    return {
      totalAMCs: statusData.total_count,
      activeAMCs: statusData.active_amcs,
      inactiveAMCs: statusData.inactive_amcs,
      criticalAssetsUnderAMC: statusData.critical_assets_under_amc,
      missingAMC: statusData.missing_amc,
      comprehensiveAMCs: statusData.comprehensive_amcs,
      nonComprehensiveAMCs: statusData.non_comprehensive_amcs,
    };
  },

  // Get AMC type distribution data
  async getAMCTypeDistribution(fromDate: Date, toDate: Date): Promise<AMCTypeDistribution[]> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/asset_amcs/amc_statistics.json?site_id=${siteId}&breakdown_vs_preventive=true&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get<AMCBreakdownVsPreventiveResponse>(url);
    const data = response.data.amcs_statistics.breakdown_vs_preventive_visits;
    
    const totalCount = data.breakdown_count + data.preventive_count;
    
    if (totalCount === 0) {
      return [
        { type: 'Breakdown', count: 0, percentage: 0 },
        { type: 'Preventive', count: 0, percentage: 0 }
      ];
    }
    
    const breakdownPercentage = Math.round((data.breakdown_count / totalCount) * 100 * 10) / 10;
    const preventivePercentage = Math.round((data.preventive_count / totalCount) * 100 * 10) / 10;
    
    return [
      { type: 'Breakdown', count: data.breakdown_count, percentage: breakdownPercentage },
      { type: 'Preventive', count: data.preventive_count, percentage: preventivePercentage }
    ];
  },

  // Get expiry analysis data
  async getAMCExpiryAnalysis(fromDate: Date, toDate: Date): Promise<AMCExpiryAnalysis[]> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/asset_amcs/amc_statistics.json?site_id=${siteId}&amcs_expiry_stats=true&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get<AMCExpiryStatsResponse>(url);
    const data = response.data.amcs_statistics.amcs_expiry_stats;
    
    return [
      { period: 'Expired', expiringCount: 0, expiredCount: data.expired_count },
      { period: 'Next 30 Days', expiringCount: data.expiry_forecast.days_30, expiredCount: 0 },
      { period: 'Next 60 Days', expiringCount: data.expiry_forecast.days_60, expiredCount: 0 },
      { period: 'Next 90 Days', expiringCount: data.expiry_forecast.days_90, expiredCount: 0 }
    ];
  },

  // Get service tracking data
  async getServiceTrackingData(fromDate: Date, toDate: Date): Promise<AMCServiceTrackingResponse> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/asset_amcs/amc_statistics.json?site_id=${siteId}&service_tracking=true&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get<AMCServiceTrackingResponse>(url);
    return response.data;
  },

  // Transform service tracking data for the component
  async getAMCServiceTracking(fromDate: Date, toDate: Date): Promise<AMCServiceTrackingLog[]> {
    const serviceData = await this.getServiceTrackingData(fromDate, toDate);
    return serviceData.amcs_statistics.service_tracking.logs;
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
  },

  // Get AMC unit resource wise data
  async getAMCUnitResourceWise(fromDate: Date, toDate: Date): Promise<AMCUnitResourceData[]> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/asset_amcs/amc_statistics.json?site_id=${siteId}&amcs_unit_resource_wise=true&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get<AMCUnitResourceWiseResponse>(url);
    const data = response.data.amcs_statistics.amcs_unit_resource_wise;
    
    const totalCount = data.service_count + data.asset_count;
    
    if (totalCount === 0) {
      return [
        { type: 'Services', count: 0, percentage: 0 },
        { type: 'Assets', count: 0, percentage: 0 }
      ];
    }
    
    const servicePercentage = Math.round((data.service_count / totalCount) * 100 * 10) / 10;
    const assetPercentage = Math.round((data.asset_count / totalCount) * 100 * 10) / 10;
    
    return [
      { type: 'Services', count: data.service_count, percentage: servicePercentage },
      { type: 'Assets', count: data.asset_count, percentage: assetPercentage }
    ];
  },

  // Get AMC service stats data
  async getAMCServiceStats(fromDate: Date, toDate: Date): Promise<AMCServiceStatsData[]> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/asset_amcs/amc_statistics.json?site_id=${siteId}&service_stats=true&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get<AMCServiceStatsResponse>(url);
    const data = response.data.amcs_statistics.service_stats.overall;
    
    const totalServices = data.completed_services + data.pending_services + data.overdue_services;
    
    if (totalServices === 0) {
      return [
        { type: 'Completed', count: 0, percentage: 0 },
        { type: 'Pending', count: 0, percentage: 0 },
        { type: 'Overdue', count: 0, percentage: 0 }
      ];
    }
    
    const completedPercentage = Math.round((data.completed_services / totalServices) * 100 * 10) / 10;
    const pendingPercentage = Math.round((data.pending_services / totalServices) * 100 * 10) / 10;
    const overduePercentage = Math.round((data.overdue_services / totalServices) * 100 * 10) / 10;
    
    return [
      { type: 'Completed', count: data.completed_services, percentage: completedPercentage },
      { type: 'Pending', count: data.pending_services, percentage: pendingPercentage },
      { type: 'Overdue', count: data.overdue_services, percentage: overduePercentage }
    ];
  },

  // Get AMC coverage by location data
  async getAMCCoverageByLocation(fromDate: Date, toDate: Date): Promise<AMCLocationCoverageNode[]> {
    const siteId = getCurrentSiteId();
    const fromDateStr = formatDateForAPI(fromDate);
    const toDateStr = formatDateForAPI(toDate);
    
    const url = `/pms/asset_amcs/amc_statistics.json?site_id=${siteId}&coverage_by_location=true&from_date=${fromDateStr}&to_date=${toDateStr}&access_token=${API_CONFIG.TOKEN}`;
    
    const response = await apiClient.get<AMCCoverageByLocationResponse>(url);
    return this.transformCoverageData(response.data.coverage_by_location);
  },

  // Transform nested coverage data into a flat tree structure
  transformCoverageData(coverageData: AMCCoverageByLocationResponse['coverage_by_location']): AMCLocationCoverageNode[] {
    const result: AMCLocationCoverageNode[] = [];

    Object.entries(coverageData).forEach(([siteName, siteData]) => {
      const siteNode: AMCLocationCoverageNode = {
        name: siteName,
        level: 'site',
        total: 0,
        covered: 0,
        percent: 0,
        children: []
      };

      Object.entries(siteData).forEach(([buildingName, buildingData]) => {
        const buildingNode: AMCLocationCoverageNode = {
          name: buildingName,
          level: 'building',
          total: 0,
          covered: 0,
          percent: 0,
          children: []
        };

        Object.entries(buildingData).forEach(([wingName, wingData]) => {
          const wingNode: AMCLocationCoverageNode = {
            name: wingName,
            level: 'wing',
            total: 0,
            covered: 0,
            percent: 0,
            children: []
          };

          Object.entries(wingData).forEach(([floorName, floorData]) => {
            const floorNode: AMCLocationCoverageNode = {
              name: floorName,
              level: 'floor',
              total: 0,
              covered: 0,
              percent: 0,
              children: []
            };

            Object.entries(floorData).forEach(([areaName, areaData]) => {
              const areaNode: AMCLocationCoverageNode = {
                name: areaName,
                level: 'area',
                total: 0,
                covered: 0,
                percent: 0,
                children: []
              };

              Object.entries(areaData).forEach(([roomName, roomData]) => {
                const roomNode: AMCLocationCoverageNode = {
                  name: roomName,
                  level: 'room',
                  total: roomData.total,
                  covered: roomData.covered,
                  percent: roomData.percent
                };

                areaNode.children!.push(roomNode);
                areaNode.total += roomData.total;
                areaNode.covered += roomData.covered;
              });

              areaNode.percent = areaNode.total > 0 ? Math.round((areaNode.covered / areaNode.total) * 100 * 10) / 10 : 0;
              floorNode.children!.push(areaNode);
              floorNode.total += areaNode.total;
              floorNode.covered += areaNode.covered;
            });

            floorNode.percent = floorNode.total > 0 ? Math.round((floorNode.covered / floorNode.total) * 100 * 10) / 10 : 0;
            wingNode.children!.push(floorNode);
            wingNode.total += floorNode.total;
            wingNode.covered += floorNode.covered;
          });

          wingNode.percent = wingNode.total > 0 ? Math.round((wingNode.covered / wingNode.total) * 100 * 10) / 10 : 0;
          buildingNode.children!.push(wingNode);
          buildingNode.total += wingNode.total;
          buildingNode.covered += wingNode.covered;
        });

        buildingNode.percent = buildingNode.total > 0 ? Math.round((buildingNode.covered / buildingNode.total) * 100 * 10) / 10 : 0;
        siteNode.children!.push(buildingNode);
        siteNode.total += buildingNode.total;
        siteNode.covered += buildingNode.covered;
      });

      siteNode.percent = siteNode.total > 0 ? Math.round((siteNode.covered / siteNode.total) * 100 * 10) / 10 : 0;
      result.push(siteNode);
    });

    return result;
  },

  // Get coverage statistics summary
  async getAMCCoverageStats(fromDate: Date, toDate: Date): Promise<AMCCoverageSummary> {
    const coverageData = await this.getAMCCoverageByLocation(fromDate, toDate);
    
    let totalAssets = 0;
    let coveredAssets = 0;
    let locationCount = 0;

    const countLocations = (nodes: AMCLocationCoverageNode[]) => {
      nodes.forEach(node => {
        totalAssets += node.total;
        coveredAssets += node.covered;
        locationCount++;
        if (node.children) {
          countLocations(node.children);
        }
      });
    };

    countLocations(coverageData);

    return {
      totalAssets,
      coveredAssets,
      uncoveredAssets: totalAssets - coveredAssets,
      overallCoveragePercent: totalAssets > 0 ? Math.round((coveredAssets / totalAssets) * 100 * 10) / 10 : 0,
      locationCount
    };
  },
};