import { apiClient } from '@/utils/apiClient';

export interface ConfigItem {
  name: string;
  isVisible: boolean;
}

export interface ConfigSection {
  name: string;
  items: ConfigItem[];
}

export interface DashboardConfigPayload {
  sections: ConfigSection[];
}

export interface DashboardConfigResponse {
  success: boolean;
  message: string;
  data?: DashboardConfigPayload;
}

class DashboardConfigService {
  // Get current dashboard configuration
  async getDashboardConfig(): Promise<DashboardConfigPayload> {
    try {
      const response = await apiClient.get<DashboardConfigResponse>('/dashboard/configuration');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Failed to fetch dashboard configuration');
    } catch (error) {
      console.error('Error fetching dashboard configuration:', error);
      // Return default configuration if API fails
      return this.getDefaultConfiguration();
    }
  }

  // Save dashboard configuration
  async saveDashboardConfig(config: DashboardConfigPayload): Promise<boolean> {
    try {
      const response = await apiClient.post<DashboardConfigResponse>('/dashboard/configuration', config);
      return response.data.success;
    } catch (error) {
      console.error('Error saving dashboard configuration:', error);
      return false;
    }
  }

  // Update specific section configuration
  async updateSectionConfig(sectionName: string, items: ConfigItem[]): Promise<boolean> {
    try {
      const response = await apiClient.patch<DashboardConfigResponse>(`/dashboard/configuration/section/${sectionName}`, {
        items
      });
      return response.data.success;
    } catch (error) {
      console.error('Error updating section configuration:', error);
      return false;
    }
  }

  // Reset configuration to defaults
  async resetToDefaultConfig(): Promise<DashboardConfigPayload> {
    try {
      const response = await apiClient.post<DashboardConfigResponse>('/dashboard/configuration/reset');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return this.getDefaultConfiguration();
    } catch (error) {
      console.error('Error resetting dashboard configuration:', error);
      return this.getDefaultConfiguration();
    }
  }

  // Get default configuration (fallback)
  getDefaultConfiguration(): DashboardConfigPayload {
    return {
      sections: [
        {
          name: "tickets",
          items: [
            { name: "categoryWiseTickets", isVisible: true },
            { name: "ticketStatusOverview", isVisible: true },
            { name: "proactiveReactiveTickets", isVisible: false },
            { name: "ticketAgingMatrix", isVisible: true },
            { name: "unitCategoryWise", isVisible: true },
            { name: "responseTatReport", isVisible: false },
            { name: "resolutionTatReport", isVisible: true }
          ]
        },
        {
          name: "assets",
          items: [
            { name: "assetStatusDistribution", isVisible: true },
            { name: "assetStatisticsOverview", isVisible: true },
            { name: "assetsGroupWise", isVisible: true },
            { name: "categoryWiseAssets", isVisible: false },
            { name: "assetDistributionItVsNonIt", isVisible: true }
          ]
        },
        {
          name: "tasks",
          items: [
            { name: "technicalChecklist", isVisible: true },
            { name: "nonTechnicalChecklist", isVisible: true },
            { name: "top10Checklist", isVisible: false },
            { name: "siteWiseChecklist", isVisible: true }
          ]
        },
        {
          name: "amc",
          items: [
            { name: "statusOverview", isVisible: true },
            { name: "typeDistribution", isVisible: true },
            { name: "unitResourceDistribution", isVisible: false },
            { name: "serviceStatistics", isVisible: true },
            { name: "expiryAnalysis", isVisible: true },
            { name: "coverageByLocation", isVisible: true }
          ]
        },
        {
          name: "meetingRoom",
          items: [
            { name: "revenueGenerationOverview", isVisible: true },
            { name: "centerWisePerformanceOverview", isVisible: true },
            { name: "centerWiseMeetingRoomUtilization", isVisible: true },
            { name: "responseTatPerformanceQuarterly", isVisible: false },
            { name: "resolutionTatPerformanceQuarterly", isVisible: true }
          ]
        },
        {
          name: "communityPrograms",
          items: [
            { name: "communityEngagementMetrics", isVisible: true },
            { name: "siteWiseAdoptionRate", isVisible: false }
          ]
        },
        {
          name: "helpdeskManagement",
          items: [
            { name: "snapshot", isVisible: true },
            { name: "ticketAgeingClosureEfficiencyAndFeedbackByCenter", isVisible: true },
            { name: "ticketPerformanceMetricsByCategoryVolumeClosureRateAndAgeing", isVisible: true },
            { name: "customerExperienceFeedback", isVisible: false },
            { name: "sitePerformanceCustomerRatingOverview", isVisible: true }
          ]
        },
        {
          name: "assetManagement",
          items: [
            { name: "companyWiseAssetOverview", isVisible: true },
            { name: "centerWiseAssetsAndDowntimeMetrics", isVisible: true },
            { name: "assetsWithHighestMaintenanceSpend", isVisible: false },
            { name: "amcContractSummary", isVisible: true },
            { name: "amcContractSummaryExpiryIn90Days", isVisible: true },
            { name: "amcContractSummaryExpired", isVisible: true }
          ]
        },
        {
          name: "inventoryManagement",
          items: [
            { name: "overviewSummary", isVisible: true },
            { name: "overstockAnalysisTop10Items", isVisible: true }
          ]
        },
        {
          name: "consumablesOverview",
          items: [
            { name: "topConsumablesCentreWiseOverview", isVisible: true },
            { name: "consumableInventoryValueQuarterlyComparison", isVisible: false }
          ]
        },
        {
          name: "parkingManagement",
          items: [
            { name: "parkingAllocationOverviewPaidFreeAndVacant", isVisible: true }
          ]
        },
        {
          name: "visitorManagement",
          items: [
            { name: "visitorTrendAnalysis", isVisible: true }
          ]
        }
      ]
    };
  }

  // Validate configuration structure
  validateConfiguration(config: DashboardConfigPayload): boolean {
    if (!config || !Array.isArray(config.sections)) {
      return false;
    }

    return config.sections.every(section => 
      section.name && 
      Array.isArray(section.items) && 
      section.items.every(item => 
        item.name && 
        typeof item.isVisible === 'boolean'
      )
    );
  }

  // Get configuration for specific sections
  getConfigForSections(config: DashboardConfigPayload, sectionNames: string[]): ConfigSection[] {
    return config.sections.filter(section => sectionNames.includes(section.name));
  }

  // Get visible items for a specific section
  getVisibleItemsForSection(config: DashboardConfigPayload, sectionName: string): ConfigItem[] {
    const section = config.sections.find(s => s.name === sectionName);
    return section ? section.items.filter(item => item.isVisible) : [];
  }

  // Export configuration as JSON
  exportConfiguration(config: DashboardConfigPayload): string {
    return JSON.stringify(config, null, 2);
  }

  // Import configuration from JSON
  importConfiguration(jsonString: string): DashboardConfigPayload | null {
    try {
      const config = JSON.parse(jsonString);
      if (this.validateConfiguration(config)) {
        return config;
      }
      return null;
    } catch (error) {
      console.error('Error importing configuration:', error);
      return null;
    }
  }
}

export const dashboardConfigService = new DashboardConfigService();
