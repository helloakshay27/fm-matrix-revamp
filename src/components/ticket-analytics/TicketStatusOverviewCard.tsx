import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TicketStatusOverviewCardProps {
  openTickets: number;
  closedTickets: number;
  className?: string;
}

export const TicketStatusOverviewCard: React.FC<TicketStatusOverviewCardProps> = ({
  openTickets,
  closedTickets,
  className = ""
}) => {
  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
        <CardTitle className="text-sm sm:text-base lg:text-lg font-bold text-[#C72030]">
          Tickets Status
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="flex gap-2 sm:gap-4">
          <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex-1">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{openTickets}</div>
            <div className="text-xs sm:text-sm text-yellow-700 font-medium">Open</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200 flex-1">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{closedTickets}</div>
            <div className="text-xs sm:text-sm text-green-700 font-medium">Closed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
