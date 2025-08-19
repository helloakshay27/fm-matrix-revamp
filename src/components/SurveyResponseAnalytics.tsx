// ...existing code...
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

import { API_CONFIG, getFullUrl, getAuthenticatedFetchOptions } from '@/config/apiConfig';
import TrendingSurveyAnalysisCard from './TrendingSurveyAnalysisCard';
import CriticalSurveyAnalysisCard from './CriticalSurveyAnalysisCard';

interface SurveyAnalyticsProps {
    surveyId: number;
    siteId?: number;
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
    surveyId,
    siteId,
    defaultDateRange,
    selectedAnalyticsTypes = ['amcStatus', 'statusDistribution', 'typeWise', 'categoryWise', 'surveyDistributions'],
    onAnalyticsChange,
    showFilter = true,
    showSelector = true,
    layout = 'grid',
    className = '',
}) => {
    // Critical Questions state - changed to handle multiple questions
    const [criticalQuestions, setCriticalQuestions] = useState<any[]>([]);
    const [criticalQuestionsLoading, setCriticalQuestionsLoading] = useState(false);
    const [criticalQuestionsError, setCriticalQuestionsError] = useState<string | null>(null);

    // Fetch critical questions for all surveys
    const fetchCriticalQuestions = async () => {
        setCriticalQuestionsLoading(true);
        setCriticalQuestionsError(null);
        try {
            const url = getFullUrl('/pms/admin/snag_checklists/survey_details.json');
            const urlWithParams = new URL(url);
            urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
            urlWithParams.searchParams.append('survey_id', ''); // Empty to get all surveys
            urlWithParams.searchParams.append('analytics', 'true');
            urlWithParams.searchParams.append('survey_critical_questions', 'true');
            // Don't pass any date parameters - show blank
            urlWithParams.searchParams.append('from_date', '');
            urlWithParams.searchParams.append('to_date', '');
            
            const response = await fetch(urlWithParams.toString());
            if (!response.ok) throw new Error('Failed to fetch critical questions');
            const data = await response.json();
            console.log('Critical Questions API response:', data);
            
            // Handle the API response structure
            // If survey_critical_questions is empty but we have survey data, use the surveys as critical surveys
            if (data.survey_critical_questions && Array.isArray(data.survey_critical_questions) && data.survey_critical_questions.length > 0) {
                setCriticalQuestions(data.survey_critical_questions);
            } else if (data.survey_details && data.survey_details.surveys && Array.isArray(data.survey_details.surveys)) {
                // Transform survey data into critical question format
                const surveyBasedCriticalQuestions = data.survey_details.surveys
                    .filter((survey: any) => survey.response_count > 0) // Only show surveys with responses
                    .map((survey: any) => ({
                        survey_id: survey.survey_id,
                        survey_name: survey.survey_name,
                        response_count: survey.response_count,
                        option_selection_count: survey.option_selection_count,
                        question: `Critical analysis needed for survey: ${survey.survey_name}`,
                        critical_score: survey.response_count // Use response count as critical score
                    }));
                setCriticalQuestions(surveyBasedCriticalQuestions);
            } else {
                setCriticalQuestions([]);
            }
        } catch (error) {
            setCriticalQuestionsError(error instanceof Error ? error.message : 'Failed to fetch critical questions');
            setCriticalQuestions([]);
        } finally {
            setCriticalQuestionsLoading(false);
        }
    };
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
    const [companyLevelValue, setCompanyLevelValue] = useState<number | null>(null);
    const [companyLevelLoading, setCompanyLevelLoading] = useState(false);
    const [companyLevelError, setCompanyLevelError] = useState<string | null>(null);
    // Site Level state
    // Trending Survey state
    const [trendingSurvey, setTrendingSurvey] = useState<any>(null);
    const [trendingSurveyDetails, setTrendingSurveyDetails] = useState<any[]>([]);
    const [trendingSurveyLoading, setTrendingSurveyLoading] = useState(false);
    const [trendingSurveyError, setTrendingSurveyError] = useState<string | null>(null);

    // Fetch trending survey
    const fetchTrendingSurvey = async () => {
        setTrendingSurveyLoading(true);
        setTrendingSurveyError(null);
        try {
            const url = getFullUrl('/pms/admin/snag_checklists/survey_details.json');
            const urlWithParams = new URL(url);
            urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
            urlWithParams.searchParams.append('survey_id', surveyId ? String(surveyId) : '');
            urlWithParams.searchParams.append('analytics', 'true');
            urlWithParams.searchParams.append('trend_survey', 'true');
            
            // Always pass empty values for from_date and to_date to get all records
            urlWithParams.searchParams.append('from_date', '');
            urlWithParams.searchParams.append('to_date', '');
            
            const response = await fetch(urlWithParams.toString());
            if (!response.ok) throw new Error('Failed to fetch trending survey');
            const data = await response.json();
            console.log('Trending Survey API response:', data);
            setTrendingSurvey(data.trend_survey || null);
            setTrendingSurveyDetails(data.survey_details?.surveys || []);
        } catch (error) {
            setTrendingSurveyError(error instanceof Error ? error.message : 'Failed to fetch trending survey');
            setTrendingSurvey(null);
            setTrendingSurveyDetails([]);
        } finally {
            setTrendingSurveyLoading(false);
        }
    };
    const [siteLevelValue, setSiteLevelValue] = useState<number | null>(null);
    const [siteLevelLoading, setSiteLevelLoading] = useState(false);
    const [siteLevelError, setSiteLevelError] = useState<string | null>(null);
    // Fetch site level data
    const fetchSiteLevel = async () => {
        setSiteLevelLoading(true);
        setSiteLevelError(null);
        try {
            const url = getFullUrl('/pms/admin/snag_checklists/survey_details.json');
            const urlWithParams = new URL(url);
            urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
            if (siteId) urlWithParams.searchParams.append('site_id', String(siteId));
            urlWithParams.searchParams.append('analytics', 'true');
            urlWithParams.searchParams.append('site_level', 'true');
            // Always pass empty values for from_date and to_date to get all records
            urlWithParams.searchParams.append('from_date', '');
            urlWithParams.searchParams.append('to_date', '');
            
            const response = await fetch(urlWithParams.toString());
            if (!response.ok) throw new Error('Failed to fetch site level data');
            const data = await response.json();
            console.log('Site Level API response:', data);
            setSiteLevelValue(data.site_level_survey?.total_survey ?? 0);
        } catch (error) {
            setSiteLevelError(error instanceof Error ? error.message : 'Failed to fetch site level data');
            setSiteLevelValue(0);
        } finally {
            setSiteLevelLoading(false);
        }
    };

    // Association Count state
    const [associationCount, setAssociationCount] = useState<number | null>(null);
    const [associationCountLoading, setAssociationCountLoading] = useState(false);
    const [associationCountError, setAssociationCountError] = useState<string | null>(null);
    // Fetch association count
    const fetchAssociationCount = async () => {
        setAssociationCountLoading(true);
        setAssociationCountError(null);
        try {
            const url = getFullUrl('/pms/admin/snag_checklists/survey_details.json');
            const urlWithParams = new URL(url);
            urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
            urlWithParams.searchParams.append('analytics', 'true');
            urlWithParams.searchParams.append('association_count', 'true');
            // Always pass empty values for from_date and to_date to get all records
            urlWithParams.searchParams.append('from_date', '');
            urlWithParams.searchParams.append('to_date', '');
            
            const response = await fetch(urlWithParams.toString());
            if (!response.ok) throw new Error('Failed to fetch association count');
            const data = await response.json();
            console.log('Association Count API response:', data);
            const total = Array.isArray(data.association_count)
                ? data.association_count.reduce((sum, item) => sum + (item.association_count || 0), 0)
                : 0;
            setAssociationCount(total);
        } catch (error) {
            setAssociationCountError(error instanceof Error ? error.message : 'Failed to fetch association count');
            setAssociationCount(0);
        } finally {
            setAssociationCountLoading(false);
        }
    };
    const [surveyStatus, setSurveyStatus] = useState<SurveyStatusData | null>(null);
    const [surveyDistributions, setSurveyDistributions] = useState<SurveyDistributions | null>(null);
    const [typeWiseSurveys, setTypeWiseSurveys] = useState<TypeWiseSurveys | null>(null);
    const [categoryWiseSurveys, setCategoryWiseSurveys] = useState<CategoryWiseSurveys | null>(null);
    // Fetch company level data
    const fetchCompanyLevel = async () => {
        setCompanyLevelLoading(true);
        setCompanyLevelError(null);
        try {
            const url = getFullUrl(API_CONFIG.ENDPOINTS.SURVEY_DETAILS);
            const options = getAuthenticatedFetchOptions();
            const urlWithParams = new URL(url);
            if (siteId) urlWithParams.searchParams.append('site_id', String(siteId));
            urlWithParams.searchParams.append('analytics', 'true');
            urlWithParams.searchParams.append('company_level', 'true');
            const response = await fetch(urlWithParams.toString(), options);
            if (!response.ok) throw new Error('Failed to fetch company level data');
            const data = await response.json();
            setCompanyLevelValue(data.company_level?.total_survey ?? 0);
        } catch (error) {
            setCompanyLevelError(error instanceof Error ? error.message : 'Failed to fetch company level data');
            setCompanyLevelValue(0);
        } finally {
            setCompanyLevelLoading(false);
        }
    };

    // Top Surveys state
    const [topSurveys, setTopSurveys] = useState<{ id: number; name: string }[]>([]);
    const [topSurveysLoading, setTopSurveysLoading] = useState(false);
    const [topSurveysError, setTopSurveysError] = useState<string | null>(null);
    // Fetch top surveys
    const fetchTopSurveys = async () => {
        setTopSurveysLoading(true);
        setTopSurveysError(null);
        try {
            const url = getFullUrl('/pms/admin/snag_checklists/survey_details.json');
            const urlWithParams = new URL(url);
            urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
            urlWithParams.searchParams.append('analytics', 'true');
            urlWithParams.searchParams.append('top_surveys', 'true');
            // Always pass empty values for from_date and to_date to get all records
            urlWithParams.searchParams.append('from_date', '');
            urlWithParams.searchParams.append('to_date', '');
            
            const response = await fetch(urlWithParams.toString());
            if (!response.ok) throw new Error('Failed to fetch top surveys');
            const data = await response.json();
            console.log('Top Surveys API response:', data);
            setTopSurveys(Array.isArray(data.top_surveys) ? data.top_surveys : []);
        } catch (error) {
            setTopSurveysError(error instanceof Error ? error.message : 'Failed to fetch top surveys');
            setTopSurveys([]);
        } finally {
            setTopSurveysLoading(false);
        }
    };

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
        'amcStatus',
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

    // Fetch survey statistics (active/inactive) for a specific surveyId
    const fetchSurveyStatistics = async () => {
        setStatisticsLoading(true);
        setStatisticsError(null);
        try {
            const url = getFullUrl('/pms/admin/snag_checklists/survey_details.json');
            const urlWithParams = new URL(url);
            urlWithParams.searchParams.append('access_token', API_CONFIG.TOKEN);
            if (siteId) urlWithParams.searchParams.append('site_id', String(siteId));
            urlWithParams.searchParams.append('analytics', 'true');
            urlWithParams.searchParams.append('survey_status', 'true');
            // Always pass empty values for from_date and to_date to get all records
            urlWithParams.searchParams.append('from_date', '');
            urlWithParams.searchParams.append('to_date', '');
            
            const response = await fetch(urlWithParams.toString());
            if (!response.ok) throw new Error('Failed to fetch survey statistics');
            const data = await response.json();
            console.log('Survey Statistics API response:', data);
            setSurveyStatistics({
                total_surveys: data.analytics?.total_surveys || 0,
                active_surveys: data.survey_status?.active_survey ?? 0,
                expired_surveys: data.survey_status?.inactive_survey ?? 0,
            });
        } catch (error) {
            setStatisticsError(error instanceof Error ? error.message : 'Failed to fetch survey statistics');
            setSurveyStatistics({ total_surveys: 0, active_surveys: 0, expired_surveys: 0 });
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
    fetchCompanyLevel();
    fetchSiteLevel();
    fetchAssociationCount();
    fetchTopSurveys();
    fetchTrendingSurvey();
    fetchCriticalQuestions();
    }, [surveyId]);


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
            // Note: fetchTopSurveys, fetchAssociationCount, fetchSiteLevel are not included here
            // because they should not be filtered by date (always use empty from_date and to_date)
            // Note: fetchCriticalQuestions and fetchTrendingSurvey are also not included here 
            // because they should not be filtered by date
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
        // Trending Survey Card
        const trendingSurveyCard = (
            <SortableChartItem key="trendingSurvey" id="trendingSurvey">
                {trendingSurveyLoading ? (
                    <div className="bg-white rounded-lg border border-blue-200 shadow-sm h-full flex flex-col mb-6 justify-center items-center min-h-[300px]">
                        <div className="text-center text-gray-500">Loading trending survey data...</div>
                    </div>
                ) : trendingSurveyError ? (
                    <div className="bg-white rounded-lg border border-blue-200 shadow-sm h-full flex flex-col mb-6 justify-center items-center min-h-[300px]">
                        <div className="text-center text-red-500">{trendingSurveyError}</div>
                    </div>
                ) : (
                    <TrendingSurveyAnalysisCard 
                        trendingSurvey={trendingSurvey}
                        onDownload={() => handleAnalyticsDownload('trendingSurvey')}
                    />
                )}
            </SortableChartItem>
        );
        const charts = [
            // AMC Status Overview Card
            currentSelectedTypes.includes('amcStatus') && (
                <SortableChartItem key="amcStatus" id="amcStatus">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 h-full flex flex-col mb-6">
                        <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 sm:p-6 pb-0">
                            <h3 className="text-base sm:text-lg font-bold text-black-500">Survey Response Status Overview</h3>
                        </div>
                        
                        <div className="flex-1 overflow-auto p-3 sm:p-6 pt-0">
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* ...existing code... */}
                                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="text-2xl font-bold text-green-600">{statisticsLoading ? '...' : surveyStatistics.active_surveys}</div>
                                    <div className="text-sm text-green-700 font-medium">Active</div>
                                </div>
                                <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="text-2xl font-bold text-gray-600">{statisticsLoading ? '...' : surveyStatistics.expired_surveys}</div>
                                    <div className="text-sm text-gray-700 font-medium">Inactive</div>
                                </div>
                                {/* ...existing code... */}
                                {/* <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                                    <div className="text-2xl font-bold text-red-600">{companyLevelLoading ? '...' : companyLevelValue}</div>
                                    <div className="text-sm text-red-700 font-medium">Company Level</div>
                                </div> */}
                                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="text-2xl font-bold text-purple-600">{siteLevelLoading ? '...' : siteLevelValue}</div>
                                    <div className="text-sm text-purple-700 font-medium">Total Survey</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div className="text-2xl font-bold text-yellow-600">{associationCountLoading ? '...' : associationCount}</div>
                                    <div className="text-sm text-yellow-700 font-medium">Association Count</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </SortableChartItem>
            ),
            // Only show statusDistribution card if there is chart data and we have critical questions
            // currentSelectedTypes.includes('statusDistribution') && chartStatusData && chartStatusData.length > 0 && criticalQuestions.length > 0 && (
            //     <SortableChartItem key="statusDistribution" id="statusDistribution">
            //         <SurveyAnalyticsCard
            //             title={criticalQuestions.length > 0 ? `Survey Status (${criticalQuestions.length} Critical Surveys Found)` : 'Survey Status'}
            //             type="statusDistribution"
            //             data={chartStatusData}
            //             dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
            //             onDownload={() => handleAnalyticsDownload('surveyResponses')}
            //         />
            //     </SortableChartItem>
            // ),
            // currentSelectedTypes.includes('surveyDistributions') && (
            //     <SortableChartItem key="surveyDistributions" id="surveyDistributions">
            //         <SurveyAnalyticsCard
            //             title="Survey Type Distribution"
            //             type="surveyDistributions"
            //             data={chartTypeData}
            //             dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
            //             onDownload={() => handleAnalyticsDownload('surveyDistribution')}
            //         />
            //     </SortableChartItem>
            // ),
            // currentSelectedTypes.includes('categoryWise') && (
            //     <SortableChartItem key="categoryWise" id="categoryWise">
            //         <SurveyAnalyticsCard
            //             title="Category-wise Surveys"
            //             type="categoryWise"
            //             data={categoryData}
            //             dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
            //             onDownload={() => handleAnalyticsDownload('categoryWise')}
            //         />
            //     </SortableChartItem>
            // ),
            // currentSelectedTypes.includes('typeWise') && (
            //     <SortableChartItem key="typeWise" id="typeWise">
            //         <SurveyAnalyticsCard
            //             title="Type-wise Surveys"
            //             type="typeWise"
            //             data={typeData}
            //             dateRange={{ startDate: analyticsDateRange.fromDate, endDate: analyticsDateRange.toDate }}
            //             onDownload={() => handleAnalyticsDownload('typeWise')}
            //         />
            //     </SortableChartItem>
            // ),
            // Top Survey Bar Chart
            <SortableChartItem key="topSurvey" id="topSurvey">
                <Card className="shadow-sm hover:shadow-lg transition-all duration-200 bg-white border border-gray-200 rounded-lg">
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">Top 3 Survey</CardTitle>
                            <Download
                                className="w-4 h-4 sm:w-4 sm:h-4 cursor-pointer text-[#C72030] hover:text-[#A01829] transition-colors"
                                onClick={() => {}}
                            />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="w-full overflow-x-auto">
                            {topSurveysLoading ? (
                                <div className="flex items-center justify-center h-[300px]">
                                    <div className="text-center py-8 text-gray-500">
                                        Loading...
                                    </div>
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height={300} className="min-w-[400px]">
                                    {topSurveysError ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center py-8 text-gray-500">
                                                {topSurveysError}
                                            </div>
                                        </div>
                                    ) : topSurveys.length === 0 ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center py-8 text-gray-500">
                                                No data available
                                            </div>
                                        </div>
                                    ) : (
                                        <BarChart
                                            data={topSurveys.map((survey, idx) => ({
                                                name: survey.name,
                                                value: topSurveys.length - idx, // Higher rank = bigger bar
                                            }))}
                                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }} // Reduced bottom margin
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
                                            <XAxis
                                                dataKey="name"
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                                tick={{
                                                    fill: '#374151',
                                                    fontSize: 10
                                                }}
                                                className="text-xs"
                                            />
                                            <YAxis tick={{
                                                fill: '#374151',
                                                fontSize: 10
                                            }} />
                                            <Tooltip
                                                content={({ active, payload, label }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                                                <p className="font-semibold text-gray-800 ">{label}</p>
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between items-center">
                                                                        <span className="text-[#C72030] font-medium">Rank:</span>
                                                                        <span className="text-gray-700">{payload[0]?.value || 0}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Bar dataKey="value" fill="#C72030" name="Rank" maxBarSize={70} /> // Added maxBarSize
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </SortableChartItem>,
            trendingSurveyCard,
            // Critical Survey Analysis Card
            <SortableChartItem key="criticalSurvey" id="criticalSurvey">
                <CriticalSurveyAnalysisCard
                    criticalQuestions={criticalQuestions}
                    loading={criticalQuestionsLoading}
                    error={criticalQuestionsError}
                    onDownload={() => handleAnalyticsDownload('criticalSurvey')}
                />
            </SortableChartItem>,
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
