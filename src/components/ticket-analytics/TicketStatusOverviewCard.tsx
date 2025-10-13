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
          {/* Open Tickets Card */}
          <Card className="bg-[#F6F4EE] flex-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div>
                  <p className="text-xl font-semibold text-[#C72030] text-center">
                    {openTickets}
                  </p>
                  <p className="text-sm text-gray-600 text-center">Open</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Closed Tickets Card */}
          <Card className="bg-[#F6F4EE] flex-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div>
                  <p className="text-xl font-semibold text-[#C72030] text-center">
                    {closedTickets}
                  </p>
                  <p className="text-sm text-gray-600 text-center">Closed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
