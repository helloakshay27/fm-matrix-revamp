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

// Interfaces
interface AssetStatistics {
    total_assets?: {
        assets_total_count: number;
        assets_total_count_info: string;
    } | number; // Support both new object structure and legacy number
    total_value?: string;
    it_assets?: number;
    non_it_assets?: number;
    critical_assets?: number;
    ppm_assets?: number;
    assets_in_use?: number;
    assets_in_breakdown?: number;
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
    onAnalyticsChange?: (data: any) => void;
    showFilter?: boolean;
    showSelector?: boolean;
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
    onAnalyticsChange,
    showFilter = true,
    showSelector = true,
    layout = 'grid',
    className = '',
}) => {
    // Default date range (today to last year)
    const getDefaultDateRange = () => {
        const today = new Date();
        const lastYear = new Date();
        lastYear.setFullYear(today.getFullYear() - 1);
        return { fromDate: lastYear, toDate: today };
    };

    // Format date for display (DD/MM/YYYY)
    const formatDateForDisplay = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Get formatted date range for display
    const getFormattedDateRange = () => {
        return `${formatDateForDisplay(analyticsDateRange.fromDate)} - ${formatDateForDisplay(analyticsDateRange.toDate)}`;
    };

    // State management
    const [analyticsDateRange, setAnalyticsDateRange] = useState(
        defaultDateRange || getDefaultDateRange()
    );
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
            
            const transformedData = {
                total_assets: data.total_assets as any, // Handle both object and number types
                assets_in_use: data.assets_in_use?.assets_in_use_total || 0,
                assets_in_breakdown: data.assets_in_breakdown?.assets_in_breakdown_total || 0,
                critical_assets: data.critical_assets_breakdown?.critical_assets_breakdown_total || 0,
                ppm_assets: data.ppm_overdue_assets?.ppm_conduct_assets_count || 0,
                // average_rating: data.average_customer_rating?.avg_rating || 0,
            };
            
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
        
        // Check if we have valid cached data
        if (isCacheValid(cacheKey)) {
            const cachedData = apiCache[cacheKey].data;
            setAssetStatus(cachedData);
            return;
        }
        
        // Check if already loading
        if (apiCache[cacheKey]?.loading) {
            return;
        }
        
        setStatusLoading(true);
        setStatusError(null);
        setCache(cacheKey, null, true);
        
        try {
            const data = await assetAnalyticsAPI.getAssetStatus(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
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
            } else if (data.asset_type_category_counts) {
                // Legacy structure with asset_type_category_counts
                transformedData = {
                    ...data,
                    info: { description: 'Category-wise asset distribution' }
                };
            }
            
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
        // Status distribution data - use assetStatus API data if available, fallback to statistics
        const chartStatusData = [
            {
                name: 'In Use',
                value: assetStatus?.assets_in_use_total || assetStatistics.assets_in_use || 0,
                color: '#C4B99D',
            },
            {
                name: 'Breakdown',
                value: assetStatus?.assets_in_breakdown_total || assetStatistics.assets_in_breakdown || 0,
                color: '#DAD6CA',
            },
            {
                name: 'In Store',
                value: assetStatus?.in_store || 0,
                color: '#D5DBDB',
            },
        ];

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
                    color: '#C4B99D',
                },
                {
                    name: 'Non-IT Equipment',
                    value: nonItAssets,
                    color: '#DAD6CA',
                },
            ]
            : [
                { name: 'No Data Available', value: 1, color: '#D5DBDB' },
            ];

        // If both values are 0, show a placeholder
        const totalDistributionValue = itAssets + nonItAssets;
        const finalChartTypeData = totalDistributionValue === 0
            ? [{ name: 'No Data Available', value: 1, color: '#D5DBDB' }]
            : chartTypeData;

        // Category data - support both new and legacy structures
        let categoryData = [{ name: 'No Data', value: 0 }];
        
        if (categoryWiseAssets?.assets_statistics?.asset_categorywise) {
            // New structure
            categoryData = categoryWiseAssets.assets_statistics.asset_categorywise.map((item) => ({
                name: item.category,
                value: item.count,
            }));
        } else if (categoryWiseAssets?.categories) {
            // Legacy structure with categories array
            categoryData = categoryWiseAssets.categories.map((item) => ({
                name: item.category_name,
                value: item.asset_count,
            }));
        } else if (categoryWiseAssets?.asset_type_category_counts) {
            // Legacy structure with asset_type_category_counts
            categoryData = Object.entries(categoryWiseAssets.asset_type_category_counts).map(([name, value]) => ({
                name,
                value,
            }));
        }

        // Group data - support both new and legacy structures
        let groupData = [{ name: 'No Data', value: 0 }];
        
        if (groupWiseAssets?.assets_statistics?.assets_group_count_by_name) {
            // New structure
            groupData = groupWiseAssets.assets_statistics.assets_group_count_by_name.map((item) => ({
                name: item.group_name,
                value: item.count,
            }));
        } else if (groupWiseAssets?.group_wise_assets) {
            // Legacy structure
            groupData = groupWiseAssets.group_wise_assets.map((item) => ({
                name: item.group_name,
                value: item.asset_count,
            }));
        }

        // PPM Conduct Assets data - create a simple bar chart data
        const ppmConductData = [
            {
                name: 'PPM Conduct Assets',
                value: assetStatistics.ppm_assets || 0,
            }
        ];

        return { chartStatusData, chartTypeData: finalChartTypeData, categoryData, groupData, ppmConductData };
    };

    const { chartStatusData, chartTypeData, categoryData, groupData, ppmConductData } = processChartData();

    // Effect hooks - only fetch data when date range changes
    useEffect(() => {
        if (analyticsDateRange.fromDate && analyticsDateRange.toDate) {
            fetchAssetStatistics();
            fetchAssetStatus();
            fetchAssetDistributions();
            fetchGroupWiseAssets();
            fetchCategoryWiseAssets();
        }
    }, [analyticsDateRange.fromDate, analyticsDateRange.toDate]);

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
        const charts = [
            currentSelectedTypes.includes('assetStatistics') && (
                <SortableChartItem key="assetStatistics" id="assetStatistics">
                    <div className="mb-6">
                        <AssetStatisticsSelector
                            dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                            onDownload={handleAnalyticsDownload}
                            layout="grid"
                        />
                    </div>
                </SortableChartItem>
            ),
            currentSelectedTypes.includes('statusDistribution') && (
                <SortableChartItem key="statusDistribution" id="statusDistribution">
                    <AssetAnalyticsCard
                        title="Asset Status"
                        type="statusDistribution"
                        data={chartStatusData}
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={() => handleAnalyticsDownload('assetsInUse')}
                        info={assetStatus?.info || "Overall Distribution between in-use, breakdown, in-store, in-disposed assets"}
                    />
                </SortableChartItem>
            ),
            currentSelectedTypes.includes('assetDistributions') && (
                <SortableChartItem key="assetDistributions" id="assetDistributions">
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
                </SortableChartItem>
            ),
            currentSelectedTypes.includes('categoryWise') && (
                <SortableChartItem key="categoryWise" id="categoryWise">
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
                </SortableChartItem>
            ),
            currentSelectedTypes.includes('groupWise') && (
                <SortableChartItem key="groupWise" id="groupWise">
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
                </SortableChartItem>
            ),
            currentSelectedTypes.includes('ppmConductAssets') && (
                <SortableChartItem key="ppmConductAssets" id="ppmConductAssets">
                    <AssetAnalyticsCard
                        title="PPM Conduct Assets"
                        type="groupWise"
                        data={ppmConductData}
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={() => handleAnalyticsDownload('ppmConductAssets')}
                    />
                </SortableChartItem>
            ),
        ].filter(Boolean);

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



            <div className="grid grid-cols-1 xl:grid-cols-12 gap-2  min-h-[calc(100vh-200px)]">

                <div className="lg:col-span-8">
                    <div className={`space-y-6 ${className}`}>
                        {renderErrorMessages()}

                        {/* Header with Analytics Filter and Selector */}


                        {/* Analytics Charts */}
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
                                {renderLayout()}
                            </SortableContext>
                        </DndContext>

                        {/* Analytics Filter Dialog */}
                        <AssetAnalyticsFilterDialog
                            isOpen={isAnalyticsFilterOpen}
                            onClose={() => setIsAnalyticsFilterOpen(false)}
                            onApplyFilters={handleAnalyticsFilterApply}
                        />
                    </div>
                </div>

                {/* Right Sidebar - Recent Assets (1 column) */}
                <div className="lg:col-span-4">
                    <RecentAssetsSidebar />
                </div>

            </div>

        </div>


    );
};

export default AssetAnalyticsComponents;