import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AMCAnalyticsFilterDialog } from '@/components/AMCAnalyticsFilterDialog';
import { AMCComplianceReportCard } from '@/components/AMCComplianceReportCard';
import { amcAnalyticsAPI, type AMCComplianceReport as AMCComplianceReportData } from '@/services/amcAnalyticsAPI';
import { amcAnalyticsDownloadAPI } from '@/services/amcAnalyticsDownloadAPI';
import { toast } from 'sonner';

export const AMCComplianceReportPage = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [complianceData, setComplianceData] = useState<AMCComplianceReportData | null>(null);

  // Set default dates: last year to today
  const getDefaultDateRange = () => {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    const formatDate = (date: Date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    return {
      startDate: formatDate(lastYear),
      endDate: formatDate(today)
    };
  };

  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>(getDefaultDateRange());

  // Convert date string from DD/MM/YYYY to Date object
  const convertDateStringToDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  // Fetch compliance data
  const fetchComplianceData = async (startDate: Date, endDate: Date) => {
    setLoading(true);
    try {
      const data = await amcAnalyticsAPI.getAMCComplianceReport(startDate, endDate);
      setComplianceData(data);
    } catch (error) {
      console.error('Error fetching AMC compliance data:', error);
      toast.error('Failed to fetch AMC compliance data');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter apply
  const handleFilterApply = (filters: { startDate: string; endDate: string }) => {
    setDateRange(filters);
    const startDate = convertDateStringToDate(filters.startDate);
    const endDate = convertDateStringToDate(filters.endDate);
    fetchComplianceData(startDate, endDate);
  };

  // Load data on component mount
  useEffect(() => {
    const defaultRange = getDefaultDateRange();
    const startDate = convertDateStringToDate(defaultRange.startDate);
    const endDate = convertDateStringToDate(defaultRange.endDate);
    fetchComplianceData(startDate, endDate);
  }, []);

  return (
    <div className="p-2 sm:p-4 lg:p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/maintenance/amc')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to AMC Dashboard
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">AMC Compliance Report</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-white border-gray-300 hover:bg-gray-50"
            disabled={loading}
          >
            <Filter className="w-4 h-4" />
            {loading && (
              <span className="text-sm text-gray-500 animate-pulse">Loading...</span>
            )}
          </Button>
          
          {dateRange.startDate && dateRange.endDate && (
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-md">
              {dateRange.startDate} - {dateRange.endDate}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Loading compliance data...</div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          <AMCComplianceReportCard
            data={complianceData}
            onDownload={async () => {
              const startDate = convertDateStringToDate(dateRange.startDate);
              const endDate = convertDateStringToDate(dateRange.endDate);
              await amcAnalyticsDownloadAPI.downloadAMCComplianceReport(startDate, endDate);
            }}
          />
        </div>
      )}

      {/* Filter Dialog */}
      <AMCAnalyticsFilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApplyFilters={handleFilterApply}
      />
    </div>
  );
};
