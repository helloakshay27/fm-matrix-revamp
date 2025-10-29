import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
    <Card className={`bg-card border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-base sm:text-lg font-bold text-[#1A1A1A]">
          Ticket Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {/* Open Tickets Card */}
          <Card className="bg-[#F6F4EE] border border-gray-100 rounded-lg flex-1">
            <CardContent className="p-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#F6F4EE]">
                  <AlertCircle className="w-6 h-6 text-[#C72030]" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold ">{openTickets}</div>
                  <div className="text-sm text-gray-700 mt-1">Open</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Closed Tickets Card */}
          <Card className="bg-[#F6F4EE] border border-gray-100 rounded-lg flex-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-[#F6F4EE]">
                  <CheckCircle className="w-6 h-6 text-[#C72030]" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold ">{closedTickets}</div>
                  <div className="text-sm text-gray-700 mt-1">Closed</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
