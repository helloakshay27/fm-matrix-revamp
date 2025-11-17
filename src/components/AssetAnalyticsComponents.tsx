import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, Calendar as CalendarIcon } from 'lucide-react';
import { AssetAnalyticsSelector } from '@/components/AssetAnalyticsSelector';
import { AssetStatisticsSelector } from '@/components/AssetStatisticsSelector';
import { AssetAnalyticsFilterDialog } from '@/components/AssetAnalyticsFilterDialog';
import { AssetAnalyticsCard } from '@/components/AssetAnalyticsCard';
import { assetAnalyticsAPI, AssetStatusData } from '@/services/assetAnalyticsAPI';
import { assetAnalyticsDownloadAPI } from '@/services/assetAnalyticsDownloadAPI';
import { toast } from 'sonner';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RecentAssetsSidebar } from './RecentAssetsSidebar';

// SectionLoader Component for individual card loading states
const SectionLoader: React.FC<{
  loading: boolean;
  children: React.ReactNode;
  className?: string;
}> = ({ loading, children, className }) => {
  return (
    <div className={`relative ${className ?? ""}`}>
      {children}
      {loading && (
        <div className="absolute inset-0 z-10 rounded-lg bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
        </div>
      )}
    </div>
  );
};

// Color palette with lighter shades
const CHART_COLORS = {
    primary: '#C4B99D',
    secondary: '#DAD6CA',
    tertiary: '#D5DBDB',
    primaryLight: '#DDD4C4',    // Lighter shade of primary
    secondaryLight: '#E8E5DD',  // Lighter shade of secondary
    tertiaryLight: '#E5E9E9',   // Lighter shade of tertiary
};

// Interfaces
interface AssetStatistics {
    total_assets?: {
        assets_total_count: number;
        assets_total_count_info: string;
    };
    assets_in_use?: {
        assets_in_use_total: number;
        assets_in_use_info: string;
    };
    assets_in_breakdown?: {
        assets_in_breakdown_total: number;
        assets_in_breakdown_info: string;
    };
    critical_assets_breakdown?: {
        critical_assets_breakdown_total: number;
        critical_assets_breakdown_info: string;
    };
    ppm_overdue_assets?: {
        ppm_conduct_assets_count: number;
        ppm_conduct_assets_info: string;
    };
    ppm_conduct_assets_count?: {
        ppm_conduct_assets_count: number;
        ppm_conduct_assets_info: string;
    };
    // Legacy support for old flat structure
    total_assets_count?: {
        info: string;
        total_assets_count: number;
    };
    total_value?: string;
    it_assets?: number;
    non_it_assets?: number;
    critical_assets?: number;
    ppm_assets?: number;
    average_rating?: number;
}

interface AssetDistributions {
    success?: number;
    message?: string;
    assets_statistics?: {
        assets_distribution?: {
            it_assets_count: number;
            non_it_assets_count: number;
        };
        filters?: {
            site_ids: number[];
            site_names: string[];
            from_date: string | null;
            to_date: string | null;
        };
    };
    // Legacy support for old structure
    info?: {
        info: string;
        total_it_assets: number;
        total_non_it_assets: number;
    };
    sites?: Array<{
        site_name: string;
        asset_count: number;
    }>;
}

interface GroupWiseAssets {
    assets_statistics?: {
        assets_group_count_by_name?: Array<{
            group_name: string;
            count: number;
        }>;
        filters?: {
            site_ids: number[];
            site_names: string[];
            from_date: string | null;
            to_date: string | null;
        };
    };
    // Legacy support for old structure
    info?: string;
    group_wise_assets?: Array<{
        group_name: string;
        asset_count: number;
    }>;
}

interface CategoryWiseAssets {
    assets_statistics?: {
        asset_categorywise?: Array<{
            category: string;
            count: number;
        }>;
        filters?: {
            site_ids: number[];
            site_names: string[];
            from_date: string | null;
            to_date: string | null;
        };
    };
    // Legacy support for old structure
    asset_type_category_counts?: {
        [key: string]: number;
    };
    info?: {
        description: string;
    };
    // Legacy support for categories array
    categories?: Array<{
        category_name: string;
        asset_count: number;
        percentage: number;
    }>;
}

interface AssetAnalyticsProps {
    defaultDateRange?: {
        fromDate: Date;
        toDate: Date;
    };
    selectedAnalyticsTypes?: string[];
    selectedEndpoint?: string; // For rendering a single specific card
    onAnalyticsChange?: (data: any) => void;
    showFilter?: boolean;
    showSelector?: boolean;
    showRecentAssets?: boolean;
    layout?: 'grid' | 'vertical' | 'horizontal';
    className?: string;
}

// Sortable Chart Item Component
const SortableChartItem = ({
    id,
    children,
}: {
    id: string;
    children: React.ReactNode;
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    // Handle pointer down to prevent drag on button/icon clicks
    const handlePointerDown = (e: React.PointerEvent) => {
        const target = e.target as HTMLElement;
        if (
            target.closest('button') ||
            target.closest('[data-download]') ||
            target.closest('svg') ||
            target.tagName === 'BUTTON' ||
            target.tagName === 'SVG' ||
            target.closest('.download-btn')
        ) {
            e.stopPropagation();
            return;
        }
        if (listeners?.onPointerDown) {
            listeners.onPointerDown(e);
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            onPointerDown={handlePointerDown}
            className="cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md"
        >
            {children}
        </div>
    );
};

export const AssetAnalyticsComponents: React.FC<AssetAnalyticsProps> = ({
    defaultDateRange,
    selectedAnalyticsTypes = ['assetStatistics', 'groupWise', 'categoryWise', 'statusDistribution', 'assetDistributions'],
    selectedEndpoint, // New prop for rendering single card
    onAnalyticsChange,
    showFilter = true,
    showSelector = true,
    showRecentAssets = true,
    layout = 'grid',
    className = '',
}) => {
    console.log('AssetAnalyticsComponents - Rendering with props:', {
        defaultDateRange,
        selectedEndpoint,
        showFilter,
        showSelector,
        layout
    });
    // Default date range (today to last year)
    const getDefaultDateRange = () => {
        const today = new Date();
        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);
        return { fromDate: lastYear, toDate: today };
    };

    // Format date for display (DD/MM/YYYY)
    const formatDateForDisplay = (date: Date | undefined) => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Get formatted date range for display
    const getFormattedDateRange = () => {
        if (!analyticsDateRange.fromDate || !analyticsDateRange.toDate) {
            return 'Select Date Range';
        }
        return `${formatDateForDisplay(analyticsDateRange.fromDate)} - ${formatDateForDisplay(analyticsDateRange.toDate)}`;
    };

    // State management
    const [analyticsDateRange, setAnalyticsDateRange] = useState(() => {
        const range = defaultDateRange || getDefaultDateRange();
        // Ensure we have valid Date objects
        return {
            fromDate: range.fromDate instanceof Date ? range.fromDate : new Date(range.fromDate),
            toDate: range.toDate instanceof Date ? range.toDate : new Date(range.toDate)
        };
    });
    const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
    const [currentSelectedTypes, setCurrentSelectedTypes] = useState<string[]>(selectedAnalyticsTypes);
    
    // Cache to prevent duplicate API calls
    const [apiCache, setApiCache] = useState<{
        [key: string]: { data: any; timestamp: number; loading: boolean }
    }>({});

    // Helper function to check cache and prevent duplicate calls
    const getCacheKey = (apiName: string) => {
        return `${apiName}_${analyticsDateRange.fromDate.toISOString()}_${analyticsDateRange.toDate.toISOString()}`;
    };

    const isCacheValid = (cacheKey: string) => {
        const cache = apiCache[cacheKey];
        if (!cache) return false;
        // Cache valid for 30 seconds
        return Date.now() - cache.timestamp < 30000;
    };

    const setCache = (cacheKey: string, data: any, loading: boolean) => {
        setApiCache(prev => ({
            ...prev,
            [cacheKey]: { data, timestamp: Date.now(), loading }
        }));
    };

    // Analytics data state
    const [assetStatistics, setAssetStatistics] = useState<AssetStatistics>({});
    const [assetStatus, setAssetStatus] = useState<AssetStatusData | null>(null);
    const [assetDistributions, setAssetDistributions] = useState<AssetDistributions | null>(null);
    const [groupWiseAssets, setGroupWiseAssets] = useState<GroupWiseAssets | null>(null);
    const [categoryWiseAssets, setCategoryWiseAssets] = useState<CategoryWiseAssets | null>(null);

    // Loading and error states
    const [statisticsLoading, setStatisticsLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [distributionsLoading, setDistributionsLoading] = useState(false);
    const [groupWiseLoading, setGroupWiseLoading] = useState(false);
    const [categoryWiseLoading, setCategoryWiseLoading] = useState(false);

    const [statisticsError, setStatisticsError] = useState<string | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [distributionsError, setDistributionsError] = useState<string | null>(null);
    const [groupWiseError, setGroupWiseError] = useState<string | null>(null);
    const [categoryWiseError, setCategoryWiseError] = useState<string | null>(null);

    // Chart ordering for drag and drop
    const [chartOrder, setChartOrder] = useState<string[]>([
        'assetStatistics',
        'statusDistribution',
        'assetDistributions',
        'categoryWise',
        'groupWise',
        'ppmConductAssets',
    ]);

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // API fetch functions
    const fetchAssetStatistics = async () => {
        const cacheKey = getCacheKey('assetStatistics');
        
        // Check if we have valid cached data
        if (isCacheValid(cacheKey)) {
            const cachedData = apiCache[cacheKey].data;
            setAssetStatistics(cachedData);
            return;
        }
        
        // Check if already loading
        if (apiCache[cacheKey]?.loading) {
            return;
        }
        
        setStatisticsLoading(true);
        setStatisticsError(null);
        setCache(cacheKey, null, true);
        
        try {
            const data = await assetAnalyticsAPI.getAssetStatistics(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
            
            console.log('AssetAnalyticsComponents - Asset statistics data received:', data);
            
            // Transform the API response to match the interface - same as AssetStatisticsSelector
            const transformedData: AssetStatistics = {
                ...data,
                // Keep the original structures for new API
                total_assets: data.total_assets,
                assets_in_use: data.assets_in_use,
                assets_in_breakdown: data.assets_in_breakdown,
                critical_assets_breakdown: data.critical_assets_breakdown,
                ppm_overdue_assets: data.ppm_overdue_assets,
                // Transform ppm_conduct_assets_count to match our interface
                ppm_conduct_assets_count: data.ppm_conduct_assets_count ? {
                    ppm_conduct_assets_count: (data.ppm_conduct_assets_count as { total?: number })?.total || 0,
                    ppm_conduct_assets_info: (data.ppm_conduct_assets_count as { info?: string })?.info || ''
                } : undefined,
                // Also map to old structure for compatibility
                total_assets_count: data.total_assets ? {
                    info: data.total_assets.assets_total_count_info || '',
                    total_assets_count: data.total_assets.assets_total_count || 0
                } : data.total_assets_count,
                // Add backward compatible flat properties
                ppm_assets: data.ppm_overdue_assets?.ppm_conduct_assets_count || 
                           (data.ppm_conduct_assets_count as { total?: number })?.total || 0,
            };
            
            console.log('AssetAnalyticsComponents - Transformed asset statistics:', transformedData);
            
            setAssetStatistics(transformedData);
            setCache(cacheKey, transformedData, false);
        } catch (error) {
            console.error('Error fetching asset statistics:', error);
            setStatisticsError(error instanceof Error ? error.message : 'Failed to fetch asset statistics');
            setCache(cacheKey, null, false);
        } finally {
            setStatisticsLoading(false);
        }
    };

    const fetchAssetStatus = async () => {
        const cacheKey = getCacheKey('assetStatus');
        
        console.log('AssetAnalyticsComponents - fetchAssetStatus called, cacheKey:', cacheKey);
        
        // Check if we have valid cached data
        if (isCacheValid(cacheKey)) {
            const cachedData = apiCache[cacheKey].data;
            console.log('AssetAnalyticsComponents - Using cached assetStatus data');
            setAssetStatus(cachedData);
            return;
        }
        
        // Check if already loading
        if (apiCache[cacheKey]?.loading) {
            console.log('AssetAnalyticsComponents - assetStatus already loading');
            return;
        }
        
        setStatusLoading(true);
        setStatusError(null);
        setCache(cacheKey, null, true);
        
        try {
            console.log('AssetAnalyticsComponents - Fetching asset status with dates:', {
                fromDate: analyticsDateRange.fromDate,
                toDate: analyticsDateRange.toDate
            });
            
            const data = await assetAnalyticsAPI.getAssetStatus(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
            
            console.log('AssetAnalyticsComponents - Asset status data received:', data);
            setAssetStatus(data);
            setCache(cacheKey, data, false);
        } catch (error) {
            console.error('Error fetching asset status:', error);
            setStatusError(error instanceof Error ? error.message : 'Failed to fetch asset status');
            setCache(cacheKey, null, false);
        } finally {
            setStatusLoading(false);
        }
    };

    const fetchAssetDistributions = async () => {
        const cacheKey = getCacheKey('assetDistributions');
        
        // Check if we have valid cached data
        if (isCacheValid(cacheKey)) {
            const cachedData = apiCache[cacheKey].data;
            setAssetDistributions(cachedData);
            return;
        }
        
        // Check if already loading
        if (apiCache[cacheKey]?.loading) {
            return;
        }
        
        setDistributionsLoading(true);
        setDistributionsError(null);
        setCache(cacheKey, null, true);
        
        try {
            const data = await assetAnalyticsAPI.getAssetDistribution(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
            console.log('Asset distributions data received:', data);
            setAssetDistributions(data);
            setCache(cacheKey, data, false);
        } catch (error) {
            console.error('Error fetching asset distributions:', error);
            setDistributionsError(error instanceof Error ? error.message : 'Failed to fetch asset distributions');
            setCache(cacheKey, null, false);
        } finally {
            setDistributionsLoading(false);
        }
    };

    const fetchGroupWiseAssets = async () => {
        const cacheKey = getCacheKey('groupWiseAssets');
        
        // Check if we have valid cached data
        if (isCacheValid(cacheKey)) {
            const cachedData = apiCache[cacheKey].data;
            setGroupWiseAssets(cachedData);
            return;
        }
        
        // Check if already loading
        if (apiCache[cacheKey]?.loading) {
            return;
        }
        
        setGroupWiseLoading(true);
        setGroupWiseError(null);
        setCache(cacheKey, null, true);
        
        try {
            const data = await assetAnalyticsAPI.getGroupWiseAssets(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
            console.log('Group-wise assets data received:', data);
            setGroupWiseAssets(data);
            setCache(cacheKey, data, false);
        } catch (error) {
            console.error('Error fetching group-wise assets:', error);
            setGroupWiseError(error instanceof Error ? error.message : 'Failed to fetch group-wise assets');
            setCache(cacheKey, null, false);
        } finally {
            setGroupWiseLoading(false);
        }
    };

    const fetchCategoryWiseAssets = async () => {
        const cacheKey = getCacheKey('categoryWiseAssets');
        
        // Check if we have valid cached data
        if (isCacheValid(cacheKey)) {
            const cachedData = apiCache[cacheKey].data;
            setCategoryWiseAssets(cachedData);
            return;
        }
        
        // Check if already loading
        if (apiCache[cacheKey]?.loading) {
            return;
        }
        
        setCategoryWiseLoading(true);
        setCategoryWiseError(null);
        setCache(cacheKey, null, true);
        
        try {
            const data = await assetAnalyticsAPI.getCategoryWiseAssets(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
            
            console.log('AssetAnalyticsComponents - Category-wise assets RAW API response:', data);
            console.log('AssetAnalyticsComponents - asset_categorywise:', data.assets_statistics?.asset_categorywise);
            
            // Support both new and legacy data structures
            let transformedData: CategoryWiseAssets = {
                info: { description: 'Category-wise asset distribution' },
            };
            
            if (data.assets_statistics?.asset_categorywise) {
                // New structure - use the data as-is
                transformedData = {
                    ...data,
                    info: { description: 'Category-wise asset distribution' }
                };
                console.log('AssetAnalyticsComponents - Using NEW structure for category-wise assets');
            } else if (data.categories) {
                // Legacy structure with categories array
                transformedData = {
                    ...data,
                    asset_type_category_counts: {},
                    info: { description: 'Category-wise asset distribution' },
                };
                data.categories.forEach(category => {
                    transformedData.asset_type_category_counts![category.category_name] = category.asset_count;
                });
                console.log('AssetAnalyticsComponents - Using LEGACY categories array structure');
            } else if (data.asset_type_category_counts) {
                // Legacy structure with asset_type_category_counts
                transformedData = {
                    ...data,
                    info: { description: 'Category-wise asset distribution' }
                };
                console.log('AssetAnalyticsComponents - Using LEGACY asset_type_category_counts structure');
            }
            
            console.log('AssetAnalyticsComponents - Transformed category-wise data:', transformedData);
            
            setCategoryWiseAssets(transformedData);
            setCache(cacheKey, transformedData, false);
        } catch (error) {
            console.error('Error fetching category-wise assets:', error);
            setCategoryWiseError(error instanceof Error ? error.message : 'Failed to fetch category-wise assets');
            setCache(cacheKey, null, false);
        } finally {
            setCategoryWiseLoading(false);
        }
    };

    // Event handlers
    const handleAnalyticsFilterApply = (startDateStr: string, endDateStr: string) => {
        const startDate = new Date(startDateStr);
        const endDate = new Date(endDateStr);
        setAnalyticsDateRange({ fromDate: startDate, toDate: endDate });
    };

    const handleAnalyticsSelectionChange = (selectedTypes: string[]) => {
        setCurrentSelectedTypes(selectedTypes);
    };

    const handleAnalyticsDownload = async (type: string) => {
        try {
            const fromDate = analyticsDateRange.fromDate;
            const toDate = analyticsDateRange.toDate;

            toast.info('Preparing download...');

            switch (type) {
                case 'groupWise':
                    await assetAnalyticsDownloadAPI.downloadGroupWiseAssetsData(fromDate, toDate);
                    toast.success('Group-wise assets data downloaded successfully!');
                    break;
                case 'categoryWise':
                    await assetAnalyticsDownloadAPI.downloadCategoryWiseAssetsData(fromDate, toDate);
                    toast.success('Category-wise assets data downloaded successfully!');
                    break;
                case 'assetDistribution':
                    await assetAnalyticsDownloadAPI.downloadAssetDistributionsData(fromDate, toDate);
                    toast.success('Asset distribution data downloaded successfully!');
                    break;
                case 'assetsInUse':
                    await assetAnalyticsDownloadAPI.downloadAssetsInUseData(fromDate, toDate);
                    toast.success('Assets in use data downloaded successfully!');
                    break;
                case 'ppmConductAssets':
                    await assetAnalyticsDownloadAPI.downloadCardPPMConductAssets(fromDate, toDate);
                    toast.success('PPM Conduct Assets data downloaded successfully!');
                    break;
                default:
                    console.warn('Unknown analytics download type:', type);
                    toast.error('Unknown analytics download type.');
            }
        } catch (error) {
            console.error('Error downloading analytics:', error);
            toast.error('Failed to download analytics data. Please try again.');
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setChartOrder((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    // Process chart data
    const processChartData = () => {
        // Debug logging
        console.log('AssetAnalyticsComponents - assetStatus:', assetStatus);
        console.log('AssetAnalyticsComponents - assetStatistics:', assetStatistics);
        
        // Status distribution data - use assetStatus API data if available, fallback to statistics
        const chartStatusData = [
            {
                name: 'In Use',
                value: assetStatus?.assets_in_use_total || 
                       assetStatistics?.assets_in_use?.assets_in_use_total || 0,
                color: CHART_COLORS.primary,
            },
            {
                name: 'Breakdown',
                value: assetStatus?.assets_in_breakdown_total || 
                       assetStatistics?.assets_in_breakdown?.assets_in_breakdown_total || 0,
                color: CHART_COLORS.secondary,
            },
            {
                name: 'In Store',
                value: assetStatus?.in_store || 0,
                color: CHART_COLORS.tertiary,
            },
            {
                name: 'In Disposed',
                value: assetStatus?.in_disposed || 0,
                color: CHART_COLORS.primaryLight,
            }
        ].filter(item => item.value > 0);
        
        console.log('AssetAnalyticsComponents - chartStatusData:', chartStatusData);

        // Asset type distribution data - support both new and legacy structures
        let itAssets = 0;
        let nonItAssets = 0;

        if (assetDistributions?.assets_statistics?.assets_distribution) {
            // New structure
            itAssets = assetDistributions.assets_statistics.assets_distribution.it_assets_count || 0;
            nonItAssets = assetDistributions.assets_statistics.assets_distribution.non_it_assets_count || 0;
        } else if (assetDistributions?.info) {
            // Legacy structure
            itAssets = assetDistributions.info.total_it_assets || 0;
            nonItAssets = assetDistributions.info.total_non_it_assets || 0;
        }

        const chartTypeData = (itAssets > 0 || nonItAssets > 0)
            ? [
                {
                    name: 'IT Equipment',
                    value: itAssets,
                    color: CHART_COLORS.primary,
                },
                {
                    name: 'Non-IT Equipment',
                    value: nonItAssets,
                    color: CHART_COLORS.secondary,
                },
            ]
            : [
                { name: 'No Data Available', value: 1, color: CHART_COLORS.tertiary },
            ];

        // If both values are 0, show a placeholder
        const totalDistributionValue = itAssets + nonItAssets;
        const finalChartTypeData = totalDistributionValue === 0
            ? [{ name: 'No Data Available', value: 1, color: CHART_COLORS.tertiary }]
            : chartTypeData;

        // Category data - support both new and legacy structures
        let categoryData: Array<{ name: string; value: number }> = [];
        
        console.log('AssetAnalyticsComponents - Processing categoryData from categoryWiseAssets:', categoryWiseAssets);
        
        if (categoryWiseAssets?.assets_statistics?.asset_categorywise) {
            // New structure
            console.log('AssetAnalyticsComponents - Found asset_categorywise array:', categoryWiseAssets.assets_statistics.asset_categorywise);
            categoryData = categoryWiseAssets.assets_statistics.asset_categorywise
                .filter((item) => {
                    console.log(`AssetAnalyticsComponents - Filtering category item:`, item, `count > 0:`, item.count > 0);
                    return item.count > 0;
                })
                .map((item) => {
                    const mapped = {
                        name: item.category,
                        value: item.count,
                    };
                    console.log(`AssetAnalyticsComponents - Mapped category item:`, mapped);
                    return mapped;
                });
        } else if (categoryWiseAssets?.categories) {
            // Legacy structure with categories array
            console.log('AssetAnalyticsComponents - Using categories array (legacy)');
            categoryData = categoryWiseAssets.categories
                .filter((item) => item.asset_count > 0)
                .map((item) => ({
                    name: item.category_name,
                    value: item.asset_count,
                }));
        } else if (categoryWiseAssets?.asset_type_category_counts) {
            // Legacy structure with asset_type_category_counts
            console.log('AssetAnalyticsComponents - Using asset_type_category_counts (legacy)');
            categoryData = Object.entries(categoryWiseAssets.asset_type_category_counts)
                .filter(([, value]) => (value as number) > 0)
                .map(([name, value]) => ({
                    name,
                    value: value as number,
                }));
        }

        console.log('AssetAnalyticsComponents - Final categoryData:', categoryData);
        console.log('AssetAnalyticsComponents - categoryData length:', categoryData.length);

        // Group data - support both new and legacy structures
        let groupData: Array<{ name: string; value: number }> = [];
        
        console.log('AssetAnalyticsComponents - Processing groupData from groupWiseAssets:', groupWiseAssets);
        
        if (groupWiseAssets?.assets_statistics?.assets_group_count_by_name) {
            // New structure
            console.log('AssetAnalyticsComponents - Found assets_group_count_by_name array:', groupWiseAssets.assets_statistics.assets_group_count_by_name);
            groupData = groupWiseAssets.assets_statistics.assets_group_count_by_name
                .filter((item) => {
                    console.log(`AssetAnalyticsComponents - Filtering group item:`, item, `count > 0:`, item.count > 0);
                    return item.count > 0;
                })
                .map((item) => {
                    const mapped = {
                        name: item.group_name,
                        value: item.count,
                    };
                    console.log(`AssetAnalyticsComponents - Mapped group item:`, mapped);
                    return mapped;
                });
        } else if (groupWiseAssets?.group_wise_assets) {
            // Legacy structure
            console.log('AssetAnalyticsComponents - Using group_wise_assets (legacy)');
            groupData = groupWiseAssets.group_wise_assets
                .filter((item) => item.asset_count > 0)
                .map((item) => ({
                    name: item.group_name,
                    value: item.asset_count,
                }));
        }

        console.log('AssetAnalyticsComponents - Final groupData:', groupData);
        console.log('AssetAnalyticsComponents - groupData length:', groupData.length);

        // PPM Conduct Assets data - create a simple bar chart data
        const ppmConductData = [
            {
                name: 'PPM Conduct Assets',
                value: assetStatistics?.ppm_overdue_assets?.ppm_conduct_assets_count || 
                       assetStatistics?.ppm_conduct_assets_count?.ppm_conduct_assets_count ||
                       assetStatistics?.ppm_assets || 0,
            }
        ];

        return { chartStatusData, chartTypeData: finalChartTypeData, categoryData, groupData, ppmConductData };
    };

    const { chartStatusData, chartTypeData, categoryData, groupData, ppmConductData } = processChartData();

    // Effect hooks - only fetch data when date range changes
    useEffect(() => {
        if (analyticsDateRange.fromDate && analyticsDateRange.toDate) {
            // If selectedEndpoint is provided (single card mode), only fetch needed data
            if (selectedEndpoint) {
                console.log('AssetAnalyticsComponents - Single endpoint mode, fetching:', selectedEndpoint);
                switch (selectedEndpoint) {
                    case 'asset_statistics':
                        fetchAssetStatistics();
                        break;
                    case 'asset_status':
                        fetchAssetStatus();
                        break;
                    case 'asset_distribution':
                        fetchAssetDistributions();
                        break;
                    case 'group_wise':
                        fetchGroupWiseAssets();
                        break;
                    case 'category_wise':
                        fetchCategoryWiseAssets();
                        break;
                    default:
                        fetchAssetStatistics();
                }
            } else {
                // Multi-card mode - fetch all data
                console.log('AssetAnalyticsComponents - Multi-card mode, fetching all data');
                fetchAssetStatistics();
                fetchAssetStatus();
                fetchAssetDistributions();
                fetchGroupWiseAssets();
                fetchCategoryWiseAssets();
            }
        }
    }, [analyticsDateRange.fromDate, analyticsDateRange.toDate, selectedEndpoint]);

    // Watch for prop changes to defaultDateRange
    useEffect(() => {
        if (defaultDateRange &&
            (defaultDateRange.fromDate !== analyticsDateRange.fromDate ||
                defaultDateRange.toDate !== analyticsDateRange.toDate)) {
            setAnalyticsDateRange(defaultDateRange);
        }
    }, [defaultDateRange]);

    useEffect(() => {
        if (onAnalyticsChange) {
            onAnalyticsChange({
                statistics: assetStatistics,
                status: assetStatus,
                distributions: assetDistributions,
                groupWise: groupWiseAssets,
                categoryWise: categoryWiseAssets,
                dateRange: analyticsDateRange,
            });
        }
    }, [assetStatistics, assetStatus, assetDistributions, groupWiseAssets, categoryWiseAssets, analyticsDateRange, onAnalyticsChange]);

    // Render error messages
    const renderErrorMessages = () => (
        <>
            {statisticsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Failed to load asset statistics: {statisticsError}</p>
                    <button
                        onClick={fetchAssetStatistics}
                        className="text-red-800 underline text-sm mt-1 hover:text-red-900"
                    >
                        Retry
                    </button>
                </div>
            )}
            {statusError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Failed to load asset status: {statusError}</p>
                    <button
                        onClick={fetchAssetStatus}
                        className="text-red-800 underline text-sm mt-1 hover:text-red-900"
                    >
                        Retry
                    </button>
                </div>
            )}
            {distributionsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Failed to load asset distributions: {distributionsError}</p>
                    <button
                        onClick={fetchAssetDistributions}
                        className="text-red-800 underline text-sm mt-1 hover:text-red-900"
                    >
                        Retry
                    </button>
                </div>
            )}
            {groupWiseError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Failed to load group-wise assets: {groupWiseError}</p>
                    <button
                        onClick={fetchGroupWiseAssets}
                        className="text-red-800 underline text-sm mt-1 hover:text-red-900"
                    >
                        Retry
                    </button>
                </div>
            )}
            {categoryWiseError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Failed to load category-wise assets: {categoryWiseError}</p>
                    <button
                        onClick={fetchCategoryWiseAssets}
                        className="text-red-800 underline text-sm mt-1 hover:text-red-900"
                    >
                        Retry
                    </button>
                </div>
            )}
        </>
    );

    // Render layout based on layout prop
    const renderLayout = () => {
        // If selectedEndpoint is provided, render only that specific card
        if (selectedEndpoint) {
            const endpointToTypeMap: Record<string, string> = {
                'asset_statistics': 'assetStatistics',
                'asset_status': 'statusDistribution',
                'group_wise': 'groupWise',
                'category_wise': 'categoryWise',
                'asset_distribution': 'assetDistributions',
            };

            const cardType = endpointToTypeMap[selectedEndpoint] || 'assetStatistics';

            // Render only the requested card type
            switch (cardType) {
                case 'assetStatistics':
                    return (
                        <div className="mb-6">
                            <AssetStatisticsSelector
                                dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                                onDownload={handleAnalyticsDownload}
                                layout="grid"
                            />
                        </div>
                    );
                case 'statusDistribution':
                    return (
                        <SectionLoader loading={statusLoading}>
                            <AssetAnalyticsCard
                                title="Asset Status"
                                type="statusDistribution"
                                data={chartStatusData}
                                dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                                onDownload={() => handleAnalyticsDownload('assetsInUse')}
                                info={assetStatus?.info || "Overall Distribution between in-use, breakdown, in-store, in-disposed assets"}
                            />
                        </SectionLoader>
                    );
                case 'categoryWise':
                    return (
                        <SectionLoader loading={categoryWiseLoading}>
                            <AssetAnalyticsCard
                                title="Category-wise Assets"
                                type="categoryWise"
                                data={categoryData}
                                dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                                onDownload={() => handleAnalyticsDownload('categoryWise')}
                                info={categoryWiseAssets?.assets_statistics?.filters ? 
                                    `Showing Assets Category-wise based on Site and date range for ${categoryWiseAssets.assets_statistics.filters.site_names?.join(', ') || 'selected sites'}` : 
                                    "Showing Assets Category-wise based on Site and date range"
                                }
                            />
                        </SectionLoader>
                    );
                case 'groupWise':
                    return (
                        <SectionLoader loading={groupWiseLoading}>
                            <AssetAnalyticsCard
                                title="Group-wise Assets"
                                type="groupWise"
                                data={groupData}
                                dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                                onDownload={() => handleAnalyticsDownload('groupWise')}
                                info={groupWiseAssets?.assets_statistics?.filters ? 
                                    `Showing Assets Group-wise based on site and date range for ${groupWiseAssets.assets_statistics.filters.site_names?.join(', ') || 'selected sites'}` : 
                                    "Showing Assets Group-wise based on site and date range"
                                }
                            />
                        </SectionLoader>
                    );
                case 'assetDistributions':
                    return (
                        <SectionLoader loading={distributionsLoading}>
                            <AssetAnalyticsCard
                                title="Asset Type Distribution"
                                type="assetDistributions"
                                data={chartTypeData}
                                dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                                onDownload={() => handleAnalyticsDownload('assetDistribution')}
                                info={assetDistributions?.assets_statistics?.filters ? 
                                    `Distribution between IT and Non-IT assets for ${assetDistributions.assets_statistics.filters.site_names?.join(', ') || 'selected sites'}` : 
                                    "Distribution between IT and Non-IT assets"
                                }
                            />
                        </SectionLoader>
                    );
                default:
                    return null;
            }
        }

        // Otherwise, render all cards as before (for cases where AssetAnalyticsComponents is used directly)
        // Always render each analytics card as a separate SortableChartItem
        const charts = [];

        charts.push(
            <SortableChartItem key="assetStatistics" id="assetStatistics">
                <div className="mb-6">
                    <AssetStatisticsSelector
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={handleAnalyticsDownload}
                        layout="grid"
                    />
                </div>
            </SortableChartItem>
        );
        charts.push(
            <SortableChartItem key="statusDistribution" id="statusDistribution">
                <SectionLoader loading={statusLoading}>
                    <AssetAnalyticsCard
                        title="Asset Status"
                        type="statusDistribution"
                        data={chartStatusData}
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={() => handleAnalyticsDownload('assetsInUse')}
                        info={assetStatus?.info || "Overall Distribution between in-use, breakdown, in-store, in-disposed assets"}
                    />
                </SectionLoader>
            </SortableChartItem>
        );
        charts.push(
            <SortableChartItem key="categoryWise" id="categoryWise">
                <SectionLoader loading={categoryWiseLoading}>
                    <AssetAnalyticsCard
                        title="Category-wise Assets"
                        type="categoryWise"
                        data={categoryData}
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={() => handleAnalyticsDownload('categoryWise')}
                        info={categoryWiseAssets?.assets_statistics?.filters ? 
                            `Showing Assets Category-wise based on Site and date range for ${categoryWiseAssets.assets_statistics.filters.site_names?.join(', ') || 'selected sites'}` : 
                            "Showing Assets Category-wise based on Site and date range"
                        }
                    />
                </SectionLoader>
            </SortableChartItem>
        );
        charts.push(
            <SortableChartItem key="groupWise" id="groupWise">
                <SectionLoader loading={groupWiseLoading}>
                    <AssetAnalyticsCard
                        title="Group-wise Assets"
                        type="groupWise"
                        data={groupData}
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={() => handleAnalyticsDownload('groupWise')}
                        info={groupWiseAssets?.assets_statistics?.filters ? 
                            `Showing Assets Group-wise based on site and date range for ${groupWiseAssets.assets_statistics.filters.site_names?.join(', ') || 'selected sites'}` : 
                            "Showing Assets Group-wise based on site and date range"
                        }
                    />
                </SectionLoader>
            </SortableChartItem>
        );
        if (currentSelectedTypes.includes('ppmConductAssets')) {
            charts.push(
                <SortableChartItem key="ppmConductAssets" id="ppmConductAssets">
                    <AssetAnalyticsCard
                        title="PPM Conduct Assets"
                        type="groupWise"
                        data={ppmConductData}
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={() => handleAnalyticsDownload('ppmConductAssets')}
                    />
                </SortableChartItem>
            );
        }

        if (layout === 'vertical') {
            return <div className="space-y-2">{charts}</div>;
        }

        if (layout === 'horizontal') {
            return <div className="flex flex-wrap gap-6">{charts}</div>;
        }

        // Default grid layout
        return (
            <div className="space-y-2">
                {charts}
            </div>
        );
    };

    return (
        <div>
            {/* Only show filter/selector if NOT rendering a single endpoint */}
            {!selectedEndpoint && (
                <div className='mb-4'>
                    {(showFilter || showSelector) && (
                        <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                            {showFilter && (
                                <Button
                                    onClick={() => setIsAnalyticsFilterOpen(true)}
                                    variant="outline"
                                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border-gray-300"
                                >
                                    <CalendarIcon className="w-4 h-4 text-gray-600" />
                                    <span className="text-sm font-medium text-gray-700">
                                        {getFormattedDateRange()}
                                    </span>
                                    <Filter className="w-4 h-4 text-gray-600" />
                                </Button>
                            )}

                            {showSelector && (
                                <AssetAnalyticsSelector
                                    onSelectionChange={handleAnalyticsSelectionChange}
                                    dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                                    selectedOptions={currentSelectedTypes}
                                />
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Render single card or all cards based on selectedEndpoint */}
            <div className={`${selectedEndpoint ? '' : 'space-y-6'} ${className}`}>
                {renderErrorMessages()}

                {/* Analytics Charts */}
                {selectedEndpoint ? (
                    // Single card mode - no drag and drop
                    renderLayout()
                ) : (
                    // Multiple cards mode - with drag and drop
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
                            {renderLayout()}
                        </SortableContext>
                    </DndContext>
                )}
            </div>
        </div>
    );
};

export default AssetAnalyticsComponents;
