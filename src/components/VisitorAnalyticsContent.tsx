import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { VisitorAnalyticsCard } from './VisitorAnalyticsCard';
import { VisitorAnalyticsFilterDialog } from './VisitorAnalyticsFilterDialog';
import { RecentVisitorsSidebar } from './RecentVisitorsSidebar';
import { VisitorSelector } from './VisitorSelector';

export const VisitorAnalyticsContent = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterApply = (newDateRange: { startDate: string; endDate: string }) => {
    setDateRange(newDateRange);
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1000);
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

  const statusWiseData = [
    { name: 'Approved', value: 85, color: '#22C55E' },
    { name: 'Pending', value: 10, color: '#F59E0B' },
    { name: 'Rejected', value: 5, color: '#EF4444' }
  ];

  const locationWiseData = [
    { location: 'Reception', count: 85 },
    { location: 'Main Gate', count: 62 },
    { location: 'Side Entrance', count: 45 },
    { location: 'Parking', count: 35 },
    { location: 'Emergency Exit', count: 18 }
  ];

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

      {/* Main Analytics Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 min-h-[calc(100vh-200px)]">
        {/* Left Section - Charts */}
        <div className="xl:col-span-8 space-y-4 sm:space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C72030]">{visitorStats.totalVisitors}</div>
                <div className="text-sm text-gray-600 font-medium">Total Visitors</div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{visitorStats.approvedVisitors}</div>
                <div className="text-sm text-gray-600 font-medium">Approved</div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{visitorStats.pendingVisitors}</div>
                <div className="text-sm text-gray-600 font-medium">Pending</div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{visitorStats.rejectedVisitors}</div>
                <div className="text-sm text-gray-600 font-medium">Rejected</div>
              </div>
            </div>
          </div>

          {/* Analytics Charts */}
          <div className="space-y-4 sm:space-y-6">
            {/* First Row - Purpose Wise and Status Wise */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <VisitorAnalyticsCard
                title="Purpose Wise Visitors"
                data={purposeWiseData}
                type="purposeWise"
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
                dateRange={dateRange.startDate ? {
                  startDate: new Date(dateRange.startDate.split('/').reverse().join('-')),
                  endDate: new Date(dateRange.endDate.split('/').reverse().join('-'))
                } : undefined}
              />

              <VisitorAnalyticsCard
                title="Status Wise Distribution"
                data={statusWiseData}
                type="statusWise"
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
                dateRange={dateRange.startDate ? {
                  startDate: new Date(dateRange.startDate.split('/').reverse().join('-')),
                  endDate: new Date(dateRange.endDate.split('/').reverse().join('-'))
                } : undefined}
              />
            </div>

            {/* Second Row - Hourly Trend */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <VisitorAnalyticsCard
                title="Hourly Visitor Trend"
                data={hourlyTrendData}
                type="hourlyTrend"
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
                dateRange={dateRange.startDate ? {
                  startDate: new Date(dateRange.startDate.split('/').reverse().join('-')),
                  endDate: new Date(dateRange.endDate.split('/').reverse().join('-'))
                } : undefined}
              />
            </div>

            {/* Third Row - Location Wise */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <VisitorAnalyticsCard
                title="Location Wise Visitors"
                data={locationWiseData}
                type="locationWise"
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
                dateRange={dateRange.startDate ? {
                  startDate: new Date(dateRange.startDate.split('/').reverse().join('-')),
                  endDate: new Date(dateRange.endDate.split('/').reverse().join('-'))
                } : undefined}
              />
            </div>

            {/* Fourth Row - Visitor Summary */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
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
            </div>
          </div>
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