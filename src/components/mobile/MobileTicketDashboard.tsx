import React, { useState } from 'react';
import { TicketResponse } from '@/services/ticketManagementAPI';
import { MobileTicketList } from './MobileTicketList';
import { MobileTicketDetails } from './MobileTicketDetails';

export const MobileTicketDashboard: React.FC = () => {
  const [selectedTicket, setSelectedTicket] = useState<TicketResponse | null>(null);
  const [view, setView] = useState<'list' | 'details'>('list');

  const handleTicketSelect = (ticket: TicketResponse) => {
    setSelectedTicket(ticket);
    setView('details');
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
    setView('list');
  };

  return (
    <div className="mobile-ticket-container md:hidden fixed inset-0 z-50 bg-white">
      {view === 'list' && (
        <MobileTicketList onTicketSelect={handleTicketSelect} />
      )}
      
      {view === 'details' && selectedTicket && (
        <MobileTicketDetails 
          ticket={selectedTicket} 
          onBack={handleBackToList} 
        />
      )}
    </div>
  );
};