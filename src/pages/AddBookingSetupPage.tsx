import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingSetupForm } from "@/components/BookingSetupForm";

export const AddBookingSetupPage = () => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/vas/booking/setup');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BookingSetupForm onClose={handleClose} />
    </div>
  );
};