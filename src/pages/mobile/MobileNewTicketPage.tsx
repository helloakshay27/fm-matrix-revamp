import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileNewTicketPage as NewTicketForm } from '@/components/mobile/MobileNewTicketPage';

export const MobileNewTicketPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <NewTicketForm
      onBack={() => navigate('/mobile/tickets')}
      onSuccess={() => navigate('/mobile/tickets')}
    />
  );
};
