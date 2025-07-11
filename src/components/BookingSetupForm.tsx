
import React from 'react';
import { Settings } from 'lucide-react';

interface BookingSetupFormProps {
  onClose: () => void;
}

export const BookingSetupForm: React.FC<BookingSetupFormProps> = ({ onClose }) => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-900">Booking Setup Form</h1>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-600">Booking setup form functionality will be implemented here.</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
