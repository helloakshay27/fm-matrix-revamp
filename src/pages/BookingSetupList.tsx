
import React from 'react';
import { Settings } from 'lucide-react';

const BookingSetupList = () => {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6" />
        <h1 className="text-2xl font-bold text-gray-900">Booking Setup</h1>
      </div>
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <p className="text-gray-600">Booking setup functionality will be implemented here.</p>
        </div>
      </div>
    </div>
  );
};

export default BookingSetupList;
