import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
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
    total_assets?: number;
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
    info: string;
    group_wise_assets: {
        group_name: string;
        asset_count: number;
    }[];
}

interface CategoryWiseAssets {
    asset_type_category_counts: {
        [key: string]: number;
    };
    info: {
        description: string;
    };
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

    // State management
    const [analyticsDateRange, setAnalyticsDateRange] = useState(
        defaultDateRange || getDefaultDateRange()
    );
    const [isAnalyticsFilterOpen, setIsAnalyticsFilterOpen] = useState(false);
    const [currentSelectedTypes, setCurrentSelectedTypes] = useState<string[]>(selectedAnalyticsTypes);

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
        setStatisticsLoading(true);
        setStatisticsError(null);
        try {
            const data = await assetAnalyticsAPI.getAssetStatistics(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
            // Use the data directly from API without transformation
            setAssetStatistics({
                total_assets: data.total_assets_count?.total_assets_count || 0,
                assets_in_use: data.assets_in_use?.total_assets_in_use || 0,
                assets_in_breakdown: data.assets_in_breakdown?.total_assets_in_breakdown || 0,
                critical_assets: data.critical_assets_in_breakdown?.total_assets_in_breakdown || 0,
                ppm_assets: data.ppm_conduct_assets_count?.total || 0,
                average_rating: data.average_customer_rating?.avg_rating || 0,
            });
        } catch (error) {
            console.error('Error fetching asset statistics:', error);
            setStatisticsError(error instanceof Error ? error.message : 'Failed to fetch asset statistics');
        } finally {
            setStatisticsLoading(false);
        }
    };

    const fetchAssetStatus = async () => {
        setStatusLoading(true);
        setStatusError(null);
        try {
            const data = await assetAnalyticsAPI.getAssetStatus(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
            setAssetStatus(data);
        } catch (error) {
            console.error('Error fetching asset status:', error);
            setStatusError(error instanceof Error ? error.message : 'Failed to fetch asset status');
        } finally {
            setStatusLoading(false);
        }
    };

    const fetchAssetDistributions = async () => {
        setDistributionsLoading(true);
        setDistributionsError(null);
        try {
            const data = await assetAnalyticsAPI.getAssetDistribution(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
            console.log('Asset distributions data received:', data);
            setAssetDistributions(data);
        } catch (error) {
            console.error('Error fetching asset distributions:', error);
            setDistributionsError(error instanceof Error ? error.message : 'Failed to fetch asset distributions');
        } finally {
            setDistributionsLoading(false);
        }
    };

    const fetchGroupWiseAssets = async () => {
        setGroupWiseLoading(true);
        setGroupWiseError(null);
        try {
            const data = await assetAnalyticsAPI.getGroupWiseAssets(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
            setGroupWiseAssets(data);
        } catch (error) {
            console.error('Error fetching group-wise assets:', error);
            setGroupWiseError(error instanceof Error ? error.message : 'Failed to fetch group-wise assets');
        } finally {
            setGroupWiseLoading(false);
        }
    };

    const fetchCategoryWiseAssets = async () => {
        setCategoryWiseLoading(true);
        setCategoryWiseError(null);
        try {
            const data = await assetAnalyticsAPI.getCategoryWiseAssets(
                analyticsDateRange.fromDate,
                analyticsDateRange.toDate
            );
            const transformedData: CategoryWiseAssets = {
                asset_type_category_counts: {},
                info: { description: 'Category-wise asset distribution' },
            };
            if (data.categories) {
                data.categories.forEach(category => {
                    transformedData.asset_type_category_counts[category.category_name] = category.asset_count;
                });
            }
            setCategoryWiseAssets(transformedData);
        } catch (error) {
            console.error('Error fetching category-wise assets:', error);
            setCategoryWiseError(error instanceof Error ? error.message : 'Failed to fetch category-wise assets');
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
                value: assetStatus?.info?.total_assets_in_use || assetStatistics.assets_in_use || 0,
                color: '#c6b692',
            },
            {
                name: 'Breakdown',
                value: assetStatus?.info?.total_assets_in_breakdown || assetStatistics.assets_in_breakdown || 0,
                color: '#d8dcdd',
            },
        ];

        // Asset type distribution data
        const chartTypeData = assetDistributions?.info
            ? [
                {
                    name: 'IT Equipment',
                    value: assetDistributions.info.total_it_assets || 0,
                    color: '#d8dcdd',
                },
                {
                    name: 'Non-IT Equipment',
                    value: assetDistributions.info.total_non_it_assets || 0,
                    color: '#c6b692',
                },
            ]
            : [
                { name: 'No Data Available', value: 1, color: '#e5e7eb' },
            ];

        // If both values are 0, show a placeholder
        const totalDistributionValue = (assetDistributions?.info?.total_it_assets || 0) + (assetDistributions?.info?.total_non_it_assets || 0);
        const finalChartTypeData = totalDistributionValue === 0 
            ? [{ name: 'No Data Available', value: 1, color: '#e5e7eb' }]
            : chartTypeData;

        // Category data
        const categoryData = categoryWiseAssets?.asset_type_category_counts
            ? Object.entries(categoryWiseAssets.asset_type_category_counts).map(([name, value]) => ({
                name,
                value,
            }))
            : [{ name: 'No Data', value: 0 }];

        // Group data
        const groupData =
            groupWiseAssets?.group_wise_assets?.map((item) => ({
                name: item.group_name,
                value: item.asset_count,
            })) || [{ name: 'No Data', value: 0 }];

        return { chartStatusData, chartTypeData: finalChartTypeData, categoryData, groupData };
    };

    const { chartStatusData, chartTypeData, categoryData, groupData } = processChartData();

    // Effect hooks
    useEffect(() => {
        fetchAssetStatistics();
        fetchAssetStatus();
        fetchAssetDistributions();
        fetchGroupWiseAssets();
        fetchCategoryWiseAssets();
    }, []);

    // Watch for prop changes to defaultDateRange
    useEffect(() => {
        if (defaultDateRange &&
            (defaultDateRange.fromDate !== analyticsDateRange.fromDate ||
                defaultDateRange.toDate !== analyticsDateRange.toDate)) {
            setAnalyticsDateRange(defaultDateRange);
        }
    }, [defaultDateRange]);

    useEffect(() => {
        if (analyticsDateRange.fromDate && analyticsDateRange.toDate) {
            fetchAssetStatistics();
            fetchAssetStatus();
            fetchAssetDistributions();
            fetchGroupWiseAssets();
            fetchCategoryWiseAssets();
        }
    }, [analyticsDateRange]);

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
                    />
                </SortableChartItem>
            ),
        ].filter(Boolean);

        if (layout === 'vertical') {
            return <div className="space-y-6">{charts}</div>;
        }

        if (layout === 'horizontal') {
            return <div className="flex flex-wrap gap-6">{charts}</div>;
        }

        // Default grid layout
        return (
            <div className="space-y-6">
                {charts}
            </div>
        );
    };

    return (
        <div>

            <div>
                {(showFilter || showSelector) && (
                    <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4">
                        {showFilter && (
                            <Button
                                onClick={() => setIsAnalyticsFilterOpen(true)}
                                variant="outline"
                                className="flex items-center gap-2"
                            >
                                <Filter className="w-4 h-4" />
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


            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-4">

                <div className="lg:col-span-3">
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
                <div className="lg:col-span-1">
                    <RecentAssetsSidebar />
                </div>

            </div>

        </div>


    );
};

export default AssetAnalyticsComponents;
