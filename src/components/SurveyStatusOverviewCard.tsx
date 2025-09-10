import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { surveyAnalyticsAPI, SurveyAnalyticsResponse } from '@/services/surveyAnalyticsAPI';

interface SurveyStatusOverviewCardProps {
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  className?: string;
}

export const SurveyStatusOverviewCard: React.FC<SurveyStatusOverviewCardProps> = ({
  dateRange,
  className = ""
}) => {
  const { toast } = useToast();
  const [surveyData, setSurveyData] = useState<SurveyAnalyticsResponse['analytics'] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSurveySummary = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await surveyAnalyticsAPI.getRealSurveyAnalytics();
      setSurveyData(response.analytics);
      console.log('Survey Overview Data:', response.analytics);
    } catch (error) {
      console.error('Error fetching survey summary:', error);
      toast({
        title: "Error",
        description: "Failed to fetch survey summary data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSurveySummary();
  }, [fetchSurveySummary]);

  const handleDownload = async (type: string) => {
    if (!surveyData) {
      toast({
        title: "Error",
        description: "No data available to download",
        variant: "destructive"
      });
      return;
    }

    try {
      // Mock download functionality
      await new Promise(resolve => setTimeout(resolve, 1000));

      const typeLabels: { [key: string]: string } = {
        total_surveys: 'Total Surveys',
        total_responses: 'Total Responses',
        positive_responses: 'Positive Responses',
        negative_responses: 'Negative Responses',
        neutral_responses: 'Neutral Responses',
        complaints_count: 'Complaints'
      };

      toast({
        title: "Success",
        description: `${typeLabels[type] || type} data downloaded successfully`
      });
    } catch (error) {
      console.error(`Error downloading ${type} data:`, error);
      toast({
        title: "Error",
        description: `Failed to download ${type} data`,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">
          Survey Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">Loading...</div>
          </div>
        ) : !surveyData ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">No data available</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            <div className="relative text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              {/* <Download
                className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-blue-600 hover:text-blue-700 transition-colors"
                onClick={() => handleDownload('total_surveys')}
              /> */}
              <div className="text-2xl font-bold text-blue-600">{surveyData.total_surveys}</div>
              <div className="text-sm text-blue-700 font-medium">Total Surveys</div>
            </div>
            
            <div className="relative text-center p-4 bg-green-50 rounded-lg border border-green-200">
              {/* <Download
                className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-green-600 hover:text-green-700 transition-colors"
                onClick={() => handleDownload('total_responses')}
              /> */}
              <div className="text-2xl font-bold text-green-600">{surveyData.total_responses}</div>
              <div className="text-sm text-green-700 font-medium">Total Responses</div>
            </div>
            
            <div className="relative text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              {/* <Download
                className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-emerald-600 hover:text-emerald-700 transition-colors"
                onClick={() => handleDownload('positive_responses')}
              /> */}
              <div className="text-2xl font-bold text-emerald-600">{surveyData.positive_responses}</div>
              <div className="text-sm text-emerald-700 font-medium">Positive Responses</div>
            </div>
            
            <div className="relative text-center p-4 bg-red-50 rounded-lg border border-red-200">
              {/* <Download
                className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-red-600 hover:text-red-700 transition-colors"
                onClick={() => handleDownload('negative_responses')}
              /> */}
              <div className="text-2xl font-bold text-red-600">{surveyData.negative_responses}</div>
              <div className="text-sm text-red-700 font-medium">Negative Responses</div>
            </div>
            
            <div className="relative text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              {/* <Download
                className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-yellow-600 hover:text-yellow-700 transition-colors"
                onClick={() => handleDownload('neutral_responses')}
              /> */}
              <div className="text-2xl font-bold text-yellow-600">{surveyData.neutral_responses}</div>
              <div className="text-sm text-yellow-700 font-medium">Neutral Responses</div>
            </div>
            
            <div className="relative text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              {/* <Download
                className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-orange-600 hover:text-orange-700 transition-colors"
                onClick={() => handleDownload('complaints_count')}
              /> */}
              <div className="text-2xl font-bold text-orange-600">{surveyData.complaints_count}</div>
              <div className="text-sm text-orange-700 font-medium">Complaints</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
