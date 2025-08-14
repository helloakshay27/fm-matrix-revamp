import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download } from 'lucide-react';

interface VisitorStatusOverviewCardProps {
  totalVisitors: number;
  approvedVisitors: number;
  pendingVisitors: number;
  rejectedVisitors: number;
  className?: string;
}

export const VisitorStatusOverviewCard: React.FC<VisitorStatusOverviewCardProps> = ({
  totalVisitors,
  approvedVisitors,
  pendingVisitors,
  rejectedVisitors,
  className = ""
}) => {
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="relative text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <Download
              className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-[#C72030] hover:text-[#A01829] transition-colors"
              onClick={() => handleDownload('total')}
            />
            <div className="text-2xl font-bold text-[#C72030]">{totalVisitors}</div>
            <div className="text-sm text-red-700 font-medium">Total Visitors</div>
          </div>
          <div className="relative text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <Download
              className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-green-600 hover:text-green-700 transition-colors"
              onClick={() => handleDownload('approved')}
            />
            <div className="text-2xl font-bold text-green-600">{approvedVisitors}</div>
            <div className="text-sm text-green-700 font-medium">Approved</div>
          </div>
          <div className="relative text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <Download
              className="absolute top-3 right-3 w-4 h-4 cursor-pointer text-orange-600 hover:text-orange-700 transition-colors"
              onClick={() => handleDownload('pending')}
            />
            <div className="text-2xl font-bold text-orange-600">{pendingVisitors}</div>
            <div className="text-sm text-orange-700 font-medium">Pending</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};