import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingSetupForm } from '@/components/BookingSetupForm';

export const AddBookingSetupPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/vas/booking/setup');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <p className="text-[#1a1a1a] opacity-70 mb-2">Booking Setup &gt; Add Booking Setup</p>
        <h1 className="text-2xl font-bold text-[#1a1a1a]">ADD BOOKING SETUP</h1>
      </div>
      <BookingSetupForm onClose={handleClose} />
    </div>
  );
};