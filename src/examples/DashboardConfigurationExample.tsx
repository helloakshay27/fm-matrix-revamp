// Example of how to use the dashboard configuration in components

import React from 'react';
import { useDashboardConfig } from '@/hooks/useDashboardConfig';

/**
 * Example component showing how to use dashboard configuration
 * to conditionally render analytics components
 */
export const DashboardWithConfiguration: React.FC = () => {
  const { config, isItemVisible } = useDashboardConfig();

  if (!config) {
    return <div>Loading configuration...</div>;
  }

  return (
    <div className="dashboard-grid">
      {/* Tickets Section */}
      {isItemVisible('tickets', 'categoryWiseTickets') && (
        <div>Category Wise Tickets Component</div>
      )}
      
      {isItemVisible('tickets', 'ticketStatusOverview') && (
        <div>Ticket Status Overview Component</div>
      )}
      
      {isItemVisible('tickets', 'proactiveReactiveTickets') && (
        <div>Proactive Reactive Tickets Component</div>
      )}
      
      {isItemVisible('tickets', 'ticketAgingMatrix') && (
        <div>Ticket Aging Matrix Component</div>
      )}
      
      {isItemVisible('tickets', 'unitCategoryWise') && (
        <div>Unit Category Wise Component</div>
      )}
      
      {isItemVisible('tickets', 'responseTatReport') && (
        <div>Response TAT Report Component</div>
      )}
      
      {isItemVisible('tickets', 'resolutionTatReport') && (
        <div>Resolution TAT Report Component</div>
      )}

      {/* Assets Section */}
      {isItemVisible('assets', 'assetStatusDistribution') && (
        <div>Asset Status Distribution Component</div>
      )}
      
      {isItemVisible('assets', 'assetStatisticsOverview') && (
        <div>Asset Statistics Overview Component</div>
      )}
      
      {isItemVisible('assets', 'assetsGroupWise') && (
        <div>Assets Group Wise Component</div>
      )}
      
      {isItemVisible('assets', 'categoryWiseAssets') && (
        <div>Category Wise Assets Component</div>
      )}
      
      {isItemVisible('assets', 'assetDistributionItVsNonIt') && (
        <div>Asset Distribution IT vs Non-IT Component</div>
      )}

      {/* Tasks Section */}
      {isItemVisible('tasks', 'technicalChecklist') && (
        <div>Technical Checklist Component</div>
      )}
      
      {isItemVisible('tasks', 'nonTechnicalChecklist') && (
        <div>Non-Technical Checklist Component</div>
      )}
      
      {isItemVisible('tasks', 'top10Checklist') && (
        <div>Top 10 Checklist Component</div>
      )}
      
      {isItemVisible('tasks', 'siteWiseChecklist') && (
        <div>Site Wise Checklist Component</div>
      )}

      {/* AMC Section */}
      {isItemVisible('amc', 'statusOverview') && (
        <div>AMC Status Overview Component</div>
      )}
      
      {isItemVisible('amc', 'typeDistribution') && (
        <div>AMC Type Distribution Component</div>
      )}
      
      {isItemVisible('amc', 'unitResourceDistribution') && (
        <div>AMC Unit Resource Distribution Component</div>
      )}
      
      {isItemVisible('amc', 'serviceStatistics') && (
        <div>AMC Service Statistics Component</div>
      )}
      
      {isItemVisible('amc', 'expiryAnalysis') && (
        <div>AMC Expiry Analysis Component</div>
      )}
      
      {isItemVisible('amc', 'coverageByLocation') && (
        <div>AMC Coverage By Location Component</div>
      )}

      {/* Meeting Room Section */}
      {isItemVisible('meetingRoom', 'revenueGenerationOverview') && (
        <div>Revenue Generation Overview Component</div>
      )}
      
      {isItemVisible('meetingRoom', 'centerWisePerformanceOverview') && (
        <div>Center Wise Performance Overview Component</div>
      )}
      
      {isItemVisible('meetingRoom', 'centerWiseMeetingRoomUtilization') && (
        <div>Center Wise Meeting Room Utilization Component</div>
      )}
      
      {isItemVisible('meetingRoom', 'responseTatPerformanceQuarterly') && (
        <div>Response TAT Performance Quarterly Component</div>
      )}
      
      {isItemVisible('meetingRoom', 'resolutionTatPerformanceQuarterly') && (
        <div>Resolution TAT Performance Quarterly Component</div>
      )}

      {/* Community Programs Section */}
      {isItemVisible('communityPrograms', 'communityEngagementMetrics') && (
        <div>Community Engagement Metrics Component</div>
      )}
      
      {isItemVisible('communityPrograms', 'siteWiseAdoptionRate') && (
        <div>Site Wise Adoption Rate Component</div>
      )}

      {/* Helpdesk Management Section */}
      {isItemVisible('helpdeskManagement', 'snapshot') && (
        <div>Helpdesk Snapshot Component</div>
      )}
      
      {isItemVisible('helpdeskManagement', 'ticketAgeingClosureEfficiencyAndFeedbackByCenter') && (
        <div>Ticket Ageing Closure Efficiency And Feedback By Center Component</div>
      )}
      
      {isItemVisible('helpdeskManagement', 'ticketPerformanceMetricsByCategoryVolumeClosureRateAndAgeing') && (
        <div>Ticket Performance Metrics By Category Volume Closure Rate And Ageing Component</div>
      )}
      
      {isItemVisible('helpdeskManagement', 'customerExperienceFeedback') && (
        <div>Customer Experience Feedback Component</div>
      )}
      
      {isItemVisible('helpdeskManagement', 'sitePerformanceCustomerRatingOverview') && (
        <div>Site Performance Customer Rating Overview Component</div>
      )}

      {/* Asset Management Section */}
      {isItemVisible('assetManagement', 'companyWiseAssetOverview') && (
        <div>Company Wise Asset Overview Component</div>
      )}
      
      {isItemVisible('assetManagement', 'centerWiseAssetsAndDowntimeMetrics') && (
        <div>Center Wise Assets And Downtime Metrics Component</div>
      )}
      
      {isItemVisible('assetManagement', 'assetsWithHighestMaintenanceSpend') && (
        <div>Assets With Highest Maintenance Spend Component</div>
      )}
      
      {isItemVisible('assetManagement', 'amcContractSummary') && (
        <div>AMC Contract Summary Component</div>
      )}
      
      {isItemVisible('assetManagement', 'amcContractSummaryExpiryIn90Days') && (
        <div>AMC Contract Summary Expiry In 90 Days Component</div>
      )}
      
      {isItemVisible('assetManagement', 'amcContractSummaryExpired') && (
        <div>AMC Contract Summary Expired Component</div>
      )}

      {/* Inventory Management Section */}
      {isItemVisible('inventoryManagement', 'overviewSummary') && (
        <div>Inventory Overview Summary Component</div>
      )}
      
      {isItemVisible('inventoryManagement', 'overstockAnalysisTop10Items') && (
        <div>Overstock Analysis Top 10 Items Component</div>
      )}

      {/* Consumables Overview Section */}
      {isItemVisible('consumablesOverview', 'topConsumablesCentreWiseOverview') && (
        <div>Top Consumables Centre Wise Overview Component</div>
      )}
      
      {isItemVisible('consumablesOverview', 'consumableInventoryValueQuarterlyComparison') && (
        <div>Consumable Inventory Value Quarterly Comparison Component</div>
      )}

      {/* Parking Management Section */}
      {isItemVisible('parkingManagement', 'parkingAllocationOverviewPaidFreeAndVacant') && (
        <div>Parking Allocation Overview Paid Free And Vacant Component</div>
      )}

      {/* Visitor Management Section */}
      {isItemVisible('visitorManagement', 'visitorTrendAnalysis') && (
        <div>Visitor Trend Analysis Component</div>
      )}
    </div>
  );
};

/**
 * Utility function to check if a section has any visible items
 */
export const useSectionVisibility = (sectionName: string) => {
  const { config } = useDashboardConfig();
  
  if (!config) return false;
  
  const section = config.sections.find(s => s.name === sectionName);
  if (!section) return false;
  
  return section.items.some(item => item.isVisible);
};

/**
 * Utility function to get all visible items for a section
 */
export const useVisibleSectionItems = (sectionName: string) => {
  const { getVisibleItemsForSection } = useDashboardConfig();
  return getVisibleItemsForSection(sectionName);
};
