import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { visitorSummaryAPI } from '@/services/visitorSummaryAPI';
import { useToast } from '@/hooks/use-toast';

interface VisitorStatusOverviewCardProps {
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  className?: string;
}

export const VisitorStatusOverviewCard: React.FC<VisitorStatusOverviewCardProps> = ({
  dateRange,
  className = ""
}) => {
  const { toast } = useToast();
  const [visitorData, setVisitorData] = useState({
    totalVisitors: 0,
    expectedVisitors: 0,
    unexpectedVisitors: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (dateRange) {
      fetchVisitorSummary();
    }
  }, [dateRange]);

  const fetchVisitorSummary = async () => {
    if (!dateRange) return;
    
    setIsLoading(true);
    try {
      const fromDate = `${dateRange.startDate.getMonth() + 1}/${dateRange.startDate.getDate()}/${dateRange.startDate.getFullYear()}`;
      const toDate = `${dateRange.endDate.getMonth() + 1}/${dateRange.endDate.getDate()}/${dateRange.endDate.getFullYear()}`;
      
      const response = await visitorSummaryAPI.getVisitorSummary(fromDate, toDate);
      
      if (response.success) {
        setVisitorData({
          totalVisitors: response.summary.totalVisitors,
          expectedVisitors: response.summary.expectedVisitors,
          unexpectedVisitors: response.summary.unexpectedVisitors
        });
      }
    } catch (error) {
      console.error('Error fetching visitor summary:', error);
      toast({
        title: "Error",
        description: "Failed to fetch visitor summary data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (type: string) => {
    console.log(`Downloading ${type} visitors data`);
    // TODO: Implement download functionality
  };

  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">
          Visitors Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-center text-gray-500">Loading...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="relative text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <Download
                className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-[#C72030] hover:text-[#A01829] transition-colors"
                onClick={() => handleDownload('total')}
              />
              <div className="text-2xl font-bold text-[#C72030]">{visitorData.totalVisitors}</div>
              <div className="text-sm text-red-700 font-medium">Total Visitors</div>
            </div>
            <div className="relative text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <Download
                className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-green-600 hover:text-green-700 transition-colors"
                onClick={() => handleDownload('expected')}
              />
              <div className="text-2xl font-bold text-green-600">{visitorData.expectedVisitors}</div>
              <div className="text-sm text-green-700 font-medium">Expected</div>
            </div>
            <div className="relative text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <Download
                className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-orange-600 hover:text-orange-700 transition-colors"
                onClick={() => handleDownload('unexpected')}
              />
              <div className="text-2xl font-bold text-orange-600">{visitorData.unexpectedVisitors}</div>
              <div className="text-sm text-orange-700 font-medium">Unexpected</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};