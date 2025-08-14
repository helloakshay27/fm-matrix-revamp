import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">
          Visitors Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-[#C72030]">{totalVisitors}</div>
            <div className="text-sm text-red-700 font-medium">Total Visitors</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600">{approvedVisitors}</div>
            <div className="text-sm text-green-700 font-medium">Approved</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">{pendingVisitors}</div>
            <div className="text-sm text-orange-700 font-medium">Pending</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-2xl font-bold text-red-600">{rejectedVisitors}</div>
            <div className="text-sm text-red-700 font-medium">Rejected</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};