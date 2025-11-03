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
        <CardTitle className="text-base sm:text-lg font-bold text-[#C72030]">
          Proactive/Reactive Tickets
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Proactive Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 text-center">Proactive</h4>
            
            {/* Proactive Open Card */}
            <Card className="bg-[#F6F4EE]">
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  <div>
                    <p className="text-lg font-semibold text-[#C72030] text-center">
                      {proactiveOpenTickets}
                    </p>
                    <p className="text-sm text-gray-600 text-center">Open</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Proactive Closed Card */}
            <Card className="bg-[#F6F4EE]">
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  <div>
                    <p className="text-lg font-semibold text-[#C72030] text-center">
                      {proactiveClosedTickets}
                    </p>
                    <p className="text-sm text-gray-600 text-center">Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reactive Section */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700 text-center">Reactive</h4>
            
            {/* Reactive Open Card */}
            <Card className="bg-[#F6F4EE]">
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  <div>
                    <p className="text-lg font-semibold text-[#C72030] text-center">
                      {reactiveOpenTickets}
                    </p>
                    <p className="text-sm text-gray-600 text-center">Open</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reactive Closed Card */}
            <Card className="bg-[#F6F4EE]">
              <CardContent className="p-4">
                <div className="flex items-center justify-center">
                  <div>
                    <p className="text-lg font-semibold text-[#C72030] text-center">
                      {reactiveClosedTickets}
                    </p>
                    <p className="text-sm text-gray-600 text-center">Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
