import React from 'react';
import { MobileTicketDashboard } from '@/components/mobile/MobileTicketDashboard';
import { useIsMobile } from '@/hooks/use-mobile';

export const MobileTicketsPage: React.FC = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    // Redirect to desktop view or show a message
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Mobile View Only
          </h1>
          <p className="text-gray-600">
            This page is designed for mobile devices. Please access this on a mobile device or resize your browser window.
          </p>
        </div>
      </div>
    );
  }

  return <MobileTicketDashboard />;
};