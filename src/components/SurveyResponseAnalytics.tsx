import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { SurveyAnalyticsSelector } from '@/components/SurveyAnalyticsSelector';
import { SurveyStatisticsSelector } from '@/components/SurveyStatisticsSelector';
import { SurveyAnalyticsFilterDialog } from '@/components/SurveyAnalyticsFilterDialog';
import { SurveyAnalyticsCard } from '@/components/SurveyAnalyticsCard';
import { surveyAnalyticsAPI, SurveyStatusData } from '@/services/surveyAnalyticsAPI';
import { surveyAnalyticsDownloadAPI } from '@/services/surveyAnalyticsDownloadAPI';
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
import { RecentSurveysSidebar } from '@/components/RecentSurveysSidebar';

// Interfaces
interface SurveyStatistics {
    total_surveys?: number;
    total_responses?: number;
    completed_surveys?: number;
    pending_surveys?: number;
    active_surveys?: number;
    expired_surveys?: number;
    average_rating?: number;
    response_rate?: number;
}

interface SurveyDistributions {
    success?: number;
    message?: string;
    info?: {
        info: string;
        total_feedback_surveys: number;
        total_assessment_surveys: number;
    };
    sites?: Array<{
        site_name: string;
        survey_count: number;
    }>;
}

interface TypeWiseSurveys {
    info: string;
    type_wise_surveys: {
        survey_type: string;
        survey_count: number;
    }[];
}

interface CategoryWiseSurveys {
    survey_category_counts: {
        [key: string]: number;
    };
    info: {
        description: string;
    };
}

interface SurveyAnalyticsProps {
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

export const SurveyResponseAnalytics: React.FC<SurveyAnalyticsProps> = ({
    defaultDateRange,
    selectedAnalyticsTypes = ['typeWise', 'categoryWise', 'statusDistribution', 'surveyDistributions'],
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
    const [surveyStatistics, setSurveyStatistics] = useState<SurveyStatistics>({});
    const [surveyStatus, setSurveyStatus] = useState<SurveyStatusData | null>(null);
    const [surveyDistributions, setSurveyDistributions] = useState<SurveyDistributions | null>(null);
    const [typeWiseSurveys, setTypeWiseSurveys] = useState<TypeWiseSurveys | null>(null);
    const [categoryWiseSurveys, setCategoryWiseSurveys] = useState<CategoryWiseSurveys | null>(null);

    // Loading and error states
    const [statisticsLoading, setStatisticsLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [distributionsLoading, setDistributionsLoading] = useState(false);
    const [typeWiseLoading, setTypeWiseLoading] = useState(false);
    const [categoryWiseLoading, setCategoryWiseLoading] = useState(false);

    const [statisticsError, setStatisticsError] = useState<string | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);
    const [distributionsError, setDistributionsError] = useState<string | null>(null);
    const [typeWiseError, setTypeWiseError] = useState<string | null>(null);
    const [categoryWiseError, setCategoryWiseError] = useState<string | null>(null);

    // Chart ordering for drag and drop
    const [chartOrder, setChartOrder] = useState<string[]>([
        'statusDistribution',
        'surveyDistributions',
        'categoryWise',
        'typeWise',
    ]);

    // Drag and drop sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Mock API fetch functions (replace with actual API calls)
    const fetchSurveyStatistics = async () => {
        setStatisticsLoading(true);
        setStatisticsError(null);
        try {
            // Mock data - replace with actual API call
            const mockData = {
                total_surveys: 45,
                total_responses: 320,
                completed_surveys: 38,
                pending_surveys: 7,
                active_surveys: 25,
                expired_surveys: 13,
                average_rating: 4.2,
                response_rate: 78.5,
            };
            setSurveyStatistics(mockData);
        } catch (error) {
            console.error('Error fetching survey statistics:', error);
            setStatisticsError(error instanceof Error ? error.message : 'Failed to fetch survey statistics');
        } finally {
            setStatisticsLoading(false);
        }
    };

    const fetchSurveyStatus = async () => {
        setStatusLoading(true);
        setStatusError(null);
        try {
            // Mock data - replace with actual API call
            const mockData = {
                info: {
                    total_active_surveys: 25,
                    total_expired_surveys: 13,
                    total_pending_surveys: 7,
                }
            };
            setSurveyStatus(mockData);
        } catch (error) {
            console.error('Error fetching survey status:', error);
            setStatusError(error instanceof Error ? error.message : 'Failed to fetch survey status');
        } finally {
            setStatusLoading(false);
        }
    };

    const fetchSurveyDistributions = async () => {
        setDistributionsLoading(true);
        setDistributionsError(null);
        try {
            // Mock data - replace with actual API call
            const mockData = {
                success: 1,
                message: 'Success',
                info: {
                    info: 'Survey type distribution',
                    total_feedback_surveys: 28,
                    total_assessment_surveys: 17,
                },
                sites: [
                    { site_name: 'Main Office', survey_count: 15 },
                    { site_name: 'Branch A', survey_count: 12 },
                    { site_name: 'Branch B', survey_count: 18 },
                ]
            };
            setSurveyDistributions(mockData);
        } catch (error) {
            console.error('Error fetching survey distributions:', error);
            setDistributionsError(error instanceof Error ? error.message : 'Failed to fetch survey distributions');
        } finally {
            setDistributionsLoading(false);
        }
    };

    const fetchTypeWiseSurveys = async () => {
        setTypeWiseLoading(true);
        setTypeWiseError(null);
        try {
            // Mock data - replace with actual API call
            const mockData = {
                info: 'Type-wise survey distribution',
                type_wise_surveys: [
                    { survey_type: 'Customer Feedback', survey_count: 28 },
                    { survey_type: 'Employee Assessment', survey_count: 17 },
                    { survey_type: 'Product Review', survey_count: 12 },
                    { survey_type: 'Service Quality', survey_count: 8 },
                ]
            };
            setTypeWiseSurveys(mockData);
        } catch (error) {
            console.error('Error fetching type-wise surveys:', error);
            setTypeWiseError(error instanceof Error ? error.message : 'Failed to fetch type-wise surveys');
        } finally {
            setTypeWiseLoading(false);
        }
    };

    const fetchCategoryWiseSurveys = async () => {
        setCategoryWiseLoading(true);
        setCategoryWiseError(null);
        try {
            // Mock data - replace with actual API call
            const mockData = {
                survey_category_counts: {
                    'Satisfaction': 25,
                    'Quality': 18,
                    'Performance': 15,
                    'Feedback': 12,
                    'Assessment': 8,
                },
                info: { description: 'Category-wise survey distribution' },
            };
            setCategoryWiseSurveys(mockData);
        } catch (error) {
            console.error('Error fetching category-wise surveys:', error);
            setCategoryWiseError(error instanceof Error ? error.message : 'Failed to fetch category-wise surveys');
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
                case 'typeWise':
                    await surveyAnalyticsDownloadAPI.downloadTypeWiseSurveysData(fromDate, toDate);
                    toast.success('Type-wise surveys data downloaded successfully!');
                    break;
                case 'categoryWise':
                    await surveyAnalyticsDownloadAPI.downloadCategoryWiseSurveysData(fromDate, toDate);
                    toast.success('Category-wise surveys data downloaded successfully!');
                    break;
                case 'surveyDistribution':
                    await surveyAnalyticsDownloadAPI.downloadSurveyDistributionsData(fromDate, toDate);
                    toast.success('Survey distribution data downloaded successfully!');
                    break;
                case 'surveyResponses':
                    await surveyAnalyticsDownloadAPI.downloadSurveyResponsesData(fromDate, toDate);
                    toast.success('Survey responses data downloaded successfully!');
                    break;
                case 'statistics':
                    await surveyAnalyticsDownloadAPI.downloadSurveyStatisticsData(fromDate, toDate);
                    toast.success('Survey statistics data downloaded successfully!');
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
        // Status distribution data
        const chartStatusData = [
            {
                name: 'Active',
                value: surveyStatus?.info?.total_active_surveys || surveyStatistics.active_surveys || 0,
                color: '#c6b692',
            },
            {
                name: 'Expired',
                value: surveyStatus?.info?.total_expired_surveys || surveyStatistics.expired_surveys || 0,
                color: '#d8dcdd',
            },
            {
                name: 'Pending',
                value: surveyStatus?.info?.total_pending_surveys || surveyStatistics.pending_surveys || 0,
                color: '#C72030',
            },
        ];

        // Survey type distribution data
        const chartTypeData = surveyDistributions?.info
            ? [
                {
                    name: 'Feedback Surveys',
                    value: surveyDistributions.info.total_feedback_surveys || 0,
                    color: '#d8dcdd',
                },
                {
                    name: 'Assessment Surveys',
                    value: surveyDistributions.info.total_assessment_surveys || 0,
                    color: '#c6b692',
                },
            ]
            : [
                { name: 'No Data Available', value: 1, color: '#e5e7eb' },
            ];

        // If both values are 0, show a placeholder
        const totalDistributionValue = (surveyDistributions?.info?.total_feedback_surveys || 0) + (surveyDistributions?.info?.total_assessment_surveys || 0);
        const finalChartTypeData = totalDistributionValue === 0 
            ? [{ name: 'No Data Available', value: 1, color: '#e5e7eb' }]
            : chartTypeData;

        // Category data
        const categoryData = categoryWiseSurveys?.survey_category_counts
            ? Object.entries(categoryWiseSurveys.survey_category_counts).map(([name, value]) => ({
                name,
                value,
            }))
            : [{ name: 'No Data', value: 0 }];

        // Type data
        const typeData =
            typeWiseSurveys?.type_wise_surveys?.map((item) => ({
                name: item.survey_type,
                value: item.survey_count,
            })) || [{ name: 'No Data', value: 0 }];

        return { chartStatusData, chartTypeData: finalChartTypeData, categoryData, typeData };
    };

    const { chartStatusData, chartTypeData, categoryData, typeData } = processChartData();

    // Effect hooks
    useEffect(() => {
        fetchSurveyStatistics();
        fetchSurveyStatus();
        fetchSurveyDistributions();
        fetchTypeWiseSurveys();
        fetchCategoryWiseSurveys();
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
            fetchSurveyStatistics();
            fetchSurveyStatus();
            fetchSurveyDistributions();
            fetchTypeWiseSurveys();
            fetchCategoryWiseSurveys();
        }
    }, [analyticsDateRange]);

    useEffect(() => {
        if (onAnalyticsChange) {
            onAnalyticsChange({
                statistics: surveyStatistics,
                status: surveyStatus,
                distributions: surveyDistributions,
                typeWise: typeWiseSurveys,
                categoryWise: categoryWiseSurveys,
                dateRange: analyticsDateRange,
            });
        }
    }, [surveyStatistics, surveyStatus, surveyDistributions, typeWiseSurveys, categoryWiseSurveys, analyticsDateRange, onAnalyticsChange]);

    // Render error messages
    const renderErrorMessages = () => (
        <>
            {statisticsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Failed to load survey statistics: {statisticsError}</p>
                    <button
                        onClick={fetchSurveyStatistics}
                        className="text-red-800 underline text-sm mt-1 hover:text-red-900"
                    >
                        Retry
                    </button>
                </div>
            )}
            {statusError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Failed to load survey status: {statusError}</p>
                    <button
                        onClick={fetchSurveyStatus}
                        className="text-red-800 underline text-sm mt-1 hover:text-red-900"
                    >
                        Retry
                    </button>
                </div>
            )}
            {distributionsError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Failed to load survey distributions: {distributionsError}</p>
                    <button
                        onClick={fetchSurveyDistributions}
                        className="text-red-800 underline text-sm mt-1 hover:text-red-900"
                    >
                        Retry
                    </button>
                </div>
            )}
            {typeWiseError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Failed to load type-wise surveys: {typeWiseError}</p>
                    <button
                        onClick={fetchTypeWiseSurveys}
                        className="text-red-800 underline text-sm mt-1 hover:text-red-900"
                    >
                        Retry
                    </button>
                </div>
            )}
            {categoryWiseError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    <p className="text-sm">Failed to load category-wise surveys: {categoryWiseError}</p>
                    <button
                        onClick={fetchCategoryWiseSurveys}
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
            // Survey Statistics Card - Commented Out
            // currentSelectedTypes.includes('surveyStatistics') && (
            //     <SortableChartItem key="surveyStatistics" id="surveyStatistics">
            //         <div className="mb-6">
            //             <SurveyStatisticsSelector
            //                 dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
            //                 onDownload={handleAnalyticsDownload}
            //                 layout="grid"
            //             />
            //         </div>
            //     </SortableChartItem>
            // ),
            currentSelectedTypes.includes('statusDistribution') && (
                <SortableChartItem key="statusDistribution" id="statusDistribution">
                    <SurveyAnalyticsCard
                        title="Survey Status"
                        type="statusDistribution"
                        data={chartStatusData}
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={() => handleAnalyticsDownload('surveyResponses')}
                    />
                </SortableChartItem>
            ),
            currentSelectedTypes.includes('surveyDistributions') && (
                <SortableChartItem key="surveyDistributions" id="surveyDistributions">
                    <SurveyAnalyticsCard
                        title="Survey Type Distribution"
                        type="surveyDistributions"
                        data={chartTypeData}
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={() => handleAnalyticsDownload('surveyDistribution')}
                    />
                </SortableChartItem>
            ),
            currentSelectedTypes.includes('categoryWise') && (
                <SortableChartItem key="categoryWise" id="categoryWise">
                    <SurveyAnalyticsCard
                        title="Category-wise Surveys"
                        type="categoryWise"
                        data={categoryData}
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={() => handleAnalyticsDownload('categoryWise')}
                    />
                </SortableChartItem>
            ),
            currentSelectedTypes.includes('typeWise') && (
                <SortableChartItem key="typeWise" id="typeWise">
                    <SurveyAnalyticsCard
                        title="Type-wise Surveys"
                        type="typeWise"
                        data={typeData}
                        dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
                        onDownload={() => handleAnalyticsDownload('typeWise')}
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
                            <SurveyAnalyticsSelector
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

                        {/* Analytics Charts */}
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={chartOrder} strategy={rectSortingStrategy}>
                                {renderLayout()}
                            </SortableContext>
                        </DndContext>

                        {/* Analytics Filter Dialog */}
                        <SurveyAnalyticsFilterDialog
                            isOpen={isAnalyticsFilterOpen}
                            onClose={() => setIsAnalyticsFilterOpen(false)}
                            onApplyFilters={handleAnalyticsFilterApply}
                        />
                    </div>
                </div>

                {/* Right Sidebar - Recent Surveys (1 column) */}
                <div className="lg:col-span-1">
                    <RecentSurveysSidebar />
                </div>
            </div>
        </div>
    );
};

export default SurveyResponseAnalytics;
