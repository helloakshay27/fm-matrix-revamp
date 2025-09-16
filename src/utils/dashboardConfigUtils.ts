/**
 * Utility functions and mappings for dashboard configuration
 */

// Mapping of section names to display names
export const SECTION_DISPLAY_NAMES: Record<string, string> = {
  tickets: 'Tickets',
  assets: 'Assets',
  tasks: 'Tasks',
  amc: 'AMC',
  meetingRoom: 'Meeting Room',
  communityPrograms: 'Community Programs',
  helpdeskManagement: 'Helpdesk Management',
  assetManagement: 'Asset Management',
  inventoryManagement: 'Inventory Management',
  consumablesOverview: 'Consumables Overview',
  parkingManagement: 'Parking Management',
  visitorManagement: 'Visitor Management',
  checklistManagement: 'Checklist Management',
};

// Mapping of item names to display names
export const ITEM_DISPLAY_NAMES: Record<string, string> = {
  // Tickets
  categoryWiseTickets: 'Category Wise Tickets',
  ticketStatusOverview: 'Ticket Status Overview',
  proactiveReactiveTickets: 'Proactive Reactive Tickets',
  ticketAgingMatrix: 'Ticket Aging Matrix',
  unitCategoryWise: 'Unit Category Wise',
  responseTatReport: 'Response TAT Report',
  resolutionTatReport: 'Resolution TAT Report',

  // Assets
  assetStatusDistribution: 'Asset Status Distribution',
  assetStatisticsOverview: 'Asset Statistics Overview',
  assetsGroupWise: 'Assets Group Wise',
  categoryWiseAssets: 'Category Wise Assets',
  assetDistributionItVsNonIt: 'Asset Distribution IT vs Non-IT',

  // Tasks
  technicalChecklist: 'Technical Checklist',
  nonTechnicalChecklist: 'Non-Technical Checklist',
  top10Checklist: 'Top 10 Checklist',
  siteWiseChecklist: 'Site Wise Checklist',

  // AMC
  statusOverview: 'Status Overview',
  typeDistribution: 'Type Distribution',
  unitResourceDistribution: 'Unit Resource Distribution',
  serviceStatistics: 'Service Statistics',
  expiryAnalysis: 'Expiry Analysis',
  coverageByLocation: 'Coverage By Location',

  // Meeting Room
  revenueGenerationOverview: 'Revenue Generation Overview',
  centerWisePerformanceOverview: 'Center Wise Performance Overview',
  centerWiseMeetingRoomUtilization: 'Center Wise Meeting Room Utilization',
  responseTatPerformanceQuarterly: 'Response TAT Performance Quarterly',
  resolutionTatPerformanceQuarterly: 'Resolution TAT Performance Quarterly',

  // Community Programs
  communityEngagementMetrics: 'Community Engagement Metrics',
  siteWiseAdoptionRate: 'Site Wise Adoption Rate',

  // Helpdesk Management
  snapshot: 'Snapshot',
  ticketAgeingClosureEfficiencyAndFeedbackByCenter: 'Ticket Ageing Closure Efficiency And Feedback By Center',
  ticketPerformanceMetricsByCategoryVolumeClosureRateAndAgeing: 'Ticket Performance Metrics By Category Volume Closure Rate And Ageing',
  customerExperienceFeedback: 'Customer Experience Feedback',
  sitePerformanceCustomerRatingOverview: 'Site Performance Customer Rating Overview',

  // Asset Management
  companyWiseAssetOverview: 'Company Wise Asset Overview',
  centerWiseAssetsAndDowntimeMetrics: 'Center Wise Assets And Downtime Metrics',
  assetsWithHighestMaintenanceSpend: 'Assets With Highest Maintenance Spend',
  amcContractSummary: 'AMC Contract Summary',
  amcContractSummaryExpiryIn90Days: 'AMC Contract Summary Expiry In 90 Days',
  amcContractSummaryExpired: 'AMC Contract Summary Expired',

  // Inventory Management
  overviewSummary: 'Overview Summary',
  overstockAnalysisTop10Items: 'Overstock Analysis Top 10 Items',

  // Consumables Overview
  topConsumablesCentreWiseOverview: 'Top Consumables Centre Wise Overview',
  consumableInventoryValueQuarterlyComparison: 'Consumable Inventory Value Quarterly Comparison',

  // Parking Management
  parkingAllocationOverviewPaidFreeAndVacant: 'Parking Allocation Overview Paid Free And Vacant',

  // Visitor Management
  visitorTrendAnalysis: 'Visitor Trend Analysis',

  // Checklist Management
  cmProgressQuarterly: 'Checklist Progress Quarterly',
  cmOverdueCenterwise: 'Overdue Checklists Center-wise',
};

/**
 * Get display name for a section
 */
export const getSectionDisplayName = (sectionName: string): string => {
  return SECTION_DISPLAY_NAMES[sectionName] || formatName(sectionName);
};

/**
 * Get display name for an item
 */
export const getItemDisplayName = (itemName: string): string => {
  return ITEM_DISPLAY_NAMES[itemName] || formatName(itemName);
};

/**
 * Format camelCase or snake_case names to Title Case
 */
export const formatName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, str => str.toUpperCase())
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
};

/**
 * Get section color for UI theming
 */
export const getSectionColor = (sectionName: string): string => {
  const colors: Record<string, string> = {
    tickets: 'bg-blue-50 border-blue-200 text-blue-900',
    assets: 'bg-green-50 border-green-200 text-green-900',
    tasks: 'bg-purple-50 border-purple-200 text-purple-900',
    amc: 'bg-orange-50 border-orange-200 text-orange-900',
    meetingRoom: 'bg-pink-50 border-pink-200 text-pink-900',
    communityPrograms: 'bg-indigo-50 border-indigo-200 text-indigo-900',
    helpdeskManagement: 'bg-red-50 border-red-200 text-red-900',
    assetManagement: 'bg-teal-50 border-teal-200 text-teal-900',
    inventoryManagement: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    consumablesOverview: 'bg-cyan-50 border-cyan-200 text-cyan-900',
    parkingManagement: 'bg-slate-50 border-slate-200 text-slate-900',
    visitorManagement: 'bg-violet-50 border-violet-200 text-violet-900',
    checklistManagement: 'bg-emerald-50 border-emerald-200 text-emerald-900',
  };
  
  return colors[sectionName] || 'bg-gray-50 border-gray-200 text-gray-900';
};

/**
 * Validate section name
 */
export const isValidSection = (sectionName: string): boolean => {
  return Object.keys(SECTION_DISPLAY_NAMES).includes(sectionName);
};

/**
 * Validate item name for a section
 */
export const isValidItem = (itemName: string): boolean => {
  return Object.keys(ITEM_DISPLAY_NAMES).includes(itemName);
};

/**
 * Get all available sections
 */
export const getAllSections = (): string[] => {
  return Object.keys(SECTION_DISPLAY_NAMES);
};

/**
 * Get items for a specific section (based on default configuration)
 */
export const getSectionItems = (sectionName: string): string[] => {
  const sectionItemsMap: Record<string, string[]> = {
    tickets: [
      'categoryWiseTickets',
      'ticketStatusOverview',
      'proactiveReactiveTickets',
      'ticketAgingMatrix',
      'unitCategoryWise',
      'responseTatReport',
      'resolutionTatReport'
    ],
    assets: [
      'assetStatusDistribution',
      'assetStatisticsOverview',
      'assetsGroupWise',
      'categoryWiseAssets',
      'assetDistributionItVsNonIt'
    ],
    tasks: [
      'technicalChecklist',
      'nonTechnicalChecklist',
      'top10Checklist',
      'siteWiseChecklist'
    ],
    amc: [
      'statusOverview',
      'typeDistribution',
      'unitResourceDistribution',
      'serviceStatistics',
      'expiryAnalysis',
      'coverageByLocation'
    ],
    meetingRoom: [
      'revenueGenerationOverview',
      'centerWisePerformanceOverview',
      'centerWiseMeetingRoomUtilization',
      'responseTatPerformanceQuarterly',
      'resolutionTatPerformanceQuarterly'
    ],
    communityPrograms: [
      'communityEngagementMetrics',
      'siteWiseAdoptionRate'
    ],
    helpdeskManagement: [
      'snapshot',
      'ticketAgeingClosureEfficiencyAndFeedbackByCenter',
      'ticketPerformanceMetricsByCategoryVolumeClosureRateAndAgeing',
      'customerExperienceFeedback',
      'sitePerformanceCustomerRatingOverview'
    ],
    assetManagement: [
      'companyWiseAssetOverview',
      'centerWiseAssetsAndDowntimeMetrics',
      'assetsWithHighestMaintenanceSpend',
      'amcContractSummary',
      'amcContractSummaryExpiryIn90Days',
      'amcContractSummaryExpired'
    ],
    inventoryManagement: [
      'overviewSummary',
      'overstockAnalysisTop10Items'
    ],
    consumablesOverview: [
      'topConsumablesCentreWiseOverview',
      'consumableInventoryValueQuarterlyComparison'
    ],
    parkingManagement: [
      'parkingAllocationOverviewPaidFreeAndVacant'
    ],
    visitorManagement: [
      'visitorTrendAnalysis'
    ],
    checklistManagement: [
      'cmProgressQuarterly',
      'cmOverdueCenterwise'
    ]
  };
  
  return sectionItemsMap[sectionName] || [];
};
