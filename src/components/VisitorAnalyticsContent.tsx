import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { VisitorAnalyticsCard } from './VisitorAnalyticsCard';
import { VisitorAnalyticsFilterDialog } from './VisitorAnalyticsFilterDialog';
import { RecentVisitorsSidebar } from './RecentVisitorsSidebar';
import { VisitorSelector } from './VisitorSelector';
import { VisitorStatusOverviewCard } from './VisitorStatusOverviewCard';
import { visitorComparisonAPI, VisitorComparisonResponse } from '@/services/visitorComparisonAPI';
import { useToast } from '@/hooks/use-toast';
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

export const VisitorAnalyticsContent = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [visitorComparisonData, setVisitorComparisonData] = useState<VisitorComparisonResponse | null>(null);
  const { toast } = useToast();

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
    { id: 'visitor-status-overview', type: 'overview' },
    { id: 'purpose-wise', type: 'purposeWise' },
    { id: 'status-wise', type: 'statusWise' },
    { id: 'hourly-trend', type: 'hourlyTrend' },
    { id: 'location-wise', type: 'locationWise' },
    { id: 'visitor-summary', type: 'summary' }
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

  const fetchVisitorComparison = async (fromDate: string, toDate: string) => {
    try {
      setIsLoading(true);
      const data = await visitorComparisonAPI.getVisitorComparison(fromDate, toDate);
      setVisitorComparisonData(data);
    } catch (error) {
      console.error('Error fetching visitor comparison:', error);
      toast({
        title: "Error",
        description: "Failed to fetch visitor comparison data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterApply = (newDateRange: { startDate: string; endDate: string }) => {
    setDateRange(newDateRange);
    if (newDateRange.startDate && newDateRange.endDate) {
      fetchVisitorComparison(newDateRange.startDate, newDateRange.endDate);
    }
  };

  // Mock data - in real app this would come from API
  const visitorStats = {
    totalVisitors: 245,
    approvedVisitors: 208,
    pendingVisitors: 24,
    rejectedVisitors: 13
  };

  const purposeWiseData = [
    { purpose: 'Meeting', count: 85, percentage: 34.7 },
    { purpose: 'Personal', count: 52, percentage: 21.2 },
    { purpose: 'Delivery', count: 38, percentage: 15.5 },
    { purpose: 'Maintenance', count: 35, percentage: 14.3 },
    { purpose: 'Others', count: 35, percentage: 14.3 }
  ];

  const hourlyTrendData = [
    { hour: '9:00', visitors: 15 },
    { hour: '10:00', visitors: 28 },
    { hour: '11:00', visitors: 35 },
    { hour: '12:00', visitors: 22 },
    { hour: '13:00', visitors: 12 },
    { hour: '14:00', visitors: 38 },
    { hour: '15:00', visitors: 32 },
    { hour: '16:00', visitors: 25 },
    { hour: '17:00', visitors: 18 }
  ];

  // Status wise data from API
  const getStatusWiseData = () => {
    if (!visitorComparisonData?.comparison) {
      return [
        { name: 'Support Staff', value: 0, color: '#22C55E' },
        { name: 'Guest Visitors', value: 0, color: '#00B4D8' }
      ];
    }

    return [
      { 
        name: 'Support Staff', 
        value: visitorComparisonData.comparison.supportStaffVisitors, 
        color: '#22C55E' 
      },
      { 
        name: 'Guest Visitors', 
        value: visitorComparisonData.comparison.guestVisitors, 
        color: '#00B4D8' 
      }
    ];
  };

  const locationWiseData = [
    { location: 'Reception', count: 85 },
    { location: 'Main Gate', count: 62 },
    { location: 'Side Entrance', count: 45 },
    { location: 'Parking', count: 35 },
    { location: 'Emergency Exit', count: 18 }
  ];

  // Render card function
  const renderCard = (item: { id: string; type: string }) => {
    const commonDateRange = dateRange.startDate ? {
      startDate: new Date(dateRange.startDate.split('/').reverse().join('-')),
      endDate: new Date(dateRange.endDate.split('/').reverse().join('-'))
    } : undefined;

    switch (item.type) {
      case 'overview':
        return (
          <VisitorStatusOverviewCard
            dateRange={commonDateRange}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200"
          />
        );
      case 'purposeWise':
        return (
          <VisitorAnalyticsCard
            title="Purpose Wise Visitors"
            data={purposeWiseData}
            type="purposeWise"
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
            dateRange={commonDateRange}
          />
        );
      case 'statusWise':
        return (
          <VisitorAnalyticsCard
            title="Visitor Type Distribution"
            data={getStatusWiseData()}
            type="statusWise"
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
            dateRange={commonDateRange}
          />
        );
      case 'hourlyTrend':
        return (
          <VisitorAnalyticsCard
            title="Hourly Visitor Trend"
            data={hourlyTrendData}
            type="hourlyTrend"
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
            dateRange={commonDateRange}
          />
        );
      case 'locationWise':
        return (
          <VisitorAnalyticsCard
            title="Location Wise Visitors"
            data={locationWiseData}
            type="locationWise"
            className="bg-white border border-gray-200 rounded-lg shadow-sm"
            dateRange={commonDateRange}
          />
        );
      case 'summary':
        return null; // Visitor Summary card commented out
        /*
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-200">
            <h3 className="text-lg font-bold text-[#C72030] mb-4">Visitor Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xl font-bold text-blue-600">4.2 hrs</div>
                <div className="text-sm text-blue-700 font-medium">Average Visit Duration</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-xl font-bold text-purple-600">92%</div>
                <div className="text-sm text-purple-700 font-medium">Check-in Success Rate</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="text-xl font-bold text-indigo-600">35</div>
                <div className="text-sm text-indigo-700 font-medium">Peak Hour Visitors</div>
              </div>
            </div>
          </div>
        );
        */
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
      {/* Header with Filter and Visitor Selector */}
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
        <VisitorSelector />
      </div>

      {dateRange.startDate && dateRange.endDate && (
        <div className="text-right">
          <span className="text-sm text-gray-600">
            {dateRange.startDate} - {dateRange.endDate}
          </span>
        </div>
      )}

      {/* Main Analytics Layout with Drag and Drop */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 min-h-[calc(100vh-200px)]">
        {/* Left Section - Sortable Charts */}
        <div className="xl:col-span-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={cardItems.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4 sm:space-y-6">
                {cardItems.map((item) => (
                  <SortableCard
                    key={item.id}
                    id={item.id}
                    className="w-full"
                  >
                    {renderCard(item)}
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right Sidebar - Recent Visitors */}
        <div className="xl:col-span-4 order-first xl:order-last">
          <RecentVisitorsSidebar />
        </div>
      </div>

      {/* Filter Dialog */}
      <VisitorAnalyticsFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilter={handleFilterApply}
      />
    </div>
  );
};