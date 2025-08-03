import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProactiveReactiveCardProps {
  proactiveOpenTickets: number;
  proactiveClosedTickets: number;
  reactiveOpenTickets: number;
  reactiveClosedTickets: number;
  className?: string;
}

export const ProactiveReactiveCard: React.FC<ProactiveReactiveCardProps> = ({
  proactiveOpenTickets,
  proactiveClosedTickets,
  reactiveOpenTickets,
  reactiveClosedTickets,
  className = ""
}) => {
  return (
    <Card className={`shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-sm sm:text-lg font-bold text-[#C72030] leading-tight">
          Proactive/Reactive Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 text-center">Proactive</h4>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-xl font-bold text-blue-600">{proactiveOpenTickets}</div>
              <div className="text-xs text-blue-700 font-medium">Open</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-xl font-bold text-gray-600">{proactiveClosedTickets}</div>
              <div className="text-xs text-gray-700 font-medium">Closed</div>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 text-center">Reactive</h4>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-xl font-bold text-red-600">{reactiveOpenTickets}</div>
              <div className="text-xs text-red-700 font-medium">Open</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600">{reactiveClosedTickets}</div>
              <div className="text-xs text-green-700 font-medium">Closed</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
