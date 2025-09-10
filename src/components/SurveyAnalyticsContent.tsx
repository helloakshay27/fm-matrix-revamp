import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { SurveyAnalyticsCard } from './SurveyAnalyticsCard';
import { SurveyAnalyticsFilterDialog } from './SurveyAnalyticsFilterDialog';
import { RecentSurveysSidebar }  from './RecentSurveysSidebar';
import { SurveySelector } from './SurveySelector';
import { SurveyStatusOverviewCard } from './SurveyStatusOverviewCard';
import { useToast } from '@/hooks/use-toast';
import { surveyAnalyticsAPI, SurveyAnalyticsResponse } from '@/services/surveyAnalyticsAPI';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Card Wrapper Component
interface SortableCardProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

const SortableCard: React.FC<SortableCardProps> = ({ id, children, className }) => {
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
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`touch-none ${className}`}
    >
      {children}
    </div>
  );
};

export const SurveyAnalyticsContent = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [visibleSections, setVisibleSections] = useState<string[]>(['overview', 'statusWise', 'typeWise', 'recentSurveys']);
  const [surveyAnalyticsData, setSurveyAnalyticsData] = useState<SurveyAnalyticsResponse | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const { toast } = useToast();

  // Function to get default dates
  const getDefaultDates = () => {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    return {
      start: oneYearAgo.toISOString().split('T')[0],
      end: today.toISOString().split('T')[0]
    };
  };

  // Fetch survey analytics data from API
  const fetchSurveyAnalytics = useCallback(async () => {
    setApiLoading(true);
    try {
      const data = await surveyAnalyticsAPI.getRealSurveyAnalytics();
      setSurveyAnalyticsData(data);
      console.log('Survey Analytics Data:', data);
    } catch (error) {
      console.error('Failed to fetch survey analytics:', error);
      toast({
        title: "Error",
        description: "Failed to load survey analytics data",
        variant: "destructive"
      });
    } finally {
      setApiLoading(false);
    }
  }, [toast]);

  // Auto-apply default dates on component mount
  useEffect(() => {
    const defaultDates = getDefaultDates();
    const formattedStartDate = new Date(defaultDates.start).toLocaleDateString('en-GB');
    const formattedEndDate = new Date(defaultDates.end).toLocaleDateString('en-GB');
    
    setDateRange({
      startDate: formattedStartDate,
      endDate: formattedEndDate
    });

    // Fetch survey analytics data
    fetchSurveyAnalytics();
  }, [fetchSurveyAnalytics]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Card items with unique IDs for drag and drop
  const [cardItems, setCardItems] = useState([
    { id: 'survey-status-overview', type: 'overview' },
    { id: 'status-wise', type: 'statusWise' },
    { id: 'type-wise', type: 'typeWise' },
    { id: 'survey-summary', type: 'summary' }
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCardItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleFilterApply = (startDate: string, endDate: string) => {
    setDateRange({
      startDate,
      endDate
    });
    // TODO: Fetch survey data with new date range
  };

  const handleSurveySelectionChange = (newVisibleSections: string[]) => {
    setVisibleSections(newVisibleSections);
  };

  // Transform API data for charts
  const getStatusWiseData = () => {
    if (!surveyAnalyticsData?.analytics) return [];
    
    const { positive_responses, negative_responses, neutral_responses } = surveyAnalyticsData.analytics;
    return [
      { name: 'Positive', value: positive_responses, color: '#22C55E' },
      { name: 'Negative', value: negative_responses, color: '#EF4444' },
      { name: 'Neutral', value: neutral_responses, color: '#F59E0B' }
    ];
  };

  const getTypeWiseData = () => {
    if (!surveyAnalyticsData?.analytics?.top_surveys) return [];
    
    return surveyAnalyticsData.analytics.top_surveys.map((survey, index) => {
      const colors = ['#C72030', '#c6b692', '#d8dcdd', '#8B5CF6', '#10B981'];
      return {
        name: survey.survey_name,
        value: survey.response_count,
        color: colors[index % colors.length]
      };
    });
  };

  const getSummaryData = () => {
    if (!surveyAnalyticsData?.analytics) return null;
    
    const { total_surveys, total_responses, complaints_count } = surveyAnalyticsData.analytics;
    const response_rate = total_surveys > 0 ? ((total_responses / total_surveys) * 100).toFixed(1) : '0';
    
    return {
      total_surveys,
      total_responses,
      complaints_count,
      response_rate: `${response_rate}%`
    };
  };

  // Render card function
  const renderCard = (item: { id: string; type: string }) => {
    // Only render if the card type is visible
    if (!visibleSections.includes(item.type)) {
      return null;
    }

    const commonDateRange = dateRange.startDate ? {
      startDate: new Date(dateRange.startDate.split('/').reverse().join('-')),
      endDate: new Date(dateRange.endDate.split('/').reverse().join('-'))
    } : undefined;

    switch (item.type) {
      case 'overview':
        return (
          <SurveyStatusOverviewCard
            dateRange={commonDateRange}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200"
          />
        );
      case 'statusWise':
        return (
          <SurveyAnalyticsCard
            title="Survey Status Distribution"
            data={getStatusWiseData()}
            type="statusDistribution"
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
            dateRange={commonDateRange}
            // onDownload={() => {
            //   console.log('Download status distribution');
            //   toast({
            //     title: "Success",
            //     description: "Survey status distribution data downloaded successfully"
            //   });
            // }}
          />
        );
      case 'typeWise':
        return (
          <SurveyAnalyticsCard
            title="Top Surveys"
            data={getTypeWiseData()}
            type="surveyDistributions"
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
            dateRange={commonDateRange}
            // onDownload={() => {
            //   console.log('Download type distribution');
            //   toast({
            //     title: "Success",
            //     description: "Top surveys data downloaded successfully"
            //   });
            // }}
          />
        );
      case 'summary': {
        const summaryData = getSummaryData();
        if (!summaryData) {
          return (
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-200">
              <h3 className="text-lg font-bold text-[#C72030] mb-4">Survey Summary</h3>
              <div className="text-center py-8 text-gray-500">
                {apiLoading ? 'Loading survey data...' : 'No survey data available'}
              </div>
            </div>
          );
        }
        
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-200">
            <h3 className="text-lg font-bold text-[#C72030] mb-4">Survey Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xl font-bold text-blue-600">{summaryData.total_surveys}</div>
                <div className="text-sm text-blue-700 font-medium">Total Surveys</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xl font-bold text-green-600">{summaryData.total_responses}</div>
                <div className="text-sm text-green-700 font-medium">Total Responses</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-xl font-bold text-purple-600">{summaryData.response_rate}</div>
                <div className="text-sm text-purple-700 font-medium">Response Rate</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-xl font-bold text-red-600">{summaryData.complaints_count}</div>
                <div className="text-sm text-red-700 font-medium">Complaints</div>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      {/* Header with Filter and Survey Selector */}
      <div className="flex justify-end items-center gap-2">
        <Button
          onClick={() => setIsFilterOpen(true)}
          variant="outline"
          className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50"
          disabled={isLoading}
        >
          <Filter className="w-4 h-4" />
          {isLoading && (
            <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
          )}
        </Button>
        <SurveySelector onSelectionChange={handleSurveySelectionChange} />
      </div>

      {/* Main Analytics Layout with Drag and Drop */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 min-h-[calc(100vh-200px)]">
        {/* Left Section - Sortable Charts */}
        <div className={`${visibleSections.includes('recentSurveys') ? 'xl:col-span-8' : 'xl:col-span-12'}`}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={cardItems.filter(item => visibleSections.includes(item.type)).map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 sm:space-y-6">
                {cardItems
                  .filter(item => visibleSections.includes(item.type))
                  .map((item) => {
                    const renderedCard = renderCard(item);
                    return renderedCard ? (
                      <SortableCard
                        key={item.id}
                        id={item.id}
                        className="w-full"
                      >
                        {renderedCard}
                      </SortableCard>
                    ) : null;
                  })}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right Sidebar - Recent Surveys - Only show if selected */}
       
        {visibleSections.includes('recentSurveys') && (
           <div className="xl:col-span-4 order-first xl:order-last">
            <RecentSurveysSidebar />
          </div>
        )}
      </div>

      {/* Filter Dialog */}
      <SurveyAnalyticsFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleFilterApply}
      />
    </div>
  );
};
