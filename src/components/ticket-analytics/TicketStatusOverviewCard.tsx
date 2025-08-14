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
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">
          Tickets Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex-1">
            <div className="text-2xl font-bold text-yellow-600">{openTickets}</div>
            <div className="text-sm text-yellow-700 font-medium">Open</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 flex-1">
            <div className="text-2xl font-bold text-green-600">{closedTickets}</div>
            <div className="text-sm text-green-700 font-medium">Closed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
